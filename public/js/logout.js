async function logout() {
    const response = await fetch('/auth/signout', {
        method: 'POST',
        credentials: 'include',
    });

    if (response.ok) {
        window.location.href = '/';
        return;
    }

    showToast('Не удалось выйти', 'error');
}