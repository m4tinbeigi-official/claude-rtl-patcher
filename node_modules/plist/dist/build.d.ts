import type { PlistValue } from './parse.js';
export interface BuildOptions {
    pretty?: boolean;
    indent?: string;
    newline?: string;
    [key: string]: unknown;
}
/**
 * Generate an XML plist string from the input object `obj`.
 *
 * @param obj - the object to convert
 * @param opts - optional options object
 * @returns converted plist XML string
 */
export declare function build(obj: PlistValue, opts?: BuildOptions): string;
//# sourceMappingURL=build.d.ts.map