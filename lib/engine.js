const fs = require('fs');
const path = require('path');
const asar = require('@electron/asar');
const crypto = require('crypto');
const plist = require('plist');

const { buildCssPayload } = require('./css');
const { getRuntimeScript } = require('./runtime');
const { computeUnpackGlob } = require('./unpack');
const { updateMacAsarIntegrity, reSignMacApp } = require('./macos');
const { disableAsarIntegrityFuse } = require('./fuses');

const isMac = process.platform === 'darwin';

const BOOTSTRAP_JS_FILES = new Set([
    'mainView.js', 'mainWindow.js', 'buddy.js',
    'quickWindow.js', 'aboutWindow.js', 'findInPage.js'
]);

function createBackup(asarPath, backupPath) {
    if (!fs.existsSync(asarPath)) {
        throw new Error(`Target app.asar not found at: ${asarPath}`);
    }
    if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(asarPath, backupPath);
        return true;
    }
    return false;
}

function restoreBackup(backupPath, asarPath, options = {}) {
    if (!fs.existsSync(backupPath)) {
        throw new Error(`Backup not found at: ${backupPath}`);
    }
    fs.copyFileSync(backupPath, asarPath);

    if (isMac && options.infoPlistPath && fs.existsSync(options.infoPlistPath)) {
        try {
            updateMacAsarIntegrity(asarPath, options.infoPlistPath);
            if (options.appPath) reSignMacApp(options.appPath);
        } catch (e) {}
    }
}

function extractPackage(sourcePath, extractDir) {
    if (fs.existsSync(extractDir)) {
        fs.rmSync(extractDir, { recursive: true, force: true });
    }
    fs.mkdirSync(extractDir, { recursive: true });
    asar.extractAll(sourcePath, extractDir);
}

function injectStylesAndRuntime(extractDir, options = {}) {
    const fontOnly = !!options.fontOnly;
    const cssPayload = buildCssPayload({ fontOnly, customFontBuffer: options.customFontBuffer });
    const runtimeScript = getRuntimeScript();

    const jsPayload = `
// Injected for Persian/Arabic/Hebrew support
try {
  require('electron/renderer').webFrame.insertCSS(${JSON.stringify(cssPayload)});
  console.log("%c✨ ${fontOnly ? 'Vazirmatn font applied' : 'RTL applied'} by Rick Sanchez and Vazirmatn font used in memory of Saber Rastikerdar ✨", "color: #00e5ff; font-size: 14px; font-weight: bold; background: #222; padding: 5px; border-radius: 5px;");
  ${runtimeScript}
} catch(e) {}
`;

    const injectIntoDir = (dir) => {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                injectIntoDir(fullPath);
            } else if (entry.name.endsWith('.css')) {
                let content = fs.readFileSync(fullPath, 'utf8');
                content = content.replace(/\/\*\s*RTL and Vazirmatn Font Patch[\s\S]*$/, '');
                content = content.replace(/\/\*\s*Vazirmatn Font Patch[\s\S]*$/, '');
                fs.writeFileSync(fullPath, content.trimEnd() + '\n' + cssPayload);
            } else if (entry.name.endsWith('.js') && BOOTSTRAP_JS_FILES.has(entry.name)) {
                let content = fs.readFileSync(fullPath, 'utf8');
                content = content.replace(/\/\/\s*Injected for Persian\/Arabic\/Hebrew support[\s\S]*$/, '');
                fs.writeFileSync(fullPath, content.trimEnd() + '\n' + jsPayload);
            }
        }
    };

    injectIntoDir(path.join(extractDir, '.vite', 'build'));
    injectIntoDir(path.join(extractDir, '.vite', 'renderer'));
}

async function repackPackage(extractDir, destinationAsar, unpackGlob) {
    await asar.createPackageWithOptions(extractDir, destinationAsar, { unpack: unpackGlob });
}

async function finalizeMacSecurity(appPath, asarPath, infoPlistPath) {
    if (!isMac || !infoPlistPath || !fs.existsSync(infoPlistPath)) return;

    updateMacAsarIntegrity(asarPath, infoPlistPath);
    await disableAsarIntegrityFuse(appPath);
    reSignMacApp(appPath);
}

module.exports = {
    createBackup,
    restoreBackup,
    extractPackage,
    injectStylesAndRuntime,
    repackPackage,
    finalizeMacSecurity,
    BOOTSTRAP_JS_FILES
};
