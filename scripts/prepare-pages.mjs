import {cpSync,existsSync,lstatSync,readdirSync,rmSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const source=path.join(root,'dist'),output=path.join(root,'docs');
function checkTree(dir){for(const file of readdirSync(dir,{withFileTypes:true})){const target=path.join(dir,file.name);if(lstatSync(target).isSymbolicLink())throw Error(`Symbolic links cannot be published: ${target}`);if(file.isDirectory())checkTree(target);}}
if(!existsSync(path.join(source,'index.html')))throw Error('dist/index.html is missing.');
checkTree(source);
if(existsSync(output)){
 if(lstatSync(output).isSymbolicLink()||!existsSync(path.join(output,'.nojekyll')))throw Error('docs must be the generated Pages directory. Refusing to overwrite it.');
 rmSync(output,{recursive:true});
}
cpSync(source,output,{recursive:true});
writeFileSync(path.join(output,'.nojekyll'),'');
console.log('GitHub Pages files prepared in docs/.');
