const fontCss = require('../font.js');

const CSS_INJECT_FULL = `
/* RTL and Vazirmatn Font Patch */
${fontCss}
*:not(svg):not(svg *):not(i):not([class*="icon" i]):not([class*="Icon"]):not([class*="lucide" i]):not([class*="codicon" i]):not([aria-hidden="true"]):not(pre):not(pre *):not(code):not(code *):not(kbd):not(kbd *):not(samp):not(samp *):not(.monaco-editor .view-lines):not(.monaco-editor .view-lines *):not(.cm-editor .cm-scroller):not(.cm-editor .cm-scroller *):not([class*="token" i]):not([class*="token" i] *):not([class*="hljs" i]):not([class*="hljs" i] *):not([class*="mtk" i]):not([class*="mtk" i] *):not([class*="katex" i]):not([class*="katex" i] *) {
    font-family: 'Vazirmatn', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
}

/* Monospace and code preservation: strictly protect code blocks, inline code, and editor tokens */
pre,
pre *,
code,
code *,
kbd,
kbd *,
samp,
samp *,
.monaco-editor .view-lines,
.monaco-editor .view-lines *,
.cm-editor .cm-scroller,
.cm-editor .cm-scroller *,
[class*="token" i],
[class*="token" i] *,
[class*="hljs" i],
[class*="hljs" i] *,
[class*="mtk" i],
[class*="mtk" i] * {
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "DejaVu Sans Mono", "Ubuntu Mono", "Noto Sans Mono", "Courier New", monospace !important;
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
*:not(svg):not(svg *):not(i):not([class*="icon" i]):not([class*="Icon"]):not([class*="lucide" i]):not([class*="codicon" i]):not([aria-hidden="true"]):not(pre):not(pre *):not(code):not(code *):not(kbd):not(kbd *):not(samp):not(samp *):not(.monaco-editor .view-lines):not(.monaco-editor .view-lines *):not(.cm-editor .cm-scroller):not(.cm-editor .cm-scroller *):not([class*="token" i]):not([class*="token" i] *):not([class*="hljs" i]):not([class*="hljs" i] *):not([class*="mtk" i]):not([class*="mtk" i] *):not([class*="katex" i]):not([class*="katex" i] *) {
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
.monaco-editor .view-lines,
.monaco-editor .view-lines *,
.cm-editor .cm-scroller,
.cm-editor .cm-scroller *,
[class*="token" i],
[class*="token" i] *,
[class*="hljs" i],
[class*="hljs" i] *,
[class*="mtk" i],
[class*="mtk" i] * {
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "DejaVu Sans Mono", "Ubuntu Mono", "Noto Sans Mono", "Courier New", monospace !important;
}
`;

module.exports = { CSS_INJECT_FULL, CSS_INJECT_FONT_ONLY };
