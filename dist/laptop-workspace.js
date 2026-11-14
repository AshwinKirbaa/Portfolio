/**
 * Interactive MacBook / Laptop Workspace Component
 * Switch between active social apps, view mock browser previews, and launch links
 */
(() => {
  const showcase = document.querySelector('.laptop-showcase-wrapper');
  if (!showcase) return;

  const apps = {
    github: {
      title: 'GitHub Repositories',
      handle: '@AshwinKirbaa',
      url: 'https://github.com/AshwinKirbaa',
      bg: '#24292e',
      iconSvg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="#ffffff"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`,
      description: 'Open-source machine learning models, computer vision systems, and full-stack applications with reproducible code.',
      btnText: 'VISIT GITHUB REPOS ↗',
      status: 'Active Commits · Public Work'
    },
    linkedin: {
      title: 'LinkedIn Professional',
      handle: 'in/ashwin-kirbaa17',
      url: 'https://www.linkedin.com/in/ashwin-kirbaa17',
      bg: '#0077b5',
      iconSvg: `<svg width="26" height="26" viewBox="0 0 24 24" fill="#ffffff"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`,
      description: 'Professional experience, university education at Sri Shakthi Institute of Engineering and Technology, and engineering network.',
      btnText: 'CONNECT ON LINKEDIN ↗',
      status: 'Available for Opportunities'
    },
    x: {
      title: 'X / Twitter Profile',
      handle: '@AshwinKirbaa',
      url: 'https://x.com/AshwinKirbaa',
      bg: '#000000',
      iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
      description: 'Building in public: sharing engineering updates, research insights, AI prototypes, and development milestones.',
      btnText: 'FOLLOW ON X ↗',
      status: 'Active Updates'
    },
    instagram: {
      title: 'Instagram',
      handle: '@unfav.ashwin_x',
      url: 'https://www.instagram.com/unfav.ashwin_x',
      bg: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
      iconSvg: `<svg width="26" height="26" viewBox="0 0 24 24" fill="#ffffff"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
      description: 'Behind the scenes, developer lifestyle, tech setups, and creative highlights.',
      btnText: 'VIEW INSTAGRAM ↗',
      status: 'Creative Grid'
    },
    google: {
      title: 'Google Skills & Badges',
      handle: 'Verified Cloud & AI Credentials',
      url: 'https://www.skills.google/public_profiles/fc1d22cc-384e-495c-8ca9-7fab2e97a896',
      bg: '#1a1e29',
      iconSvg: `<svg width="28" height="28" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/><path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/></svg>`,
      description: 'Official Google Cloud Skill Badges across Generative AI, Vertex AI, Gemini API, and Cloud Infrastructure.',
      btnText: 'VIEW GOOGLE SKILLS ↗',
      status: 'Google Verified Stack'
    },
    email: {
      title: 'Email Direct Inquiry',
      handle: 'ashwinkirbaa17@gmail.com',
      url: 'mailto:ashwinkirbaa17@gmail.com?subject=Opportunity%20for%20Ashwin',
      bg: '#ed3b24',
      iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
      description: 'Direct communication for internships, technical roles, ambitious collaborations, and software projects.',
      btnText: 'SEND AN EMAIL ↗',
      status: 'Replies within 24h'
    },
    cv: {
      title: 'Curriculum Vitae',
      handle: 'Ashwin_Kirbaa_Resume.pdf',
      url: 'assets/ashwin-kirbaa-cv.pdf',
      bg: '#252120',
      iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#65ff7b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
      description: 'Comprehensive engineering resume including technical coursework, project architectures, and milestones.',
      btnText: 'DOWNLOAD RESUME (PDF) ↗',
      status: 'Updated 2026'
    }
  };

  const windowUrl = showcase.querySelector('.macbook__window-url span');
  const previewIcon = showcase.querySelector('.macbook__preview-icon');
  const previewTitle = showcase.querySelector('.macbook__preview-title');
  const previewHandle = showcase.querySelector('.macbook__preview-handle');
  const previewDesc = showcase.querySelector('.macbook__preview-desc');
  const previewStatus = showcase.querySelector('.macbook__preview-status');
  const previewBtn = showcase.querySelector('.macbook__preview-btn');
  const dockItems = showcase.querySelectorAll('.macbook__dock-item');
  const macbook = showcase.querySelector('.macbook');

  function selectApp(key) {
    const data = apps[key];
    if (!data) return;

    dockItems.forEach(item => {
      item.classList.toggle('is-active', item.dataset.app === key);
    });

    if (windowUrl) windowUrl.textContent = data.url.replace(/^https?:\/\//, '').split('?')[0];
    if (previewIcon) {
      previewIcon.style.background = data.bg;
      previewIcon.innerHTML = data.iconSvg;
    }
    if (previewTitle) previewTitle.textContent = data.title;
    if (previewHandle) previewHandle.textContent = data.handle;
    if (previewDesc) previewDesc.textContent = data.description;
    if (previewStatus) previewStatus.innerHTML = `<i>●</i> ${data.status}`;
    if (previewBtn) {
      previewBtn.textContent = data.btnText;
      previewBtn.href = data.url;
      previewBtn.target = data.url.startsWith('mailto:') ? '_self' : '_blank';
    }
  }

  dockItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const key = item.dataset.app;
      selectApp(key);
    });
  });

  // Default selection
  selectApp('github');

  // Subtle 3D tilt tracking for premium laptop presentation
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && matchMedia('(pointer:fine)').matches && macbook) {
    let currentRx = 0, currentRy = 0;
    let targetRx = 0, targetRy = 0;
    let raf = 0;

    const tick = () => {
      currentRx += (targetRx - currentRx) * 0.08;
      currentRy += (targetRy - currentRy) * 0.08;
      macbook.style.transform = `rotateX(${currentRx.toFixed(2)}deg) rotateY(${currentRy.toFixed(2)}deg)`;
      if (Math.abs(targetRx - currentRx) > 0.01 || Math.abs(targetRy - currentRy) > 0.01) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    showcase.addEventListener('pointermove', (e) => {
      const rect = showcase.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      targetRx = (0.5 - y) * 8;
      targetRy = (x - 0.5) * 10;
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });

    showcase.addEventListener('pointerleave', () => {
      targetRx = 0;
      targetRy = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
  }
})();
