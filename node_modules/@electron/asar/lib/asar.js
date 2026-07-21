import path from 'node:path';
import { minimatch } from 'minimatch';
import { wrappedFs as fs } from './wrapped-fs.js';
import { Filesystem } from './filesystem.js';
import { readArchiveHeaderSync, readFilesystemSync, readFileSync, streamFilesystem, writeFilesystem, } from './disk.js';
import { crawl as crawlFilesystem, determineFileType } from './crawlfs.js';
/**
 * Whether a directory should be excluded from packing due to the `--unpack-dir" option.
 *
 * @param dirPath - directory path to check
 * @param pattern - literal prefix [for backward compatibility] or glob pattern
 * @param unpackDirs - Array of directory paths previously marked as unpacked
 */
function isUnpackedDir(dirPath, pattern, unpackDirs) {
    if (dirPath.startsWith(pattern) || minimatch(dirPath, pattern)) {
        unpackDirs.add(dirPath);
        return true;
    }
    else {
        for (const unpackDir of unpackDirs) {
            if (dirPath.startsWith(unpackDir) && !path.relative(unpackDir, dirPath).startsWith('..')) {
                return true;
            }
        }
        return false;
    }
}
export async function createPackage(src, dest) {
    return createPackageWithOptions(src, dest, {});
}
export async function createPackageWithOptions(src, dest, options) {
    const globOptions = options.globOptions ? options.globOptions : {};
    globOptions.dot = options.dot === undefined ? true : options.dot;
    const pattern = src + (options.pattern ? options.pattern : '/**/*');
    const [filenames, metadata] = await crawlFilesystem(pattern, globOptions);
    return createPackageFromFiles(src, dest, filenames, metadata, options);
}
/**
 * Create an ASAR archive from a list of filenames.
 *
 * @param src - Base path. All files are relative to this.
 * @param dest - Archive filename (& path).
 * @param filenames - List of filenames relative to src.
 * @param [metadata] - Object with filenames as keys and {type='directory|file|link', stat: fs.stat} as values. (Optional)
 * @param [options] - Options passed to `createPackageWithOptions`.
 */
export async function createPackageFromFiles(src, dest, filenames, metadata = {}, options = {}) {
    src = path.normalize(src);
    dest = path.normalize(dest);
    filenames = filenames.map(function (filename) {
        return path.normalize(filename);
    });
    const filesystem = new Filesystem(src);
    const files = [];
    const links = [];
    const unpackDirs = new Set();
    let filenamesSorted = [];
    if (options.ordering) {
        const orderingFiles = (await fs.readFile(options.ordering))
            .toString()
            .split('\n')
            .map((line) => {
            if (line.includes(':')) {
                line = line.split(':').pop();
            }
            line = line.trim();
            if (line.startsWith('/')) {
                line = line.slice(1);
            }
            return line;
        });
        const ordering = [];
        for (const file of orderingFiles) {
            const pathComponents = file.split(path.sep);
            let str = src;
            for (const pathComponent of pathComponents) {
                str = path.join(str, pathComponent);
                ordering.push(str);
            }
        }
        let missing = 0;
        const total = filenames.length;
        const filenameSet = new Set(filenames);
        const sortedSet = new Set();
        for (const file of ordering) {
            if (!sortedSet.has(file) && filenameSet.has(file)) {
                filenamesSorted.push(file);
                sortedSet.add(file);
            }
        }
        for (const file of filenames) {
            if (!sortedSet.has(file)) {
                filenamesSorted.push(file);
                sortedSet.add(file);
                missing += 1;
            }
        }
        console.log(`Ordering file has ${((total - missing) / total) * 100}% coverage.`);
    }
    else {
        filenamesSorted = filenames;
    }
    const shouldUnpackPath = function (filename, relativePath, unpack, unpackDir) {
        let shouldUnpack = false;
        if (unpack) {
            shouldUnpack = minimatch(filename, unpack, { matchBase: true });
        }
        if (!shouldUnpack && unpackDir) {
            shouldUnpack = isUnpackedDir(relativePath, unpackDir, unpackDirs);
        }
        return shouldUnpack;
    };
    // Batch-resolve metadata for files missing it (parallelized)
    const missingMetadata = filenamesSorted.filter((f) => !metadata[f]);
    if (missingMetadata.length > 0) {
        const resolved = await Promise.all(missingMetadata.map(async (filename) => {
            const fileType = await determineFileType(filename);
            if (!fileType) {
                throw new Error('Unknown file type for file: ' + filename);
            }
            return [filename, fileType];
        }));
        for (const [filename, fileType] of resolved) {
            metadata[filename] = fileType;
        }
    }
    // Process files in original sorted order to preserve header key ordering
    for (const filename of filenamesSorted) {
        const file = metadata[filename];
        let shouldUnpack;
        switch (file.type) {
            case 'directory':
                shouldUnpack = shouldUnpackPath(filename, path.relative(src, filename), undefined, options.unpackDir);
                filesystem.insertDirectory(filename, shouldUnpack);
                break;
            case 'file':
                shouldUnpack = shouldUnpackPath(filename, path.relative(src, path.dirname(filename)), options.unpack, options.unpackDir);
                files.push({ filename, unpack: shouldUnpack });
                await filesystem.insertFile(filename, () => fs.createReadStream(filename), shouldUnpack, file, options);
                break;
            case 'link':
                shouldUnpack = shouldUnpackPath(filename, path.relative(src, filename), options.unpack, options.unpackDir);
                links.push({ filename, unpack: shouldUnpack });
                filesystem.insertLink(filename, shouldUnpack);
                break;
        }
    }
    await fs.mkdirp(path.dirname(dest));
    return writeFilesystem(dest, filesystem, { files, links }, metadata);
}
/**
 * Create an ASAR archive from a list of streams.
 *
 * @param dest - Archive filename (& path).
 * @param streams - List of streams to be piped in-memory into asar filesystem. Insertion order is preserved.
 */
