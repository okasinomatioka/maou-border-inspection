import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {newGame,current,act,endNight,nextDay} from '../dist/engine.mjs';
const s=newGame(123);for(let d=1;d<=8;d++){while(s.queue.length)act(s,current(s).hero?'deny':'admit');if(d<8){endNight(s);nextDay(s);}}
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1050}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://127.0.0.1:4173');
 await page.evaluate(s=>localStorage.setItem('maou-border-v1',JSON.stringify(s)),s);
 await page.reload();await page.locator('[data-action="continue"]').click();
 await page.locator('[data-action="night"]').first().click();await page.locator('[data-action="end-night"]').click();
 assert.match(await page.locator('.report h1').innerText(),/守り抜いた/);
 const completed=await page.evaluate(()=>JSON.parse(localStorage.getItem('maou-border-v1')));
 assert.equal(completed.ending,undefined);
 await page.locator('[data-action="ending"]').click();assert.equal(await page.locator('.ending-frame h1').innerText(),'暁の門番');
 await page.locator('[data-action="ending-next"]').click();assert.equal(await page.locator('.ending-prose h2').innerText(),'魔王様');
 await page.screenshot({path:'/tmp/maou-ending-desktop.png',fullPage:true});
 await page.reload();await page.locator('[data-action="continue"]').click();assert.equal(await page.locator('.ending-prose h2').innerText(),'魔王様');
 await page.locator('[data-action="ending-back"]').click();assert.equal(await page.locator('.ending-prose h2').innerText(),'語り');
 await page.locator('[data-action="ending-skip"]').click();assert.equal(await page.locator('.ending-metrics>div').count(),9);assert.match(await page.locator('.ending-metrics').innerText(),/31 名/);
 await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:'/tmp/maou-ending-mobile.png',fullPage:true});
 await page.locator('[data-action="ending"]').click();for(let i=0;i<3;i++)await page.locator('[data-action="ending-next"]').click();assert.equal(await page.locator('.ending-result').count(),1);
 await page.locator('[data-action="title"]').click();await page.locator('[data-action="continue"]').click();assert.equal(await page.locator('.ending-result').count(),1);
 for(const [phase,troops,history,title] of [['won',100,[{action:'殺害',hero:false}],'鉄の門、静かな城'],['won',30,[],'傷だらけの凱旋'],['won',60,[],'明日も開く門'],['lost',50,[],'最後の入城許可'],['lost',0,[],'誰も守れない城']]){
  const state={...completed,phase,troops,history:[...completed.history,...history]};delete state.ending;
  await page.evaluate(s=>localStorage.setItem('maou-border-v1',JSON.stringify(s)),state);await page.reload();await page.locator('[data-action="continue"]').click();await page.locator('[data-action="ending"]').click();assert.equal(await page.locator('.ending-frame h1').innerText(),title);await page.locator('[data-action="ending-skip"]').click();
 }
 await page.locator('[data-action="restart"]').click();await page.locator('[data-action="close"]').last().click();assert.equal(await page.locator('.visitor-area').count(),1);
 assert.deepEqual(errors,[]);console.log('PASS: day-eight transition, six endings, story navigation, skip, replay, old saves, resume, restart, mobile, no browser errors.');
}finally{await browser.close();}
