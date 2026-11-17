// Original scores for this game. Notes use MIDI pitch; times are in beats.
// All voices are synthesized locally: no recordings, downloads, or API keys.
export const TRACKS={
 title:{name:'黒曜城の月冠',bpm:76,bars:16},
 play:{name:'門番の八日間',bpm:94,bars:16}
};
const TITLE_CHORDS=[
 [50,57,62,65],[46,53,58,62],[53,60,65,69],[48,55,60,64],
 [43,50,58,62],[50,57,62,65],[45,52,61,64],[45,55,61,64],
 [50,57,62,65],[46,53,58,62],[53,60,65,69],[48,55,60,64],
 [43,50,58,62],[46,53,58,62],[45,52,61,64],[50,57,62,65]
];
const TITLE_MELODY=[
 [[0,74,1.5],[2,77,1],[3,76,.75]],[[0,74,2],[2.5,70,1]],
 [[0,72,1],[1.5,69,1],[3,65,.75]],[[0,67,1.5],[2,72,1.5]],
 [[0,70,1],[1.5,69,.5],[2,67,1.5]],[[0,69,1.5],[2,65,1],[3,62,.75]],
 [[0,64,1],[1.5,69,1],[3,73,.75]],[[0,76,2],[2.5,73,1]],
 [[0,77,1.5],[2,81,1],[3,79,.75]],[[0,77,1],[1.5,74,1],[3,70,.75]],
 [[0,72,1.5],[2,77,1.5]],[[0,76,1],[1.5,72,1],[3,67,.75]],
 [[0,70,1.5],[2,74,1.5]],[[0,77,1],[1.5,74,1],[3,70,.75]],
 [[0,73,1.5],[2,76,1],[3,69,.75]],[[0,74,3]]
];
const PLAY_CHORDS=[
 [45,52,57,60],[45,52,57,60],[41,48,53,57],[41,48,53,57],
 [43,50,55,59],[43,50,55,59],[40,47,56,59],[40,47,56,59],
 [45,52,57,60],[45,52,57,60],[41,48,53,57],[43,50,55,59],
 [38,45,53,57],[41,48,53,57],[40,47,56,59],[40,47,56,59]
];
export function buildScore(scene){
 const track=TRACKS[scene];if(!track)throw Error('Unknown music scene');
 const beat=60/track.bpm,events=[];
 const note=(bar,offset,pitch,length,voice,level,pan=0)=>events.push({time:(bar*4+offset)*beat,pitch,duration:length*beat,voice,level,pan});
 const chords=scene==='title'?TITLE_CHORDS:PLAY_CHORDS;
 chords.forEach((chord,bar)=>{
  chord.slice(1).forEach((pitch,i)=>note(bar,0,pitch,3.9,'pad',scene==='title'?.038:.024,(i-1)*.3));
  note(bar,0,chord[0]-12,3.6,'bass',scene==='title'?.12:.09);
  if(scene==='title'){
   TITLE_MELODY[bar].forEach(([offset,pitch,length])=>note(bar,offset,pitch,length,'bell',.13,.12));
   [0,.75,1.5,2.5,3.25].forEach((offset,i)=>note(bar,offset,chord[1+i%3]+(i===4?12:0),.65,'harp',.07,-.25));
   if(bar%4===0)note(bar,0,38,.8,'drum',.06);
  }else{
   [0,.5,1,1.5,2,2.5,3,3.5].forEach((offset,i)=>{
    const pattern=[1,2,3,2,1,3,2,3];
    note(bar,offset,chord[pattern[(i+(bar%2)*2)%8]]+12,.3,'pluck',i%2===0?.09:.055,(i%2===0?-.2:.2));
    if(i%2===1)note(bar,offset,0,.06,'tick',.025,.25);
   });
   note(bar,0,33,.35,'drum',.08);note(bar,2,33,.28,'drum',.055);
   if(bar%4===3){note(bar,1,chord[3]+12,1.2,'bell',.055,-.2);note(bar,3,chord[2]+12,.8,'bell',.045,-.2);}
  }
 });
 events.sort((a,b)=>a.time-b.time);
 return {name:track.name,events,duration:track.bars*4*beat};
}
export const frequency=pitch=>440*2**((pitch-69)/12);

