const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const fs = require('fs');
const { resolveAppPaths, isWindowsAppsPath } = require('../lib/platform');
const { SAFE_ENTITLEMENTS, getAsarHeaderHash, reSignMacApp } = require('../lib/macos');
const { CSS_INJECT_FONT_ONLY, CSS_INJECT_FULL, FONT_TARGET_SELECTOR } = require('../index');

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
