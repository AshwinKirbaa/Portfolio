(() => {
  const theater = document.querySelector('.portfolio-intro-theater');
  const stage = document.querySelector('.wga-center-col');
  const track = document.querySelector('.wga-vertical-track');
  const posters = Array.from(document.querySelectorAll('.wga-vposter'));
  const titleItems = Array.from(document.querySelectorAll('.wga-title-item'));
  const enterBtns = document.querySelectorAll('.enter-portfolio-trigger');
  const heroCard = document.querySelector('.hero-card');

  if (!theater || !track || posters.length === 0) return;

  // Lock scrolling of background page during intro
  document.body.style.overflow = 'hidden';

  const total = posters.length;

  let currentProgress = 0; // Floating index: 0, 1, 2, ...
  let targetProgress = 0;
  let activeIndex = 0;
  let isAnimating = false;
  let isDragging = false;
  let isTransitioning = false;
  let startY = 0;
  let dragStartProgress = 0;
  let snapTimeout = null;

  function measure() {
    posters.forEach((p) => {
      p.style.marginTop = (-p.offsetHeight / 2) + 'px';
      p.style.marginLeft = (-p.offsetWidth / 2) + 'px';
    });
  }

  function updateLayout() {
    if (isTransitioning) return;
    const stageH = stage.offsetHeight || window.innerHeight;
    const baseH = posters[0] ? posters[0].offsetHeight : 568;
    const stepY = (stageH / 2) - 105 + (baseH * 0.55 / 2);

    for (let i = 0; i < total; i++) {
      const diff = i - currentProgress;
      const absDiff = Math.abs(diff);

      const factor = Math.max(0, 1 - absDiff);
      const easedFactor = Math.pow(factor, 1.6);

      const scale = 0.55 + 0.45 * easedFactor;
      const opacity = 0.45 + 0.55 * factor;

      const translateY = diff * stepY;

      const p = posters[i];
      p.style.transform = 'translate3d(0, ' + translateY.toFixed(1) + 'px, 0) scale(' + scale.toFixed(4) + ')';
      p.style.opacity = opacity.toFixed(4);
      p.style.zIndex = Math.round(30 - Math.min(25, absDiff * 8));
      p.style.pointerEvents = 'auto';
    }

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
    if (isTransitioning) return;
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
    if (!isAnimating && !isTransitioning) {
      isAnimating = true;
      requestAnimationFrame(render);
    }
  }

  function scrollToProgress(p) {
    if (isTransitioning) return;
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

  // Wheel interaction
  function handleWheel(e) {
    if (isTransitioning || isIntroPlaying) return;
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
    if (isTransitioning || isIntroPlaying) return;
    startY = e.clientY;
    dragStartProgress = currentProgress;
    isDragging = true;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging || isTransitioning || isIntroPlaying) return;
    const diffY = e.clientY - startY;
    const stageH = stage.offsetHeight || window.innerHeight;
    targetProgress = dragStartProgress - (diffY / (stageH * 0.45));
    targetProgress = Math.max(-0.2, Math.min(total - 0.8, targetProgress));
    startAnimation();
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging || isTransitioning) return;
    isDragging = false;
    const closest = Math.round(targetProgress);
    scrollToIndex(closest);
  });

  stage.addEventListener('touchstart', (e) => {
    if (isTransitioning || isIntroPlaying) return;
    startY = e.touches[0].clientY;
    dragStartProgress = currentProgress;
    isDragging = true;
  }, { passive: true });

  stage.addEventListener('touchmove', (e) => {
    if (!isDragging || isTransitioning || isIntroPlaying) return;
    const diffY = e.touches[0].clientY - startY;
    const stageH = stage.offsetHeight || window.innerHeight;
    targetProgress = dragStartProgress - (diffY / (stageH * 0.45));
    targetProgress = Math.max(-0.2, Math.min(total - 0.8, targetProgress));
    startAnimation();
  }, { passive: true });

  stage.addEventListener('touchend', () => {
    if (isTransitioning || isIntroPlaying) return;
    isDragging = false;
    const closest = Math.round(targetProgress);
    scrollToIndex(closest);
  }, { passive: true });

  // FLUID HERO TRANSITION: Morph photo card from center to lower-left portfolio hero
  function transitionPhotoCardToHero() {
    if (isTransitioning) return;
    isTransitioning = true;
    isAnimating = false;

    // Reset scroll to top of page so destination rect is perfectly calculated
    window.scrollTo(0, 0);

    const sourcePoster = posters[0];
    const sourceCard = sourcePoster.querySelector('.profile-card');
    const destCard = heroCard ? heroCard.querySelector('.profile-card') : null;

    if (!sourceCard || !destCard || !heroCard) {
      dismissIntro();
      return;
    }

    // Capture precise bounding boxes
    const fromRect = sourceCard.getBoundingClientRect();

    // Temporarily ensure heroCard is visible for measurement
    heroCard.style.visibility = 'visible';
    heroCard.style.opacity = '1';
    const toRect = destCard.getBoundingClientRect();
    // Hide target card until arrival
    destCard.style.visibility = 'hidden';

    // Clone source card as flying morph element
    const morphCard = sourceCard.cloneNode(true);
    morphCard.classList.add('morph-flight-card');
    morphCard.style.position = 'fixed';
    morphCard.style.top = fromRect.top + 'px';
    morphCard.style.left = fromRect.left + 'px';
    morphCard.style.width = fromRect.width + 'px';
    morphCard.style.height = fromRect.height + 'px';
    morphCard.style.margin = '0';
    morphCard.style.zIndex = '999999';
    morphCard.style.pointerEvents = 'none';

    document.body.appendChild(morphCard);

    // Hide original source card in intro stage
    sourcePoster.style.visibility = 'hidden';

    // Trigger theater background fade to reveal red editorial portfolio background
    theater.classList.add('is-transitioning');
    document.body.style.overflow = '';

    // Calculate delta and scale factors
    const deltaX = toRect.left - fromRect.left;
    const deltaY = toRect.top - fromRect.top;
    const scaleX = toRect.width / fromRect.width;
    const scaleY = toRect.height / fromRect.height;

    const finishLanding = () => {
      destCard.style.visibility = 'visible';
      destCard.style.opacity = '1';
      destCard.style.display = 'block';
      heroCard.style.visibility = 'visible';
      heroCard.style.opacity = '1';
      heroCard.style.display = 'block';
      theater.classList.add('dismissed');
      theater.classList.remove('is-transitioning');
      if (morphCard.parentNode) morphCard.parentNode.removeChild(morphCard);
    };

    // Execute 60fps morph flight using GSAP if present, else CSS transition
    if (window.gsap) {
      gsap.to(morphCard, {
        duration: 0.85,
        x: deltaX,
        y: deltaY,
        scaleX: scaleX,
        scaleY: scaleY,
        ease: 'power3.inOut',
        onComplete: finishLanding
      });
    } else {
      morphCard.style.transition = 'transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)';
      requestAnimationFrame(() => {
        morphCard.style.transform = `translate3d(${deltaX.toFixed(1)}px, ${deltaY.toFixed(1)}px, 0) scale(${scaleX.toFixed(4)}, ${scaleY.toFixed(4)})`;
      });
      setTimeout(finishLanding, 860);
    }

    // Trigger portfolio reveal animations in sync with card flight
    triggerHeroElementsEntrance();
  }

  function triggerHeroElementsEntrance() {
    // 1. Reveal hero-name & fold-text animation
    const heroName = document.querySelector('.hero-name');
    if (heroName) {
      heroName.classList.add('visible');
      const h1s = heroName.querySelectorAll('h1');
      h1s.forEach((h1) => {
        h1.classList.add('visible');
        h1.style.opacity = '1';
        h1.style.transform = 'none';
        h1.style.filter = 'none';
      });
    }

    // 2. Stagger in hero-meta, discipline, hero-foot, scroll-cue
    const heroMeta = document.querySelector('.hero-meta');
    if (heroMeta) {
      heroMeta.classList.add('visible');
      heroMeta.style.opacity = '1';
      heroMeta.style.transform = 'none';
    }

    const discipline = document.querySelector('.discipline');
    if (discipline) {
      discipline.classList.add('visible');
      discipline.style.opacity = '1';
      discipline.style.transform = 'none';
      const items = discipline.querySelectorAll('a');
      items.forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(15px)';
        if (window.gsap) {
          gsap.to(item, { opacity: 1, x: 0, duration: 0.6, delay: 0.2 + (i * 0.08), ease: 'power2.out' });
        } else {
          setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'none'; }, 200 + (i * 80));
        }
      });
    }

    const heroFoot = document.querySelector('.hero-foot');
    if (heroFoot) {
      heroFoot.classList.add('visible');
      heroFoot.style.opacity = '1';
      heroFoot.style.transform = 'none';
    }

    const scrollCue = document.querySelector('.scroll-cue');
    if (scrollCue) {
      scrollCue.style.opacity = '1';
    }
  }

  // Click on cards
  posters.forEach((poster, i) => {
    poster.addEventListener('click', (e) => {
      if (isTransitioning) return;
      if (e.target.closest('a') || e.target.closest('button')) return;

      if (i === activeIndex) {
        if (i === 0) {
          // Photo card clicked -> FLUID MORPH FROM CENTER TO LOWER LEFT
          transitionPhotoCardToHero();
        } else {
          // Other cards: open their corresponding channel destination
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
    if (theater.classList.contains('dismissed') || isTransitioning) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      nextCard();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      prevCard();
    } else if (e.key === 'Enter') {
      if (activeIndex === 0) {
        transitionPhotoCardToHero();
      } else {
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
      }
    } else if (e.key === 'Escape') {
      dismissIntro();
    }
  });

  function dismissIntro() {
    theater.classList.add('dismissed');
    document.body.style.overflow = '';
    window.dispatchEvent(new Event('resize'));
    triggerHeroElementsEntrance();
  }

  enterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (activeIndex === 0) {
        transitionPhotoCardToHero();
      } else {
        dismissIntro();
      }
    });
  });

  let isIntroPlaying = true;

  function playIntroAnimation() {
    isIntroPlaying = true;
    measure();
    currentProgress = 0;
    targetProgress = 0;
    activeIndex = 0;

    const brandWordmark = theater.querySelector('.wga-name-brand h1, .wga-name-brand h2');
    const leftBio = theater.querySelector('.wga-left-bio');
    const bottomBar = theater.querySelector('.wga-bottom-bar');
    const stageH = stage.offsetHeight || window.innerHeight;

    // Set initial intro loading state
    if (window.gsap) {
      // Immediate set starting transforms
      gsap.set(track, { y: stageH });
      gsap.set(posters, { scale: 0.2, opacity: 0 });
      if (brandWordmark) gsap.set(brandWordmark, { yPercent: 120 });
      if (leftBio) gsap.set(leftBio, { y: 25, opacity: 0 });
      if (titleItems.length) gsap.set(titleItems, { y: 30, opacity: 0 });
      if (bottomBar) gsap.set(bottomBar, { y: 20, opacity: 0 });

      // Create master intro timeline matching we-go-again.com
      const tl = gsap.timeline({
        onComplete: () => {
          isIntroPlaying = false;
          // Clean up inline styles from intro animation so layout updater takes over cleanly
          gsap.set(track, { clearProps: 'transform,y' });
          updateLayout();
        }
      });

      // 1. Center track vertical sweep up (duration 1.35s with ultra-smooth cubic-bezier)
      tl.to(track, {
        y: 0,
        duration: 1.35,
        ease: 'power4.out'
      }, 0.05);

      // 2. Individual card expansion & opacity ramp
      // Calculate target resting positions for active card (0) and adjacent card (1)
      const baseH = posters[0] ? posters[0].offsetHeight : 568;
      const stepY = (stageH / 2) - 105 + (baseH * 0.55 / 2);

      posters.forEach((p, i) => {
        const diff = i; // at progress = 0
        const absDiff = Math.abs(diff);
        const factor = Math.max(0, 1 - absDiff);
        const easedFactor = Math.pow(factor, 1.6);
        const targetScale = 0.55 + 0.45 * easedFactor;
        const targetOpacity = 0.45 + 0.55 * factor;
        const targetTranslateY = diff * stepY;

        tl.fromTo(p, {
          y: targetTranslateY,
          scale: 0.2,
          opacity: 0
        }, {
          y: targetTranslateY,
          scale: targetScale,
          opacity: targetOpacity,
          duration: 1.35,
          ease: 'power4.out'
        }, 0.05);
      });

      // 3. Left Brand Wordmark reveal from overflow mask
      if (brandWordmark) {
        tl.to(brandWordmark, {
          yPercent: 0,
          duration: 1.15,
          ease: 'power3.out'
        }, 0.2);
      }

      // 4. Left bio tagline fade up
      if (leftBio) {
        tl.to(leftBio, {
          y: 0,
          opacity: 0.7,
          duration: 0.9,
          ease: 'power3.out'
        }, 0.5);
      }

      // 5. Right titles list staggered reveal
      if (titleItems.length) {
        titleItems.forEach((item, i) => {
          item.classList.toggle('is-active', i === 0);
        });

        tl.to(titleItems, {
          y: 0,
          opacity: (i) => i === 0 ? 1 : 0.35,
          duration: 0.85,
          stagger: 0.06,
          ease: 'power3.out'
        }, 0.4);
      }

      // 6. Bottom scroll hint fade up
      if (bottomBar) {
        tl.to(bottomBar, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out'
        }, 0.7);
      }

    } else {
      // Fallback if GSAP is somehow not loaded
      measure();
      updateLayout();
      isIntroPlaying = false;
    }
  }

  function init() {
    measure();
    currentProgress = 0;
    targetProgress = 0;
    activeIndex = 0;
    playIntroAnimation();
  }

  window.addEventListener('load', init);
  window.addEventListener('resize', () => {
    measure();
    if (!isIntroPlaying) {
      updateLayout();
    }
  });

  requestAnimationFrame(() => {
    init();
  });
})();
