import os from 'node:os';
import path from 'node:path';
import stream from 'node:stream/promises';
import { getFileIntegrity, getFileIntegrityFromBuffer } from './integrity.js';
import { wrappedFs as fs } from './wrapped-fs.js';
const UINT32_MAX = 2 ** 32 - 1;
// Files smaller than this use buffer-based integrity hashing (avoids stream overhead).
// Files larger than this use streaming to avoid holding large buffers in memory.
const BUFFER_HASH_THRESHOLD = 2 * 1024 * 1024; // 2MB
export class Filesystem {
    src;
    header;
    headerSize;
    offset;
    constructor(src) {
        this.src = path.resolve(src);
        this.header = { files: Object.create(null) };
        this.headerSize = 0;
        this.offset = BigInt(0);
    }
    getRootPath() {
        return this.src;
    }
    getHeader() {
        return this.header;
    }
    getHeaderSize() {
        return this.headerSize;
    }
    setHeader(header, headerSize) {
        this.header = header;
        this.headerSize = headerSize;
    }
    searchNodeFromDirectory(p) {
        let json = this.header;
        const dirs = p.split(path.sep);
        for (const dir of dirs) {
            if (dir !== '.') {
                if ('files' in json) {
                    if (!json.files[dir]) {
                        json.files[dir] = { files: Object.create(null) };
                    }
                    json = json.files[dir];
                }
                else {
                    throw new Error('Unexpected directory state while traversing: ' + p);
                }
            }
        }
        return json;
    }
    searchNodeFromPath(p) {
        p = path.relative(this.src, p);
        if (!p) {
            return this.header;
        }
        const name = path.basename(p);
        const node = this.searchNodeFromDirectory(path.dirname(p));
        if (!node.files) {
            node.files = Object.create(null);
        }
        if (!node.files[name]) {
            node.files[name] = Object.create(null);
        }
        return node.files[name];
    }
    insertDirectory(p, shouldUnpack) {
        const node = this.searchNodeFromPath(p);
        if (shouldUnpack) {
            node.unpacked = shouldUnpack;
        }
        node.files = node.files || Object.create(null);
        return node.files;
    }
    insertFile(p, streamGenerator, shouldUnpack, file, options = {}) {
        const dirNode = this.searchNodeFromPath(path.dirname(p));
        const node = this.searchNodeFromPath(p);
        if (shouldUnpack || dirNode.unpacked) {
            node.size = file.stat.size;
            node.unpacked = true;
            return getFileIntegrity(streamGenerator()).then((integrity) => {
                node.integrity = integrity;
            });
        }
        const transformed = options.transform && options.transform(p);
        if (transformed) {
            return this.insertFileAsync(p, streamGenerator, file, node, transformed);
        }
        const size = file.stat.size;
        // JavaScript cannot precisely present integers >= UINT32_MAX.
        if (size > UINT32_MAX) {
            throw new Error(`${p}: file size can not be larger than 4.2GB`);
        }
        node.size = size;
        node.offset = this.offset.toString();
        if (process.platform !== 'win32' && file.stat.mode & 0o100) {
            node.executable = true;
        }
        if (size <= BUFFER_HASH_THRESHOLD) {
            // Fully synchronous fast path — no Promise, no stream, no microtask yield
            try {
                const fileBuffer = fs.readFileSync(p);
                node.integrity = getFileIntegrityFromBuffer(fileBuffer);
                file.cachedBuffer = fileBuffer;
                this.offset += BigInt(size);
                return Promise.resolve();
            }
            catch {
                // Fall through to stream path
            }
        }
        return getFileIntegrity(streamGenerator()).then((integrity) => {
            node.integrity = integrity;
            this.offset += BigInt(size);
        });
    }
    async insertFileAsync(p, streamGenerator, file, node, transformed) {
        const tmpdir = await fs.mkdtemp(path.join(os.tmpdir(), 'asar-'));
        const tmpfile = path.join(tmpdir, path.basename(p));
        const out = fs.createWriteStream(tmpfile);
        await stream.pipeline(streamGenerator(), transformed, out);
        file.transformed = {
            path: tmpfile,
            stat: await fs.lstat(tmpfile),
        };
        const size = file.transformed.stat.size;
        if (size > UINT32_MAX) {
            throw new Error(`${p}: file size can not be larger than 4.2GB`);
        }
        node.size = size;
        node.offset = this.offset.toString();
        if (process.platform !== 'win32' && file.stat.mode & 0o100) {
            node.executable = true;
        }
        node.integrity = await getFileIntegrity(streamGenerator());
        this.offset += BigInt(size);
    }
    insertLink(p, shouldUnpack, parentPath = fs.realpathSync(path.dirname(p)), symlink = fs.readlinkSync(p), // /var/tmp => /private/var
    src = fs.realpathSync(this.src)) {
        const link = this.resolveLink(src, parentPath, symlink);
        if (link.startsWith('..')) {
            throw new Error(`${p}: file "${link}" links out of the package`);
        }
        const node = this.searchNodeFromPath(p);
        const dirNode = this.searchNodeFromPath(path.dirname(p));
        if (shouldUnpack || dirNode.unpacked) {
            node.unpacked = true;
        }
        node.link = link;
        return link;
    }
    resolveLink(src, parentPath, symlink) {
        const target = path.join(parentPath, symlink);
        const link = path.relative(src, target);
        return link;
    }
    listFiles(options) {
        const files = [];
        const fillFilesFromMetadata = function (basePath, metadata) {
            if (!('files' in metadata)) {
                return;
            }
            for (const [childPath, childMetadata] of Object.entries(metadata.files)) {
                const fullPath = path.join(basePath, childPath);
                const packState = 'unpacked' in childMetadata && childMetadata.unpacked ? 'unpack' : 'pack  ';
                files.push(options && options.isPack ? `${packState} : ${fullPath}` : fullPath);
                fillFilesFromMetadata(fullPath, childMetadata);
            }
        };
        fillFilesFromMetadata('/', this.header);
        return files;
    }
    getNode(p, followLinks = true) {
        const node = this.searchNodeFromDirectory(path.dirname(p));
        const name = path.basename(p);
        if ('link' in node && followLinks) {
            return this.getNode(path.join(node.link, name));
        }
        if (name) {
            return node.files[name];
        }
        else {
            return node;
        }
    }
    getFile(p, followLinks = true) {
        const info = this.getNode(p, followLinks);
        if (!info) {
            throw new Error(`"${p}" was not found in this archive`);
        }
        // if followLinks is false we don't resolve symlinks
        if ('link' in info && followLinks) {
            return this.getFile(info.link, followLinks);
        }
        else {
            return info;
        }
    }
}
//# sourceMappingURL=filesystem.js.map