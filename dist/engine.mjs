import {ensureDialogue,translate} from './dialogue.mjs';
export const DAYS=8;
export const COUNTS=[3,4,5,3,4,5,3,4];
export const TOOLS=[
 {name:'審査マニュアル',icon:'book',short:'書類照合',desc:'入城先・許可番号を照合する。',lesson:'入城先は「黒曜城」のみ。許可番号の失効した者は通さない。'},
 {name:'鑑定の虫眼鏡',icon:'glass',short:'印章鑑定',desc:'身分証の印章を拡大して調べる。',lesson:'正式な印章は三日月と三つの点。欠けた印章は偽造品。'},
 {name:'魔族語辞典',icon:'rune',short:'単語を読む',desc:'ゴブリン語・角族語・獣人語・夜語・スライム語の単語を調べる。',lesson:'五種族の基本語を収録。ゴブリン語のモク＝薬、グラ＝爆発。爆薬の持ち込みは禁止。'},
 {name:'透視のランタン',icon:'lamp',short:'荷物の透視',desc:'鞄の中身と武器の携帯許可を確認。',lesson:'聖なる武器は禁止。ただし王室鍛冶師の修理許可証があれば例外。'},
 {name:'真実の鏡',icon:'mirror',short:'変装を見破る',desc:'魔法で隠された本来の姿を映す。',lesson:'人間は王印つき招待状がある場合のみ入城可能。見た目で決めつけないこと。'},
 {name:'魔力測定器',icon:'orb',short:'魔力を測る',desc:'実測魔力と申告値を比較する。',lesson:'魔力の申告誤差は20まで。21以上の差は身分偽装として拒否。'},
 {name:'万能翻訳機',icon:'rune',short:'全文を訳す',desc:'方言を含め、来訪者の言葉を訳す。',lesson:'山岳方言「ヴァル」は討伐の意味。旧辞典で読めない発言も確認すること。'},
 {name:'王印の共鳴石',icon:'gem',short:'招待状を検証',desc:'招待状に隠された偽の王印を見抜く。',lesson:'偽造された招待状を持つ者が現れた。王印の共鳴が赤なら入城禁止。'}
];
const NAMES=['モグ・モグ','リュカ','ベルベル','グリム','ポルカ','ネロ','ガルド','ミルフィ','ゾルバ','ティティ','ルーメン','オルガ','クルル','ファル','バルド','ニーナ','ザック','メル','ヴォルフ','ピピン','クロエ','ゴルム','ラズリ','ロロ','ヴェル','サフィ','ドグ','ルチア','ムルム','カロン','レイ','ボルボ','リゼ','ガロ','ノクス'];
const SPECIES=['ゴブリン','角族','獣人','夜の民','スライム'];
const JOBS=['薬売り','補給商人','衛兵志願者','回復術師','王室鍛冶師'];
export function random(s){let t=s.seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;}
export function newGame(seed=Date.now()>>>0){const s={version:1,seed,day:1,troops:100,food:8,queue:[],held:[],residents:[],returning:[],history:[],night:null,phase:'day',selected:null,processed:0,serial:0,dead:0,expelled:0,killed:0};makeDay(s);return s;}
export function makeDay(s){s.processed=0;s.selected=null;s.night=null;s.queue=[];const count=COUNTS[s.day-1];for(let i=0;i<count;i++){const n=s.serial++;const hero=s.day===1?i===1:(i===1||i===count-1&&s.day>3);const challenge=hero?(i===1?s.day:Math.max(1,s.day-2)):0;const c={id:n,name:NAMES[n%NAMES.length],species:SPECIES[n%5],job:JOBS[n%5],hero,challenge,look:n,magic:30+(n*13)%61,inspected:{},destination:'黒曜城',permit:`OB-${1200+n}`,quote:'',language:'共通語',baggage:'薬草・パン・作業道具',invitation:false,seal:true};
 if(challenge===1){c.destination=s.day===1?'白銀の王都':'黒曜城';if(s.day>1)c.permit='失効済み';}
 if(challenge===2)c.seal=false;
 if(challenge===4)c.baggage='布に包まれた聖剣（携帯許可なし）';
 if(s.day>=4&&!hero&&c.job==='王室鍛冶師')c.baggage='修理中の聖剣（王室修理許可つき）';
 if(challenge===5)c.species='角族';
 if(s.day>=5&&!hero&&n%4===0)c.invitation=true;
 if(challenge===8){c.invitation=true;c.species='夜の民';}
 ensureDialogue(c);s.queue.push(c);}
 const ret=s.returning.find(c=>c.returnDay<=s.day);if(ret&&s.day>1){s.returning=s.returning.filter(c=>c!==ret);const replace=s.queue.length-1;s.queue[replace]={...ret,inspected:{},name:`${ret.name}・旅装`,look:ret.look+40};}
 return s;
}
export function effectiveTroops(s){return Math.max(0,s.troops-s.held.length*3);}
export function heroes(s){return s.residents.filter(c=>c.hero).length;}
export function risk(s){const n=heroes(s);if(n<3)return 0;const base=n===3?20:n===4?35:n===5?55:75;return Math.min(95,base+Math.floor((100-effectiveTroops(s))/10)*5);}
export function current(s){if(s.selected!==null)return [...s.held,...s.residents].find(c=>c.id===s.selected)||s.queue[0];return s.queue[0];}
export function where(s,c){return s.held.some(x=>x.id===c.id)?'held':s.residents.some(x=>x.id===c.id)?'resident':'queue';}
export function inspect(s,c,index){if(index>=s.day||index<0)return null;let r;
 switch(index){case 0:r=c.destination!=='黒曜城'||c.permit==='失効済み'?['bad','書類に不一致','入城先または許可番号が規定に適合しません。']:['good','基本書類は有効','入城先：黒曜城。許可番号は登録済みです。'];break;
 case 1:r=c.seal?['good','三日月と三つの点','印章の形・インクともに正式なものです。']:['bad','印章の点が一つ足りない','偽造された身分証です。'];break;
 case 2:r=translate(c);break;
 case 3:r=c.challenge===3?['bad','爆薬を検出',c.baggage]:[4,7].includes(c.challenge)?['bad','聖剣を検出','武器携帯の許可はありません。']:['good','荷物を確認',c.baggage];break;
 case 4:r=c.challenge===5?['bad','人間の姿が映りました','入城に必要な招待状を持っていません。']:c.invitation?['warn','人間の姿・招待状あり',s.day>=8?'王印の共鳴石で招待状を確認してください。':'王印つき招待状を所持。規則上、入城可能です。']:['good',`${c.species}の姿が映りました`,'変装の魔法は検出されませんでした。'];break;
 case 5:r=c.challenge===6?['bad',`実測魔力 ${c.magic+65} ／ 申告 ${c.magic}`,'誤差65。許容範囲20を超えています。']:['good',`実測魔力 ${c.magic+3} ／ 申告 ${c.magic}`,'誤差3。許容範囲内です。'];break;
 case 6:r=translate(c,true);break;
 case 7:r=c.challenge===8?['bad','王印が赤く発光','招待状は偽造されています。']:['good',c.invitation?'王印が青く共鳴':'不審な王印なし',c.invitation?'魔王様が発行した本物の招待状です。':'偽の招待状は検出されませんでした。'];break;}
 c.inspected[index]={type:r[0],title:r[1],text:r[2]};return c.inspected[index];}
