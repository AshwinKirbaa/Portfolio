(() => {
  const HINGES = {
    top: { origin: '50% 0%', axis: 'rotateX', sign: -1 },
    bottom: { origin: '50% 100%', axis: 'rotateX', sign: 1 },
    left: { origin: '0% 50%', axis: 'rotateY', sign: 1 },
    right: { origin: '100% 50%', axis: 'rotateY', sign: -1 }
  };

  const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

  function initFoldText(root) {
    if (!root) return;
    const text = root.dataset.foldText || root.textContent.trim();
    const foldStyle = root.dataset.foldStyle || 'flip';
    const hinge = root.dataset.hinge || 'left';
    const foldAngle = parseFloat(root.dataset.foldAngle || '92');
    const duration = parseFloat(root.dataset.duration || '1.6');
    const stagger = parseFloat(root.dataset.stagger || '0.12');
    const perspective = parseFloat(root.dataset.perspective || '900');
    const creaseShading = parseFloat(root.dataset.creaseShading || '0.45');
    const hoverRefold = root.dataset.hoverRefold !== 'false';
    const refoldRadius = parseFloat(root.dataset.refoldRadius || '120');
    const refoldAngle = parseFloat(root.dataset.refoldAngle || '40');

    const hingeConfig = HINGES[hinge] || HINGES.left;
    const { axis, sign, origin } = hingeConfig;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    root.style.setProperty('--fold-perspective', `${perspective}px`);

    // Build segments HTML
    const srOnly = document.createElement('span');
    srOnly.className = 'fold-text-sr-only';
    srOnly.textContent = text;

    const visual = document.createElement('span');
    visual.className = 'fold-text-visual';
    visual.setAttribute('aria-hidden', 'true');

    const words = text.split(/(\s+)/);
    const pieces = [];

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

        pieces.push({
          element: piece,
          char,
          t: 0,
          r: 0,
          aim: 0
        });
      });

      visual.appendChild(wordSpan);
    });

    root.innerHTML = '';
    root.appendChild(srOnly);
    root.appendChild(visual);

    if (reduceMotion) {
      pieces.forEach(p => {
        p.element.style.opacity = '1';
        p.element.style.transform = 'none';
      });
      return;
    }

    const angle = foldStyle === 'flip' ? 180 : foldAngle;
    const lift = foldStyle === 'flip' ? 0.45 : 0;

    const shade = (prog, tilt) => String(creaseShading * clamp(1 - prog + tilt / 90, 0, 1));

    function renderPiece(p) {
      const tilt = p.r * refoldAngle;
      // Spring / ease progress
      const prog = clamp(p.t, 0, 1);
      // ease back out simulation
      const easeProg = 1 + 2.70158 * Math.pow(prog - 1, 3) + 1.70158 * Math.pow(prog - 1, 2);
      const clampedProg = prog >= 1 ? 1 : clamp(easeProg, 0, 1.25);

      const rise = lift * Math.sin(Math.PI * clamp(prog, 0, 1));
      const turn = `${axis}(${sign * ((1 - clampedProg) * angle + tilt)}deg)`;
      p.element.style.transform = rise > 0.001 ? `translateZ(${rise}em) ${turn}` : turn;
      p.element.style.opacity = String(clamp(prog * 1.5, 0, 1));
      p.element.style.setProperty('--fold-crease', shade(prog, tilt));
    }

    // Animation entry
    const startTime = performance.now() + 100;
    const durMs = duration * 1000;
    const stagMs = stagger * 1000;

    function animateUnfold(now) {
      let complete = true;
      pieces.forEach((p, idx) => {
        const itemStart = startTime + idx * stagMs;
        if (now < itemStart) {
          complete = false;
          return;
        }
        const elapsed = now - itemStart;
        p.t = clamp(elapsed / durMs, 0, 1);
        if (p.t < 1) complete = false;
        renderPiece(p);
      });

      if (!complete) {
        requestAnimationFrame(animateUnfold);
      }
    }
    requestAnimationFrame(animateUnfold);

    // Hover refold interaction
    if (hoverRefold) {
      let pointer = null;

      function onMove(e) {
        pointer = { x: e.clientX, y: e.clientY };
        aim();
      }

      function onLeave() {
        pointer = null;
        pieces.forEach(p => { p.aim = 0; });
        startRelax();
      }

      function aim() {
        if (!pointer) return;
        pieces.forEach(p => {
          const rect = p.element.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dist = Math.hypot(cx - pointer.x, cy - pointer.y);
          if (dist < refoldRadius) {
            p.aim = (1 - dist / refoldRadius);
          } else {
            p.aim = 0;
          }
        });
        startRelax();
      }

      let relaxing = false;
      function relax() {
        let moving = false;
        pieces.forEach(p => {
          p.r += (p.aim - p.r) * 0.15;
          if (Math.abs(p.aim - p.r) > 0.001) moving = true;
          renderPiece(p);
        });
        if (moving) {
          requestAnimationFrame(relax);
        } else {
          relaxing = false;
        }
      }

      function startRelax() {
        if (!relaxing) {
          relaxing = true;
          requestAnimationFrame(relax);
        }
      }

      window.addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
    }
  }

  // Auto-initialize all .fold-text elements
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fold-text').forEach(initFoldText);
  });
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    document.querySelectorAll('.fold-text').forEach(initFoldText);
  }
})();
