const fs = require('fs');
const path = require('path');

// Recursively collects POSIX-style relative paths of every file inside
// `dir`. Used to read the *existing* app.asar.unpacked tree so we know
// exactly which files Electron's own build already decided must live on
// disk as real files (native binaries, helpers, etc.) rather than inside
// the asar archive.
function collectUnpackedRelativePaths(dir, base = dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results = results.concat(collectUnpackedRelativePaths(fullPath, base));
        } else {
            results.push(path.relative(base, fullPath).split(path.sep).join('/'));
        }
    }
    return results;
}

// Safe fallback defaults — kept for asar layouts where nothing is
// unpacked yet (shouldn't normally happen, but don't regress old behavior).
const DEFAULT_UNPACK_GLOBS = ['*.node', '*.dylib', 'spawn-helper'];

// Builds the `unpack` glob string for @electron/asar's createPackageWithOptions.
// Instead of a hardcoded extension list (which silently packs any native
// binary that doesn't match — e.g. the Claude Code CLI helper — INTO the
// archive, producing "Malformed Mach-o file" at spawn time), this unions the
// hardcoded safe defaults with every file that was ALREADY unpacked next to
// the original asar (Resources/app.asar.unpacked/...).
function computeUnpackGlob(asarPath) {
    const unpackedDir = `${asarPath}.unpacked`;
    const discovered = collectUnpackedRelativePaths(unpackedDir);
    const allPatterns = Array.from(new Set([
        ...DEFAULT_UNPACK_GLOBS,
        ...discovered.map(relPath => `**/${relPath}`)
    ]));
    return `{${allPatterns.join(',')}}`;
}

module.exports = { computeUnpackGlob, collectUnpackedRelativePaths };