export function makeNoise(context){const buffer=context.createBuffer(1,Math.ceil(context.sampleRate*.25),context.sampleRate),data=buffer.getChannelData(0);let seed=97231;for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;data[i]=(seed/4294967296)*2-1;}return buffer;}

export function scheduleVoice(context,destination,event,start,noise){
 const amp=context.createGain(),filter=context.createBiquadFilter(),pan=context.createStereoPanner();
 const pitch=frequency(event.pitch),voice=event.voice,oscillators=[];
 pan.pan.value=event.pan||0;filter.type='lowpass';filter.frequency.value=voice==='pad'?1100:voice==='pluck'?1700:voice==='tick'?3600:2600;
 amp.connect(filter);filter.connect(pan);pan.connect(destination);
 let attack=.012,release=.25,end=start+event.duration;
 if(voice==='pad'){attack=.55;release=.8;}else if(voice==='bell'){attack=.012;release=.75;}else if(voice==='harp'){attack=.005;release=.25;}else if(voice==='pluck'){attack=.004;release=.12;}
 amp.gain.setValueAtTime(0,start);
 amp.gain.linearRampToValueAtTime(event.level,start+Math.min(attack,event.duration*.4));
 if(['bell','harp','pluck','drum','tick'].includes(voice))amp.gain.exponentialRampToValueAtTime(.0001,end+release);
 else{amp.gain.setValueAtTime(event.level,Math.max(start+attack,end-.1));amp.gain.linearRampToValueAtTime(0,end+release);}
 if(voice==='tick'){
  const source=context.createBufferSource();source.buffer=noise;filter.type='highpass';filter.frequency.value=2400;source.connect(amp);oscillators.push(source);
 }else{
  const oscillator=context.createOscillator();oscillator.type=['bass','drum','bell'].includes(voice)?'sine':'triangle';oscillator.frequency.setValueAtTime(pitch,start);
  if(voice==='drum')oscillator.frequency.exponentialRampToValueAtTime(35,start+.13);
  oscillator.connect(amp);oscillators.push(oscillator);
  if(voice==='pad'||voice==='bell'){
   const overtone=context.createOscillator(),blend=context.createGain();overtone.type='sine';overtone.frequency.value=pitch*(voice==='bell'?2:1);overtone.detune.value=voice==='pad'?5:0;blend.gain.value=voice==='bell'?.15:.25;overtone.connect(blend);blend.connect(amp);oscillators.push(overtone);
   overtone.onended=()=>blend.disconnect();
  }
 }
 let alive=oscillators.length;
 const handle={stop(at=context.currentTime){for(const source of oscillators){try{source.stop(at);}catch{}}},onended:null};
 for(const source of oscillators){const prior=source.onended;source.onended=()=>{prior?.();source.disconnect();if(--alive===0){amp.disconnect();filter.disconnect();pan.disconnect();handle.onended?.();}};source.start(start);source.stop(end+release+.02);}
 return handle;
}

