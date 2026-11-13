(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);
  const heroGrid = $('.hero-grid');
  const firstName = $('.hero-name h1:first-child');
  const lastName = $('.hero-name h1.ghost');
  if (!heroGrid || !firstName || !lastName) return;
  const orb = document.createElement('i');
  orb.className = 'ambient-orb';
  heroGrid.appendChild(orb);
  let pointerX = innerWidth * .3, pointerY = innerHeight * .35;
  let orbX = pointerX, orbY = pointerY, scrollY = window.scrollY;
  const trails = matchMedia('(pointer:fine)').matches ? Array.from({ length: 7 }, (_, index) => {
    const dot = document.createElement('i');
    dot.className = 'cursor-trail';
    dot.style.opacity = String(.62 - index * .075);
    document.body.appendChild(dot);
    return { x: pointerX, y: pointerY, el: dot };
  }) : [];
  document.addEventListener('pointermove', event => { pointerX = event.clientX; pointerY = event.clientY; }, { passive: true });
  document.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    document.body.classList.toggle('is-scrolled', scrollY > 40);
  }, { passive: true });
  function kineticFrame() {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    progress.style.transform = `scaleX(${scrollY / max})`;
    const heroRect = heroGrid.getBoundingClientRect();
    const localX = pointerX - heroRect.left, localY = pointerY - heroRect.top;
    orbX += (localX - orbX) * .075; orbY += (localY - orbY) * .075;
    orb.style.transform = `translate3d(${orbX - 9}px,${orbY - 9}px,0)`;
    if (heroRect.bottom > 0 && heroRect.top < innerHeight) {
      const px = pointerX / innerWidth - .5, py = pointerY / innerHeight - .5;
      firstName.style.translate = `${px * -22}px ${py * -10 + Math.max(0, scrollY) * -.045}px`;
      lastName.style.translate = `${px * 28}px ${py * 13 + Math.max(0, scrollY) * .035}px`;
    }
    let leadX = pointerX, leadY = pointerY;
    trails.forEach((point, index) => {
      const speed = .24 - index * .018;
      point.x += (leadX - point.x) * speed; point.y += (leadY - point.y) * speed;
      point.el.style.transform = `translate3d(${point.x - 2}px,${point.y - 2}px,0)`;
      leadX = point.x; leadY = point.y;
    });
    requestAnimationFrame(kineticFrame);
  }
  requestAnimationFrame(kineticFrame);
  $$('.top-cta,.menu-toggle,.text-link,.project-row,.cap-item').forEach(element => {
    element.classList.add('magnetic');
    element.addEventListener('pointermove', event => {
      const rect = element.getBoundingClientRect();
      element.style.translate = `${(event.clientX - rect.left - rect.width / 2) * .07}px ${(event.clientY - rect.top - rect.height / 2) * .12}px`;
    });
    element.addEventListener('pointerleave', () => { element.style.translate = '0 0'; });
  });
  $$('.discipline a').forEach((link, index) => link.addEventListener('mouseenter', () => {
    orb.style.background = index % 2 ? '#eee9df' : '#18c3c8';
    orb.style.width = '30px'; orb.style.height = '30px';
  }));
  $('.discipline')?.addEventListener('mouseleave', () => { orb.style.width = '18px'; orb.style.height = '18px'; });
})();
