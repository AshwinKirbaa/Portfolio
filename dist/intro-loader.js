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

  let currentProgress = 0; // Floating index: 0, 1, 2, ...
  let targetProgress = 0;
  let activeIndex = 0;
  let isAnimating = false;
  let isDragging = false;
  let startY = 0;
  let dragStartProgress = 0;
  let snapTimeout = null;

  function measure() {
    // Center posters around origin (50%, 50%)
    posters.forEach((p) => {
      p.style.marginTop = (-p.offsetHeight / 2) + 'px';
      p.style.marginLeft = (-p.offsetWidth / 2) + 'px';
    });
  }

  // Exact math from we-go-again.com reference:
  // Active traversed card is big (scale 1.0, 100% opacity, crisp in center)
  // Non-active cards are small (scale 0.55, 35% opacity), top and bottom cards peek by ~75px into view
  function updateLayout() {
    const stageH = stage.offsetHeight || window.innerHeight;
    
    // Calculate vertical step so diff = ±1 peeks ~75px into the stage edge
    // Card height is ~568px, at scale 0.55 rendered height is ~312px.
    // Half-height of small card is ~156px.
    // Distance from stage center to stage top/bottom is stageH / 2.
    // We want the small card edge to peek ~75px inside the viewport:
    // stepY = (stageH / 2) - 75 + (568 * 0.55 / 2)
    const baseH = posters[0] ? posters[0].offsetHeight : 568;
    const stepY = (stageH / 2) - 75 + (baseH * 0.55 / 2);

    for (let i = 0; i < total; i++) {
      const diff = i - currentProgress;
      const absDiff = Math.abs(diff);

      // Traversed card expansion curve:
      // factor = 1 at center, drops to 0 when absDiff >= 1
      const factor = Math.max(0, 1 - absDiff);
      const easedFactor = Math.pow(factor, 1.6);

      // Traversed card is scale 1.0, others shrink down to 0.55
      const scale = 0.55 + 0.45 * easedFactor;
      // Opacity: traversed card is 1.0, others are 0.35
      const opacity = 0.32 + 0.68 * factor;

      // Displace along Y axis
      const translateY = diff * stepY;

      const p = posters[i];
      p.style.transform = 'translate3d(0, ' + translateY.toFixed(1) + 'px, 0) scale(' + scale.toFixed(4) + ')';
      p.style.opacity = opacity.toFixed(4);
      p.style.zIndex = Math.round(30 - Math.min(25, absDiff * 8));

      // Pointer events: only center card or close cards are clickable
      p.style.pointerEvents = absDiff < 0.6 ? 'auto' : 'auto';
    }

    // Sync active title item
    const closest = Math.round(currentProgress);
    const clampedClosest = Math.max(0, Math.min(total - 1, closest));
    if (clampedClosest !== activeIndex) {
      activeIndex = clampedClosest;
      for (let i = 0; i < total; i++) {
        titleItems[i].classList.toggle('is-active', i === activeIndex);
        posters[i].classList.toggle('is-active', i === activeIndex);
      }
    }
  }

  // Smooth 60-120fps hardware-accelerated render loop
  function render() {
    currentProgress += (targetProgress - currentProgress) * 0.14;
    updateLayout();

    if (Math.abs(targetProgress - currentProgress) > 0.001 || isDragging) {
      requestAnimationFrame(render);
    } else {
      currentProgress = targetProgress;
      updateLayout();
      isAnimating = false;
    }
  }

  function startAnimation() {
    if (!isAnimating) {
      isAnimating = true;
      requestAnimationFrame(render);
    }
  }

  function scrollToProgress(p) {
    targetProgress = Math.max(0, Math.min(total - 1, p));
    startAnimation();
  }

  function scrollToIndex(index) {
    scrollToProgress(index);
  }

  function nextCard() {
    scrollToIndex(activeIndex + 1);
  }

  function prevCard() {
    scrollToIndex(activeIndex - 1);
  }

  // Wheel interaction: silky smooth traversal with natural snap
  function handleWheel(e) {
    e.preventDefault();
    const delta = e.deltaY;
    targetProgress += (delta / 450);
    targetProgress = Math.max(-0.2, Math.min(total - 0.8, targetProgress));

    startAnimation();

    clearTimeout(snapTimeout);
    snapTimeout = setTimeout(() => {
      const closest = Math.round(targetProgress);
      scrollToIndex(closest);
    }, 140);
  }

  stage.addEventListener('wheel', handleWheel, { passive: false });
  theater.addEventListener('wheel', handleWheel, { passive: false });

  // Touch & Drag Support
  stage.addEventListener('mousedown', (e) => {
    startY = e.clientY;
    dragStartProgress = currentProgress;
    isDragging = true;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const diffY = e.clientY - startY;
    const stageH = stage.offsetHeight || window.innerHeight;
    targetProgress = dragStartProgress - (diffY / (stageH * 0.45));
    targetProgress = Math.max(-0.2, Math.min(total - 0.8, targetProgress));
    startAnimation();
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    const closest = Math.round(targetProgress);
    scrollToIndex(closest);
  });

  stage.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
    dragStartProgress = currentProgress;
    isDragging = true;
  }, { passive: true });

  stage.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const diffY = e.touches[0].clientY - startY;
    const stageH = stage.offsetHeight || window.innerHeight;
    targetProgress = dragStartProgress - (diffY / (stageH * 0.45));
    targetProgress = Math.max(-0.2, Math.min(total - 0.8, targetProgress));
    startAnimation();
  }, { passive: true });

  stage.addEventListener('touchend', () => {
    isDragging = false;
    const closest = Math.round(targetProgress);
    scrollToIndex(closest);
  }, { passive: true });

  // Click on card: if active card clicked, trigger its action; if inactive clicked, traverse to it!
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

  // Right column click to navigate
  titleItems.forEach((item, i) => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      scrollToIndex(i);
    });
  });

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
    currentProgress = 0;
    targetProgress = 0;
    activeIndex = 0;
    updateLayout();
    posters.forEach((p, i) => p.classList.toggle('is-active', i === 0));
    titleItems.forEach((t, i) => t.classList.toggle('is-active', i === 0));
  }

  window.addEventListener('load', init);
  window.addEventListener('resize', () => {
    measure();
    updateLayout();
  });

  requestAnimationFrame(() => {
    init();
    setTimeout(init, 60);
  });
})();