export function act(s,action){if(s.phase!=='day')return {error:'審査時間外です。'};const c=current(s);if(!c)return {error:'来訪者がいません。'};const loc=where(s,c);if(action==='hold'&&(s.held.length>=2||loc!=='queue'))return {error:'隔離室は満室です。先に収容者の処遇を決めてください。'};if(action==='admit'&&loc==='resident')return {error:'すでに入国しています。'};if(action==='deny'&&loc!=='queue')return {error:'城内の人物には追放を選んでください。'};if(action==='expel'&&loc==='queue')return {error:'門前では入国拒否を選んでください。'};
 const cost=action==='kill'?15:action==='expel'?8:0;if(s.troops<cost)return {error:'兵力が不足しています。補給や衛兵の入城が必要です。'};
 s.troops-=cost;if(cost)s.dead+=cost;
 if(loc==='queue'){s.queue.shift();s.processed++;}else if(loc==='held')s.held=s.held.filter(x=>x.id!==c.id);else s.residents=s.residents.filter(x=>x.id!==c.id);
 if(action==='admit'){s.residents.push(c);if(!c.hero&&!c.supported){if(c.job==='衛兵志願者')s.troops=Math.min(100,s.troops+12);else if(c.job==='回復術師')s.troops=Math.min(100,s.troops+8);s.food+=c.job==='補給商人'?5:2;c.supported=true;}}
 if(action==='hold')s.held.push(c);
 if(action==='kill')s.killed++;
 if(action==='expel'){s.expelled++;if(c.hero&&s.day<8){c.returnDay=s.day+2;s.returning.push(c);}}
 const labels={admit:'入国許可',deny:'入国拒否',hold:'隔離',kill:'殺害',expel:'追放'};s.history.push({day:s.day,name:c.name,action:labels[action],hero:c.hero,cost});s.selected=null;return {name:c.name,action:labels[action],cost};}
export function endNight(s){if(s.phase!=='day'||s.queue.length)return {error:'今日の来訪者を全員審査してください。'};const h=heroes(s);const starvation=s.food<4;const loss=h*3+(starvation?18:0);s.food=Math.max(0,s.food-4);s.troops=Math.max(0,s.troops-loss);s.dead+=loss;const chance=risk(s);const roll=Math.floor(random(s)*100)+1;const fallen=s.troops===0||(chance>0&&roll<=chance);s.night={heroes:h,loss,starvation,chance,roll,fallen,day:s.day,events:s.history.filter(e=>e.day===s.day)};s.phase=fallen?'lost':s.day===DAYS?'won':'night';s.selected=null;return s.night;}
export function nextDay(s){if(s.phase!=='night')return false;s.day++;s.phase='day';makeDay(s);return true;}
