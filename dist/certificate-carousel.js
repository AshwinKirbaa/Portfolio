(() => {
  const mount = document.querySelector('[data-certificate-carousel]');
  if (!mount) return;

  const CERTIFICATE_ITEMS = [
    {
      src: 'assets/certificates/kalam-render-rush-first-place.png',
      alt: 'Render Rush First Place Certificate',
      title: 'Render Rush — First Place',
      subtitle: 'Kalam 2026 · Sri Shakthi',
      anchor: 'render-rush'
    },
    {
      src: 'assets/certificates/hacksprint-2026.png',
      alt: 'HackSprint 2026 24-hour Hackathon Certificate',
      title: 'HackSprint ’26',
      subtitle: '24-hour AI Hackathon',
      anchor: 'hacksprint-26'
    },
    {
      src: 'assets/certificates/ibm-bob-2-hackathon.png',
      alt: 'IBM BoB 2.0 Hackathon Completion Certificate',
      title: 'IBM BoB 2.0',
      subtitle: 'Agentic AI Solution Build',
      anchor: 'ibm-bob-2'
    },
    {
      src: 'assets/certificates/hack-in-hills-top-500.png',
      alt: 'Hack in Hills 2026 Top 500 Builder Pass',
      title: 'Hack in Hills',
      subtitle: 'Top 500 Builder Pass',
      anchor: 'hack-in-hills'
    },
    {
      src: 'assets/certificates/hackday-1.png',
      alt: 'HackDay 1.0 Rapid Prototyping Certificate',
      title: 'HackDay 1.0',
      subtitle: '8-Hour Rapid Prototyping',
      anchor: 'hackday-1'
    },
    {
      src: 'assets/certificates/promptwars-gdg-cit.png',
      alt: 'PromptWars GDG on Campus CIT Certificate',
      title: 'PromptWars × GDG CIT',
      subtitle: 'Antigravity AI Prototype',
      anchor: 'promptwars'
    },
    {
      src: 'assets/certificates/hackerrank-orchestrate-rank-1134.png',
      alt: 'HackerRank Orchestrate Rank 1134 Certificate',
      title: 'HackerRank Orchestrate',
      subtitle: 'Final Rank #1,134 · AI Agent',
      anchor: 'hackerrank-orchestrate'
    },
    {
      src: 'assets/certificates/hackerrank-frontend-react.png',
      alt: 'HackerRank Frontend Developer React Certificate',
      title: 'Frontend Developer',
      subtitle: 'React Role Certification',
      anchor: 'frontend-react'
    },
    {
      src: 'assets/certificates/ijrti-publication.png',
      alt: 'TwinEval AI IJRTI Certificate of Publication',
      title: 'TwinEval AI',
      subtitle: 'IJRTI Paper ID: IJRTI2610875',
      anchor: 'twineval-ijrti'
    },
    {
      src: 'assets/certificates/nptel-cloud-computing-elite.png',
      alt: 'NPTEL Cloud Computing Elite Certificate',
      title: 'Cloud Computing',
      subtitle: 'NPTEL Elite · 12 Weeks IIT',
      anchor: 'nptel-cloud'
    },
    {
      src: 'assets/certificates/gemini-quiz-war.png',
      alt: 'Gemini Quiz War Certificate',
      title: 'Gemini Quiz War',
      subtitle: 'DecodeP Participation',
      anchor: 'gemini-quiz-war'
    }
  ];

  const PRESETS = {
    cylinder: {
      axis: 'y',
      tilt: -5,
      perspective: 2000,
      curve: 0,
      spread: 1.15,
      inward: false,
      billboard: false,
      backfaces: true,
      window: 0
    },
    orbit: {
      axis: 'y',
      tilt: -12,
      perspective: 1600,
      curve: 0,
      spread: 1.35,
      inward: false,
      billboard: true,
      backfaces: false,
      window: 0
    },
    wheel: {
      axis: 'x',
      tilt: 0,
      perspective: 1800,
      curve: 0,
      spread: 1,
      inward: false,
      billboard: false,
      backfaces: true,
      window: 1.7
    },
    panorama: {
      axis: 'y',
      tilt: 0,
      perspective: 1800,
      curve: 0,
      spread: 1.15,
      inward: false,
      billboard: false,
      backfaces: true,
      window: 0
    }
  };

  const SPRING = 120;
  const SETTLE_SPEED = 8;
  const CAPTION_SPACE = 76;
  const TO_RAD = Math.PI / 180;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const wrap = degrees => ((((degrees + 180) % 360) + 360) % 360) - 180;

  const rotateX = (p, degrees) => {
    const r = degrees * TO_RAD;
    const c = Math.cos(r);
    const s = Math.sin(r);
    return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c];
  };

  const rotateY = (p, degrees) => {
    const r = degrees * TO_RAD;
    const c = Math.cos(r);
    const s = Math.sin(r);
    return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c];
  };

  function createCircularCarousel(container, config = {}) {
    const {
      items = CERTIFICATE_ITEMS,
      preset = 'cylinder',
      cardWidth = 270,
      aspectRatio = 1.42,
      gap = 26,
      speed = 12,
      autoplay = 'drift',
      direction = 'left',
      draggable = true,
      momentum = 0.65,
      snap = true,
      pauseOnHover = true,
      parallax = 0.25,
      depthFade = 0.52,
      fadeColor = '#121110',
      innerShade = 0.5,
      cornerRadius = 12,
      captions = true,
      onItemClick = (item) => {
        if (item.anchor) {
          window.location.href = `certificates.html#${item.anchor}`;
        }
      }
    } = config;

    const list = items.slice();
    const count = list.length;
    const layout = PRESETS[preset] || PRESETS.cylinder;
    const axis = layout.axis;
    const tiltValue = layout.tilt;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    const cardW = Math.max(40, cardWidth);
    const cardH = cardW / clamp(aspectRatio, 0.2, 5);
    const along = cardW;
    const step = 360 / count;

    // Radius calculation
    const n = Math.max(count, 3);
    const pitch = (along + gap) * layout.spread;
    const chord = pitch / (2 * Math.sin(Math.PI / n));
    const radius = Math.max(chord, along * 0.75);

    const settings = {
      count,
      step,
      radius,
      layout,
      axis,
      tilt: tiltValue,
      perspective: layout.perspective,
      cardW,
      cardH,
      autoplay: reduced ? 'off' : autoplay,
      speed,
      draggable,
      momentum: clamp(momentum, 0, 1),
      snap,
      pauseOnHover,
      parallax: reduced ? 0 : clamp(parallax, 0, 1),
      depthFade: clamp(depthFade, 0, 1),
      captions,
      reduced
    };

    const directionSign = direction === 'right' ? 1 : -1;

    const state = {
      angle: 0,
      velocity: 0,
      target: null,
      dir: directionSign,
      drag: false,
      hover: false,
      pointer: { inside: false, x: 0, y: 0 },
      yaw: 0,
      pitch: 0,
      holdUntil: 0,
      fit: 1,
      shift: 0,
      last: 0,
      active: 0,
      raf: 0,
      visible: true
    };

    // DOM Construction
    const root = document.createElement('div');
    root.className = 'circular-carousel';
    root.setAttribute('role', 'region');
    root.setAttribute('aria-roledescription', 'carousel');
    root.setAttribute('aria-label', 'Certificate carousel');
    root.setAttribute('tabindex', '0');
    root.setAttribute('data-axis', axis);
    root.setAttribute('data-shape', preset);
    if (draggable) root.setAttribute('data-draggable', '');
    root.style.setProperty('--cc-fade', fadeColor);
    root.style.setProperty('--cc-radius', `${Math.max(0, cornerRadius)}px`);
    root.style.setProperty('--cc-inner', (1 - clamp(innerShade, 0, 1)).toFixed(3));

    const view = document.createElement('div');
    view.className = 'circular-carousel__view';

    const stage = document.createElement('div');
    stage.className = 'circular-carousel__stage';

    const camera = document.createElement('div');
    camera.className = 'circular-carousel__camera';

    const ring = document.createElement('div');
    ring.className = 'circular-carousel__ring';

    const cardElements = [];

    list.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'circular-carousel__card';
      card.setAttribute('data-cc-index', String(index));
      card.setAttribute('role', 'group');
      card.setAttribute('aria-roledescription', 'slide');
      card.setAttribute('aria-label', `${item.title || item.alt || `Certificate ${index + 1}`}, ${index + 1} of ${count}`);
      card.style.cssText = `width: ${cardW}px; height: ${cardH}px; left: ${-cardW / 2}px; top: ${-cardH / 2}px;`;

      card.innerHTML = `
        <div class="circular-carousel__frame">
          <img class="circular-carousel__photo" src="${item.src}" alt="${item.alt || ''}" draggable="false" loading="eager">
          <div class="circular-carousel__shade"></div>
        </div>
      `;

      ring.appendChild(card);
      cardElements.push(card);
    });

    camera.appendChild(ring);
    stage.appendChild(camera);
    view.appendChild(stage);
    root.appendChild(view);

    // Captions & Digits
    let titleTextEl = null;
    let subtitleEl = null;
    let reelElements = [];

    if (captions) {
      const captionEl = document.createElement('div');
      captionEl.className = 'circular-carousel__caption';
      captionEl.setAttribute('aria-hidden', 'true');

      const titleWrap = document.createElement('span');
      titleWrap.className = 'circular-carousel__title';

      titleTextEl = document.createElement('span');
      titleTextEl.className = 'circular-carousel__title-text';
      titleTextEl.textContent = list[0].title;

      subtitleEl = document.createElement('span');
      subtitleEl.className = 'circular-carousel__subtitle';
      subtitleEl.textContent = list[0].subtitle || '';

      titleWrap.appendChild(titleTextEl);
      titleWrap.appendChild(subtitleEl);

      const countWrap = document.createElement('span');
      countWrap.className = 'circular-carousel__count';

      const digitsSpan = document.createElement('span');
      digitsSpan.className = 'circular-carousel__digits';

      ['0', '1'].forEach(() => {
        const digitBox = document.createElement('span');
        digitBox.className = 'circular-carousel__digit';
        const reel = document.createElement('span');
        reel.className = 'circular-carousel__reel';
        for (let d = 0; d <= 9; d++) {
          const s = document.createElement('span');
          s.textContent = String(d);
          reel.appendChild(s);
        }
        digitBox.appendChild(reel);
        digitsSpan.appendChild(digitBox);
        reelElements.push(reel);
      });

      const slash = document.createElement('span');
      slash.className = 'circular-carousel__slash';
      slash.textContent = '/';

      const totalSpan = document.createElement('span');
      totalSpan.textContent = String(count).padStart(2, '0');

      countWrap.appendChild(digitsSpan);
      countWrap.appendChild(slash);
      countWrap.appendChild(totalSpan);

      const ctaPill = document.createElement('button');
      ctaPill.className = 'circular-carousel__cta-pill';
      ctaPill.type = 'button';
      ctaPill.textContent = 'OPEN CERTIFICATE ARCHIVE ↗';
      ctaPill.addEventListener('click', (e) => {
        e.stopPropagation();
        const activeItem = list[state.active] || list[0];
        onItemClick(activeItem, state.active);
      });

      captionEl.appendChild(titleWrap);
      captionEl.appendChild(countWrap);
      captionEl.appendChild(ctaPill);
      root.appendChild(captionEl);
    }

    container.innerHTML = '';
    container.appendChild(root);

    const updateDigits = value => {
      const str = String(value).padStart(2, '0');
      if (reelElements[0]) reelElements[0].style.transform = `translateY(${-Number(str[0]) * 10}%)`;
      if (reelElements[1]) reelElements[1].style.transform = `translateY(${-Number(str[1]) * 10}%)`;
    };

    const updateCaption = index => {
      const item = list[index];
      if (!item) return;
      if (titleTextEl) titleTextEl.textContent = item.title || item.alt;
      if (subtitleEl) subtitleEl.textContent = item.subtitle || '';
      updateDigits(index + 1);
    };

    // Responsive scaling
    const measure = () => {
      const rect = root.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const room = settings.captions ? CAPTION_SPACE : 0;
      const width = rect.width * 0.94;
      const height = (rect.height - room) * 0.92;
      const P = settings.perspective;

      // Project corners of front cards to calculate fit
      let minX = -width / 2;
      let maxX = width / 2;
      let minY = -cardH / 2;
      let maxY = cardH / 2;

      const corners = [
        [-cardW / 2, -cardH / 2],
        [cardW / 2, -cardH / 2],
        [-cardW / 2, cardH / 2],
        [cardW / 2, cardH / 2]
      ];

      for (let a = -120; a <= 120; a += 30) {
        for (const [cx, cy] of corners) {
          let p = rotateX(rotateY([cx, cy, settings.radius], a), settings.tilt);
          p = [p[0], p[1], p[2] - settings.radius];
          if (p[2] >= P * 0.95) continue;
          const k = P / (P - p[2]);
          minX = Math.min(minX, p[0] * k);
          maxX = Math.max(maxX, p[0] * k);
          minY = Math.min(minY, p[1] * k);
          maxY = Math.max(maxY, p[1] * k);
        }
      }

      const spanX = Math.max(maxX - minX, 1);
      const spanY = Math.max(maxY - minY, 1);
      const fit = Math.min(1, width / spanX, height / spanY);
      state.fit = fit;
      state.shift = -((minY + maxY) / 2) * fit - room / 2;
      stage.style.perspective = `${P}px`;
      stage.style.transform = `translate3d(0, ${state.shift}px, 0) scale(${fit})`;
    };

    const nearest = angle => Math.round(angle / settings.step) * settings.step;

    const advance = (dt, now) => {
      const paused = state.drag || now < state.holdUntil;
      const hoverFactor = (state.hover && settings.pauseOnHover) ? 0.22 : 1;
      const cruise = (settings.autoplay === 'drift' && !paused) ? settings.speed * state.dir * hoverFactor : 0;

      if (state.drag) {
        // Direct tracking while dragging
      } else if (state.target !== null) {
        let remaining = dt;
        const damping = 2 * Math.sqrt(SPRING);
        while (remaining > 0) {
          const h = Math.min(remaining, 1 / 240);
          const accel = SPRING * (state.target - state.angle) - damping * state.velocity;
          state.velocity += accel * h;
          state.angle += state.velocity * h;
          remaining -= h;
        }
        if (Math.abs(state.target - state.angle) < 0.005 && Math.abs(state.velocity) < 0.04) {
          state.angle = state.target;
          state.velocity = 0;
          state.target = null;
        }
      } else {
        const tau = 0.18 + settings.momentum * 1.5;
        state.velocity += (cruise - state.velocity) * (1 - Math.exp(-dt / tau));
        state.angle += state.velocity * dt;
        if (cruise === 0 && settings.snap && Math.abs(state.velocity) < SETTLE_SPEED) {
          state.target = nearest(state.angle);
        }
      }

      const ease = 1 - Math.exp(-dt / 0.35);
      const aimYaw = state.pointer.inside ? state.pointer.x * settings.parallax * 9 : 0;
      const aimPitch = state.pointer.inside ? -state.pointer.y * settings.parallax * 6 : 0;
      state.yaw += (aimYaw - state.yaw) * ease;
      state.pitch += (aimPitch - state.pitch) * ease;
    };

    const render = () => {
      const angle = state.angle;
      const R = settings.radius;

      camera.style.transform = `translate3d(0, 0, ${-R}px) rotateX(${settings.tilt + state.pitch}deg) rotateY(${state.yaw}deg)`;
      ring.style.transform = `rotateY(${angle}deg)`;

      for (let index = 0; index < settings.count; index++) {
        const card = cardElements[index];
        if (!card) continue;
        const base = index * settings.step;
        card.style.transform = `rotateY(${base}deg) translateZ(${R}px)`;

        const world = wrap(base + angle);
        const facing = Math.cos(world * TO_RAD);
        const fade = settings.depthFade * Math.pow((1 - facing) / 2, 1.25);
        card.style.setProperty('--cc-depth', fade.toFixed(3));
      }

      const activeIndex = ((Math.round(-state.angle / settings.step) % settings.count) + settings.count) % settings.count || 0;
      if (activeIndex !== state.active) {
        state.active = activeIndex;
        updateCaption(activeIndex);
      }
    };

    const frame = now => {
      state.raf = 0;
      const dt = state.last ? Math.min((now - state.last) / 1000, 0.05) : 1 / 60;
      state.last = now;

      advance(dt, now);
      render();

      if (state.visible && !document.hidden) {
        state.raf = requestAnimationFrame(frame);
      } else {
        state.last = 0;
      }
    };

    const wake = () => {
      if (!state.raf && state.visible && !document.hidden) {
        state.raf = requestAnimationFrame(frame);
      }
    };

    const focusIndex = index => {
      let target = -index * settings.step;
      target += 360 * Math.round((state.angle - target) / 360);
      state.target = target;
      state.holdUntil = performance.now() + 2600;
      wake();
    };

    const updatePointer = event => {
      const rect = root.getBoundingClientRect();
      state.pointer.x = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
      state.pointer.y = clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
    };

    // Fluid Drag & Interaction System
    let isDown = false;
    let startX = 0;
    let startY = 0;
    let previousX = 0;
    let previousTime = 0;
    let hasDragged = false;

    const onPointerDown = event => {
      if (event.button !== 0 && event.pointerType === 'mouse') return;
      isDown = true;
      hasDragged = false;
      startX = event.clientX;
      startY = event.clientY;
      previousX = event.clientX;
      previousTime = performance.now();
      state.drag = false;
      state.target = null;
      state.velocity = 0;
    };

    const onPointerMove = event => {
      if (event.pointerType === 'mouse') {
        state.pointer.inside = true;
        updatePointer(event);
      }

      if (!isDown) return;

      const dist = Math.hypot(event.clientX - startX, event.clientY - startY);

      if (dist > 8) {
        hasDragged = true;
        state.drag = true;
        root.setAttribute('data-dragging', '');
      }

      if (state.drag) {
        const deltaX = event.clientX - previousX;
        const perPixel = 180 / (Math.PI * settings.radius * state.fit);
        state.angle += deltaX * perPixel * 1.05;
        const now = performance.now();
        const dt = Math.max(8, now - previousTime);
        state.velocity = (deltaX / dt) * 1000 * 0.22;
        previousX = event.clientX;
        previousTime = now;
        render();
      }
    };

    const onPointerUp = () => {
      if (!isDown) return;
      isDown = false;
      root.removeAttribute('data-dragging');

      if (state.drag) {
        state.drag = false;
        if (Math.abs(state.velocity) > 50) {
          state.dir = Math.sign(state.velocity);
        }
        if (settings.snap) {
          const tau = 0.18 + settings.momentum * 1.5;
          state.target = Math.round((state.angle + state.velocity * tau * 0.45) / settings.step) * settings.step;
        }
        state.holdUntil = performance.now() + 2200;
        setTimeout(() => { hasDragged = false; }, 80);
      } else {
        hasDragged = false;
      }
      wake();
    };

    root.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });

    root.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse') return;
      state.hover = true;
    });

    root.addEventListener('pointerleave', event => {
      if (event.pointerType === 'mouse') {
        state.hover = false;
        state.pointer.inside = false;
      }
    });

    root.addEventListener('wheel', event => {
      if (Math.abs(event.deltaX) < 3) return;
      event.preventDefault();
      const perPixel = 180 / (Math.PI * settings.radius * state.fit);
      state.target = null;
      state.angle -= event.deltaX * perPixel * 1.15;
      state.velocity = -event.deltaX * perPixel * 22;
      state.holdUntil = performance.now() + 1800;
      if (settings.snap) {
        clearTimeout(state.wheelTimer);
        state.wheelTimer = setTimeout(() => {
          state.target = nearest(state.angle + state.velocity * 0.1);
          wake();
        }, 120);
      }
      wake();
    }, { passive: false });

    root.addEventListener('click', event => {
      if (hasDragged) {
        event.preventDefault();
        event.stopPropagation();
        hasDragged = false;
        return;
      }
      const card = event.target.closest?.('.circular-carousel__card');
      if (card) {
        const index = Number(card.getAttribute('data-cc-index'));
        const item = list[index];
        if (item && item.anchor) {
          onItemClick(item, index);
        }
      }
    });

    root.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        state.target = (state.target ?? nearest(state.angle)) - settings.step;
        state.holdUntil = performance.now() + 2600;
        wake();
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        state.target = (state.target ?? nearest(state.angle)) + settings.step;
        state.holdUntil = performance.now() + 2600;
        wake();
      } else if (event.key === 'Enter' || event.key === ' ') {
        const activeItem = list[state.active];
        if (activeItem) onItemClick(activeItem, state.active);
      } else return;
      event.preventDefault();
    });

    // Observers
    const ro = new ResizeObserver(() => {
      measure();
      render();
    });
    ro.observe(root);

    const io = new IntersectionObserver(([entry]) => {
      state.visible = entry.isIntersecting;
      if (state.visible) wake();
      else cancelAnimationFrame(state.raf);
    });
    io.observe(root);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(state.raf);
      else wake();
    });

    // Start
    measure();
    updateCaption(0);
    root.setAttribute('data-ready', '');
    render();
    wake();
  }

  // Mount with crisp un-sliced certificate configuration
  createCircularCarousel(mount, {
    items: CERTIFICATE_ITEMS,
    preset: 'cylinder',
    cardWidth: 280,
    aspectRatio: 1.42,
    gap: 26,
    speed: 12,
    captions: true,
    onItemClick: (item) => {
      if (item && item.anchor) {
        window.location.href = `certificates.html#${item.anchor}`;
      }
    }
  });
})();
