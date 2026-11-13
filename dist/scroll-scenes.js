(() => {
  // Top scroll progress bar
  const progressLine = document.querySelector('.scroll-progress i');

  // Case study scenes
  const scenes = document.querySelectorAll('.case-scene');

  // Process timeline
  const processSection = document.querySelector('.process');
  const processTrack = document.querySelector('.process-track');

  function update() {
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Update global progress bar
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

    // Update process timeline line
    if (processTrack) {
      const rect = processTrack.getBoundingClientRect();
      const height = rect.height;
      if (height > 0) {
        // Starts filling when track enters middle of viewport
        const offset = window.innerHeight * 0.6 - rect.top;
        const progress = Math.min(Math.max(offset / height, 0), 1);
        processTrack.style.setProperty('--process-progress', progress.toFixed(4));
      }
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
})();

