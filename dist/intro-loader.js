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

  const total = posters.length;

  // Physics-based continuous virtual scroll state
  let currentY = 0;
  let targetY = 0;
  let isAnimating = false;
  let activeIndex = 0;

  // Calculate target offset for a given card index
  function getTargetForIndex(index) {
    if (!stage || !posters[index]) return 0;
    const stageH = stage.offsetHeight || window.innerHeight;
    const posterTop = posters[index].offsetTop;
    const posterH = posters[index].offsetHeight;
    return (stageH / 2) - posterTop - (posterH / 2);
  }

  // Get index of the card closest to center given a translateY
  function getClosestIndex(translateY) {
    if (!stage) return 0;
    const stageH = stage.offsetHeight || window.innerHeight;
    const stageCenter = (stageH / 2) - translateY;

    let closest = 0;
    let minDist = Infinity;
    posters.forEach((p, i) => {
      const pCenter = p.offsetTop + (p.offsetHeight / 2);
      const dist = Math.abs(pCenter - stageCenter);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    return closest;
  }

  // Smooth render loop (Lerp with friction like Lenis/Locomotive)
  function render() {
    // Smooth lerp: moves 9% towards target each frame for fluid momentum
    currentY += (targetY - currentY) * 0.095;

    // Apply smooth transform to the vertical track
    track.style.transform = `translate3d(0, ${currentY.toFixed(2)}px, 0)`;

    // Calculate proximity for each card to smoothly scale and fade
    const stageH = stage.offsetHeight || window.innerHeight;
    const stageCenter = (stageH / 2) - currentY;

    let closestIndex = 0;
    let minDist = Infinity;

    posters.forEach((p, i) => {
      const pCenter = p.offsetTop + (p.offsetHeight / 2);
      const dist = Math.abs(pCenter - stageCenter);
      const maxDist = p.offsetHeight * 1.35;
      const factor = Math.max(0, 1 - Math.min(1, dist / maxDist)); // 1 when centered, 0 when far

      // Continuous smooth scale between 0.82 and 1.0
      const scale = 0.82 + (factor * 0.18);
      // Continuous smooth opacity between 0.3 and 1.0
      const opacity = 0.3 + (factor * 0.7);

      p.style.transform = `scale(${scale.toFixed(3)})`;
      p.style.opacity = opacity.toFixed(3);

      if (dist < minDist) {
        minDist = dist;
        closestIndex = i;
      }
    });

    if (closestIndex !== activeIndex) {
      activeIndex = closestIndex;
      titleItems.forEach((item, i) => {
        item.classList.toggle('is-active', i === activeIndex);
      });
      posters.forEach((p, i) => {
        p.classList.toggle('is-active', i === activeIndex);
      });
    }

    if (Math.abs(targetY - currentY) > 0.1 || isDragging) {
      requestAnimationFrame(render);
    } else {
      currentY = targetY;
      track.style.transform = `translate3d(0, ${currentY.toFixed(2)}px, 0)`;
      isAnimating = false;
    }
  }

  function startAnimation() {
    if (!isAnimating) {
      isAnimating = true;
      requestAnimationFrame(render);
    }
  }

  // Jump to specific card smoothly
  function scrollToIndex(index) {
    if (index < 0) index = 0;
    if (index >= total) index = total - 1;
    targetY = getTargetForIndex(index);
    startAnimation();
  }

  // Next / Previous helpers
  function nextCard() {
    scrollToIndex(activeIndex + 1);
  }

  function prevCard() {
    scrollToIndex(activeIndex - 1);
  }

  // Right column titles click to smoothly scroll to card
  titleItems.forEach((item, i) => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      scrollToIndex(i);
    });
  });

  // Clicking an inactive poster smoothly centers it; active poster triggers destination
  posters.forEach((poster, i) => {
    poster.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) return;

      if (i === activeIndex) {
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
        scrollToIndex(i);
      }
    });
  });

  // Natural Wheel Scrolling: smoothly glides up & down
  let snapTimeout = null;
  function handleWheel(e) {
    e.preventDefault();
    // Continuous scroll delta
    const delta = e.deltaY * 0.9;
    targetY -= delta;

    // Boundaries with gentle rubber-band elasticity
    const minY = getTargetForIndex(total - 1) - 60;
    const maxY = getTargetForIndex(0) + 60;
    targetY = Math.max(minY, Math.min(maxY, targetY));

    startAnimation();

    // When scrolling stops, gently snap to closest card
    clearTimeout(snapTimeout);
    snapTimeout = setTimeout(() => {
      const closest = getClosestIndex(targetY);
      scrollToIndex(closest);
    }, 180);
  }

  stage.addEventListener('wheel', handleWheel, { passive: false });
  theater.addEventListener('wheel', handleWheel, { passive: false });

  // Touch & Drag Support
  let startY = 0;
  let dragStartY = 0;
  let isDragging = false;

  stage.addEventListener('mousedown', (e) => {
    startY = e.clientY;
    dragStartY = targetY;
    isDragging = true;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const diff = e.clientY - startY;
    targetY = dragStartY + diff;
    startAnimation();
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    const closest = getClosestIndex(targetY);
    scrollToIndex(closest);
  });

  stage.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
    dragStartY = targetY;
    isDragging = true;
  }, { passive: true });

  stage.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientY - startY;
    targetY = dragStartY + diff;
    startAnimation();
  }, { passive: true });

  stage.addEventListener('touchend', () => {
    isDragging = false;
    const closest = getClosestIndex(targetY);
    scrollToIndex(closest);
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

  // Initial alignment
  function initPosition() {
    currentY = getTargetForIndex(0);
    targetY = currentY;
    render();
  }

  window.addEventListener('load', initPosition);
  window.addEventListener('resize', () => scrollToIndex(activeIndex));
  requestAnimationFrame(() => {
    initPosition();
    setTimeout(initPosition, 80);
  });
})();
