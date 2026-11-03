const { chromium } = require('playwright');
(async()=>{
 const b=await chromium.launch(); const p=await b.newPage({viewport:{width:360,height:780}});
 const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push('console:'+m.text())});
 await p.route(/fonts\./, r=>r.abort());
 await p.goto('file://'+process.argv[2]);
 const steps=async()=>(await p.$$eval('article.card',as=>as.map(a=>a.querySelector('h3').textContent.slice(0,28)+' => '+(a.querySelector('.status')||{}).textContent))).join(' | ');
 const w=async(l)=>console.log(l,'scrollWidth',await p.evaluate(()=>document.documentElement.scrollWidth));
 await w('start');
 await p.click('[data-start="renter"]'); await w('search');
 const cards=await p.$$eval('article',a=>a.length); console.log('search cards',cards);
 await p.click('#play'); for(let i=0;i<6;i++){const q=await p.$('#qGo'); if(!q)break; await q.click();}
 await p.click('#toSaved'); await w('saved'); console.log('RENTER before:', await steps());
 await p.click('summary:has-text("What you told Scout")'); const flips=await p.$$eval('[data-flip]',f=>f.map(x=>x.dataset.flip)); console.log('flips',flips);
 if(flips.includes('cheques')){await p.click('[data-flip="cheques"]'); console.log('cheques firm:', await steps());}
 const det=await p.$('[data-detail]'); await det.click(); await w('detail');
 console.log('detail text sample:', (await p.textContent('main, #app')).replace(/\s+/g,' ').slice(0,300));
 console.log('errors',errs); await b.close();
})();
