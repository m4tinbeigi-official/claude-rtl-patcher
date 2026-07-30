const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const fs = require('fs');
const { resolveAppPaths, isWindowsAppsPath } = require('../lib/platform');
const {
    SAFE_ENTITLEMENTS,
    IDENTITY_BOUND_ENTITLEMENT_KEYS,
    getAsarHeaderHash,
    buildEntitlementsForResign,
    reSignMacApp
} = require('../lib/macos');
const {
    CSS_INJECT_FONT_ONLY,
    CSS_INJECT_FULL,
    FONT_TARGET_SELECTOR,
    RTL_TEXT_SELECTOR,
    upsertCssPatch,
    upsertJavaScriptPatch,
    collectUnpackedBasenames,
    buildUnpackPattern
} = require('../index');
const { minimatch } = require('minimatch');

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

test('re-signs macOS apps without a shell, preserving real entitlements minus identity keys', () => {
    const calls = [];
    let materializedEntitlements;
    let materializedPath;
    const realEntitlementsXml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "https://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>com.apple.application-identifier</key><string>TEAMID.com.anthropic.claudefordesktop</string>
  <key>com.apple.developer.team-identifier</key><string>TEAMID</string>
  <key>keychain-access-groups</key><array><string>TEAMID.com.anthropic.claudefordesktop</string></array>
  <key>com.apple.security.device.microphone</key><true/>
  <key>com.apple.security.cs.allow-jit</key><true/>
</dict></plist>`;

    reSignMacApp('/Applications/Claude Test.app', (command, args) => {
        calls.push({ command, args });
        if (command === '/usr/bin/codesign' && args[0] === '-d') {
            return Buffer.from(realEntitlementsXml, 'utf8');
        }
        if (command === '/usr/bin/codesign' && args.includes('--entitlements')) {
            materializedPath = args[args.indexOf('--entitlements') + 1];
            materializedEntitlements = fs.readFileSync(materializedPath, 'utf8');
        }
    });

    assert.deepEqual(calls.map(({ command }) => command), [
        '/usr/bin/codesign',
        '/usr/bin/xattr',
        '/usr/bin/codesign',
        '/usr/bin/codesign'
    ]);
    assert.deepEqual(calls[0].args, ['-d', '--entitlements', ':-', '/Applications/Claude Test.app']);
    assert.deepEqual(calls[2].args.slice(0, 4), ['--force', '--deep', '--sign', '-']);
    assert.equal(calls[2].args.includes('--preserve-metadata=identifier,entitlements,requirements,flags,runtime'), false);
    assert.equal(calls[2].args.includes('runtime'), true);
    // Kept: the app's own real, currently-declared entitlement.
    assert.equal(materializedEntitlements.includes('com.apple.security.device.microphone'), true);
    // Stripped: identity-bound keys an ad-hoc signature can't legitimately claim.
    for (const key of IDENTITY_BOUND_ENTITLEMENT_KEYS) {
        assert.equal(materializedEntitlements.includes(key), false);
    }
    assert.equal(fs.existsSync(materializedPath), false);
    assert.equal(calls[2].args.at(-1), '/Applications/Claude Test.app');
    assert.deepEqual(calls[3].args.slice(0, 3), ['--verify', '--deep', '--strict']);
});

test('falls back to the minimal entitlements when the app has none to read', () => {
    const entitlements = buildEntitlementsForResign('/Applications/Unsigned.app', () => {
        throw new Error('not signed');
    });
    assert.equal(entitlements, SAFE_ENTITLEMENTS);
    for (const key of IDENTITY_BOUND_ENTITLEMENT_KEYS) {
        assert.equal(entitlements.includes(key), false);
    }
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
    // Dialogs/modals commonly mark the entire background tree
    // aria-hidden="true" while open; excluding that attribute would strip
    // the font/RTL rules from the whole app behind every open dialog.
    assert.doesNotMatch(FONT_TARGET_SELECTOR, /aria-hidden/);

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

test('does not truncate real content when the legacy marker text appears mid-file', () => {
    // Legacy patches were only ever appended once at true EOF. If the exact
    // marker string shows up somewhere else (pasted manually, reused by
    // another tool) the tail after it can be far larger than any real
    // injected payload ever was - that content must survive.
    const marker = '/* RTL and Vazirmatn Font Patch */';
    const realAppRule = '.IMPORTANT_APP_RULE { display: flex; }';
    const bigTail = realAppRule + '\n' + 'x'.repeat(150_000);
    const content = `/*! app styles */\n.a{color:red}\n${marker}\n${bigTail}`;

    const upgraded = upsertCssPatch(content, CSS_INJECT_FULL);
    assert.equal(upgraded.includes(realAppRule), true);
});

test('reconstructs the exact original unpack set from the archive header, not just extensions', () => {
    const header = {
        files: {
            'index.js': { size: 1 },
            native: {
                files: {
                    'thing.dll': { size: 2, unpacked: true },
                    'other.bin': { size: 3, unpacked: true },
                    'nested': { files: { 'deep.exe': { size: 4, unpacked: true } } }
                }
            }
        }
    };
    const names = collectUnpackedBasenames(header);
    assert.equal(names.has('thing.dll'), true);
    assert.equal(names.has('other.bin'), true);
    assert.equal(names.has('deep.exe'), true);
    assert.equal(names.has('index.js'), false);

    const fakeAsar = { getRawHeader: () => ({ header }) };
    const pattern = buildUnpackPattern('/tmp/app.asar', fakeAsar);
    // Real unpacked files from the archive plus the static extension safety net.
    assert.match(pattern, /other\.bin/);
    assert.match(pattern, /\*\.node/);
    assert.match(pattern, /\*\.dll/);
    assert.match(pattern, /\*\.so/);
    assert.match(pattern, /\*\.exe/);
});

test('unpack pattern matches literal filenames containing glob metacharacters', () => {
    // A '{a,b,c}' brace-list (the original join syntax) silently splits on a
    // comma inside a real filename instead of treating it as one literal
    // alternative - verify the actual pattern minimatch sees behaves right.
    const trickyNames = ['foo,bar.dll', 'weird(name)+file@[1].dll'];
    const header = {
        files: {
            native: {
                files: Object.fromEntries(trickyNames.map(name => [name, { size: 1, unpacked: true }]))
            }
        }
    };
    const fakeAsar = { getRawHeader: () => ({ header }) };
    const pattern = buildUnpackPattern('/tmp/app.asar', fakeAsar);

    for (const name of trickyNames) {
        assert.equal(minimatch(name, pattern, { matchBase: true }), true, `expected ${name} to match ${pattern}`);
    }
    assert.equal(minimatch('unrelated.txt', pattern, { matchBase: true }), false);
    assert.equal(minimatch('addon.node', pattern, { matchBase: true }), true);
});
