(function () {
    const sessionItem = document.getElementById('nav-session-item');
    const trigger = document.getElementById('nav-session-trigger');
    const popup = document.getElementById('nav-session-popup');

    if (!sessionItem || !trigger || !popup) return;

    function isAuthenticated() {
        return trigger.dataset.auth === 'true';
    }

    function openPopup() {
        if (!isAuthenticated()) return;
        popup.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
    }

    function closePopup() {
        popup.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
    }

    function togglePopup() {
        if (!isAuthenticated()) return;

        if (popup.hidden) {
            openPopup();
        } else {
            closePopup();
        }
    }

    trigger.addEventListener('click', (e) => {
        if (!isAuthenticated()) return;

        e.preventDefault();
        togglePopup();
    });

    document.addEventListener('click', (e) => {
        if (popup.hidden) return;
        if (!sessionItem.contains(e.target)) {
            closePopup();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !popup.hidden) {
            closePopup();
            trigger.focus();
        }
    });

    window.sessionMenu = {
        open: openPopup,
        close: closePopup,
        toggle: togglePopup,
    };
})();