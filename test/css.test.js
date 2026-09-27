const test = require('node:test');
const assert = require('node:assert/strict');
const { getFontCss } = require('../lib/font');
const fontCss = getFontCss();
const { CSS_INJECT_FULL, CSS_INJECT_FONT_ONLY } = require('../lib/css');
const { getRuntimeScript } = require('../lib/runtime');

test('lib/font defines Vazirmatn Variable font-weight 100 900 and unicode-range', () => {
    assert.match(fontCss, /font-weight:\s*100\s*900/);
    assert.match(fontCss, /unicode-range:/);
    assert.match(fontCss, /U\+0600-06FF/);
    assert.match(fontCss, /U\+200C/); // ZWNJ
});

test('CSS_INJECT_FULL scopes Vazirmatn font to RTL elements to protect English chats', () => {
    assert.match(CSS_INJECT_FULL, /\[dir="rtl"\]/);
    assert.match(CSS_INJECT_FULL, /\[dir="rtl"\] p/);
    assert.match(CSS_INJECT_FULL, /html\[data-claude-rtl="force"\] p/);
    assert.match(CSS_INJECT_FULL, /font-family:\s*'Vazirmatn'/);
    // Must NOT have a universal wildcard font override * { font-family: 'Vazirmatn' !important; }
    assert.doesNotMatch(CSS_INJECT_FULL, /^\s*\*\s*\{[^}]*font-family:\s*'Vazirmatn'/m);
});

test('CSS_INJECT_FONT_ONLY scopes Vazirmatn font to RTL elements', () => {
    assert.match(CSS_INJECT_FONT_ONLY, /\[dir="rtl"\]/);
    assert.match(CSS_INJECT_FONT_ONLY, /html\[data-claude-rtl="force"\] p/);
    assert.match(CSS_INJECT_FONT_ONLY, /font-family:\s*'Vazirmatn'/);
});

