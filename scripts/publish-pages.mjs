import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
function run(command,args,capture=false){const result=spawnSync(command,args,{cwd:root,encoding:'utf8',stdio:capture?'pipe':'inherit'});if(result.error)throw result.error;if(result.status!==0)throw Error(`${command} failed; no further publishing steps were performed.`);return result.stdout?.trim();}
const expected='https://github.com/okasinomatioka/maou-border-inspection.git';
if(run('git',['remote','get-url','origin'],true)!==expected)throw Error('Unexpected publishing repository.');
if(run('git',['branch','--show-current'],true)!=='main')throw Error('Publish from main after reviewing the changes.');
if(run('git',['diff','--cached','--name-only'],true))throw Error('Existing staged changes found. Commit or unstage them before publishing.');
run('git',['fetch','origin','main']);
run('git',['merge-base','--is-ancestor','origin/main','HEAD']);
run(process.execPath,['--test','tests/engine.test.mjs','tests/dialogue.test.mjs','tests/questions.test.mjs','tests/endings.test.mjs']);
run(process.execPath,['scripts/prepare-pages.mjs']);
run('git',['add','--','dist','docs','tests','scripts','package.json','README.md','AGENTS.md','.gitignore']);
if(run('git',['diff','--cached','--name-only'],true))run('git',['commit','-m',process.argv[2]||'Update game and GitHub Pages']);
run('git',['push','origin','main']);
console.log('Pushed. GitHub Pages deployment is asynchronous; verify its status before reporting publication complete.');
console.log('https://okasinomatioka.github.io/maou-border-inspection/');
