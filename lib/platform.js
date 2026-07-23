const path = require('path');

function pathApiFor(platform) {
    return platform === 'win32' ? path.win32 : path.posix;
}

function resolveAppPaths({ customPath, platform = process.platform, env = process.env }) {
    const pathApi = pathApiFor(platform);
    const isMac = platform === 'darwin';
    let appPath;
    let resourcesPath;
    let asarPath;

    if (customPath) {
        if (pathApi.basename(customPath).toLowerCase() === 'app.asar') {
            asarPath = customPath;
            resourcesPath = pathApi.dirname(asarPath);
            appPath = isMac && pathApi.basename(pathApi.dirname(resourcesPath)) === 'Contents'
                ? pathApi.dirname(pathApi.dirname(resourcesPath))
                : pathApi.dirname(resourcesPath);
        } else {
            appPath = customPath;
            resourcesPath = isMac
                ? pathApi.join(appPath, 'Contents', 'Resources')
                : pathApi.join(appPath, 'resources');
            asarPath = pathApi.join(resourcesPath, 'app.asar');
        }
    } else if (isMac) {
        appPath = '/Applications/Claude.app';
        resourcesPath = pathApi.join(appPath, 'Contents', 'Resources');
        asarPath = pathApi.join(resourcesPath, 'app.asar');
    } else if (platform === 'win32') {
        appPath = pathApi.join(env.LOCALAPPDATA || env.APPDATA || '', 'Programs', 'Claude');
        resourcesPath = pathApi.join(appPath, 'resources');
        asarPath = pathApi.join(resourcesPath, 'app.asar');
    } else if (platform === 'linux') {
        appPath = '/opt/Claude';
        resourcesPath = pathApi.join(appPath, 'resources');
        asarPath = pathApi.join(resourcesPath, 'app.asar');
    } else {
        throw new Error('Auto-detection failed. Please provide the path to your Claude installation manually.');
    }

    return {
        appPath,
        resourcesPath,
        asarPath,
        backupPath: pathApi.join(resourcesPath, 'app.asar.bak'),
        infoPlistPath: isMac ? pathApi.join(appPath, 'Contents', 'Info.plist') : null
    };
}

function isWindowsAppsPath(filePath) {
    return /(?:^|[\\/])WindowsApps(?:[\\/]|$)/i.test(filePath);
}

module.exports = { resolveAppPaths, isWindowsAppsPath };
