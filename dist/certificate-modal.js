// Certificate Modal System: provides interactive detail dialog for certificates
const CERTIFICATE_DETAILS = {
  'render-rush': {
    title: 'RENDER RUSH — FIRST PLACE',
    badge: 'WINNER / 1ST PLACE',
    date: '12–14 MARCH 2026',
    issuer: 'Kalam 2026 · Sri Shakthi Institute of Engineering and Technology',
    image: 'assets/certificates/kalam-render-rush-first-place.png',
    hackathonName: 'Kalam 2026: Render Rush Design & Prototyping Challenge',
    category: 'UI/UX Engineering & Fast Visual Prototyping',
    whatIDid: [
      'Engineered an ultra-fast, high-fidelity responsive user interface prototype under strict time constraints.',
      'Designed bespoke design systems, clean typography hierarchies, and intuitive user micro-interactions.',
      'Delivered fully functional, interactive frontend components with clean architectural structure, winning 1st place across competing college teams.'
    ],
    techStack: ['Figma', 'HTML5', 'CSS Grid/Flexbox', 'Modern JavaScript', 'UI Architecture']
  },
  'hacksprint-26': {
    title: 'HACKSPRINT ’26',
    badge: '24-HOUR HACKATHON PARTICIPATION',
    date: '22–23 JULY 2026',
    issuer: 'Artificial Intelligence Research Laboratory (AIRL)',
    image: 'assets/certificates/hacksprint-2026.png',
    hackathonName: 'HackSprint ’26: 24-Hour AI Innovation Sprint',
    category: 'Artificial Intelligence & Machine Learning',
    whatIDid: [
      'Conceived, trained, and integrated real-time machine learning pipelines within a continuous 24-hour hackathon environment.',
      'Developed backend inference services connecting predictive models with a clean client interface.',
      'Optimized data processing, feature extraction, and model latency to run seamlessly under live evaluation.'
    ],
    techStack: ['Python', 'PyTorch / Scikit-learn', 'FastAPI', 'REST APIs', 'Real-time AI Inference']
  },
  'ibm-bob-2': {
    title: 'IBM BOB 2.0 HACKATHON',
    badge: 'SUBMITTED SOLUTION & COMPLETION',
    date: '25–27 SEPTEMBER 2026',
    issuer: 'IBM & Build On Belief (BoB) Initiative',
    image: 'assets/certificates/ibm-bob-2-hackathon.png',
    hackathonName: 'IBM Build on Belief (BoB) 2.0 Hackathon',
    category: 'Agentic AI & Enterprise Cloud Solutions',
    whatIDid: [
      'Architected an autonomous agentic AI system designed to handle multi-step reasoning and automated task orchestration.',
      'Leveraged IBM cloud infrastructure and LLM foundations with prompt chaining and structured output parsing.',
      'Integrated tool-calling workflows and verified prompt reliability against dynamic edge cases.'
    ],
    techStack: ['Agentic AI', 'IBM Cloud / Watson', 'Python', 'LLM Function Calling', 'LangChain / Tool Chaining']
  },
  'hack-in-hills': {
    title: 'HACK IN HILLS BUILDER PASS',
    badge: 'TOP 500 BUILDER (SELECTED FROM 10,000+ TEAMS)',
    date: '2026',
    issuer: 'Hack In Hills · Manali Finals',
    image: 'assets/certificates/hack-in-hills-top-500.png',
    hackathonName: 'Hack In Hills 2026 National Hackathon',
    category: 'Distributed Security & Edge Vision AI',
    whatIDid: [
      'Engineered SafeBox AI — an edge-first offline AI security & automated alert ecosystem, advancing past Round 1 into the Top 500 nationwide out of 10,000+ competing teams.',
      'Built local neural network inference pipelines capable of operating completely without cloud reliance or external connectivity.',
      'Implemented automated encrypted tamper detection, local sensor logs, and rapid fail-safe alerting mechanisms.'
    ],
    techStack: ['Computer Vision', 'YOLO / ONNX', 'Python', 'Edge Computing', 'Cryptographic Hashing']
  },
  'hackday-1': {
    title: 'HACKDAY 1.0',
    badge: '8-HOUR RAPID PROTOTYPE',
    date: '20 SEPTEMBER 2026',
    issuer: 'DecodeP × Unstop × GO',
    image: 'assets/certificates/hackday-1.png',
    hackathonName: 'HackDay 1.0: 8-Hour Rapid Build Sprint',
    category: 'Rapid Product Prototyping & System Design',
    whatIDid: [
      'Brainstormed, designed, built, and deployed an end-to-end software solution within an intense 8-hour sprint.',
      'Led core backend schema design, API endpoint authoring, and interactive frontend integration.',
      'Successfully presented a live demonstration of the operational prototype to evaluators on schedule.'
    ],
    techStack: ['Node.js', 'Express', 'JavaScript / DOM', 'Tailwind / CSS', 'Git & Cloud Deployment']
  },
  'promptwars': {
    title: 'PROMPTWARS × GDG CIT',
    badge: 'AI PROTOTYPE & COMPETITIVE BUILD',
    date: '26 SEPTEMBER 2026',
    issuer: 'Google Developer Groups (GDG) on Campus CIT',
    image: 'assets/certificates/promptwars-gdg-cit.png',
    hackathonName: 'PromptWars — Google Developer Group Campus Hack',
    category: 'Generative AI, LLM Prompt Engineering & Agents',
    whatIDid: [
      'Engineered intelligent generative AI workflows leveraging advanced few-shot prompting, schema enforcement, and agentic validation.',
      'Built a functional prototype utilizing Google Gemini and Antigravity tooling in a single day.',
      'Won evaluation points for minimal hallucination rates, crisp latency, and innovative prompt orchestration architecture.'
    ],
    techStack: ['Google Gemini API', 'Antigravity SDK', 'Prompt Engineering', 'Structured JSON Output', 'Python']
  },
  'hackerrank-orchestrate': {
    title: 'HACKERRANK ORCHESTRATE',
    badge: 'FINAL RANK #1,134 (OUT OF 35,000+ DEVELOPERS)',
    date: 'SEPTEMBER 2026',
    issuer: 'HackerRank Global Challenge',
    image: 'assets/certificates/hackerrank-orchestrate-rank-1134.png',
    hackathonName: 'HackerRank Orchestrate: Autonomous Agentic Challenge',
    category: 'Autonomous AI Agents & Algorithmic Orchestration',
    whatIDid: [
      'Competed in a rigorous global competitive coding challenge with 35,000+ registered developers worldwide, finishing at #1,134 rank.',
      'Constructed algorithmic agent workflows that accurately parsed unstructured system data and triggered automated decisions.',
      'Passed multi-stage automated test suites evaluating execution efficiency, error resilience, and edge case recovery.'
    ],
    techStack: ['Autonomous Agents', 'Algorithms', 'Python', 'System Architecture', 'Complex Problem Solving']
  },
  'frontend-react': {
    title: 'FRONTEND DEVELOPER — REACT',
    badge: 'OFFICIAL ROLE CERTIFICATION',
    date: '17 OCTOBER 2026',
    issuer: 'HackerRank Assessment Certification',
    image: 'assets/certificates/hackerrank-frontend-react.png',
    hackathonName: 'HackerRank Standardized Frontend Skill Assessment',
    category: 'Frontend Engineering & React Ecosystem',
    whatIDid: [
      'Passed comprehensive assessment verifying production-grade mastery of React 18+, component lifecycle, state management, and DOM optimization.',
      'Demonstrated expertise in asynchronous rendering, hooks architecture, synthetic event handling, and responsive layout styling.',
      'Wrote maintainable, modular component code compliant with strict automated test coverage and performance benchmarks.'
    ],
    techStack: ['React.js', 'State Management', 'JavaScript (ESNext)', 'Component Lifecycle', 'Web Performance']
  },
  'twineval-ijrti': {
    title: 'TWINEVAL AI — IJRTI PUBLICATION',
    badge: 'PEER-REVIEWED RESEARCH PUBLICATION',
    date: 'OCTOBER 2026',
    issuer: 'International Journal for Research Trends and Innovation (Volume 11, Issue 10)',
    image: 'assets/certificates/ijrti-publication.png',
    hackathonName: 'IJRTI Peer-Reviewed Publication (Paper ID: IJRTI2610875)',
    category: 'NLP & Computer Vision Research',
    whatIDid: [
      'Authored and published research paper titled “Smart Evaluation of Handwritten Answer Scripts” tackling subjective grading fairness.',
      'Engineered a dual-pipeline AI architecture combining OCR line extraction with bi-encoder sentence transformers for semantic similarity matching.',
      'Formulated mathematical similarity thresholds achieving superior accuracy compared to standard keyword-frequency metrics.'
    ],
    techStack: ['PyTorch', 'Hugging Face Transformers', 'Sentence-BERT', 'OpenCV / OCR', 'Scientific Research Writing']
  },
  'nptel-cloud': {
    title: 'NPTEL CLOUD COMPUTING (ELITE)',
    badge: 'ELITE STATUS (69%) · 4 ACADEMIC CREDITS',
    date: 'JULY–OCTOBER 2026',
    issuer: 'National Programme on Technology Enhanced Learning (IIT Kharagpur)',
    image: 'assets/certificates/nptel-cloud-computing-elite.png',
    hackathonName: 'NPTEL 12-Week Intensive Course & Proctored Examination',
    category: 'Cloud Infrastructure & Distributed Systems',
    whatIDid: [
      'Completed rigorous 12-week advanced cloud engineering curriculum curated by Indian Institute of Technology (IIT Kharagpur).',
      'Mastered virtualization mechanisms, distributed storage, hypervisors, serverless architectures, and cloud networking paradigms.',
      'Scored in the Elite bracket during the nationwide proctored certification exam.'
    ],
    techStack: ['Cloud Architecture', 'Distributed Systems', 'Virtualization (KVM/Xen)', 'Storage Fabrics', 'SLA & Resource Scheduling']
  },
  'gemini-quiz-war': {
    title: 'GEMINI QUIZ WAR',
    badge: 'TECHNICAL COMPETITION PARTICIPATION',
    date: '2026',
    issuer: 'DecodeP Community',
    image: 'assets/certificates/gemini-quiz-war.png',
    hackathonName: 'Gemini Quiz War: AI & Cloud Computing Battle',
    category: 'AI Knowledge & Rapid Problem Solving',
    whatIDid: [
      'Competed in a fast-paced timed technical competition assessing depth of knowledge across Google Gemini models, multimodal architecture, and AI development best practices.',
      'Solved complex algorithmic questions and multimodal deployment scenarios under high-pressure competitive timers.'
    ],
    techStack: ['Gemini Multimodal Models', 'AI Best Practices', 'Deep Learning Concepts', 'API Architecture']
  },
  'nasa-space-apps': {
    title: 'NASA SPACE APPS CHALLENGE',
    badge: 'GALACTIC PROBLEM SOLVER',
    date: '14–15 NOVEMBER 2026',
    issuer: 'NASA (National Aeronautics and Space Administration)',
    image: 'assets/certificates/nasa-space-apps-galactic-problem-solver.png',
    hackathonName: 'NASA Space Apps Challenge 2026 (Global Hackathon)',
    category: 'Earth Science, Aerospace & Open Data Analytics',
    whatIDid: [
      'Collaborated on solving global aerospace and planetary challenges using authentic NASA open telemetry and satellite datasets.',
      'Built analytical software to process and visually communicate planetary metrics and environmental anomalies for scientific accessibility.',
      'Earned the prestigious Galactic Problem Solver recognition from NASA organizers.'
    ],
    techStack: ['NASA Earth Observation Data', 'Python Data Science', 'Geospatial Analytics', 'Data Visualization', 'Collaborative Engineering']
  }
};

