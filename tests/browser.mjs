import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1050},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
const response=await page.goto('http://127.0.0.1:4173');
assert.equal(response.status(),200);
await page.screenshot({path:'/tmp/maou-title.png',fullPage:true});
await page.locator('[data-action="new"]').click();await page.locator('[data-action="close"]').last().click();
await page.screenshot({path:'/tmp/maou-game.png',fullPage:true});
await page.locator('[data-action="inspect"][data-tool="0"]').click();
assert.match(await page.locator('.inspection-note').innerText(),/基本書類は有効/);
await page.locator('[data-decision="admit"]').click();
await page.locator('[data-decision="hold"]').click();
await page.locator('.cell.occupied').click();
await page.locator('[data-action="inspect"][data-tool="0"]').click();
assert.match(await page.locator('.inspection-note').innerText(),/書類に不一致/);
await page.locator('[data-decision="expel"]').click();
await page.locator('[data-action="execute"]').click();
await page.locator('[data-decision="admit"]').click();
await page.locator('[data-action="night"]').first().click();await page.locator('[data-action="end-night"]').click();
await page.locator('[data-action="next"]').click();await page.locator('[data-action="close"]').last().click();
await page.reload();await page.locator('[data-action="continue"]').click();
assert.match(await page.locator('.stat').first().innerText(),/02/);
await page.setViewportSize({width:390,height:844});
await page.screenshot({path:'/tmp/maou-mobile.png',fullPage:true});
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
await page.setViewportSize({width:1440,height:1050});
// Play the remainder using only the evidence exposed by the actual UI.
for(let day=2;day<=8;day++){
 while(await page.locator('.visitor-area').count()){
  const tools=page.locator('.tool:not([disabled])');
  const n=await tools.count();
  for(let i=0;i<n;i++)await page.locator(`[data-action="inspect"][data-tool="${i}"]`).click();
  const bad=await page.locator('.evidence-list .bad').count();
  await page.locator(`[data-decision="${bad?'deny':'admit'}"]`).click();
 }
 await page.locator('[data-action="night"]').first().click();await page.locator('[data-action="end-night"]').click();
 if(day<8){await page.locator('[data-action="next"]').click();await page.locator('[data-action="close"]').last().click();}
}
assert.match(await page.locator('.report h1').innerText(),/魔王様を守り抜いた/);
await page.screenshot({path:'/tmp/maou-win.png',fullPage:true});
assert.deepEqual(errors,[]);
console.log('PASS: desktop, mobile, quarantine, expulsion, reload/resume, all 8 days, victory, no console errors.');
}finally{await browser.close();}
