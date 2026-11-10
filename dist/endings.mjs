import {effectiveTroops,heroes} from './engine.mjs';

export const ENDINGS={
 dawn:{number:'01',title:'暁の門番',subtitle:'その門は、誰かの帰る場所になった。',tone:'dawn',seal:'黒曜城・第一等守門勲章',
 scenes:[
  {place:'第九日の朝 · 黒曜城の正門',speaker:'語り',text:'八度目の夜が明けた。門の外には、いつもと同じ列がある。薬売りは荷車を引き、衛兵は少し眠そうに笑っている。あなたが通したのは、城の明日をつくる者たちだった。'},
  {place:'玉座の間',speaker:'魔王様',text:'「敵を見抜くだけなら、剣にもできよう。だが、守るべき者を迎え入れることは、お前にしかできなかった。よくぞ余の国を守った、門番よ。」'},
  {place:'正門検問所 · 新しい通達',speaker:'語り',text:'机の上に、金の勲章と新しい通達が置かれていた。そこには一行だけ。『これからも、よく見て、よく聞くこと』。あなたは少し笑い、今日最初の許可証を受け取った。'}]},
 tomorrow:{number:'02',title:'明日も開く門',subtitle:'完璧ではなくても、守り抜いた八日間。',tone:'dawn',seal:'黒曜城・守門功労章',
 scenes:[
  {place:'第九日の朝 · 城下町',speaker:'語り',text:'朝の鐘が鳴り、城下町の店が戸を開ける。あなたは八日分の記録を綴じた。迷った名前も、押し直したかったハンコも、消えることはない。それでも、城には朝が来た。'},
  {place:'玉座の間',speaker:'魔王様',text:'「お前も迷い、時には誤ったのであろう。それでも門を投げ出さなかった。余はその務めを認める。次は、今日より少しよい判断をしてみせよ。」'},
  {place:'正門検問所 · 交代の時間',speaker:'語り',text:'交代の門番が、温かい茶を持ってきた。「あとは任せてください」。門の向こうから、知らない言葉の挨拶が聞こえる。あなたは辞典を渡し、ようやく椅子から立ち上がった。'}]},
 scarred:{number:'03',title:'傷だらけの凱旋',subtitle:'王は生きた。その代償を、忘れない。',tone:'ember',seal:'黒曜城・防衛戦功章',
 scenes:[
  {place:'第九日の朝 · 城壁の上',speaker:'語り',text:'夜明けの光が、欠けた城壁を照らしている。勝利の鐘は鳴った。だが、昨日までそこに立っていた兵士の姿が、いくつも見当たらない。あなたは審査記録を胸に、玉座へ向かった。'},
  {place:'玉座の間',speaker:'魔王様',text:'「余は生きている。お前たちが守った命だ。だが、生き残ったことだけを誇るな。失った者たちの名を記し、二度と同じ穴を門に開けぬことだ。」'},
  {place:'城門の修復現場',speaker:'語り',text:'勲章を机の引き出しにしまい、あなたは新しい審査手順を書き始めた。勝利は終わりではない。戻らなかった者たちのために、この城の次の朝を、もっと静かなものにしよう。'}]},
 iron:{number:'04',title:'鉄の門、静かな城',subtitle:'守られた玉座と、遠ざかった足音。',tone:'ember',seal:'黒曜城・厳戒防衛記録',
 scenes:[
  {place:'第九日の朝 · 正門前',speaker:'語り',text:'魔王は生き残った。城門も破られてはいない。だが、門前の列は短くなった。「あの城には近づくな」と囁く声が、街道に残っている。危険とともに、迎えるはずの者も遠ざけてしまった。'},
  {place:'玉座の間',speaker:'魔王様',text:'「余の命を守った働きは認めよう。だが、余が治めたいのは、誰も訪ねぬ空の城ではない。お前が閉ざした門の向こうにも、この国の民がいたことを忘れるな。」'},
  {place:'正門検問所 · 閉じた帳簿',speaker:'語り',text:'帳簿には、拒否と処分の文字が並んでいた。あなたはその隣に、もう一度確かめるべきだった問いを書き添える。鉄の門を開く鍵は、まだあなたの手の中にある。'}]},
 fallen:{number:'05',title:'最後の入城許可',subtitle:'その一押しの先に、玉座があった。',tone:'ash',seal:'黒曜城・陥落記録',
 scenes:[
  {place:'黒曜城 · 警鐘の鳴る夜',speaker:'語り',text:'最後の警鐘が、途中で途切れた。城内へ通した者たちが剣を抜き、守備隊の向こうへ消えていく。あなたの机には、まだ乾かない入城許可の印が残っていた。'},
  {place:'誰もいない玉座の間',speaker:'残された伝令',text:'「魔王様は……お戻りになりません。門番殿、どうか記録だけは持ち出してください。何が起きたのか、次に門を守る者へ伝えるために。」'},
  {place:'城外の街道 · 明けない朝',speaker:'語り',text:'あなたは帳簿を開く。あの言葉。あの印章。確かめることのできた違和感が、紙の上に並んでいる。もし、もう一度あの窓口に立てるなら。今度こそ、その名を見逃さない。'}]},
 empty:{number:'06',title:'誰も守れない城',subtitle:'門だけでは、国を守れなかった。',tone:'ash',seal:'黒曜城・防衛線崩壊記録',
 scenes:[
  {place:'黒曜城 · 静まり返った城壁',speaker:'語り',text:'警備の交代時刻になっても、次の兵士は来なかった。任務と消耗を重ねた守備隊に、もう城を守る余力はない。厚い門も、高い城壁も、それを支える者がいなければただの石だった。'},
  {place:'正門検問所 · 最後の伝令',speaker:'残された伝令',text:'「防衛線は維持できません。玉座からの連絡も、途絶えました。城へ入れる者を選ぶことは、城を支える者を選ぶことでもあったのですね……。」'},
  {place:'放棄された正門',speaker:'語り',text:'机に残された許可証が、風で一枚めくれた。そこには兵士や商人、治療師の名前がある。守るとは、ただ拒むことではない。その意味を胸に、あなたは次の任務を待つ。'}]}
};
export function endingStats(s){const history=s.history||[];const count=(action,hero)=>history.filter(e=>e.action===action&&(hero===undefined||e.hero===hero)).length;
 return {day:s.day,visitors:Math.max(0,(s.serial||0)-(s.queue?.length||0)),troops:effectiveTroops(s),food:s.food,losses:s.dead||0,
  alliesAdmitted:count('入国許可',false),heroesAdmitted:count('入国許可',true),heroesDenied:count('入国拒否',true),
  alliesTurnedAway:count('入国拒否',false)+count('追放',false),alliesKilled:count('殺害',false),
  expelled:count('追放'),killed:count('殺害'),remainingHeroes:heroes(s),held:s.held.length};}
export function getEnding(s){if(!['won','lost'].includes(s.phase))return null;const stats=endingStats(s);let id;
 if(s.phase==='lost')id=s.troops<=0?'empty':'fallen';
 else if(stats.alliesKilled>0||stats.alliesTurnedAway>=3)id='iron';
 else if(stats.troops<40||stats.losses>=40||stats.remainingHeroes>0)id='scarred';
 else if(stats.heroesAdmitted===0&&stats.alliesTurnedAway===0&&stats.alliesKilled===0&&stats.held===0&&stats.troops>=70)id='dawn';
 else id='tomorrow';
 return {id,...ENDINGS[id],stats};}
export function beginEnding(s){if(!getEnding(s))return false;s.ending={step:0};return true;}
export function endingStep(s){return Math.max(0,Math.min(3,Number.isInteger(s.ending?.step)?s.ending.step:0));}
export function advanceEnding(s,skip=false){if(!getEnding(s)||!s.ending)return false;s.ending.step=skip?3:Math.min(3,endingStep(s)+1);return true;}
