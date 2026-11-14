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
  // Disabled to prevent duplicate follower circles competing with smooth cursor
  function initCursorFollower() {
    return;
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

