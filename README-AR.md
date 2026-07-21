<div align="center">
  <img src="./assets/preview.png" alt="Claude RTL Patcher Preview" width="100%">
  
  <h1>🌟 Claude RTL Patcher (Persian / Arabic / Hebrew)</h1>
  <p><strong>الأداة التلقائية الأفضل لدعم النصوص من اليمين إلى اليسار (RTL) والخطوط الجميلة في تطبيق Claude لسطح المكتب.</strong></p>

  [![npm version](https://badge.fury.io/js/claude-rtl-patcher.svg)](https://www.npmjs.com/package/claude-rtl-patcher)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
  [![GitHub stars](https://img.shields.io/github/stars/m4tinbeigi-official/claude-rtl-patcher.svg?style=social&label=Star)](https://github.com/m4tinbeigi-official/claude-rtl-patcher/stargazers)

  ✨ *تم تطبيق خاصية RTL بواسطة Rick Sanchez، وتم استخدام خط Vazirmatn إحياءً لذكرى صابر راستيكردار.* ✨

  [🇺🇸 Read in English](./README.md) | [🇮🇷 نسخه فارسی (Persian)](./README-FA.md) | [🇮🇱 קרא בעברית (Hebrew)](./README-HE.md)
</div>

---

هذه أداة مفتوحة المصدر وتلقائية تقوم بإضافة الدعم الكامل للنصوص التي تُكتب من اليمين إلى اليسار **(RTL)** وخط **Vazirmatn** الجميل مباشرة إلى **تطبيق Claude الرسمي لسطح المكتب** (على أنظمة macOS و Windows و Linux).
وتعمل على إصلاح محاذاة النص المكسورة للغات مثل **العربية، والفارسية، والعبرية** حتى تتمكن من الدردشة مع Claude بكل سلاسة.

## 🚀 التثبيت بنقرة واحدة (موصى به)

لست بحاجة إلى تنزيل أو تثبيت أي شيء يدوياً. فقط افتح نافذة الأوامر في نظامك (CMD / PowerShell / Mac Terminal) والصق هذا الأمر السحري:

\`\`\`bash
npx claude-rtl-patcher
\`\`\`

*(تحتوي الأداة على واجهة تفاعلية جميلة ستقوم تلقائياً باكتشاف نظام التشغيل الخاص بك، وإنشاء نسخة احتياطية، وحقن أكواد CSS، وتجاوز القيود الأمنية في ثوانٍ معدودة!)*

بمجرد الانتهاء، أغلق تطبيق Claude بالكامل (`Cmd + Q` أو `Ctrl + Q`) ثم افتحه مرة أخرى.

---

## 🐧 المسارات المخصصة ونظام Linux
إذا قمت بتثبيت Claude في مجلد مخصص، أو كنت تستخدم إصداراً غير رسمي على نظام Linux، قم ببساطة بتوفير مسار التثبيت الخاص بك (أو مباشرة إلى ملف `app.asar`) كـ argument:
\`\`\`bash
npx claude-rtl-patcher /opt/Claude
# أو مباشرة إلى ملف asar:
npx claude-rtl-patcher /home/user/.local/share/Claude/resources/app.asar
\`\`\`

---

## ⏪ كيفية الاستعادة (Restore)
إذا أردت في أي وقت إعادة Claude إلى حالته الأصلية، فقط قم بتشغيل:
\`\`\`bash
npx claude-rtl-patcher --restore
\`\`\`
ستتم استعادة نسختك الاحتياطية الأصلية على الفور.

---

## 🆘 أمر الطوارئ (Fallback Prompt)
إذا فشلت الأداة بسبب إصدار غير معروف أو تحديث كبير لتطبيق Claude، لا تقلق. الأداة ستقوم باستعادة تطبيقك بأمان.
كحل بديل، فقط انسخ هذا الطلب والصقه في Claude نفسه، ودع Claude يُصلح تطبيق سطح المكتب الخاص به نيابة عنك!

> "Hey Claude! I am trying to run the `claude-rtl-patcher` on my system to add RTL and Vazirmatn font to your Desktop App. It failed to patch my current version. Can you please write a custom Node.js script using `@electron/asar` to dynamically patch your `.vite/build` and `.vite/renderer` CSS and JS files for my specific version? Make sure to use the `--unpack` flag for `.node` files, calculate the new ASAR SHA256, update `Info.plist`, and run `codesign --remove-signature` to bypass Gatekeeper. Please do everything automatically."

---

## 🛠️ التقنيات المستخدمة
- **[Node.js](https://nodejs.org/):** المعالج الأساسي.
- **[@electron/asar](https://github.com/electron/asar):** استخراج وإعادة حزم مصادر Electron بأمان دون كسر الـ Native Modules.
- **[Inquirer](https://www.npmjs.com/package/inquirer):** قوائم الأوامر التفاعلية.
- **[Chalk](https://www.npmjs.com/package/chalk) & [Ora](https://www.npmjs.com/package/ora) & [Figlet](https://www.npmjs.com/package/figlet):** واجهة مستخدم ملونة وجميلة مع مؤشرات التحميل.
- **[Crypto]:** حساب SHA256 ذكي لتجاوز فحص النزاهة الخاص بـ Apple ASAR (`Gatekeeper Bypass`).

---

## 🤝 دعوة للمساهمين
نرحب بطلبات السحب (Pull Requests) من الجميع!

<a href="https://github.com/m4tinbeigi-official/claude-rtl-patcher/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=m4tinbeigi-official/claude-rtl-patcher" />
</a>

---

## ⭐ ادعم المشروع
إذا جعلت هذه الأداة تجربتك مع Claude أفضل، يرجى التفكير في إعطاء **نجمة (⭐)** لهذا المستودع في أعلى الصفحة. هذا يساعد المشروع في الوصول إلى المزيد من المستخدمين!

## 📜 الترخيص
تم النشر بموجب ترخيص **MIT** المفتوح بالكامل. أنت حر في تعديل هذا الكود وتوزيعه واستخدامه تجارياً. 🕊️
