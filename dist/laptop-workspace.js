/**
 * Interactive MacBook / Laptop Workspace Component
 * - Stationary laptop (zero cursor movement/tilt)
 * - 1:1 authentic reproduction of user's actual profiles
 */
(() => {
  const showcase = document.querySelector('.laptop-showcase-wrapper');
  if (!showcase) return;

  const urlDisplay = showcase.querySelector('.macbook__url-text');
  const externalLinkBtn = showcase.querySelector('.macbook__open-ext-btn');
  const dockItems = showcase.querySelectorAll('.macbook__dock-item');
  const appViews = showcase.querySelectorAll('.macbook__app-view');
  const navBack = showcase.querySelector('.macbook__nav-btn--back');
  const navForward = showcase.querySelector('.macbook__nav-btn--forward');
  const macbook = showcase.querySelector('.macbook');

  if (macbook) {
    macbook.style.transform = 'none';
  }

  const appMeta = {
    github: {
      urlText: 'github.com/AshwinKirbaa',
      externalUrl: 'https://github.com/AshwinKirbaa'
    },
    linkedin: {
      urlText: 'linkedin.com/in/ashwin-kirbaa17',
      externalUrl: 'https://www.linkedin.com/in/ashwin-kirbaa17'
    },
    x: {
      urlText: 'x.com/AshwinKirbaa',
      externalUrl: 'https://x.com/AshwinKirbaa'
    },
    instagram: {
      urlText: 'instagram.com/unfav.ashwin_x',
      externalUrl: 'https://www.instagram.com/unfav.ashwin_x'
    },
    google: {
      urlText: 'skills.google/public_profiles/fc1d22cc...',
      externalUrl: 'https://www.skills.google/public_profiles/fc1d22cc-384e-495c-8ca9-7fab2e97a896'
    },
    email: {
      urlText: 'mail.google.com/mail/u/0/#inbox',
      externalUrl: 'mailto:ashwinkirbaa17@gmail.com'
    },
    cv: {
      urlText: 'ashwin-kirbaa-cv.pdf',
      externalUrl: 'assets/ashwin-kirbaa-cv.pdf'
    }
  };

  const history = ['github'];
  let historyIndex = 0;

  function updateNavButtons() {
    if (navBack) navBack.style.opacity = historyIndex > 0 ? '1' : '0.3';
    if (navForward) navForward.style.opacity = historyIndex < history.length - 1 ? '1' : '0.3';
  }

  function renderApp(key, addToHistory = true) {
    if (!appMeta[key]) return;

    if (addToHistory) {
      if (history[historyIndex] !== key) {
        history.splice(historyIndex + 1);
        history.push(key);
        historyIndex = history.length - 1;
      }
    }

    dockItems.forEach(item => {
      item.classList.toggle('is-active', item.dataset.app === key);
    });

    if (urlDisplay) {
      urlDisplay.textContent = appMeta[key].urlText;
    }
    if (externalLinkBtn) {
      externalLinkBtn.href = appMeta[key].externalUrl;
    }

    appViews.forEach(view => {
      if (view.dataset.view === key) {
        view.classList.add('is-visible');
        view.scrollTop = 0;
      } else {
        view.classList.remove('is-visible');
      }
    });

    updateNavButtons();
  }

  dockItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const appKey = item.dataset.app;
      if (appKey) renderApp(appKey);
    });
  });

  if (navBack) {
    navBack.addEventListener('click', (e) => {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        renderApp(history[historyIndex], false);
      }
    });
  }

  if (navForward) {
    navForward.addEventListener('click', (e) => {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        renderApp(history[historyIndex], false);
      }
    });
  }

  const winClose = showcase.querySelector('.macbook__win-dot.red');
  const winMax = showcase.querySelector('.macbook__win-dot.green');
  const windowEl = showcase.querySelector('.macbook__window');

  if (winClose) {
    winClose.addEventListener('click', () => {
      renderApp('github');
    });
  }

  if (winMax && windowEl) {
    let maximized = false;
    winMax.addEventListener('click', () => {
      maximized = !maximized;
      windowEl.style.maxWidth = maximized ? '100%' : '720px';
    });
  }

  renderApp('github', false);

  // Interactive Keyboard Key Feedback
  const keys = showcase.querySelectorAll('.macbook__key');
  keys.forEach(k => {
    k.addEventListener('click', () => {
      k.classList.add('is-pressed');
      setTimeout(() => k.classList.remove('is-pressed'), 140);
    });
  });

  // Real physical keyboard listener to light up matching laptop keys
  window.addEventListener('keydown', (e) => {
    const activeKey = e.key.toUpperCase();
    keys.forEach(k => {
      const dataKey = (k.dataset.key || '').toUpperCase();
      if (dataKey === activeKey || (activeKey === ' ' && dataKey === 'SPACE')) {
        k.classList.add('is-pressed');
        setTimeout(() => k.classList.remove('is-pressed'), 180);
      }
    });
  });

})();