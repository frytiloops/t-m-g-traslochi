/* =====================================================
   Abruzzo Montaggi & Traslochi — JS
   - Invio modulo a WhatsApp con testo precompilato
   - Validazione base + prevenzione doppio invio
   - Smooth scroll per anchor link
   ===================================================== */

(function(){
  'use strict';

  // === CONFIG ===
  const WHATSAPP_NUMBER = '393489015752'; // numero reale senza +

  // Utility: encode testo per URL
  const enc = (s) => encodeURIComponent(String(s || '').trim());

  // Utility: normalizza telefono (rimuove spazi, +, parentesi, trattini)
  const normalizePhone = (s) => String(s || '').replace(/[\s()+-]/g, '');

  // Smooth scroll per link ancora (header nav / CTA)
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.pushState(null, '', `#${id}`);
  });

  // Modulo preventivo → WhatsApp
  const form = document.getElementById('quote-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn?.disabled) return; // evita doppio invio

      const data = new FormData(form);
      const name = data.get('name');
      const phone = data.get('phone');
      const city = data.get('city');
      const service = data.get('service');
      const date = data.get('date');
      const message = data.get('message');

      // Validazione minima
      const requiredFields = [
        ['name', name],
        ['phone', phone],
      ];

      let valid = true;
      requiredFields.forEach(([key, val]) => {
        const input = form.querySelector(`[name="${key}"]`);
        if (!String(val || '').trim()) {
          valid = false;
          if (input) {
            input.setAttribute('aria-invalid', 'true');
            input.classList.add('input-error');
          }
        } else {
          input?.removeAttribute('aria-invalid');
          input?.classList.remove('input-error');
        }
      });

      // Checkbox consenso (obbligatoria nel markup)
      const consent = form.querySelector('.consent input[type="checkbox"]');
      if (consent && !consent.checked) {
        valid = false;
        consent.focus();
      }

      if (!valid) {
        // feedback semplice
        toast('Compila i campi obbligatori contrassegnati con *');
        return;
      }

      // Prepara testo per WhatsApp
      const rows = [
        `Richiesta preventivo dal sito`,
        `Nome: ${name}`,
        `Telefono: ${phone}`,
        city ? `Città: ${city}` : '',
        service ? `Servizio: ${service}` : '',
        date ? `Data preferita: ${date}` : '',
        message ? `Messaggio: ${message}` : ''
      ].filter(Boolean);

      const text = rows.join('\n');

      // Disabilita bottone per evitare doppi click
      if (submitBtn) {
        submitBtn.disabled = true;
        const oldLabel = submitBtn.textContent;
        submitBtn.dataset.oldLabel = oldLabel;
        submitBtn.textContent = 'Apro WhatsApp…';
      }

      // Costruisci URL WhatsApp (web + mobile compatibile)
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${enc(text)}`;

      // Prova ad aprire in nuova scheda
      window.open(waUrl, '_blank', 'noopener');

      // Re-enable bottone dopo breve delay
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.oldLabel || 'Invia richiesta';
        }
      }, 1500);
    });
  }

  // Semplice toast non intrusivo (no dipendenze)
  function toast(msg) {
    let el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.style.position = 'fixed';
      el.style.left = '50%';
      el.style.bottom = '20px';
      el.style.transform = 'translateX(-50%)';
      el.style.background = '#111827';
      el.style.color = '#fff';
      el.style.padding = '10px 14px';
      el.style.borderRadius = '10px';
      el.style.boxShadow = '0 10px 25px rgba(0,0,0,.2)';
      el.style.fontSize = '14px';
      el.style.zIndex = '1000';
      el.style.opacity = '0';
      el.style.transition = 'opacity .2s ease';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    requestAnimationFrame(() => { el.style.opacity = '1'; });
    setTimeout(() => { el.style.opacity = '0'; }, 2200);
  }

  // Accessorio: evidenzia link attivo quando scorri
  const sections = document.querySelectorAll('section[id]');
  const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
  if (sections.length && navLinks.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(a => {
            const on = a.getAttribute('href') === `#${id}`;
            a.classList.toggle('active', !!on);
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
    sections.forEach(sec => obs.observe(sec));
  }

  // === GA4 Events: track WhatsApp and Call clicks ===
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a || typeof gtag !== 'function') return;
  
    // WhatsApp click
    if (a.href && a.href.includes('wa.me/393489015752')) {
      gtag('event', 'contact_whatsapp', {
        event_category: 'engagement',
        event_label: 'WhatsApp Click'
      });
    }
    // Phone call click
    if (a.href && a.href.startsWith('tel:+393489015752')) {
      gtag('event', 'contact_call', {
        event_category: 'engagement',
        event_label: 'Phone Call Click'
      });
    }
  });
})();
