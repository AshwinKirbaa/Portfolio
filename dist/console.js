(() => {
  const consolePanel = document.querySelector('.control-console');
  const message = document.querySelector('#console-message');
  if (!consolePanel || !message) return;
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
