(function () {
    const nav = document.querySelector('.main__nav');
    const btn = nav?.querySelector('.burger');
    const list = nav?.querySelector('#main-menu');

    if (!nav || !btn || !list) return;

    function closeBurger() {
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Открыть меню');
    }

    function openBurger() {
        nav.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        btn.setAttribute('aria-label', 'Закрыть меню');
    }

    btn.addEventListener('click', () => {
        const isOpen = nav.classList.contains('open');

        if (isOpen) {
            closeBurger();
        } else {
            openBurger();
        }
    });

    list.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        if (link.id === 'nav-session-trigger' && link.dataset.auth === 'true') {
            return;
        }

        closeBurger();
    });

    document.addEventListener('click', (e) => {
        if (!nav.classList.contains('open')) return;
        if (!nav.contains(e.target)) {
            closeBurger();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('open')) {
            closeBurger();
            btn.focus();
        }
    });
})();