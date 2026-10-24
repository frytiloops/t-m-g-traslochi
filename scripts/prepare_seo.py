from pathlib import Path
import json,re
from xml.sax.saxutils import escape
ROOT=Path(__file__).resolve().parents[1]
DOMAIN='https://montaggimobiliabruzzo.it'
BRAND='Montaggi mobili cucine a Pescara'
PAGES={'index.html':('Montaggio mobili e cucine in Abruzzo | Adattamenti su misura','Squadra di installatori per mobili nuovi e cucine a Pescara e in Abruzzo. Tagli e adattamenti su misura, progetti di architetti e servizi per negozi.'),'montaggio-cucine.html':('Montaggio cucine a Pescara e in Abruzzo | Installazione','Installazione di cucine nuove, tagli e adattamenti su misura a Pescara e in Abruzzo. Lavoriamo anche su progetti di architetti e per negozi di arredamento.'),'montaggio-mobili.html':('Montaggio mobili nuovi a Pescara e in Abruzzo','Montatori per armadi, camere, soggiorni e mobili bagno nuovi. Tagli, adattamenti e installazione a Pescara, Silvi, Roseto, Giulianova, Teramo e Vasto.'),'preventivo.html':('Preventivo montaggio mobili e cucine in Abruzzo','Richiedi un preventivo per montaggio e adattamento di mobili nuovi e cucine. Invia progetto, misure e località su WhatsApp. Trasferte da concordare.'),'privacy.html':('Privacy e contatti | Montaggi mobili cucine a Pescara','Informazioni sul trattamento dei dati, sui contatti e sul funzionamento del modulo WhatsApp.')}
PAGES.update({'adattamento-mobili.html':('Adattamento mobili su misura Pescara | Tagli e montaggio','Tagli, rifilature e adattamenti di mobili nuovi durante il montaggio a Pescara e in Abruzzo. Inviaci progetto, foto e misure per valutare il lavoro.'),'montaggio-per-negozi-architetti.html':('Montaggio mobili per negozi e architetti in Abruzzo','Installatori di mobili nuovi e cucine per clienti privati, negozi e progetti di architetti. Montaggio e adattamenti a Pescara e in Abruzzo.')})
source=(ROOT/'index.html').read_text()
phone=re.search(r'href="tel:([^"]+)"',source)[1]
email=re.search(r'href="mailto:([^"]+)"',source)[1]
cities=['Pescara','Montesilvano','Silvi','Pineto','Roseto degli Abruzzi','Giulianova','Teramo','Vasto']
business={'@type':'LocalBusiness','@id':DOMAIN+'/#attivita','name':BRAND,'url':DOMAIN+'/','telephone':phone,'email':email,'vatID':'IT02368380685','address':{'@type':'PostalAddress','streetAddress':'Via Aldo Moro 50','postalCode':'65015','addressLocality':'Montesilvano','addressRegion':'PE','addressCountry':'IT'},'areaServed':cities,'description':'Montaggio, installazione e adattamento su misura di mobili nuovi e cucine. Nessun collegamento a gas, acqua o elettricità.'}
for base in [ROOT,ROOT/'tmg']:
 for f in base.glob('*.html'):
  if f.name.startswith('google'): continue
  s=f.read_text();name=f.name
  s=re.sub(r'<script type="application/ld\+json">.*?</script>','',s,flags=re.S)
  s=re.sub(r'<link rel="canonical"[^>]*>','',s)
  s=re.sub(r'<meta (?:property|name)="(?:og:[^"]*|twitter:[^"]*)"[^>]*>','',s)
  # Fonts supplied by the device avoid third-party requests and layout shifts.
  s=re.sub(r'<link[^>]+(?:fonts.googleapis.com|fonts.gstatic.com)[^>]*>','',s)
  canonical=DOMAIN+('/' if name=='index.html' else '/'+name)
  indexable=name in PAGES and base==ROOT and name!='privacy.html'
  s=re.sub(r'(<meta name="robots" content=")[^"]+',lambda m:m[1]+('index,follow,max-image-preview:large' if indexable else 'noindex,follow'),s)
  if name in PAGES:
   title,desc=PAGES[name]
   s=re.sub(r'<title>.*?</title>',lambda m:'<title>'+escape(title)+'</title>',s,flags=re.S)
   s=re.sub(r'<meta name="description"[^>]*>',lambda m:'<meta name="description" content="'+escape(desc,{'"':'&quot;'})+'">',s)
   graph=[business,{'@type':'WebPage','@id':canonical+'#pagina','url':canonical,'name':title,'description':desc,'inLanguage':'it-IT','about':{'@id':DOMAIN+'/#attivita'}}]
   if name not in ['privacy.html','preventivo.html']:
    graph.append({'@type':'Service','name':'Montaggio e adattamento su misura di '+('cucine nuove' if name=='montaggio-cucine.html' else 'mobili nuovi e cucine'),'url':canonical,'provider':{'@id':DOMAIN+'/#attivita'},'areaServed':cities})
   if name != 'index.html':
    graph.append({'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'Home','item':DOMAIN+'/'},{'@type':'ListItem','position':2,'name':title,'item':canonical}]})
   metadata=f'<link rel="canonical" href="{canonical}">\n<meta property="og:type" content="website">\n<meta property="og:locale" content="it_IT">\n<meta property="og:site_name" content="{BRAND}">\n<meta property="og:title" content="{escape(title)}">\n<meta property="og:description" content="{escape(desc)}">\n<meta property="og:url" content="{canonical}">\n<script type="application/ld+json">{json.dumps({"@context":"https://schema.org","@graph":graph},ensure_ascii=False)}</script>\n'
   s=s.replace('</head>',metadata+'</head>')
  if '<link rel="icon"' not in s:s=s.replace('</head>','<link rel="icon" href="assets/measure.svg" type="image/svg+xml"></head>')
  if 'href="privacy.html"' not in s:s=s.replace('<nav class="footer-nav"','<a href="privacy.html">Privacy</a><nav class="footer-nav"')
  # Equivalent page navigation on all viewports.
  if 'class="sticky-cta"' not in s:
   sticky=re.search(r'<div class="sticky-cta".*?</div>',source,re.S)[0]
   s=s.replace('</body>',sticky+'</body>')
  f.write_text(s)
(ROOT/'CNAME').write_text('montaggimobiliabruzzo.it\n')
urls=[DOMAIN+('/' if n=='index.html' else '/'+n) for n in PAGES if n!='privacy.html']
(ROOT/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join('  <url><loc>'+u+'</loc></url>\n' for u in urls)+'</urlset>\n')
(ROOT/'robots.txt').write_text('User-agent: *\nAllow: /\n\nSitemap: '+DOMAIN+'/sitemap.xml\n')
(ROOT/'tmg/robots.txt').write_text('# The crawler uses /robots.txt at the domain root.\n')
(ROOT/'tmg/sitemap.xml').write_text((ROOT/'sitemap.xml').read_text())
(ROOT/'.nojekyll').touch()
print('Prepared canonical URLs, crawl rules, sitemap, page metadata and structured data for selected domain. Not deployed.')
