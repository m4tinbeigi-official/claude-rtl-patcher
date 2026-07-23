#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const asar = require('@electron/asar');
const plist = require('plist');
const crypto = require('crypto');
const chalk = require('chalk');
const ora = require('ora');
const figlet = require('figlet');
const inquirer = require('inquirer');
const fontCss = require('./font.js');
const { resolveAppPaths, isWindowsAppsPath } = require('./lib/platform');
const { reSignMacApp } = require('./lib/macos');

const isMac = process.platform === 'darwin';
const isWin = process.platform === 'win32';
const isLinux = process.platform === 'linux';

// Allow user to pass a custom path or a restore flag as an argument
const customPathArg = process.argv.find(arg => arg.includes('Claude') || arg.includes('app.asar') || arg.includes('resources'));
const isRestoreFlag = process.argv.includes('--restore');
const isPatchFlag = process.argv.includes('--patch');
const isFontOnlyFlag = process.argv.includes('--font-only');
const isForceFullFlag = process.argv.includes('--full') || process.argv.includes('--rtl');
const isAuto = isRestoreFlag || isPatchFlag || isFontOnlyFlag || isForceFullFlag;

// Claude Desktop shipped native RTL support starting around this version.
// NOTE for maintainers: bump this the moment a release is confirmed to render
// Persian/Arabic/Hebrew correctly out of the box in the Chat tab (not just Code).
// Until then this is a best-effort guess and the user can always override with
// --font-only or --full.
const NATIVE_RTL_MIN_VERSION = '1.2.0'; // TODO: confirm against real changelog

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
        const pkgPath = path.join(resourcesPath, 'app-update.yml');
        if (fs.existsSync(pkgPath)) {
            const match = fs.readFileSync(pkgPath, 'utf8').match(/version:\s*([\d.]+)/);
            if (match) return match[1];
        }
    } catch (e) {
        // ignore — fall through to null (unknown version)
    }
    return null;
}

let resolvedPaths;
try {
    resolvedPaths = resolveAppPaths({ customPath: customPathArg, platform: process.platform });
} catch (error) {
    console.error(chalk.red(`[!] ${error.message}`));
    process.exit(1);
}
const {
    appPath: CLAUDE_APP_PATH,
    resourcesPath: RESOURCES_PATH,
    infoPlistPath: INFO_PLIST_PATH,
    asarPath: ASAR_PATH,
    backupPath: BACKUP_PATH
} = resolvedPaths;
const TEMP_DIR = path.join(require('os').tmpdir(), 'claude-rtl-patcher-temp');

const CSS_INJECT_FULL = `
/* RTL and Vazirmatn Font Patch */
${fontCss}
* { font-family: 'Vazirmatn', ui-sans-serif, system-ui, sans-serif !important; }
p, div, span, h1, h2, h3, h4, h5, h6, textarea, input, .ProseMirror, [contenteditable] { 
    unicode-bidi: plaintext !important; 
    text-align: start !important; 
}
`;

// Font-only variant: just swaps the typeface, no direction/bidi changes.
// Useful on newer Claude builds that already ship native RTL support and only
// need the Vazirmatn font applied on top of it.
const CSS_INJECT_FONT_ONLY = `
/* Vazirmatn Font Patch (font-only, no RTL/bidi changes) */
${fontCss}
* { font-family: 'Vazirmatn', ui-sans-serif, system-ui, sans-serif !important; }
`;

function updateMacAsarIntegrity(asarPath, infoPlistPath) {
    if (!isMac || !infoPlistPath || !fs.existsSync(infoPlistPath)) return;

    const fileBuffer = fs.readFileSync(asarPath);
    const newHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    const plistData = fs.readFileSync(infoPlistPath, 'utf8');
    const parsed = plist.parse(plistData);
    if (parsed?.ElectronAsarIntegrity?.['Resources/app.asar']) {
        parsed.ElectronAsarIntegrity['Resources/app.asar'].hash = newHash;
        fs.writeFileSync(infoPlistPath, plist.build(parsed));
    }
}

function restoreMacAppState(asarPath, infoPlistPath, appPath) {
    updateMacAsarIntegrity(asarPath, infoPlistPath);
    if (appPath) reSignMacApp(appPath);
}

