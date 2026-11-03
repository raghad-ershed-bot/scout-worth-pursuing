const { chromium } = require('playwright');
(async()=>{
 const b=await chromium.launch(); const p=await b.newPage({viewport:{width:390,height:844}});
 const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.route(/fonts\./, r=>r.abort());
 await p.goto('file://'+process.argv[2]);
 const steps=async()=> (await p.$$eval('article.card',as=>as.map(a=>(a.querySelector('h3').textContent+' '+(a.querySelector('.xs.muted')?.textContent||'')).slice(0,60)+' => '+a.querySelector('.status').textContent))).join(' | ');
 async function setup(kind){ await p.click(`[data-start="${kind}"]`); await p.click('#play'); for(let i=0;i<6;i++){const q=await p.$('#qGo'); if(!q)break; await q.click();} await p.click('#toSaved'); }
 async function sendAll(){ const ids=await p.$$eval('article.card',as=>as.map(a=>a.id)); let k=0;
   for(const id of ids){ const btn=await p.$('#'+id+' [data-ask]'); if(!btn) continue; await btn.click();
     if(k++%2){await p.click('[data-via="scout"]'); await p.click('#sendScout');} else await p.click('#sendSelf');
     await p.click('[data-reply]'); await p.click('.tab[data-tab="saved"]'); } }
 await setup('renter'); await sendAll(); console.log('RENTER after:', await steps());
 console.log(' log:', (await p.$$eval('.log li',l=>l.map(x=>x.firstChild.textContent))).slice(0,4).join(' || '));
 await p.click('#restart'); await setup('buyer'); console.log('BUYER before:', await steps()); await sendAll(); console.log('BUYER after:', await steps());
 await p.click('[data-tab="answers"]').catch(()=>{}); await p.click('.tab[data-tab="answers"]');
 console.log(' answers:', (await p.$$eval('.msg.agent',l=>l.map(x=>x.textContent.replace(/\s+/g,' ')))).join(' || '));
 await p.click('#restart'); await setup('buyer'); await p.click('summary:has-text("What you told Scout")'); await p.click('[data-flip="purpose"]'); console.log('BUYER invest:', await steps());
 console.log('errors',errs); await b.close();
})();
