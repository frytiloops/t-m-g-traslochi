(() => {
 'use strict';
 const id = 'G-12B528Y2F0';
 const storageKey = 'montaggi-analytics-consent-v1';
 const allowedHost = /^(www\.)?montaggimobiliabruzzo\.it$/i.test(location.hostname);
 let consent = null;
 try { const saved=JSON.parse(localStorage.getItem(storageKey)); if(saved && ['accepted','rejected'].includes(saved.value) && Date.now()-saved.time < 180*86400000) consent=saved.value; } catch (_) {}
 let started = false;
 function loadAnalytics() {
  if (started || !allowedHost || !/^G-[A-Z0-9]+$/.test(id) || consent !== 'accepted') return;
  started = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ window.dataLayer.push(arguments); };
  window['ga-disable-'+id]=false;
  window.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  window.gtag('consent','update',{analytics_storage:'granted'});
  window.gtag('js',new Date());
  const safeReferrer=(()=>{try {const u=new URL(document.referrer);return u.origin+u.pathname;} catch(_){return '';}})();
  window.gtag('config',id,{allow_google_signals:false,allow_ad_personalization_signals:false,page_location:location.origin+location.pathname,page_referrer:safeReferrer,cookie_expires:15552000});
  const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+id;document.head.appendChild(script);
 }
 function track(name){ if(consent==='accepted' && started) window.gtag('event',name,{transport_type:'beacon'}); }
 const banner=document.createElement('section');
 banner.className='analytics-consent';banner.setAttribute('role','region');banner.setAttribute('aria-label','Preferenze statistiche');
 banner.innerHTML='<div><strong>Statistiche del sito</strong><p>Con il tuo consenso usiamo Google Analytics per capire come viene visitato il sito. Puoi rifiutare e continuare a navigare. <a href="privacy.html">Informazioni privacy</a></p></div><div class="consent-actions"><button type="button" data-consent="rejected">Rifiuta</button><button type="button" data-consent="accepted">Accetta statistiche</button></div>';
 banner.hidden=consent!==null;
 document.body.appendChild(banner);
 function saveChoice(value){
  consent=value;try{localStorage.setItem(storageKey,JSON.stringify({value,time:Date.now()}));}catch(_){}
  banner.hidden=true;
  if(value==='accepted') loadAnalytics();
  else {
   window['ga-disable-'+id]=true;
   if(started) window.gtag('consent','update',{analytics_storage:'denied'});
   // Remove Analytics cookies for the current host and shared parent domain.
   for(const item of document.cookie.split(';')) {const name=item.trim().split('=')[0];if(!/^_ga(?:_|$)/.test(name))continue;for(const domain of ['',location.hostname,'.montaggimobiliabruzzo.it'])document.cookie=name+'=; Max-Age=0; path=/'+(domain?'; domain='+domain:'')+'; SameSite=Lax; Secure';}
   if(started) location.reload();
  }
 }
 banner.addEventListener('click',e=>{const b=e.target.closest('[data-consent]');if(b)saveChoice(b.dataset.consent);});
 const preferences=document.createElement('button');preferences.type='button';preferences.className='analytics-preferences';preferences.textContent='Preferenze statistiche';preferences.addEventListener('click',()=>{banner.hidden=false;banner.querySelector('button').focus();});
 (document.querySelector('.site-footer .container')||document.body).appendChild(preferences);
 document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a)return;const href=a.getAttribute('href');if(href.startsWith('tel:'))track('contact_call');else if(/^https:\/\/wa\.me\//.test(href))track('contact_whatsapp');});
 const form=document.getElementById('quote-form');if(form)form.addEventListener('submit',()=>{if(form.checkValidity())track('quote_whatsapp_open');});
 loadAnalytics();
})();
