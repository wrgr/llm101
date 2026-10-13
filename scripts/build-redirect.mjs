/** Ship a dependency-free migration redirect instead of the retired LLM101 runtime. */
import {mkdir,copyFile,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
await copyFile('retirement/index.html','dist/index.html');
