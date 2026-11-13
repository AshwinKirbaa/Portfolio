/* ==========================================================================
   NIKA STERN SIGNATURE INTERACTION & ANIMATION CONTROLLER
   Matches exact behaviors from nikastern.framer.media:
   - Dynamic kinetic typography word/char splitting
   - High-performance Lerp Cursor Follower
   - Staggered reveals on scroll into viewport
   - Rolling link bindings
   ========================================================================== */

(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- 1. KINETIC TEXT SPLITTING & STAGGER REVEAL ---
  // Apply word & character split to editorial headings (Approach, Selected Work, Connected Disciplines, How I Work, About)
  function initKineticHeadings() {
    if (reduceMotion) return;

    const targets = document.querySelectorAll('.intro-statement p, .section-title h2, .cases-intro h2, .cap-head h2, .process-head h2, .about-grid h2, .contact-main p');
    
    targets.forEach(heading => {
      // Avoid re-splitting
      if (heading.dataset.splitDone) return;
      heading.dataset.splitDone = 'true';

      const text = heading.textContent.trim();
      const words = text.split(/\s+/);
      
      heading.innerHTML = '';
      let charIndex = 0;

      words.forEach((word) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'nika-split-word';

        // Split word into chars
        for (let i = 0; i < word.length; i++) {
          const charSpan = document.createElement('span');
          charSpan.className = 'nika-split-char';
          charSpan.textContent = word[i];
          charSpan.style.transitionDelay = `${(charIndex * 0.025).toFixed(3)}s`;
          wordSpan.appendChild(charSpan);
          charIndex++;
        }

        heading.appendChild(wordSpan);
      });
    });
  }

  // --- 2. INTERACTIVE CURSOR FOLLOWER ---
  function initCursorFollower() {
    if (reduceMotion || !matchMedia('(pointer:fine)').matches) return;

    const dot = document.createElement('div');
    dot.className = 'nika-cursor-dot';
    const follower = document.createElement('div');
    follower.className = 'nika-cursor-follower';

    document.body.appendChild(dot);
    document.body.appendChild(follower);

    let mouseX = -100, mouseY = -100;
    let followerX = -100, followerY = -100;

    window.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }, { passive: true });

    // Smooth LERP follower loop
    function updateFollower() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;

      follower.style.transform = `translate3d(${followerX.toFixed(2)}px, ${followerY.toFixed(2)}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(updateFollower);
    }
    requestAnimationFrame(updateFollower);

    // Hover scale triggers
    const interactiveSelectors = 'a, button, .roll-btn, .project-row, .cap-item, .console-key, .hud-step-pill';
    document.querySelectorAll(interactiveSelectors).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('nika-cursor-hovered'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('nika-cursor-hovered'));
    });
  }

  // --- 3. DYNAMIC SCROLL REVEAL OBSERVER ---
  function initScrollReveals() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          entry.target.classList.add('is-revealed');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal, .intro-statement, .section-title, .cases-intro, .cap-head, .process-head, .about-grid').forEach(el => {
      observer.observe(el);
    });
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initKineticHeadings();
      initCursorFollower();
      initScrollReveals();
    });
  } else {
    initKineticHeadings();
    initCursorFollower();
    initScrollReveals();
  }
})();

