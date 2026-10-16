(function () {
    function setStatus(status, message, type = 'info') {
        status.textContent = message;
        status.dataset.type = type;
    }

    function setLoading(trigger, isLoading) {
        trigger.disabled = isLoading;
        trigger.textContent = isLoading ? 'Загружаю...' : 'Загрузить изображение';
    }

    async function uploadFile({ file, endpoint, imageUrlInput, trigger, status }) {
        const formData = new FormData();
        formData.append('file', file);

        setLoading(trigger, true);
        setStatus(status, 'Файл загружается...');

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || 'Не удалось загрузить изображение');
            }

            if (!data.url) {
                throw new Error('Сервер не вернул ссылку на изображение');
            }

            imageUrlInput.value = data.url;
            imageUrlInput.dispatchEvent(new Event('input', { bubbles: true }));
            setStatus(status, 'Ссылка вставлена в поле изображения', 'success');

            if (typeof showToast === 'function') {
                showToast('Изображение загружено', 'success');
            }
        } catch (error) {
            console.error('Image upload error:', error);
            setStatus(status, error.message || 'Ошибка загрузки', 'error');

            if (typeof showToast === 'function') {
                showToast(error.message || 'Ошибка загрузки', 'error');
            }
        } finally {
            setLoading(trigger, false);
        }
    }

    document.querySelectorAll('[data-image-upload]').forEach((control) => {
        const fileInput = control.querySelector('input[type="file"]');
        const trigger = control.querySelector('[data-upload-trigger]');
        const status = control.querySelector('[data-upload-status]');
        const endpoint = control.dataset.uploadEndpoint;
        const targetSelector = control.dataset.uploadTarget;
        const imageUrlInput = targetSelector ? document.querySelector(targetSelector) : null;

        if (!fileInput || !trigger || !status || !endpoint || !imageUrlInput) return;

        trigger.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', async () => {
            const file = fileInput.files?.[0];

            if (!file) return;

            await uploadFile({ file, endpoint, imageUrlInput, trigger, status });
            fileInput.value = '';
        });
    });
})();
