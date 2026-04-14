(function () {
    'use strict';

    var yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    function syncReduceMotionClass() {
        document.documentElement.classList.toggle('reduce-motion', prefersReducedMotion.matches);
    }
    syncReduceMotionClass();
    if (typeof prefersReducedMotion.addEventListener === 'function') {
        prefersReducedMotion.addEventListener('change', syncReduceMotionClass);
    } else if (typeof prefersReducedMotion.addListener === 'function') {
        prefersReducedMotion.addListener(syncReduceMotionClass);
    }

    if (typeof AOS !== 'undefined') {
        AOS.init({
            disable: prefersReducedMotion.matches,
            duration: 700,
            once: true,
            offset: 60,
            easing: 'ease-out-cubic',
        });
    }

    var menuBtn = document.getElementById('mobile-menu-btn');
    var mobileMenu = document.getElementById('mobile-menu');
    var iconOpen = document.getElementById('menu-icon-open');
    var iconClose = document.getElementById('menu-icon-close');
    var isMenuOpen = false;

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
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', toggleMenu);
    }

    document.querySelectorAll('.mobile-link').forEach(function (link) {
        link.addEventListener('click', toggleMenu);
    });

    var nav = document.querySelector('nav');
    if (nav) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 20) {
                nav.classList.add('shadow-md');
                nav.style.background = 'rgba(255, 255, 255, 0.95)';
            } else {
                nav.classList.remove('shadow-md');
                nav.style.background = 'rgba(255, 255, 255, 0.5)';
            }
        });
    }
})();
