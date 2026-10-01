#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const ora = require('ora');
const prompts = require('prompts');
const picocolors = require('picocolors');
const plist = require('plist');

const { printBanner } = require('./lib/banner');
const { resolveAppPaths, isWindowsAppsPath } = require('./lib/platform');
const { computeUnpackGlob } = require('./lib/unpack');
const engine = require('./lib/engine');

const { red, green, yellow, blue, bold, gray, cyan } = picocolors;

const isMac = process.platform === 'darwin';
const isWin = process.platform === 'win32';

const isWatchFlag = process.argv.includes('--watch') || process.argv.includes('-w');
const isRestoreFlag = process.argv.includes('--restore') || process.argv.includes('-r');
const isPatchFlag = process.argv.includes('--patch') || process.argv.includes('-p');
const isFontOnlyFlag = process.argv.includes('--font-only');
const isForceFullFlag = process.argv.includes('--full') || process.argv.includes('--rtl');
const isAutoFlag = process.argv.includes('--auto') || process.argv.includes('-a');
const isHelpFlag = process.argv.includes('--help') || process.argv.includes('-h');

// Support any custom path passed as an argument (excluding flags)
const customPathArg = process.argv.slice(2).find(arg => !arg.startsWith('-'));

const pkgPath = path.join(__dirname, 'package.json');
const pkgVersion = fs.existsSync(pkgPath) ? JSON.parse(fs.readFileSync(pkgPath, 'utf8')).version : '1.2.0';

if (isHelpFlag) {
    console.log(`
Usage: npx claude-rtl-patcher [options] [path/to/Claude/app.asar]

Options:
  --auto, -a       Auto-detect Claude version and apply recommended patch
  --full, --rtl    Force full RTL + Vazirmatn Variable patch
  --font-only      Apply Vazirmatn Variable font only without RTL direction changes
  --restore, -r    Restore original Claude Desktop app.asar backup
  --watch, -w      Watch app.asar and automatically re-patch when Claude updates
  --help, -h       Show this help message
`);
    process.exit(0);
}

const NATIVE_RTL_MIN_VERSION = '1.2.0';

function compareVersions(a, b) {
    const pa = a.split('.').map(Number);
    const pb = b.split('.').map(Number);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const na = pa[i] || 0, nb = pb[i] || 0;
        if (na !== nb) return na - nb;
    }
    return 0;
}

function detectInstalledVersion(appPath, resourcesPath) {
    try {
        if (isMac) {
            const infoPlistPath = path.join(appPath, 'Contents', 'Info.plist');
            if (fs.existsSync(infoPlistPath)) {
                const parsed = plist.parse(fs.readFileSync(infoPlistPath, 'utf8'));
                if (parsed?.CFBundleShortVersionString) return parsed.CFBundleShortVersionString;
            }
        }
        const pkgUpdatePath = path.join(resourcesPath, 'app-update.yml');
        if (fs.existsSync(pkgUpdatePath)) {
            const match = fs.readFileSync(pkgUpdatePath, 'utf8').match(/version:\s*([\d.]+)/);
            if (match) return match[1];
        }
    } catch (e) {}
    return null;
}

let resolvedPaths;
try {
    resolvedPaths = resolveAppPaths({ customPath: customPathArg, platform: process.platform });
} catch (error) {
    console.error(red(`[!] ${error.message}`));
    process.exit(1);
}

const {
    appPath: CLAUDE_APP_PATH,
    resourcesPath: RESOURCES_PATH,
    infoPlistPath: INFO_PLIST_PATH,
    asarPath: ASAR_PATH,
    backupPath: BACKUP_PATH
} = resolvedPaths;

const TEMP_DIR = path.join(os.tmpdir(), 'claude-rtl-patcher-temp');

function ensureWritePermissions(asarPath, resourcesPath) {
    try {
        if (fs.existsSync(asarPath)) {
            fs.accessSync(asarPath, fs.constants.W_OK);
        }
        if (fs.existsSync(resourcesPath)) {
            fs.accessSync(resourcesPath, fs.constants.W_OK);
        }
    } catch (err) {
        if (err.code === 'EACCES' || err.code === 'EPERM') {
            console.error(red(`\n[!] Permission denied: cannot write to Claude app files.`));
            console.error(gray(`    Target: ${asarPath}`));
            if (process.platform === 'win32') {
                console.log(yellow('\nPlease run your terminal / command prompt as Administrator.'));
            } else {
                console.log(yellow('\nPlease re-run this command with sudo:'));
                const args = process.argv.slice(1).join(' ');
                console.log(cyan(`    sudo node ${args || 'index.js'}`));
            }
            process.exit(1);
        }
        throw err;
    }
}

