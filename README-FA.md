<div align="center">
  <img src="./assets/preview.png" alt="Claude RTL Patcher Preview" width="100%">
  
  <h1>🌟 Claude RTL Patcher (Persian / Arabic / Hebrew)</h1>
  <p><strong>The ultimate auto-patcher for Right-to-Left (RTL) text and beautiful typography in the Claude Desktop app.</strong></p>

  [![npm version](https://badge.fury.io/js/claude-rtl-patcher.svg)](https://www.npmjs.com/package/claude-rtl-patcher)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
  [![GitHub stars](https://img.shields.io/github/stars/m4tinbeigi-official/claude-rtl-patcher.svg?style=social&label=Star)](https://github.com/m4tinbeigi-official/claude-rtl-patcher/stargazers)

  ✨ *RTL applied by Rick Sanchez and Vazirmatn font used in memory of Saber Rastikerdar.* ✨

  [🇺🇸 Read in English](./README.md) | [🇸🇦 اقرأ بالعربية (Arabic)](./README-AR.md) | [🇮🇱 קרא בעברית (Hebrew)](./README-HE.md) | [🇮🇷 نسخه فارسی (Read in Persian)](./README-FA.md)
</div>

---

This is an open-source, automated tool that injects robust **Right-to-Left (RTL)** support and the beautiful **Vazirmatn** font directly into the official **Claude Desktop App** (macOS, Windows, Linux).
It fixes the broken text alignment for languages like **Persian (Farsi), Arabic, and Hebrew** so you can chat with Claude seamlessly.

## 🚀 One-Click Installation (Recommended)

You do not need to download or install anything manually. Just open your system's terminal (CMD / PowerShell / Mac Terminal) and paste this magic command:

\`\`\`bash
npx claude-rtl-patcher
\`\`\`

*(The script features a beautiful interactive CLI that will automatically detect your OS, create a backup, inject the CSS, and bypass security constraints within seconds!)*

Once finished, fully close Claude (`Cmd + Q` or `Ctrl + Q`) and reopen it.

---

## 🐧 Custom Paths & Linux
If you installed Claude in a custom directory, or you use an unofficial Linux wrapper, simply provide the path to your installation (or directly to the `app.asar` file) as an argument:
\`\`\`bash
npx claude-rtl-patcher /opt/Claude
# or directly to asar:
npx claude-rtl-patcher /home/user/.local/share/Claude/resources/app.asar
\`\`\`

---

## ⏪ How to Restore
If you ever want to revert Claude to its original state, just run:
\`\`\`bash
npx claude-rtl-patcher --restore
\`\`\`
Your original backup will be instantly restored.

---

## 🆘 The Ultimate Fallback Prompt
If the patcher fails due to an unknown or severely updated Claude version, don't worry. The patcher will safely restore your app.
As a fallback, just copy this prompt and paste it into Claude itself, and let Claude fix its own Desktop app for you!

> "Hey Claude! I am trying to run the `claude-rtl-patcher` on my system to add RTL and Vazirmatn font to your Desktop App. It failed to patch my current version. Can you please write a custom Node.js script using `@electron/asar` to dynamically patch your `.vite/build` and `.vite/renderer` CSS and JS files for my specific version? Make sure to use the `--unpack` flag for `.node` files, calculate the new ASAR SHA256, update `Info.plist`, and run `codesign --remove-signature` to bypass Gatekeeper. Please do everything automatically."

---

## 🛠️ Technologies Used
- **[Node.js](https://nodejs.org/):** Core processor.
- **[@electron/asar](https://github.com/electron/asar):** Safe extraction and repacking of Electron sources without breaking Native Modules.
- **[Inquirer](https://www.npmjs.com/package/inquirer):** Interactive CLI menus.
- **[Chalk](https://www.npmjs.com/package/chalk) & [Ora](https://www.npmjs.com/package/ora) & [Figlet](https://www.npmjs.com/package/figlet):** Beautiful colored UI and spinners.
- **[Crypto]:** Smart SHA256 calculation to spoof Apple's ASAR Integrity Check (`Gatekeeper Bypass`).

---

## 🤝 Call for Contributors
We welcome pull requests from everyone! 

<a href="https://github.com/m4tinbeigi-official/claude-rtl-patcher/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=m4tinbeigi-official/claude-rtl-patcher" />
</a>

---

## ⭐ Support the Project
If this tool made your Claude experience better, please consider **Starring (⭐)** this repository at the top of the page. It helps the project reach more users!

## 📜 License
Published under the completely permissive **MIT License**. You are free to modify, distribute, and use this code commercially. 🕊️
