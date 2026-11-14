(() => {
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  if (!finePointer.matches || reducedMotion.matches) return;

  document.documentElement.classList.add('smooth-cursor-enabled');

  const cursor = document.createElement('div');
  cursor.className = 'smooth-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = `
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.5 2.75L27.1 14.05L16.55 17.2L11.9 27.65L3.5 2.75Z" fill="currentColor" stroke="#171514" stroke-width="1.35" stroke-linejoin="round"/>
    </svg>`;
  document.body.append(cursor);

  let targetX = -80;
  let targetY = -80;
  let currentX = -80;
  let currentY = -80;
  let previousX = -80;
  let previousY = -80;
  let rotation = 0;
  let targetRotation = 0;
  let visible = false;

  const shortestAngle = (from, to) => {
    let delta = (to - from) % 360;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    return from + delta;
  };

  const render = () => {
    currentX += (targetX - currentX) * 0.22;
    currentY += (targetY - currentY) * 0.22;

    const velocityX = currentX - previousX;
    const velocityY = currentY - previousY;
    if (Math.hypot(velocityX, velocityY) > 0.35) {
      targetRotation = Math.atan2(velocityY, velocityX) * (180 / Math.PI) + 45;
    }

    rotation += (shortestAngle(rotation, targetRotation) - rotation) * 0.16;
    cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${rotation}deg) scale(var(--cursor-scale))`;

    previousX = currentX;
    previousY = currentY;
    requestAnimationFrame(render);
  };

  addEventListener('pointermove', (event) => {
    if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    targetX = event.clientX - 7;
    targetY = event.clientY - 6;
    if (!visible) {
      currentX = targetX;
      currentY = targetY;
      previousX = targetX;
      previousY = targetY;
      visible = true;
      cursor.classList.add('is-visible');
    }
  }, { passive: true });

  addEventListener('pointerover', (event) => {
    cursor.classList.toggle('is-interactive', Boolean(event.target.closest('a, button, [role="button"], input, textarea, select, summary')));
  }, { passive: true });

  addEventListener('pointerout', (event) => {
    if (!event.relatedTarget) {
      visible = false;
      cursor.classList.remove('is-visible', 'is-interactive');
    }
  }, { passive: true });

  addEventListener('blur', () => cursor.classList.remove('is-visible'));
  addEventListener('focus', () => {
    if (visible) cursor.classList.add('is-visible');
  });

  render();
})();
