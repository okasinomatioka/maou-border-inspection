import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {newGame,act,endNight} from '../dist/engine.mjs';

const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1050}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
async function resume(s){
 await page.evaluate(s=>localStorage.setItem('maou-border-v1',JSON.stringify(s)),s);
 await page.reload();await page.locator('[data-action="continue"]').click();
}
const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('maou-border-v1')));
async function night(){await page.locator('[data-action="night"]').first().click();await page.locator('[data-action="end-night"]').click();}
try{
 await page.goto('http://127.0.0.1:4173');await resume(newGame(132));
 assert.equal(await page.locator('.decisions button').count(),5);
 await page.locator('[data-action="disposition-help"]').click();assert.match(await page.locator('#modal').innerText(),/今夜35％/);
 await page.locator('[data-action="close"]').last().click();
 await page.screenshot({path:'/tmp/maou-dispositions-desktop.png',fullPage:true});
 for(const width of [390,768]){
  await page.setViewportSize({width,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  for(const b of await page.locator('.decisions button').all()){const box=await b.boundingBox();assert.ok(box.width>60);}
  if(width===390)await page.screenshot({path:'/tmp/maou-dispositions-mobile.png',fullPage:true});
 }
 await page.setViewportSize({width:1440,height:1050});
 await page.locator('[data-decision="admit"]').click();await page.locator('[data-decision="deny"]').click();
 assert.match(await page.locator('.border-watch').innerText(),/入国拒否\s*1名/);
 const pending=await saved();await page.reload();await page.locator('[data-action="continue"]').click();assert.deepEqual(await saved(),pending);
 await page.locator('[data-decision="admit"]').click();await night();
 assert.match(await page.locator('.border-report').innerText(),/リュカ.*裏口から侵入/);
 assert.equal((await saved()).infiltrations,1);
 await page.locator('[data-action="next"]').click();await page.locator('[data-action="close"]').last().click();
 await page.locator('[data-action="roster"]').click();
 await page.locator('#modal [data-action="select"][data-id="1"]').click();
 assert.equal(await page.locator('[data-decision="deny"]').isDisabled(),true);
 await page.locator('[data-decision="kill"]').click();await page.locator('[data-action="execute"]').click();
 assert.equal((await saved()).residents.some(c=>c.id===1),false);

 const gate=newGame(19);gate.queue=gate.queue.filter(c=>c.hero);await resume(gate);
 await page.locator('[data-decision="expel"]').click();assert.match(await page.locator('#modal').innerText(),/今夜5％/);
 await page.locator('[data-action="execute"]').click();assert.equal((await saved()).troops,92);assert.equal((await saved()).border.length,1);
 await night();assert.match(await page.locator('.border-report').innerText(),/侵入はありません/);

 const last=newGame(132);last.day=8;last.queue=last.queue.filter(c=>c.hero);last.residents=[{...last.queue[0],id:99},{...last.queue[0],id:100}];
 await resume(last);await page.locator('[data-decision="deny"]').click();await night();
 assert.equal((await saved()).night.heroes,3);assert.equal((await saved()).night.chance,20);
 assert.match(await page.locator('.border-report').innerText(),/裏口から侵入/);

 const old=newGame(3);while(old.queue.length)act(old,'admit');endNight(old);delete old.border;delete old.infiltrations;delete old.night.border;
 await resume(old);assert.equal(await page.locator('.report').count(),1);assert.equal(await page.locator('.border-report').count(),0);
 assert.deepEqual(errors,[]);console.log('PASS: five choices, comparison guide, phone/tablet, pending save reload, infiltration report, resident removal, gate exile, final night, legacy report.');
}finally{await browser.close();}
