<div align="center">
  <img src="./assets/preview.png" alt="Claude RTL Patcher Preview" width="100%">
  
  <h1>🌟 Claude RTL Patcher (Persian / Arabic / Hebrew)</h1>
  <p><strong>הכלי האוטומטי האולטימטיבי לתמיכה בטקסט מימין לשמאל (RTL) וטיפוגרפיה יפה באפליקציית שולחן העבודה של Claude.</strong></p>

  [![npm version](https://badge.fury.io/js/claude-rtl-patcher.svg)](https://www.npmjs.com/package/claude-rtl-patcher)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
  [![GitHub stars](https://img.shields.io/github/stars/m4tinbeigi-official/claude-rtl-patcher.svg?style=social&label=Star)](https://github.com/m4tinbeigi-official/claude-rtl-patcher/stargazers)

  ✨ *תמיכת RTL יושמה על ידי Rick Sanchez, גופן Vazirmatn הוסף לזכרו של Saber Rastikerdar.* ✨

  [🇺🇸 Read in English](./README.md) | [🇮🇷 نسخه فارسی (Persian)](./README-FA.md) | [🇸🇦 اقرأ بالعربية (Arabic)](./README-AR.md)
</div>

---

זהו כלי קוד פתוח ואוטומטי שמוסיף תמיכה מלאה וטובה בטקסט מימין לשמאל **(RTL)** ישירות לאפליקציית שולחן העבודה הרשמית של **Claude** (עבור macOS, Windows ו-Linux).
הכלי מתקן את בעיות יישור הטקסט עבור שפות כמו **עברית, ערבית ופרסית** כדי שתוכלו לשוחח עם Claude בצורה חלקה.

## 🚀 התקנה בלחיצה אחת (מומלץ)

אין צורך להוריד או להתקין שום דבר באופן ידני. פשוט פתחו את מסוף הפקודות שלכם (CMD / PowerShell / Mac Terminal) והדביקו את פקודת הקסם הזו:

\`\`\`bash
npx claude-rtl-patcher
\`\`\`

*(הסקריפט כולל ממשק שורת פקודה אינטראקטיבי (CLI) שיזהה אוטומטית את מערכת ההפעלה שלכם, ייצור גיבוי, יזריק את ה-CSS ויעקוף את אילוצי האבטחה תוך שניות!)*

בסיום התהליך, סגרו לחלוטין את Claude (באמצעות `Cmd + Q` או `Ctrl + Q`) ופתחו אותו מחדש.

---

## 🐧 נתיבים מותאמים אישית ו-Linux
אם התקנתם את Claude בתיקייה מותאמת אישית, או שאתם משתמשים בגרסת Linux לא רשמית, פשוט ספקו לסקריפט את נתיב ההתקנה שלכם (או ישירות לקובץ `app.asar`) כארגומנט:
\`\`\`bash
npx claude-rtl-patcher /opt/Claude
# או ישירות לקובץ asar:
npx claude-rtl-patcher /home/user/.local/share/Claude/resources/app.asar
\`\`\`

---

## ⏪ איך לבצע שחזור (Restore)
אם אי פעם תרצו להחזיר את Claude למצבו המקורי, פשוט הריצו:
\`\`\`bash
npx claude-rtl-patcher --restore
\`\`\`
הגיבוי המקורי שלכם ישוחזר באופן מיידי.

---

## 🆘 פקודת חירום לגיבוי (Fallback Prompt)
אם כלי התיקון נכשל עקב גרסה לא מוכרת או עדכון משמעותי של Claude, אל תדאגו. הכלי ישחזר בבטחה את האפליקציה שלכם.
כגיבוי, פשוט העתיקו את הפקודה הזו (באנגלית) והדביקו אותה בתוך Claude עצמו, ותנו ל-Claude לתקן את האפליקציה של עצמו עבורכם!

> "Hey Claude! I am trying to run the `claude-rtl-patcher` on my system to add RTL and Vazirmatn font to your Desktop App. It failed to patch my current version. Can you please write a custom Node.js script using `@electron/asar` to dynamically patch your `.vite/build` and `.vite/renderer` CSS and JS files for my specific version? Make sure to use the `--unpack` flag for `.node` files, calculate the new ASAR SHA256, update `Info.plist`, and run `codesign --remove-signature` to bypass Gatekeeper. Please do everything automatically."

---

## 🛠️ טכנולוגיות בשימוש
- **[Node.js](https://nodejs.org/):** מעבד הליבה.
- **[@electron/asar](https://github.com/electron/asar):** חילוץ ואריזה מחדש בטוחים של מקורות Electron ללא שבירת רכיבי Native Modules.
- **[Inquirer](https://www.npmjs.com/package/inquirer):** תפריטי CLI אינטראקטיביים.
- **[Chalk](https://www.npmjs.com/package/chalk) & [Ora](https://www.npmjs.com/package/ora) & [Figlet](https://www.npmjs.com/package/figlet):** ממשק משתמש צבעוני ויפהפה עם אינדיקטורים נעים (Spinners).
- **[Crypto]:** חישוב SHA256 חכם לזיוף מנגנון ה-Integrity Check של ASAR מבית Apple (מעקף `Gatekeeper`).

---

## 🤝 קריאה לתורמים (Contributors)
אנו מקדמים בברכה Pull Requests מכולם!

<a href="https://github.com/m4tinbeigi-official/claude-rtl-patcher/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=m4tinbeigi-official/claude-rtl-patcher" />
</a>

---

## ⭐ תמכו בפרויקט
אם כלי זה שיפר את חווית השימוש שלכם ב-Claude, אנא שקלו להעניק **כוכב (⭐)** למאגר זה בראש העמוד. זה עוזר לפרויקט להגיע ליותר משתמשים!

## 📜 רישיון
מפורסם תחת רישיון **MIT** מתירני לחלוטין. אתם חופשיים לשנות, להפיץ ולהשתמש בקוד זה באופן מסחרי. 🕊️
