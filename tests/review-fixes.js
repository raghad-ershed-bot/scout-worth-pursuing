const { chromium } = require('playwright');
(async()=>{
 const b=await chromium.launch(); const p=await b.newPage({viewport:{width:390,height:844}});
 const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.route(/fonts\./, r=>r.abort());
 await p.goto('file://'+process.argv[2]);
 const card=async pid=>p.$eval('#p-'+pid,a=>a.querySelector('.status').textContent+' | '+(a.querySelector('.why')?.textContent||''));
 const rowsOf=async(pid,k)=>p.$eval('#p-'+pid,(a,k)=>[...a.querySelectorAll('.crow')].map(r=>r.textContent.replace(/\s+/g,' ')).filter(t=>t.includes(k)).join(' || '),k);
 async function setup(kind, ans={}){ await p.click(`[data-start="${kind}"]`); await p.click('#play');
   for(let i=0;i<10;i++){const q=await p.$('#qGo'); if(!q)break; const t=await p.textContent('#qT');
     for(const [k,{v,f}] of Object.entries(ans)) if(t.includes(k)){ if(v) await p.click(`#qO [data-v="${v}"]`); if(f) await p.click(`#qF [data-f="${f}"]`); }
     await q.click();}
   await p.click('#toSaved'); }
 async function send(pid,{target,via='self'}={}){ await p.click(`#p-${pid} [data-ask]`); if(target) await p.click(`[data-target="${target}"]`);
   if(via==='scout'){await p.click('[data-via="scout"]'); await p.click('#sendScout');} else await p.click('#sendSelf');
   await p.click(`[data-reply="${pid}"]`); const r=await p.$$eval('.card:last-of-type .msg.agent, .msg.agent',l=>l.map(x=>x.textContent.replace(/\s+/g,' ')));
   await p.click('.tab[data-tab="saved"]'); return r; }
 const restart=async()=>{ await p.click('#restart'); };
 const out=(...a)=>console.log(...a);

 out('\n== KEEP ANYWAY ==');
 await setup('renter'); await send('L7'); out('#7 after reply:', await card('L7'));
 await p.click('[data-keep="L7"]'); out('#7 kept:      ', await card('L7'));
 await restart(); await setup('renter',{'cheques':{v:'4',f:'firm'}}); out('#5 cheques firm:', await card('L5'));
 await p.click('[data-keep="L5"]'); out('#5 kept:        ', await card('L5'));

 out('\n== AGENCY SELECTION ==');
 for(const tg of ['19','29','all']){ await restart(); await setup('buyer'); const r=await send('CB',{target:tg});
   out(`CB target=${tg} replies(${r.length}):`, r.map(x=>x.replace(/.*SIMULATED/,'')).join(' / '));
   out('   price row:', await rowsOf('CB','Which price')); out('   step:', await card('CB')); }
 await restart(); await setup('buyer'); await send('CA',{target:'25'}); out('CA target=25 occupancy:', await rowsOf('CA','Occupancy'));

 out('\n== EDITED MESSAGE ==');
 await restart(); await setup('buyer'); await p.click('#p-CB [data-ask]'); await p.fill('#draft','MY EDIT');
 await p.click('[data-target="29"]'); out('after agency change:', await p.inputValue('#draft'));
 await p.click('[data-via="scout"]'); out('after via change:   ', await p.inputValue('#draft'));
 await p.click('[data-via="self"]'); out('wa link has edit:   ', (await p.getAttribute('#wa','href')).includes('MY%20EDIT'));
 out('reset note shown:   ', !!(await p.$('#resetDraft'))); await p.click('#resetDraft'); out('after reset:        ', (await p.inputValue('#draft')).slice(0,60));
 await p.fill('#draft','MY EDIT 2'); await p.click('#sendSelf'); out('sent text:          ', (await p.$$eval('.msg p.small',l=>l.map(x=>x.textContent))).find(x=>x.includes('MY EDIT'))); 
 await p.click('.tab[data-tab="saved"]'); await p.click('#p-L18 [data-ask]'); out('new ask flow fresh: ', (await p.inputValue('#draft')).slice(0,40));
 out('scout button label: ', await p.textContent('[data-via="scout"]'));

 out('\n== CONFLICTING PRICES (budget set in state; UI budget is fixed at AED 1,000,000) ==');
 for(const v of [980000, 950000, 1000000]){ await p.evaluate(v=>{S.c.budget.value=v; S.view='saved'; render();},v);
   out(`budget ${v}: CB =>`, await card('CB')); out('   budget row:', await rowsOf('CB','Budget')); }
 await p.evaluate(()=>{S.c.budget.value=1000000; render();});

 out('\n== CHEQUE FLEXIBILITY ==');
 for(const [min,f] of [['4','flexible'],['6','flexible']]){ await restart(); await setup('renter',{'cheques':{v:min,f}});
   out(`min ${min} ${f}, before:`, await card('L5')); await send('L5'); out('   after reply:', await card('L5')); out('   cheques row:', await rowsOf('L5','Cheques'));
   await p.click('summary:has-text("What you told Scout")'); await p.click('[data-flip="cheques"]'); out('   flipped to firm:', await card('L5')); }

 out('\n== TENANCY DATE (#24, agent: tenanted until Aug 2027) ==');
 for(const [d,f] of [['2027-02-01','firm'],['2027-06-01','flexible'],['2027-12-01','firm']]){ await restart(); await setup('buyer',{'move in':{v:d,f}});
   await send('L24'); out(`move-in ${d} ${f}:`, await card('L24')); out('   row:', await rowsOf('L24','Occupancy')); }

 out('\n== GROUPED BLOCK ==');
 for(const k of ['renter','buyer']){ await restart(); await setup(k); await p.click('summary:has-text("Grouped and labelled")');
   out(k+':', (await p.$eval('details:has(summary:has-text("Grouped and labelled"))',d=>d.textContent)).replace(/\s+/g,' ')); }
 out('\nscrollWidth', await p.evaluate(()=>document.documentElement.scrollWidth), 'errors', errs);
 await b.close();
})();
