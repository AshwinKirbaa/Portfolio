(() => {
  const theater = document.querySelector('.portfolio-intro-theater');
  const stage = document.querySelector('.intro-carousel-stage');
  const track = document.querySelector('.intro-carousel-track');
  const cards = Array.from(document.querySelectorAll('.intro-carousel-card'));
  const dots = Array.from(document.querySelectorAll('.carousel-dot'));
  const prevBtn = document.querySelector('.carousel-nav-btn.prev');
  const nextBtn = document.querySelector('.carousel-nav-btn.next');
  const enterTriggers = document.querySelectorAll('.enter-portfolio-trigger');

  if (!theater || cards.length === 0) return;

  // Lock scrolling during intro
  document.body.style.overflow = 'hidden';

  let currentIndex = 0;
  const totalCards = cards.length;

  function updateCarousel() {
    cards.forEach((card, i) => {
      // Calculate offset relative to currentIndex (-2, -1, 0, 1, 2)
      let offset = i - currentIndex;

      const absOffset = Math.abs(offset);
      const sign = Math.sign(offset);

      let x = offset * 310;
      let z = -absOffset * 160;
      let rotY = -sign * Math.min(32, absOffset * 24);
      let scale = Math.max(0.65, 1 - absOffset * 0.16);
      let opacity = Math.max(0, 1 - absOffset * 0.35);
      let filter = absOffset === 0 ? 'blur(0px) brightness(1)' : `blur(${absOffset * 2}px) brightness(${Math.max(0.35, 1 - absOffset * 0.28)})`;

      if (absOffset > 2) {
        opacity = 0;
        card.style.pointerEvents = 'none';
      } else {
        card.style.pointerEvents = 'auto';
      }

      card.classList.toggle('is-active', absOffset === 0);
      card.style.zIndex = 20 - absOffset;
      card.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${rotY}deg) scale(${scale})`;
      card.style.opacity = opacity;
      card.style.filter = filter;
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function goTo(index) {
    if (index < 0) index = 0;
    if (index >= totalCards) index = totalCards - 1;
    currentIndex = index;
    updateCarousel();
  }

  function next() {
    if (currentIndex < totalCards - 1) {
      goTo(currentIndex + 1);
    } else {
      goTo(0);
    }
  }

  function prev() {
    if (currentIndex > 0) {
      goTo(currentIndex - 1);
    } else {
      goTo(totalCards - 1);
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); next(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      goTo(i);
    });
  });

  // Clicking an adjacent card shifts the carousel to focus on it
  cards.forEach((card, i) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('.enter-portfolio-trigger')) return;
      if (i !== currentIndex) {
        goTo(i);
      }
    });
  });

  // Mouse wheel scroll to cycle cards horizontally like we-go-again
  let wheelTimeout = null;
  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (wheelTimeout) return;
    if (e.deltaY > 15 || e.deltaX > 15) {
      next();
      wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 260);
    } else if (e.deltaY < -15 || e.deltaX < -15) {
      prev();
      wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 260);
    }
  }, { passive: false });

  // Touch & Drag Support
  let startX = 0;
  let isDragging = false;
  stage.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isDragging = true;
  });
  window.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diff = e.clientX - startX;
    if (diff > 50) prev();
    else if (diff < -50) next();
  });
  stage.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (diff > 40) prev();
    else if (diff < -40) next();
  }, { passive: true });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (theater.classList.contains('dismissed')) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      next();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      prev();
    } else if (e.key === 'Escape') {
      dismissIntro();
    }
  });

  function dismissIntro() {
    theater.classList.add('dismissed');
    document.body.style.overflow = '';
    window.dispatchEvent(new Event('resize'));
  }

  enterTriggers.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dismissIntro();
    });
  });

  // Initial setup: start at card 0 (Portfolio)
  updateCarousel();
})();
