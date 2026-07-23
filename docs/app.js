(() => {
  const root = document.documentElement;
  const toggle = document.getElementById('langToggle');
  let language = 'fa';
  const updateLanguage = () => {
    root.lang = language;
    root.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-fa][data-en]').forEach((node) => { node.textContent = node.dataset[language]; });
    toggle.textContent = language === 'fa' ? 'English' : 'فارسی';
    document.title = language === 'fa' ? 'Claude RTL Patcher | پشتیبانی فارسی در Claude Desktop' : 'Claude RTL Patcher | RTL support for Claude Desktop';
  };
  toggle.addEventListener('click', () => { language = language === 'fa' ? 'en' : 'fa'; updateLanguage(); });
  document.querySelectorAll('.tab').forEach((tab) => tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((item) => item.classList.remove('active'));
    document.querySelectorAll('.command').forEach((item) => item.classList.add('hidden'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.remove('hidden');
  }));
  document.querySelectorAll('.copy').forEach((button) => button.addEventListener('click', async () => {
    await navigator.clipboard.writeText(button.dataset.copy);
    const previous = button.textContent;
    button.textContent = '✓';
    setTimeout(() => { button.textContent = previous; }, 1200);
  }));
})();
