// quick-features.js — Clipboard Copy & Floating Recruiter Pill

(function () {
  // 1. Toast Notification Element
  const toast = document.createElement('div');
  toast.className = 'copy-toast';
  toast.id = 'quick-copy-toast';
  toast.innerHTML = `
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span id="copy-toast-msg">Copied email to clipboard!</span>
  `;
  document.body.appendChild(toast);

  let toastTimer = null;
  function showToast(msg) {
    if (msg) document.getElementById('copy-toast-msg').textContent = msg;
    toast.classList.add('is-active');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-active');
    }, 2400);
  }

  // 2. Attach copy listeners to email links
  function copyEmailToClipboard(e) {
    const email = 'ashwinkirbaa17@gmail.com';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(() => {
        showToast('Copied email to clipboard: ' + email);
      }).catch(() => {
        showToast('Email: ' + email);
      });
    } else {
      showToast('Email: ' + email);
    }
  }

  // Bind to any copy triggers
  document.querySelectorAll('[data-copy-email]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      copyEmailToClipboard(e);
    });
  });

  // 3. Floating Recruiter Dock Pill
  const pill = document.createElement('aside');
  pill.className = 'floating-recruiter-pill';
  pill.setAttribute('aria-label', 'Quick Actions');
  pill.innerHTML = `
    <a href="assets/ashwin-kirbaa-cv.pdf" target="_blank" rel="noreferrer" class="floating-pill-link">
      <span>CV / RESUME ↗</span>
    </a>
    <a href="mailto:ashwinkirbaa17@gmail.com" class="floating-pill-link primary" data-copy-email>
      <span>LET’S TALK</span>
    </a>
    <button type="button" class="floating-pill-top" aria-label="Back to Top" title="Back to Top">
      ↑
    </button>
  `;
  document.body.appendChild(pill);

  // Top button action
  const topBtn = pill.querySelector('.floating-pill-top');
  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Re-bind pill's email copy button
  pill.querySelector('[data-copy-email]').addEventListener('click', (e) => {
    e.preventDefault();
    copyEmailToClipboard(e);
  });

  // Visibility based on scroll depth
  function checkScroll() {
    // Show after scrolling past hero section (approx 450px)
    if (window.scrollY > 450) {
      pill.classList.add('is-visible');
    } else {
      pill.classList.remove('is-visible');
    }
  }

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();
})();
