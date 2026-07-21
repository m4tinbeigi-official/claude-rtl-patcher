#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const asar = require('@electron/asar');
const plist = require('plist');
const crypto = require('crypto');
const { execSync } = require('child_process');
const chalk = require('chalk');
const ora = require('ora');
const figlet = require('figlet');
const fontCss = require('./font.js');

const isMac = process.platform === 'darwin';
const isWin = process.platform === 'win32';

if (!isMac && !isWin) {
    console.error(chalk.red('[!] Unsupported OS. This patcher only supports macOS and Windows.'));
    process.exit(1);
}

let CLAUDE_APP_PATH, RESOURCES_PATH, INFO_PLIST_PATH;

if (isMac) {
    CLAUDE_APP_PATH = '/Applications/Claude.app';
    RESOURCES_PATH = path.join(CLAUDE_APP_PATH, 'Contents', 'Resources');
    INFO_PLIST_PATH = path.join(CLAUDE_APP_PATH, 'Contents', 'Info.plist');
} else {
    // Windows
    CLAUDE_APP_PATH = path.join(process.env.LOCALAPPDATA, 'Programs', 'Claude');
    RESOURCES_PATH = path.join(CLAUDE_APP_PATH, 'resources');
}

const ASAR_PATH = path.join(RESOURCES_PATH, 'app.asar');
const BACKUP_PATH = path.join(RESOURCES_PATH, 'app.asar.bak');
const TEMP_DIR = path.join(require('os').tmpdir(), 'claude-rtl-patcher-temp');

const isRestore = process.argv.includes('--restore');

const CSS_INJECT = `
/* RTL and Vazirmatn Font Patch */
${fontCss}
* { font-family: 'Vazirmatn', ui-sans-serif, system-ui, sans-serif !important; }
p, div, span, h1, h2, h3, h4, h5, h6, textarea, input, .ProseMirror, [contenteditable] { 
    unicode-bidi: plaintext !important; 
    text-align: start !important; 
}
`;

const JS_INJECT = `
// Injected for Persian support
try { 
  require('electron/renderer').webFrame.insertCSS(\`${CSS_INJECT.replace(/\n/g, ' ')}\`); 
  console.log("%c✨ RTL applied by Rick Sanchez and Vazirmatn font used in memory of Saber Rastikerdar ✨", "color: #00e5ff; font-size: 14px; font-weight: bold; background: #222; padding: 5px; border-radius: 5px;");
} catch(e) {}
`;

function runCmd(cmd) {
    try {
        execSync(cmd, { stdio: 'pipe' });
    } catch (err) {
        throw new Error(`Command failed: ${cmd}`);
    }
}

async function patch() {
    console.log(chalk.cyan(figlet.textSync('Claude RTL', { horizontalLayout: 'full' })));
    console.log(chalk.bold.blue('        Persian Patcher by Rick Sanchez'));
    console.log('\n');

    if (isRestore) {
        const spinner = ora('Restoring original Claude app...').start();
        if (!fs.existsSync(BACKUP_PATH)) {
            spinner.fail(chalk.red('No backup found! Claude is already in its original state.'));
            process.exit(1);
        }
        try {
            fs.copyFileSync(BACKUP_PATH, ASAR_PATH);
            spinner.succeed(chalk.green('Original Claude restored successfully!'));
            console.log(chalk.gray('Restart Claude to see the changes.'));
        } catch(e) {
            spinner.fail(chalk.red('Failed to restore backup: ' + e.message));
        }
        return;
    }

    if (!fs.existsSync(ASAR_PATH)) {
        console.error(chalk.red(`[!] Claude app not found at ${ASAR_PATH}. Please make sure it's installed.`));
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
                    if (!content.includes('Vazirmatn')) fs.appendFileSync(fullPath, CSS_INJECT);
                } else if (fullPath.endsWith('.js')) {
                    if (fullPath.includes('mainView') || fullPath.includes('mainWindow') || fullPath.includes('buddy') || fullPath.includes('quickWindow') || fullPath.includes('aboutWindow') || fullPath.includes('findInPage')) {
                        const content = fs.readFileSync(fullPath, 'utf8');
                        if (!content.includes('Saber Rastikerdar')) fs.appendFileSync(fullPath, JS_INJECT);
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

    if (isMac) {
        spinner = ora('Updating macOS security hashes and bypassing Gatekeeper...').start();
        try {
            const fileBuffer = fs.readFileSync(ASAR_PATH);
            const newHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

            if (fs.existsSync(INFO_PLIST_PATH)) {
                const plistData = fs.readFileSync(INFO_PLIST_PATH, 'utf8');
                const parsed = plist.parse(plistData);
                if (parsed?.ElectronAsarIntegrity?.['Resources/app.asar']) {
                    parsed.ElectronAsarIntegrity['Resources/app.asar'].hash = newHash;
                    fs.writeFileSync(INFO_PLIST_PATH, plist.build(parsed));
                }
            }
            
            runCmd(`codesign --remove-signature "${CLAUDE_APP_PATH}" || true`);
            runCmd(`xattr -cr "${CLAUDE_APP_PATH}" || true`);
            spinner.succeed(chalk.green('macOS Security passed!'));
        } catch(e) {
            spinner.fail(chalk.red('Security bypass failed. Restoring backup...'));
            fs.copyFileSync(BACKUP_PATH, ASAR_PATH);
            process.exit(1);
        }
    }

    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    
    console.log('\n=================================================');
    console.log(chalk.bold.green('✨ DONE! Claude is now optimized for Persian!'));
    console.log(chalk.gray('Please FULLY RESTART Claude to apply changes.'));
    console.log(chalk.gray('To revert changes anytime, run: npx claude-rtl-patcher --restore'));
    console.log('=================================================\n');
}

patch().catch(err => {
    console.error(chalk.red('\n[!] UNEXPECTED ERROR: ' + err.message));
    if (fs.existsSync(BACKUP_PATH)) fs.copyFileSync(BACKUP_PATH, ASAR_PATH);
    console.log(chalk.yellow('\nClaude app has been restored to safety.'));
    process.exit(1);
});
