window.addEventListener('load', () => {
    const box = document.getElementById('perf-stats');
    if (!box) return;

    const timing = performance.getEntriesByType('navigation')[0];
    const domTime = Math.round(timing.domContentLoadedEventEnd);
    const loadTime = Math.round(timing.loadEventEnd);

    const imgEntries = performance.getEntriesByType('resource')
        .filter(r => r.initiatorType === 'img');
    const totalImg = imgEntries.reduce((s, r) => s + r.duration, 0).toFixed(0);

    box.innerHTML = `
    <div><b>DOM loaded:</b> ${domTime} мс</div>
    <div><b>Page fully loaded:</b> ${loadTime} мс</div>
    <div><b>Images total:</b> ${totalImg} мс</div>
  `;
});