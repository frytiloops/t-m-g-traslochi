'use strict';
const form = document.getElementById('quote-form');
if (form) form.addEventListener('submit', (event) => {
 event.preventDefault();
 for (const field of form.querySelectorAll('[required]')) {
  field.value = field.value.trim();
 }
 if (!form.reportValidity()) return;
 const data = new FormData(form);
 const rows = ['Richiesta montaggio mobili nuovi', ...['name','city','service','period','message'].map((key,i) => ['Nome','Comune','Servizio','Periodo','Dettagli'][i] + ': ' + String(data.get(key)||'').trim())];
 window.location.assign('https://wa.me/393489015752?text=' + encodeURIComponent(rows.join('\n')));
});
