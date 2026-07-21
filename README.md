# Claude RTL Patcher (Persian / Farsi Support)

[![npm version](https://badge.fury.io/js/claude-rtl-patcher.svg)](https://badge.fury.io/js/claude-rtl-patcher)

این یک ابزار متن‌باز است که به صورت کاملاً خودکار، پشتیبانی از متون راست‌چین (RTL) و فونت زیبای **وزیرمتن** را به اپلیکیشن دسکتاپ **Claude (کلود)** برای مک‌اواس اضافه می‌کند. 

✨ **RTL applied by Rick Sanchez and Vazirmatn font used in memory of Saber Rastikerdar.** ✨

## 🚀 نصب و استفاده (Installation & Usage)

بدون نیاز به دانلود فایل یا کارهای پیچیده، فقط کافیست ترمینال مک (Terminal) را باز کنید و دستور زیر را اجرا کنید (نیاز به نصب بودن Node.js دارد):

\`\`\`bash
npx claude-rtl-patcher
\`\`\`

اسکریپت به صورت خودکار فایل‌های برنامه `Claude.app` شما را پیدا کرده، استایل‌ها و فونت را تزریق کرده و مشکلات امنیتی (Gatekeeper) مک‌اواس را برطرف می‌کند تا برنامه بدون مشکل باز شود. 

*(این اسکریپت به صورت هوشمند طراحی شده تا با آپدیت‌های آینده و نسخه‌های مختلف Claude نیز کار کند)*

پس از اتمام کار، برنامه کلود را کامل ببندید (`Cmd + Q`) و دوباره باز کنید.

---

### Features (ویژگی‌ها)
- **پشتیبانی کامل از متن فارسی**: به لطف ویژگی `unicode-bidi: plaintext`، متون فارسی به صورت خودکار راست‌چین و متون انگلیسی چپ‌چین باقی می‌مانند.
- **فونت وزیرمتن**: تمام رابط کاربری، چت‌ها و ورودی متن با فونت Vazirmatn نمایش داده می‌شوند تا ظاهری فوق‌العاده شیک داشته باشید.
- **کاملاً خودکار**: تمامی مراحل از استخراج `app.asar` تا محاسبه هش (SHA256) و برطرف کردن ارورهای امضای دیجیتال مک‌اواس (`codesign`) توسط این ابزار انجام می‌شود.

### How it works (چگونه کار می‌کند؟)
1. برنامه `app.asar` را از داخل `/Applications/Claude.app` استخراج می‌کند.
2. با جستجوی هوشمند در فایل‌های `.vite/build` و `.vite/renderer` کدهای جاوااسکریپت و CSS کلود را شناسایی کرده و استایل‌ها را تزریق می‌کند.
3. فایل را به صورت استاندارد دوباره پکیج کرده (Native Modules را سالم نگه می‌دارد).
4. هش امنیتی موجود در `Info.plist` را آپدیت می‌کند.
5. محدودیت اجرای برنامه‌های تغییر یافته (`Quarantine` و `Signature`) را از روی Claude برمی‌دارد.

### Contribution
Feel free to open issues or submit pull requests. Currently supports **macOS** installations of the Claude Desktop App. Windows support can be easily added by adjusting the path!
