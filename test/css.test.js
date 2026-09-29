const test = require('node:test');
const assert = require('node:assert/strict');
const fontCss = require('../font.js');
const { CSS_INJECT_FULL, CSS_INJECT_FONT_ONLY } = require('../lib/css');

test('font.js defines unicode-range to prevent overriding Latin/English characters', () => {
    assert.match(fontCss, /unicode-range:/);
    assert.match(fontCss, /U\+0600-06FF/);
    assert.match(fontCss, /U\+200C/); // ZWNJ
});

test('CSS_INJECT_FULL excludes SVGs, icons, and code from general font override', () => {
    assert.match(CSS_INJECT_FULL, /:not\(svg\)/);
    assert.match(CSS_INJECT_FULL, /:not\(svg \*\)/);
    assert.match(CSS_INJECT_FULL, /:not\(i\)/);
    assert.match(CSS_INJECT_FULL, /:not\(\[class\*="icon" i\]\)/);
    assert.match(CSS_INJECT_FULL, /:not\(\[class\*="lucide" i\]\)/);
    assert.match(CSS_INJECT_FULL, /:not\(\[class\*="codicon" i\]\)/);
    assert.match(CSS_INJECT_FULL, /:not\(\[aria-hidden="true"\]\)/);
    assert.match(CSS_INJECT_FULL, /:not\(pre\):not\(pre \*\):not\(code\):not\(code \*\)/);
    assert.match(CSS_INJECT_FULL, /:not\(\.monaco-editor \.view-lines\)/);
    assert.match(CSS_INJECT_FULL, /:not\(\[class\*="katex" i\]\)/);
});

test('CSS_INJECT_FONT_ONLY excludes SVGs, icons, and code from general font override', () => {
    assert.match(CSS_INJECT_FONT_ONLY, /:not\(svg\)/);
    assert.match(CSS_INJECT_FONT_ONLY, /:not\(svg \*\)/);
    assert.match(CSS_INJECT_FONT_ONLY, /:not\(i\)/);
    assert.match(CSS_INJECT_FONT_ONLY, /:not\(\[class\*="icon" i\]\)/);
    assert.match(CSS_INJECT_FONT_ONLY, /:not\(\[class\*="lucide" i\]\)/);
    assert.match(CSS_INJECT_FONT_ONLY, /:not\(\[class\*="codicon" i\]\)/);
    assert.match(CSS_INJECT_FONT_ONLY, /:not\(\[aria-hidden="true"\]\)/);
    assert.match(CSS_INJECT_FONT_ONLY, /:not\(pre\):not\(pre \*\):not\(code\):not\(code \*\)/);
    assert.match(CSS_INJECT_FONT_ONLY, /:not\(\.monaco-editor \.view-lines\)/);
    assert.match(CSS_INJECT_FONT_ONLY, /:not\(\[class\*="katex" i\]\)/);
});

test('code blocks and inline code are explicitly preserved with monospace font and LTR', () => {
    assert.match(CSS_INJECT_FULL, /pre,\s*pre \*/);
    assert.match(CSS_INJECT_FULL, /code,\s*code \*/);
    assert.match(CSS_INJECT_FULL, /ui-monospace/);
    assert.match(CSS_INJECT_FULL, /SFMono-Regular/);
    assert.match(CSS_INJECT_FULL, /DejaVu Sans Mono/);
    assert.match(CSS_INJECT_FULL, /Ubuntu Mono/);
    assert.match(CSS_INJECT_FULL, /direction:\s*ltr\s*!important/);
    assert.match(CSS_INJECT_FULL, /text-align:\s*left\s*!important/);
    assert.match(CSS_INJECT_FULL, /unicode-bidi:\s*isolate\s*!important/);
    assert.doesNotMatch(CSS_INJECT_FULL, /ui-monospace[^\n;]+Vazirmatn/);
});

test('KaTeX math formulas are preserved with LTR direction and isolation', () => {
    assert.match(CSS_INJECT_FULL, /\[class\*="katex" i\],\s*\[class\*="katex" i\] \*/);
    assert.match(CSS_INJECT_FULL, /direction:\s*ltr\s*!important/);
});

test('CSS_INJECT_FULL protects icons and SVGs from RTL bidi reordering and clipping', () => {
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
