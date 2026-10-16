async function loadSessionUi() {
    try {
        const response = await fetch('/api/auth/me', {
            credentials: 'include',
        });

        const data = await response.json();

        const loginLink = document.getElementById('login-link');
        const logoutButton = document.getElementById('logout-button');
        const currentUser = document.getElementById('current-user');

        if (!loginLink || !logoutButton || !currentUser) {
            return;
        }

        if (!data.isAuth || !data.user) {
            loginLink.style.display = 'inline-flex';
            logoutButton.style.display = 'none';
            currentUser.textContent = '';
            return;
        }

        loginLink.style.display = 'none';
        logoutButton.style.display = 'inline-flex';
        currentUser.textContent =
            data.user.profile?.fullName || data.user.email || 'Пользователь';
    } catch (error) {
        console.error('Session UI error:', error);
    }
}

async function logout() {
    try {
        const response = await fetch('/auth/signout', {
            method: 'POST',
            credentials: 'include',
        });

        if (response.ok) {
            window.location.href = '/';
            return;
        }

        showToast('Не удалось выйти', 'error');
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Не удалось выйти', 'error');
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadSessionUi();

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
});