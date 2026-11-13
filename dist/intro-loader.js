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

  // Pre-calculate positions once to eliminate expensive offsetTop DOM layout thrashing
  let posterData = [];
  function measure() {
    const stageH = stage.offsetHeight || window.innerHeight;
    posterData = posters.map((p) => {
      const top = p.offsetTop;
      const h = p.offsetHeight;
      const target = (stageH / 2) - top - (h / 2);
      return { top, h, target, center: top + (h / 2) };
    });
  }

  let currentY = 0;
  let targetY = 0;
  let isAnimating = false;
  let activeIndex = 0;

  function getTargetForIndex(index) {
    if (!posterData[index]) return 0;
    return posterData[index].target;
  }

  function getClosestIndex(y) {
    const stageH = stage.offsetHeight || window.innerHeight;
    const stageCenter = (stageH / 2) - y;
    let closest = 0;
    let minDist = Infinity;
    for (let i = 0; i < posterData.length; i++) {
      const dist = Math.abs(posterData[i].center - stageCenter);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    }
    return closest;
  }

  // 60-120fps hardware-accelerated render loop
  function render() {
    // 0.12 lerp factor gives snappy, silky-smooth responsiveness without floaty lag
    currentY += (targetY - currentY) * 0.12;

    // Direct GPU composition using translate3d
    track.style.transform = `translate3d(0, ${currentY.toFixed(1)}px, 0)`;

    // Check closest card
    const closestIndex = getClosestIndex(currentY);
    if (closestIndex !== activeIndex) {
      activeIndex = closestIndex;
      for (let i = 0; i < total; i++) {
        titleItems[i].classList.toggle('is-active', i === activeIndex);
        posters[i].classList.toggle('is-active', i === activeIndex);
      }
    }

    if (Math.abs(targetY - currentY) > 0.3 || isDragging) {
      requestAnimationFrame(render);
    } else {
      currentY = targetY;
      track.style.transform = `translate3d(0, ${Math.round(currentY)}px, 0)`;
      isAnimating = false;
    }
  }

  function startAnimation() {
    if (!isAnimating) {
      isAnimating = true;
      requestAnimationFrame(render);
    }
  }

  function scrollToIndex(index) {
    if (index < 0) index = 0;
    if (index >= total) index = total - 1;
    targetY = getTargetForIndex(index);
    startAnimation();
  }

  function nextCard() {
    scrollToIndex(activeIndex + 1);
  }

  function prevCard() {
    scrollToIndex(activeIndex - 1);
  }

  titleItems.forEach((item, i) => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      scrollToIndex(i);
    });
  });

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

  // Natural inertia wheel handler with rubber-band boundaries
  let snapTimeout = null;
  function handleWheel(e) {
    e.preventDefault();
    const delta = e.deltaY;
    targetY -= delta * 0.85;

    const minY = getTargetForIndex(total - 1) - 40;
    const maxY = getTargetForIndex(0) + 40;
    targetY = Math.max(minY, Math.min(maxY, targetY));

    startAnimation();

    clearTimeout(snapTimeout);
    snapTimeout = setTimeout(() => {
      const closest = getClosestIndex(targetY);
      scrollToIndex(closest);
    }, 120);
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

  // Keyboard navigation
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

  function init() {
    measure();
    currentY = getTargetForIndex(0);
    targetY = currentY;
    track.style.transform = `translate3d(0, ${Math.round(currentY)}px, 0)`;
    posters.forEach((p, i) => p.classList.toggle('is-active', i === 0));
    titleItems.forEach((t, i) => t.classList.toggle('is-active', i === 0));
  }

  window.addEventListener('load', init);
  window.addEventListener('resize', () => {
    measure();
    scrollToIndex(activeIndex);
  });

  requestAnimationFrame(() => {
    init();
    setTimeout(init, 50);
  });
})();
