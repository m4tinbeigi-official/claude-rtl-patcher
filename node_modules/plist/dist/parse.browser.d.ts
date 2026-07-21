export type PlistValue = string | number | boolean | Date | Uint8Array | PlistValue[] | {
    [key: string]: PlistValue;
} | null;
/**
 * Parses a Plist XML string. Returns an Object.
 *
 * @param xml - the XML String to decode
 * @returns the decoded value from the Plist XML
 */
export declare function parse(xml: string | Uint8Array | ArrayBuffer): PlistValue;
//# sourceMappingURL=parse.browser.d.ts.map