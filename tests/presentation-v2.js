const { chromium } = require('playwright');
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:390,height:844}});
 const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.route(/fonts\./,r=>r.abort());
 await p.goto('file://'+process.argv[2]); const o=process.argv[3];
 const st=async()=>(await p.$$eval('article.card .status',l=>l.map(x=>x.textContent))).join(' | ');
 // open from search before saving
 await p.click('[data-start="buyer"]'); await p.click('[data-open="L24"]'); await p.waitForTimeout(200);
 console.log('detail from search:', (await p.textContent('#app')).replace(/\s+/g,' ').slice(170,520));
 await p.screenshot({path:o+'/v2-detail.png',fullPage:true});
 await p.click('[data-tab="search"]'); console.log('back to search ok:', !!(await p.$('#play')));
 await p.click('#play'); for(let i=0;i<10;i++){const q=await p.$('#qGo'); if(!q)break; await q.click();}
 await p.click('#toSaved'); await p.screenshot({path:o+'/v2-saved-before.png'});
 console.log('brief before:', (await p.textContent('.hero')).replace(/\s+/g,' ').slice(0,420));
 // agent preview
 await p.click('#p-CB [data-ask]'); await p.click('[data-via="scout"]'); console.log('agent preview:', (await p.textContent('.msg')).replace(/\s+/g,' ').slice(0,300));
 await p.screenshot({path:o+'/v2-ask.png',fullPage:true});
 await p.click('.tab[data-tab="saved"]');
 await p.click('#askAll'); await p.waitForTimeout(200);
 console.log('after approve-all:', await st());
 console.log('brief after:', (await p.textContent('.hero')).replace(/\s+/g,' ').slice(0,520));
 await p.screenshot({path:o+'/v2-saved-after.png'});
 await p.click('.tab[data-tab="answers"]'); console.log('extract boxes:', await p.$$eval('.extract',l=>l.length), (await p.$$eval('.extract',l=>l.map(x=>x.textContent.replace(/\s+/g,' ').slice(0,140)))).slice(0,2).join(' || '));
 await p.screenshot({path:o+'/v2-answers.png',fullPage:true});
 // renter approve-all
 await p.click('#restart'); await p.click('[data-start="renter"]'); await p.click('#play'); for(let i=0;i<10;i++){const q=await p.$('#qGo'); if(!q)break; await q.click();}
 await p.click('#toSaved'); await p.click('#askAll'); console.log('renter after approve-all:', await st());
 console.log('width', await p.evaluate(()=>document.documentElement.scrollWidth),'errors',errs); await b.close();})();
