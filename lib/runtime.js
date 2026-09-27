function getRuntimeScript() {
    return `
(function() {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    if (window.__CLAUDE_RTL_INITIALIZED__) return;
    window.__CLAUDE_RTL_INITIALIZED__ = true;

    var MODES = ["auto", "force", "disabled"];
    var LABELS = {
        "auto": "✨ راست‌چین: خودکار (Auto RTL)",
        "force": "✨ راست‌چین: اجباری (Force RTL)",
        "disabled": "✨ راست‌چین: غیرفعال (Disabled)"
    };

    var RTL_REGEX = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;

    function getConfig() {
        var defaults = {
            mode: "auto",
            fontSize: "16",
            lineHeight: "1.65",
            customFont: ""
        };
        try {
            var raw = localStorage.getItem("claude_rtl_config");
            if (raw) {
                var parsed = JSON.parse(raw);
                if (parsed) {
                    if (MODES.indexOf(parsed.mode) !== -1) defaults.mode = parsed.mode;
                    if (parsed.fontSize) defaults.fontSize = String(parsed.fontSize);
                    if (parsed.lineHeight) defaults.lineHeight = String(parsed.lineHeight);
                    if (typeof parsed.customFont === "string") defaults.customFont = parsed.customFont;
                }
            }
        } catch (e) {}
        return defaults;
    }

    function saveConfig(cfg) {
        try {
            localStorage.setItem("claude_rtl_config", JSON.stringify(cfg));
            localStorage.setItem("claude_rtl_mode", cfg.mode);
        } catch (e) {}
    }

    function applyTypographySettings(cfg) {
        try {
            var root = document.documentElement;
            root.style.setProperty("--claude-rtl-font-size", (cfg.fontSize || "16") + "px");
            root.style.setProperty("--claude-rtl-line-height", cfg.lineHeight || "1.65");
            if (cfg.customFont && cfg.customFont.trim()) {
                var cleanFont = cfg.customFont.replace(/['"]/g, "").trim();
                root.style.setProperty("--claude-rtl-custom-font", "'" + cleanFont + "', 'CustomPersianFont'");
            } else {
                root.style.removeProperty("--claude-rtl-custom-font");
            }
        } catch (e) {}
    }

    function isInsideProtectedElement(el) {
        if (!el || !el.closest) return false;
        return !!el.closest('nav, [role="navigation"], aside, header, pre, code, [class*="code-block" i], pre[class*="code__" i], code[class*="code__" i], [class*="group/copy"], [class*="epitaxy-codeblock" i], [class*="thinking" i], [class*="thought" i], [class*="reasoning" i], [class*="katex" i], .monaco-editor, button, [role="button"], [data-cds*="icon" i], [class*="icon" i], [class*="Icon"], [class*="lucide" i], [class*="codicon" i], [aria-hidden="true"], svg, #claude-rtl-widget');
    }

    function getProseText(el) {
        if (!el.querySelector("pre, code, [class*='code-block' i], [class*='epitaxy-codeblock' i]")) {
            return (el.textContent || "").slice(0, 120).replace(/[​-‏﻿]/g, "").trim();
        }
        var text = "";
        try {
            var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
                acceptNode: function(node) {
                    var parent = node.parentElement;
                    if (parent && parent.closest("pre, code, [class*='code-block' i], [class*='epitaxy-codeblock' i], [class*='group/copy']")) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            });
            var curr = walker.nextNode();
            while (curr) {
                text += curr.nodeValue;
                if (text.length >= 120) break;
                curr = walker.nextNode();
            }
        } catch (e) {
            text = (el.textContent || "").slice(0, 120);
        }
        return text.replace(/[​-‏﻿]/g, "").trim();
    }

    var isSelecting = false;
    function updateDir() {
        if (isSelecting) return;
        var cfg = getConfig();
        if (cfg.mode === "disabled") {
            document.querySelectorAll("[data-claude-dir]").forEach(function(el) {
                el.removeAttribute("dir");
                el.removeAttribute("data-claude-dir");
            });
            return;
        }

        var isForce = (cfg.mode === "force");

        // Force all code blocks, pre, and syntax-highlighted containers to be strictly LTR
        var codeBlocks = document.querySelectorAll('pre, code, [class*="code-block" i], pre[class*="code__" i], code[class*="code__" i], [class*="group/copy"], [class*="epitaxy-codeblock" i]');
        for (var c = 0; c < codeBlocks.length; c++) {
            var cb = codeBlocks[c];
            if (cb.getAttribute("dir") !== "ltr") {
                cb.setAttribute("dir", "ltr");
                cb.setAttribute("data-claude-dir", "ltr");
            }
        }

        var elements = document.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, th, td, blockquote, [data-cds="UserMessage"], .cds-user-message-body, [data-testid="user-message"], .font-user-message, [contenteditable="true"] p, [contenteditable="true"]');
        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            if (isInsideProtectedElement(el)) continue;

            // Performance boost: Skip elements that already have settled direction (unless contenteditable)
            if (!el.isContentEditable && el.getAttribute("data-claude-dir") && !isForce) {
                continue;
            }

            var text = getProseText(el);
            if (!text) continue;

            var isRTL = isForce || RTL_REGEX.test(text);
            var targetDir = isRTL ? "rtl" : "ltr";

            if (el.getAttribute("dir") !== targetDir) {
                el.setAttribute("dir", targetDir);
                el.setAttribute("data-claude-dir", targetDir);
            }

            if ((el.tagName === 'TH' || el.tagName === 'TD') && isRTL) {
                var parentTable = el.closest('table');
                if (parentTable && parentTable.getAttribute('dir') !== 'rtl') {
                    parentTable.setAttribute('dir', 'rtl');
                    parentTable.setAttribute('data-claude-dir', 'rtl');
                }
            }
            if (el.tagName === "LI" && isRTL) {
                var parentList = el.parentElement;
                if (parentList && (parentList.tagName === "UL" || parentList.tagName === "OL")) {
                    if (parentList.getAttribute("dir") !== "rtl") {
                        parentList.setAttribute("dir", "rtl");
                        parentList.setAttribute("data-claude-dir", "rtl");
                    }
                }
            }
        }
    }

    var selectionTimeout = null;
    function scheduleUpdateDir() {
        if (isSelecting) return;
        if (updatePending) return;
        updatePending = true;
        if (typeof requestAnimationFrame === "function") {
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
            var cfg = getConfig();
            cfg.mode = mode;
            saveConfig(cfg);
            document.documentElement.setAttribute("data-claude-rtl", mode);
            updateDir();
            syncWidgetUI();
            if (showToastNotification) showToast(LABELS[mode] || mode);
        } catch (e) {}
    }

    var toastTimer = null;
    function showToast(text) {
        try {
            var id = "claude-rtl-toast";
            var toast = document.getElementById(id);
            if (!toast) {
                toast = document.createElement("div");
                toast.id = id;
                toast.style.cssText = "position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);background:rgba(22,27,34,0.92);color:#58a6ff;padding:8px 18px;border-radius:24px;font-size:13px;font-weight:600;font-family:Vazirmatn,system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,0.35);border:1px solid rgba(88,166,255,0.25);backdrop-filter:blur(8px);z-index:999999;pointer-events:none;opacity:0;transition:opacity 0.25s ease,transform 0.25s ease;direction:rtl;";
                document.body.appendChild(toast);
            }
            toast.textContent = text;
            toast.style.opacity = "1";
            toast.style.transform = "translateX(-50%) translateY(0)";
            if (toastTimer) clearTimeout(toastTimer);
            toastTimer = setTimeout(function() {
                toast.style.opacity = "0";
                toast.style.transform = "translateX(-50%) translateY(20px)";
            }, 1600);
        } catch (e) {}
    }

    function createFloatingWidget() {
        if (document.getElementById("claude-rtl-widget")) return;
        var widget = document.createElement("div");
        widget.id = "claude-rtl-widget";
        widget.innerHTML = '<div id="claude-rtl-widget-btn" title="تنظیمات فونت و راست‌چین (Alt + R)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg></div><div id="claude-rtl-widget-panel"><div style="font-size:13px;font-weight:700;color:#58a6ff;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:6px;display:flex;justify-content:space-between;align-items:center;"><span>تنظیمات راست‌چین</span><span style="font-size:10px;opacity:0.6;font-weight:normal;">Alt + R</span></div><div class="claude-rtl-row"><span class="claude-rtl-label">حالت چیدمان:</span><select id="claude-rtl-mode-select" class="claude-rtl-select"><option value="auto">خودکار (Auto)</option><option value="force">اجباری (Force)</option><option value="disabled">غیرفعال (Off)</option></select></div><div class="claude-rtl-row"><span class="claude-rtl-label">اندازه قلم (<span id="claude-rtl-fs-val">16</span>px):</span><input id="claude-rtl-fs-slider" type="range" min="13" max="24" step="1" class="claude-rtl-slider"></div><div class="claude-rtl-row"><span class="claude-rtl-label">فاصله خطوط (<span id="claude-rtl-lh-val">1.65</span>):</span><input id="claude-rtl-lh-slider" type="range" min="1.3" max="2.4" step="0.05" class="claude-rtl-slider"></div><div class="claude-rtl-row"><span class="claude-rtl-label">فونت دلخواه:</span><input id="claude-rtl-font-input" type="text" placeholder="پیش‌فرض: Vazirmatn" class="claude-rtl-input" style="width:120px;"></div></div>';
        document.body.appendChild(widget);

        var modeSelect = document.getElementById("claude-rtl-mode-select");
        var fsSlider = document.getElementById("claude-rtl-fs-slider");
        var fsVal = document.getElementById("claude-rtl-fs-val");
        var lhSlider = document.getElementById("claude-rtl-lh-slider");
        var lhVal = document.getElementById("claude-rtl-lh-val");
        var fontInput = document.getElementById("claude-rtl-font-input");

        modeSelect.addEventListener("change", function(e) {
            applyMode(e.target.value, true);
        });

        fsSlider.addEventListener("input", function(e) {
            fsVal.textContent = e.target.value;
            var cfg = getConfig();
            cfg.fontSize = e.target.value;
            saveConfig(cfg);
            applyTypographySettings(cfg);
        });

        lhSlider.addEventListener("input", function(e) {
            lhVal.textContent = e.target.value;
            var cfg = getConfig();
            cfg.lineHeight = e.target.value;
            saveConfig(cfg);
            applyTypographySettings(cfg);
        });

        fontInput.addEventListener("change", function(e) {
            var cfg = getConfig();
            cfg.customFont = e.target.value.trim();
            saveConfig(cfg);
            applyTypographySettings(cfg);
            showToast("قلم به‌روزرسانی شد ✨");
        });

        syncWidgetUI();
    }

    function syncWidgetUI() {
        var cfg = getConfig();
        var modeSelect = document.getElementById("claude-rtl-mode-select");
        var fsSlider = document.getElementById("claude-rtl-fs-slider");
        var fsVal = document.getElementById("claude-rtl-fs-val");
        var lhSlider = document.getElementById("claude-rtl-lh-slider");
        var lhVal = document.getElementById("claude-rtl-lh-val");
        var fontInput = document.getElementById("claude-rtl-font-input");

        if (modeSelect) modeSelect.value = cfg.mode;
        if (fsSlider) fsSlider.value = cfg.fontSize || "16";
        if (fsVal) fsVal.textContent = cfg.fontSize || "16";
        if (lhSlider) lhSlider.value = cfg.lineHeight || "1.65";
        if (lhVal) lhVal.textContent = cfg.lineHeight || "1.65";
        if (fontInput) fontInput.value = cfg.customFont || "";
    }

    function setupShortcuts() {
        document.addEventListener("keydown", function(e) {
            if (e.altKey && (e.code === "KeyR" || e.key === "r" || e.key === "R" || e.key === "ق")) {
                e.preventDefault();
                var cfg = getConfig();
                var nextIndex = (MODES.indexOf(cfg.mode) + 1) % MODES.length;
                applyMode(MODES[nextIndex], true);
                return;
            }

            if (e.code === "Digit2" && e.shiftKey && (e.key === "٬" || e.key === "،" || e.key === "‚")) {
                e.preventDefault();
                if (typeof document.execCommand === "function") {
                    document.execCommand("insertText", false, "@");
                }
            }
        }, { capture: true });

        document.addEventListener("mousedown", function() {
            isSelecting = true;
        }, { capture: true, passive: true });

        document.addEventListener("mouseup", function() {
            isSelecting = false;
            setTimeout(function() {
                if (!isSelecting) scheduleUpdateDir();
            }, 60);
        }, { capture: true, passive: true });

        document.body.addEventListener("input", function(e) {
            var target = e.target;
            if (target && (target.isContentEditable || target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
                var cfg = getConfig();
                if (cfg.mode === "disabled") return;
                var text = (target.textContent || target.value || "").trim();
                if (text) {
                    var isRTL = (cfg.mode === "force") || RTL_REGEX.test(text);
                    target.setAttribute("dir", isRTL ? "rtl" : "ltr");
                }
            }
        }, { capture: true, passive: true });
        if (typeof MutationObserver !== "undefined") {
            var observer = new MutationObserver(function(mutations) {
                // Ignore characterData changes (typing keystrokes)
                var hasNewElements = false;
                for (var i = 0; i < mutations.length; i++) {
                    if (mutations[i].addedNodes.length > 0) {
                        hasNewElements = true;
                        break;
                    }
                }
                if (hasNewElements) scheduleUpdateDir();
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    function init() {
        var cfg = getConfig();
        applyTypographySettings(cfg);
        applyMode(cfg.mode, false);
        setupShortcuts();
        createFloatingWidget();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
    `.trim();
}

module.exports = { getRuntimeScript };
