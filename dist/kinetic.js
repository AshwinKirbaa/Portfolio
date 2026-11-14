(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);

  let scrollY = window.scrollY;
  document.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    document.body.classList.toggle('is-scrolled', scrollY > 40);
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    progress.style.transform = `scaleX(${scrollY / max})`;
  }, { passive: true });
})();
