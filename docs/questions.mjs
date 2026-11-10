import {ensureDialogue} from './dialogue.mjs';

// Offline, bounded question interpretation. Unknown or ambiguous questions are
// returned to the player for rephrasing, never answered with a random yes/no.
const RULES=[
 ['invitationReal',/招待状(?:は|が|って)?本物/g,'招待状が本物である',c=>!!c.invitation],
 ['invitationFake',/招待状(?:は|が|って)?(?:偽物|偽造|にせもの)/g,'招待状が偽物である',()=>false],
 ['repairPermit',/修理(?:の)?許可(?:証)?/g,'修理の許可がある',c=>c.baggage.includes('修理許可')],
 ['weaponPermit',/(?:武器|聖剣|剣)(?:の)?(?:携帯|持ち込み|所持)?許可(?:証)?|携帯許可(?:証)?/g,'武器の携帯許可がある',c=>c.baggage.includes('修理許可')],
 ['invitation',/招待状|招待(?:され|を受け)|お招き/g,'招待状がある',c=>c.invitation],
 ['falsePaper',/(?:偽造|偽物|にせもの|ニセモノ)(?:の)?(?:書類|身分証|許可証|印章)?/g,'書類が偽物である',()=>false],
 ['realPaper',/本物(?:の)?(?:書類|身分証|許可証|印章)?/g,'書類が本物である',()=>true],
 ['permit',/入城許可証|入国許可証|通行証|身分証|許可証|書類/g,'身分証・許可証がある',()=>true],
 ['language:山岳ゴブリン語',/山岳ゴブリン語|山岳方言/g,'山岳ゴブリン語を話す',c=>c.language==='山岳ゴブリン語'],
 ...['共通語','ゴブリン語','角族語','獣人語','夜語','スライム語'].map(lang=>[`language:${lang}`,new RegExp(lang,'g'),`${lang}を話す`,c=>c.language===lang]),
 ['hero',/勇者|ゆうしゃ/g,'勇者である',c=>c.challenge===7],
 ['attack',/魔王(?:様|さま)?(?:を|の命を)?(?:倒(?:す|し|そう)|討(?:つ|ち|とう)|殺(?:す|し|そう)|狙(?:う|い|おう))|暗殺|討伐/g,'魔王様を討つ目的で来た',c=>c.challenge===7],
 ['ally',/味方|仲間|魔王軍(?:の一員|に所属)?/g,'魔王軍の味方である',c=>c.challenge!==7],
 ['species:人間',/人間|にんげん/g,'人間である',c=>!!c.invitation],
 ...['ゴブリン','角族','獣人','夜の民','スライム'].map(species=>[`species:${species}`,new RegExp(species,'g'),`${species}である`,c=>!c.invitation&&c.species===species]),
 ['species:魔物',/魔物|魔族/g,'魔物である',c=>!c.invitation],
 ['job:薬売り',/薬売り|薬師|薬屋|薬を(?:売|届|納)/g,'薬を届ける仕事で来た',c=>c.job==='薬売り'],
 ['job:補給商人',/補給商人|商人|補給|食料を(?:届|運|納)/g,'食料の補給に来た',c=>c.job==='補給商人'],
 ['job:衛兵志願者',/衛兵(?:志願者)?|守備隊|警備|見張り/g,'衛兵として働きに来た',c=>c.job==='衛兵志願者'],
 ['job:回復術師',/回復術師|治療師|治療|手当て|手当|医者/g,'治療の仕事で来た',c=>c.job==='回復術師'],
 ['job:王室鍛冶師',/王室鍛冶師|鍛冶師|鍛冶屋|修理/g,'武具の修理に来た',c=>c.job==='王室鍛冶師'],
 ['explosive',/爆薬|爆弾|火薬/g,'爆薬を持っている',c=>c.challenge===3],
 ['holySword',/聖なる(?:武器|剣)|聖剣/g,'聖剣を持っている',c=>c.baggage.includes('聖剣')&&c.challenge!==4],
 ['woodSword',/木(?:の|製の)?剣|木刀/g,'木剣を持っている',c=>c.baggage.includes('木剣')],
 ['sword',/剣|刀/g,'剣を持っている',c=>c.baggage.includes('剣')&&c.challenge!==4],
 ['weapon',/武器/g,'武器を持っている',c=>c.baggage.includes('剣')&&c.challenge!==4],
 ['herb',/薬草|やくそう/g,'薬草を持っている',c=>c.baggage.includes('薬草')],
 ['medicine',/傷薬|薬瓶|煎じ薬|薬/g,'治療用の薬を持っている',c=>c.challenge!==3&&/薬草|薬瓶|傷薬/.test(c.baggage)],
 ['bandage',/包帯|ほうたい/g,'包帯を持っている',c=>c.baggage.includes('包帯')],
 ['bread',/パン|ぱん/g,'パンを持っている',c=>c.baggage.includes('パン')],
 ['meat',/干し肉|肉/g,'肉を持っている',c=>c.baggage.includes('肉')],
 ['food',/食料|食糧|食べ物/g,'食料を持っている',c=>/パン|干し肉/.test(c.baggage)],
 ['hammer',/金槌|かなづち|ハンマー/g,'金槌を持っている',c=>c.baggage.includes('金槌')],
 ['stone',/砥石|といし/g,'砥石を持っている',c=>c.baggage.includes('砥石')],
 ['clothes',/着替え|制服/g,'着替えを持っている',c=>c.baggage.includes('着替え')],
 ['baggage',/荷物|鞄|かばん|カバン/g,'荷物を持っている',c=>!!c.baggage],
 ['destination:黒曜城',/黒曜城/g,'入城先は黒曜城である',c=>c.destination==='黒曜城'],
 ['destination:白銀の王都',/白銀の王都/g,'入城先は白銀の王都である',c=>c.destination==='白銀の王都']
];
const UNKNOWN='質問を読み取れませんでした。「薬草を持っていますか？」のように、種族・職業・荷物・書類について一つずつ聞いてください。';
export function interpretQuestion(c,input){
 if(typeof input!=='string'||!input.trim())return {error:'質問を入力してください。'};
 const question=input.normalize('NFKC').trim();
 if(question.length>120)return {error:'質問は120文字以内で入力してください。'};
 let q=question.replace(/\s/g,'');
 if(/[<>]|なぜ|どうして|どこ|どちら|どんな|何者|何人|何語|何を|何です|何が|誰|だれ|いつ|いくつ|教えて|説明して/.test(q))return {error:'「はい」「いいえ」で答えられる形にしてください。例：招待状はありますか？'};
 // Requests to invent answers, quotations, and multi-clause questions are not
 // statements about the visitor and cannot safely map to a single fact.
 if(/[「」『』]|答え|回答|と言|って言|なら|場合|けど|ですが|だが|しかし|または|それとも|あるいは|そして|かつ|それから/.test(q))return {error:'一度に一つの事柄を質問してください。例：あなたは獣人ですか？'};
 const matches=[];
 for(const [key,pattern,label,value] of RULES){pattern.lastIndex=0;if(pattern.test(q)){matches.push({key,label,value});pattern.lastIndex=0;q=q.replace(pattern,'');}}
 // Generic container words in "鞄に薬草はありますか" don't constitute a
 // second question. Likewise "種族は魔物のゴブリン" identifies one species.
 let found=matches.filter(m=>!(m.key==='baggage'&&matches.some(x=>!['baggage'].includes(x.key)&&!x.key.startsWith('species:'))));
 if(found.some(x=>x.key.startsWith('species:')&&x.key!=='species:魔物'))found=found.filter(x=>x.key!=='species:魔物');
 if(found.some(x=>['holySword','woodSword','sword'].includes(x.key)))found=found.filter(x=>x.key!=='weapon');
 if(found.length!==1)return {error:found.length? '一度に一つの事柄を質問してください。例：薬草を持っていますか？':UNKNOWN};
 // Avoid guessing whether permission, taste, or a hypothetical refers to actual
 // possession. Only simple present-tense declarations are supported.
 if(/好き|嫌い|ほしい|欲しい|ください|でき|出来|使え|使う|使い|必要|食べ|売れ|売っ|買|落と|盗|以前|昔|昨日|明日|予定|はず|以外|だけ|のみ/.test(q))return {error:UNKNOWN};
 if(found[0].key==='attack')q=q.replace(/つもり|ため|目的|しよう|して/g,'');
 const grammar=q.replace(/あなた|貴方|あんた|お前|きみ|君|本当に|ほんとうに|本当は|実際に|実は|現在|今|その|この|こちら|職業|種族|目的|入城先|入国先|行き先|行先|荷物の中|鞄の中|中/g,'');
 if(!/^(?:持って|持つ|持た|持ち|所持して|携帯して|入って|話せ|話さ|話し|喋れ|しゃべれ|勤めて|働いて|志願して|応募して|来て|来た|きた|いる|います|いません|いない|ある|あります|ありません|あり|ない|無い|なし|無|い|る|ます|ません|でした|だった|です|だ|でしょう|では|じゃ|で|は|が|を|の|に|と|も|へ|ん|か|な|よ|ね|[?？。!！、])*$/u.test(grammar))return {error:UNKNOWN};
 const negative=/(?:では|じゃ|で|持って|持つ|持た|入って|入る|あり|い|居|話せ|話さ|運ば|届け|来て)?(?:ない|無い|ません|ぬ)|なし|無(?:し|しで)/.test(q);
 const fact=found[0],value=!!fact.value(c),answer=negative?!value:value;
 return {question,answer:answer?'はい':'いいえ',meaning:negative?`「${fact.label}」を否定する質問`:fact.label,negative};
}
export function askQuestion(c,input){ensureDialogue(c);const result=interpretQuestion(c,input);if(result.error)return result;
 c.questions??=[];c.questions.push(result);c.questions=c.questions.slice(-8);
 c.dialogue.question={text:`${result.answer}。`,meaning:`${result.answer}。`};c.speechTopic='question';c.quote=c.dialogue.question.text;
 return result;
}
