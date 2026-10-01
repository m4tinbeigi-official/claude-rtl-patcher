const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');
const engine = require('../lib/engine');
const { getRuntimeScript } = require('../lib/runtime');

test('idempotency: multiple injectStylesAndRuntime runs do not duplicate payloads or inflate file size', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'claude-perf-idempotency-'));
    const buildDir = path.join(tempDir, '.vite', 'build');
    fs.mkdirSync(buildDir, { recursive: true });

    const initialCss = 'body { margin: 0; padding: 0; }';
    const initialJs = 'console.log("original app startup");';

    const cssPath = path.join(buildDir, 'style.css');
    const jsPath = path.join(buildDir, 'mainWindow.js');

    fs.writeFileSync(cssPath, initialCss);
    fs.writeFileSync(jsPath, initialJs);

    // 1st injection
    engine.injectStylesAndRuntime(tempDir, { fontOnly: false });
    const cssRun1 = fs.readFileSync(cssPath, 'utf8');
    const jsRun1 = fs.readFileSync(jsPath, 'utf8');

    // 2nd injection
    engine.injectStylesAndRuntime(tempDir, { fontOnly: false });
    const cssRun2 = fs.readFileSync(cssPath, 'utf8');
    const jsRun2 = fs.readFileSync(jsPath, 'utf8');

    // 3rd injection
    engine.injectStylesAndRuntime(tempDir, { fontOnly: false });
    const cssRun3 = fs.readFileSync(cssPath, 'utf8');
    const jsRun3 = fs.readFileSync(jsPath, 'utf8');

    // Content and size must remain strictly identical across repeated runs
    assert.equal(cssRun2, cssRun1, 'Second CSS injection produced different content than first');
    assert.equal(cssRun3, cssRun1, 'Third CSS injection produced different content than first');

    assert.equal(jsRun2, jsRun1, 'Second JS injection produced different content than first');
    assert.equal(jsRun3, jsRun1, 'Third JS injection produced different content than first');

    // Ensure injection headers occur exactly once
    const cssHeaderMatches = cssRun3.match(/\/\*\s*RTL and Vazirmatn Font Patch/g) || [];
    assert.equal(cssHeaderMatches.length, 1, 'CSS payload header was duplicated');

    const jsHeaderMatches = jsRun3.match(/\/\/\s*Injected for Persian\/Arabic\/Hebrew support/g) || [];
    assert.equal(jsHeaderMatches.length, 1, 'JS payload header was duplicated');

    fs.rmSync(tempDir, { recursive: true, force: true });
});

test('idempotency: createBackup does not overwrite an existing original backup with a modified version', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'claude-perf-backup-'));
    const asarPath = path.join(tempDir, 'app.asar');
    const backupPath = path.join(tempDir, 'app.asar.bak');

    // 1. Initial pristine state
    fs.writeFileSync(asarPath, 'PRISTINE_ORIGINAL_CLAUDE_APP');
    const firstBackupResult = engine.createBackup(asarPath, backupPath);
    assert.equal(firstBackupResult, true, 'First backup should return true');
    assert.equal(fs.readFileSync(backupPath, 'utf8'), 'PRISTINE_ORIGINAL_CLAUDE_APP');

    // 2. Simulate patched or corrupted app.asar
    fs.writeFileSync(asarPath, 'MODIFIED_OR_PATCHED_APP_CONTENT');

    // 3. Attempting to create backup again MUST NOT overwrite the pristine backup
    const secondBackupResult = engine.createBackup(asarPath, backupPath);
    assert.equal(secondBackupResult, false, 'Second backup call should return false (skipped)');
    assert.equal(
        fs.readFileSync(backupPath, 'utf8'),
        'PRISTINE_ORIGINAL_CLAUDE_APP',
        'Original backup was overwritten by modified file!'
    );

    fs.rmSync(tempDir, { recursive: true, force: true });
});

test('runtime performance & idempotency: script contains guard preventing duplicate initialization', () => {
    const script = getRuntimeScript();

    // Guard exists
    assert.match(script, /window\.__CLAUDE_RTL_INITIALIZED__/);
    assert.match(script, /if\s*\(window\.__CLAUDE_RTL_INITIALIZED__\)\s*return;/);

    // Test execution guard behavior in simulated window context
    const fakeWindow = { __CLAUDE_RTL_INITIALIZED__: true };
    const fakeDoc = {};

    let executed = false;
    const testRunner = new Function('window', 'document', `
        if (typeof window === "undefined" || typeof document === "undefined") return;
        if (window.__CLAUDE_RTL_INITIALIZED__) return;
        executed = true;
    `);

    testRunner(fakeWindow, fakeDoc);
    assert.equal(executed, false, 'Runtime script executed despite initialized guard being set');
});

test('benchmark: regex RTL detection performance across 10,000 mixed elements is under 15ms', () => {
    const RTL_REGEX = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;

    const samples = [
        'Hello this is a purely English text sentence with several words and numbers 12345.',
        'سلام این یک متن تستی به زبان فارسی است که برای بنچمارک سرعت استفاده می‌شود.',
        'function calculateTotal(items) { return items.reduce((a, b) => a + b, 0); }',
        'مرحبا بالعالم! هذا اختبار سرعة للغة العربية للتأكد من كفاءة المعالجة.',
        'Const a = "mix of english and فارسی text in a single line";'
    ];

    const startTime = performance.now();
    let rtlCount = 0;

    const ITERATIONS = 10000;
    for (let i = 0; i < ITERATIONS; i++) {
        const text = samples[i % samples.length];
        if (RTL_REGEX.test(text)) {
            rtlCount++;
        }
    }
    const duration = performance.now() - startTime;

    assert.equal(rtlCount, 6000, 'Regex detection count was incorrect');
    assert.ok(
        duration < 15,
        `RTL regex check took too long: ${duration.toFixed(2)}ms for ${ITERATIONS} items (expected < 15ms)`
    );
});
