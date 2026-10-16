document.addEventListener('DOMContentLoaded', () => {
    const current = location.pathname.split('/').pop() || 'index.hbs';

    document.querySelectorAll('.main__nav a').forEach(a => {
        const href = a.getAttribute('href');
        if (!href) return;

        const link = href.split('/').pop();
        if (link === current) {
            a.classList.add('is-active');
            a.setAttribute('aria-current', 'page');
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    // showToast("Добро пожаловать на сайт", "info");
});