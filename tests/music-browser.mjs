import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1050}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
const volume=(id,value)=>page.locator(id).evaluate((el,value)=>{el.value=String(value);el.dispatchEvent(new Event('input',{bubbles:true}));},value);
const status=()=>page.evaluate(async()=>(await import('./music.mjs')).gameAudio.status());
try{
 await page.goto('http://127.0.0.1:4173');assert.equal((await status()).context,'locked');
 await page.locator('[data-action="sound"]').click();await page.waitForFunction(async()=>(await import('./music.mjs')).gameAudio.status().playing==='title');assert.equal((await status()).context,'running');
 await volume('#bgm-volume',28);await volume('#effects-volume',40);assert.equal((await status()).settings.bgm,.28);assert.equal((await status()).settings.effects,.4);
 await page.locator('[data-action="close"]').last().click();
 await page.locator('[data-action="new"]').click();await page.locator('[data-action="close"]').last().click();assert.equal((await status()).playing,'play');
 const start=await page.evaluate(async()=>(await import('./music.mjs')).gameAudio.current.start);
 await page.locator('[data-tool="0"]').click();await page.locator('[data-topic="purpose"]').click();assert.equal(await page.evaluate(async()=>(await import('./music.mjs')).gameAudio.current.start),start);
 await page.locator('[data-action="sound"]').click();await page.locator('#audio-muted').check();assert.equal((await status()).groups,0);assert.equal((await status()).settings.muted,true);
 await page.locator('#audio-muted').uncheck();assert.equal((await status()).playing,'play');
 await volume('#bgm-volume',0);assert.equal((await status()).playing,null);await volume('#bgm-volume',28);assert.equal((await status()).playing,'play');
 await page.locator('[data-action="close"]').last().click();
 await page.evaluate(async()=>{const a=(await import('./music.mjs')).gameAudio;a.setHidden(true);});assert.equal((await status()).playing,null);await page.evaluate(async()=>{const a=(await import('./music.mjs')).gameAudio;a.setHidden(false);});await page.waitForFunction(async()=>(await import('./music.mjs')).gameAudio.status().context==='running');assert.equal((await status()).playing,'play');
 // Advance the transport near the loop boundary without waiting a full minute.
 await page.evaluate(async()=>{const a=(await import('./music.mjs')).gameAudio;a.current.start=a.context.currentTime-a.current.score.duration+.1;a.current.index=a.current.score.events.length-1;a.tick();});assert.ok(await page.evaluate(async()=>(await import('./music.mjs')).gameAudio.current.cycle>=1));
 await page.locator('[data-action="title"]').click();assert.equal((await status()).playing,'title');await page.waitForFunction(async()=>(await import('./music.mjs')).gameAudio.groups.size===1);
 await page.reload();assert.equal((await status()).settings.bgm,.28);assert.equal((await status()).settings.effects,.4);assert.equal((await status()).context,'locked');
 await page.setViewportSize({width:390,height:844});await page.locator('[data-action="sound"]').click();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:'/tmp/maou-audio-mobile.png',fullPage:true});
 await page.locator('[data-action="close"]').last().click();await page.locator('[data-action="continue"]').click();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 // Render real waveforms to verify both arrangements are audible and unclipped.
 const waveforms=await page.evaluate(async()=>{const {buildScore,scheduleVoice,makeNoise}=await import('./music.mjs');const out=[];for(const scene of ['title','play']){const c=new OfflineAudioContext(2,44100*8,44100),gain=c.createGain();gain.gain.value=.35*.72;gain.connect(c.destination);const noise=makeNoise(c);for(const e of buildScore(scene).events)if(e.time<7)scheduleVoice(c,gain,e,e.time,noise);const b=await c.startRendering(),data=b.getChannelData(0);let sum=0,peak=0;for(const v of data){sum+=v*v;peak=Math.max(peak,Math.abs(v));}out.push({scene,rms:Math.sqrt(sum/data.length),peak});}return out;});
 for(const w of waveforms){assert.ok(w.rms>.001,w.scene);assert.ok(w.peak<.8,w.scene);}assert.notEqual(waveforms[0].rms,waveforms[1].rms);assert.deepEqual(errors,[]);
 console.log(JSON.stringify({result:'PASS: activation, scene transitions, continuous playback, loop, volume, mute, save, hidden tab, mobile, real audio waveforms',waveforms}));
}finally{await browser.close();}
