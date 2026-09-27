const path = require('path');
const fs = require('fs');

function pathApiFor(platform) {
    return platform === 'win32' ? path.win32 : path.posix;
}

const COMMON_LINUX_APP_PATHS = [
    '/usr/lib/claude-desktop',
    '/opt/claude-desktop',
    '/opt/Claude',
    '/usr/lib/claude',
    '/opt/claude'
];

function resolveAppPaths({ customPath, platform = process.platform, env = process.env, fileSystem = fs }) {
    const pathApi = pathApiFor(platform);
    const isMac = platform === 'darwin';
    let appPath;
    let resourcesPath;
    let asarPath;

    if (customPath) {
        const normalized = customPath.trim();
        if (pathApi.basename(normalized).toLowerCase() === 'app.asar') {
            asarPath = normalized;
            resourcesPath = pathApi.dirname(asarPath);
            appPath = isMac && pathApi.basename(pathApi.dirname(resourcesPath)) === 'Contents'
                ? pathApi.dirname(pathApi.dirname(resourcesPath))
                : pathApi.dirname(resourcesPath);
        } else {
            appPath = normalized;
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
        const userHome = env.HOME || '';
        const linuxCandidates = [
            ...COMMON_LINUX_APP_PATHS,
            pathApi.join(userHome, '.local', 'share', 'claude-desktop'),
            pathApi.join(userHome, '.local', 'share', 'Claude')
        ];

        let foundCandidate = linuxCandidates.find(candidate => {
            const candidateAsar = pathApi.join(candidate, 'resources', 'app.asar');
            return fileSystem.existsSync && fileSystem.existsSync(candidateAsar);
        });

        appPath = foundCandidate || COMMON_LINUX_APP_PATHS[0];
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

module.exports = { resolveAppPaths, isWindowsAppsPath, COMMON_LINUX_APP_PATHS };
