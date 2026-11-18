// Daily orders are saved once chosen; their consequences settle before nightly combat.
export const DAILY_EVENTS=[
 {id:'welcome',title:'新しい門番へ、城からの支援',story:'任務初日。補給係が小さな荷車を引いてきた。「食料か予備兵、必要な方を手配します。」',options:[
  {label:'食料を届けてもらう',detail:'今夜、食料＋3。',food:0,troops:0},
  {label:'予備兵を要請する',detail:'今夜、兵力＋6。',food:0,troops:0}]},
 {id:'road',title:'補給路が崩落した',story:'山道が崩れ、補給隊が足止めされている。兵士を護衛に出せば、迂回路から荷車を連れ帰れる。',options:[
  {label:'備蓄でしのぐ',detail:'今夜、傷んだ食料を2失う。',food:0,troops:0},
  {label:'護衛隊を派遣する',detail:'今すぐ兵力−6。今夜、食料＋8。',food:0,troops:6}]},
 {id:'hospital',title:'野戦病院からの手紙',story:'「薬と手当てがあれば、まだ戦列へ戻れる者がいます」。城へ迎えた薬売りや回復術師を頼れるかもしれない。',options:[
  {label:'城内の治療役に託す',detail:'夜に味方の薬売りか回復術師が城内にいれば兵力＋8。不在なら回復なし。',food:0,troops:0},
  {label:'備蓄薬を開封する',detail:'今すぐ食料−3（薬との交換）。今夜、兵力＋10。',food:3,troops:0}]},
 {id:'rescue',title:'隔離者の救出予告',story:'牢の窓に矢文が刺さっていた。「仲間は今夜、連れ戻す」。勇者を隔離したまま夜を迎えるなら、襲撃への備えが要る。',options:[
  {label:'通常の警備を続ける',detail:'今夜、隔離中の勇者1名につき兵力−6。逃亡は阻止する。',food:0,troops:0},
  {label:'封鎖結界を張る',detail:'今すぐ食料−3（触媒との交換）。救出襲撃による追加損耗を防ぐ。',food:3,troops:0}]},
 {id:'refugees',title:'城外で待つ避難民',story:'戦火を逃れた魔物たちが城外の野営地に集まった。「食事をいただけるなら、城壁の修繕を手伝います。」',options:[
  {label:'炊き出しを約束する',detail:'今夜、食料3を渡して兵力＋8。食料が3未満なら実施できない。通常の夜食4も別途必要。',food:0,troops:0},
  {label:'備蓄を城内に残す',detail:'食料も兵力も変化なし。避難民は別の町へ向かう。',food:0,troops:0}]},
 {id:'forge',title:'鍛冶場の火が消える',story:'城門を支える金具が割れた。城内に王室鍛冶師がいれば修復を任せられる。兵士でも応急処置はできるが、資材が必要だ。',options:[
  {label:'城内の鍛冶師に託す',detail:'夜に味方の王室鍛冶師が城内にいれば兵力＋10。不在なら門の損傷で兵力−4。',food:0,troops:0},
  {label:'応急修理を手配する',detail:'今すぐ食料−2（資材との交換）。今夜、兵力＋6。門の損傷も防ぐ。',food:2,troops:0}]},
 {id:'raid',title:'決戦前の夜襲',story:'見張りが城内に合図の光を見つけた。今夜、潜んだ勇者は普段より激しく攻めてくる。裏口からの侵入者も加勢するだろう。',options:[
  {label:'通常の防衛を続ける',detail:'今夜、城内の勇者1名につき追加で兵力−2。通常の戦闘損耗−3も発生。',food:0,troops:0},
  {label:'夜警を増員する',detail:'今すぐ食料−4（夜警の支給分）。夜襲の追加損耗を防ぐ。通常の戦闘損耗は残る。',food:4,troops:0}]},
 {id:'beacon',title:'最後の烽火',story:'玉座から最後の命令が届いた。「この城に集った者たちと、夜明けを迎えよ」。門を通してきた人々が、最後の支えになる。',options:[
  {label:'城内の協力者を集める',detail:'夜に城内の味方の職業が3種類以上あれば兵力＋12。足りなければ増援なし。',food:0,troops:0},
  {label:'最後の備蓄を配る',detail:'今すぐ食料−4。今夜、兵力＋8。通常の夜食4も別途必要。',food:4,troops:0}]}
];

