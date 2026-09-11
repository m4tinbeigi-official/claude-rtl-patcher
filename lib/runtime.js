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

    var RTL_REGEX = /[\\u0600-\\u06FF\\u0750-\\u077F\\u08A0-\\u08FF\\uFB50-\\uFDFF\\uFE70-\\uFEFF]/;

    function getSavedMode() {
        try {
            var saved = localStorage.getItem('claude_rtl_mode');
            if (saved && MODES.indexOf(saved) !== -1) return saved;
        } catch (e) {}
        return 'auto';
    }

    function updateDir() {
        var mode = getSavedMode();
        if (mode === 'disabled') {
            document.querySelectorAll('[data-claude-dir]').forEach(function(el) {
                el.removeAttribute('dir');
                el.removeAttribute('data-claude-dir');
            });
            return;
        }

        var isForce = (mode === 'force');

        var elements = document.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, blockquote, [contenteditable="true"] p, [contenteditable="true"]');
        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            if (el.closest('pre, code, [class*="thinking" i], [class*="thought" i], [class*="reasoning" i], [class*="katex" i], .monaco-editor')) {
                continue;
            }

            var text = el.textContent.replace(/[\\u200B-\\u200F\\uFEFF]/g, '').trim();
            if (!text) continue;

            var isRTL = isForce || RTL_REGEX.test(text);
            var targetDir = isRTL ? 'rtl' : 'ltr';

            if (el.getAttribute('dir') !== targetDir) {
                el.setAttribute('dir', targetDir);
                el.setAttribute('data-claude-dir', targetDir);
            }

            if (el.tagName === 'LI' && isRTL) {
                var parentList = el.parentElement;
                if (parentList && (parentList.tagName === 'UL' || parentList.tagName === 'OL')) {
                    if (parentList.getAttribute('dir') !== 'rtl') {
                        parentList.setAttribute('dir', 'rtl');
                        parentList.setAttribute('data-claude-dir', 'rtl');
                    }
                }
            }
        }
    }

    var updatePending = false;
    function scheduleUpdateDir() {
        if (updatePending) return;
        updatePending = true;
        if (typeof requestAnimationFrame === 'function') {
            requestAnimationFrame(function() {
                updatePending = false;
                updateDir();
            });
        } else {
            setTimeout(function() {
                updatePending = false;
                updateDir();
            }, 50);
        }
    }

    function applyMode(mode, showToastNotification) {
        try {
            document.documentElement.setAttribute('data-claude-rtl', mode);
            try { localStorage.setItem('claude_rtl_mode', mode); } catch (e) {}
            updateDir();
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

        // Update direction on input and DOM modifications
        document.body.addEventListener('input', scheduleUpdateDir, { capture: true });
        if (typeof MutationObserver !== 'undefined') {
            var observer = new MutationObserver(scheduleUpdateDir);
            observer.observe(document.body, { childList: true, subtree: true });
        }
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
