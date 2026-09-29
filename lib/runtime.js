function getRuntimeScript() {
    return `
(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    if (window.__CLAUDE_RTL_INITIALIZED__) return;
    window.__CLAUDE_RTL_INITIALIZED__ = true;

    const MODES = ["auto", "force", "disabled"];
    const LABELS = {
        "auto": "✨ راست‌چین: خودکار (Auto RTL)",
        "force": "✨ راست‌چین: اجباری (Force RTL)",
        "disabled": "✨ راست‌چین: غیرفعال (Disabled)"
    };

    const RTL_REGEX = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;
    let updatePending = false;
    let isSelecting = false;
    let toastTimer = null;

    function getConfig() {
        const defaults = {
            mode: "auto",
            fontSize: "16",
            lineHeight: "1.65",
            customFont: ""
        };
        try {
            const raw = localStorage.getItem("claude_rtl_config");
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed) {
                    if (MODES.includes(parsed.mode)) defaults.mode = parsed.mode;
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
            const root = document.documentElement;
            root.style.setProperty("--claude-rtl-font-size", (cfg.fontSize || "16") + "px");
            root.style.setProperty("--claude-rtl-line-height", cfg.lineHeight || "1.65");
            if (cfg.customFont && cfg.customFont.trim()) {
                const cleanFont = cfg.customFont.replace(/['"]/g, "").trim();
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
        let text = "";
        try {
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
                acceptNode: (node) => {
                    const parent = node.parentElement;
                    if (parent && parent.closest("pre, code, [class*='code-block' i], [class*='epitaxy-codeblock' i], [class*='group/copy']")) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            });
            let curr = walker.nextNode();
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

    function updateDir() {
        if (isSelecting) return;
        const cfg = getConfig();
        if (cfg.mode === "disabled") {
            document.querySelectorAll("[data-claude-dir]").forEach((el) => {
                el.removeAttribute("dir");
                el.removeAttribute("data-claude-dir");
            });
            return;
        }

        const isForce = (cfg.mode === "force");

        // Force all code blocks, pre, and syntax-highlighted containers to be strictly LTR
        const codeBlocks = document.querySelectorAll('pre, code, [class*="code-block" i], pre[class*="code__" i], code[class*="code__" i], [class*="group/copy"], [class*="epitaxy-codeblock" i]');
        for (let c = 0; c < codeBlocks.length; c++) {
            const cb = codeBlocks[c];
            if (cb.getAttribute("dir") !== "ltr") {
                cb.setAttribute("dir", "ltr");
                cb.setAttribute("data-claude-dir", "ltr");
            }
        }

        const elements = document.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, th, td, blockquote, [data-cds="UserMessage"], .cds-user-message-body, [data-testid="user-message"], .font-user-message, [contenteditable="true"] p, [contenteditable="true"]');
        for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            if (isInsideProtectedElement(el)) continue;

            // Performance boost: Skip elements that already have settled direction (unless contenteditable)
            if (!el.isContentEditable && el.getAttribute("data-claude-dir") && !isForce) {
                continue;
            }

            const text = getProseText(el);
            if (!text) continue;

            const isRTL = isForce || RTL_REGEX.test(text);
            const targetDir = isRTL ? "rtl" : "ltr";

            if (el.getAttribute("dir") !== targetDir) {
                el.setAttribute("dir", targetDir);
                el.setAttribute("data-claude-dir", targetDir);
            }

            if ((el.tagName === 'TH' || el.tagName === 'TD') && isRTL) {
                const parentTable = el.closest('table');
                if (parentTable && parentTable.getAttribute('dir') !== 'rtl') {
                    parentTable.setAttribute('dir', 'rtl');
                    parentTable.setAttribute('data-claude-dir', 'rtl');
                }
            }
            if (el.tagName === "LI" && isRTL) {
                const parentList = el.parentElement;
                if (parentList && (parentList.tagName === "UL" || parentList.tagName === "OL")) {
                    if (parentList.getAttribute("dir") !== "rtl") {
                        parentList.setAttribute("dir", "rtl");
                        parentList.setAttribute("data-claude-dir", "rtl");
                    }
                }
            }
        }
    }

    function scheduleUpdateDir() {
        if (isSelecting) return;
        if (updatePending) return;
        updatePending = true;
        if (typeof requestAnimationFrame === "function") {
            requestAnimationFrame(() => {
                updatePending = false;
                updateDir();
            });
        } else {
            setTimeout(() => {
                updatePending = false;
                updateDir();
            }, 50);
        }
    }

    function applyMode(mode, showToastNotification) {
        try {
            const cfg = getConfig();
            cfg.mode = mode;
            saveConfig(cfg);
            document.documentElement.setAttribute("data-claude-rtl", mode);
            updateDir();
            syncWidgetUI();
            if (showToastNotification) showToast(LABELS[mode] || mode);
        } catch (e) {}
    }

    function showToast(text) {
        try {
            const id = "claude-rtl-toast";
            let toast = document.getElementById(id);
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
            toastTimer = setTimeout(() => {
                toast.style.opacity = "0";
                toast.style.transform = "translateX(-50%) translateY(20px)";
            }, 1600);
        } catch (e) {}
    }

    function createFloatingWidget() {
        if (document.getElementById("claude-rtl-widget")) return;
        const widget = document.createElement("div");
        widget.id = "claude-rtl-widget";
        widget.innerHTML = '<div id="claude-rtl-widget-btn" title="تنظیمات فونت و راست‌چین (Alt + R)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg></div><div id="claude-rtl-widget-panel"><div style="font-size:13px;font-weight:700;color:#58a6ff;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:6px;display:flex;justify-content:space-between;align-items:center;"><span>تنظیمات راست‌چین</span><span style="font-size:10px;opacity:0.6;font-weight:normal;">Alt + R</span></div><div class="claude-rtl-row"><span class="claude-rtl-label">حالت چیدمان:</span><select id="claude-rtl-mode-select" class="claude-rtl-select"><option value="auto">خودکار (Auto)</option><option value="force">اجباری (Force)</option><option value="disabled">غیرفعال (Off)</option></select></div><div class="claude-rtl-row"><span class="claude-rtl-label">اندازه قلم (<span id="claude-rtl-fs-val">16</span>px):</span><input id="claude-rtl-fs-slider" type="range" min="13" max="24" step="1" class="claude-rtl-slider"></div><div class="claude-rtl-row"><span class="claude-rtl-label">فاصله خطوط (<span id="claude-rtl-lh-val">1.65</span>):</span><input id="claude-rtl-lh-slider" type="range" min="1.3" max="2.4" step="0.05" class="claude-rtl-slider"></div><div class="claude-rtl-row"><span class="claude-rtl-label">فونت دلخواه:</span><input id="claude-rtl-font-input" type="text" placeholder="پیش‌فرض: Vazirmatn" class="claude-rtl-input" style="width:120px;"></div></div>';
        document.body.appendChild(widget);

        const modeSelect = document.getElementById("claude-rtl-mode-select");
        const fsSlider = document.getElementById("claude-rtl-fs-slider");
        const fsVal = document.getElementById("claude-rtl-fs-val");
        const lhSlider = document.getElementById("claude-rtl-lh-slider");
        const lhVal = document.getElementById("claude-rtl-lh-val");
        const fontInput = document.getElementById("claude-rtl-font-input");

        modeSelect.addEventListener("change", (e) => {
            applyMode(e.target.value, true);
        });

        fsSlider.addEventListener("input", (e) => {
            fsVal.textContent = e.target.value;
            const cfg = getConfig();
            cfg.fontSize = e.target.value;
            saveConfig(cfg);
            applyTypographySettings(cfg);
        });

        lhSlider.addEventListener("input", (e) => {
            lhVal.textContent = e.target.value;
            const cfg = getConfig();
            cfg.lineHeight = e.target.value;
            saveConfig(cfg);
            applyTypographySettings(cfg);
        });

        fontInput.addEventListener("change", (e) => {
            const cfg = getConfig();
            cfg.customFont = e.target.value.trim();
            saveConfig(cfg);
            applyTypographySettings(cfg);
            showToast("قلم به‌روزرسانی شد ✨");
        });

        syncWidgetUI();
    }

    function syncWidgetUI() {
        const cfg = getConfig();
        const modeSelect = document.getElementById("claude-rtl-mode-select");
        const fsSlider = document.getElementById("claude-rtl-fs-slider");
        const fsVal = document.getElementById("claude-rtl-fs-val");
        const lhSlider = document.getElementById("claude-rtl-lh-slider");
        const lhVal = document.getElementById("claude-rtl-lh-val");
        const fontInput = document.getElementById("claude-rtl-font-input");

        if (modeSelect) modeSelect.value = cfg.mode;
        if (fsSlider) fsSlider.value = cfg.fontSize || "16";
        if (fsVal) fsVal.textContent = cfg.fontSize || "16";
        if (lhSlider) lhSlider.value = cfg.lineHeight || "1.65";
        if (lhVal) lhVal.textContent = cfg.lineHeight || "1.65";
        if (fontInput) fontInput.value = cfg.customFont || "";
    }

    function setupShortcuts() {
        document.addEventListener("keydown", (e) => {
            if (e.altKey && (e.code === "KeyR" || e.key === "r" || e.key === "R" || e.key === "ق")) {
                e.preventDefault();
                const cfg = getConfig();
                const nextIndex = (MODES.indexOf(cfg.mode) + 1) % MODES.length;
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

        document.addEventListener("mousedown", () => {
            isSelecting = true;
        }, { capture: true, passive: true });

        document.addEventListener("mouseup", () => {
            isSelecting = false;
            setTimeout(() => {
                if (!isSelecting) scheduleUpdateDir();
            }, 60);
        }, { capture: true, passive: true });

        document.body.addEventListener("input", (e) => {
            const target = e.target;
            if (target && (target.isContentEditable || target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
                const cfg = getConfig();
                if (cfg.mode === "disabled") return;
                const text = (target.textContent || target.value || "").trim();
                if (text) {
                    const isRTL = (cfg.mode === "force") || RTL_REGEX.test(text);
                    target.setAttribute("dir", isRTL ? "rtl" : "ltr");
                }
            }
        }, { capture: true, passive: true });

        if (typeof MutationObserver !== "undefined") {
            let activeTarget = null;
            const observer = new MutationObserver((mutations) => {
                let hasNewElements = false;
                for (let i = 0; i < mutations.length; i++) {
                    const m = mutations[i];
                    // Skip mutations originating inside the RTL widget or toast notifications
                    if (m.target && m.target.closest && m.target.closest('#claude-rtl-widget, #claude-rtl-toast')) {
                        continue;
                    }
                    if (m.addedNodes.length > 0) {
                        // Check if Claude's main container was just mounted while observing a fallback
                        const mainContainer = document.querySelector('main, [role="main"]');
                        if (mainContainer && activeTarget !== mainContainer) {
                            retargetObserver();
                        }
                        hasNewElements = true;
                        break;
                    }
                }
                if (hasNewElements) scheduleUpdateDir();
            });

            function retargetObserver() {
                const target = document.querySelector('main, [role="main"]') || document.getElementById('root') || document.body;
                if (target && target !== activeTarget) {
                    observer.disconnect();
                    activeTarget = target;
                    observer.observe(target, { childList: true, subtree: true });
                }
            }

            retargetObserver();
        }
    }

    function init() {
        const cfg = getConfig();
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
