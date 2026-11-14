// Certificate ChromaGrid Integration
(function() {
  const CERTIFICATE_CHROMA_ITEMS = [
    {
      id: 'render-rush',
      image: 'assets/certificates/kalam-render-rush-first-place.png',
      title: 'RENDER RUSH — FIRST PLACE',
      badge: '12–14 MARCH 2026 / WINNER',
      subtitle: 'Kalam 2026 · Sri Shakthi Institute',
      accent: '#ff8a4c',
      aspectRatio: '16 / 11'
    },
    {
      id: 'hacksprint-26',
      image: 'assets/certificates/hacksprint-2026.png',
      title: 'HACKSPRINT ’26',
      badge: '22–23 JULY 2026 / 24 HOURS',
      subtitle: 'Artificial Intelligence Research Lab',
      accent: '#3fb8ff',
      aspectRatio: '16 / 11'
    },
    {
      id: 'ibm-bob-2',
      image: 'assets/certificates/ibm-bob-2-hackathon.png',
      title: 'IBM BOB 2.0 HACKATHON',
      badge: '25–27 SEPTEMBER 2026 / COMPLETION',
      subtitle: 'IBM & Build On Belief · Agentic AI',
      accent: '#a98bff',
      aspectRatio: '16 / 11'
    },
    {
      id: 'hack-in-hills',
      image: 'assets/certificates/hack-in-hills-top-500.png',
      title: 'HACK IN HILLS BUILDER PASS',
      badge: '2026 / TOP 500 BUILDER',
      subtitle: 'Round 1 Qualified · SafeBox AI',
      accent: '#ffd23f',
      aspectRatio: '16 / 11'
    },
    {
      id: 'hackday-1',
      image: 'assets/certificates/hackday-1.png',
      title: 'HACKDAY 1.0',
      badge: '20 SEPTEMBER 2026 / 8 HOURS',
      subtitle: 'DecodeP · Unstop & GO',
      accent: '#ff5a36',
      aspectRatio: '16 / 11'
    },
    {
      id: 'promptwars',
      image: 'assets/certificates/promptwars-gdg-cit.png',
      title: 'PROMPTWARS × GDG CIT',
      badge: '26 SEPTEMBER 2026 / AI PROTOTYPE',
      subtitle: 'Google Developer Groups · Antigravity',
      accent: '#7cc4ff',
      aspectRatio: '16 / 11'
    },
    {
      id: 'hackerrank-orchestrate',
      image: 'assets/certificates/hackerrank-orchestrate-rank-1134.png',
      title: 'HACKERRANK ORCHESTRATE',
      badge: 'SEPTEMBER 2026 / RANK #1,134',
      subtitle: 'Autonomous AI Agent Challenge',
      accent: '#00ea64',
      aspectRatio: '16 / 11'
    },
    {
      id: 'frontend-react',
      image: 'assets/certificates/hackerrank-frontend-react.png',
      title: 'FRONTEND DEVELOPER — REACT',
      badge: '17 OCTOBER 2026 / ROLE CERT',
      subtitle: 'HackerRank Verified Skill Certification',
      accent: '#00d8ff',
      aspectRatio: '16 / 11'
    },
    {
      id: 'twineval-ijrti',
      image: 'assets/certificates/ijrti-publication.png',
      title: 'TWINEVAL AI — IJRTI',
      badge: 'OCTOBER 2026 / PUBLICATION',
      subtitle: 'Paper ID IJRTI2610875 · AI Evaluation',
      accent: '#ff7eb6',
      aspectRatio: '16 / 11'
    },
    {
      id: 'nptel-cloud',
      image: 'assets/certificates/nptel-cloud-computing-elite.png',
      title: 'NPTEL CLOUD COMPUTING',
      badge: 'JULY–OCTOBER 2026 / ELITE (69%)',
      subtitle: 'IIT Kharagpur · 12-Week Course',
      accent: '#ffb27a',
      aspectRatio: '16 / 11'
    },
    {
      id: 'gemini-quiz-war',
      image: 'assets/certificates/gemini-quiz-war.png',
      title: 'GEMINI QUIZ WAR',
      badge: '2026 / PARTICIPATION',
      subtitle: 'Google Gemini Hackathon & Challenge',
      accent: '#9d72ff',
      aspectRatio: '16 / 11'
    },
    {
      id: 'nasa-space-apps',
      image: 'assets/certificates/nasa-space-apps-galactic-problem-solver.png',
      title: 'NASA SPACE APPS CHALLENGE',
      badge: '14–15 NOVEMBER 2026 / SOLVER',
      subtitle: 'Galactic Problem Solver Recognition',
      accent: '#4facfe',
      aspectRatio: '16 / 11'
    }
  ];

  function initCertificatesChromaGrid() {
    const mount = document.getElementById('chroma-grid-mount');
    if (!mount || !window.createChromaGrid) return;

    window.createChromaGrid(mount, {
      items: CERTIFICATE_CHROMA_ITEMS,
      columns: 3,
      minCardWidth: 280,
      gap: 20,
      radius: 340,
      softness: 0.65,
      damping: 0.42,
      fadeOut: 0.6,
      grayscale: 0.85,
      dim: 0.12,
      glow: 0.6,
      borderGlow: 1,
      reveal: 'spotlight',
      aspectRatio: '16 / 11',
      cardRadius: 18,
      showInfo: true,
      frame: false,
      theme: 'dark',
      onItemClick: (item, index, e) => {
        if (e) e.preventDefault();
        if (window.openCertificateDetails) {
          window.openCertificateDetails(item.id);
        } else {
          window.location.hash = item.id;
        }
      }
    });

    // Hash navigation focus support
    function checkHashFocus() {
      if (!location.hash) return;
      const targetId = location.hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('is-focused');
          setTimeout(() => el.classList.remove('is-focused'), 3000);
        }, 200);
      }
    }

    window.addEventListener('hashchange', checkHashFocus);
    checkHashFocus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCertificatesChromaGrid);
  } else {
    initCertificatesChromaGrid();
  }
})();
