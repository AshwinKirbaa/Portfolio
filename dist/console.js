(() => {
  const consolePanel = document.querySelector('.control-console');
  const wrapper = document.querySelector('.console-3d-wrapper') || consolePanel;
  const message = document.querySelector('#console-message');
  if (!consolePanel || !message) return;

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Interactive 3D Perspective Tilt Tracking
  let targetRx = 0;
  let targetRy = 0;
  let currentRx = 0;
  let currentRy = 0;
  let isHovered = false;

  if (!reduceMotion && matchMedia('(pointer:fine)').matches && wrapper) {
    wrapper.addEventListener('pointermove', event => {
      isHovered = true;
      const rect = wrapper.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width; // 0 to 1
      const y = (event.clientY - rect.top) / rect.height; // 0 to 1

      // Natural subtle tilt (max 9 degrees pitch/roll)
      targetRx = (0.5 - y) * 12; // tilt forward/backward
      targetRy = (x - 0.5) * 16; // tilt left/right
    });

    wrapper.addEventListener('pointerleave', () => {
      isHovered = false;
      targetRx = 0;
      targetRy = 0;
    });

    const animateTilt = () => {
      currentRx += (targetRx - currentRx) * 0.1;
      currentRy += (targetRy - currentRy) * 0.1;

      consolePanel.style.setProperty('--console-rx', `${currentRx.toFixed(2)}deg`);
      consolePanel.style.setProperty('--console-ry', `${currentRy.toFixed(2)}deg`);

      requestAnimationFrame(animateTilt);
    };

    requestAnimationFrame(animateTilt);
  }

  // Tactile Mechanical Key Interaction
  document.querySelectorAll('.console-key').forEach(key => {
    key.addEventListener('pointerenter', () => {
      const label = key.dataset.consoleLabel || key.textContent.trim();
      message.textContent = `ROUTE: ${label}`;
    });

    key.addEventListener('pointerleave', () => {
      message.textContent = 'AVAILABLE FOR OPPORTUNITIES';
      key.classList.remove('pressed');
    });

    key.addEventListener('pointerdown', () => {
      key.classList.add('pressed');
    });

    ['pointerup', 'pointercancel'].forEach(type => {
      key.addEventListener(type, () => key.classList.remove('pressed'));
    });
  });
})();
