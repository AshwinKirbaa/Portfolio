// ChromaGrid.js — Pure Vanilla JS runtime implementation of React Bits ChromaGrid component
// Faithfully implements spotlight physics, dampening, falloff stops, and theme properties.

(function () {
  const THEMES = {
    dark: {
      '--chroma-frame': 'rgba(38, 35, 46, 0.66)',
      '--chroma-frame-edge': 'rgba(255, 255, 255, 0.08)',
      '--chroma-frame-highlight': 'rgba(255, 255, 255, 0.07)',
      '--chroma-frame-shadow': '0 22px 44px -20px rgba(0, 0, 0, 0.8), 0 6px 16px -8px rgba(0, 0, 0, 0.5)',
      '--chroma-tile': 'linear-gradient(180deg, #1f1d24 0%, #151318 100%)',
      '--chroma-tile-edge': 'rgba(255, 255, 255, 0.08)',
      '--chroma-tile-highlight': 'rgba(255, 255, 255, 0.12)',
      '--chroma-tile-shadow': '0 8px 24px -6px rgba(0, 0, 0, 0.7)',
      '--chroma-media-edge': 'rgba(255, 255, 255, 0.08)',
      '--chroma-well': 'rgba(0, 0, 0, 0.35)',
      '--chroma-ink': '#f4f4f5',
      '--chroma-muted': 'rgba(244, 244, 245, 0.55)',
      '--chroma-hover': 'brightness(1.12)',
      '--chroma-press': 'brightness(0.85)'
    },
    light: {
      '--chroma-frame': 'rgba(240, 240, 243, 0.8)',
      '--chroma-frame-edge': 'rgba(24, 24, 27, 0.07)',
      '--chroma-frame-highlight': 'rgba(255, 255, 255, 0.95)',
      '--chroma-frame-shadow': '0 22px 44px -22px rgba(24, 24, 27, 0.3), 0 6px 16px -10px rgba(24, 24, 27, 0.16)',
      '--chroma-tile': 'linear-gradient(180deg, #ffffff 0%, #f6f6f8 100%)',
      '--chroma-tile-edge': 'rgba(24, 24, 27, 0.08)',
      '--chroma-tile-highlight': 'rgba(255, 255, 255, 1)',
      '--chroma-tile-shadow': '0 4px 10px -5px rgba(24, 24, 27, 0.25)',
      '--chroma-media-edge': 'rgba(24, 24, 27, 0.06)',
      '--chroma-well': 'rgba(24, 24, 27, 0.05)',
      '--chroma-ink': '#27272a',
      '--chroma-muted': 'rgba(39, 39, 42, 0.55)',
      '--chroma-hover': 'brightness(0.97)',
      '--chroma-press': 'brightness(0.92)'
    }
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const falloffStops = softness => {
    const core = clamp(1 - softness, 0, 0.95);
    const stops = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      const u = clamp((t - core) / Math.max(0.0001, 1 - core), 0, 1);
      const alpha = 1 - u * u * u * (u * (u * 6 - 15) + 10);
      stops.push(`rgba(0, 0, 0, ${alpha.toFixed(3)}) ${(t * 100).toFixed(1)}%`);
    }
    return stops.join(', ');
  };

  function createChromaGrid(mountElement, config = {}) {
    if (!mountElement) return;

    const {
      items = [],
      columns = 3,
      minCardWidth = 260,
      gap = 18,
      radius = 320,
      softness = 0.6,
      damping = 0.45,
      fadeOut = 0.6,
      grayscale = 1,
      dim = 0.15,
      glow = 0.55,
      borderGlow = 1,
      reveal = 'spotlight',
      aspectRatio = '16 / 11',
      cardRadius = 16,
      showInfo = true,
      frame = false,
      theme = 'dark',
      className = '',
      onItemClick = null
    } = config;

    const root = document.createElement('div');
    root.className = `chroma-grid${frame ? ' has-frame' : ''}${className ? ' ' + className : ''}`;
    root.setAttribute('data-reveal', reveal === 'card' ? 'card' : 'spotlight');

    const themeVars = THEMES[theme] || THEMES.dark;
    for (const [key, val] of Object.entries(themeVars)) {
      root.style.setProperty(key, val);
    }

    root.style.setProperty('--chroma-cols', Math.max(1, Math.round(columns)));
    root.style.setProperty('--chroma-min', `${Math.max(80, minCardWidth)}px`);
    root.style.setProperty('--chroma-gap', `${Math.max(0, gap)}px`);
    root.style.setProperty('--chroma-r', `${Math.max(20, radius)}px`);
    root.style.setProperty('--chroma-stops', falloffStops(clamp(softness, 0, 1)));
    root.style.setProperty('--chroma-gray', clamp(grayscale, 0, 1));
    root.style.setProperty('--chroma-dim', clamp(dim, 0, 0.9));
    root.style.setProperty('--chroma-glow', clamp(glow, 0, 1));
    root.style.setProperty('--chroma-border', clamp(borderGlow, 0, 1));
    root.style.setProperty('--chroma-fade', `${Math.max(0, fadeOut)}s`);
    root.style.setProperty('--chroma-ratio', aspectRatio);
    root.style.setProperty('--chroma-radius', `${Math.max(0, cardRadius)}px`);

    const inner = document.createElement('div');
    inner.className = 'chroma-grid-inner';

    items.forEach((item, index) => {
      const accent = item.accent || item.borderColor || '#ff4d00';
      const card = document.createElement('article');
      card.className = 'chroma-card';
      card.setAttribute('data-chroma-area', '');
      card.id = item.id || `chroma-card-${index}`;
      card.style.setProperty('--chroma-accent', accent);
      if (item.aspectRatio) {
        card.style.setProperty('--chroma-ratio', item.aspectRatio);
      }

      const wash = document.createElement('span');
      wash.className = 'chroma-wash';
      wash.setAttribute('aria-hidden', 'true');
      card.appendChild(wash);

      const media = document.createElement('div');
      media.className = 'chroma-media';
      media.setAttribute('data-chroma-area', '');

      const imgMono = document.createElement('img');
      imgMono.className = 'chroma-mono';
      imgMono.src = item.image;
      imgMono.alt = item.alt || item.title || '';
      imgMono.loading = 'lazy';
      media.appendChild(imgMono);

      const imgColor = document.createElement('img');
      imgColor.className = 'chroma-color';
      imgColor.src = item.image;
      imgColor.alt = '';
      imgColor.setAttribute('aria-hidden', 'true');
      imgColor.loading = 'lazy';
      media.appendChild(imgColor);

      const mediaRim = document.createElement('span');
      mediaRim.className = 'chroma-media-rim';
      mediaRim.setAttribute('aria-hidden', 'true');
      media.appendChild(mediaRim);

      card.appendChild(media);

      if (showInfo && (item.title || item.subtitle || item.badge)) {
        const info = document.createElement('div');
        info.className = 'chroma-info';

        if (item.badge) {
          const badge = document.createElement('span');
          badge.className = 'chroma-badge';
          badge.textContent = item.badge;
          info.appendChild(badge);
        }

        if (item.title) {
          const title = document.createElement('span');
          title.className = 'chroma-title';
          title.textContent = item.title;
          info.appendChild(title);
        }

        if (item.subtitle) {
          const sub = document.createElement('span');
          sub.className = 'chroma-subtitle';
          sub.textContent = item.subtitle;
          info.appendChild(sub);
        }

        card.appendChild(info);
      }

      const cardRim = document.createElement('span');
      cardRim.className = 'chroma-card-rim';
      cardRim.setAttribute('aria-hidden', 'true');
      card.appendChild(cardRim);

      const cardGlow = document.createElement('span');
      cardGlow.className = 'chroma-card-glow';
      cardGlow.setAttribute('aria-hidden', 'true');
      card.appendChild(cardGlow);

      card.addEventListener('click', (e) => {
        if (typeof onItemClick === 'function') {
          onItemClick(item, index, e);
        }
      });

      inner.appendChild(card);
    });

    root.appendChild(inner);

    if (frame) {
      const frameRim = document.createElement('span');
      frameRim.className = 'chroma-frame-rim';
      frameRim.setAttribute('aria-hidden', 'true');
      root.appendChild(frameRim);
    }

    mountElement.innerHTML = '';
    mountElement.appendChild(root);

    // Physics runtime: Spotlight tracking
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const state = { x: 0, y: 0, tx: 0, ty: 0, power: 0, target: 0, primed: false };
    let raf = 0;
    let last = 0;

    const place = () => {
      const box = root.getBoundingClientRect();
      root.querySelectorAll('[data-chroma-area]').forEach(node => {
        const rect = node.getBoundingClientRect();
        node.style.setProperty('--chroma-ox', `${rect.left - box.left}px`);
        node.style.setProperty('--chroma-oy', `${rect.top - box.top}px`);
      });
    };

    const frameTick = now => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const follow = reduce ? 1 : 1 - Math.exp(-dt / Math.max(0.01, damping * 0.32));
      state.x += (state.tx - state.x) * follow;
      state.y += (state.ty - state.y) * follow;
      const span = state.target > state.power ? 0.1 : Math.max(0.02, fadeOut * 0.35);
      state.power += (state.target - state.power) * (reduce ? 1 : 1 - Math.exp(-dt / span));
      root.style.setProperty('--chroma-x', `${state.x.toFixed(2)}px`);
      root.style.setProperty('--chroma-y', `${state.y.toFixed(2)}px`);
      root.style.setProperty('--chroma-power', state.power.toFixed(4));
      const settled =
        Math.abs(state.tx - state.x) < 0.1 &&
        Math.abs(state.ty - state.y) < 0.1 &&
        Math.abs(state.target - state.power) < 0.002;
      if (settled) {
        state.power = state.target;
        root.style.setProperty('--chroma-power', state.power.toFixed(4));
        last = 0;
      } else {
        raf = requestAnimationFrame(frameTick);
      }
    };

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frameTick);
    };

    const onMove = event => {
      if (reveal === 'card') return;
      const box = root.getBoundingClientRect();
      state.tx = event.clientX - box.left;
      state.ty = event.clientY - box.top;
      if (!state.primed || state.power < 0.02) {
        state.x = state.tx;
        state.y = state.ty;
        state.primed = true;
      }
      state.target = 1;
      wake();
    };

    const onLeave = () => {
      state.target = 0;
      wake();
    };

    const resizeObserver = new ResizeObserver(place);
    resizeObserver.observe(root);
    window.addEventListener('resize', place);
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerdown', onMove);
    root.addEventListener('pointerleave', onLeave);
    root.addEventListener('pointercancel', onLeave);

    setTimeout(place, 100);
    setTimeout(place, 500);

    return {
      destroy: () => {
        cancelAnimationFrame(raf);
        resizeObserver.disconnect();
        window.removeEventListener('resize', place);
        root.removeEventListener('pointermove', onMove);
        root.removeEventListener('pointerdown', onMove);
        root.removeEventListener('pointerleave', onLeave);
        root.removeEventListener('pointercancel', onLeave);
      },
      refresh: place
    };
  }

  window.createChromaGrid = createChromaGrid;
})();
