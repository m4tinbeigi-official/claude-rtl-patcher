const picocolors = require('picocolors');
const { bold, cyan } = picocolors;

function printBanner(version = '1.2.0') {
    const artLines = [
        "  ██████╗██╗      █████╗ ██╗   ██╗██████╗ ███████╗   ██████╗ ████████╗██╗     ",
        " ██╔════╝██║     ██╔══██╗██║   ██║██╔══██╗██╔════╝   ██╔══██╗╚══██╔══╝██║     ",
        " ██║     ██║     ███████║██║   ██║██║  ██║█████╗     ██████╔╝   ██║   ██║     ",
        " ██║     ██║     ██╔══██║██║   ██║██║  ██║██╔══╝     ██╔══██╗   ██║   ██║     ",
        " ╚██████╗███████╗██║  ██║╚██████╔╝██████╔╝███████╗   ██║  ██║   ██║   ███████╗",
        "  ╚═════╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝   ╚═╝  ╚═╝   ╚═╝   ╚══════╝"
    ];

    const hexColors = ['#38bdf8', '#818cf8', '#c084fc', '#f472b6'];
    const colors = hexColors.map(hex => {
        const bigint = parseInt(hex.replace('#', ''), 16);
        return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
    });

    const applyGradient = (text) => {
        let result = '';
        const len = text.length;
        for (let i = 0; i < len; i++) {
            const char = text[i];
            if (char === ' ') {
                result += char;
                continue;
            }
            const factor = len > 1 ? i / (len - 1) : 0;
            const segments = colors.length - 1;
            const segmentFloat = factor * segments;
            const segmentIdx = Math.min(Math.floor(segmentFloat), segments - 1);
            const segmentFactor = segmentFloat - segmentIdx;

            const cStart = colors[segmentIdx];
            const cEnd = colors[segmentIdx + 1];

            const r = Math.round(cStart.r + segmentFactor * (cEnd.r - cStart.r));
            const g = Math.round(cStart.g + segmentFactor * (cEnd.g - cStart.g));
            const b = Math.round(cStart.b + segmentFactor * (cEnd.b - cStart.b));

            result += `\x1b[38;2;${r};${g};${b}m${char}\x1b[0m`;
        }
        return result;
    };

    console.log('');
    for (const line of artLines) {
        console.log(applyGradient(line));
    }
    console.log('');
    console.log(`\x1b[2m  ✨ Modern RTL & Vazirmatn Engine for Claude Desktop | v${version}\x1b[0m\n`);
}

module.exports = { printBanner };
