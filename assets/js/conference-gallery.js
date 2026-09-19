(function() {
  'use strict';
  const links = Array.from(document.querySelectorAll('.conference-photo-link'));
  const dialog = document.querySelector('.photo-viewer');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const photo = dialog.querySelector('.photo-viewer-image');
  const caption = dialog.querySelector('#photo-viewer-caption');
  const count = dialog.querySelector('.photo-viewer-count');
  let active = 0;
  let opener = null;
  let savedOverflow = '';

  function display(index) {
    active = (index + links.length) % links.length;
    const link = links[active];
    photo.alt = link.querySelector('img').alt;
    photo.width = Number(link.dataset.width);
    photo.height = Number(link.dataset.height);
    photo.src = link.href;
    caption.textContent = link.dataset.caption;
    count.textContent = (active + 1) + ' / ' + links.length;
  }

  links.forEach(function(link, index) {
    link.addEventListener('click', function(event) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      display(index);
      savedOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      dialog.showModal();
    });
  });

  dialog.querySelector('.photo-viewer-close').addEventListener('click', function() { dialog.close(); });
  dialog.querySelector('.photo-viewer-prev').addEventListener('click', function() { display(active - 1); });
  dialog.querySelector('.photo-viewer-next').addEventListener('click', function() { display(active + 1); });
  dialog.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      display(active + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  dialog.addEventListener('click', function(event) {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener('close', function() {
    document.documentElement.style.overflow = savedOverflow;
    photo.removeAttribute('src');
    if (opener && opener.getClientRects().length) opener.focus({ preventScroll: true });
  });
  window.addEventListener('hashchange', function() { if (dialog.open) dialog.close(); });
})();
