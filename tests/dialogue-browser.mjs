import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {newGame,makeDay} from '../dist/engine.mjs';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1050}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://127.0.0.1:4173');
 await page.locator('[data-action="new"]').click();await page.locator('[data-action="close"]').last().click();
 const greeting=await page.locator('.spoken-line').innerText();
 await page.locator('[data-action="talk"][data-topic="purpose"]').click();
 assert.notEqual(await page.locator('.spoken-line').innerText(),greeting);
 await page.locator('[data-action="talk"][data-topic="cargo"]').click();
 assert.match(await page.locator('.spoken-line').innerText(),/フワ・チク/);
 await page.reload();await page.locator('[data-action="continue"]').click();
 assert.equal(await page.locator('[data-topic="cargo"]').getAttribute('aria-pressed'),'true');
 const s=newGame(7);for(let d=2;d<=7;d++){s.day=d;makeDay(s);}
 // Simulate a v1 save without any of the new conversation fields.
 const old=s.queue[0];delete old.dialogueVersion;delete old.dialogue;delete old.speechTopic;old.quote='遠い道でした。中へ入れていただけますか。';
 await page.evaluate(s=>localStorage.setItem('maou-border-v1',JSON.stringify(s)),s);
 await page.reload();await page.locator('[data-action="continue"]').click();
 assert.doesNotMatch(await page.locator('.spoken-line').innerText(),/遠い道でした/);
 await page.locator('[data-tool="6"]').click();
 const translated=await page.locator('.inspection-note').innerText();
 assert.match(translated,/新しい鎧を打ちに来た/);
 await page.locator('[data-topic="cargo"]').click();
 assert.match(await page.locator('.inspection-note').innerText(),/修理を預かった聖剣/);
 assert.doesNotMatch(await page.locator('.inspection-note').innerText(),/新しい鎧を打ちに来た/);
 await page.setViewportSize({width:390,height:844});
 for(const topic of ['greeting','purpose','cargo'])await page.locator(`[data-topic="${topic}"]`).click();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:'/tmp/maou-dialogue-mobile.png',fullPage:true});
 await page.setViewportSize({width:1440,height:1050});
 await page.screenshot({path:'/tmp/maou-dialogue-desktop.png',fullPage:true});
 assert.deepEqual(errors,[]);
 console.log('PASS: questions, matching translations, live translation refresh, saved topic, v1 save migration, mobile controls, no browser errors.');
}finally{await browser.close();}