const SETTINGS_KEY='maou-audio-v1';
const defaults={bgm:.35,effects:.5,muted:false};
function normalize(value){return {bgm:Number.isFinite(value?.bgm)?Math.max(0,Math.min(1,value.bgm)):defaults.bgm,effects:Number.isFinite(value?.effects)?Math.max(0,Math.min(1,value.effects)):defaults.effects,muted:value?.muted===true};}
export class GameAudio{
 constructor(){try{this.settings=normalize(JSON.parse(globalThis.localStorage?.getItem(SETTINGS_KEY)));}catch{this.settings={...defaults};}this.scene='title';this.hidden=false;this.activated=false;this.context=null;this.current=null;this.groups=new Set();this.timer=null;this.error=false;this.onchange=null;}
 status(){return {scene:this.scene,playing:this.current?.scene||null,context:this.context?.state||'locked',activated:this.activated,hidden:this.hidden,groups:this.groups.size,settings:{...this.settings},error:this.error};}
 async activate(){
  if(this.hidden||this.activating)return;
  this.activated=true;this.activating=true;
  try{
   if(!this.context){const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;if(!Audio)throw Error('Audio unavailable');this.context=new Audio();const c=this.context;this.output=c.createGain();this.output.gain.value=.72;const limiter=c.createDynamicsCompressor();limiter.threshold.value=-12;limiter.knee.value=14;limiter.ratio.value=5;limiter.attack.value=.008;limiter.release.value=.2;this.output.connect(limiter);limiter.connect(c.destination);this.musicGain=c.createGain();this.effectsGain=c.createGain();this.musicGain.connect(this.output);this.effectsGain.connect(this.output);this.noise=makeNoise(c);}
   if(this.context.state!=='running')await this.context.resume();if(this.hidden)await this.context.suspend();this.error=false;this.applyVolumes();this.sync();
  }catch{this.error=true;}finally{this.activating=false;this.onchange?.();}
 }
 configure(patch){this.settings=normalize({...this.settings,...patch});try{globalThis.localStorage?.setItem(SETTINGS_KEY,JSON.stringify(this.settings));}catch{}this.applyVolumes();this.sync();this.onchange?.();}
 applyVolumes(){if(!this.context)return;const t=this.context.currentTime;for(const [node,value] of [[this.musicGain,this.settings.bgm],[this.effectsGain,this.settings.effects]]){node.gain.cancelScheduledValues(t);node.gain.setTargetAtTime(this.settings.muted?0:value,t,.04);}}
 setScene(scene){if(!TRACKS[scene]||this.scene===scene)return;this.scene=scene;this.sync();this.onchange?.();}
 setHidden(hidden){this.hidden=hidden;if(hidden){this.stopAll();this.context?.suspend().catch(()=>{});}else if(this.activated)this.activate();this.onchange?.();}
 stopGroup(group,fade=0){if(!group)return;group.stopped=true;const t=this.context.currentTime;group.gain.gain.cancelScheduledValues(t);group.gain.gain.setValueAtTime(group.gain.gain.value,t);group.gain.gain.linearRampToValueAtTime(0,t+fade);for(const source of group.sources)source.stop(t+fade+.02);const cleanup=()=>{group.gain.disconnect();this.groups.delete(group);};if(fade){group.cleanup=setTimeout(cleanup,fade*1000+100);}else{clearTimeout(group.cleanup);cleanup();}}
 stopAll(){clearInterval(this.timer);this.timer=null;for(const group of [...this.groups])this.stopGroup(group);this.current=null;}
 sync(){
  if(!this.context||this.context.state!=='running'||this.hidden||this.settings.muted||this.settings.bgm===0){this.stopAll();return;}
  if(this.current?.scene===this.scene)return;
  if(this.current)this.stopGroup(this.current,.8);
  const gain=this.context.createGain(),start=this.context.currentTime+.04;gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(1,start+1.1);gain.connect(this.musicGain);
  this.current={scene:this.scene,score:buildScore(this.scene),gain,start,index:0,cycle:0,sources:new Set(),stopped:false};this.groups.add(this.current);
  this.tick();if(!this.timer)this.timer=setInterval(()=>this.tick(),80);
 }
 tick(){const group=this.current;if(!group||group.stopped||this.hidden||this.context.state!=='running')return;const now=this.context.currentTime,horizon=now+.2;
  if(now-group.start-group.cycle*group.score.duration>group.score.duration){group.cycle=Math.floor((now-group.start)/group.score.duration);group.index=0;}
  // Skip missed beats after a throttled timer instead of playing a burst.
  while(group.start+group.cycle*group.score.duration+group.score.events[group.index].time<horizon){const event=group.score.events[group.index],time=group.start+group.cycle*group.score.duration+event.time;if(time>=now-.03){const source=scheduleVoice(this.context,group.gain,event,Math.max(now,time),this.noise);group.sources.add(source);source.onended=()=>group.sources.delete(source);}group.index++;if(group.index===group.score.events.length){group.index=0;group.cycle++;}}
 }
 effect(type='click'){if(!this.context||this.context.state!=='running'||this.hidden||this.settings.muted||!this.settings.effects)return;const notes=type==='good'?[67,72,76]:type==='bad'?[55,51]:type==='night'?[57,60,64]:[68];notes.forEach((pitch,i)=>scheduleVoice(this.context,this.effectsGain,{pitch,voice:'bell',duration:.09,level:.08,pan:0},this.context.currentTime+i*.09,this.noise));}
 destroy(){this.stopAll();return this.context?.close();}
}
export const gameAudio=new GameAudio();
