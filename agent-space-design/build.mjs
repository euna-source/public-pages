import {build} from 'esbuild';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
import {readFile,writeFile} from 'node:fs/promises';
const root=dirname(fileURLToPath(import.meta.url));
await build({entryPoints:[join(root,'sim-src/main.js')],bundle:true,format:'iife',target:'es2020',minify:true,outfile:join(root,'simulation.js')});

// Normalize insignificant indentation in generated GLSL template strings.
const output=join(root,'simulation.js');
const source=await readFile(output,'utf8');
await writeFile(output,source.replace(/[ \t]+$/gm,'').replace(/^ +(?=\t)/gm,''));
