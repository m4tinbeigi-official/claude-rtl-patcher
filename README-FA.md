<div align="center">
  <img src="./assets/preview.png" alt="Claude RTL Patcher Preview" width="100%">
  
  <h1>🌟 Claude RTL Patcher (Persian / Arabic / Hebrew)</h1>
  <p><strong>بهترین ابزار خودکار برای راست‌چین کردن (RTL) و اضافه کردن فونت‌های زیبا به اپلیکیشن دسکتاپ Claude.</strong></p>

  [![npm version](https://badge.fury.io/js/claude-rtl-patcher.svg)](https://www.npmjs.com/package/claude-rtl-patcher)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
  [![GitHub stars](https://img.shields.io/github/stars/m4tinbeigi-official/claude-rtl-patcher.svg?style=social&label=Star)](https://github.com/m4tinbeigi-official/claude-rtl-patcher/stargazers)

  ✨ *راست‌چین شده توسط Rick Sanchez و استفاده از فونت وزیرمتن به یاد صابر راستی‌کردار.* ✨

  [🇺🇸 Read in English](./README.md) | [🇸🇦 اقرأ بالعربية (Arabic)](./README-AR.md) | [🇮🇱 קרא בעברית (Hebrew)](./README-HE.md)
</div>

---

این یک ابزار متن‌باز است که به صورت کاملاً خودکار، پشتیبانی از متون راست‌چین (RTL) و فونت زیبای **وزیرمتن** را به صورت آفلاین به اپلیکیشن دسکتاپ **Claude (کلود)** برای **تمامی سیستم‌عامل‌ها (مک‌اواس، ویندوز و لینوکس)** اضافه می‌کند. 
این ابزار مشکل به‌هم‌ریختگی متون در زبان‌هایی مثل **فارسی، عربی و عبری** را کاملاً برطرف می‌کند تا بتوانید به راحتی با کلود چت کنید.
🎉 این پروژه **[به صورت رسمی در مخزن جهانی NPM منتشر شده است](https://www.npmjs.com/package/claude-rtl-patcher)**!

## 🚀 نصب با یک کلیک (پیشنهادی)

شما نیازی به دانلود هیچ فایلی ندارید. فقط کافیست ترمینال سیستم خود (CMD در ویندوز یا Terminal در مک/لینوکس) را باز کنید و دستور جادویی زیر را کپی و پیست کنید:

\`\`\`bash
npx claude-rtl-patcher
\`\`\`

*(این اسکریپت دارای یک منوی تعاملی و زیباست که سیستم‌عامل شما را به صورت خودکار تشخیص می‌دهد، از برنامه کلود شما بکاپ می‌گیرد، استایل‌ها را تزریق می‌کند و در نهایت محدودیت‌های امنیتی را در چند ثانیه دور می‌زند!)*

بعد از پایان کار، کلود را به صورت کامل ببندید (`Cmd + Q` یا `Ctrl + Q`) و دوباره باز کنید.

---

## 🐧 مسیرهای سفارشی و لینوکس
اگر کلود را در مسیر خاصی نصب کرده‌اید، یا از نسخه‌های غیررسمی در لینوکس استفاده می‌کنید، فقط کافیست مسیر نصب برنامه (یا آدرس دقیق فایل `app.asar`) را جلوی دستور بنویسید:
\`\`\`bash
npx claude-rtl-patcher /opt/Claude
# یا مستقیم به فایل asar:
npx claude-rtl-patcher /home/user/.local/share/Claude/resources/app.asar
\`\`\`

---

## ⏪ نحوه بازگردانی به حالت اول (Restore)
اگر به هر دلیلی خواستید کلود را به حالت اورجینال و اولیه خود برگردانید، فقط این دستور را اجرا کنید:
\`\`\`bash
npx claude-rtl-patcher --restore
\`\`\`
بکاپ اورجینال شما بلافاصله بازگردانی می‌شود.

---

## 🆘 پرامپت نجات (Fallback Prompt)
اگر اسکریپت ما به دلیل آپدیت‌های بسیار جدید و ناشناخته کلود نتوانست کار کند، نگران نباشید. اسکریپت به صورت خودکار کلود را به حالت امن برمی‌گرداند.
به عنوان راه حل جایگزین، پرامپت انگلیسی زیر را کپی کنید و داخل خود کلود بفرستید تا کلود خودش کد اسکریپت پچ کردنِ نسخه جدید را برای شما بنویسد!

> "Hey Claude! I am trying to run the `claude-rtl-patcher` on my system to add RTL and Vazirmatn font to your Desktop App. It failed to patch my current version. Can you please write a custom Node.js script using `@electron/asar` to dynamically patch your `.vite/build` and `.vite/renderer` CSS and JS files for my specific version? Make sure to use the `--unpack` flag for `.node` files, calculate the new ASAR SHA256, update `Info.plist`, and run `codesign --remove-signature` to bypass Gatekeeper. Please do everything automatically."

---

## 🛠️ تکنولوژی‌های استفاده شده
- **[Node.js](https://nodejs.org/):** پردازشگر اصلی کدهای ما.
- **[@electron/asar](https://github.com/electron/asar):** برای استخراج امن و پکیج کردن دوباره فایل‌های الکترون بدون خراب شدن Native Module ها.
- **[Inquirer](https://www.npmjs.com/package/inquirer):** برای ساخت منوی تعاملی در ترمینال.
- **[Chalk](https://www.npmjs.com/package/chalk) & [Ora](https://www.npmjs.com/package/ora) & [Figlet](https://www.npmjs.com/package/figlet):** برای زیباسازی رابط کاربری ترمینال، رنگ‌ها و انیمیشن‌ها.
- **[Crypto]:** برای محاسبه هوشمندانه هش SHA256 جهت دور زدن مکانیزم امنیتی `Gatekeeper Bypass` در اپل.

---

## 🤝 دعوت به همکاری (Contributors)
ما از تمام برنامه‌نویسانی که می‌خواهند به این پروژه کمک کنند استقبال می‌کنیم (Pull Requests Welcome)!

<a href="https://github.com/m4tinbeigi-official/claude-rtl-patcher/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=m4tinbeigi-official/claude-rtl-patcher" />
</a>

---

## ⭐ حمایت از پروژه
اگر این ابزار تجربه استفاده شما از کلود را بهتر کرد، لطفاً به این ریپازیتوری در بالای صفحه **ستاره (⭐)** بدهید. این کار کمک می‌کند تا کاربران بیشتری ابزار را پیدا کنند!

## 📜 لایسنس
این ابزار تحت لایسنس کاملاً آزاد **MIT** منتشر شده است. شما آزاد هستید این کدها را تغییر دهید، منتشر کنید و حتی استفاده تجاری ببرید. 🕊️
