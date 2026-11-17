import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,random,act,endNight,nextDay,heroes,current,upgradeSecurity,borderWatch,COUNTS} from '../dist/engine.mjs';
import {getEnding} from '../dist/endings.mjs';

function atGate(seed,action,day=1){
 const s=newGame(seed);s.queue=s.queue.filter(c=>c.hero);s.day=day;
 assert.ok(!act(s,action).error);return s;
}
test('refusal and gate exile have distinct probability boundaries and troop costs',()=>{
 for(const [action,seed,invaded,cost] of [['deny',132,true,0],['deny',404,false,0],['expel',87,true,8],['expel',19,false,8]]){
  const s=atGate(seed,action);assert.equal(s.troops,100-cost);assert.equal(heroes(s),0);
  assert.equal(borderWatch(s)[action],1);const n=endNight(s);
  assert.equal(n.border[0].infiltrated,invaded);assert.equal(heroes(s),Number(invaded));
  assert.equal(s.troops,100-cost-Number(invaded)*3);assert.equal(s.border.length,0);
 }
});
test('final-night infiltration counts towards battle and the third-hero assassination threshold',()=>{
 const s=atGate(132,'deny',8);s.residents.push({id:99,hero:true},{id:100,hero:true});
 const n=endNight(s);assert.equal(n.heroes,3);assert.equal(n.loss,9);assert.equal(n.chance,20);
 assert.equal(s.infiltrations,1);assert.equal(s.returning.length,0);
});
test('killing permanently eliminates a hero and releases quarantine guards',()=>{
 for(const location of ['queue','held','resident']){
  const s=newGame(87);s.queue=s.queue.filter(c=>c.hero);
  if(location!=='queue'){act(s,location==='held'?'hold':'admit');s.selected=(location==='held'?s.held:s.residents)[0].id;}
  act(s,'kill');assert.equal(s.troops,85);assert.equal(s.held.length,0);
  const n=endNight(s);assert.equal(n.heroes,0);assert.equal(n.border.length,0);assert.equal(s.returning.length,0);
 }
});
test('innocent refusals and exiles never infiltrate or revisit, and watch counts do not reveal identities',()=>{
 for(const action of ['deny','expel']){
  const s=newGame(87);s.queue=s.queue.filter(c=>!c.hero).slice(0,1);act(s,action);
  assert.equal(borderWatch(s)[action],1);const n=endNight(s);
  assert.equal(n.border[0].infiltrated,false);assert.equal(s.returning.length,0);assert.equal(s.infiltrations,0);
 }
});
test('revisits have different probabilities and delays, and only one uses a normal daily slot',()=>{
 let seed;
 for(let i=1;i<10000;i++){const r={seed:i};if(random(r)>.35&&random(r)<.25){seed=i;break;}}
 for(const [action,delay] of [['deny',1],['expel',2]]){
  const s=atGate(seed,action);endNight(s);assert.equal(s.returning.length,1);
  const id=s.returning[0].id;assert.equal(s.returning[0].returnDay,1+delay);
  s.returning.push({...s.returning[0],id:999});nextDay(s);
  if(delay===2){assert.equal(s.queue.some(c=>c.id===id),false);while(s.queue.length)act(s,'admit');endNight(s);nextDay(s);}
  assert.equal(s.queue.length,COUNTS[s.day-1]);assert.equal(s.queue.at(-1).id,id);
  assert.equal(s.returning.length,1);assert.equal(s.returning[0].id,999);
 }
 const a=atGate(19,'deny'),b=atGate(19,'expel');
 // A safe first roll and second roll between 25 and 50 distinguish revisit probabilities.
 for(let i=1;i<10000;i++){const r={seed:i};if(random(r)>.35){const v=random(r);if(v>=.25&&v<.5){a.seed=b.seed=i;break;}}}
 endNight(a);endNight(b);assert.equal(a.returning.length,1);assert.equal(b.returning.length,0);
});
test('save and reload retain pending decisions and cannot reroll the night',()=>{
 const s=atGate(132,'deny'),copy=JSON.parse(JSON.stringify(s));
 assert.deepEqual(endNight(s),endNight(copy));assert.deepEqual(s,copy);
 const before=structuredClone(s);assert.ok(endNight(s).error);assert.deepEqual(s,before);
 nextDay(s);while(s.queue.length)act(s,'admit');endNight(s);assert.equal(s.infiltrations,1);
});
test('legacy saves gain no retroactive danger and retain already scheduled returns',()=>{
 const s=newGame(19);while(s.queue.length)act(s,'deny');delete s.border;delete s.infiltrations;
 s.returning.push({id:777,hero:true,returnDay:3});upgradeSecurity(s);
 assert.deepEqual(borderWatch(s),{deny:0,expel:0});assert.equal(s.returning[0].id,777);
 assert.equal(endNight(s).border.length,0);assert.equal(s.infiltrations,0);
});
test('infiltrations prevent the perfect ending even after later removal',()=>{
 const s=newGame(3);s.phase='won';s.day=8;s.queue=[];s.infiltrations=1;
 assert.equal(getEnding(s).stats.infiltrations,1);assert.notEqual(getEnding(s).id,'dawn');
});
test('a mixed strategy can survive all eight days without running out of troops',()=>{
 for(const seed of [1,19,87,132,308,404]){
  const s=newGame(seed);
  for(let d=1;d<=8;d++){
   while(s.queue.length){const action=current(s).hero?(s.troops>=75?'kill':s.troops>=8?'expel':'deny'):'admit';assert.ok(!act(s,action).error);}
   endNight(s);assert.notEqual(s.phase,'lost',`seed ${seed}, day ${d}`);if(d<8)nextDay(s);
  }
  assert.equal(s.phase,'won');assert.ok(s.troops>0);
 }
});
