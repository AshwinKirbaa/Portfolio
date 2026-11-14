(() => {
  const shell = document.querySelector('[data-certificate-carousel]');
  if (!shell) return;
  const items = [
    ['kalam-render-rush-first-place.png', 'Render Rush — First Place', 'Kalam 2026', 'render-rush'],
    ['hacksprint-2026.png', 'HackSprint ’26', '24-hour Hackathon', 'hacksprint-26'],
    ['ibm-bob-2-hackathon.png', 'IBM BoB 2.0', 'Agentic AI Build', 'ibm-bob-2'],
    ['hack-in-hills-top-500.png', 'Hack in Hills', 'Top 500 Builder', 'hack-in-hills'],
    ['hackday-1.png', 'HackDay 1.0', 'Rapid Prototyping', 'hackday-1'],
    ['promptwars-gdg-cit.png', 'PromptWars × GDG CIT', 'AI Prototype', 'promptwars'],
    ['hackerrank-orchestrate-rank-1134.png', 'HackerRank Orchestrate', 'Final Rank #1,134', 'hackerrank-orchestrate'],
    ['hackerrank-frontend-react.png', 'Frontend Developer', 'React Certification', 'frontend-react'],
    ['ijrti-publication.png', 'TwinEval AI', 'IJRTI Publication', 'twineval-ijrti'],
    ['nptel-cloud-computing-elite.png', 'Cloud Computing', 'NPTEL Elite', 'nptel-cloud'],
    ['gemini-quiz-war.png', 'Gemini Quiz War', 'Participation', 'gemini-quiz-war']
  ];
  const ring = shell.querySelector('.certificate-carousel-ring');
  const title = shell.querySelector('[data-carousel-title]');
  const meta = shell.querySelector('[data-carousel-meta]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const step = 360 / items.length;
  let rotation = 0, targetRotation = 0, velocity = reduced ? 0 : -0.045;
  let isPointerDown = false, dragging = false, moved = false;
  let startX = 0, startY = 0, previousX = 0, previousTime = 0, activeIndex = -1;
  let downTargetCard = null;

  const radius = () => {
    const width = innerWidth <= 720 ? 160 : 220;
    return Math.max(245, Math.min(430, ((width + 25) * items.length) / (2 * Math.PI)));
  };

  items.forEach(([src, itemTitle, , anchor], index) => {
    const card = document.createElement('a');
    card.className = 'certificate-carousel-card';
    card.href = `certificates.html#${anchor}`;
    card.setAttribute('aria-label', `${itemTitle} — view this certificate`);
    card.dataset.index = String(index);
    card.innerHTML = `<img src="assets/certificates/${src}" alt="${itemTitle} certificate" loading="lazy">`;
    ring.append(card);
  });

  const cards = [...ring.children];

  const positionCards = () => {
    const depth = radius();
    cards.forEach((card, index) => {
      card.style.transform = `rotateY(${index * step}deg) translateZ(${depth}px)`;
    });
  };

  const updateCaption = () => {
    const normalized = ((-rotation % 360) + 360) % 360;
    const nextIndex = Math.round(normalized / step) % items.length;
    if (nextIndex === activeIndex) return;
    activeIndex = nextIndex;
    title.textContent = items[activeIndex][1];
    meta.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')} — ${items[activeIndex][2]}`;
  };

  const animate = () => {
    if (!dragging && !reduced) {
      targetRotation += velocity;
      velocity += (-0.045 - velocity) * 0.008;
    }
    rotation += (targetRotation - rotation) * (dragging ? 0.45 : 0.12);
    ring.style.transform = `translate(-50%, -50%) rotateX(-7deg) rotateY(${rotation}deg)`;
    updateCaption();
    requestAnimationFrame(animate);
  };

  const start = event => {
    isPointerDown = true;
    dragging = false;
    moved = false;
    startX = event.clientX;
    startY = event.clientY;
    previousX = event.clientX;
    previousTime = performance.now();
    downTargetCard = event.target.closest?.('.certificate-carousel-card');
  };

  const move = event => {
    if (!isPointerDown) return;
    const now = performance.now();
    const distX = event.clientX - startX;
    const distY = event.clientY - startY;

    if (!dragging && Math.hypot(distX, distY) > 6) {
      dragging = true;
      moved = true;
      shell.classList.add('is-dragging');
      try {
        shell.setPointerCapture?.(event.pointerId);
      } catch (_) {}
    }

    if (dragging) {
      const delta = event.clientX - previousX;
      targetRotation += delta * 0.24;
      velocity = (delta / Math.max(8, now - previousTime)) * 1.8;
      previousX = event.clientX;
      previousTime = now;
    }
  };

  const end = event => {
    if (!isPointerDown) return;
    isPointerDown = false;
    if (dragging) {
      dragging = false;
      shell.classList.remove('is-dragging');
      try {
        shell.releasePointerCapture?.(event.pointerId);
      } catch (_) {}
      if (reduced) targetRotation = Math.round(targetRotation / step) * step;
    }
  };

  shell.addEventListener('pointerdown', start);
  shell.addEventListener('pointermove', move);
  shell.addEventListener('pointerup', end);
  shell.addEventListener('pointercancel', end);

  shell.addEventListener('wheel', event => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    event.preventDefault();
    targetRotation -= event.deltaX * 0.08;
  }, { passive: false });

  // Handle card click and direct redirection to certificate
  shell.addEventListener('click', event => {
    if (moved) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    const card = (event.target && event.target.closest) ? event.target.closest('.certificate-carousel-card') : downTargetCard;
    if (card && card.href) {
      event.preventDefault();
      window.location.href = card.href;
    }
  });

  shell.addEventListener('mouseenter', () => {
    if (!dragging) velocity *= 0.2;
  });

  addEventListener('resize', positionCards, { passive: true });
  positionCards();
  updateCaption();
  animate();
})();
