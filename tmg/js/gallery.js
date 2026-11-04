'use strict';
(() => {
 const gallery = document.getElementById('montaggi-gallery');
 if (!gallery) return;
 const figures = [...gallery.querySelectorAll('figure')];
 const links = [...gallery.querySelectorAll('.gallery-photo')];
 const more = document.getElementById('gallery-more');
 const count = document.getElementById('gallery-count');
 let visible = 0;
 function reveal() {
  visible = Math.min(visible + 12, figures.length);
  figures.forEach((figure, i) => { figure.hidden = i >= visible; });
  count.textContent = `${visible} di ${figures.length} foto`;
  more.hidden = visible === figures.length;
 }
 more.addEventListener('click', () => {
  const firstNew = visible;
  reveal();
  links[firstNew]?.focus({preventScroll: true});
 });
 reveal();
 const dialog = document.createElement('dialog');
 dialog.className = 'gallery-dialog';
 dialog.setAttribute('aria-label', 'Fotografie dei nostri montaggi');
 dialog.innerHTML = '<button type="button" class="gallery-close" aria-label="Chiudi fotografia">✕</button><div class="gallery-view"><button type="button" class="gallery-prev" aria-label="Foto precedente">‹</button><img alt=""><button type="button" class="gallery-next" aria-label="Foto successiva">›</button></div><p aria-live="polite"></p>';
 document.body.appendChild(dialog);
 const image = dialog.querySelector('img');
 const caption = dialog.querySelector('p');
 let current = 0;
 let opener;
 function show(index) {
  current = (index + links.length) % links.length;
  image.src = links[current].href;
  image.alt = links[current].querySelector('img').alt;
  caption.textContent = `${current + 1} / ${links.length} — ${figures[current].querySelector('figcaption').textContent}`;
 }
 links.forEach((link, i) => link.addEventListener('click', event => {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  if (typeof dialog.showModal !== 'function') return;
  event.preventDefault();
  opener = link;
  show(i);
  dialog.showModal();
  document.body.classList.add('gallery-open');
 }));
 dialog.querySelector('.gallery-close').addEventListener('click', () => dialog.close());
 dialog.querySelector('.gallery-prev').addEventListener('click', () => show(current - 1));
 dialog.querySelector('.gallery-next').addEventListener('click', () => show(current + 1));
 dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
   event.preventDefault();
   show(current + (event.key === 'ArrowRight' ? 1 : -1));
  }
 });
 dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
 dialog.addEventListener('close', () => {
  document.body.classList.remove('gallery-open');
  image.removeAttribute('src');
  opener?.focus({preventScroll: true});
 });
})();
