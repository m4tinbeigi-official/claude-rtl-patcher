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

/* Reasoning / Thinking Process / Extended Thinking Isolation */
[class*="thinking" i],
[class*="thinking" i] *,
[class*="thought" i],
[class*="thought" i] *,
[class*="reasoning" i],
[class*="reasoning" i] *,
[data-testid*="thinking" i],
[data-testid*="thinking" i] *,
details[class*="thinking" i],
details[class*="thinking" i] * {
    direction: ltr !important;
    text-align: left !important;
    unicode-bidi: isolate !important;
}

/* Markdown Tables RTL Optimization */
table {
    border-collapse: collapse;
}
th, td {
    unicode-bidi: plaintext;
    text-align: start;
    padding: 6px 12px;
}
[dir="rtl"] table,
table[dir="rtl"],
html[data-claude-rtl="force"] table {
    direction: rtl;
    text-align: right;
}

/* RTL text alignment for content containers (Smart Auto Mode by default) */
html:not([data-claude-rtl="disabled"]) p,
html:not([data-claude-rtl="disabled"]) h1,
html:not([data-claude-rtl="disabled"]) h2,
html:not([data-claude-rtl="disabled"]) h3,
html:not([data-claude-rtl="disabled"]) h4,
html:not([data-claude-rtl="disabled"]) h5,
html:not([data-claude-rtl="disabled"]) h6,
html:not([data-claude-rtl="disabled"]) textarea,
html:not([data-claude-rtl="disabled"]) input,
html:not([data-claude-rtl="disabled"]) .ProseMirror,
html:not([data-claude-rtl="disabled"]) [contenteditable] {
    unicode-bidi: plaintext !important;
    text-align: start !important;
}

/* Force RTL Mode: forces all messages and inputs to right-aligned RTL */
html[data-claude-rtl="force"] p,
html[data-claude-rtl="force"] h1,
html[data-claude-rtl="force"] h2,
html[data-claude-rtl="force"] h3,
html[data-claude-rtl="force"] h4,
html[data-claude-rtl="force"] h5,
html[data-claude-rtl="force"] h6,
html[data-claude-rtl="force"] textarea,
html[data-claude-rtl="force"] input,
html[data-claude-rtl="force"] .ProseMirror,
html[data-claude-rtl="force"] [contenteditable] {
    direction: rtl !important;
    text-align: right !important;
    unicode-bidi: isolate !important;
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
