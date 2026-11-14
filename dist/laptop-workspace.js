/**
 * Interactive MacBook / Laptop Workspace Component
 * - Stationary laptop (zero cursor movement/tilt)
 * - Opens all links and social platforms directly inside the laptop screen itself
 * - Fetches live GitHub repos dynamically via GitHub API
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
  const liveReposContainer = showcase.querySelector('.github-live-repos');
  const liveRepoCountEl = showcase.querySelector('.github-live-count');

  // Ensure stationary laptop - NO tilt or pointer movement
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
      urlText: 'ashwin-kirbaa-resume.pdf',
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

    // Update Dock active state
    dockItems.forEach(item => {
      item.classList.toggle('is-active', item.dataset.app === key);
    });

    // Update URL bar
    if (urlDisplay) {
      urlDisplay.textContent = appMeta[key].urlText;
    }
    if (externalLinkBtn) {
      externalLinkBtn.href = appMeta[key].externalUrl;
    }

    // Switch view inside the laptop screen
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

  // Live GitHub Repos Fetcher (Option 3 integration)
  async function fetchLiveGitHubData() {
    if (!liveReposContainer) return;
    try {
      const res = await fetch('https://api.github.com/users/AshwinKirbaa/repos?sort=updated&per_page=6');
      if (!res.ok) throw new Error('Network error');
      const repos = await res.json();
      if (!Array.isArray(repos) || repos.length === 0) return;

      if (liveRepoCountEl) {
        liveRepoCountEl.textContent = `${repos.length} Live Repos`;
      }

      liveReposContainer.innerHTML = repos.slice(0, 4).map(repo => {
        const lang = repo.language || 'Python';
        const stars = repo.stargazers_count > 0 ? `★ ${repo.stargazers_count}` : 'Live';
        const updatedTime = new Date(repo.pushed_at || repo.updated_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        const desc = repo.description || 'Public engineering repository and prototype system.';
        return `
          <a class="inlaptop-card" href="${repo.html_url}" target="_blank" rel="noreferrer">
            <div class="inlaptop-card-title">${repo.name} <span>${stars}</span></div>
            <p>${desc}</p>
            <div class="inlaptop-card-tags">
              <span>● ${lang}</span> · <span>Updated ${updatedTime}</span>
            </div>
          </a>
        `;
      }).join('');
    } catch (err) {
      // Keep curated fallback cards if API is offline or rate-limited
      console.log('GitHub API live fetch using cached fallback');
    }
  }

  // Dock items switch view inside laptop
  dockItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const appKey = item.dataset.app;
      if (appKey) renderApp(appKey);
    });
  });

  // Browser Navigation inside the laptop
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

  // Window dots interactions
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

  // Initial load
  renderApp('github', false);
  fetchLiveGitHubData();
})();
