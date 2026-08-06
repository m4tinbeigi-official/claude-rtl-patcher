const { execFileSync } = require('child_process');

// Electron's embedded ASAR integrity fuse bakes the expected SHA-256 hash of
// app.asar into the Electron Framework binary itself (not Info.plist's
// ElectronAsarIntegrity key, which is a separate legacy mechanism). Once
// app.asar is patched, that embedded hash no longer matches and Electron
// hard-crashes at launch. Recomputing it by hand isn't practical — this uses
// Electron's own tooling to disable the check instead.
function disableAsarIntegrityFuse(appPath, execFile = execFileSync) {
    execFile('npx', ['--yes', '@electron/fuses', 'write', '--app', appPath,
        'EnableEmbeddedAsarIntegrityValidation=off'], { stdio: 'pipe' });
}

module.exports = { disableAsarIntegrityFuse };
