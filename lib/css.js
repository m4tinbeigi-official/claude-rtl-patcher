const fontCss = require('../font.js');

const CSS_INJECT_FULL = `
/* RTL and Vazirmatn Font Patch */
${fontCss}
*:not(svg):not(svg *):not(i):not([class*="icon" i]):not([class*="Icon"]):not([class*="lucide" i]):not([class*="codicon" i]):not(pre):not(pre *):not(code):not(code *):not(kbd):not(kbd *):not(samp):not(samp *):not(.monaco-editor):not(.monaco-editor *):not(.cm-editor):not(.cm-editor *):not([class*="code-block" i]):not([class*="code-block" i] *):not([class*="codeblock" i]):not([class*="codeblock" i] *):not([class*="font-mono" i]):not([class*="font-mono" i] *):not([class*="katex" i]):not([class*="katex" i] *) {
    font-family: 'Vazirmatn', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
}

/* Monospace and code preservation: protect code blocks, inline code, and editor tokens */
pre,
pre *,
code,
code *,
kbd,
kbd *,
samp,
samp *,
.monaco-editor,
.monaco-editor *,
.cm-editor,
.cm-editor *,
[class*="code-block" i],
[class*="code-block" i] *,
[class*="codeblock" i],
[class*="codeblock" i] *,
[class*="font-mono" i],
[class*="font-mono" i] * {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace, 'Vazirmatn' !important;
    direction: ltr !important;
    text-align: left !important;
    unicode-bidi: isolate !important;
}

/* Math formula (KaTeX) preservation */
[class*="katex" i],
[class*="katex" i] * {
    direction: ltr !important;
    text-align: left !important;
    unicode-bidi: isolate !important;
}

/* RTL text alignment for content containers */
p, h1, h2, h3, h4, h5, h6, textarea, input, .ProseMirror, [contenteditable] {
    unicode-bidi: plaintext !important;
    text-align: start !important;
}

/* Protect all icons and SVGs from RTL bidi reordering, clipping, and font overrides */
svg,
svg *,
i,
[class*="icon" i],
[class*="Icon"],
[class*="lucide" i],
[class*="codicon" i],
[aria-hidden="true"]:not(div):not(section):not(article):not(main):not(body) {
    direction: ltr !important;
    text-align: left !important;
    unicode-bidi: isolate !important;
    flex-shrink: 0;
}

button > svg,
button > [class*="icon" i],
button > [class*="lucide" i] {
    direction: ltr !important;
    unicode-bidi: isolate !important;
}
`;

// Font-only variant: just swaps the typeface, no direction/bidi changes.
// Useful on newer Claude builds that already ship native RTL support and only
// need the Vazirmatn font applied on top of it.
const CSS_INJECT_FONT_ONLY = `
/* Vazirmatn Font Patch (font-only, no RTL/bidi changes) */
${fontCss}
*:not(svg):not(svg *):not(i):not([class*="icon" i]):not([class*="Icon"]):not([class*="lucide" i]):not([class*="codicon" i]):not(pre):not(pre *):not(code):not(code *):not(kbd):not(kbd *):not(samp):not(samp *):not(.monaco-editor):not(.monaco-editor *):not(.cm-editor):not(.cm-editor *):not([class*="code-block" i]):not([class*="code-block" i] *):not([class*="codeblock" i]):not([class*="codeblock" i] *):not([class*="font-mono" i]):not([class*="font-mono" i] *):not([class*="katex" i]):not([class*="katex" i] *) {
    font-family: 'Vazirmatn', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
}

pre,
pre *,
code,
code *,
kbd,
kbd *,
samp,
samp *,
.monaco-editor,
.monaco-editor *,
.cm-editor,
.cm-editor *,
[class*="code-block" i],
[class*="code-block" i] *,
[class*="codeblock" i],
[class*="codeblock" i] *,
[class*="font-mono" i],
[class*="font-mono" i] * {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace, 'Vazirmatn' !important;
}
`;

module.exports = { CSS_INJECT_FULL, CSS_INJECT_FONT_ONLY };
