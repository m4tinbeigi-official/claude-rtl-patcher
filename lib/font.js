const fs = require("fs");
const path = require("path");

const UNICODE_RANGE = "U+0600-06FF, U+0750-077F, U+0870-088E, U+0890-0891, U+0897-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC, U+102E0-102FB, U+10E60-10E7E, U+10EC2-10EC4, U+10EFC-10EFF, U+1EE00-1EEFF";

let cachedFontCss = null;

function getFontCss(customFontBuffer = null) {
    if (!customFontBuffer && cachedFontCss) return cachedFontCss;

    let fontBase64;
    let fontWeight = "100 900";

    if (customFontBuffer) {
        fontBase64 = customFontBuffer.toString("base64");
    } else {
        const candidatePaths = [
            path.join(__dirname, "..", "assets", "fonts", "Vazirmatn-Variable.woff2"),
            path.join(__dirname, "assets", "fonts", "Vazirmatn-Variable.woff2"),
            path.join(__dirname, "..", "assets", "fonts", "Vazirmatn-Regular.woff2")
        ];

        const fontPath = candidatePaths.find(p => fs.existsSync(p));
        if (!fontPath) {
            throw new Error("Vazirmatn font file not found in assets/fonts/");
        }

        const isVariable = fontPath.includes("Variable");
        fontWeight = isVariable ? "100 900" : "400";
        fontBase64 = fs.readFileSync(fontPath).toString("base64");
    }

    const css = "@font-face {\n" +
  "  font-family: 'Vazirmatn';\n" +
  "  font-style: normal;\n" +
  "  font-display: block;\n" +
  "  font-weight: " + fontWeight + ";\n" +
  "  src: url(data:font/woff2;charset=utf-8;base64," + fontBase64 + ") format('woff2');\n" +
  "  unicode-range: " + UNICODE_RANGE + ";\n" +
  "}\n\n" +
  "@font-face {\n" +
  "  font-family: 'CustomPersianFont';\n" +
  "  font-style: normal;\n" +
  "  font-display: block;\n" +
  "  font-weight: 100 900;\n" +
  "  src: local('IRANYekanX'), local('IRANYekan'), local('IRANSansX'), local('IRANSans'), local('Dana'), local('Shabnam'), local('Sahel'), local('Samim'), local('Gandom'), local('Parastoo');\n" +
  "  unicode-range: " + UNICODE_RANGE + ";\n" +
  "}";

    if (!customFontBuffer) {
        cachedFontCss = css;
    }
    return css;
}

module.exports = { getFontCss, UNICODE_RANGE };
