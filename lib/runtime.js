function getRuntimeScript() {
    return `
(function() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (window.__CLAUDE_RTL_INITIALIZED__) return;
    window.__CLAUDE_RTL_INITIALIZED__ = true;

    var MODES = ['auto', 'force', 'disabled'];
    var LABELS = {
        'auto': '✨ راست‌چین: خودکار (Auto RTL)',
        'force': '✨ راست‌چین: اجباری (Force RTL)',
        'disabled': '✨ راست‌چین: غیرفعال (Disabled)'
    };

    function getSavedMode() {
        try {
            var saved = localStorage.getItem('claude_rtl_mode');
            if (saved && MODES.indexOf(saved) !== -1) return saved;
        } catch (e) {}
        return 'auto';
    }

    function applyMode(mode, showToastNotification) {
        try {
            document.documentElement.setAttribute('data-claude-rtl', mode);
            try { localStorage.setItem('claude_rtl_mode', mode); } catch (e) {}
            if (showToastNotification) showToast(LABELS[mode] || mode);
        } catch (e) {}
    }

    var toastTimer = null;
    function showToast(text) {
        try {
            var id = 'claude-rtl-toast';
            var toast = document.getElementById(id);
            if (!toast) {
                toast = document.createElement('div');
                toast.id = id;
                toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);background:rgba(22,27,34,0.92);color:#58a6ff;padding:8px 18px;border-radius:24px;font-size:13px;font-weight:600;font-family:Vazirmatn,system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,0.35);border:1px solid rgba(88,166,255,0.25);backdrop-filter:blur(8px);z-index:999999;pointer-events:none;opacity:0;transition:opacity 0.25s ease,transform 0.25s ease;direction:rtl;';
                document.body.appendChild(toast);
            }
            toast.textContent = text;
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
            if (toastTimer) clearTimeout(toastTimer);
            toastTimer = setTimeout(function() {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(-50%) translateY(20px)';
            }, 1600);
        } catch (e) {}
    }

    function setupShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Alt + R: Cycle RTL mode (auto -> force -> disabled -> auto)
            if (e.altKey && (e.code === 'KeyR' || e.key === 'r' || e.key === 'R' || e.key === 'ق')) {
                e.preventDefault();
                var current = getSavedMode();
                var nextIndex = (MODES.indexOf(current) + 1) % MODES.length;
                applyMode(MODES[nextIndex], true);
                return;
            }

            // Shift + 2 fix for Persian Keyboard: type '@' instead of '٬' or '،'
            if (e.code === 'Digit2' && e.shiftKey && (e.key === '٬' || e.key === '،' || e.key === '‚')) {
                e.preventDefault();
                if (typeof document.execCommand === 'function') {
                    document.execCommand('insertText', false, '@');
                }
            }
        }, { capture: true });
    }

    function init() {
        applyMode(getSavedMode(), false);
        setupShortcuts();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
    `.trim();
}

module.exports = { getRuntimeScript };
