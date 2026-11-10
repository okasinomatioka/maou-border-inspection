import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1050}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
async function ask(question){await page.locator('#free-question').fill(question);await page.locator('#question-form button[type="submit"]').click();}
try{
 await page.goto('http://127.0.0.1:4173');await page.locator('[data-action="new"]').click();await page.locator('[data-action="close"]').last().click();
 await ask('薬草を持っていますか？');assert.equal(await page.locator('.question-answer strong').innerText(),'はい');assert.equal(await page.locator('.spoken-line').innerText(),'「はい。」');
 await ask('武器を持っていますか？');assert.equal(await page.locator('.question-answer strong').innerText(),'いいえ');
 await page.locator('.question-history summary').click();assert.match(await page.locator('.question-history').innerText(),/薬草を持っていますか/);
 await ask('どこから来ましたか？');assert.match(await page.locator('#question-error').innerText(),/答えられる形/);assert.equal(await page.locator('.question-answer strong').innerText(),'いいえ');
 await ask('<img src=x onerror="window.injected=true">');assert.equal(await page.evaluate(()=>!!window.injected),false);
 const input=page.locator('#free-question');await input.fill('');await input.pressSequentially('123');assert.equal(await input.inputValue(),'123');assert.equal(await page.locator('.evidence-list').count(),0);
 await input.fill('招待状はありますか？');await input.dispatchEvent('compositionstart');await input.dispatchEvent('keydown',{key:'Enter',isComposing:true,bubbles:true});assert.equal(await input.inputValue(),'招待状はありますか？');assert.equal(await page.locator('.question-answer strong').innerText(),'いいえ');await input.dispatchEvent('compositionend');await input.press('Enter');assert.equal(await input.inputValue(),'');
 await page.reload();await page.locator('[data-action="continue"]').click();assert.match(await page.locator('.question-answer').innerText(),/招待状はありますか/);assert.equal(await page.locator('.spoken-line').innerText(),'「いいえ。」');
 await page.locator('[data-decision="hold"]').click();assert.equal(await page.locator('.question-answer').count(),0);await ask('補給商人ですか？');assert.equal(await page.locator('.question-answer strong').innerText(),'はい');
 await page.locator('.cell.occupied').click();assert.match(await page.locator('.question-answer').innerText(),/招待状はありますか/);
 await page.locator('[data-topic="greeting"]').click();assert.notEqual(await page.locator('.spoken-line').innerText(),'「いいえ。」');assert.equal(await page.locator('.question-answer').count(),1);
 await page.setViewportSize({width:390,height:844});await page.locator('[data-action="question-example"]').first().click();assert.equal(await input.inputValue(),'招待状はありますか？');await input.press('Enter');assert.equal(await page.locator('.question-answer strong').innerText(),'いいえ');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.locator('.question-panel').screenshot({path:'/tmp/maou-questions-mobile.png'});
 await page.setViewportSize({width:1440,height:1050});await page.locator('.question-panel').screenshot({path:'/tmp/maou-questions-desktop.png'});
 assert.deepEqual(errors,[]);console.log('PASS: yes/no answers, unsupported input, escaping, history, save/resume, quarantine, IME composition, number keys, existing dialogue, mobile form.');
}finally{await browser.close();}