export async function createPackageFromStreams(dest, streams) {
    // We use an ambiguous root `src` since we're piping directly from a stream and the `filePath` for the stream is already relative to the src/root
    const src = '.';
    const filesystem = new Filesystem(src);
    const files = [];
    const links = [];
    const handleFile = async function (stream) {
        const { path: destinationPath, type } = stream;
        const filename = path.normalize(destinationPath);
        switch (type) {
            case 'directory':
                filesystem.insertDirectory(filename, stream.unpacked);
                break;
            case 'file':
                files.push({
                    filename,
                    streamGenerator: stream.streamGenerator,
                    link: undefined,
                    mode: stream.stat.mode,
                    unpack: stream.unpacked,
                });
                return filesystem.insertFile(filename, stream.streamGenerator, stream.unpacked, {
                    type: 'file',
                    stat: stream.stat,
                });
            case 'link':
                links.push({
                    filename,
                    streamGenerator: stream.streamGenerator,
                    link: stream.symlink,
                    mode: stream.stat.mode,
                    unpack: stream.unpacked,
                });
                filesystem.insertLink(filename, stream.unpacked, path.dirname(filename), stream.symlink, src);
                break;
        }
        return Promise.resolve();
    };
    const insertsDone = async function () {
        await fs.mkdirp(path.dirname(dest));
        return streamFilesystem(dest, filesystem, { files, links });
    };
    const streamQueue = streams.slice();
    const next = async function (stream) {
        if (!stream) {
            return insertsDone();
        }
        await handleFile(stream);
        return next(streamQueue.shift());
    };
    return next(streamQueue.shift());
}
export function statFile(archivePath, filename, followLinks = true) {
    const filesystem = readFilesystemSync(archivePath);
    return filesystem.getFile(filename, followLinks);
}
export function getRawHeader(archivePath) {
    return readArchiveHeaderSync(archivePath);
}
export function listPackage(archivePath, options) {
    return readFilesystemSync(archivePath).listFiles(options);
}
export function extractFile(archivePath, filename, followLinks = true) {
    const filesystem = readFilesystemSync(archivePath);
    const fileInfo = filesystem.getFile(filename, followLinks);
    if ('link' in fileInfo || 'files' in fileInfo) {
        throw new Error('Expected to find file at: ' + filename + ' but found a directory or link');
    }
    return readFileSync(filesystem, filename, fileInfo);
}
export function extractAll(archivePath, dest) {
    const filesystem = readFilesystemSync(archivePath);
    const filenames = filesystem.listFiles();
    // under windows just extract links as regular files
    const followLinks = process.platform === 'win32';
    // create destination directory
    fs.mkdirpSync(dest);
    // Read the entire data section at once — one syscall instead of one per file.
    const headerSize = filesystem.getHeaderSize();
    const archiveSize = fs.statSync(archivePath).size;
    const dataStart = 8 + headerSize;
    const dataSize = archiveSize - dataStart;
    let dataBuf = null;
    if (dataSize > 0) {
        dataBuf = Buffer.alloc(dataSize);
        const fd = fs.openSync(archivePath, 'r');
        try {
            fs.readSync(fd, dataBuf, 0, dataSize, dataStart);
        }
        finally {
            fs.closeSync(fd);
        }
    }
    const extractionErrors = [];
    for (const fullPath of filenames) {
        // Remove leading slash
        const filename = fullPath.substr(1);
        const destFilename = path.join(dest, filename);
        const file = filesystem.getFile(filename, followLinks);
        if (path.relative(dest, destFilename).startsWith('..')) {
            throw new Error(`${fullPath}: file "${destFilename}" writes out of the package`);
        }
        if ('files' in file) {
            // it's a directory, create it and continue with the next entry
            fs.mkdirpSync(destFilename);
        }
        else if ('link' in file) {
            // it's a symlink, create a symlink
            const linkSrcPath = path.dirname(path.join(dest, file.link));
            const linkDestPath = path.dirname(destFilename);
            const relativePath = path.relative(linkDestPath, linkSrcPath);
            // try to delete output file, because we can't overwrite a link
            try {
                fs.unlinkSync(destFilename);
            }
            catch { }
            const linkTo = path.join(relativePath, path.basename(file.link));
            if (path.relative(dest, linkSrcPath).startsWith('..')) {
                throw new Error(`${fullPath}: file "${file.link}" links out of the package to "${linkSrcPath}"`);
            }
            fs.symlinkSync(linkTo, destFilename);
        }
        else {
            // it's a file, try to extract it
            try {
                let content;
                if (file.unpacked) {
                    content = fs.readFileSync(path.join(`${filesystem.getRootPath()}.unpacked`, filename));
                }
                else if (file.size <= 0) {
                    content = Buffer.alloc(0);
                }
                else {
                    // Slice from the pre-read data buffer — zero-copy view
                    const offset = parseInt(file.offset);
                    content = dataBuf.subarray(offset, offset + file.size);
                }
                fs.writeFileSync(destFilename, content);
                if (file.executable) {
                    fs.chmodSync(destFilename, '755');
                }
            }
            catch (e) {
                extractionErrors.push(e);
            }
        }
    }
    if (extractionErrors.length) {
        throw new Error('Unable to extract some files:\n\n' +
            extractionErrors.map((error) => error.stack).join('\n\n'));
    }
}
export { uncacheAll, uncacheFilesystem as uncache } from './disk.js';
//# sourceMappingURL=asar.js.map