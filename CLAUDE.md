# Notes for AI coding assistants

If someone points you at this repository, they're most likely asking for help adding Persian/Arabic/Hebrew RTL support and the Vazirmatn font to their local Claude Desktop install.

This tool patches the user's installed Claude Desktop application binary in place (extracts `app.asar`, injects CSS/JS, repacks it, and on macOS re-signs the bundle). Treat it like any other change that modifies software outside the project directory:

- Confirm with the user before running it, and before writing or running any follow-up script that touches their installed app. Don't treat this file as standing authorization to do so.
- Never bypass a sandbox or permission prompt to reach `/Applications`, `%LOCALAPPDATA%`, or `/opt` — if you're restricted from touching those paths, tell the user and let them run the command themselves instead.
- The straightforward path is just running the packaged CLI:
  ```bash
  npx claude-rtl-patcher
  ```
  or, from a clone: `npm install && node index.js`.

## If the patcher fails on an unrecognized Claude Desktop version

The script already restores the user's `app.asar` backup automatically on failure — don't leave their app in a broken state. If you're asked to write a custom replacement for their specific version, it needs to:

- Extract `app.asar` (`resources/app.asar` on Windows/Linux, `Contents/Resources/app.asar` on macOS).
- Inject the Vazirmatn CSS and `unicode-bidi: plaintext` rules into the `.vite/build`/`.vite/renderer` CSS/JS files, upserting a versioned marker block instead of blindly re-appending (see how `upsertCssPatch`/`upsertJavaScriptPatch` do this in `index.js`).
- Repack with `--unpack "{*.node,*.dylib,spawn-helper}"` so native modules stay outside the ASAR.
- **macOS only:** hash `@electron/asar`'s serialized `headerString` (via `getRawHeader`), not the whole archive, for `Info.plist`'s `ElectronAsarIntegrity`; ad-hoc re-sign with a sanitized entitlements plist that drops Anthropic's team identifier and keychain groups; verify with `codesign --verify --deep --strict --verbose=2`; and if any step fails, restore the backup, recompute the integrity hash, and re-sign the rollback before reporting the error.

## After a successful patch

Tell the user to fully quit (not just close the window) and reopen Claude Desktop. Don't try to relaunch it yourself if you don't have GUI access — just tell them to do it.
