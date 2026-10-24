# Migrazione — stato: anteprima locale, non pubblicata

Il dominio precedente non è stato rinnovato. Nessun DNS, CNAME o impostazione Pages è stato modificato. Tutte le pagine hanno noindex,nofollow fino al lancio.

## Inventario dal repository
- / e /index.html → nuova home
- /preventivo.html → nuovo contatto WhatsApp
- /traslochi-pescara.html, /traslochi-montesilvano.html, /traslochi-chieti.html → servizio cessato; risposta 410 raccomandata sul vecchio host, senza redirect non pertinente
- /tmg/index.html e /tmg/preventivo.html → copie storiche; redirect 301 alle rispettive pagine principali sul nuovo dominio
- /tmg/ → redirect 301 alla home
- immagini in /assets/ e /tmg/assets/: inventario da confrontare con Search Console prima di rimuoverle

## Prima del lancio
1. Scegliere dominio su Aruba; confermare telefono, dati fiscali, titolare privacy e lavorazioni effettivamente offerte.
2. Conservare snapshot della versione precedente. Integrare URL da Search Console, analytics e link esterni: questo inventario del repository non dimostra l'assenza di altri URL.
3. Verificare proprietà/recuperabilità del vecchio dominio: senza il suo controllo non si possono attivare redirect o trasferire i segnali tramite Change of Address. Non presumere che sia ancora acquistabile.
4. Decidere hosting: acquistare dominio su Aruba non significa necessariamente spostare hosting da GitHub Pages. GitHub Pages non fornisce redirect HTTP 301/410 configurabili tramite .htaccess; per quelli serve un host/proxy compatibile. Aruba va verificato sul piano scelto.
5. Configurare HTTPS su tutti gli host gestiti. Canonical assoluti autoreferenziali sul nuovo dominio; /index.html e /tmg copie devono convergere con 301. Completare sitemap con i soli URL canonici, robots e Open Graph. Rimuovere noindex solo dal sito definitivo e lasciare le pagine cessate escluse.
6. Completare informativa privacy; verificare collegamenti telefono/email/WhatsApp e inserire foto reali autorizzate. Non sono presenti promesse di assicurazione, tempi garantiti o recensioni inventate.
7. Testare URL vecchi e nuovi: un salto al contenuto pertinente, nessun ciclo, nessun redirect indiscriminato delle pagine cessate alla home. Provare HTTP/HTTPS e www/non-www, navigazione mobile e modulo.
8. Search Console: verificare entrambi i domini, nuova sitemap e Change of Address quando applicabile. Aggiornare profili, eventuali annunci e collegamenti esterni. Conservare vecchio dominio/redirect almeno un anno, preferibilmente oltre.
9. Confrontare indicizzazione, errori e richieste reali con una baseline. I clic WhatsApp non dimostrano messaggi inviati o clienti acquisiti.

## Contenuti
Solo nuova mobilia: nessun servizio di trasporto, usato, smontaggio/rimontaggio o smaltimento. La pagina FAQ chiarisce le esclusioni. Nessuna promessa di fabbricazione su misura o allacciamenti.
