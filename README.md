<div align="center">
  <img src="./assets/preview.png" alt="Claude RTL Patcher Preview" width="100%">
  
  <h1>🌟 Claude RTL Patcher (Persian / Arabic / Hebrew)</h1>
  <p><strong>The ultimate auto-patcher for Right-to-Left (RTL) text and beautiful typography in the Claude Desktop app.</strong></p>

  [![npm version](https://badge.fury.io/js/claude-rtl-patcher.svg)](https://www.npmjs.com/package/claude-rtl-patcher)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
  [![GitHub stars](https://img.shields.io/github/stars/m4tinbeigi-official/claude-rtl-patcher.svg?style=social&label=Star)](https://github.com/m4tinbeigi-official/claude-rtl-patcher/stargazers)

  ✨ *RTL applied by Rick Sanchez and Vazirmatn font used in memory of Saber Rastikerdar.* ✨

  [🇮🇷 نسخه فارسی (Persian)](./README-FA.md) | [🇸🇦 اقرأ بالعربية (Arabic)](./README-AR.md) | [🇮🇱 קרא בעברית (Hebrew)](./README-HE.md)
</div>

---

This is an open-source, automated tool that injects robust **Right-to-Left (RTL)** support and the beautiful **Vazirmatn** font directly into the official **Claude Desktop App** (macOS, Windows, Linux).
It fixes the broken text alignment for languages like **Persian (Farsi), Arabic, and Hebrew** so you can chat with Claude seamlessly.

> **Auto-detect mode:** newer Claude Desktop builds already render RTL correctly on their own. When that's detected, the patcher automatically applies **only the Vazirmatn font** and leaves direction/alignment untouched. On older builds without native RTL, it still applies the full RTL + font patch. You can also force a mode manually with `--font-only` or `--full`.

## 🚀 One-Click Installation (Recommended)

You do not need to download or install anything manually. Just open your system's terminal (CMD / PowerShell / Mac Terminal) and paste this magic command:

```bash
npx claude-rtl-patcher
```

*(The script features a beautiful interactive CLI that will automatically detect your OS and Claude version, create a backup, inject the right CSS for your case, and - on macOS - re-sign and re-verify the app so it still launches, all within seconds.)*

Once finished, fully close Claude (`Cmd + Q` or `Ctrl + Q`) and reopen it.

### Standalone installer (no Node.js required)
Release binaries are built automatically for macOS, Windows, and Linux. After a release is published, download the matching asset or run the bootstrap command:

```bash
# macOS / Linux
curl -fsSL https://raw.githubusercontent.com/m4tinbeigi-official/claude-rtl-patcher/main/install.sh | bash

# Windows PowerShell
irm https://raw.githubusercontent.com/m4tinbeigi-official/claude-rtl-patcher/main/install.ps1 | iex
```

The standalone build installs the patcher for the current user, detects the operating system and Claude path, creates a backup, and launches the same interactive patch flow. Windows MSIX/AppX installs remain unsupported because their package files are not writable.

### Forcing a specific mode
\`\`\`bash
npx claude-rtl-patcher --font-only   # only apply Vazirmatn, skip RTL/direction changes
npx claude-rtl-patcher --full        # force the full RTL + font patch, even on new versions
\`\`\`

---

## 🐧 Custom Paths & Linux
If you installed Claude in a custom directory, or you use an unofficial Linux wrapper, simply provide the path to your installation (or directly to the `app.asar` file) as an argument:
```bash
npx claude-rtl-patcher /opt/Claude
# or directly to asar:
npx claude-rtl-patcher /home/user/.local/share/Claude/resources/app.asar
```

---

## ⚠️ Known limitation: Windows MSIX/AppX installs
If Claude Desktop on Windows was installed as an **MSIX/AppX package** (path contains `WindowsApps`), this tool **will refuse to patch it**. That location is owned by `TrustedInstaller` and isn't writable even as Administrator, and MSIX packages carry their own integrity verification that can silently revert in-place file edits anyway. There is currently no supported workaround — this is a Windows packaging limitation, not a bug we can patch around. See [#6](https://github.com/m4tinbeigi-official/claude-rtl-patcher/issues/6) for details and discussion.

---

## 🐛 Issue reports and fixes

The following fixes were implemented from community reports in [issues #4–#8](https://github.com/m4tinbeigi-official/claude-rtl-patcher/issues):

| Issue | Reported by | Report | Resolution |
|---|---|---|---|
| [#4](https://github.com/m4tinbeigi-official/claude-rtl-patcher/issues/4) | [amirhyz](https://github.com/amirhyz) | `plist@5` crashed the CommonJS `require('plist')` import with `ERR_PACKAGE_PATH_NOT_EXPORTED`. | Pinned `plist` to the CommonJS-compatible 3.x line and refreshed the lockfile. |
| [#5](https://github.com/m4tinbeigi-official/claude-rtl-patcher/issues/5) | [mkhrezaee](https://github.com/mkhrezaee) | The same ESM-only `plist@5` failure affected Windows and Node.js 22. | Kept the runtime on the compatible CommonJS dependency and added regression coverage. |
| [#6](https://github.com/m4tinbeigi-official/claude-rtl-patcher/issues/6) | [mkhrezaee](https://github.com/mkhrezaee) | Windows MSIX/AppX installs under `WindowsApps` are not writable and can be reverted by package integrity checks. | Added WindowsApps detection, a clear fail-fast message, and documented the unsupported packaging limitation. |
| [#7](https://github.com/m4tinbeigi-official/claude-rtl-patcher/issues/7) | [mahsakiani](https://github.com/mahsakiani) | Patching the latest macOS build invalidated the ASAR integrity metadata and code signature. | Hash Electron's serialized ASAR header, ad-hoc sign with sanitized entitlements, verify the bundle, and re-sign rollbacks. |
| [#8](https://github.com/m4tinbeigi-official/claude-rtl-patcher/issues/8) | [Ehsan-rvp](https://github.com/Ehsan-rvp) | `ERR_PACKAGE_PATH_NOT_EXPORTED` on Node.js 22/24 prevented startup. | Covered by the `plist` compatibility fix and lockfile update above. |

The original issue threads remain available for reproduction details and discussion.

---

## ⏪ How to Restore
If you ever want to revert Claude to its original state, just run:
```bash
npx claude-rtl-patcher --restore
```
Your original backup will be instantly restored.

---

## 🆘 Fallback: Ask an AI Assistant for a Custom Script
If the patcher fails on an unknown or newer Claude Desktop version, don't worry — your backup is restored automatically and nothing is left broken. You can also ask Claude (or any coding assistant) to write a one-off patch script tailored to your exact version.

Copy and paste this prompt:

> "I use claude-rtl-patcher (https://github.com/m4tinbeigi-official/claude-rtl-patcher) to add RTL/Vazirmatn support to my local Claude Desktop install, and it failed to patch my current version. Please write a Node.js script using `@electron/asar` that extracts `app.asar`, injects the same CSS/JS into the `.vite/build`/`.vite/renderer` directories, and repacks it. On macOS it must calculate Electron's integrity hash from the serialized `headerString` returned by `require('@electron/asar').getRawHeader(asarPath)` (not from the whole ASAR), update `ElectronAsarIntegrity` in `Info.plist`, run `/usr/bin/xattr -cr <app-bundle>`, materialize a sanitized entitlement plist that excludes `com.apple.application-identifier`, `com.apple.developer.team-identifier`, and `keychain-access-groups`, ad-hoc sign the complete bundle with `/usr/bin/codesign --force --deep --sign - --entitlements <temporary-plist> <app-bundle>`, and verify it with `/usr/bin/codesign --verify --deep --strict --verbose=2 <app-bundle>`. If patching or signing fails, it must restore the original ASAR and `Info.plist`, recompute integrity, and re-sign and verify the rollback. Please provide the complete Node.js script, and confirm with me before running anything that modifies my installed app."

*Review the generated script yourself before running it — it modifies your own local install.*

---

## 🛠️ Technologies Used
- **[Node.js](https://nodejs.org/):** Core processor.
- **[@electron/asar](https://github.com/electron/asar):** Safe extraction and repacking of Electron sources without breaking Native Modules.
- **[Inquirer](https://www.npmjs.com/package/inquirer):** Interactive CLI menus.
- **[Chalk](https://www.npmjs.com/package/chalk) & [Ora](https://www.npmjs.com/package/ora) & [Figlet](https://www.npmjs.com/package/figlet):** Beautiful colored UI and spinners.
- **[Crypto]:** Recomputes Electron's own ASAR integrity hash after patching (a check built into Electron itself, separate from macOS Gatekeeper) and ad-hoc re-signs the bundle on macOS so Gatekeeper accepts the modified app.

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
