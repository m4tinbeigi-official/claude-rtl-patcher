#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const asar = require('@electron/asar');
const plist = require('plist');
const crypto = require('crypto');
const { execSync } = require('child_process');

const CLAUDE_APP_PATH = '/Applications/Claude.app';
const RESOURCES_PATH = path.join(CLAUDE_APP_PATH, 'Contents', 'Resources');
const ASAR_PATH = path.join(RESOURCES_PATH, 'app.asar');
const UNPACKED_DIR = path.join(RESOURCES_PATH, 'app.asar.unpacked');
const INFO_PLIST_PATH = path.join(CLAUDE_APP_PATH, 'Contents', 'Info.plist');
const TEMP_DIR = path.join(require('os').tmpdir(), 'claude-rtl-patcher-temp');

const CSS_INJECT = `
/* RTL and Vazirmatn Font Patch */
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700;800&display=swap');
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

function error(msg) {
    console.error(`[!] ${msg}`);
    process.exit(1);
}

function runCmd(cmd) {
    try {
        execSync(cmd, { stdio: 'inherit' });
    } catch (err) {
        error(`Command failed: ${cmd}`);
    }
}

async function patch() {
    log('Starting Claude RTL Patch...');

    if (!fs.existsSync(ASAR_PATH)) {
        error(`Claude app not found at ${CLAUDE_APP_PATH}. Make sure it's installed in Applications.`);
    }

    if (fs.existsSync(TEMP_DIR)) {
        fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    }

    log('Extracting app.asar...');
    asar.extractAll(ASAR_PATH, TEMP_DIR);

    log('Patching files for RTL and Font support...');
    
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

    log('Backing up original app.asar...');
    if (!fs.existsSync(`${ASAR_PATH}.bak`)) {
        fs.copyFileSync(ASAR_PATH, `${ASAR_PATH}.bak`);
    }

    log('Repacking app.asar (this may take a minute)...');
    // We must unpack native modules to prevent "Integrity check failed" or native module load errors
    await asar.createPackageWithOptions(TEMP_DIR, ASAR_PATH, {
        unpack: '{*.node,*.dylib,spawn-helper}'
    });

    log('Calculating new ASAR hash...');
    const fileBuffer = fs.readFileSync(ASAR_PATH);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    const newHash = hashSum.digest('hex');
    log(`New ASAR hash: ${newHash}`);

    log('Updating Info.plist with new integrity hash...');
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

    log('Bypassing Gatekeeper and Code Signing...');
    // We must run codesign to remove signature, otherwise macOS crashes the app
    runCmd(`codesign --remove-signature "${CLAUDE_APP_PATH}" || true`);
    runCmd(`xattr -cr "${CLAUDE_APP_PATH}" || true`);

    log('Cleaning up temporary files...');
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });

    log('✨ Done! RTL applied by Rick Sanchez and Vazirmatn font used in memory of Saber Rastikerdar.');
    log('Please fully restart the Claude app (Cmd+Q) to see the changes.');
}

patch().catch(err => {
    console.error(err);
    process.exit(1);
});
