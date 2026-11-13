(() => {
  const theater = document.querySelector('.portfolio-intro-theater');
  const deck = document.querySelector('.intro-deck');
  const cardWrap = document.querySelector('.intro-card-wrap');
  const meter = document.querySelector('.intro-hud-meter i');
  const percentText = document.querySelector('.intro-hud-percent');
  const statusText = document.querySelector('.intro-hud-status');
  const skipBtn = document.querySelector('.intro-skip-hint');

  if (!theater || !cardWrap) return;

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

  // Only the skip button or explicit key dismisses early so unintentional clicks don't skip the show
  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dismiss();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dismiss();
    }
  });

  // Step 1: Start zoom and unmask card entrance (scale from 0.25 to 1)
  requestAnimationFrame(() => {
    setTimeout(() => {
      cardWrap.classList.add('animate-in');
      if (deck) deck.classList.add('fanned');
    }, 120);
  });

  // Step 2: Smooth HUD progress counter
  let progress = 0;
  const startTime = performance.now();
  const totalDuration = 2800; // 2.8s entrance gives time to enjoy the animation

  function tick(now) {
    if (dismissed) return;
    const elapsed = now - startTime;
    progress = Math.min(100, Math.round((elapsed / totalDuration) * 100));

    if (meter) meter.style.width = `${progress}%`;
    if (percentText) percentText.textContent = `${progress.toString().padStart(2, '0')}%`;

    if (progress >= 20 && progress < 60 && statusText) {
      statusText.textContent = 'DECRYPTING PORTFOLIO...';
    } else if (progress >= 60 && progress < 95 && statusText) {
      statusText.textContent = 'SYSTEMS OPERATIONAL';
    } else if (progress >= 95 && statusText) {
      statusText.textContent = 'WELCOME';
    }

    if (progress < 100) {
      requestAnimationFrame(tick);
    } else {
      cardWrap.classList.add('floating');
      setTimeout(() => {
        dismiss();
      }, 700);
    }
  }

  requestAnimationFrame(tick);
})();