async function restoreClaude() {
    ensureWritePermissions(ASAR_PATH, RESOURCES_PATH);
    console.log('');
    const spinner = ora('Restoring original Claude app...').start();
    try {
        engine.restoreBackup(BACKUP_PATH, ASAR_PATH, {
            infoPlistPath: INFO_PLIST_PATH,
            appPath: CLAUDE_APP_PATH
        });
        spinner.succeed(green('Original Claude restored successfully!'));
        console.log(gray('Restart Claude to see the changes.'));
    } catch (e) {
        spinner.fail(red('Failed to restore backup: ' + e.message));
        process.exit(1);
    }
}

async function patchClaude(fontOnlyOverride) {
    let fontOnly;
    let autoNote = '';

    if (fontOnlyOverride === true || isFontOnlyFlag) {
        fontOnly = true;
    } else if (fontOnlyOverride === false || isForceFullFlag) {
        fontOnly = false;
    } else {
        const detectedVersion = detectInstalledVersion(CLAUDE_APP_PATH, RESOURCES_PATH);
        if (detectedVersion && compareVersions(detectedVersion, NATIVE_RTL_MIN_VERSION) >= 0) {
            fontOnly = true;
            autoNote = `Detected Claude v${detectedVersion} (native RTL) — applying Vazirmatn font only.`;
        } else {
            fontOnly = false;
            autoNote = detectedVersion
                ? `Detected Claude v${detectedVersion} (pre-native-RTL) — applying full RTL + font patch.`
                : `Could not detect Claude version — applying full RTL + font patch to be safe. Use --font-only to override.`;
        }
    }

    console.log('');
    if (autoNote) console.log(blue(`[i] ${autoNote}`));

    if (isWin && isWindowsAppsPath(ASAR_PATH)) {
        console.error(red('[!] Claude Desktop appears to be installed as an MSIX/AppX package:'));
        console.error(red(`    ${ASAR_PATH}`));
        console.log(yellow('This location is locked by Windows (TrustedInstaller-owned) and is not writable,'));
        console.log(yellow('even as Administrator. MSIX packages also carry their own integrity checks that'));
        console.log(yellow('can silently revert in-place patches even if the write succeeded.'));
        console.log(yellow('This tool currently does not support MSIX installs of Claude Desktop on Windows.'));
        process.exit(1);
    }

    if (!fs.existsSync(ASAR_PATH)) {
        console.error(red(`[!] Claude app not found at ${ASAR_PATH}.`));
        console.log(yellow('If you installed Claude in a custom location, you can pass the path as an argument:'));
        console.log(yellow('npx claude-rtl-patcher /your/custom/path/to/Claude'));
        process.exit(1);
    }

    ensureWritePermissions(ASAR_PATH, RESOURCES_PATH);

    let spinner = ora('Creating backup of original app...').start();
    try {
        engine.createBackup(ASAR_PATH, BACKUP_PATH);
        spinner.succeed(green('Backup created (or already exists).'));
    } catch (e) {
        spinner.fail(red('Backup failed! ' + e.message));
        process.exit(1);
    }

    const unpackGlob = computeUnpackGlob(ASAR_PATH);

    spinner = ora('Extracting app.asar...').start();
    try {
        engine.extractPackage(ASAR_PATH, TEMP_DIR);
        spinner.succeed(green('App extracted successfully.'));
    } catch (e) {
        spinner.fail(red('Extraction failed: ' + e.message + '. Restoring backup...'));
        if (fs.existsSync(BACKUP_PATH)) fs.copyFileSync(BACKUP_PATH, ASAR_PATH);
        process.exit(1);
    }

    spinner = ora('Injecting RTL styles, Vazirmatn Variable font, and runtime shortcuts...').start();
    try {
        engine.injectStylesAndRuntime(TEMP_DIR, { fontOnly });
        spinner.succeed(green('Styles and runtime features successfully injected!'));
    } catch (e) {
        spinner.fail(red('Patching failed: ' + e.message + '. Restoring backup...'));
        if (fs.existsSync(BACKUP_PATH)) fs.copyFileSync(BACKUP_PATH, ASAR_PATH);
        process.exit(1);
    }

    spinner = ora('Repacking app.asar (this takes a few seconds)...').start();
    try {
        await engine.repackPackage(TEMP_DIR, ASAR_PATH, unpackGlob);
        spinner.succeed(green('App repacked successfully.'));
    } catch (e) {
        spinner.fail(red('Repacking failed: ' + e.message + '. Restoring backup...'));
        if (fs.existsSync(BACKUP_PATH)) fs.copyFileSync(BACKUP_PATH, ASAR_PATH);
        process.exit(1);
    }

    if (isMac && INFO_PLIST_PATH) {
        spinner = ora('Updating macOS security hashes and bypassing Gatekeeper...').start();
        try {
            await engine.finalizeMacSecurity(CLAUDE_APP_PATH, ASAR_PATH, INFO_PLIST_PATH);
            spinner.succeed(green('macOS Security passed!'));
        } catch (e) {
            spinner.fail(red('Security bypass failed: ' + e.message + '. Restoring backup...'));
            if (fs.existsSync(BACKUP_PATH)) fs.copyFileSync(BACKUP_PATH, ASAR_PATH);
            process.exit(1);
        }
    }

    if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });

    console.log('\n=================================================');
    if (fontOnly) {
        console.log(bold(green('✨ DONE! Vazirmatn Variable font applied (RTL/direction left untouched).')));
    } else {
        console.log(bold(green('✨ DONE! Claude is now fully optimized with Vazirmatn Variable & Smart RTL!')));
        console.log(blue('💡 Shortcuts enabled: Alt + R (toggle RTL mode), Shift + 2 (@ on Persian keyboard)'));
    }
    console.log(gray('Please FULLY RESTART Claude to apply changes.'));
    console.log('=================================================\n');
}

