/**
 * תפריט נגישות — ללא צד שלישי.
 * מסננים וגופן על #site-content בלבד; קנה מידה על documentElement (rem).
 */

const STORAGE_PREFIX = 'moyal-a11y-';

const KEYS = {
    fontScale: STORAGE_PREFIX + 'font-scale',
    grayscale: STORAGE_PREFIX + 'grayscale',
    highContrast: STORAGE_PREFIX + 'high-contrast',
    readableFont: STORAGE_PREFIX + 'readable-font',
    linksHighlight: STORAGE_PREFIX + 'links-highlight',
};

const FONT_MIN = 0.85;
const FONT_MAX = 1.35;
const FONT_STEP = 0.05;
const FONT_DEFAULT = 1;

const TOGGLE_MAP = {
    grayscale: 'a11y-grayscale',
    'high-contrast': 'a11y-high-contrast',
    'readable-font': 'a11y-readable-font',
    'links-highlight': 'a11y-links-highlight',
};

function $(id) {
    return document.getElementById(id);
}

function getSiteContent() {
    return document.getElementById('site-content');
}

function readBool(key) {
    try {
        return sessionStorage.getItem(key) === '1';
    } catch {
        return false;
    }
}

function writeBool(key, value) {
    try {
        sessionStorage.setItem(key, value ? '1' : '0');
    } catch {
        /* ignore */
    }
}

function readFontScale() {
    try {
        const raw = sessionStorage.getItem(KEYS.fontScale);
        if (raw == null) return FONT_DEFAULT;
        const n = parseFloat(raw);
        if (Number.isNaN(n)) return FONT_DEFAULT;
        return Math.min(FONT_MAX, Math.max(FONT_MIN, n));
    } catch {
        return FONT_DEFAULT;
    }
}

function writeFontScale(n) {
    try {
        sessionStorage.setItem(KEYS.fontScale, String(n));
    } catch {
        /* ignore */
    }
}

function applyFontScale(scale) {
    const html = document.documentElement;
    if (Math.abs(scale - FONT_DEFAULT) < 0.001) {
        html.style.removeProperty('font-size');
        html.removeAttribute('data-a11y-font-scale');
        try {
            sessionStorage.removeItem(KEYS.fontScale);
        } catch {
            /* ignore */
        }
    } else {
        html.style.fontSize = `${scale * 100}%`;
        html.setAttribute('data-a11y-font-scale', String(scale));
    }
}

function applyToggleClass(siteContent, name, active) {
    const cls = TOGGLE_MAP[name];
    if (!cls || !siteContent) return;
    siteContent.classList.toggle(cls, active);
}

