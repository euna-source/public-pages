import { readFile, writeFile } from 'node:fs/promises';

const spec = JSON.parse(await readFile(new URL('./motion-spec.json', import.meta.url), 'utf8'));
await writeFile(new URL('./src/config.js', import.meta.url), '// Generated from motion-spec.json. Run npm run configure after editing the JSON.\nexport const SPEC = ' + JSON.stringify(spec, null, 2) + ';\n');
console.log('src/config.js updated from motion-spec.json');
