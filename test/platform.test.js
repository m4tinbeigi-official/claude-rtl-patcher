const test = require('node:test');
const assert = require('node:assert/strict');
const { resolveAppPaths, isWindowsAppsPath } = require('../lib/platform');
const { reSignMacApp } = require('../lib/macos');

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
    reSignMacApp('/Applications/Claude Test.app', (command, args) => {
        calls.push({ command, args });
    });

    assert.deepEqual(calls.map(({ command }) => command), ['xattr', 'codesign', 'codesign']);
    assert.deepEqual(calls[1].args.slice(0, 4), ['--force', '--deep', '--sign', '-']);
    assert.equal(calls[1].args.at(-1), '/Applications/Claude Test.app');
    assert.deepEqual(calls[2].args.slice(0, 3), ['--verify', '--deep', '--strict']);
});