function syncToggleButtons(siteContent) {
    document.querySelectorAll('[data-a11y-toggle]').forEach(function (btn) {
        const key = btn.getAttribute('data-a11y-toggle');
        const cls = TOGGLE_MAP[key];
        if (!cls || !siteContent) return;
        const on = siteContent.classList.contains(cls);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
}

function restoreFromStorage(siteContent) {
    applyFontScale(readFontScale());
    applyToggleClass(siteContent, 'grayscale', readBool(KEYS.grayscale));
    applyToggleClass(siteContent, 'high-contrast', readBool(KEYS.highContrast));
    applyToggleClass(siteContent, 'readable-font', readBool(KEYS.readableFont));
    applyToggleClass(siteContent, 'links-highlight', readBool(KEYS.linksHighlight));
    syncToggleButtons(siteContent);
}

function resetAll(siteContent) {
    try {
        sessionStorage.removeItem(KEYS.fontScale);
    } catch {
        /* ignore */
    }
    applyFontScale(FONT_DEFAULT);
    Object.keys(TOGGLE_MAP).forEach(function (k) {
        applyToggleClass(siteContent, k, false);
    });
    writeBool(KEYS.grayscale, false);
    writeBool(KEYS.highContrast, false);
    writeBool(KEYS.readableFont, false);
    writeBool(KEYS.linksHighlight, false);
    syncToggleButtons(siteContent);
}

function initA11yPanel() {
    const siteContent = getSiteContent();
    const panel = $('a11y-panel');
    const fab = $('a11y-fab');
    const backdrop = $('a11y-backdrop');
    const closeBtn = $('a11y-close');
    const root = $('a11y-root');

    if (!siteContent || !panel || !fab) {
        return;
    }

    let open = false;
    let lastFocus = null;

    function setOpen(next) {
        open = next;
        panel.classList.toggle('is-open', open);
        fab.setAttribute('aria-expanded', open ? 'true' : 'false');
        fab.setAttribute('aria-label', open ? 'סגור תפריט נגישות' : 'פתח תפריט נגישות');
        panel.setAttribute('aria-hidden', open ? 'false' : 'true');
        if (backdrop) {
            backdrop.classList.toggle('is-visible', open);
            backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
        }
        if (open) {
            lastFocus = document.activeElement;
            const focusTarget = closeBtn || panel.querySelector('button');
            if (focusTarget && typeof focusTarget.focus === 'function') {
                requestAnimationFrame(function () {
                    focusTarget.focus();
                });
            }
        } else if (lastFocus && typeof lastFocus.focus === 'function') {
            lastFocus.focus();
            lastFocus = null;
        }
    }

    fab.addEventListener('click', function () {
        setOpen(!open);
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            setOpen(false);
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && open) {
            e.preventDefault();
            setOpen(false);
        }
    });

    document.addEventListener('mousedown', function (e) {
        if (!open) return;
        const t = e.target;
        // a11y-root ריק ב-HTML; הפאנל וה-FAB מחוצה לו — בלי הבדיקות האלה כל לחיצה על
        // כפתורי הנגישות סוגרת את הפאנל ב-mousedown לפני שה-click מפעיל את הפעולה.
        if (root && root.contains(t)) return;
        if (panel.contains(t)) return;
        if (fab.contains(t)) return;
        setOpen(false);
    });

    function bumpFont(delta) {
        let s = readFontScale();
        s = Math.round((s + delta) / FONT_STEP) * FONT_STEP;
        s = Math.min(FONT_MAX, Math.max(FONT_MIN, s));
        applyFontScale(s);
        if (Math.abs(s - FONT_DEFAULT) >= 0.001) {
            writeFontScale(s);
        }
    }

    const fontDown = $('a11y-font-down');
    const fontUp = $('a11y-font-up');
    const fontReset = $('a11y-font-reset');
    if (fontDown) fontDown.addEventListener('click', function () { bumpFont(-FONT_STEP); });
    if (fontUp) fontUp.addEventListener('click', function () { bumpFont(FONT_STEP); });
    if (fontReset) {
        fontReset.addEventListener('click', function () {
            try {
                sessionStorage.removeItem(KEYS.fontScale);
            } catch {
                /* ignore */
            }
            applyFontScale(FONT_DEFAULT);
        });
    }

    document.querySelectorAll('[data-a11y-toggle]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const key = btn.getAttribute('data-a11y-toggle');
            const cls = TOGGLE_MAP[key];
            if (!cls || !siteContent) return;
            const next = !siteContent.classList.contains(cls);
            siteContent.classList.toggle(cls, next);
            if (key === 'grayscale') writeBool(KEYS.grayscale, next);
            if (key === 'high-contrast') writeBool(KEYS.highContrast, next);
            if (key === 'readable-font') writeBool(KEYS.readableFont, next);
            if (key === 'links-highlight') writeBool(KEYS.linksHighlight, next);
            btn.setAttribute('aria-pressed', next ? 'true' : 'false');
        });
    });

    const resetAllBtn = $('a11y-reset-all');
    if (resetAllBtn) {
        resetAllBtn.addEventListener('click', function () {
            resetAll(siteContent);
            setOpen(false);
        });
    }

    restoreFromStorage(siteContent);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initA11yPanel);
} else {
    initA11yPanel();
}

export { initA11yPanel };
