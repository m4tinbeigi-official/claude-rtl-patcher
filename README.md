<div align="center">
  <img src="./assets/preview.png" alt="Claude RTL Patcher Preview" width="100%">
  
  <h1>🌟 Claude RTL Patcher (Persian / Farsi Support)</h1>
  <p><strong>The ultimate auto-patcher for right-to-left text & Vazirmatn font in Claude Desktop</strong></p>

  [![npm version](https://badge.fury.io/js/claude-rtl-patcher.svg)](https://badge.fury.io/js/claude-rtl-patcher)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
  [![GitHub stars](https://img.shields.io/github/stars/m4tinbeigi-official/claude-rtl-patcher.svg?style=social&label=Star)](https://github.com/m4tinbeigi-official/claude-rtl-patcher/stargazers)

  ✨ *RTL applied by Rick Sanchez and Vazirmatn font used in memory of Saber Rastikerdar.* ✨

</div>

---

این یک ابزار متن‌باز است که به صورت کاملاً خودکار، پشتیبانی از متون راست‌چین (RTL) و فونت زیبای **وزیرمتن** را به صورت آفلاین به اپلیکیشن دسکتاپ **Claude (کلود)** برای هر دو سیستم‌عامل **مک‌اواس (macOS)** و **ویندوز (Windows)** اضافه می‌کند. 

## 🚀 نصب با یک کلیک (پیشنهادی برای ویندوز و مک)

بدون نیاز به دانلود فایل یا نصب هیچ پیش‌نیازی، کافیست ترمینال سیستم خود (CMD / PowerShell / Mac Terminal) را باز کنید و دستور جادویی زیر را در آن تایپ کنید و اینتر بزنید:

\`\`\`bash
npx --yes claude-rtl-patcher
\`\`\`

*(اسکریپت با داشتن یک رابط کاربری ترمینال فوق‌العاده جذاب و انیمیشنی، به صورت هوشمند سیستم عامل شما را تشخیص داده و در عرض چند ثانیه کلود شما را فارسی کرده و فونت آفلاین وزیرمتن را روی آن نصب می‌کند!)*

پس از اتمام کار، برنامه کلود را کامل ببندید (`Cmd + Q`) و دوباره باز کنید.

---

## 🤖 نصب توسط هوش مصنوعی خودِ Claude (روش خفن!)
اگر نسخه جدید Claude را دارید که می‌تواند دسکتاپ شما را کنترل کند، فقط لینک همین صفحه را به او بدهید و بگویید:
> **"لطفا نرم افزار کلاد من رو با استفاده از این ریپازیتوری فارسی سازی کن."**

کلود خودش راهنمای مخفی ما (`CLAUDE.md`) را می‌خواند و ترمینال را باز کرده و همه کارها را برای شما انجام می‌دهد! اگر هم نسخه‌اش با این اسکریپت فرق داشته باشد، خودش هوشمندانه کدهایش را تغییر می‌دهد تا مشکل برطرف شود!

---

## 🛠️ تکنولوژی‌های استفاده شده (Technologies Used)
این پروژه از مدرن‌ترین پکیج‌های جاوااسکریپت برای دور زدن محدودیت‌های امنیتی macOS و تغییر مستقیم فایل‌های بسته شده‌ی Electron استفاده می‌کند:

- **[Node.js](https://nodejs.org/):** هسته اصلی پردازش
- **[@electron/asar](https://github.com/electron/asar):** استخراج، ویرایش و پکیج کردن مجدد سورس کدهای Claude بدون خراب کردن `Native Modules`.
- **[Plist](https://www.npmjs.com/package/plist):** دستکاری فایل `Info.plist` برنامه برای قرار دادن `Hash` امنیتی جدید جهت دور زدن `Asar Integrity Check`.
- **[Chalk](https://www.npmjs.com/package/chalk) & [Ora](https://www.npmjs.com/package/ora) & [Figlet](https://www.npmjs.com/package/figlet):** ساخت یک رابط کاربری ترمینالی خفن و رنگی با انیمیشن‌های روان.
- **[Crypto]:** برای محاسبه هوشمند SHA256 و امضای دیجیتال فیک جهت گول زدن مک‌اواس (`Gatekeeper Bypass`).

---

## ⏪ بازگردانی به حالت اولیه (Restore)
اگر به هر دلیلی خواستید کلود را به حالت اورجینال (بدون فونت و چپ‌چین) برگردانید، فقط کافیست دستور زیر را در ترمینال بزنید:

\`\`\`bash
npx claude-rtl-patcher --restore
\`\`\`
نسخه پشتیبان که در زمان نصب به صورت خودکار ساخته شده بود، فوراً بازگردانی می‌شود.

---

## 🆘 پرامپت نجات (Ultimate Fallback Prompt)
اگر اسکریپت تحت هر شرایطی ارور داد و نتوانست کلود را فارسی کند، نگران نباشید. اسکریپت ما به قدری امن است که در صورت ارور سریعاً کلود را به حالت اورجینال بازمی‌گرداند تا خراب نشود.
اگر این اتفاق افتاد، پرامپت انگلیسی زیر را کپی کنید و در کلود چت پیست کنید تا کلود شخصاً مشکل خودش را حل کند:

> "Hey Claude! I am trying to run the `claude-rtl-patcher` on my Mac to add Persian (RTL) and Vazirmatn font to your Desktop App. It failed to patch my current version. Can you please write a custom Node.js script using `@electron/asar` to dynamically patch your `.vite/build` and `.vite/renderer` CSS and JS files for my specific version? Make sure to use the `--unpack` flag for `.node` files, calculate the new ASAR SHA256, update `Info.plist`, and run `codesign --remove-signature` to bypass Gatekeeper. Please do everything automatically."

---

## 🤝 مشارکت‌کنندگان و فراخوان توسعه (Call for Contributors)
ما از تمام توسعه‌دهندگان خوش‌ذوق دعوت می‌کنیم تا در این پروژه متن‌باز مشارکت کنند! ایده‌های فعلی که به شدت به کمک شما در آن‌ها نیاز داریم:

1. **بهینه‌سازی برای سایر نسخه‌های کلود:** با وجود اینکه تلاش کردیم کدهای استخراج کاملاً داینامیک باشند و روی تمام نسخه‌های ویندوز و مک به درستی کار کنند، اما اگر در نسخه‌های خاصی از کلود مشکلی دیدید، با ارسال Pull Request کدها را بهینه‌تر کنید!
2. **پشتیبانی از لینوکس (Linux):** اگر کلاود در آینده نسخه لینوکس داد، خوشحال می‌شویم مسیرهای مربوط به لینوکس را در `index.js` اضافه کنید.

<a href="https://github.com/m4tinbeigi-official/claude-rtl-patcher/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=m4tinbeigi-official/claude-rtl-patcher" />
</a>

---

## ⭐ حمایت از پروژه
اگر این ابزار برای شما مفید بود و کلود شما را زیباتر کرد، لطفاً با **Star دادن (⭐)** به این ریپازیتوری در بالای صفحه گیت‌هاب، از ما حمایت کنید تا بقیه کاربران ایرانی هم بتوانند راحت‌تر این پروژه را پیدا کنند!

## 📜 لایسنس (License)
این پروژه تحت لایسنس کاملاً آزاد **MIT** منتشر شده است. 
به این معنا که **هر کسی آزاد است هر کاری که دلش می‌خواهد با این کدها انجام دهد!** می‌توانید آن را تغییر دهید، در پروژه‌های شخصی یا تجاری استفاده کنید، یا حتی آن را با نام خودتان توسعه دهید. هدف ما فقط دسترسی آزاد و راحت به تکنولوژی برای همه است. 🕊️
