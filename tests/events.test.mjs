import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,makeDay,act,current,endNight,nextDay} from '../dist/engine.mjs';
import {DAILY_EVENTS,dailyEvent,chooseDailyEvent,resolveDailyEvent} from '../dist/events.mjs';

function fixture(day){const s=newGame(308);s.day=day;makeDay(s);s.queue=[];s.troops=60;s.food=20;return s;}
function ally(job,name='協力者'){return {hero:false,job,name};}

test('all eight days have distinct events with two working choices',()=>{
 assert.equal(new Set(DAILY_EVENTS.map(e=>e.id)).size,8);
 for(let day=1;day<=8;day++)for(const choice of [0,1]){
  const s=fixture(day);assert.equal(dailyEvent(s).options.length,2);
  assert.ok(!chooseDailyEvent(s,choice).error);const n=endNight(s);
  assert.equal(n.dailyEvent.id,DAILY_EVENTS[day-1].id);assert.equal(n.dailyEvent.choice,choice);
  assert.equal(n.dailyEvent.automatic,false);assert.equal(s.dailyEvent.settled,true);
 }
});
test('supply escort spends troops once and delivers food before the night meal',()=>{
 const s=fixture(2);chooseDailyEvent(s,1);assert.equal(s.troops,54);assert.equal(s.dead,6);
 const saved=structuredClone(s);assert.ok(chooseDailyEvent(s,0).error);assert.deepEqual(s,saved);
 const copy=JSON.parse(JSON.stringify(s));assert.deepEqual(endNight(s),endNight(copy));
 assert.equal(s.food,24);assert.equal(s.night.dailyEvent.food,8);assert.equal(s.night.dailyEvent.spentTroops,6);
 const done=structuredClone(s);assert.equal(resolveDailyEvent(s),null);assert.ok(endNight(s).error);assert.deepEqual(s,done);
});
test('unaffordable and invalid choices do not consume resources or lock the event',()=>{
 const s=fixture(2);s.troops=5;const before=structuredClone(s);
 for(const choice of [1,-1,2,0.5,'1']){assert.ok(chooseDailyEvent(s,choice).error);assert.deepEqual(s,before);}
 const ward=fixture(4);ward.food=2;assert.ok(chooseDailyEvent(ward,1).error);assert.equal(ward.dailyEvent.choice,null);
});
test('default response resolves once, caps resources, and reports actual changes',()=>{
 const s=fixture(2);s.food=1;const n=endNight(s);assert.equal(n.dailyEvent.automatic,true);assert.equal(n.dailyEvent.food,-1);assert.equal(n.starvation,true);
 const t=fixture(1);t.troops=99;chooseDailyEvent(t,1);endNight(t);assert.equal(t.troops,100);assert.equal(t.night.dailyEvent.troops,1);
});
test('previously admitted healers help, but held, expelled, or disguised enemies do not',()=>{
 const s=newGame(308);const pharmacist=current(s);act(s,'admit');
 s.day=3;makeDay(s);s.queue=[];s.troops=60;
 const n=endNight(s);assert.equal(n.dailyEvent.troops,8);assert.match(n.dailyEvent.text,new RegExp(pharmacist.name));
 for(const placement of ['held','border','enemy']){
  const t=fixture(3),helper=ally('回復術師');
  if(placement==='held')t.held.push(helper);
  if(placement==='border')t.border.push({person:helper,action:'expel',day:3});
  if(placement==='enemy')t.residents.push({...helper,hero:true});
  assert.equal(endNight(t).dailyEvent.troops,0);
 }
});
test('the hospital alternative works without healers and charges food only when selected',()=>{
 const s=fixture(3);chooseDailyEvent(s,1);assert.equal(s.food,17);
 assert.equal(endNight(s).dailyEvent.troops,10);assert.equal(s.food,13);
});
test('rescue event depends on prisoners present at night; ward prevents additional casualties',()=>{
 for(const choice of [0,1]){
  const s=fixture(4);s.held=[{hero:true},{hero:true}];chooseDailyEvent(s,choice);
  const n=endNight(s);assert.equal(n.dailyEvent.troops,choice===0?-12:0);assert.equal(s.held.length,2);assert.equal(n.heroes,0);
 }
 const innocent=fixture(4);innocent.held=[{hero:false}];assert.equal(endNight(innocent).dailyEvent.troops,0);
 const freed=fixture(4);freed.held=[{id:99,hero:true}];freed.selected=99;act(freed,'kill');assert.equal(endNight(freed).dailyEvent.troops,0);
});
test('refugees trade food for troop recovery before the normal meal, or leave with no effect',()=>{
 const s=fixture(5);s.food=3;const n=endNight(s);assert.equal(n.dailyEvent.food,-3);assert.equal(n.dailyEvent.troops,8);assert.equal(n.starvation,true);
 const poor=fixture(5);poor.food=2;assert.equal(endNight(poor).dailyEvent.troops,0);
 const decline=fixture(5);chooseDailyEvent(decline,1);const d=endNight(decline).dailyEvent;assert.equal(d.food,0);assert.equal(d.troops,0);
});
test('forge rewards a resident smith, damages an unattended gate, or accepts paid repairs',()=>{
 const s=fixture(6);s.residents=[ally('王室鍛冶師','鍛冶職人')];assert.equal(endNight(s).dailyEvent.troops,10);
 const noSmith=fixture(6);assert.equal(endNight(noSmith).dailyEvent.troops,-4);assert.equal(noSmith.dead,4);
 const paid=fixture(6);chooseDailyEvent(paid,1);assert.equal(endNight(paid).dailyEvent.troops,6);assert.equal(paid.food,14);
});
test('raid includes same-night infiltrators and extra watch preserves ordinary combat losses',()=>{
 for(const choice of [0,1]){
  const s=fixture(7);s.seed=132;s.border=[{person:{hero:true,name:'潜入者'},action:'deny',day:7}];chooseDailyEvent(s,choice);
  const n=endNight(s);assert.equal(n.heroes,1);assert.equal(n.dailyEvent.troops,choice===0?-2:0);assert.equal(n.loss,3);
  assert.equal(s.troops,choice===0?55:57);assert.equal(s.dead,choice===0?5:3);
 }
});
test('final beacon counts distinct allied professions, and its recovery affects assassination risk',()=>{
 const s=fixture(8);s.residents=[ally('薬売り'),ally('薬売り'),ally('王室鍛冶師')];assert.equal(endNight(s).dailyEvent.troops,0);
 const t=fixture(8);t.residents=[ally('薬売り'),ally('衛兵志願者'),ally('王室鍛冶師'),{hero:true},{hero:true},{hero:true}];
 const n=endNight(t);assert.equal(n.dailyEvent.troops,12);assert.equal(t.troops,63);assert.equal(n.chance,35);
 const paid=fixture(8);chooseDailyEvent(paid,1);assert.equal(endNight(paid).dailyEvent.troops,8);
});
test('legacy saves have no surprise event until the next morning; completed nights remain unchanged',()=>{
 const s=fixture(1);delete s.dailyEvent;assert.equal(dailyEvent(s),null);assert.equal(endNight(s).dailyEvent,null);assert.equal(s.food,16);
 nextDay(s);assert.equal(dailyEvent(s).id,'road');assert.equal(s.dailyEvent.choice,null);
 const night=fixture(3);endNight(night);assert.ok(chooseDailyEvent(night,0).error);
});
test('both response routes can complete eight days with inspection and measured disposition costs',()=>{
 for(const route of [0,1]){
  const s=newGame(308);
  for(let day=1;day<=8;day++){
   while(s.queue.length)act(s,current(s).hero?(s.troops>=75?'kill':'expel'):'admit');
   if(chooseDailyEvent(s,route).error)chooseDailyEvent(s,0);
   endNight(s);assert.notEqual(s.phase,'lost');if(day<8)nextDay(s);
  }
  assert.equal(s.phase,'won');
 }
});