async function restoreClaude() {
    console.log('');
    const spinner = ora('Restoring original Claude app...').start();
    if (!fs.existsSync(BACKUP_PATH)) {
        spinner.fail(chalk.red('No backup found! Claude is already in its original state.'));
        process.exit(1);
    }
    const originalInfoPlist = isMac && INFO_PLIST_PATH && fs.existsSync(INFO_PLIST_PATH)
        ? fs.readFileSync(INFO_PLIST_PATH)
        : null;
    try {
        fs.copyFileSync(BACKUP_PATH, ASAR_PATH);
        if (isMac && INFO_PLIST_PATH) {
            // The backup is the source of truth after a restore; update the
            // Electron integrity entry and make the bundle launchable again.
            restoreMacAppState(ASAR_PATH, INFO_PLIST_PATH, CLAUDE_APP_PATH);
        }
        spinner.succeed(chalk.green('Original Claude restored successfully!'));
        console.log(chalk.gray('Restart Claude to see the changes.'));
    } catch(e) {
        if (originalInfoPlist) fs.writeFileSync(INFO_PLIST_PATH, originalInfoPlist);
        spinner.fail(chalk.red('Failed to restore backup: ' + e.message));
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
    const cssPayload = fontOnly ? CSS_INJECT_FONT_ONLY : CSS_INJECT_FULL;
    const jsPayload = `
// Injected for Persian/Arabic/Hebrew support
try { 
  require('electron/renderer').webFrame.insertCSS(\`${cssPayload.replace(/\n/g, ' ')}\`); 
  console.log("%c✨ ${fontOnly ? 'Vazirmatn font applied' : 'RTL applied'} by Rick Sanchez and Vazirmatn font used in memory of Saber Rastikerdar ✨", "color: #00e5ff; font-size: 14px; font-weight: bold; background: #222; padding: 5px; border-radius: 5px;");
} catch(e) {}
`;
    console.log('');
    if (autoNote) console.log(chalk.blue(`[i] ${autoNote}`));

    // Windows MSIX/AppX installs live under WindowsApps, which is owned by
    // TrustedInstaller and isn't writable even as Administrator. Worse, MSIX
    // has its own package-integrity verification, so even a forced write is
    // likely to get silently reverted by Windows. Fail fast with a clear
    // explanation instead of a confusing EPERM mid-backup (see issue #6).
    if (isWin && isWindowsAppsPath(ASAR_PATH)) {
        console.error(chalk.red('[!] Claude Desktop appears to be installed as an MSIX/AppX package:'));
        console.error(chalk.red(`    ${ASAR_PATH}`));
        console.log(chalk.yellow('This location is locked by Windows (TrustedInstaller-owned) and is not writable,'));
        console.log(chalk.yellow('even as Administrator. MSIX packages also carry their own integrity checks that'));
        console.log(chalk.yellow('can silently revert in-place patches even if the write succeeded.'));
        console.log(chalk.yellow('This tool currently does not support MSIX installs of Claude Desktop on Windows.'));
        process.exit(1);
    }

    if (!fs.existsSync(ASAR_PATH)) {
        console.error(chalk.red(`[!] Claude app not found at ${ASAR_PATH}.`));
        console.log(chalk.yellow('If you installed Claude in a custom location, you can pass the path as an argument:'));
        console.log(chalk.yellow('npx claude-rtl-patcher /your/custom/path/to/Claude'));
        process.exit(1);
    }

    let spinner = ora('Creating backup of original app...').start();
    try {
        if (!fs.existsSync(BACKUP_PATH)) fs.copyFileSync(ASAR_PATH, BACKUP_PATH);
        spinner.succeed(chalk.green('Backup created (or already exists).'));
    } catch (e) {
        spinner.fail(chalk.red('Backup failed!'));
        console.error(e);
        process.exit(1);
    }

    if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });

    spinner = ora('Extracting app.asar...').start();
    try {
        asar.extractAll(ASAR_PATH, TEMP_DIR);
        spinner.succeed(chalk.green('App extracted successfully.'));
    } catch(e) {
        spinner.fail(chalk.red('Extraction failed. Restoring backup...'));
        fs.copyFileSync(BACKUP_PATH, ASAR_PATH);
        process.exit(1);
    }

    spinner = ora('Injecting RTL styles and Vazirmatn font...').start();
    try {
        const injectIntoFiles = (dir) => {
            if (!fs.existsSync(dir)) return;
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const fullPath = path.join(dir, file);
                if (fs.statSync(fullPath).isDirectory()) {
                    injectIntoFiles(fullPath);
                } else if (fullPath.endsWith('.css')) {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    if (!content.includes('Vazirmatn')) fs.appendFileSync(fullPath, cssPayload);
                } else if (fullPath.endsWith('.js')) {
                    if (fullPath.includes('mainView') || fullPath.includes('mainWindow') || fullPath.includes('buddy') || fullPath.includes('quickWindow') || fullPath.includes('aboutWindow') || fullPath.includes('findInPage')) {
                        const content = fs.readFileSync(fullPath, 'utf8');
                        if (!content.includes('Saber Rastikerdar')) fs.appendFileSync(fullPath, jsPayload);
                    }
                }
            }
        };

        injectIntoFiles(path.join(TEMP_DIR, '.vite', 'build'));
        injectIntoFiles(path.join(TEMP_DIR, '.vite', 'renderer'));
        spinner.succeed(chalk.green('Styles successfully injected!'));
    } catch(e) {
        spinner.fail(chalk.red('Patching failed. Restoring backup...'));
        fs.copyFileSync(BACKUP_PATH, ASAR_PATH);
        process.exit(1);
    }

    spinner = ora('Repacking app.asar (this takes a few seconds)...').start();
    try {
        await asar.createPackageWithOptions(TEMP_DIR, ASAR_PATH, { unpack: '{*.node,*.dylib,spawn-helper}' });
        spinner.succeed(chalk.green('App repacked.'));
    } catch(e) {
        spinner.fail(chalk.red('Packing failed. Restoring backup...'));
        fs.copyFileSync(BACKUP_PATH, ASAR_PATH);
        process.exit(1);
    }

    if (isMac && INFO_PLIST_PATH) {
        spinner = ora('Updating macOS security hashes and bypassing Gatekeeper...').start();
        const originalInfoPlist = fs.existsSync(INFO_PLIST_PATH)
            ? fs.readFileSync(INFO_PLIST_PATH)
            : null;
        try {
            updateMacAsarIntegrity(ASAR_PATH, INFO_PLIST_PATH);
            
            // Re-sign the entire bundle ad-hoc and verify it. Do not hide failures:
            // an unsigned or partially signed app cannot launch on Apple Silicon.
            reSignMacApp(CLAUDE_APP_PATH);
            spinner.succeed(chalk.green('macOS Security passed!'));
        } catch(e) {
            spinner.fail(chalk.red('Security bypass failed. Restoring backup...'));
            fs.copyFileSync(BACKUP_PATH, ASAR_PATH);
            if (originalInfoPlist) fs.writeFileSync(INFO_PLIST_PATH, originalInfoPlist);
            process.exit(1);
        }
    }

    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    
    console.log('\n=================================================');
    if (fontOnly) {
        console.log(chalk.bold.green('✨ DONE! Vazirmatn font applied (RTL/direction left untouched).'));
    } else {
        console.log(chalk.bold.green('✨ DONE! Claude is now optimized for RTL languages!'));
    }
    console.log(chalk.gray('Please FULLY RESTART Claude to apply changes.'));
    console.log('=================================================\n');
}

