#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const asar = require('@electron/asar');
const plist = require('plist');
const crypto = require('crypto');
const { execSync } = require('child_process');
const fontCss = require('./font.js');

const CLAUDE_APP_PATH = '/Applications/Claude.app';
const RESOURCES_PATH = path.join(CLAUDE_APP_PATH, 'Contents', 'Resources');
const ASAR_PATH = path.join(RESOURCES_PATH, 'app.asar');
const BACKUP_PATH = path.join(RESOURCES_PATH, 'app.asar.bak');
const UNPACKED_DIR = path.join(RESOURCES_PATH, 'app.asar.unpacked');
const INFO_PLIST_PATH = path.join(CLAUDE_APP_PATH, 'Contents', 'Info.plist');
const TEMP_DIR = path.join(require('os').tmpdir(), 'claude-rtl-patcher-temp');

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

function log(msg) {
    console.log(`[+] ${msg}`);
}

function error(msg, step) {
    console.error(`[!] ERROR during ${step}: ${msg}`);
    restoreBackup();
    console.log(`\n======================================================`);
    console.log(`⚠️  PATCH FAILED! But don't worry, your Claude app is safe.`);
    console.log(`Please copy the following prompt and give it to Claude to fix this automatically:\n`);
    console.log(`"Claude RTL Patcher failed at step: ${step}. Error: ${msg.replace(/\n/g, ' ')}. Please write an updated index.js to handle this version."`);
    console.log(`======================================================\n`);
    process.exit(1);
}

function runCmd(cmd, step) {
    try {
        execSync(cmd, { stdio: 'inherit' });
    } catch (err) {
        error(`Command failed: ${cmd}`, step);
    }
}

function restoreBackup() {
    if (fs.existsSync(BACKUP_PATH)) {
        log('Restoring backup to ensure Claude still works...');
        try {
            fs.copyFileSync(BACKUP_PATH, ASAR_PATH);
            log('Backup restored successfully.');
        } catch(e) {
            console.error('[!] Failed to restore backup. You may need to reinstall Claude.');
        }
    }
}

async function patch() {
    log('Starting Claude RTL Patch...');

    if (!fs.existsSync(ASAR_PATH)) {
        error(`Claude app not found at ${CLAUDE_APP_PATH}. Make sure it's installed in Applications.`, 'Finding App');
    }

    if (fs.existsSync(TEMP_DIR)) {
        fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    }

    log('Backing up original app.asar...');
    try {
        if (!fs.existsSync(BACKUP_PATH)) {
            fs.copyFileSync(ASAR_PATH, BACKUP_PATH);
        }
    } catch (e) {
        error(e.message, 'Backup');
    }

    log('Extracting app.asar...');
    try {
        asar.extractAll(ASAR_PATH, TEMP_DIR);
    } catch(e) {
        error(e.message, 'Extraction');
    }

    log('Patching files for RTL and Font support...');
    
    try {
        // Dynamically find CSS and JS files to support different versions of Claude
        const injectIntoFiles = (dir) => {
            if (!fs.existsSync(dir)) return;
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const fullPath = path.join(dir, file);
                if (fs.statSync(fullPath).isDirectory()) {
                    injectIntoFiles(fullPath);
                } else if (fullPath.endsWith('.css')) {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    if (!content.includes('Vazirmatn')) {
                        fs.appendFileSync(fullPath, CSS_INJECT);
                    }
                } else if (fullPath.endsWith('.js')) {
                    // Only target the main preload scripts to avoid breaking things
                    if (fullPath.includes('mainView') || fullPath.includes('mainWindow') || fullPath.includes('buddy') || fullPath.includes('quickWindow') || fullPath.includes('aboutWindow') || fullPath.includes('findInPage')) {
                        const content = fs.readFileSync(fullPath, 'utf8');
                        if (!content.includes('Saber Rastikerdar')) {
                            fs.appendFileSync(fullPath, JS_INJECT);
                        }
                    }
                }
            }
        };

        injectIntoFiles(path.join(TEMP_DIR, '.vite', 'build'));
        injectIntoFiles(path.join(TEMP_DIR, '.vite', 'renderer'));
    } catch(e) {
        error(e.message, 'Patching');
    }

    log('Repacking app.asar (this may take a minute)...');
    try {
        await asar.createPackageWithOptions(TEMP_DIR, ASAR_PATH, {
            unpack: '{*.node,*.dylib,spawn-helper}'
        });
    } catch(e) {
        error(e.message, 'Packing');
    }

    log('Calculating new ASAR hash...');
    let newHash = '';
    try {
        const fileBuffer = fs.readFileSync(ASAR_PATH);
        const hashSum = crypto.createHash('sha256');
        hashSum.update(fileBuffer);
        newHash = hashSum.digest('hex');
        log(`New ASAR hash: ${newHash}`);
    } catch(e) {
        error(e.message, 'Hashing');
    }

    log('Updating Info.plist with new integrity hash...');
    try {
        if (fs.existsSync(INFO_PLIST_PATH)) {
            const plistData = fs.readFileSync(INFO_PLIST_PATH, 'utf8');
            const parsed = plist.parse(plistData);
            if (parsed && parsed.ElectronAsarIntegrity && parsed.ElectronAsarIntegrity['Resources/app.asar']) {
                parsed.ElectronAsarIntegrity['Resources/app.asar'].hash = newHash;
                fs.writeFileSync(INFO_PLIST_PATH, plist.build(parsed));
            } else {
                log('ElectronAsarIntegrity not found in Info.plist. Skipping.');
            }
        }
    } catch(e) {
        error(e.message, 'Plist Update');
    }

    log('Bypassing Gatekeeper and Code Signing...');
    runCmd(`codesign --remove-signature "${CLAUDE_APP_PATH}" || true`, 'Code Sign Removal');
    runCmd(`xattr -cr "${CLAUDE_APP_PATH}" || true`, 'Quarantine Removal');

    log('Cleaning up temporary files...');
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });

    log('✨ Done! RTL applied by Rick Sanchez and Vazirmatn font used in memory of Saber Rastikerdar.');
    log('Please fully restart the Claude app (Cmd+Q) to see the changes.');
}

patch().catch(err => {
    error(err.message, 'Unknown');
});
