(() => {
  const consolePanel = document.querySelector('.control-console');
  const wrapper = document.querySelector('.console-3d-wrapper') || consolePanel;
  const message = document.querySelector('#console-message');
  if (!consolePanel || !message) return;

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // The HIRE ME key opens the CV in the browser. Visitors can review it there
  // or use the browser's built-in download control.
  const hireKey = document.querySelector('.key-hire');
  if (hireKey) {
    hireKey.href = 'assets/ashwin-kirbaa-cv.pdf';
    hireKey.target = '_blank';
    hireKey.rel = 'noreferrer';
    hireKey.dataset.consoleLabel = 'VIEW OR DOWNLOAD CV';
  }
  
  // Interactive 3D Perspective Tilt Tracking
  let targetRx = 0;
  let targetRy = 0;
  let currentRx = 0;
  let currentRy = 0;
  let isHovered = false;
  let activeKey = null;

  if (!reduceMotion && matchMedia('(pointer:fine)').matches && wrapper) {
    let tiltRaf = 0;
    const animateTilt = () => {
      currentRx += (targetRx - currentRx) * 0.1;
      currentRy += (targetRy - currentRy) * 0.1;

      consolePanel.style.setProperty('--console-rx', `${currentRx.toFixed(2)}deg`);
      consolePanel.style.setProperty('--console-ry', `${currentRy.toFixed(2)}deg`);

      if (Math.abs(targetRx - currentRx) > 0.01 || Math.abs(targetRy - currentRy) > 0.01 || isHovered) {
        tiltRaf = requestAnimationFrame(animateTilt);
      } else {
        tiltRaf = 0;
      }
    };

    const wakeTilt = () => {
      if (!tiltRaf) tiltRaf = requestAnimationFrame(animateTilt);
    };

    wrapper.addEventListener('pointermove', event => {
      isHovered = true;
      if (activeKey) return;
      const rect = wrapper.getBoundingClientRect();
      const x = (event.clientX - rect.left) / (rect.width || 1); // 0 to 1
      const y = (event.clientY - rect.top) / (rect.height || 1); // 0 to 1

      targetRx = (0.5 - y) * 12;
      targetRy = (x - 0.5) * 16;
      wakeTilt();
    }, { passive: true });

    wrapper.addEventListener('pointerleave', () => {
      isHovered = false;
      targetRx = 0;
      targetRy = 0;
      wakeTilt();
    }, { passive: true });
  }

  // Tactile Mechanical Key Interaction
  document.querySelectorAll('.console-key').forEach(key => {
    key.addEventListener('pointerenter', () => {
      activeKey = key;
      targetRx = currentRx;
      targetRy = currentRy;
      const label = key.dataset.consoleLabel || key.textContent.trim();
      message.textContent = `ROUTE: ${label}`;
    });

    key.addEventListener('pointerleave', () => {
      if (activeKey === key) activeKey = null;
      message.textContent = 'AVAILABLE FOR OPPORTUNITIES';
      key.classList.remove('pressed');
    });

    key.addEventListener('pointerdown', () => {
      key.classList.add('pressed');
    });

    ['pointerup', 'pointercancel'].forEach(type => {
      key.addEventListener(type, () => key.classList.remove('pressed'));
    });

    const label = key.dataset.consoleLabel || key.textContent.trim();
    key.setAttribute('aria-label', label);
  });
})();
