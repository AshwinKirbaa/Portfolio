(() => {
  const theater = document.querySelector('.portfolio-intro-theater');
  const stage = document.querySelector('.wga-center-col');
  const track = document.querySelector('.wga-vertical-track');
  const posters = Array.from(document.querySelectorAll('.wga-vposter'));
  const titleItems = Array.from(document.querySelectorAll('.wga-title-item'));
  const enterBtns = document.querySelectorAll('.enter-portfolio-trigger');

  if (!theater || !track || posters.length === 0) return;

  // Lock scrolling of background page during intro
  document.body.style.overflow = 'hidden';

  let activeIndex = 0;
  const total = posters.length;

  function updateActiveCard(index) {
    if (index < 0) index = 0;
    if (index >= total) index = total - 1;
    activeIndex = index;

    // Highlight the active title on the right, dim others
    titleItems.forEach((item, i) => {
      item.classList.toggle('is-active', i === activeIndex);
    });

    // Update posters transform, opacity and scale
    posters.forEach((poster, i) => {
      poster.classList.toggle('is-active', i === activeIndex);
    });

    // Center the active poster vertically in the center stage
    if (stage && posters[activeIndex]) {
      const stageHeight = stage.offsetHeight;
      const activePoster = posters[activeIndex];
      const posterHeight = activePoster.offsetHeight;
      const posterTop = activePoster.offsetTop;

      const targetTranslateY = (stageHeight / 2) - posterTop - (posterHeight / 2);
      track.style.transform = `translateY(${targetTranslateY}px)`;
    }
  }

  // Next / Previous helpers
  function nextCard() {
    if (activeIndex < total - 1) {
      updateActiveCard(activeIndex + 1);
    } else {
      updateActiveCard(0); // loop
    }
  }

  function prevCard() {
    if (activeIndex > 0) {
      updateActiveCard(activeIndex - 1);
    } else {
      updateActiveCard(total - 1); // loop
    }
  }

  // Right column titles click to jump to corresponding poster
  titleItems.forEach((item, i) => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      updateActiveCard(i);
    });
  });

  // Clicking an inactive poster centers it; clicking the active poster enters its specific target
  posters.forEach((poster, i) => {
    poster.addEventListener('click', (e) => {
      // If clicking directly on an anchor or button inside, allow its native action
      if (e.target.closest('a') || e.target.closest('button')) return;

      if (i === activeIndex) {
        // Trigger the primary action of the active card
        const link = poster.querySelector('.wga-vposter-cta');
        if (link) {
          if (link.tagName === 'A' && link.href) {
            if (link.target === '_blank') {
              window.open(link.href, '_blank', 'noopener,noreferrer');
            } else {
              dismissIntro();
              window.location.hash = link.getAttribute('href');
            }
          } else {
            dismissIntro();
          }
        } else {
          dismissIntro();
        }
      } else {
        updateActiveCard(i);
      }
    });
  });

  // Mouse wheel up & down vertical scroll
  let wheelTimeout = null;
  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (wheelTimeout) return;
    if (e.deltaY > 15) {
      nextCard();
      wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 220);
    } else if (e.deltaY < -15) {
      prevCard();
      wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 220);
    }
  }, { passive: false });

  // Wheel hovering over theater
  theater.addEventListener('wheel', (e) => {
    if (wheelTimeout) return;
    if (e.deltaY > 20) {
      nextCard();
      wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 220);
    } else if (e.deltaY < -20) {
      prevCard();
      wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 220);
    }
  }, { passive: true });

  // Touch Swipe up & down
  let startY = 0;
  stage.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
  }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientY - startY;
    if (diff > 40) {
      prevCard();
    } else if (diff < -40) {
      nextCard();
    }
  }, { passive: true });

  // Keyboard navigation up & down
  window.addEventListener('keydown', (e) => {
    if (theater.classList.contains('dismissed')) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      nextCard();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      prevCard();
    } else if (e.key === 'Enter') {
      const activePoster = posters[activeIndex];
      const link = activePoster.querySelector('.wga-vposter-cta');
      if (link && link.tagName === 'A' && link.href) {
        if (link.target === '_blank') {
          window.open(link.href, '_blank', 'noopener,noreferrer');
        } else {
          dismissIntro();
          window.location.hash = link.getAttribute('href');
        }
      } else {
        dismissIntro();
      }
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

  // Initial center position after layout settles
  requestAnimationFrame(() => {
    setTimeout(() => {
      updateActiveCard(0);
    }, 60);
  });
})();
