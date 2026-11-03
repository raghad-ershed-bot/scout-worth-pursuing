const { chromium } = require('playwright');
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:390,height:1500}});
 await p.goto('file://'+process.argv[2]); await p.waitForTimeout(800);
 await p.click('[data-start="renter"]'); await p.screenshot({path:process.argv[3]+'/s1.png'});
 await p.click('#play'); for(let i=0;i<6;i++){const q=await p.$('#qGo'); if(!q)break; await p.waitForTimeout(250); if(i==2) await p.screenshot({path:process.argv[3]+'/s2.png'}); await q.click();}
 await p.click('#toSaved'); await p.waitForTimeout(300); await p.screenshot({path:process.argv[3]+'/s3.png'}); await b.close();})();
