const { execFileSync } = require('child_process');

function reSignMacApp(appPath, execFile = execFileSync) {
    execFile('xattr', ['-cr', appPath], { stdio: 'pipe' });

    // Strip every nested code signature first. Patching files inside
    // app.asar invalidates the nested seals of already-signed sub-bundles
    // (Frameworks, Helper.app, XPCServices, etc.) without removing them —
    // signing on top of stale nested signatures leaves the bundle in an
    // inconsistent state where `codesign --verify` reports "nested code is
    // modified or invalid" even though the sign step itself reports success.
    try {
        execFile('codesign', ['--remove-signature', '--deep', appPath], { stdio: 'pipe' });
    } catch (e) {
        // non-fatal — some items may not have had a signature to remove
    }

    // --preserve-metadata is deliberately not used here: it reads from the
    // existing signature at sign time, but --remove-signature above just
    // erased it (including the top-level one, since --deep applies to the
    // whole bundle) — there is nothing left to preserve from.
    execFile('codesign', [
        '--force',
        '--deep',
        '--sign',
        '-',
        appPath
    ], { stdio: 'pipe' });
    execFile('codesign', ['--verify', '--deep', '--strict', '--verbose=2', appPath], {
        stdio: 'pipe'
    });
}

module.exports = { reSignMacApp };
