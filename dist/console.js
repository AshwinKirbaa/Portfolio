(() => {
  const consolePanel = document.querySelector('.control-console');
  const message = document.querySelector('#console-message');
  if (!consolePanel || !message) return;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let targetX = 46, targetY = -2, currentX = 46, currentY = -2;

  if (!reduceMotion && matchMedia('(pointer:fine)').matches) {
    consolePanel.addEventListener('pointermove', event => {
      const rect = consolePanel.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width;
      const ny = (event.clientY - rect.top) / rect.height;
      targetY = -2 + (nx - .5) * 10;
      targetX = 48 - (ny - .5) * 10;
      consolePanel.style.setProperty('--light-x', `${nx * 100}%`);
      consolePanel.style.setProperty('--light-y', `${ny * 100}%`);
    });
    consolePanel.addEventListener('pointerleave', () => {
      targetX = 46;
      targetY = -2;
      consolePanel.style.setProperty('--light-x', '50%');
      consolePanel.style.setProperty('--light-y', '20%');
    });
    const animateConsole = () => {
      currentX += (targetX - currentX) * .1;
      currentY += (targetY - currentY) * .1;
      consolePanel.style.setProperty('--console-rx', `${currentX.toFixed(2)}deg`);
      consolePanel.style.setProperty('--console-ry', `${currentY.toFixed(2)}deg`);
      requestAnimationFrame(animateConsole);
    };
    requestAnimationFrame(animateConsole);
  }

  document.querySelectorAll('.console-key').forEach(key => {
    key.addEventListener('pointerenter', () => {
      message.textContent = `ROUTE: ${key.dataset.consoleLabel}`;
      consolePanel.dataset.active = key.dataset.consoleLabel;
    });
    key.addEventListener('pointerleave', () => {
      message.textContent = 'AVAILABLE FOR OPPORTUNITIES';
      delete consolePanel.dataset.active;
    });
    key.addEventListener('pointerdown', () => key.classList.add('pressed'));
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(type => key.addEventListener(type, () => key.classList.remove('pressed')));
  });
})();
