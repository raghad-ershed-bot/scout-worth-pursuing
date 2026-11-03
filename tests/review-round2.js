const { chromium } = require('playwright');
(async()=>{
 const b=await chromium.launch(); const p=await b.newPage({viewport:{width:390,height:844}});
 const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.route(/fonts\./, r=>r.abort());
 await p.goto('file://'+process.argv[2]);
 const card=async pid=>p.$eval('#p-'+pid,a=>a.querySelector('.status').textContent+' | '+(a.querySelector('.why')?.textContent||'')+(a.querySelector('.why+p.xs')?' | '+a.querySelector('.why+p.xs').textContent:''));
 const rowsOf=async(pid,k)=>p.$eval('#p-'+pid,(a,k)=>[...a.querySelectorAll('.crow')].map(r=>r.textContent.replace(/\s+/g,' ')).filter(t=>t.includes(k)).join(' || '),k);
 async function setup(kind, ans={}){ await p.click(`[data-start="${kind}"]`); await p.click('#play');
   for(let i=0;i<10;i++){const q=await p.$('#qGo'); if(!q)break; const t=await p.textContent('#qT');
     for(const [k,{v,f}] of Object.entries(ans)) if(t.includes(k)){ if(v) await p.click(`#qO [data-v="${v}"]`); if(f) await p.click(`#qF [data-f="${f}"]`); }
     await q.click();}
   await p.click('#toSaved'); }
 async function send(pid){ await p.click(`#p-${pid} [data-ask]`); await p.click('#sendSelf'); await p.click(`[data-reply="${pid}"]`); await p.click('.tab[data-tab="saved"]'); }
 const out=(...a)=>console.log(...a);

 out('== KEEP ANYWAY → PROCEED DESPITE CONFLICT ==');
 await setup('renter'); await send('L7'); out('#7 before keep:', await card('L7'));
 await p.click('[data-keep="L7"]'); out('#7 after keep: ', await card('L7')); out('   budget row still:', await rowsOf('L7','Budget'));
 out('   hero:', (await p.textContent('.hero h2'))); out('   log top:', (await p.$$eval('details[open] p.small',l=>l.map(x=>x.textContent)))[0]);
 await p.click('#restart'); await setup('renter',{'cheques':{v:'4',f:'firm'}}); await p.click('[data-keep="L5"]'); out('#5 cheques firm, kept:', await card('L5'));
 out('   has ask button:', !!(await p.$('#p-L5 [data-ask]')), '| has Ready label:', (await card('L5')).startsWith('Ready'));

 out('\n== COUNTEREXAMPLE: listing with 3 cheques, user needs 4 (SYNTHETIC test listing #999, a copy of #15 with cheques=3; not in the shipped data) ==');
 for(const f of ['flexible','firm']){ await p.click('#restart'); await setup('renter',{'cheques':{v:'4',f}});
   await p.evaluate(()=>{ L.push({...byNo(15), audit_no:999, listing_id:'TEST-999', cheques:3}); S.saved.push(999); render(); });
   out(`need 4 (${f}):`, await card('L999')); out('   cheques row:', await rowsOf('L999','Cheques'));
   await p.evaluate(()=>{ L.pop(); S.saved=S.saved.filter(n=>n!==999); }); }

 out('\n== CHANGE CHEQUE REQUIREMENT AFTER THE AGENT REPLIED (#5, agent: accepts 4) ==');
 await p.click('#restart'); await setup('renter',{'cheques':{v:'4',f:'flexible'}}); await send('L5'); out('need 4 flexible, after reply:', await card('L5'));
 for(const [min,firm] of [[6,'flexible'],[6,'firm'],[2,'firm']]){ await p.evaluate(([m,f])=>{S.c.cheques={min:m,firm:f}; render();},[min,firm]);
   out(`requirement → ${min} ${firm}:`, await card('L5')); out('   row:', await rowsOf('L5','Cheques')); }
 out('   (UI only flips firm/flexible; the minimum was changed in state for this test)');

 out('\n== TENANCY: month-only answer "until August 2027" (#24) ==');
 for(const [d,f,via] of [['2027-02-01','firm','UI'],['2027-06-01','flexible','UI'],['2027-12-01','firm','UI'],['2027-07-31','firm','state'],['2027-08-15','firm','state'],['2027-09-01','firm','state'],['2027-09-02','firm','state']]){
   await p.click('#restart');
   if(via==='UI'){ await setup('buyer',{'move in':{v:d,f}}); await send('L24'); }
   else { await setup('buyer'); await send('L24'); await p.evaluate(([d,f])=>{S.c.moveIn={date:d,firm:f}; render();},[d,f]); }
   out(`move-in ${d} ${f} (${via}):`, (await card('L24')).split(' | ')[0]); out('   row:', await rowsOf('L24','Occupancy'));
   if(d==='2027-08-15'){ await p.click('#p-L24 [data-ask]'); out('   ask draft:', (await p.inputValue('#draft')).split('\n').filter(x=>/^\d\)/.test(x)).join(' / ')); await p.click('.tab[data-tab="saved"]'); } }
 out('\nscrollWidth', await p.evaluate(()=>document.documentElement.scrollWidth), 'errors', errs);
 await b.close();
})();
