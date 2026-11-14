(() => {
  const mount = document.querySelector('[data-project-folder-mount]');
  if (!mount) return;

  const TAU = Math.PI * 2;
  const STEP = 1 / 240;
  const MAX_ITEMS = 6;

  const PILE_TURN = [0.5, -1.1, 1.5, -0.7, 1.2, -1.6];
  const BOOK_REST = [
    { x: 0.14, y: -0.004, r: 1.4 },
    { x: 0.115, y: 0.008, r: -1.1 },
    { x: 0.09, y: 0, r: 0.6 }
  ];
  const BOOK_PEEK = [
    { x: 0.27, y: -0.016, r: 4.5 },
    { x: 0.2, y: 0.014, r: 1.2 },
    { x: 0.14, y: 0, r: -1.2 }
  ];
  const FLAP_REST = [
    { x: 0.16, rise: 0, r: 3 },
    { x: -0.17, rise: 0.05, r: -3.5 },
    { x: 0, rise: 0.1, r: 0.5 },
    { x: 0.25, rise: 0.08, r: 5 },
    { x: -0.25, rise: 0.09, r: -5.5 },
    { x: 0.08, rise: 0.12, r: 1.5 }
  ];
  const SPREAD_TURN = [4, -5, 3, -6, 5, -3];
  const SPREAD_DROP = [0.03, -0.04, 0.05, -0.02, 0.04, -0.05];
  const DROP_TURN = [-6, 4, -3, 7, -5, 3];
  const BOOK_ANGLES = { open: -180, receive: -24, peek: -13, rest: 0 };
  const FLAP_ANGLES = { open: -64, receive: -30, peek: -15, rest: 0 };
  const LAYERS = { out: 50, drag: 80, focus: 90 };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const parseColor = (() => {
    const cache = new Map();
    let context = null;
    return value => {
      const key = String(value);
      if (cache.has(key)) return cache.get(key);
      let rgb = [61, 139, 255];
      if (typeof document !== 'undefined') {
        context = context || document.createElement('canvas').getContext('2d', { willReadFrequently: true });
        if (context) {
          context.clearRect(0, 0, 1, 1);
          context.fillStyle = '#3d8bff';
          context.fillStyle = key;
          context.fillRect(0, 0, 1, 1);
          rgb = Array.from(context.getImageData(0, 0, 1, 1).data.slice(0, 3));
        }
      }
      cache.set(key, rgb);
      return rgb;
    };
  })();

  const mixRgb = (rgb, target, amount) => rgb.map((channel, i) => Math.round(channel + (target[i] - channel) * amount));
  const rgbString = rgb => `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  const luma = rgb => (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;

  const multiply = (a, b) => {
    const out = new Array(16);
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 4; row++) {
        out[col * 4 + row] =
          a[row] * b[col * 4] + a[4 + row] * b[col * 4 + 1] + a[8 + row] * b[col * 4 + 2] + a[12 + row] * b[col * 4 + 3];
      }
    }
    return out;
  };

  const chain = (...list) => list.reduce(multiply);
  const move = (x, y, z = 0) => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];
  const stretch = (x, y) => [x, 0, 0, 0, 0, y, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

  const turnX = degrees => {
    const r = (degrees * Math.PI) / 180;
    const c = Math.cos(r);
    const s = Math.sin(r);
    return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
  };

  const turnY = degrees => {
    const r = (degrees * Math.PI) / 180;
    const c = Math.cos(r);
    const s = Math.sin(r);
    return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
  };

  const turnZ = degrees => {
    const r = (degrees * Math.PI) / 180;
    const c = Math.cos(r);
    const s = Math.sin(r);
    return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  };

  const toCss = m => `matrix3d(${m.map(v => (Math.abs(v) < 1e-7 ? 0 : Number(v.toFixed(6)))).join(', ')})`;

  const measureFolder = (book, scale, labelWidth, hasLabel, tabPosition) => {
    const w = (book ? 180 : 224) * scale;
    const h = (book ? 232 : 176) * scale;
    const tabH = 20 * scale;
    const r = 12 * scale;
    const shoulder = tabH * 0.75;
    const frontTop = book ? tabH : tabH + h * 0.3;
    const corners = book ? [0, r, r, 0] : [r, r, r, r];
    const maxTab = w - corners[0] - corners[1] - shoulder * 2 - 10 * scale;
    const tabW = clamp(hasLabel ? labelWidth + 14 * scale + shoulder : w * 0.34, Math.min(w * 0.3, maxTab), maxTab);
    const tabX =
      tabPosition === 'left'
        ? corners[0] + 5 * scale + shoulder
        : tabPosition === 'center'
          ? (w - tabW) / 2
          : w - corners[1] - 5 * scale - shoulder - tabW;
    const docW = book ? w * 0.8 : w * 0.54;
    return {
      book,
      scale,
      w,
      h,
      tabH,
      r,
      shoulder,
      corners,
      tabW,
      tabX,
      frontTop,
      frontH: tabH + h - frontTop,
      docW,
      docH: docW * (book ? 1.28 : 1.22)
    };
  };

  const backPath = g => {
    const { w, h, tabX, tabW, tabH, shoulder } = g;
    const [tl, tr, br, bl] = g.corners;
    const top = tabH;
    const bottom = tabH + h;
    return [
      `M 0 ${top + tl}`,
      `Q 0 ${top} ${tl} ${top}`,
      `L ${tabX - shoulder} ${top}`,
      `C ${tabX} ${top} ${tabX} 0 ${tabX + shoulder} 0`,
      `L ${tabX + tabW - shoulder} 0`,
      `C ${tabX + tabW} 0 ${tabX + tabW} ${top} ${tabX + tabW + shoulder} ${top}`,
      `L ${w - tr} ${top}`,
      `Q ${w} ${top} ${w} ${top + tr}`,
      `L ${w} ${bottom - br}`,
      `Q ${w} ${bottom} ${w - br} ${bottom}`,
      `L ${bl} ${bottom}`,
      `Q 0 ${bottom} 0 ${bottom - bl}`,
      'Z'
    ].join(' ');
  };

  const placeFlap = (rank, count, phase, layout, g, pointer) => {
    const rest = FLAP_REST[rank] ?? FLAP_REST[FLAP_REST.length - 1];
    const floor = g.tabH + g.h - 5 * g.scale - g.docH / 2;
    const mid = (count - 1) / 2;
    if (phase === 'open') {
      const lift = g.tabH - g.h * 0.02;
      if (layout === 'stack') {
        const strip = Math.min(30 * g.scale, (g.h * 0.62) / Math.max(1, count - 1));
        const fit = 1.04 - rank * 0.05;
        return {
          x: g.w / 2,
          y: g.tabH + g.h * 0.1 - rank * strip - (g.docH * (1.04 - fit)) / 2,
          z: -rank * 18 * g.scale,
          r: 0,
          ry: 0,
          s: fit
        };
      }
      const gap = 12 * g.scale;
      const fit = Math.min(0.94, (g.w * 2.3 - gap * (count - 1)) / (count * g.docW));
      const step = g.docW * fit + gap;
      const tidy = layout === 'row';
      return {
        x: g.w / 2 + (rank - mid) * step,
        y: lift + (tidy ? 0 : SPREAD_DROP[rank] * g.h * 0.7),
        z: 0,
        r: tidy ? 0 : SPREAD_TURN[rank] * 0.55,
        ry: 0,
        s: fit
      };
    }
    const part = phase === 'receive' ? 1.7 : phase === 'peek' ? 1.3 : 1;
    const x = g.w / 2 + rest.x * g.w * part;
    if (phase === 'rest') return { x, y: floor - rest.rise * g.h, z: 0, r: rest.r, ry: 0, s: 1 };
    const near = phase === 'peek' && pointer != null ? Math.max(0, 1 - Math.abs(pointer - x) / (g.w * 0.32)) : 0;
    const rise = rest.rise + (phase === 'receive' ? 0.03 : 0.1);
    return { x, y: floor - rise * g.h - near * near * g.h * 0.09, z: 0, r: rest.r * 1.6, ry: 0, s: 1 };
  };

  const projectItems = [
    {
      title: 'SafeBox AI',
      description: 'Adversarial AI testing & security',
      url: 'projects/safebox-ai.html'
    },
    {
      title: 'TwinEval AI',
      description: 'Smart handwritten answer evaluation',
      url: 'projects/twineval-ai.html'
    },
    {
      title: 'Security Camera',
      description: 'Real-time face recognition system',
      url: 'projects/ai-security-camera.html'
    },
    {
      title: 'Gesture Control',
      description: 'Touchless computer interaction',
      url: 'projects/gesture-control.html'
    },
    {
      title: 'Dexget',
      description: 'Local-first desktop assistant',
      url: 'projects/dexget.html'
    }
  ];

  function createFolderComponent(container, options = {}) {
    const {
      mode = 'flap',
      variant = 'solid',
      color = '#ed3b24',
      paperColor = '#ffffff',
      label = 'PROJECTS',
      tabPosition = 'right',
      layout = 'spread',
      size = 1.3,
      openOn = 'click',
      defaultOpen = false,
      draggable = true,
      zoomOnClick = false,
      peek = true,
      intro = true,
      tilt = 0.5,
      bounce = 0.4,
      speed = 1,
      closeOnOutsideClick = true,
      theme = 'dark'
    } = options;

    const entries = projectItems.slice(0, MAX_ITEMS);
    const count = entries.length;
    let isOpen = defaultOpen;
    const book = mode === 'book';

    // Measure label width
    const measureSpan = document.createElement('span');
    measureSpan.className = 'folder-tab-text folder-measure';
    measureSpan.textContent = label;
    document.body.appendChild(measureSpan);
    const labelWidth = measureSpan.offsetWidth;
    document.body.removeChild(measureSpan);

    const scale = Math.max(0.3, Number(size) || 1);
    const g = measureFolder(book, scale, labelWidth, Boolean(label), tabPosition);
    const total = g.tabH + g.h;

    const rgb = parseColor(color);
    const paper = parseColor(paperColor);
    const backTone = mixRgb(rgb, [0, 0, 0], 0.16);
    const insideTop = rgbString(mixRgb(rgb, [0, 0, 0], 0.08));
    const insideBottom = rgbString(backTone);

    const vars = {
      '--folder-rgb': rgb.join(', '),
      '--folder-base': rgbString(rgb),
      '--folder-front-top': rgbString(mixRgb(rgb, [255, 255, 255], 0.12)),
      '--folder-front-bottom': rgbString(mixRgb(rgb, [0, 0, 0], 0.06)),
      '--folder-inside-top': insideTop,
      '--folder-inside-bottom': insideBottom,
      '--folder-tab-ink': luma(backTone) > 0.6 ? 'rgba(0, 0, 0, 0.72)' : 'rgba(255, 255, 255, 0.92)',
      '--folder-paper': rgbString(paper),
      '--folder-paper-ink': rgbString(mixRgb(paper, [0, 0, 0], 0.11)),
      '--folder-paper-ink-strong': rgbString(mixRgb(paper, [0, 0, 0], 0.28)),
      '--folder-paper-text': rgbString(mixRgb(paper, [0, 0, 0], 0.72)),
      '--folder-w': `${g.w}px`,
      '--folder-h': `${g.h}px`,
      '--folder-tab-h': `${g.tabH}px`,
      '--folder-front-y': `${g.frontTop}px`,
      '--folder-front-h': `${g.frontH}px`,
      '--folder-r': `${g.r}px`,
      '--folder-front-radius': book ? `0 ${g.r}px ${g.r}px 0` : `${g.r}px`,
      '--folder-doc-w': `${g.docW}px`,
      '--folder-doc-h': `${g.docH}px`,
      '--folder-depth': `${Math.round(Math.max(g.w, g.h) * 5)}px`,
      '--folder-scale': scale
    };

    const root = document.createElement('div');
    root.className = 'folder-root';
    root.setAttribute('data-mode', book ? 'book' : 'flap');
    root.setAttribute('data-variant', variant);
    root.setAttribute('data-theme', theme);
    if (draggable) root.setAttribute('data-draggable', '');
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));

    const stage = document.createElement('div');
    stage.className = 'folder-stage';
    stage.setAttribute('role', 'button');
    stage.setAttribute('tabindex', '0');
    stage.setAttribute('aria-expanded', String(isOpen));
    stage.setAttribute('aria-label', `${label} folder`);

    const ground = document.createElement('span');
    ground.className = 'folder-layer folder-ground';
    ground.setAttribute('aria-hidden', 'true');

    const shape = backPath(g);
    const back = document.createElement('div');
    back.className = 'folder-layer folder-back';
    back.setAttribute('aria-hidden', 'true');
    back.innerHTML = `
      <div class="folder-back-fill" style="clip-path: path('${shape}')"></div>
      <svg class="folder-back-rim" width="${g.w}" height="${total}" viewBox="0 0 ${g.w} ${total}">
        <path class="folder-focus" d="${shape}"></path>
      </svg>
      <span class="folder-tab-text" style="left: ${g.tabX}px; width: ${g.tabW}px;">${label}</span>
    `;

    const itemElements = [];
    entries.forEach((item, index) => {
      const el = document.createElement('a');
      el.className = 'folder-layer folder-item';
      el.setAttribute('data-folder-item', String(index));
      el.setAttribute('href', item.url);
      el.setAttribute('tabindex', '-1');
      el.innerHTML = `
        <div class="folder-doc">
          <span class="folder-doc-title">${item.title}</span>
          <span class="folder-doc-text">${item.description}</span>
          <span class="folder-doc-line" style="width: 92%"></span>
          <span class="folder-doc-line" style="width: 84%"></span>
          <span class="folder-doc-block"></span>
          <span class="folder-doc-line" style="width: 78%"></span>
        </div>
      `;
      itemElements.push(el);
    });

    const front = document.createElement('div');
    front.className = 'folder-layer folder-front';
    front.setAttribute('data-face', 'outer');
    front.setAttribute('aria-hidden', 'true');
    front.innerHTML = `<div class="folder-face folder-face-outer"></div>`;

    stage.appendChild(ground);
    stage.appendChild(back);
    itemElements.forEach(el => stage.appendChild(el));
    stage.appendChild(front);
    root.appendChild(stage);
    container.innerHTML = '';
    container.appendChild(root);

    // Physics Engine Implementation
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const spring = value => ({ value, velocity: 0 });

    const state = {
      raf: 0,
      last: 0,
      ready: false,
      hovered: false,
      pressed: false,
      pointerX: 0,
      pointerY: 0,
      deskX: 0,
      deskY: 0,
      hoveredItem: -1,
      phase: 'rest',
      previous: 'rest',
      changedAt: 0,
      front: spring(0),
      rx: spring(0),
      ry: spring(0),
      lift: spring(0),
      squash: spring(1),
      items: [],
      focus: -1,
      drag: null,
      receiving: false,
      receiveUntil: 0,
      suppressClick: false,
      dropCount: 0,
      intro: { phase: 'done', start: 0, opening: false },
      anchor: spring(0),
      appear: 1
    };

    while (state.items.length < count) {
      state.items.push({
        x: spring(0),
        y: spring(0),
        z: spring(0),
        r: spring(0),
        ry: spring(0),
        s: spring(1),
        hover: spring(0),
        mx: spring(0),
        my: spring(0),
        alpha: spring(1),
        place: 'inside',
        rank: 0,
        layer: 'inside',
        elevated: false,
        insertUntil: 0,
        insertFrom: null,
        outX: 0,
        outY: 0,
        outR: 0,
        outS: 1,
        outOrder: 0,
        localX: 0,
        localY: 0,
        fresh: true
      });
    }

    const integrate = (item, target, omega, zeta, dt) => {
      const k = omega * omega;
      const d = 2 * zeta * omega;
      const steps = Math.max(1, Math.ceil(dt / STEP));
      const step = dt / steps;
      for (let i = 0; i < steps; i++) {
        item.velocity += (k * (target - item.value) - d * item.velocity) * step;
        item.value += item.velocity * step;
      }
      return Math.abs(target - item.value) > 0.01 || Math.abs(item.velocity) > 0.01;
    };

    const snap = (item, value) => {
      item.value = value;
      item.velocity = 0;
    };

    const toDesk = (clientX, clientY) => {
      const box = root.getBoundingClientRect();
      const kx = root.offsetWidth / (box.width || 1);
      const ky = root.offsetHeight / (box.height || 1);
      return [(clientX - box.left) * kx, (clientY - box.top) * ky];
    };

    const phaseOf = (open, time) => {
      if (open) return 'open';
      if (state.receiving || time < state.receiveUntil) return 'receive';
      if (peek && state.hovered && !state.drag?.active) return 'peek';
      return 'rest';
    };

    const place = (rank, inside, p) => {
      const pointer = state.hovered ? ((state.pointerX + 1) / 2) * g.w : null;
      return placeFlap(rank, inside, p, layout, g, pointer);
    };

    const frame = now => {
      state.raf = 0;
      const time = now / 1000;
      const dt = state.last ? Math.min(0.05, (now - state.last) / 1000) : 1 / 60;
      state.last = now;
      const zeta = reduce ? 1 : 1 - 0.72 * bounce;
      const frontOmega = TAU * 2 * speed;
      const itemOmega = TAU * 2.1 * speed;
      const soft = TAU * 1.6 * speed;
      const currentPhase = phaseOf(isOpen, time);

      if (currentPhase !== state.phase) {
        state.previous = state.phase;
        state.phase = currentPhase;
        state.changedAt = now;
      }
      const elapsed = (now - state.changedAt) / 1000;
      let busy = time < state.receiveUntil;

      const ranks = [];
      state.items.forEach((item, index) => {
        if (item.place === 'inside') ranks.push(index);
      });
      const inside = ranks.length;
      ranks.forEach((index, rank) => {
        state.items[index].rank = rank;
      });

      const frontTarget = FLAP_ANGLES[currentPhase];

      if (!state.ready) {
        state.ready = true;
        snap(state.front, frontTarget);
        state.items.forEach(item => {
          const slot = place(item.rank, inside, currentPhase);
          snap(item.x, slot.x);
          snap(item.y, slot.y);
          snap(item.z, slot.z);
          snap(item.r, slot.r);
          snap(item.s, slot.s);
          snap(item.alpha, 1);
          item.fresh = false;
        });
      }

      busy = integrate(state.front, frontTarget, frontOmega, zeta, dt) || busy;

      const engaged = state.hovered && !reduce;
      busy = integrate(state.rx, engaged ? -state.pointerY * 8 * tilt : 0, soft, 1, dt) || busy;
      busy = integrate(state.ry, engaged ? state.pointerX * 10 * tilt : 0, soft, 1, dt) || busy;
      busy = integrate(state.lift, state.hovered && currentPhase !== 'open' ? 1 : 0, soft, 1, dt) || busy;
      busy = integrate(state.squash, state.pressed ? 0.975 : 1, TAU * 3.2, 0.6, dt) || busy;

      const opening = currentPhase === 'open' && state.previous !== 'open';
      const hover = state.hoveredItem;
      const hovering = hover >= 0 && state.items[hover] ? state.items[hover] : null;
      const lead = hovering && hovering.place === 'inside' && currentPhase === 'open' ? place(hovering.rank, inside, 'open') : null;

      state.items.forEach((item, index) => {
        if (item.fresh) {
          const start = place(item.rank, inside, 'rest');
          snap(item.x, start.x);
          snap(item.y, start.y);
          snap(item.r, start.r);
          item.fresh = false;
        }

        const delay = reduce ? 0 : opening ? (0.05 + item.rank * 0.045) / speed : (item.rank * 0.03) / speed;
        const active = elapsed >= delay ? currentPhase : state.previous;
        let target = place(item.rank, inside, active);
        let lift = 0;
        let magnet = false;

        if (lead && active === 'open') {
          if (hover === index) {
            target = { ...target, y: target.y - 6 * g.scale, r: target.r * 0.2, s: target.s * 1.05 };
            lift = 1;
            magnet = true;
          } else {
            const distance = target.x - lead.x;
            target = {
              ...target,
              x: target.x + Math.sign(distance) * 12 * g.scale * Math.max(0, 1 - Math.abs(distance) / (g.w * 1.1))
            };
            lift = 0.2;
          }
        } else if (active === 'open') {
          lift = 0.2;
        }

        busy = integrate(item.x, target.x, itemOmega, zeta, dt) || busy;
        busy = integrate(item.y, target.y, itemOmega, zeta, dt) || busy;
        busy = integrate(item.z, target.z, itemOmega, zeta, dt) || busy;
        busy = integrate(item.r, target.r, itemOmega, zeta, dt) || busy;
        busy = integrate(item.s, target.s, itemOmega, zeta, dt) || busy;
        busy = integrate(item.hover, lift, itemOmega, zeta, dt) || busy;
        busy = integrate(item.mx, magnet ? item.localX * 7 * g.scale : 0, soft, 0.85, dt) || busy;
        busy = integrate(item.my, magnet ? item.localY * 7 * g.scale : 0, soft, 0.85, dt) || busy;
      });

      write();
      if (busy) state.raf = requestAnimationFrame(frame);
      else state.last = 0;
    };

    const write = () => {
      const { w, h, tabH, frontH, docW, docH, scale: sc } = g;
      const pivotX = w / 2;
      const pivotY = tabH + h / 2;
      const theta = state.front.value;
      const zoom = (1 + state.lift.value * 0.012) * state.squash.value;

      const desk = chain(
        move(pivotX, pivotY),
        turnX(state.rx.value),
        turnY(state.ry.value),
        stretch(zoom, zoom),
        move(-pivotX, -pivotY)
      );

      back.style.transform = toCss(desk);

      const frontMatrix = chain(desk, move(0, tabH + h, 2 * sc), turnX(theta), move(0, -frontH));
      front.style.transform = toCss(frontMatrix);

      ground.style.transform = toCss(multiply(desk, move(0, tabH + h)));
      ground.style.opacity = (0.75 + state.lift.value * 0.25).toFixed(3);

      state.items.forEach((item, index) => {
        const node = itemElements[index];
        const z = 3 * sc + item.z.value + item.hover.value * 26 * sc;
        const matrix = chain(
          desk,
          move(item.x.value + item.mx.value, item.y.value + item.my.value, z),
          turnY(item.ry.value),
          turnZ(item.r.value),
          stretch(item.s.value, item.s.value),
          move(-docW / 2, -docH / 2)
        );
        let layer = 10 + count - item.rank;
        if (state.phase === 'open' && state.hoveredItem === index) layer = 30;
        node.style.transform = toCss(matrix);
        node.style.zIndex = String(layer);
        node.style.setProperty('--folder-lift', clamp(item.hover.value, 0, 2.4).toFixed(3));
      });
    };

    const wake = () => {
      if (!state.raf) state.raf = requestAnimationFrame(frame);
    };

    const setOpen = open => {
      isOpen = open;
      root.toggleAttribute('data-open', isOpen);
      stage.setAttribute('aria-expanded', String(isOpen));
      itemElements.forEach(el => el.setAttribute('tabindex', isOpen ? '0' : '-1'));
      wake();
    };

    stage.addEventListener('click', e => {
      if (e.target.closest('.folder-item')) return;
      setOpen(!isOpen);
    });

    root.addEventListener('pointermove', event => {
      const box = root.getBoundingClientRect();
      state.pointerX = clamp(((event.clientX - box.left) / box.width) * 2 - 1, -1.5, 1.5);
      state.pointerY = clamp(((event.clientY - box.top) / box.height) * 2 - 1, -1.5, 1.5);
      const target = event.target.closest?.('.folder-item');
      const index = target ? Number(target.getAttribute('data-folder-item')) : -1;
      state.hoveredItem = index;
      if (target && index >= 0) {
        const rect = target.getBoundingClientRect();
        const item = state.items[index];
        if (item) {
          item.localX = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
          item.localY = clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
        }
      }
      if (!state.hovered) {
        state.hovered = true;
      }
      wake();
    });

    root.addEventListener('pointerleave', () => {
      state.hovered = false;
      state.pressed = false;
      state.hoveredItem = -1;
      wake();
    });

    root.addEventListener('pointerdown', e => {
      if (e.button === 0 && !e.target.closest('.folder-item')) {
        state.pressed = true;
        wake();
      }
    });

    window.addEventListener('pointerup', () => {
      if (state.pressed) {
        state.pressed = false;
        wake();
      }
    });

    document.addEventListener('pointerdown', e => {
      if (!root.contains(e.target) && isOpen && closeOnOutsideClick) {
        setOpen(false);
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen && closeOnOutsideClick) {
        setOpen(false);
      }
    });

    setOpen(defaultOpen);
    wake();
  }

  createFolderComponent(mount, {
    mode: 'flap',
    variant: 'solid',
    color: '#ed3b24',
    paperColor: '#eee9df',
    label: 'PROJECTS',
    size: 1.25,
    bounce: 0.45,
    speed: 1.1,
    tilt: 0.6
  });
})();
