const fs = require('fs');
const path = require('path');
const { flipFuses, FuseVersion, FuseV1Options } = require('@electron/fuses');

function resolveExecutableTarget(appPath, platform = process.platform) {
    if (!appPath || typeof appPath !== 'string') return appPath;
    if (!fs.existsSync(appPath)) return appPath;

    try {
        const stat = fs.statSync(appPath);
        if (!stat.isDirectory()) return appPath;

        if (platform === 'darwin') {
            return appPath;
        }

        if (platform === 'win32') {
            const candidates = ['Claude.exe', 'claude.exe', 'claude-desktop.exe'];
            for (const name of candidates) {
                const target = path.join(appPath, name);
                if (fs.existsSync(target)) return target;
            }
        } else {
            const candidates = ['claude-desktop', 'claude', 'Claude'];
            for (const name of candidates) {
                const target = path.join(appPath, name);
                if (fs.existsSync(target)) return target;
            }
        }
    } catch (e) {}

    return appPath;
}

// Electron's embedded ASAR integrity fuse bakes the expected SHA-256 hash of
// app.asar into the Electron Framework binary itself (not Info.plist's
// ElectronAsarIntegrity key, which is a separate legacy mechanism). Once
// app.asar is patched, that embedded hash no longer matches and Electron
// hard-crashes at launch. Recomputing it by hand isn't practical — this uses
// Electron's own tooling to disable the check instead.
async function disableAsarIntegrityFuse(appPath, options = {}) {
    const platform = options.platform || process.platform;
    const target = resolveExecutableTarget(appPath, platform);
    try {
        await flipFuses(target, {
            version: FuseVersion.V1,
            resetAdHocDarwinSignature: platform === 'darwin',
            [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: false
        });
        return { skipped: false };
    } catch (e) {
        if (/already|not found|no fuse|unsupported/i.test(e.message)) {
            return { skipped: true, reason: e.message };
        }
        throw e;
    }
}

module.exports = { disableAsarIntegrityFuse, resolveExecutableTarget };
