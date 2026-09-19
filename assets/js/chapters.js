(function() {
  'use strict';

  const root = document.documentElement;
  const panels = Array.from(document.querySelectorAll('.site-panel'));
  const links = Array.from(document.querySelectorAll('.top-nav .nav-link'));
  const researchAnchors = ['education', 'experience', 'publications', 'awards'];
  const titles = { bio: 'Bio', research: 'Research', projects: 'Projects', arcadia: 'My Arcadia' };
  const rail = document.querySelector('.nav-left');
  let scrollFrame = 0;

  function resolve(hash) {
    const id = hash.replace(/^#/, '');
    if (researchAnchors.includes(id)) return { panel: 'research', anchor: id };
    if (id === 'about') return { panel: 'bio', anchor: 'about' };
    return { panel: Object.prototype.hasOwnProperty.call(titles, id) ? id : 'bio' };
  }

  function updateRail() {
    const max = Math.max(0, rail.scrollWidth - rail.clientWidth);
    rail.classList.toggle('can-scroll-left', rail.scrollLeft > 2);
    rail.classList.toggle('can-scroll-right', rail.scrollLeft < max - 2);
  }

  function showChapter(moveToContent) {
    const route = resolve(location.hash);
    root.dataset.panel = route.panel;
    panels.forEach(function(panel) { panel.hidden = panel.id !== route.panel; });
    links.forEach(function(link) {
      const active = link.hash === '#' + route.panel;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    document.title = titles[route.panel] + ' · Tao Xie';
    updateRail();

    cancelAnimationFrame(scrollFrame);
    if (!moveToContent) return;
    scrollFrame = requestAnimationFrame(function() {
      const panel = document.getElementById(route.panel);
      const destination = route.anchor ? document.getElementById(route.anchor) : panel;
      const heading = destination.querySelector('h2, h3');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }
      const navHeight = document.querySelector('.top-nav').getBoundingClientRect().height;
      const inset = window.innerWidth <= 1080 ? 16 : 28;
      const top = destination.getBoundingClientRect().top + window.scrollY - navHeight - inset;
      // Change chapters immediately; animate only the incoming content, not a long page scroll.
      window.scrollTo({ top: Math.max(0, top), behavior: 'instant' });
    });
  }

  document.addEventListener('click', function(event) {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey ||
        event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank') return;
    if (link.hash === '#main-content') {
      event.preventDefault();
      showChapter(true);
      return;
    }
    const id = link.hash.slice(1);
    if (!Object.prototype.hasOwnProperty.call(titles, id) && id !== 'about' && !researchAnchors.includes(id)) return;
    event.preventDefault();
    if (location.hash !== link.hash) history.pushState(null, '', link.hash);
    showChapter(true);
  });

  // Hash navigation also covers browser back/forward and links from the previous homepage.
  window.addEventListener('hashchange', function() { showChapter(true); });
  window.addEventListener('resize', updateRail, { passive: true });
  rail.addEventListener('scroll', updateRail, { passive: true });
  showChapter(Boolean(location.hash));
})();
