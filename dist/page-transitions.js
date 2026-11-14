/**
 * Smooth Seamless Page Transitions
 * Supports modern View Transitions API with graceful crossfade fallback
 */
(() => {
  // Create or attach the transition curtain
  let curtain = document.querySelector('.page-transition-curtain');
  if (!curtain) {
    curtain = document.createElement('div');
    curtain.className = 'page-transition-curtain';
    curtain.setAttribute('aria-hidden', 'true');
    document.body.appendChild(curtain);
  }

  // On page load / restoration, ensure curtain is faded out smoothly
  const revealPage = () => {
    if (curtain) {
      curtain.classList.remove('is-leaving');
    }
  };

  if (document.readyState === 'complete') {
    requestAnimationFrame(revealPage);
  } else {
    window.addEventListener('load', revealPage);
  }

  // Handle back/forward cache (pageshow)
  window.addEventListener('pageshow', (event) => {
    revealPage();
  });

  // Intercept local page navigation
  function shouldIntercept(a, event) {
    if (!a || !a.href) return false;
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    if (a.target && a.target !== '_self') return false;
    if (a.hasAttribute('download')) return false;

    const url = new URL(a.href, window.location.href);
    // Ignore external links
    if (url.origin !== window.location.origin) return false;

    // Ignore mailto, tel, javascript
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;

    // Check if it's strictly an in-page hash jump on the EXACT same path
    if (url.pathname === window.location.pathname && url.search === window.location.search) {
      // In-page anchor hash link -> native smooth scroll
      return false;
    }

    return true;
  }

  function navigateSmoothly(targetUrl) {
    // If browser supports document.startViewTransition
    if (document.startViewTransition) {
      curtain.classList.add('is-leaving');
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 160);
      return;
    }

    // Graceful smooth curtain fallback
    curtain.classList.add('is-leaving');
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 240);
  }

  // Global link delegation
  document.addEventListener('click', (event) => {
    const a = event.target.closest('a');
    if (!a) return;

    if (shouldIntercept(a, event)) {
      event.preventDefault();
      navigateSmoothly(a.href);
    }
  }, { capture: true });

  // Expose global helper for programmatic transitions (e.g. from certificate carousel or buttons)
  window.navigateSmoothly = navigateSmoothly;
})();

