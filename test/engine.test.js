const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');
const asar = require('@electron/asar');

const engine = require('../lib/engine');
const { getFontCss, UNICODE_RANGE } = require('../lib/font');
const { buildCssPayload, CSS_INJECT_FULL, CSS_INJECT_FONT_ONLY } = require('../lib/css');
const { getRuntimeScript } = require('../lib/runtime');

test('lib/font.js loads Vazirmatn font and outputs valid @font-face', () => {
    const css = getFontCss();
    assert.match(css, /@font-face/);
    assert.match(css, /font-family:\s*'Vazirmatn'/);
    assert.match(css, /unicode-range:/);
    assert.match(css, /U\+0600-06FF/);
    assert.match(css, /U\+200C/);
    assert.match(css, /font-weight:\s*100\s*900/);
});

test('lib/css.js generates both full and font-only payloads with isolation rules', () => {
    assert.match(CSS_INJECT_FULL, /\[dir="rtl"\]/);
    assert.match(CSS_INJECT_FULL, /html\[data-claude-rtl="force"\]/);
    assert.match(CSS_INJECT_FULL, /ui-monospace/);
    assert.match(CSS_INJECT_FULL, /\[class\*="thinking" i\]/);
    assert.match(CSS_INJECT_FULL, /\[class\*="katex" i\]/);
    assert.match(CSS_INJECT_FULL, /table\s*\{/);

    assert.match(CSS_INJECT_FONT_ONLY, /\[dir="rtl"\]/);
    assert.match(CSS_INJECT_FONT_ONLY, /html\[data-claude-rtl="force"\]/);
});

test('lib/runtime.js provides Alt+R, Shift+2 fix, and updateDir logic', () => {
    const script = getRuntimeScript();
    assert.match(script, /KeyR/);
    assert.match(script, /Digit2/);
    assert.match(script, /claude_rtl_mode/);
    assert.match(script, /updateDir/);
    assert.match(script, /claude-rtl-toast/);
});

test('lib/engine.js can extract, inject, and repack a mock asar bundle cleanly', async () => {
    const tempTestRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'claude-engine-test-'));
    const srcDir = path.join(tempTestRoot, 'src');
    const extractDir = path.join(tempTestRoot, 'extract');
    const asarPath = path.join(tempTestRoot, 'app.asar');
    const backupPath = path.join(tempTestRoot, 'app.asar.bak');

    fs.mkdirSync(path.join(srcDir, '.vite', 'build'), { recursive: true });
    fs.mkdirSync(path.join(srcDir, '.vite', 'renderer'), { recursive: true });

    fs.writeFileSync(path.join(srcDir, '.vite', 'build', 'style.css'), 'body { margin: 0; }');
    fs.writeFileSync(path.join(srcDir, '.vite', 'build', 'mainWindow.js'), 'console.log("main window");');

    await asar.createPackage(srcDir, asarPath);
    assert.equal(fs.existsSync(asarPath), true);

    const created = engine.createBackup(asarPath, backupPath);
    assert.equal(created, true);
    assert.equal(fs.existsSync(backupPath), true);

    engine.extractPackage(asarPath, extractDir);
    assert.equal(fs.existsSync(path.join(extractDir, '.vite', 'build', 'style.css')), true);

    engine.injectStylesAndRuntime(extractDir, { fontOnly: false });

    const injectedCss = fs.readFileSync(path.join(extractDir, '.vite', 'build', 'style.css'), 'utf8');
    const injectedJs = fs.readFileSync(path.join(extractDir, '.vite', 'build', 'mainWindow.js'), 'utf8');

    assert.match(injectedCss, /Vazirmatn/);
    assert.match(injectedCss, /\[dir="rtl"\]/);
    assert.match(injectedJs, /insertCSS/);
    assert.match(injectedJs, /KeyR/);

    await engine.repackPackage(extractDir, asarPath, '{*.node,*.dylib}');
    assert.equal(fs.existsSync(asarPath), true);

    fs.rmSync(asarPath);
    engine.restoreBackup(backupPath, asarPath);
    assert.equal(fs.existsSync(asarPath), true);

    const restoredExtractDir = path.join(tempTestRoot, 'restored-extract');
    engine.extractPackage(asarPath, restoredExtractDir);
    const restoredCss = fs.readFileSync(path.join(restoredExtractDir, '.vite', 'build', 'style.css'), 'utf8');
    assert.equal(restoredCss, 'body { margin: 0; }');

    fs.rmSync(tempTestRoot, { recursive: true, force: true });
});
