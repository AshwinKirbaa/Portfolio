(() => {
  const root = document.querySelector('[data-project-folder]');
  if (!root) return;
  const toggle = root.querySelector('[data-folder-toggle]');
  const papers = [...root.querySelectorAll('.project-paper')];

  const setOpen = open => {
    root.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('small').textContent = open ? 'SELECT A PROJECT PAPER' : 'CLICK TO OPEN';
    papers.forEach(paper => paper.tabIndex = open ? 0 : -1);
  };

  toggle.addEventListener('click', event => {
    event.stopPropagation();
    setOpen(!root.classList.contains('is-open'));
  });

  papers.forEach(paper => paper.addEventListener('click', event => event.stopPropagation()));
  document.addEventListener('click', event => {
    if (!root.contains(event.target)) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setOpen(false);
  });

  setOpen(false);
})();
