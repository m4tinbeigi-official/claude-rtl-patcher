# Claude RTL Patcher (Persian / Farsi Support)

[![npm version](https://badge.fury.io/js/claude-rtl-patcher.svg)](https://badge.fury.io/js/claude-rtl-patcher)

این یک ابزار متن‌باز است که به صورت کاملاً خودکار، پشتیبانی از متون راست‌چین (RTL) و فونت زیبای **وزیرمتن** را به اپلیکیشن دسکتاپ **Claude (کلود)** برای مک‌اواس اضافه می‌کند. 

✨ **RTL applied by Rick Sanchez and Vazirmatn font used in memory of Saber Rastikerdar.** ✨

![Claude App Preview](./assets/preview.png)

## 🚀 نصب با یک کلیک (پیشنهادی)

بدون نیاز به دانلود فایل یا نصب هیچ چیز اضافه، کافیست ترمینال مک (Terminal) را باز کنید و دستور جادویی زیر را در آن پیست کنید و اینتر بزنید:

\`\`\`bash
curl -sL https://raw.githubusercontent.com/m4tinbeigi-official/claude-rtl-patcher/main/install.sh | bash
\`\`\`

*(اسکریپت با داشتن یک رابط کاربری ترمینال فوق‌العاده جذاب و انیمیشنی، در عرض ۵ ثانیه کلود شما را فارسی کرده و فونت آفلاین وزیرمتن را روی آن نصب می‌کند!)*

پس از اتمام کار، برنامه کلود را کامل ببندید (`Cmd + Q`) و دوباره باز کنید.

---

## 🤖 نصب توسط هوش مصنوعی خودِ Claude (روش خفن!)
اگر نسخه جدید Claude را دارید که می‌تواند دسکتاپ شما را کنترل کند، فقط لینک همین صفحه را به او بدهید و بگویید:
> **"لطفا نرم افزار کلاد من رو با استفاده از این ریپازیتوری فارسی سازی کن."**

کلود خودش راهنمای مخفی ما (`CLAUDE.md`) را می‌خواند و ترمینال را باز کرده و همه کارها را برای شما انجام می‌دهد! اگر هم نسخه‌اش با این اسکریپت فرق داشته باشد، خودش هوشمندانه کدهایش را تغییر می‌دهد تا مشکل برطرف شود!

---

## ⏪ بازگردانی به حالت اولیه (Restore)
اگر به هر دلیلی خواستید کلود را به حالت اورجینال (بدون فونت و چپ‌چین) برگردانید، فقط کافیست دستور زیر را در ترمینال بزنید:

\`\`\`bash
npx claude-rtl-patcher --restore
\`\`\`
پشتیبان اورجینال برنامه فوراً بازگردانی می‌شود.

---

## 🆘 پرامپت نجات (Ultimate Fallback Prompt)
اگر اسکریپت تحت هر شرایطی ارور داد و نتوانست کلود را فارسی کند، نگران نباشید. اسکریپت ما به قدری امن است که در صورت ارور سریعاً کلود را به حالت اورجینال بازمی‌گرداند تا خراب نشود.
اگر این اتفاق افتاد، پرامپت انگلیسی زیر را کپی کنید و در کلود چت پیست کنید تا کلود شخصاً مشکل خودش را حل کند:

> "Hey Claude! I am trying to run the `claude-rtl-patcher` on my Mac to add Persian (RTL) and Vazirmatn font to your Desktop App. It failed to patch my current version. Can you please write a custom Node.js script using `@electron/asar` to dynamically patch your `.vite/build` and `.vite/renderer` CSS and JS files for my specific version? Make sure to use the `--unpack` flag for `.node` files, calculate the new ASAR SHA256, update `Info.plist`, and run `codesign --remove-signature` to bypass Gatekeeper. Please do everything automatically."

---

### Contribution
Feel free to open issues or submit pull requests. Currently supports **macOS** installations of the Claude Desktop App. Windows support can be easily added by adjusting the path!
