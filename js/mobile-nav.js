'use strict';
(() => {
 const year = document.getElementById('y');
 if (year) year.textContent = new Date().getFullYear();
 const header = document.querySelector('.header-inner');
 const nav = header?.querySelector('.nav');
 if (!nav) return;
 nav.id = 'primary-navigation';
 const button = document.createElement('button');
 button.className = 'mobile-menu-toggle';
 button.type = 'button';
 button.textContent = 'Menu';
 button.setAttribute('aria-controls', nav.id);
 button.setAttribute('aria-expanded', 'false');
 button.setAttribute('aria-label', 'Apri menu di navigazione');
 function close() {
  nav.classList.remove('is-open');
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-label', 'Apri menu di navigazione');
  button.textContent = 'Menu';
 }
 button.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  button.setAttribute('aria-expanded', String(open));
  button.setAttribute('aria-label', open ? 'Chiudi menu di navigazione' : 'Apri menu di navigazione');
  button.textContent = open ? 'Chiudi' : 'Menu';
 });
 nav.addEventListener('click', event => { if (event.target.closest('a')) close(); });
 header.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('is-open')) {
   close();
   button.focus();
  }
 });
 header.insertBefore(button, nav);
 header.classList.add('mobile-ready');
})();
