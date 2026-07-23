const { execFileSync } = require('child_process');

function reSignMacApp(appPath, execFile = execFileSync) {
    execFile('xattr', ['-cr', appPath], { stdio: 'pipe' });
    execFile('codesign', [
        '--force',
        '--deep',
        '--sign',
        '-',
        '--preserve-metadata=identifier,entitlements,requirements,flags,runtime',
        appPath
    ], { stdio: 'pipe' });
    execFile('codesign', ['--verify', '--deep', '--strict', '--verbose=2', appPath], {
        stdio: 'pipe'
    });
}

module.exports = { reSignMacApp };