export function startDailyEvent(s){s.dailyEvent={day:s.day,choice:null,settled:false};}
export function dailyEvent(s){return s.dailyEvent?.day===s.day?DAILY_EVENTS[s.day-1]||null:null;}
export function chooseDailyEvent(s,index){
 const event=dailyEvent(s),option=event?.options[index];
 if(s.phase!=='day'||!option||!Number.isInteger(index)||s.dailyEvent.settled)return {error:'今は対応を選べません。'};
 if(s.dailyEvent.choice!==null)return {error:'対応はすでに決定しています。'};
 if(s.food<option.food||s.troops<option.troops)return {error:'対応に必要な食料または兵力が不足しています。'};
 s.food-=option.food;s.troops-=option.troops;s.dead+=option.troops;s.dailyEvent.choice=index;
 return {label:option.label};
}

export function resolveDailyEvent(s){
 const event=dailyEvent(s),record=s.dailyEvent;
 if(!event||record.settled)return null;
 const choice=record.choice??0,allies=s.residents.filter(c=>!c.hero);
 let food=0,troops=0,text='';
 const helpers=jobs=>allies.filter(c=>jobs.includes(c.job));
 const names=people=>people.map(c=>c.name).join('、');
 switch(event.id){
  case 'welcome':if(choice===0){food=3;text='補給係が食料を届けてくれた。八日間の任務が始まる。';}else{troops=6;text='予備兵が城壁に合流した。「門のことは任せましたよ」。';}break;
  case 'road':if(choice===1){food=8;text='護衛隊が迂回路を切り開き、補給の荷車を連れ帰った。';}else{food=-2;text='補給隊は戻らなかった。備蓄から傷んだ食料を取り除いた。';}break;
  case 'hospital':{const h=helpers(['薬売り','回復術師']);if(choice===1){troops=10;text='備蓄薬が病院に届き、負傷兵が戦列へ戻った。';}else if(h.length){troops=8;text=`門を通した${names(h)}が負傷兵を手当てした。「迎え入れてくれて、ありがとう」。`;}else text='城内に治療を任せられる味方がいない。負傷兵の復帰は間に合わなかった。';break;}
  case 'rescue':{const n=s.held.filter(c=>c.hero).length;if(choice===1)text='封鎖結界が隔離室を守った。救出襲撃による追加の損耗はなかった。';else if(n){troops=-6*n;text=`隔離中の勇者${n}名を狙う救出隊が現れた。逃亡は阻止したが、警備兵が倒れた。`;}else text='救出対象の勇者が隔離室におらず、襲撃は起きなかった。';break;}
  case 'refugees':if(choice===1)text='備蓄は城内に残された。避難民は焚き火を消し、別の町へ旅立った。';else if(s.food>=3){food=-3;troops=8;text='温かな食事を受け取った避難民が城壁を修繕した。「今夜は、私たちもこの城を守ります」。';}else text='炊き出しの食料3を用意できなかった。避難民は別の町へ向かった。';break;
  case 'forge':{const h=helpers(['王室鍛冶師']);if(choice===1){troops=6;text='資材が届き、兵士が城門を補強した。応急処置は夜までに間に合った。';}else if(h.length){troops=10;text=`門を通した${names(h)}が金具を打ち直した。鍛冶場に再び火が灯った。`;}else{troops=-4;text='修理を任せられる味方の鍛冶師がいない。傷んだ城門を支える守備隊が消耗した。';}break;}
  case 'raid':{const n=s.residents.filter(c=>c.hero).length;if(choice===1)text='増員した夜警が合図を見抜き、連携攻撃を阻止した。追加損耗はないが、通常の戦闘は続く。';else if(n){troops=-2*n;text=`城内の勇者${n}名が一斉に攻めた。通常の戦闘に加え、守備隊が消耗した。`;}else text='城内に合図へ応じる勇者はおらず、夜襲は不発に終わった。';break;}
  case 'beacon':{const jobs=new Set(allies.map(c=>c.job)).size;if(choice===1){troops=8;text='最後の配給が兵士たちに届いた。夜明けまで守り抜くため、持ち場に戻っていく。';}else if(jobs>=3){troops=12;text=`${jobs}種類の職業の味方が力を合わせた。あなたが開いた門から、城を守る力が集まった。`;}else text='協力者の職業が3種類に届かず、増援は編成できなかった。今いる兵士で最後の夜に臨む。';break;}
 }
 const before={food:s.food,troops:s.troops};
 s.food=Math.max(0,s.food+food);s.troops=Math.max(0,Math.min(100,s.troops+troops));
 const actualTroops=s.troops-before.troops;if(actualTroops<0)s.dead-=actualTroops;
 record.settled=true;
 return {id:event.id,title:event.title,choice,automatic:record.choice===null,label:event.options[choice].label,spentFood:event.options[choice].food,spentTroops:event.options[choice].troops,text,food:s.food-before.food,troops:actualTroops};
}
