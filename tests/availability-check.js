// Availability rule check on the frozen build. The last case injects state: no scripted reply says "unavailable".
const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});await p.route(/fonts\./,r=>r.abort());
await p.goto('file://'+process.argv[2]);await p.click('[data-start=renter]');await p.click('#play');for(let i=0;i<10;i++){const q=await p.$('#qGo');if(!q)break;await q.click();}
await p.click('#toSaved');
const av=async pid=>p.$eval('#p-'+pid,a=>a.querySelector('.status').textContent+' | '+[...a.querySelectorAll('.crow')].map(r=>r.textContent.replace(/\s+/g,' ')).filter(t=>t.includes('Available now')).join(''));
console.log('#15 before any reply:',await av('L15'));
await p.click('#p-L12 [data-ask]');await p.click('#sendSelf');await p.click('[data-reply="L12"]');await p.click('.tab[data-tab="saved"]');
console.log('#12 after no reply:  ',await av('L12'));
await p.click('#p-L15 [data-ask]');await p.click('#sendSelf');await p.click('[data-reply="L15"]');await p.click('.tab[data-tab="saved"]');
console.log('#15 after reply:     ',await av('L15'));
await p.evaluate(()=>{S.answers['L15'].available='No longer available (agent says).';render();});
console.log('#15 with an injected "unavailable" answer (known limitation):',await av('L15'));await b.close();})();
