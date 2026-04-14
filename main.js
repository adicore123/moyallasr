/**
 * נקודת כניסה — Vite + PostCSS + Tailwind (ללא CDN).
 * Lucide: רק אייקונים בשימוש באתר (tree-shaking).
 * AOS: ייבוא דינמי רק אם יש data-aos בדף (דפי מסמכים נשארים קלים).
 */
import '../styles.css';

import {
    createIcons,
    Menu,
    X,
    ArrowLeft,
    HeartHandshake,
    Focus,
    Check,
    GraduationCap,
    BookOpen,
    Award,
    Sparkles,
    ShieldAlert,
    CloudLightning,
    Clock,
    Users,
    CloudRain,
    BrainCircuit,
    Layers,
    Target,
    Shield,
    MessageCircle,
    PhoneCall,
    MapPin,
    ShieldCheck,
    Accessibility,
    Zap,
} from 'lucide';

/**
 * Lucide 0.4x: createIcons מחפש לפי PascalCase (תוצאת toPascalCase של data-lucide),
 * לא לפי kebab-case. מפתחות חייבים להתאים ל־Menu, ArrowLeft וכו'.
 */
const lucideIconsForSite = {
    Menu,
    X,
    ArrowLeft,
    HeartHandshake,
    Focus,
    Check,
    GraduationCap,
    BookOpen,
    Award,
    Sparkles,
    ShieldAlert,
    CloudLightning,
    Clock,
    Users,
    CloudRain,
    BrainCircuit,
    Layers,
    Target,
    Shield,
    MessageCircle,
    PhoneCall,
    MapPin,
    ShieldCheck,
    Accessibility,
    Zap,
};

function mountLucide() {
    createIcons({ icons: lucideIconsForSite });
}

const yearEl = document.getElementById('year');
if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
}

mountLucide();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function syncReduceMotionClass() {
    document.documentElement.classList.toggle('reduce-motion', prefersReducedMotion.matches);
}
syncReduceMotionClass();
if (typeof prefersReducedMotion.addEventListener === 'function') {
    prefersReducedMotion.addEventListener('change', syncReduceMotionClass);
} else if (typeof prefersReducedMotion.addListener === 'function') {
    prefersReducedMotion.addListener(syncReduceMotionClass);
}

async function initAosIfNeeded() {
    if (!document.querySelector('[data-aos]')) return;
    await import('aos/dist/aos.css');
    const { default: AOS } = await import('aos');
    AOS.init({
        disable: prefersReducedMotion.matches,
        duration: 700,
        once: true,
        offset: 60,
        easing: 'ease-out-cubic',
    });
}

void initAosIfNeeded();

const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const iconOpen = document.getElementById('menu-icon-open');
const iconClose = document.getElementById('menu-icon-close');
let isMenuOpen = false;

function toggleMenu() {
    if (!mobileMenu || !iconOpen || !iconClose) return;
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
        mobileMenu.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-4');
        iconOpen.classList.add('hidden');
        iconClose.classList.remove('hidden');
    } else {
        mobileMenu.classList.add('opacity-0', 'pointer-events-none', '-translate-y-4');
        iconOpen.classList.remove('hidden');
        iconClose.classList.add('hidden');
    }
    mountLucide();
}

if (menuBtn) {
    menuBtn.addEventListener('click', toggleMenu);
}

document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', toggleMenu);
});

const nav = document.querySelector('nav');
if (nav) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            nav.classList.add('shadow-md');
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            nav.classList.remove('shadow-md');
            nav.style.background = 'rgba(255, 255, 255, 0.5)';
        }
    });
}
