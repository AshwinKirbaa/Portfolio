(() => {
  const theater = document.querySelector('.portfolio-intro-theater');
  const deck = document.querySelector('.intro-deck');
  const cardWrap = document.querySelector('.intro-card-wrap');
  const meter = document.querySelector('.intro-hud-meter i');
  const percentText = document.querySelector('.intro-hud-percent');
  const statusText = document.querySelector('.intro-hud-status');
  const skipBtn = document.querySelector('.intro-skip-hint');

  if (!theater || !cardWrap) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    theater.classList.add('dismissed');
    return;
  }

  // Prevent background scrolling while loading
  document.body.style.overflow = 'hidden';

  let dismissed = false;
  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    theater.classList.add('fly-to-hero');
    setTimeout(() => {
      theater.classList.add('dismissed');
      document.body.style.overflow = '';
      window.dispatchEvent(new Event('resize'));
    }, 750);
  }

  if (skipBtn) skipBtn.addEventListener('click', dismiss);
  theater.addEventListener('click', (e) => {
    // If clicked anywhere during intro, allow fast-forward dismissal
    dismiss();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === ' ') {
      dismiss();
    }
  });

  // Step 1: Start zoom and unmask card entrance (scale from 0.25 to 1)
  requestAnimationFrame(() => {
    setTimeout(() => {
      cardWrap.classList.add('animate-in');
      if (deck) deck.classList.add('fanned');
    }, 80);
  });

  // Step 2: Progress indicator
  let progress = 0;
  const startTime = performance.now();
  const totalDuration = 2200; // 2.2s entrance

  function tick(now) {
    if (dismissed) return;
    const elapsed = now - startTime;
    progress = Math.min(100, Math.round((elapsed / totalDuration) * 100));

    if (meter) meter.style.width = `${progress}%`;
    if (percentText) percentText.textContent = `${progress.toString().padStart(2, '0')}%`;

    if (progress >= 30 && progress < 70 && statusText) {
      statusText.textContent = 'DECRYPTING PORTFOLIO...';
    } else if (progress >= 70 && progress < 100 && statusText) {
      statusText.textContent = 'SYSTEMS OPERATIONAL';
    } else if (progress >= 100 && statusText) {
      statusText.textContent = 'WELCOME';
    }

    if (progress < 100) {
      requestAnimationFrame(tick);
    } else {
      cardWrap.classList.add('floating');
      setTimeout(() => {
        dismiss();
      }, 650);
    }
  }

  requestAnimationFrame(tick);
})();
