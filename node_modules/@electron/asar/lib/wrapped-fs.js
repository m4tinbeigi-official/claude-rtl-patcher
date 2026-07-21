import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const fs = 'electron' in process.versions ? require('original-fs') : require('node:fs');
const promisifiedMethods = [
    'lstat',
    'mkdtemp',
    'readFile',
    'stat',
    'writeFile',
    'symlink',
    'readlink',
];
export const wrappedFs = Object.keys(fs).reduce((accum, method) => {
    return {
        ...accum,
        [method]: promisifiedMethods.includes(method) ? fs.promises[method] : fs[method],
    };
}, {
    // To make it more like fs-extra
    mkdirp: (dir) => fs.promises.mkdir(dir, { recursive: true }),
    mkdirpSync: (dir) => fs.mkdirSync(dir, { recursive: true }),
});
//# sourceMappingURL=wrapped-fs.js.map