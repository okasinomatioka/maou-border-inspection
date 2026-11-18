import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {newGame,makeDay} from '../dist/engine.mjs';
import {DAILY_EVENTS} from '../dist/events.mjs';

const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1050}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('maou-border-v1')));
async function resume(s){await page.evaluate(s=>localStorage.setItem('maou-border-v1',JSON.stringify(s)),s);await page.reload();await page.locator('[data-action="continue"]').click();}
async function night(){await page.locator('[data-action="night"]').first().click();await page.locator('[data-action="end-night"]').click();}
try{
 await page.goto('http://127.0.0.1:4173');await page.locator('[data-action="new"]').click();
 assert.match(await page.locator('#modal').innerText(),/新しい門番へ/);
 await page.locator('#modal [data-action="daily-event"][data-option="0"]').click();
 assert.equal((await saved()).dailyEvent.choice,0);
 assert.equal(await page.locator('#modal .event-option.chosen').count(),1);
 await page.locator('[data-action="close"]').last().click();
 await page.screenshot({path:'/tmp/maou-events-desktop.png',fullPage:true});
 await page.reload();await page.locator('[data-action="continue"]').click();
 await page.locator('[data-action="event-info"]').click();
 assert.equal(await page.locator('#modal .event-option:disabled').count(),2);
 await page.locator('[data-action="close"]').last().click();

 for(let day=1;day<=8;day++){
  const s=newGame(308);s.day=day;makeDay(s);s.queue=[];s.food=30;s.troops=60;
  await resume(s);assert.match(await page.locator('.sidebar .daily-event').innerText(),new RegExp(DAILY_EVENTS[day-1].title));
  await page.locator('[data-action="event-info"]').click();
  if(day===4){
   await page.setViewportSize({width:390,height:844});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.screenshot({path:'/tmp/maou-events-mobile.png',fullPage:true});
  }
  await page.locator('#modal [data-action="daily-event"][data-option="1"]').click();
  assert.equal((await saved()).dailyEvent.choice,1);
  await page.locator('[data-action="close"]').last().click();
  if(day===4)await page.setViewportSize({width:1440,height:1050});
  await night();assert.match(await page.locator('.event-report').innerText(),new RegExp(DAILY_EVENTS[day-1].title));
  assert.match(await page.locator('.event-report').innerText(),/事件による今夜の変化/);
  const done=await saved();await page.reload();await page.locator('[data-action="continue"]').click();assert.deepEqual(await saved(),done);
 }
 const poor=newGame(308);poor.day=4;makeDay(poor);poor.food=2;await resume(poor);
 await page.locator('[data-action="event-info"]').click();assert.equal(await page.locator('#modal [data-option="1"]').isDisabled(),true);
 await page.locator('[data-action="close"]').last().click();
 const old=newGame(308);old.queue=[];delete old.dailyEvent;await resume(old);
 assert.equal(await page.locator('.daily-event').count(),0);await night();assert.equal(await page.locator('.event-report').count(),0);
 await page.locator('[data-action="next"]').click();assert.match(await page.locator('#modal').innerText(),/補給路が崩落/);
 assert.deepEqual(errors,[]);console.log('PASS: morning and sidebar event choices, eight event reports, immediate costs, mobile modal, locked choices, save/reload, insufficient resources, legacy saves.');
}finally{await browser.close();}
