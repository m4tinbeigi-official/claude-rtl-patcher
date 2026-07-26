const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const asar = require('@electron/asar');

// Ad-hoc signatures cannot keep Anthropic's team-bound identifiers or keychain
// groups. Preserve the capabilities Claude needs without claiming Anthropic's
// signing identity, which otherwise makes macOS terminate the app at launch.
const SAFE_ENTITLEMENTS = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "https://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>com.apple.security.cs.allow-jit</key>
  <true/>
  <key>com.apple.security.device.audio-input</key>
  <true/>
  <key>com.apple.security.device.bluetooth</key>
  <true/>
  <key>com.apple.security.device.camera</key>
  <true/>
  <key>com.apple.security.device.print</key>
  <true/>
  <key>com.apple.security.device.usb</key>
  <true/>
  <key>com.apple.security.personal-information.location</key>
  <true/>
  <key>com.apple.security.personal-information.photos-library</key>
  <true/>
  <key>com.apple.security.virtualization</key>
  <true/>
</dict>
</plist>
`;

function getAsarHeaderHash(asarPath, asarApi = asar) {
    const { headerString } = asarApi.getRawHeader(asarPath);
    return crypto.createHash('sha256').update(headerString, 'utf8').digest('hex');
}

function reSignMacApp(appPath, execFile = execFileSync) {
    const signingDir = fs.mkdtempSync(path.join(os.tmpdir(), 'claude-rtl-signing-'));
    const entitlementsPath = path.join(signingDir, 'entitlements.plist');

    try {
        // pkg assets live under a virtual /snapshot path that external tools
        // cannot read. Materializing the plist also makes standalone builds safe.
        fs.writeFileSync(entitlementsPath, SAFE_ENTITLEMENTS, { mode: 0o600 });
        execFile('/usr/bin/xattr', ['-cr', appPath], { stdio: 'pipe' });
        execFile('/usr/bin/codesign', [
            '--force',
            '--deep',
            '--sign',
            '-',
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

module.exports = { SAFE_ENTITLEMENTS, getAsarHeaderHash, reSignMacApp };
