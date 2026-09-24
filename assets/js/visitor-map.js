(function () {
  'use strict';

  const canvas = document.getElementById('visitor-map-canvas');
  if (!canvas) return;
  const status = canvas.querySelector('.visitor-map-status');

  // Never send file paths, preview URLs, or test visits to the live counter.
  if (location.hostname !== 'kuxit.github.io' || !location.pathname.startsWith('/TAO-homepage/')) {
    status.textContent = 'Visitor map is available on the live site.';
    return;
  }
  if (navigator.globalPrivacyControl || navigator.doNotTrack === '1' || window.doNotTrack === '1') {
    status.textContent = 'Visitor map paused for your privacy preferences.';
    return;
  }

  function loadMap() {
    let timeout;
    const observer = new MutationObserver(function () {
      if (!canvas.querySelector('#scvmap')) return;
      status.hidden = true;
      clearTimeout(timeout);
      observer.disconnect();
    });
    observer.observe(canvas, { childList: true });

    function showUnavailable() {
      if (canvas.querySelector('#scvmap')) return;
      status.textContent = 'Map is temporarily unavailable. Try Map & stats below.';
    }

    // Use the provider's generated map widget and keep its map/statistics link visible.
    // Use the provider's working neutral preset (custom background generation is unavailable).
    // No reinitialization on theme changes.
    window.sc_map_var = window.sc_map_var || [];
    const script = document.createElement('script');
    script.src = 'https://widget.supercounters.com/ssl/map.js';
    script.async = true;
    script.referrerPolicy = 'strict-origin-when-cross-origin';
    script.onload = function () {
      if (typeof window.sc_map !== 'function') {
        showUnavailable();
        return;
      }
      try {
        window.sc_map(1738914, '333333', 'b66f4b', 50);
      } catch (error) {
        showUnavailable();
      }
    };
    script.onerror = showUnavailable;
    timeout = setTimeout(showUnavailable, 15000);
    canvas.appendChild(script);
  }

  // Keep the widget off the critical rendering path without waiting for other counters.
  function scheduleMap() {
    if ('requestIdleCallback' in window) window.requestIdleCallback(loadMap, { timeout: 2000 });
    else setTimeout(loadMap, 0);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleMap, { once: true });
  else scheduleMap();
})();
