const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const asar = require('@electron/asar');
const plist = require('plist');

// Ad-hoc signatures cannot keep Anthropic's team-bound identifiers or keychain
// groups, so those three keys always have to go. Everything else in the
// app's *real*, currently-installed entitlements should be kept as-is -
// hand-guessing a fixed list would silently drop whatever the running app
// actually declares (and silently grant things it never asked for) the
// moment Anthropic's build changes.
const IDENTITY_BOUND_ENTITLEMENT_KEYS = [
    'com.apple.application-identifier',
    'com.apple.developer.team-identifier',
    'keychain-access-groups'
];

// Used only if we can't read the app's real entitlements at all (e.g. it
// somehow has no signature to query). Deliberately minimal: an ad-hoc
// resign with no entitlements file is closer to "preserve nothing extra"
// than any hand-picked guess would be.
const SAFE_ENTITLEMENTS = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "https://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>com.apple.security.cs.allow-jit</key>
  <true/>
</dict>
</plist>
`;

function getAsarHeaderHash(asarPath, asarApi = asar) {
    const { headerString } = asarApi.getRawHeader(asarPath);
    return crypto.createHash('sha256').update(headerString, 'utf8').digest('hex');
}

function readCurrentEntitlements(appPath, execFile) {
    try {
        const output = execFile('/usr/bin/codesign', ['-d', '--entitlements', ':-', appPath], {
            stdio: ['ignore', 'pipe', 'pipe']
        });
        return output ? output.toString('utf8') : null;
    } catch (e) {
        return null;
    }
}

// Prefer the app's own current entitlements (minus the identity-bound keys
// an ad-hoc signature can't carry) over a hand-written guess, so a future
// Claude Desktop release that needs a new entitlement keeps it automatically
// instead of it being silently stripped by a stale hardcoded list.
function buildEntitlementsForResign(appPath, execFile) {
    const raw = readCurrentEntitlements(appPath, execFile);
    if (raw) {
        try {
            const parsed = plist.parse(raw);
            for (const key of IDENTITY_BOUND_ENTITLEMENT_KEYS) delete parsed[key];
            return plist.build(parsed);
        } catch (e) {
            // Not parseable (unsigned app, unexpected output) - fall through.
        }
    }
    return SAFE_ENTITLEMENTS;
}

function reSignMacApp(appPath, execFile = execFileSync) {
    const signingDir = fs.mkdtempSync(path.join(os.tmpdir(), 'claude-rtl-signing-'));
    const entitlementsPath = path.join(signingDir, 'entitlements.plist');

    try {
        const entitlements = buildEntitlementsForResign(appPath, execFile);
        // pkg assets live under a virtual /snapshot path that external tools
        // cannot read. Materializing the plist also makes standalone builds safe.
        fs.writeFileSync(entitlementsPath, entitlements, { mode: 0o600 });
        execFile('/usr/bin/xattr', ['-cr', appPath], { stdio: 'pipe' });
        execFile('/usr/bin/codesign', [
            '--force',
            '--deep',
            '--sign',
            '-',
            '--options',
            'runtime',
            '--entitlements',
            entitlementsPath,
            appPath
        ], { stdio: 'pipe' });
        execFile('/usr/bin/codesign', ['--verify', '--deep', '--strict', '--verbose=2', appPath], {
            stdio: 'pipe'
        });
    } finally {
        fs.rmSync(signingDir, { recursive: true, force: true });
    }
}

module.exports = {
    SAFE_ENTITLEMENTS,
    IDENTITY_BOUND_ENTITLEMENT_KEYS,
    getAsarHeaderHash,
    buildEntitlementsForResign,
    reSignMacApp
};
