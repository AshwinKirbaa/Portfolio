(() => {
  const shell = document.querySelector('[data-certificate-carousel]');
  if (!shell) return;
  const items = [
    ['kalam-render-rush-first-place.png', 'Render Rush — First Place', 'Kalam 2026'], ['hacksprint-2026.png', 'HackSprint ’26', '24-hour Hackathon'], ['ibm-bob-2-hackathon.png', 'IBM BoB 2.0', 'Agentic AI Build'], ['hack-in-hills-top-500.png', 'Hack in Hills', 'Top 500 Builder'], ['hackday-1.png', 'HackDay 1.0', 'Rapid Prototyping'], ['promptwars-gdg-cit.png', 'PromptWars × GDG CIT', 'AI Prototype'], ['hackerrank-orchestrate-rank-1134.png', 'HackerRank Orchestrate', 'Final Rank #1,134'], ['hackerrank-frontend-react.png', 'Frontend Developer', 'React Certification'], ['ijrti-publication.png', 'TwinEval AI', 'IJRTI Publication'], ['nptel-cloud-computing-elite.png', 'Cloud Computing', 'NPTEL Elite'], ['gemini-quiz-war.png', 'Gemini Quiz War', 'Participation']
  ];
  const ring = shell.querySelector('.certificate-carousel-ring');
  const title = shell.querySelector('[data-carousel-title]');
  const meta = shell.querySelector('[data-carousel-meta]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const step = 360 / items.length;
  let rotation = 0, targetRotation = 0, velocity = reduced ? 0 : -0.045;
  let dragging = false, moved = false, previousX = 0, previousTime = 0, activeIndex = -1;
  const radius = () => { const width = innerWidth <= 720 ? 160 : 220; return Math.max(245, Math.min(430, (width + 25) * items.length / (2 * Math.PI))); };
  items.forEach(([src, itemTitle], index) => { const card = document.createElement('a'); card.className = 'certificate-carousel-card'; card.href = 'certificates.html'; card.setAttribute('aria-label', `${itemTitle} — view certificate archive`); card.dataset.index = String(index); card.innerHTML = `<img src="assets/certificates/${src}" alt="${itemTitle} certificate" loading="lazy">`; ring.append(card); });
  const cards = [...ring.children];
  const positionCards = () => { const depth = radius(); cards.forEach((card, index) => { card.style.transform = `rotateY(${index * step}deg) translateZ(${depth}px)`; }); };
  const updateCaption = () => { const normalized = ((-rotation % 360) + 360) % 360; const nextIndex = Math.round(normalized / step) % items.length; if (nextIndex === activeIndex) return; activeIndex = nextIndex; title.textContent = items[activeIndex][1]; meta.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')} — ${items[activeIndex][2]}`; };
  const animate = () => { if (!dragging && !reduced) { targetRotation += velocity; velocity += (-0.045 - velocity) * 0.008; } rotation += (targetRotation - rotation) * (dragging ? 0.45 : 0.12); ring.style.transform = `translate(-50%, -50%) rotateX(-7deg) rotateY(${rotation}deg)`; updateCaption(); requestAnimationFrame(animate); };
  const start = event => { dragging = true; moved = false; previousX = event.clientX; previousTime = performance.now(); shell.classList.add('is-dragging'); shell.setPointerCapture?.(event.pointerId); };
  const move = event => { if (!dragging) return; const now = performance.now(); const delta = event.clientX - previousX; if (Math.abs(delta) > 1) moved = true; targetRotation += delta * .24; velocity = delta / Math.max(8, now - previousTime) * 1.8; previousX = event.clientX; previousTime = now; };
  const end = () => { if (!dragging) return; dragging = false; shell.classList.remove('is-dragging'); if (reduced) targetRotation = Math.round(targetRotation / step) * step; };
  shell.addEventListener('pointerdown', start); shell.addEventListener('pointermove', move); shell.addEventListener('pointerup', end); shell.addEventListener('pointercancel', end);
  shell.addEventListener('wheel', event => { if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return; event.preventDefault(); targetRotation -= event.deltaX * .08; }, { passive: false });
  shell.addEventListener('click', event => { if (moved) event.preventDefault(); }, true);
  shell.addEventListener('mouseenter', () => { if (!dragging) velocity *= .2; });
  addEventListener('resize', positionCards, { passive: true });
  positionCards(); updateCaption(); animate();
})();
