const fontCss = require('../font.js');

const CSS_INJECT_FULL = `
/* RTL and Vazirmatn Font Patch */
${fontCss}

/* Apply Vazirmatn font ONLY to RTL containers and elements (Persian/Arabic content),
   leaving English chats completely untouched with Claude's native typography */
[dir="rtl"],
[dir="rtl"] p,
[dir="rtl"] li,
[dir="rtl"] h1,
[dir="rtl"] h2,
[dir="rtl"] h3,
[dir="rtl"] h4,
[dir="rtl"] h5,
[dir="rtl"] h6,
[dir="rtl"] blockquote,
[dir="rtl"] span:not([class*="token" i]):not([class*="hljs" i]):not([class*="mtk" i]):not(svg *),
[dir="rtl"] div:not(pre *):not(code *):not([class*="code" i] *):not(svg *),
html[data-claude-rtl="force"] p,
html[data-claude-rtl="force"] li,
html[data-claude-rtl="force"] h1,
html[data-claude-rtl="force"] h2,
html[data-claude-rtl="force"] h3,
html[data-claude-rtl="force"] h4,
html[data-claude-rtl="force"] h5,
html[data-claude-rtl="force"] h6,
html[data-claude-rtl="force"] blockquote,
html[data-claude-rtl="force"] span:not([class*="token" i]):not([class*="hljs" i]):not([class*="mtk" i]):not(svg *),
html[data-claude-rtl="force"] div:not(pre *):not(code *):not([class*="code" i] *):not(svg *),
[contenteditable][dir="rtl"],
[contenteditable][dir="rtl"] * {
    font-family: 'Vazirmatn', system-ui, sans-serif !important;
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

/* RTL List Margins & Markers */
ul[dir="rtl"],
ol[dir="rtl"],
[dir="rtl"] ul,
[dir="rtl"] ol,
html[data-claude-rtl="force"] ul,
html[data-claude-rtl="force"] ol {
    direction: rtl !important;
    padding-left: 0 !important;
    padding-right: 1.5rem !important;
}

li[dir="rtl"],
[dir="rtl"] li,
html[data-claude-rtl="force"] li {
    direction: rtl !important;
    text-align: right !important;
    unicode-bidi: isolate !important;
    list-style-position: outside !important;
    margin-bottom: 0.35rem;
}

/* RTL Blockquotes */
blockquote[dir="rtl"],
[dir="rtl"] blockquote,
html[data-claude-rtl="force"] blockquote {
    direction: rtl !important;
    text-align: right !important;
    unicode-bidi: isolate !important;
    border-left: none !important;
    border-right: 3px solid rgba(255, 255, 255, 0.2) !important;
    padding-left: 0 !important;
    padding-right: 1rem !important;
}

/* Explicit RTL for any element with dir="rtl" */
[dir="rtl"]:not(pre):not(code):not(svg):not([class*="thinking" i]):not([class*="thought" i]):not([class*="reasoning" i]):not([class*="katex" i]) {
    direction: rtl !important;
    text-align: right !important;
    unicode-bidi: isolate !important;
}

/* RTL text alignment for content containers (Smart Auto Mode by default) */
html:not([data-claude-rtl="disabled"]) p,
html:not([data-claude-rtl="disabled"]) li,
html:not([data-claude-rtl="disabled"]) blockquote,
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

/* Force RTL Mode: forces all messages, lists, headings, and inputs to right-aligned RTL */
html[data-claude-rtl="force"] p,
html[data-claude-rtl="force"] li,
html[data-claude-rtl="force"] ul,
html[data-claude-rtl="force"] ol,
html[data-claude-rtl="force"] blockquote,
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

/* Apply Vazirmatn font ONLY to RTL containers and elements (Persian/Arabic content),
   leaving English chats completely untouched with Claude's native typography */
[dir="rtl"],
[dir="rtl"] p,
[dir="rtl"] li,
[dir="rtl"] h1,
[dir="rtl"] h2,
[dir="rtl"] h3,
[dir="rtl"] h4,
[dir="rtl"] h5,
[dir="rtl"] h6,
[dir="rtl"] blockquote,
[dir="rtl"] span:not([class*="token" i]):not([class*="hljs" i]):not([class*="mtk" i]):not(svg *),
[dir="rtl"] div:not(pre *):not(code *):not([class*="code" i] *):not(svg *),
html[data-claude-rtl="force"] p,
html[data-claude-rtl="force"] li,
html[data-claude-rtl="force"] h1,
html[data-claude-rtl="force"] h2,
html[data-claude-rtl="force"] h3,
html[data-claude-rtl="force"] h4,
html[data-claude-rtl="force"] h5,
html[data-claude-rtl="force"] h6,
html[data-claude-rtl="force"] blockquote,
html[data-claude-rtl="force"] span:not([class*="token" i]):not([class*="hljs" i]):not([class*="mtk" i]):not(svg *),
html[data-claude-rtl="force"] div:not(pre *):not(code *):not([class*="code" i] *):not(svg *),
[contenteditable][dir="rtl"],
[contenteditable][dir="rtl"] * {
    font-family: 'Vazirmatn', system-ui, sans-serif !important;
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
