const { chromium, devices } = require('playwright');
(async()=>{ const b=await chromium.launch(); const ctx=await b.newContext({...devices['iPhone 13']}); const p=await ctx.newPage();
 const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.route(/fonts\./,r=>r.abort());
 await p.goto('file://'+process.argv[2]); await p.waitForTimeout(300);
 const m=async()=>p.evaluate(()=>({inner:innerWidth, scroll:document.documentElement.scrollWidth, mode:document.compatMode}));
 console.log('start', JSON.stringify(await m())); await p.screenshot({path:process.argv[3]});
 await p.click('[data-start="buyer"]'); await p.click('#play'); for(let i=0;i<10;i++){const q=await p.$('#qGo'); if(!q)break; await q.click();}
 await p.click('#toSaved'); console.log('saved', JSON.stringify(await m())); await p.click('#askAll');
 console.log('status', (await p.$$eval('article.card .status',l=>l.map(x=>x.textContent))).join(' | '), 'errors', errs); await b.close(); })();