async function main() {
    console.log(chalk.cyan(figlet.textSync('Claude RTL', { horizontalLayout: 'full' })));
    console.log(chalk.bold.blue('        Global Patcher by Rick Sanchez'));
    console.log('\n');

    if (isRestoreFlag) {
        await restoreClaude();
        return;
    }
    if (isPatchFlag || isFontOnlyFlag || isForceFullFlag) {
        await patchClaude();
        return;
    }

    // Interactive CLI Menu
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                { name: '🔍 Auto-detect (recommended — font-only on new Claude, full RTL patch on old)', value: 'auto' },
                { name: '✨ Force Full RTL Patch & Vazirmatn Font (Persian/Arabic/Hebrew)', value: 'patch' },
                { name: '🔤 Force Vazirmatn Font Only (no RTL/direction changes)', value: 'font-only' },
                { name: '⏪ Restore Original Claude (Remove Patch)', value: 'restore' },
                { name: '❌ Exit', value: 'exit' }
            ]
        }
    ]);

    if (answers.action === 'auto') {
        await patchClaude();
    } else if (answers.action === 'patch') {
        await patchClaude(false);
    } else if (answers.action === 'font-only') {
        await patchClaude(true); // force font-only payload regardless of CLI flags
    } else if (answers.action === 'restore') {
        await restoreClaude();
    } else {
        console.log(chalk.yellow('Goodbye!'));
        process.exit(0);
    }
}

main().catch(err => {
    console.error(chalk.red('\n[!] UNEXPECTED ERROR: ' + err.message));
    if (fs.existsSync(BACKUP_PATH)) fs.copyFileSync(BACKUP_PATH, ASAR_PATH);
    console.log(chalk.yellow('\nClaude app has been restored to safety.'));
    process.exit(1);
});