// Create and inject modal into DOM
function initCertificateModal() {
  if (document.getElementById('certificate-modal-overlay')) return;

  const modalHtml = `
    <div id="certificate-modal-overlay" class="cert-modal-overlay" aria-hidden="true" role="dialog" aria-modal="true">
      <div class="cert-modal-container">
        <button class="cert-modal-close" aria-label="Close dialog" id="cert-modal-close-btn">&times;</button>
        <div class="cert-modal-content">
          <div class="cert-modal-image-wrapper">
            <img id="cert-modal-img" src="" alt="Certificate preview" />
            <a id="cert-modal-fullsize-link" href="#" target="_blank" rel="noreferrer" class="cert-modal-fullsize-btn">
              VIEW FULL RESOLUTION ORIGINAL ↗
            </a>
          </div>
          <div class="cert-modal-details">
            <div class="cert-modal-header">
              <span id="cert-modal-badge" class="cert-badge mono"></span>
              <span id="cert-modal-date" class="cert-date mono"></span>
            </div>
            <h2 id="cert-modal-title" class="cert-title"></h2>
            <div id="cert-modal-issuer" class="cert-issuer mono"></div>

            <div class="cert-modal-section">
              <h4 class="mono">EVENT / HACKATHON</h4>
              <p id="cert-modal-event" class="cert-event-name"></p>
            </div>

            <div class="cert-modal-section">
              <h4 class="mono">WHAT I BUILT & CONTRIBUTED</h4>
              <ul id="cert-modal-bullets" class="cert-bullet-list"></ul>
            </div>

            <div class="cert-modal-section">
              <h4 class="mono">TECHNOLOGY & DOMAINS</h4>
              <div id="cert-modal-tech" class="cert-tech-tags"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const overlay = document.getElementById('certificate-modal-overlay');
  const closeBtn = document.getElementById('cert-modal-close-btn');

  function closeModal() {
    overlay.classList.remove('is-active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-active')) {
      closeModal();
    }
  });

  window.openCertificateDetails = function(key) {
    const data = CERTIFICATE_DETAILS[key];
    if (!data) return;

    document.getElementById('cert-modal-img').src = data.image;
    document.getElementById('cert-modal-img').alt = data.title;
    document.getElementById('cert-modal-fullsize-link').href = data.image;
    document.getElementById('cert-modal-badge').textContent = data.badge;
    document.getElementById('cert-modal-date').textContent = data.date;
    document.getElementById('cert-modal-title').textContent = data.title;
    document.getElementById('cert-modal-issuer').textContent = data.issuer;
    document.getElementById('cert-modal-event').textContent = data.hackathonName + ' · ' + data.category;

    const bulletsList = document.getElementById('cert-modal-bullets');
    bulletsList.innerHTML = '';
    data.whatIDid.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      bulletsList.appendChild(li);
    });

    const techContainer = document.getElementById('cert-modal-tech');
    techContainer.innerHTML = '';
    data.techStack.forEach(tech => {
      const tag = document.createElement('span');
      tag.className = 'cert-tech-tag mono';
      tag.textContent = tech;
      techContainer.appendChild(tag);
    });

    overlay.classList.add('is-active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCertificateModal);
} else {
  initCertificateModal();
}
