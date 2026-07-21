import { GlobOptionsWithFileTypesFalse } from 'glob';
import { Stats } from 'node:fs';
export type CrawledFileType = {
    type: 'file' | 'directory' | 'link';
    stat: Pick<Stats, 'mode' | 'size'>;
    transformed?: {
        path: string;
        stat: Stats;
    };
    cachedBuffer?: Buffer;
};
export declare function determineFileType(filename: string): Promise<CrawledFileType | null>;
export declare function crawl(dir: string, options: GlobOptionsWithFileTypesFalse): Promise<readonly [string[], Record<string, CrawledFileType>]>;
