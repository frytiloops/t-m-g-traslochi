const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const source=fs.readFileSync('js/analytics.js','utf8');
function scenario(saved,host='montaggimobiliabruzzo.it',storageBlocked=false){
 const scripts=[],handlers={},nodes=[],queue=[];
 const doc={referrer:'https://example.org/page?email=private@example.org',cookie:'',head:{appendChild:s=>scripts.push(s)},body:{appendChild:n=>nodes.push(n)},createElement:()=>({setAttribute(){},addEventListener(e,fn){this[e]=fn},querySelector(){return {focus(){}}}}),querySelector:()=>null,getElementById:()=>null,addEventListener:(e,fn)=>handlers[e]=fn};
 const location={hostname:host,origin:'https://'+host,pathname:'/',search:'?name=Private',reload(){}};
 const localStorage={getItem(){if(storageBlocked)throw Error();return saved?JSON.stringify({value:saved,time:Date.now()}):null},setItem(){if(storageBlocked)throw Error();}};
 const window={dataLayer:queue};vm.runInNewContext(source,{document:doc,location,localStorage,window,Date,URL});return {scripts,nodes,window,handlers};
}
for (const choice of [null,'rejected']){const s=scenario(choice);assert.equal(s.scripts.length,0,'no Google script before consent or after rejection');}
const a=scenario(null);a.nodes[0].click({target:{closest:()=>({dataset:{consent:'accepted'}})}});assert.equal(a.scripts.length,1);assert.equal(a.nodes[0].hidden,true);
const config=a.window.dataLayer.map(x=>Array.from(x)).find(x=>x[0]==='config');assert.equal(config[2].page_location,'https://montaggimobiliabruzzo.it/');assert.equal(config[2].page_referrer,'https://example.org/page');assert.equal(config[2].allow_google_signals,false);
a.handlers.click({target:{closest:()=>({getAttribute:()=> 'tel:+390000'})}});assert.ok(a.window.dataLayer.map(x=>Array.from(x)).some(x=>x[0]==='event'&&x[1]==='contact_call'));
assert.equal(scenario('accepted','localhost').scripts.length,0);
assert.equal(scenario(null,'montaggimobiliabruzzo.it',true).scripts.length,0);
console.log('PASS: no collection before consent/after rejection, accepted collection, sanitized page URLs, no local-preview collection, blocked storage fallback, contact event.');
