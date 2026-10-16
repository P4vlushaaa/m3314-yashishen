const form = document.getElementById('auth-form');
const title = document.getElementById('auth-title');
const submitButton = document.getElementById('auth-submit-button');
const toggleButton = document.getElementById('auth-toggle-button');

let mode = 'signin';

function updateMode() {
    if (!title || !submitButton || !toggleButton) return;

    if (mode === 'signup') {
        title.textContent = 'Регистрация';
        submitButton.textContent = 'Зарегистрироваться';
        toggleButton.textContent = 'Уже есть аккаунт? Войти';
    } else {
        title.textContent = 'Вход';
        submitButton.textContent = 'Войти';
        toggleButton.textContent = 'Зарегистрироваться';
    }
}

function updateProtectedActions(isAuth) {
    document.querySelectorAll('[data-guest-actions]').forEach((element) => {
        element.hidden = isAuth;
    });

    document.querySelectorAll('[data-auth-actions]').forEach((element) => {
        element.hidden = !isAuth;
    });
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

async function loadSessionUi() {
    try {
        const response = await fetch('/api/auth/me', {
            credentials: 'include',
        });

        const data = await response.json();

        const trigger = document.getElementById('nav-session-trigger');
        const popup = document.getElementById('nav-session-popup');

        if (!trigger || !popup) return;

        if (!data.isAuth || !data.user) {
            trigger.textContent = 'Войти';
            trigger.href = '/auth';
            trigger.dataset.auth = 'false';
            trigger.setAttribute('aria-expanded', 'false');
            popup.hidden = true;
            updateProtectedActions(false);
            return;
        }

        const userLabel =
            data.user.profile?.fullName ||
            data.user.email ||
            'Пользователь';

        trigger.textContent = userLabel;
        trigger.href = '#';
        trigger.dataset.auth = 'true';
        trigger.setAttribute('aria-expanded', 'false');
        popup.hidden = true;
        updateProtectedActions(true);
    } catch (error) {
        console.error('Session UI error:', error);
        updateProtectedActions(false);
    }
}

if (toggleButton) {
    toggleButton.addEventListener('click', (e) => {
        e.preventDefault();
        mode = mode === 'signup' ? 'signin' : 'signup';
        updateMode();
    });
}

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email')?.value.trim();
        const password = document.getElementById('password')?.value.trim();

        const endpoint = mode === 'signup' ? '/auth/signup' : '/auth/signin';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    formFields: [
                        { id: 'email', value: email },
                        { id: 'password', value: password },
                    ],
                }),
            });

            const data = await response.json();

            if (!response.ok || data.status !== 'OK') {
                if (data.status === 'FIELD_ERROR' && Array.isArray(data.formFields)) {
                    const firstError = data.formFields.find((field) => field.error);
                    showToast(firstError?.error || 'Ошибка валидации полей', 'error');
                    return;
                }

                if (data.status === 'WRONG_CREDENTIALS_ERROR') {
                    showToast('Неверный email или пароль', 'error');
                    return;
                }

                showToast(data.message || data.status || 'Ошибка авторизации', 'error');
                return;
            }

            if (mode === 'signup') {
                const syncResponse = await fetch('/api/auth/sync-user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        email: data.user?.emails?.[0] || email,
                        externalAuthId: data.user?.id,
                    }),
                });

                const syncData = await syncResponse.json().catch(() => null);

                if (!syncResponse.ok) {
                    showToast(
                        syncData?.message ||
                        'Пользователь зарегистрирован, но не синхронизирован с локальной БД',
                        'error',
                    );
                    return;
                }
            }

            showToast(
                mode === 'signup' ? 'Регистрация успешна' : 'Вход выполнен',
                'success',
            );

            setTimeout(() => {
                window.location.href = '/';
            }, 800);
        } catch (error) {
            console.error('Auth error:', error);
            showToast('Не удалось выполнить запрос', 'error');
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    updateMode();
    loadSessionUi();

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
});
