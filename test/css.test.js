const test = require('node:test');
const assert = require('node:assert/strict');
const { CSS_INJECT_FULL, CSS_INJECT_FONT_ONLY } = require('../lib/css');

test('CSS_INJECT_FULL excludes SVGs, icons, and code from font override', () => {
    assert.match(CSS_INJECT_FULL, /:not\(svg\)/);
    assert.match(CSS_INJECT_FULL, /:not\(svg \*\)/);
    assert.match(CSS_INJECT_FULL, /:not\(i\)/);
    assert.match(CSS_INJECT_FULL, /:not\(\[class\*="icon" i\]\)/);
    assert.match(CSS_INJECT_FULL, /:not\(\[class\*="lucide" i\]\)/);
    assert.match(CSS_INJECT_FULL, /:not\(\[class\*="codicon" i\]\)/);
    assert.match(CSS_INJECT_FULL, /:not\(code\):not\(pre\)/);
});

test('CSS_INJECT_FONT_ONLY excludes SVGs, icons, and code from font override', () => {
    assert.match(CSS_INJECT_FONT_ONLY, /:not\(svg\)/);
    assert.match(CSS_INJECT_FONT_ONLY, /:not\(svg \*\)/);
    assert.match(CSS_INJECT_FONT_ONLY, /:not\(i\)/);
    assert.match(CSS_INJECT_FONT_ONLY, /:not\(\[class\*="icon" i\]\)/);
    assert.match(CSS_INJECT_FONT_ONLY, /:not\(\[class\*="lucide" i\]\)/);
    assert.match(CSS_INJECT_FONT_ONLY, /:not\(\[class\*="codicon" i\]\)/);
    assert.match(CSS_INJECT_FONT_ONLY, /:not\(code\):not\(pre\)/);
});

test('CSS_INJECT_FULL protects icons and SVGs from RTL bidi reordering and flipping', () => {
    assert.match(CSS_INJECT_FULL, /direction:\s*ltr\s*!important/);
    assert.match(CSS_INJECT_FULL, /unicode-bidi:\s*isolate\s*!important/);
    assert.match(CSS_INJECT_FULL, /text-align:\s*left\s*!important/);
});

test('CSS payloads do not contain single-line comments that could break minification', () => {
    const linesFull = CSS_INJECT_FULL.split('\n');
    const linesFontOnly = CSS_INJECT_FONT_ONLY.split('\n');

    for (const line of linesFull) {
        const trimmed = line.trim();
        assert.equal(trimmed.startsWith('//'), false, `Unexpected // comment in CSS_INJECT_FULL: ${trimmed}`);
    }

    for (const line of linesFontOnly) {
        const trimmed = line.trim();
        assert.equal(trimmed.startsWith('//'), false, `Unexpected // comment in CSS_INJECT_FONT_ONLY: ${trimmed}`);
    }
});
