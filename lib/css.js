const fontCss = require('../font.js');

const CSS_INJECT_FULL = `
/* RTL and Vazirmatn Font Patch */
${fontCss}
*:not(svg):not(svg *):not(i):not([class*="icon" i]):not([class*="Icon"]):not([class*="lucide" i]):not([class*="codicon" i]):not([aria-hidden="true"]):not(code):not(pre):not(kbd):not(samp) {
    font-family: 'Vazirmatn', ui-sans-serif, system-ui, sans-serif !important;
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
[aria-hidden="true"]:not(div):not(section):not(article) {
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
*:not(svg):not(svg *):not(i):not([class*="icon" i]):not([class*="Icon"]):not([class*="lucide" i]):not([class*="codicon" i]):not([aria-hidden="true"]):not(code):not(pre):not(kbd):not(samp) {
    font-family: 'Vazirmatn', ui-sans-serif, system-ui, sans-serif !important;
}

svg, svg *, i, [class*="icon" i], [class*="Icon"], [class*="lucide" i], [class*="codicon" i] {
    font-family: inherit;
}
`;

module.exports = { CSS_INJECT_FULL, CSS_INJECT_FONT_ONLY };
