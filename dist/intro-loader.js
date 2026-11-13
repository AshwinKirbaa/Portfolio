(() => {
  const theater = document.querySelector('.portfolio-intro-theater');
  const meter = document.querySelector('.intro-hud-meter i');
  const percentText = document.querySelector('.intro-hud-percent');
  const statusText = document.querySelector('.intro-hud-status');

  if (!theater) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    theater.classList.add('dismissed');
    return;
  }

  let progress = 0;
  const startTime = performance.now();
  const totalDuration = 2200; // 2.2 seconds entrance

  function tick(now) {
    const elapsed = now - startTime;
    progress = Math.min(100, Math.round((elapsed / totalDuration) * 100));

    if (meter) meter.style.width = `${progress}%`;
    if (percentText) percentText.textContent = `${progress.toString().padStart(2, '0')}%`;

    if (progress >= 30 && progress < 70 && statusText) {
      statusText.textContent = 'INITIALIZING SYSTEM...';
    } else if (progress >= 70 && progress < 100 && statusText) {
      statusText.textContent = 'SYSTEM ONLINE';
    }

    if (progress < 100) {
      requestAnimationFrame(tick);
    } else {
      setTimeout(() => {
        theater.classList.add('fly-to-hero');
        setTimeout(() => {
          theater.classList.add('dismissed');
        }, 650);
      }, 350);
    }
  }

  requestAnimationFrame(tick);
})();

