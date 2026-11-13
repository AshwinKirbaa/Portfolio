(() => {
  const theater = document.querySelector('.portfolio-intro-theater');
  const containerOuter = document.querySelector('.wga-container-outer');
  const containerInner = document.querySelector('.wga-container-inner');
  const cards = Array.from(document.querySelectorAll('.wga-poster-wrap'));
  const activeTitle = document.querySelector('.wga-active-title');
  const enterBtns = document.querySelectorAll('.enter-portfolio-trigger');

  if (!theater || !containerInner || cards.length === 0) return;

  // Lock body scroll while in intro
  document.body.style.overflow = 'hidden';

  let activeIndex = 0;
  const titles = [
    '01 // ASHWIN KIRBAA — PORTFOLIO',
    '02 // GITHUB REPOSITORIES & BUILDS',
    '03 // LINKEDIN PROFESSIONAL NETWORK',
    '04 // GOOGLE CLOUD & AI SKILLS',
    '05 // TWINEVAL AI — LIVE DEMO'
  ];

  function setActiveCard(index, smoothScroll = true) {
    if (index < 0) index = 0;
    if (index >= cards.length) index = cards.length - 1;
    activeIndex = index;

    cards.forEach((card, i) => {
      card.classList.toggle('is-active', i === activeIndex);
    });

    if (activeTitle) {
      activeTitle.style.transform = 'translateY(-100%)';
      activeTitle.style.opacity = '0';
      setTimeout(() => {
        activeTitle.textContent = titles[activeIndex] || '';
        activeTitle.style.transform = 'translateY(100%)';
        requestAnimationFrame(() => {
          activeTitle.style.transform = 'translateY(0)';
          activeTitle.style.opacity = '1';
        });
      }, 180);
    }

    // Center the active card in containerOuter
    if (smoothScroll && containerOuter) {
      const card = cards[activeIndex];
      const cardLeft = card.offsetLeft;
      const cardWidth = card.offsetWidth;
      const outerWidth = containerOuter.offsetWidth;
      const targetScroll = cardLeft - (outerWidth / 2) + (cardWidth / 2);

      // Shift containerInner
      containerInner.style.transform = `translateX(${-targetScroll}px)`;
    }
  }

  // Exact We-Go-Again Entrance Sequence:
  // 1. Initial black state: containerInner is translateX(100vw), cards scale(0.2)
  // 2. Trigger animate-run: containerInner sweeps in from right to centered first card, cards scale from 0.2 to 1
  requestAnimationFrame(() => {
    setTimeout(() => {
      containerInner.classList.add('animate-run');
      cards.forEach((card, i) => {
        // slight cascade stagger
        setTimeout(() => {
          card.classList.add('animate-run');
        }, i * 70);
      });

      // Align and center first card after entry sweep
      setTimeout(() => {
        setActiveCard(0, true);
      }, 1500);
    }, 100);
  });

  // Card click to center / focus
  cards.forEach((card, i) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('.enter-portfolio-trigger')) return;
      setActiveCard(i, true);
    });
  });

  // Wheel scrolling across cards
  let wheelTimeout = null;
  containerOuter.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (wheelTimeout) return;
    if (e.deltaY > 15 || e.deltaX > 15) {
      setActiveCard(activeIndex + 1, true);
      wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 260);
    } else if (e.deltaY < -15 || e.deltaX < -15) {
      setActiveCard(activeIndex - 1, true);
      wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 260);
    }
  }, { passive: false });

  // Touch Drag
  let startX = 0;
  containerOuter.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });
  containerOuter.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (diff > 45) {
      setActiveCard(activeIndex - 1, true);
    } else if (diff < -45) {
      setActiveCard(activeIndex + 1, true);
    }
  }, { passive: true });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (theater.classList.contains('dismissed')) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      setActiveCard(activeIndex + 1, true);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      setActiveCard(activeIndex - 1, true);
    } else if (e.key === 'Escape') {
      dismissIntro();
    }
  });

  function dismissIntro() {
    theater.classList.add('dismissed');
    document.body.style.overflow = '';
    window.dispatchEvent(new Event('resize'));
  }

  enterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dismissIntro();
    });
  });
})();