async function watchClaude() {
    console.log(cyan(`\n👀 Claude RTL Watcher active for: ${ASAR_PATH}`));
    console.log(gray('Monitoring for app updates... (Press Ctrl+C to stop)\n'));

    let isPatching = false;
    let debounceTimer = null;
    let lastMtime = fs.existsSync(ASAR_PATH) ? fs.statSync(ASAR_PATH).mtimeMs : 0;

    const triggerCheck = () => {
        if (isPatching || !fs.existsSync(ASAR_PATH)) return;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            if (isPatching || !fs.existsSync(ASAR_PATH)) return;
            try {
                const currentMtime = fs.statSync(ASAR_PATH).mtimeMs;
                if (currentMtime !== lastMtime) {
                    lastMtime = currentMtime;
                    console.log(yellow('\n[!] Detected change in app.asar (likely Claude update). Auto-patching...'));
                    isPatching = true;
                    await patchClaude();
                    lastMtime = fs.existsSync(ASAR_PATH) ? fs.statSync(ASAR_PATH).mtimeMs : 0;
                    isPatching = false;
                    console.log(green('✔ Successfully re-applied RTL patch! Resuming watch...\n'));
                }
            } catch (err) {
                isPatching = false;
            }
        }, 1500);
    };

    // Event-driven watcher on resources directory (handles atomic file swaps and renames)
    try {
        if (fs.existsSync(RESOURCES_PATH)) {
            const watcher = fs.watch(RESOURCES_PATH, (eventType, filename) => {
                if (!filename || filename.toLowerCase().includes('app.asar')) {
                    triggerCheck();
                }
            });
            watcher.on('error', () => {});
        }
    } catch (e) {}

    // Low-frequency heartbeat fallback to ensure updates aren't missed even if fs events fail
    setInterval(triggerCheck, 10000);
}

async function main() {
    printBanner(pkgVersion);

    if (isWatchFlag) {
        await watchClaude();
        return;
    }
    if (isRestoreFlag) {
        await restoreClaude();
        return;
    }
    if (isAutoFlag) {
        await patchClaude();
        return;
    }
    if (isPatchFlag || isForceFullFlag) {
        await patchClaude(false);
        return;
    }
    if (isFontOnlyFlag) {
        await patchClaude(true);
        return;
    }

    const response = await prompts({
        type: 'select',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            { title: '🔍 Auto-detect (Recommended)', value: 'auto' },
            { title: '✨ Force Full RTL (Persian/Arabic + Font)', value: 'patch' },
            { title: '🔤 Font Only (Vazirmatn without RTL)', value: 'font-only' },
            { title: '⏪ Restore Original Claude', value: 'restore' },
            { title: '👀 Watch & Auto Re-patch', value: 'watch' },
            { title: '❌ Exit', value: 'exit' }
        ],
        initial: 0
    });

    if (!response.action || response.action === 'exit') {
        console.log(yellow('Goodbye!'));
        process.exit(0);
    }

    if (response.action === 'auto') {
        await patchClaude();
    } else if (response.action === 'patch') {
        await patchClaude(false);
    } else if (response.action === 'font-only') {
        await patchClaude(true);
    } else if (response.action === 'restore') {
        await restoreClaude();
    } else if (response.action === 'watch') {
        await watchClaude();
    }
}

if (require.main === module) {
    main().catch(err => {
        console.error(red('\n[!] UNEXPECTED ERROR: ' + err.message));
        if (fs.existsSync(BACKUP_PATH)) fs.copyFileSync(BACKUP_PATH, ASAR_PATH);
        console.log(yellow('\nClaude app has been restored to safety.'));
        process.exit(1);
    });
}

module.exports = {
    compareVersions,
    detectInstalledVersion,
    patchClaude,
    restoreClaude
};
