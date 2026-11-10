// Each opening line is authored for one visitor. Translations travel with the
// phrase so the UI, dictionary and translator always describe the same speech.
export const TOPICS={greeting:'あいさつ',purpose:'来訪の目的',cargo:'荷物について'};
const PROFILES=[
 ['ゴブリン語','モク・フワ、ネル・トト。','朝摘みの薬草だよ。しおれる前に届けたいんだ。'],
 ['共通語','この門、地図よりずっと大きいですね。道を間違えたかな。'],
 ['獣人語','ガウ・ラグ！ フン・カラ。','衛兵の募集を見たぞ！ 走ってきたから腹ぺこだ。'],
 ['夜語','セレ・ルナ、エイル・ノア。','月の加護を。夜勤の治療係と交代に来ました。'],
 ['スライム語','ぷる・カン！ ぽよ・ティン。','金槌は振れます！ 握る手は今から作ります。'],
 ['共通語','この匂い？ 薬草だよ。さっきの門番にも怪しまれたんだ。'],
 ['角族語','ドル・バラ、ケル・オム。','荷車が坂で止まってな。角で押して運んできた。'],
 ['獣人語','ワフ・ラグ、クル・ナイ。','見張りには自信がある。夜でも耳は眠らないからな。'],
 ['夜語','エイル・セレ、ルナ・フィア。','お疲れでしょう。包帯を替える暇はありましたか。'],
 ['スライム語','ぽよ・カン、ぷる・シー。','熱い炉は苦手。でも剣を磨く腕はあるよ。'],
 ['ゴブリン語','モク・ナナ、トト・ネル。','娘が煎じた薬なんだ。苦いけどよく効くよ。'],
 ['共通語','干し肉は数えますか？ つまみ食いした分も申告します。'],
 ['獣人語','グル・ラグ。ガウ・トー。','鎧は小さいが、度胸は大きい。試験を受けさせてくれ。'],
 ['夜語','ノア・エイル。ヴェル・シア。','治療の依頼で参りました。荷物は慎重に扱ってください。'],
 ['スライム語','ぷるる・カン？ ぽよ・リン。','職人の受付はここ？ 道案内の看板にくっついちゃった。'],
 ['ゴブリン語','モク・ポカ、ムグ・ネル。','温めて飲む薬だよ。湯気で眼鏡が曇っちゃった。'],
 ['角族語','バラ・ドルム。オム・ケル。','検問の作法には不慣れだ。必要な書類はこれでよいか。'],
 ['獣人語','ワウ・ラグ、ガル・ホウ。','城の鐘を聞いて来た。守備隊にはまだ空きがあるか。'],
 ['夜語','ルナ・エイル、シア・メル。','便りを預かっています。治療棟の者に会わせてください。'],
 ['共通語','修理の剣は抜かないでね。刃こぼれで指を切るから。'],
 ['ゴブリン語','モク・キラ、ネル・フワ。','光る薬草？ 普通だよ。暗いところで育てたんだ。'],
 ['角族語','バラ・ドン、ドル・ガム。','樽が重いのではない。橋が細すぎるのだ。'],
 ['獣人語','クル・ラグ！ ワフ・セン。','足音を消す訓練をしてきた。驚かせたならすまない。'],
 ['夜語','エイル・ノク、セレ・アム。','診療所から来ました。鞄の留め金には触れないで。'],
 ['スライム語','ぷる・カン、ぽよよ・タン！','新しい鎧を打ちに来たよ。ぼくの鎧じゃないけどね！'],
 ['山岳ゴブリン語','ナム・モク、ネル・タル。','山を三つ越えて薬を運んできた。門が見えて安心したよ。'],
 ['角族語','ドル・バラ。ケル・サム。','通行証を確かめてくれ。手袋は外した方がいいか。'],
 ['山岳ゴブリン語','ガダ・ネル・マオ。ナム・ガダ。','故郷の山里に、立派な衛兵になると約束したんだ。'],
 ['夜語','セレ・レイ、エイル・ソル。','お招きにあずかり光栄です。こちらが招待状です。'],
 ['スライム語','ぽよ・リン、ぷる・カンカン。','扉の蝶番が鳴ってるよ。審査のあと直していい？'],
 ['共通語','薬瓶は振らないでください。光ります。かなり光ります。']
];
const JOB_KEYS={'薬売り':'medicine','補給商人':'supply','衛兵志願者':'guard','回復術師':'heal','王室鍛冶師':'forge'};
const PURPOSE={medicine:['城の診療所に薬を納めたいんだ。','薬師に頼まれた煎じ薬を届けに来たよ。','傷を治す薬草を、医務室に渡したいんだ。'],supply:['台所に食料を届けに来た。','倉庫へ補給品を運ぶ仕事で来たんだ。','守備隊の食事を切らさないように来たよ。'],guard:['守備隊に志願したい。夜の見張りも任せてくれ。','衛兵の採用試験を受けに来た。','城壁の警備を手伝いたいんだ。'],heal:['負傷した兵士の手当てに来ました。','診療所で治療の手伝いをします。','治療棟の夜勤に入る予定です。'],forge:['城の工房で武具を修理します。','王室から頼まれた剣の修理に来ました。','守備隊の鎧を直しに来たよ。']};
const CARGO={medicine:['薬草と薬瓶だよ。割らないように包んである。','煎じ薬と乾燥させた薬草を持っているよ。','湿布用の薬草と小さな薬瓶だよ。'],supply:['パンと干し肉だ。雨で濡れないように覆ってある。','食料の樽とパンを積んでいる。','干し肉とパンだよ。数は帳面に書いてある。'],guard:['訓練用の木剣と着替えだ。聖なる武器はない。','木剣と予備の制服だけ持ってきた。','木剣と着替えだ。制服は自分で縫った。'],heal:['包帯と治療用の薬です。','清潔な包帯と消毒用の薬を持っています。','包帯と傷薬です。すぐ使えるように分けてあります。'],forge:['金槌と砥石です。修理の道具を持ってきました。','砥石と金槌だよ。工房で使う道具です。','金槌と砥石です。手入れは毎晩欠かしません。']};
// A small consistent vocabulary, not arbitrary syllables. Basic dictionaries
// reveal keywords; the late-game translator recovers the complete intent.
const LEXICONS={
 'ゴブリン語':{medicine:'モク',supply:'パク',guard:'ガド',heal:'ルク',forge:'カン',deliver:'ネル',castle:'マオ',herb:'フワ',bottle:'チク',bread:'パン',meat:'ムグ',wood:'トク',clothes:'ヌノ',bandage:'ホウ',hammer:'ドン',stone:'ゴロ',holy:'セイ',sword:'ギル',permit:'キル',repair:'ナオ',invite:'レタ',explode:'グラ'},
 '角族語':{medicine:'モル',supply:'バラ',guard:'ガル',heal:'エル',forge:'グド',deliver:'ケル',castle:'ドル',herb:'ハル',bottle:'トム',bread:'パル',meat:'ガム',wood:'タル',clothes:'オム',bandage:'ベル',hammer:'ドン',stone:'グラド',holy:'セラ',sword:'ガルド',permit:'オル',repair:'ダル',invite:'レム',explode:'ブラグ'},
 '獣人語':{medicine:'フル',supply:'ガム',guard:'ラグ',heal:'ルウ',forge:'ガン',deliver:'ワフ',castle:'ホウ',herb:'クサ',bottle:'コル',bread:'ポフ',meat:'グル',wood:'トル',clothes:'モフ',bandage:'ホル',hammer:'ゴン',stone:'ガラ',holy:'シャウ',sword:'ガル',permit:'セフ',repair:'ナウ',invite:'レウ',explode:'バウ'},
 '夜語':{medicine:'フィア',supply:'メル',guard:'ヴェル',heal:'エイル',forge:'ソル',deliver:'ノア',castle:'ルナ',herb:'リーフ',bottle:'シア',bread:'セア',meat:'ロア',wood:'テア',clothes:'ヴェラ',bandage:'セレ',hammer:'ドア',stone:'オル',holy:'ルクス',sword:'ヴァル',permit:'レイ',repair:'アム',invite:'レイア',explode:'グラン'},
 'スライム語':{medicine:'ぷく',supply:'もにゅ',guard:'ぷるん',heal:'ぷわ',forge:'カン',deliver:'ぽよ',castle:'ぽむ',herb:'ふわ',bottle:'ぷち',bread:'ぱふ',meat:'もちゅ',wood:'とこ',clothes:'ぬる',bandage:'くる',hammer:'カンカン',stone:'ころ',holy:'きら',sword:'しゃき',permit:'ぴん',repair:'リン',invite:'ぷりん',explode:'ぼむ'},
 '山岳ゴブリン語':{medicine:'モク',supply:'バク',guard:'ガダ',heal:'ルカ',forge:'カグ',deliver:'ネル',castle:'マオ',herb:'フウ',bottle:'チカ',bread:'バン',meat:'ムガ',wood:'トグ',clothes:'ヌナ',bandage:'ホウル',hammer:'ドガ',stone:'ゴル',holy:'セイル',sword:'ギラ',permit:'キラ',repair:'ナウ',invite:'レタル',explode:'グラ',slay:'ヴァル',hero:'サー'}
};
const MEANINGS={medicine:'薬',supply:'補給',guard:'警備',heal:'治療',forge:'鍛冶',deliver:'届ける・訪ねる',castle:'城',herb:'薬草',bottle:'瓶',bread:'パン',meat:'肉',wood:'木製',clothes:'服',bandage:'包帯',hammer:'金槌',stone:'砥石',holy:'聖なる',sword:'剣',permit:'許可',repair:'修理',invite:'招待状',explode:'爆発',slay:'討伐',hero:'勇者'};
const CARGO_KEYS={medicine:['herb','bottle'],supply:['bread','meat'],guard:['wood','sword','clothes'],heal:['bandage','medicine'],forge:['hammer','stone']};
const CARGO_ITEMS={medicine:'薬草・薬瓶',supply:'パン・干し肉',guard:'訓練用の木剣・着替え',heal:'包帯・傷薬',forge:'金槌・砥石'};
function phrase(language,keys,meaning){const lex=LEXICONS[language];return {text:lex?keys.map(k=>lex[k]).join('・')+'。':meaning,meaning};}
export function ensureDialogue(c){if(c.dialogueVersion===2)return c;
 const p=PROFILES[c.id%PROFILES.length];let language=p[0];const meaning=p[2]||p[1];const key=JOB_KEYS[c.job]||'medicine',variant=Math.floor(c.id/5)%3;
 const speech={greeting:{text:p[1],meaning},purpose:null,cargo:null};
 if(![3,4,7].includes(c.challenge)&&!c.baggage.includes('修理許可'))c.baggage=CARGO_ITEMS[key];
 if(c.challenge===3)c.baggage='爆薬入りの瓶（持ち込み禁止）';
 if(c.challenge===7)c.baggage='討伐用の聖剣（携帯許可なし）';
 if(c.challenge===3)language='ゴブリン語';
 if(c.challenge===7)language='山岳ゴブリン語';
 speech.purpose=phrase(language,[key,'deliver','castle'],PURPOSE[key][variant]);
 speech.cargo=phrase(language,CARGO_KEYS[key],CARGO[key][variant]);
 if(c.challenge===3){const alternative=c.id%3===2;speech.greeting={text:alternative?'グラ・モク、ネル・マオ。':'マオ・ネル。モク？ グラ・モク。',meaning:alternative?'爆薬を魔王城に届けに来た。':'城に届け物だ。薬？ いや、爆薬だよ。'};speech.purpose=phrase(language,['explode','medicine','deliver','castle'],'城の中へ爆薬を運び込みたい。');speech.cargo=phrase(language,['bottle','explode','medicine'],'瓶の中身は爆薬だ。衝撃を与えるな。');}
 if(c.challenge===7){speech.greeting={text:'ヴァル・マオ。グラン・サー。',meaning:'魔王を討つ。勇者に栄光を。'};speech.purpose=phrase(language,['hero','slay','castle'],'勇者として、魔王を討つために来た。');speech.cargo=phrase(language,['holy','sword','slay'],'討伐に使う聖剣を持っている。');}
 if(c.challenge===4)speech.cargo=phrase(language,['holy','sword'],'持っているのは聖剣だ。携帯許可は持っていない。');
 if(c.job==='王室鍛冶師'&&c.baggage.includes('修理許可'))speech.cargo=phrase(language,['holy','sword','repair','permit'],'修理を預かった聖剣です。王室の修理許可証もあります。');
 if(c.invitation){speech.purpose=phrase(language,['invite',key,'deliver','castle'],`招待状をいただきました。${PURPOSE[key][variant]}`);}
 c.language=language;c.dialogue=speech;c.dialogueVersion=2;c.speechTopic='greeting';c.quote=speech.greeting.text;
 // Only language clues become stale when upgrading a saved game.
 if(c.inspected){delete c.inspected[2];delete c.inspected[3];delete c.inspected[6];}return c;
}
export function spoken(c){ensureDialogue(c);return c.dialogue[c.speechTopic]||c.dialogue.greeting;}
export function changeTopic(c,topic){if(!Object.hasOwn(TOPICS,topic))return false;ensureDialogue(c);c.speechTopic=topic;c.quote=spoken(c).text;return true;}
export function translate(c,full=false){const line=spoken(c);if(c.speechTopic==='question')return ['good',`指さし回答：「${line.meaning}」`,'本人の自己申告です。正しさは書類や検査道具で確認してください。'];if(c.language==='共通語')return ['good','共通語で会話できます',line.meaning];
 if(!full&&c.language==='山岳ゴブリン語')return ['warn','この方言は辞典に未収録','第7日の万能翻訳機で確認できます。言葉が通じないことだけで敵とは限りません。'];
 if(full)return [c.challenge===3||c.challenge===7?'bad':'good',`「${line.meaning}」`,`${c.language} → 共通語 ／ ${TOPICS[c.speechTopic]}の翻訳`];
 const lex=LEXICONS[c.language]||{};const tokens=line.text.split(/[・。、？！\s]+/);const words=Object.entries(lex).filter(([,word])=>tokens.includes(word)).map(([key,word])=>`${word}＝${MEANINGS[key]}`);
 return [c.challenge===3?'bad':'good',words.length?words.join(' ／ '):'慣用表現が多い発言です',c.challenge===3?'「爆発」と「薬」。爆薬を指しています。持ち込みは禁止です。':words.length?`${c.language}の単語を照合しました。細かい言い回しは万能翻訳機で確認できます。`:'別の質問で目的や荷物の単語を確認できます。全文は万能翻訳機で読めます。'];
}
export function upgradeDialogues(s){for(const list of ['queue','held','residents','returning'])for(const c of s[list]||[])ensureDialogue(c);return s;}