test('code blocks and inline code are explicitly preserved with monospace font and LTR', () => {
    assert.match(CSS_INJECT_FULL, /pre,\s*pre \*/);
    assert.match(CSS_INJECT_FULL, /code,\s*code \*/);
    assert.match(CSS_INJECT_FULL, /\.code-block__code/);
    assert.match(CSS_INJECT_FULL, /\[class\*="code-block" i\]/);
    assert.match(CSS_INJECT_FULL, /\[class\*="group\/copy"\]/);
    assert.match(CSS_INJECT_FULL, /\[class\*="epitaxy" i\]/);
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

test('Thinking / reasoning blocks are preserved with LTR direction and isolation', () => {
    assert.match(CSS_INJECT_FULL, /\[class\*="thinking" i\]/);
    assert.match(CSS_INJECT_FULL, /\[class\*="thought" i\]/);
    assert.match(CSS_INJECT_FULL, /\[class\*="reasoning" i\]/);
    assert.match(CSS_INJECT_FULL, /\[data-testid\*="thinking" i\]/);
});

test('Markdown tables have proper RTL alignment rules', () => {
    assert.match(CSS_INJECT_FULL, /table\s*\{/);
    assert.match(CSS_INJECT_FULL, /th,\s*td\s*\{/);
    assert.match(CSS_INJECT_FULL, /html\[data-claude-rtl="force"\] table/);
});

test('RTL lists and list items have correct padding and direction', () => {
    assert.match(CSS_INJECT_FULL, /ul\[dir="rtl"\]/);
    assert.match(CSS_INJECT_FULL, /ol\[dir="rtl"\]/);
    assert.match(CSS_INJECT_FULL, /li\[dir="rtl"\]/);
    assert.match(CSS_INJECT_FULL, /padding-right:\s*1\.5rem\s*!important/);
    assert.match(CSS_INJECT_FULL, /list-style-position:\s*outside\s*!important/);
});

test('Force RTL mode rule covers paragraphs, lists, list items, headings, blockquotes', () => {
    assert.match(CSS_INJECT_FULL, /html\[data-claude-rtl="force"\] p/);
    assert.match(CSS_INJECT_FULL, /html\[data-claude-rtl="force"\] li/);
    assert.match(CSS_INJECT_FULL, /html\[data-claude-rtl="force"\] ul/);
    assert.match(CSS_INJECT_FULL, /html\[data-claude-rtl="force"\] ol/);
    assert.match(CSS_INJECT_FULL, /html\[data-claude-rtl="force"\] blockquote/);
    assert.match(CSS_INJECT_FULL, /html\[data-claude-rtl="force"\] textarea/);
});

test('CSS_INJECT_FULL protects icons and SVGs from RTL bidi reordering and clipping', () => {
    assert.match(CSS_INJECT_FULL, /direction:\s*ltr\s*!important/);
    assert.match(CSS_INJECT_FULL, /unicode-bidi:\s*isolate\s*!important/);
    assert.match(CSS_INJECT_FULL, /text-align:\s*left\s*!important/);
});

test('Claude Anthropicons and icon fonts are strictly protected from monospace and Vazirmatn font overrides', () => {
    assert.match(CSS_INJECT_FULL, /\[data-cds="Icon"\]/);
    assert.match(CSS_INJECT_FULL, /font-family:\s*var\(--font-anthropicons,\s*Anthropicons-Variable\)\s*!important/);
    assert.match(CSS_INJECT_FULL, /\[class\*="codicon" i\]/);
    assert.match(CSS_INJECT_FULL, /font-family:\s*codicon\s*!important/);
    assert.match(CSS_INJECT_FONT_ONLY, /\[data-cds="Icon"\]/);
    assert.match(CSS_INJECT_FONT_ONLY, /font-family:\s*var\(--font-anthropicons,\s*Anthropicons-Variable\)\s*!important/);
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

test('getRuntimeScript provides Alt+R shortcut, Shift+2 @ fix, updateDir, and toast notifications', () => {
    const script = getRuntimeScript();
    assert.match(script, /KeyR/);
    assert.match(script, /Digit2/);
    assert.match(script, /claude_rtl_mode/);
    assert.match(script, /claude-rtl-toast/);
    assert.match(script, /insertText/);
    assert.match(script, /updateDir/);
    assert.match(script, /MutationObserver/);
});

test('--claude-rtl-font-size is declared in :root and applied to RTL text elements', () => {
    assert.match(CSS_INJECT_FULL, /--claude-rtl-font-size:\s*16px;/);
    assert.match(CSS_INJECT_FULL, /font-size:\s*var\(--claude-rtl-font-size\)/);
    assert.match(CSS_INJECT_FONT_ONLY, /--claude-rtl-font-size:\s*16px;/);
    assert.match(CSS_INJECT_FONT_ONLY, /font-size:\s*var\(--claude-rtl-font-size\)/);
});

test('CSS_INJECT_FULL strictly scopes typography without un-scoped p, li selector', () => {
    assert.doesNotMatch(CSS_INJECT_FULL, /(^|\n)\s*p\s*,\s*li\s*\{/m);
    assert.doesNotMatch(CSS_INJECT_FULL, /(^|\n)\s*\.font-claude-response-body\s*,\s*p\s*,\s*li\s*\{/m);
});

test('floating widget styles are present in both full and font-only payloads', () => {
    assert.match(CSS_INJECT_FULL, /#claude-rtl-widget\s*\{/);
    assert.match(CSS_INJECT_FULL, /#claude-rtl-widget-btn/);
    assert.match(CSS_INJECT_FULL, /#claude-rtl-widget-panel/);
    assert.match(CSS_INJECT_FONT_ONLY, /#claude-rtl-widget\s*\{/);
    assert.match(CSS_INJECT_FONT_ONLY, /#claude-rtl-widget-btn/);
    assert.match(CSS_INJECT_FONT_ONLY, /#claude-rtl-widget-panel/);
});

test('Force RTL mode list rules strictly exclude navigation, sidebar, and headers', () => {
    assert.match(CSS_INJECT_FULL, /html\[data-claude-rtl="force"\] ul:not\([^)]*aside/);
    assert.match(CSS_INJECT_FULL, /html\[data-claude-rtl="force"\] ol:not\([^)]*aside/);
    assert.match(CSS_INJECT_FULL, /html\[data-claude-rtl="force"\] li:not\([^)]*aside/);
});

test('--font-user-message is declared and applied to RTL user messages', () => {
    assert.match(CSS_INJECT_FULL, /--font-user-message:\s*var\(--claude-rtl-custom-font/);
    assert.match(CSS_INJECT_FULL, /\.font-user-message\[dir="rtl"\]/);
    assert.match(CSS_INJECT_FULL, /font-family:\s*var\(--font-user-message\)/);
});
