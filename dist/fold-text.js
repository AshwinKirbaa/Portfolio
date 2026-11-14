(() => {
  const HINGES = {
    top: { origin: '50% 0%', axis: 'rotateX', sign: -1 },
    bottom: { origin: '50% 100%', axis: 'rotateX', sign: 1 },
    left: { origin: '0% 50%', axis: 'rotateY', sign: 1 },
    right: { origin: '100% 50%', axis: 'rotateY', sign: -1 }
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  function initFoldText(root) {
    if (!root) return;
    const text = root.dataset.foldText || root.textContent.trim();
    const foldStyle = root.dataset.foldStyle || 'flip';
    const hinge = root.dataset.hinge || 'left';
    const duration = parseFloat(root.dataset.duration || '1.6');
    const stagger = parseFloat(root.dataset.stagger || '0.12');
    const foldAngle = parseFloat(root.dataset.foldAngle || '92');
    const ease = root.dataset.ease || 'back.out(1.2)';
    const perspective = parseFloat(root.dataset.perspective || '900');
    const creaseShading = parseFloat(root.dataset.creaseShading || '0.45');
    const hoverRefold = false;
    const refoldRadius = parseFloat(root.dataset.refoldRadius || '140');
    const refoldAngle = parseFloat(root.dataset.refoldAngle || '45');

    const hingeConfig = HINGES[hinge] || HINGES.left;
    const { axis, sign, origin } = hingeConfig;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    root.style.setProperty('--fold-perspective', `${Math.max(120, perspective)}px`);

    // Build segments
    const srOnly = document.createElement('span');
    srOnly.className = 'fold-text-sr-only';
    srOnly.textContent = text;

    const visual = document.createElement('span');
    visual.className = 'fold-text-visual';
    visual.setAttribute('aria-hidden', 'true');

    const words = text.split(/(\s+)/);
    const elements = [];

    words.forEach(part => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        visual.appendChild(document.createTextNode(part));
        return;
      }
      const wordSpan = document.createElement('span');
      wordSpan.className = 'fold-text-word';

      Array.from(part).forEach(char => {
        const seg = document.createElement('span');
        seg.className = 'fold-text-segment';

        const piece = document.createElement('span');
        piece.className = 'fold-text-piece';
        piece.dataset.foldHinge = hinge;
        piece.dataset.foldStyle = foldStyle;
        piece.dataset.foldText = char;
        piece.textContent = char;
        piece.style.opacity = '0';
        piece.style.transformOrigin = foldStyle === 'flip' ? '50% 50%' : origin;
        if (foldStyle === 'flip') piece.style.backfaceVisibility = 'visible';

        seg.appendChild(piece);
        wordSpan.appendChild(seg);
        elements.push(piece);
      });

      visual.appendChild(wordSpan);
    });

    root.innerHTML = '';
    root.appendChild(srOnly);
    root.appendChild(visual);

    if (reduceMotion) {
      elements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const angle = foldStyle === 'flip' ? 180 : foldAngle;
    const crease = creaseShading;
    const refold = hoverRefold ? refoldAngle : 0;
    const lift = foldStyle === 'flip' ? 0.45 : 0;

    const pieces = elements.map(element => ({
      element,
      t: 0,
      f: 0,
      r: 0,
      aim: 0
    }));

    const shade = (prog, tilt) => String(crease * clamp(1 - prog + tilt / 90, 0, 1));

    const unfoldEase = window.gsap ? gsap.parseEase(ease) || gsap.parseEase('power3.out') : (t) => t;
    const foldEase = window.gsap ? gsap.parseEase('power2.in') : (t) => t;

    const render = () => {
      pieces.forEach(piece => {
        const tilt = piece.r * refold;
        const progress = unfoldEase(piece.t) * (1 - foldEase(piece.f));
        const rise = lift * Math.sin(Math.PI * clamp(progress, 0, 1));
        const turn = `${axis}(${sign * ((1 - progress) * angle + tilt)}deg)`;
        piece.element.style.transform = rise > 0.001 ? `translateZ(${rise}em) ${turn}` : turn;
        piece.element.style.opacity = String(clamp(progress, 0, 1));
        piece.element.style.setProperty('--fold-crease', shade(progress, tilt));
      });
    };

    // Play unfold timeline with GSAP
    if (window.gsap) {
      const tl = gsap.timeline({ onUpdate: render });
      tl.fromTo(
        pieces,
        { t: 0, f: 0 },
        { t: 1, duration: duration, ease: 'none', stagger: { each: stagger, from: 'start' } }
      );
    } else {
      // Fallback if GSAP is still loading
      pieces.forEach(p => { p.t = 1; });
      render();
    }

    // Hover Refold tracking
    if (hoverRefold) {
      let pointer = null;
      let centers = null;
      let relaxing = false;

      const measure = () => {
        const box = root.getBoundingClientRect();
        centers = pieces.map(piece => {
          const rect = piece.element.parentElement.getBoundingClientRect();
          return {
            x: rect.left - box.left + rect.width / 2,
            y: rect.top - box.top + rect.height / 2
          };
        });
      };

      const relax = () => {
        let moving = false;
        pieces.forEach(piece => {
          const rate = piece.aim > piece.r ? 0.16 : 0.08;
          piece.r += (piece.aim - piece.r) * rate;
          if (Math.abs(piece.aim - piece.r) > 0.001) moving = true;
          else piece.r = piece.aim;
        });
        render();
        if (moving) {
          requestAnimationFrame(relax);
        } else {
          relaxing = false;
        }
      };

      const aim = () => {
        const box = root.getBoundingClientRect();
        const near =
          pointer &&
          pointer.x > box.left - refoldRadius &&
          pointer.x < box.right + refoldRadius &&
          pointer.y > box.top - refoldRadius &&
          pointer.y < box.bottom + refoldRadius;

        if (near && !centers) measure();

        let changed = false;
        pieces.forEach((piece, index) => {
          let value = 0;
          if (near && centers && centers[index]) {
            const center = centers[index];
            const distance =
              Math.hypot(box.left + center.x - pointer.x, box.top + center.y - pointer.y) / refoldRadius;
            if (distance < 1) value = 1 - distance * distance * (3 - 2 * distance);
          }
          if (value !== piece.aim) changed = true;
          piece.aim = value;
        });

        if (changed && !relaxing) {
          relaxing = true;
          requestAnimationFrame(relax);
        }
      };

      window.addEventListener('pointermove', (e) => {
        pointer = { x: e.clientX, y: e.clientY };
        aim();
      }, { passive: true });

      window.addEventListener('scroll', () => {
        centers = null;
        if (pointer) aim();
      }, { passive: true });

      document.documentElement.addEventListener('pointerleave', () => {
        pointer = null;
        pieces.forEach(p => { p.aim = 0; });
        if (!relaxing) {
          relaxing = true;
          requestAnimationFrame(relax);
        }
      });
    }
  }

  function initAll() {
    document.querySelectorAll('.fold-text').forEach(initFoldText);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
