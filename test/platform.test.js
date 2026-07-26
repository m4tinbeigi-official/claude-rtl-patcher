const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const fs = require('fs');
const { resolveAppPaths, isWindowsAppsPath } = require('../lib/platform');
const { SAFE_ENTITLEMENTS, getAsarHeaderHash, reSignMacApp } = require('../lib/macos');
const {
    CSS_INJECT_FONT_ONLY,
    CSS_INJECT_FULL,
    FONT_TARGET_SELECTOR,
    RTL_TEXT_SELECTOR,
    upsertCssPatch,
    upsertJavaScriptPatch
} = require('../index');

test('resolves a custom macOS app bundle', () => {
    const paths = resolveAppPaths({
        customPath: '/Applications/Claude.app',
        platform: 'darwin'
    });

    assert.equal(paths.appPath, '/Applications/Claude.app');
    assert.equal(paths.asarPath, '/Applications/Claude.app/Contents/Resources/app.asar');
    assert.equal(paths.infoPlistPath, '/Applications/Claude.app/Contents/Info.plist');
});

test('resolves a direct macOS app.asar path to the app bundle root', () => {
    const paths = resolveAppPaths({
        customPath: '/Applications/Claude.app/Contents/Resources/app.asar',
        platform: 'darwin'
    });

    assert.equal(paths.appPath, '/Applications/Claude.app');
    assert.equal(paths.infoPlistPath, '/Applications/Claude.app/Contents/Info.plist');
});

test('detects WindowsApps paths with either path separator', () => {
    assert.equal(isWindowsAppsPath('C:\\Program Files\\WindowsApps\\Claude\\app.asar'), true);
    assert.equal(isWindowsAppsPath('C:/Program Files/WindowsApps/Claude/app.asar'), true);
    assert.equal(isWindowsAppsPath('C:\\Users\\me\\Claude\\resources\\app.asar'), false);
});

test('re-signs macOS apps without a shell and verifies the result', () => {
    const calls = [];
    let materializedEntitlements;
    let materializedPath;
    reSignMacApp('/Applications/Claude Test.app', (command, args) => {
        calls.push({ command, args });
        if (command === '/usr/bin/codesign' && args.includes('--entitlements')) {
            materializedPath = args[args.indexOf('--entitlements') + 1];
            materializedEntitlements = fs.readFileSync(materializedPath, 'utf8');
        }
    });

    assert.deepEqual(calls.map(({ command }) => command), [
        '/usr/bin/xattr',
        '/usr/bin/codesign',
        '/usr/bin/codesign'
    ]);
    assert.deepEqual(calls[1].args.slice(0, 4), ['--force', '--deep', '--sign', '-']);
    assert.equal(calls[1].args.includes('--preserve-metadata=identifier,entitlements,requirements,flags,runtime'), false);
    assert.equal(materializedEntitlements, SAFE_ENTITLEMENTS);
    assert.equal(materializedEntitlements.includes('com.apple.application-identifier'), false);
    assert.equal(materializedEntitlements.includes('keychain-access-groups'), false);
    assert.equal(fs.existsSync(materializedPath), false);
    assert.equal(calls[1].args.at(-1), '/Applications/Claude Test.app');
    assert.deepEqual(calls[2].args.slice(0, 3), ['--verify', '--deep', '--strict']);
});

test('hashes the serialized ASAR header used by Electron integrity checks', () => {
    const headerString = '{"files":{"main.js":{"size":42}}}';
    const expected = crypto.createHash('sha256').update(headerString, 'utf8').digest('hex');
    const fakeAsar = {
        getRawHeader(receivedPath) {
            assert.equal(receivedPath, '/tmp/app.asar');
            return { headerString };
        }
    };

    assert.equal(getAsarHeaderHash('/tmp/app.asar', fakeAsar), expected);
});

test('applies Vazirmatn across the UI while excluding icons and code blocks', () => {
    assert.match(FONT_TARGET_SELECTOR, /:where\(body, body \*\)/);
    assert.match(FONT_TARGET_SELECTOR, /\[data-icon\]/);
    assert.match(FONT_TARGET_SELECTOR, /\[class\*="icon" i\]/);
    assert.match(FONT_TARGET_SELECTOR, /\[class\*="lucide" i\]/);
    assert.match(FONT_TARGET_SELECTOR, /\[role="img"\]/);
    assert.match(FONT_TARGET_SELECTOR, /\[aria-hidden="true"\]/);
    assert.doesNotMatch(FONT_TARGET_SELECTOR, /button|toolbar/);

    for (const css of [CSS_INJECT_FONT_ONLY, CSS_INJECT_FULL]) {
        assert.equal(css.includes("* { font-family: 'Vazirmatn'"), false);
        assert.match(css, /:where\(body, body \*\)/);
        assert.match(css, /font-family: ui-monospace/);
    }
});

test('applies plaintext bidi without requiring a pre-existing rtl direction', () => {
    assert.match(RTL_TEXT_SELECTOR, /:where\(p, div, li,/);
    assert.doesNotMatch(RTL_TEXT_SELECTOR, /span|label/);
    assert.equal(CSS_INJECT_FULL.includes(`${RTL_TEXT_SELECTOR}:dir(rtl)`), false);
    assert.match(CSS_INJECT_FULL, /unicode-bidi: plaintext !important/);
    assert.equal(CSS_INJECT_FONT_ONLY.includes('unicode-bidi: plaintext'), false);
});

test('replaces legacy and versioned CSS patches idempotently', () => {
    const original = 'body { color: black; }';
    const legacyMarkers = [
        '/* RTL and Vazirmatn Font Patch */',
        '/* Vazirmatn Font Patch (font-only, no RTL/bidi changes) */'
    ];

    for (const marker of legacyMarkers) {
        const legacy = `${original}\n${marker}\n* { font-family: Vazirmatn; }`;
        const upgraded = upsertCssPatch(legacy, CSS_INJECT_FULL);

        assert.match(upgraded, /^body \{ color: black; \}/);
        assert.equal(upgraded.includes("* { font-family: Vazirmatn; }"), false);
        assert.equal((upgraded.match(/CLAUDE_RTL_PATCH_START:v2/g) || []).length, 1);
        assert.equal(upsertCssPatch(upgraded, CSS_INJECT_FULL), upgraded);
    }
});

test('replaces legacy and versioned JavaScript patches idempotently', () => {
    const original = 'const applicationCode = true;';
    const legacy = `${original}\n// Injected for Persian/Arabic/Hebrew support\noldPatch();`;
    const payload = `\n// CLAUDE_RTL_PATCH_START:v2\nnewPatch();\n// CLAUDE_RTL_PATCH_END\n`;
    const upgraded = upsertJavaScriptPatch(legacy, payload);

    assert.match(upgraded, /^const applicationCode = true;/);
    assert.equal(upgraded.includes('oldPatch();'), false);
    assert.equal((upgraded.match(/CLAUDE_RTL_PATCH_START:v2/g) || []).length, 1);
    assert.equal(upsertJavaScriptPatch(upgraded, payload), upgraded);
});
