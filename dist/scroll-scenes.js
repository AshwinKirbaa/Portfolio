(() => {
  // Top scroll progress bar
  const progressLine = document.querySelector('.scroll-progress i');

  // Case study scenes
  const scenes = document.querySelectorAll('.case-scene');

  // Process timeline
  const processSection = document.querySelector('.process');
  const processTrack = document.querySelector('.process-track');
  const processPercent = document.getElementById('process-percentage');
  const processActiveNum = document.getElementById('process-active-num');
  const hudPills = document.querySelectorAll('.hud-step-pill');
  const processSteps = document.querySelectorAll('.process-step');

  let scheduled = false;
  function update() {
    scheduled = false;
    const theater = document.querySelector('.portfolio-intro-theater');
    if (theater && !theater.classList.contains('dismissed')) return;

    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Update global top progress bar
    if (progressLine && docHeight > 0) {
      const progress = Math.min(Math.max(scrollY / docHeight, 0), 1);
      progressLine.style.transform = `scaleX(${progress})`;
    }

    // Update case study scenes
    scenes.forEach(scene => {
      const rect = scene.getBoundingClientRect();
      const height = rect.height - window.innerHeight;
      if (height <= 0) return;
      const progress = Math.min(Math.max(-rect.top / height, 0), 1);
      scene.style.setProperty('--scene-progress', progress.toFixed(4));
    });

    // Update process timeline line & sticky HUD
    if (processTrack && processSection) {
      const trackRect = processTrack.getBoundingClientRect();
      const trackHeight = trackRect.height;
      
      // Calculate progress across the track length
      const offset = (window.innerHeight * 0.5) - trackRect.top;
      const progress = Math.min(Math.max(offset / trackHeight, 0), 1);
      
      processSection.style.setProperty('--process-progress', progress.toFixed(4));
      
      if (processPercent) {
        processPercent.textContent = `${Math.round(progress * 100).toString().padStart(2, '0')}%`;
      }

      // Determine active step
      let currentStep = '01';
      processSteps.forEach((step, idx) => {
        const sRect = step.getBoundingClientRect();
        if (sRect.top <= window.innerHeight * 0.6) {
          currentStep = step.dataset.step || `0${idx + 1}`;
        }
      });

      if (processActiveNum) {
        processActiveNum.textContent = currentStep;
      }

      // Highlight corresponding HUD pill & step
      hudPills.forEach(pill => {
        pill.classList.toggle('active', pill.dataset.step === currentStep);
      });
      processSteps.forEach(step => {
        step.classList.toggle('active', step.dataset.step === currentStep);
      });
    }
  }

  function requestUpdate() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  // Do not invoke synchronously on page load to avoid forced layout during initial paint
})();
