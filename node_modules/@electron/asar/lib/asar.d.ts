import { FilesystemEntry } from './filesystem.js';
import { InputMetadata } from './disk.js';
import { CrawledFileType } from './crawlfs.js';
import { GlobOptionsWithFileTypesFalse } from 'glob';
export declare function createPackage(src: string, dest: string): Promise<void>;
export type CreateOptions = {
    dot?: boolean;
    globOptions?: GlobOptionsWithFileTypesFalse;
    /**
     * Path to a file containing the list of relative filepaths relative to `src` and the specific order they should be inserted into the asar.
     * Formats allowed below:
     *   filepath
     *   : filepath
     *   <anything>:filepath
     */
    ordering?: string;
    pattern?: string;
    transform?: (filePath: string) => NodeJS.ReadWriteStream | void;
    unpack?: string;
    unpackDir?: string;
};
export declare function createPackageWithOptions(src: string, dest: string, options: CreateOptions): Promise<void>;
/**
 * Create an ASAR archive from a list of filenames.
 *
 * @param src - Base path. All files are relative to this.
 * @param dest - Archive filename (& path).
 * @param filenames - List of filenames relative to src.
 * @param [metadata] - Object with filenames as keys and {type='directory|file|link', stat: fs.stat} as values. (Optional)
 * @param [options] - Options passed to `createPackageWithOptions`.
 */
export declare function createPackageFromFiles(src: string, dest: string, filenames: string[], metadata?: InputMetadata, options?: CreateOptions): Promise<void>;
export type AsarStream = {
    /**
      Relative path to the file or directory from within the archive
    */
    path: string;
    /**
      Function that returns a read stream for a file.
      Note: this is called multiple times per "file", so a new NodeJS.ReadableStream needs to be created each time
    */
    streamGenerator: () => NodeJS.ReadableStream;
    /**
      Whether the file/link should be unpacked
    */
    unpacked: boolean;
    stat: CrawledFileType['stat'];
};
export type AsarDirectory = Pick<AsarStream, 'path' | 'unpacked'> & {
    type: 'directory';
};
export type AsarSymlinkStream = AsarStream & {
    type: 'link';
    symlink: string;
};
export type AsarFileStream = AsarStream & {
    type: 'file';
};
export type AsarStreamType = AsarDirectory | AsarFileStream | AsarSymlinkStream;
/**
 * Create an ASAR archive from a list of streams.
 *
 * @param dest - Archive filename (& path).
 * @param streams - List of streams to be piped in-memory into asar filesystem. Insertion order is preserved.
 */
export declare function createPackageFromStreams(dest: string, streams: AsarStreamType[]): Promise<void>;
export declare function statFile(archivePath: string, filename: string, followLinks?: boolean): FilesystemEntry;
export declare function getRawHeader(archivePath: string): import("./disk.js").ArchiveHeader;
export interface ListOptions {
    isPack: boolean;
}
export declare function listPackage(archivePath: string, options: ListOptions): string[];
export declare function extractFile(archivePath: string, filename: string, followLinks?: boolean): Buffer;
export declare function extractAll(archivePath: string, dest: string): void;
export { uncacheAll, uncacheFilesystem as uncache, FileRecord, DirectoryRecord } from './disk.js';
