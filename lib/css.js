const { getFontCss } = require('./font');

function buildCssPayload(options = {}) {
    const fontCss = options.fontCss || getFontCss(options.customFontBuffer);
    const fontOnly = !!options.fontOnly;

    if (fontOnly) {
        return `
/* Vazirmatn Font Patch (font-only, no RTL/bidi changes) */
${fontCss}

/* Apply Vazirmatn font ONLY to RTL containers and elements (Persian/Arabic content),
   strictly excluding code blocks, monospace tokens, buttons, and thinking processes */
[dir="rtl"]:not(pre):not(pre *):not(code):not(code *):not(.monaco-editor *):not(.cm-editor *):not([class*="thinking" i] *):not(button *):not([role="button"] *):not([data-cds*="icon" i]):not([class*="icon" i]):not(svg *),
html[data-claude-rtl="force"] p:not(pre *):not(code *):not(.monaco-editor *):not(.cm-editor *):not([class*="thinking" i] *):not(button *):not([role="button"] *):not([data-cds*="icon" i]):not([class*="icon" i]):not(svg *),
html[data-claude-rtl="force"] li:not(pre *):not(code *):not(.monaco-editor *):not(.cm-editor *):not([class*="thinking" i] *):not(button *):not([role="button"] *):not([data-cds*="icon" i]):not([class*="icon" i]):not(svg *),
html[data-claude-rtl="force"] h1:not(button *):not([role="button"] *),
html[data-claude-rtl="force"] h2:not(button *):not([role="button"] *),
html[data-claude-rtl="force"] h3:not(button *):not([role="button"] *),
html[data-claude-rtl="force"] h4:not(button *):not([role="button"] *),
html[data-claude-rtl="force"] h5:not(button *):not([role="button"] *),
html[data-claude-rtl="force"] h6:not(button *):not([role="button"] *),
html[data-claude-rtl="force"] blockquote,
[contenteditable][dir="rtl"],
[contenteditable][dir="rtl"] p {
    font-family: var(--claude-rtl-custom-font, 'Vazirmatn'), 'Vazirmatn', system-ui, sans-serif !important;
}

/* Monospace preservation */
pre,
pre *:not([data-cds*="icon" i]):not([class*="icon" i]):not([class*="Icon"]):not([class*="codicon" i]):not([class*="Anthropicons" i]):not(svg):not(svg *):not(button *),
code,
code *:not([data-cds*="icon" i]):not([class*="icon" i]):not([class*="Icon"]):not([class*="codicon" i]):not([class*="Anthropicons" i]):not(svg):not(svg *):not(button *),
.code-block__code,
.code-block__code *,
[class*="code-block" i],
[class*="code-block" i] *,
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

/* Hard protection for Claude icons, CDS glyphs, and SVGs */
[data-cds="Icon"]:not(svg),
[data-cds*="icon" i]:not(svg),
[class*="Anthropicons" i],
[class*="_icon_" i],
span[data-cds="Icon"] {
    font-family: var(--font-anthropicons, Anthropicons-Variable) !important;
    font-feature-settings: "liga" 0 !important;
    font-style: normal !important;
    direction: ltr !important;
    text-align: left !important;
    unicode-bidi: isolate !important;
    flex-shrink: 0;
}

[class*="codicon" i],
.codicon {
    font-family: codicon !important;
    font-style: normal !important;
    direction: ltr !important;
    text-align: left !important;
    unicode-bidi: isolate !important;
    flex-shrink: 0;
}

svg,
svg *,
i,
[class*="icon" i]:not(svg),
[class*="Icon"]:not(svg),
[class*="lucide" i],
[data-icon] {
    direction: ltr !important;
    text-align: left !important;
    unicode-bidi: isolate !important;
    flex-shrink: 0;
}
`;
    }

    return `
/* RTL and Vazirmatn Font Patch */
${fontCss}

/* Apply Vazirmatn font ONLY to RTL containers and elements (Persian/Arabic content),
   strictly excluding code blocks, monospace tokens, buttons, and thinking processes */
[dir="rtl"]:not(pre):not(pre *):not(code):not(code *):not(.monaco-editor *):not(.cm-editor *):not([class*="thinking" i] *):not(button *):not([role="button"] *):not([data-cds*="icon" i]):not([class*="icon" i]):not(svg *),
html[data-claude-rtl="force"] p:not(pre *):not(code *):not(.monaco-editor *):not(.cm-editor *):not([class*="thinking" i] *):not(button *):not([role="button"] *):not([data-cds*="icon" i]):not([class*="icon" i]):not(svg *),
html[data-claude-rtl="force"] li:not(pre *):not(code *):not(.monaco-editor *):not(.cm-editor *):not([class*="thinking" i] *):not(button *):not([role="button"] *):not([data-cds*="icon" i]):not([class*="icon" i]):not(svg *),
html[data-claude-rtl="force"] h1:not(button *):not([role="button"] *),
html[data-claude-rtl="force"] h2:not(button *):not([role="button"] *),
html[data-claude-rtl="force"] h3:not(button *):not([role="button"] *),
html[data-claude-rtl="force"] h4:not(button *):not([role="button"] *),
html[data-claude-rtl="force"] h5:not(button *):not([role="button"] *),
html[data-claude-rtl="force"] h6:not(button *):not([role="button"] *),
html[data-claude-rtl="force"] blockquote,
[contenteditable][dir="rtl"],
[contenteditable][dir="rtl"] p {
    font-family: var(--claude-rtl-custom-font, 'Vazirmatn'), 'Vazirmatn', system-ui, sans-serif !important;
}

/* Monospace and code preservation: strictly protect code blocks, inline code, and editor tokens */
pre,
pre *:not([data-cds*="icon" i]):not([class*="icon" i]):not([class*="Icon"]):not([class*="codicon" i]):not([class*="Anthropicons" i]):not(svg):not(svg *):not(button *),
code,
code *:not([data-cds*="icon" i]):not([class*="icon" i]):not([class*="Icon"]):not([class*="codicon" i]):not([class*="Anthropicons" i]):not(svg):not(svg *):not(button *),
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


/* Dynamic RTL typography variables & global font stack integration */
:root {
  --claude-rtl-font-size: 16px;
  --claude-rtl-line-height: 1.65;
  --font-claude-response: var(--claude-rtl-custom-font, 'Vazirmatn'), var(--font-anthropic-serif, ui-serif, Georgia, serif);
  --font-user-message: var(--claude-rtl-custom-font, 'Vazirmatn'), var(--font-ui, var(--font-anthropic-sans, sans-serif));
}

/* Stable typography for all message content to eliminate streaming layout shifts (Jitter/FOUT) */
.font-claude-response-body,
p, li {
  font-family: var(--claude-rtl-custom-font, 'Vazirmatn'), var(--font-claude-response);
  line-height: var(--claude-rtl-line-height);
}

[dir="rtl"] p,
[dir="rtl"] li,
html[data-claude-rtl="force"] p,
html[data-claude-rtl="force"] li {
  overflow: visible !important;
}

/* Ensure message containers and text elements never clip descending Persian glyphs or trailing words */
[dir="rtl"] p,
[dir="rtl"] li,
[dir="rtl"] span,
[dir="rtl"] blockquote,
[dir="rtl"] h1,
[dir="rtl"] h2,
[dir="rtl"] h3,
[dir="rtl"] h4,
[dir="rtl"] h5,
[dir="rtl"] h6 {
  overflow-wrap: break-word;
}

/* In-App Floating RTL Widget Styles */
#claude-rtl-widget {
  position: fixed;
  bottom: 18px;
  right: 18px;
  z-index: 999990;
  font-family: var(--claude-rtl-custom-font, CustomPersianFont), Vazirmatn, system-ui, sans-serif;
  direction: rtl;
  user-select: none;
}

#claude-rtl-widget-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(30, 35, 45, 0.88);
  border: 1px solid rgba(88, 166, 255, 0.35);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  color: #58a6ff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(8px);
}

#claude-rtl-widget-btn:hover {
  transform: scale(1.08);
  background: rgba(40, 48, 62, 0.95);
  border-color: #58a6ff;
  box-shadow: 0 6px 20px rgba(88, 166, 255, 0.25);
}

#claude-rtl-widget-panel {
  position: absolute;
  bottom: 44px;
  right: 0;
  width: 250px;
  background: rgba(22, 27, 34, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
  padding: 14px 16px;
  backdrop-filter: blur(14px);
  color: #e6edf3;
  display: flex;
  flex-direction: column;
  gap: 12px;
  opacity: 0;
  transform: translateY(12px) scale(0.95);
  pointer-events: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: bottom right;
}

#claude-rtl-widget:hover #claude-rtl-widget-panel,
#claude-rtl-widget.is-open #claude-rtl-widget-panel {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

.claude-rtl-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  gap: 8px;
}

.claude-rtl-label {
  font-weight: 500;
  color: #8b949e;
}

.claude-rtl-select,
.claude-rtl-input {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #f0f6fc;
  border-radius: 6px;
  padding: 3px 8px;
  font-size: 11px;
  font-family: inherit;
  outline: none;
}

.claude-rtl-slider {
  width: 100px;
  accent-color: #58a6ff;
  cursor: pointer;
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

/* Base table cell styling */
th, td {
    padding: 8px 14px;
    vertical-align: middle;
}

/* Explicit RTL for Persian tables and in Force RTL mode */
[dir="rtl"] table,
table[dir="rtl"],
html[data-claude-rtl="force"] table {
    direction: rtl !important;
}

[dir="rtl"] th,
[dir="rtl"] td,
table[dir="rtl"] th,
table[dir="rtl"] td,
th[dir="rtl"],
td[dir="rtl"],
html[data-claude-rtl="force"] th,
html[data-claude-rtl="force"] td {
    direction: rtl !important;
    text-align: right !important;
    unicode-bidi: isolate !important;
    font-family: var(--claude-rtl-custom-font, 'Vazirmatn'), 'Vazirmatn', system-ui, sans-serif !important;
}

/* Cells containing code/monospace still stay LTR */
[dir="rtl"] td code,
table[dir="rtl"] td code,
html[data-claude-rtl="force"] td code {
    direction: ltr !important;
    text-align: left !important;
    unicode-bidi: isolate !important;
}

/* RTL List Margins & Markers (strictly scoped to content, excluding navigation menus, sidebars, and headers) */
ul[dir="rtl"]:not(nav *):not([role="navigation"] *):not(aside *):not(header *),
ol[dir="rtl"]:not(nav *):not([role="navigation"] *):not(aside *):not(header *),
[dir="rtl"] ul:not(nav *):not([role="navigation"] *):not(aside *):not(header *),
[dir="rtl"] ol:not(nav *):not([role="navigation"] *):not(aside *):not(header *),
html[data-claude-rtl="force"] ul:not(nav *):not([role="navigation"] *):not(aside *):not(header *):not(button *):not([role="button"] *),
html[data-claude-rtl="force"] ol:not(nav *):not([role="navigation"] *):not(aside *):not(header *):not(button *):not([role="button"] *) {
    direction: rtl !important;
    padding-left: 0 !important;
    padding-right: 1.5rem !important;
}

li[dir="rtl"]:not(nav *):not([role="navigation"] *):not(aside *):not(header *),
[dir="rtl"] li:not(nav *):not([role="navigation"] *):not(aside *):not(header *),
html[data-claude-rtl="force"] li:not(nav *):not([role="navigation"] *):not(aside *):not(header *):not(button *):not([role="button"] *) {
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

/* Explicit RTL for content elements with dir="rtl" */
[dir="rtl"]:not(pre):not(pre *):not(code):not(code *):not([class*="code" i] *):not(svg):not(button):not(button *):not([role="button"]):not([role="button"] *):not([class*="thinking" i]):not([class*="thought" i]):not([class*="reasoning" i]):not([class*="katex" i]) {
    direction: rtl !important;
    text-align: right !important;
    unicode-bidi: isolate !important;
}

/* Smart Auto Mode */
html[data-claude-rtl="auto"] p,
html[data-claude-rtl="auto"] li,
html[data-claude-rtl="auto"] blockquote,
html[data-claude-rtl="auto"] h1,
html[data-claude-rtl="auto"] h2,
html[data-claude-rtl="auto"] h3,
html[data-claude-rtl="auto"] h4,
html[data-claude-rtl="auto"] h5,
html[data-claude-rtl="auto"] h6,
html[data-claude-rtl="auto"] textarea,
html[data-claude-rtl="auto"] input,
html[data-claude-rtl="auto"] .ProseMirror,
html[data-claude-rtl="auto"] [contenteditable],
html:not([data-claude-rtl]) p,
html:not([data-claude-rtl]) li,
html:not([data-claude-rtl]) blockquote,
html:not([data-claude-rtl]) h1,
html:not([data-claude-rtl]) h2,
html:not([data-claude-rtl]) h3,
html:not([data-claude-rtl]) h4,
html:not([data-claude-rtl]) h5,
html:not([data-claude-rtl]) h6,
html:not([data-claude-rtl]) textarea,
html:not([data-claude-rtl]) input,
html:not([data-claude-rtl]) .ProseMirror,
html:not([data-claude-rtl]) [contenteditable] {
    unicode-bidi: plaintext !important;
    text-align: start !important;
}

/* Force RTL Mode: forces content paragraphs, lists, and inputs to right-aligned RTL */
html[data-claude-rtl="force"] p:not(pre *):not(code *):not(button *):not([role="button"] *):not([data-cds*="icon" i]):not([class*="icon" i]):not(svg *),
html[data-claude-rtl="force"] li:not(pre *):not(code *):not(button *):not([role="button"] *):not([data-cds*="icon" i]):not([class*="icon" i]):not(svg *),
html[data-claude-rtl="force"] ul:not(button *):not([role="button"] *),
html[data-claude-rtl="force"] ol:not(button *):not([role="button"] *),
html[data-claude-rtl="force"] blockquote,
html[data-claude-rtl="force"] h1:not(button *):not([role="button"] *),
html[data-claude-rtl="force"] h2:not(button *):not([role="button"] *),
html[data-claude-rtl="force"] h3:not(button *):not([role="button"] *),
html[data-claude-rtl="force"] h4:not(button *):not([role="button"] *),
html[data-claude-rtl="force"] h5:not(button *):not([role="button"] *),
html[data-claude-rtl="force"] h6:not(button *):not([role="button"] *),
html[data-claude-rtl="force"] textarea,
html[data-claude-rtl="force"] input,
html[data-claude-rtl="force"] .ProseMirror,
html[data-claude-rtl="force"] [contenteditable] {
    direction: rtl !important;
    text-align: right !important;
    unicode-bidi: isolate !important;
}

/* Hard protection for Claude icons, CDS glyphs, and SVGs */
[data-cds="Icon"]:not(svg),
[data-cds*="icon" i]:not(svg),
[class*="Anthropicons" i],
[class*="_icon_" i],
span[data-cds="Icon"] {
    font-family: var(--font-anthropicons, Anthropicons-Variable) !important;
    font-feature-settings: "liga" 0 !important;
    font-style: normal !important;
    direction: ltr !important;
    text-align: left !important;
    unicode-bidi: isolate !important;
    flex-shrink: 0;
}

[class*="codicon" i],
.codicon {
    font-family: codicon !important;
    font-style: normal !important;
    direction: ltr !important;
    text-align: left !important;
    unicode-bidi: isolate !important;
    flex-shrink: 0;
}

svg,
svg *,
i,
[class*="icon" i]:not(svg),
[class*="Icon"]:not(svg),
[class*="lucide" i],
[data-icon],
[aria-hidden="true"]:not(div):not(section):not(article):not(main):not(body) {
    direction: ltr !important;
    text-align: left !important;
    unicode-bidi: isolate !important;
    flex-shrink: 0;
}

button > svg,
button > [data-cds="Icon"],
button > [class*="icon" i],
button > [class*="lucide" i],
button > [class*="codicon" i],
[role="button"] > svg,
[role="button"] > [data-cds="Icon"],
[role="button"] > [class*="icon" i] {
    direction: ltr !important;
    unicode-bidi: isolate !important;
}

button,
[role="button"] {
    unicode-bidi: isolate;
}

/* Strict LTR and Left-Alignment Isolation for Code Blocks, Line Tokens, and Wrappers */
pre,
pre *,
code,
code *,
.code-block__code,
.code-block__code *,
[class*="code-block" i],
[class*="code-block" i] *,
[class*="code__" i],
[class*="code__" i] *,
[class*="epitaxy" i],
[class*="epitaxy" i] *,
[class*="token" i],
[class*="token" i] *,
[class*="hljs" i],
[class*="hljs" i] *,
[class*="mtk" i],
[class*="mtk" i] *,
.monaco-editor,
.monaco-editor *,
.cm-editor,
.cm-editor *,
[class*="group/copy"],
[class*="group/copy"] *,
[data-code-text],
[data-code-text] *,
[class*="match-parent"] {
    direction: ltr !important;
    text-align: left !important;
    unicode-bidi: isolate !important;
}

/* Ensure the codeblock container in lists or RTL contexts stays left-aligned and full width */
[dir="rtl"] [class*="group/copy"],
[dir="rtl"] pre,
[dir="rtl"] [class*="epitaxy-codeblock" i] {
    direction: ltr !important;
    text-align: left !important;
    unicode-bidi: isolate !important;
    margin-left: 0 !important;
    margin-right: auto !important;
}
`;
}

const CSS_INJECT_FULL = buildCssPayload({ fontOnly: false });
const CSS_INJECT_FONT_ONLY = buildCssPayload({ fontOnly: true });

module.exports = { buildCssPayload, CSS_INJECT_FULL, CSS_INJECT_FONT_ONLY };
