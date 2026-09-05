import { readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const app = resolve(import.meta.dirname, '..');
const foundation = resolve(app, '../../vendor/semi-design/packages/semi-foundation');
const tokens = [];
for (const component of (await readdir(foundation)).sort()) {
  const source = await readFile(resolve(foundation, component, 'variables.scss'), 'utf8').catch(
    () => '',
  );
  for (const match of source.matchAll(/^\s*(\$[\w-]+):\s*([^;]+);/gm)) {
    tokens.push({ component, name: match[1], value: match[2].replace(/\s*!default$/, '').trim() });
  }
}
await writeFile(resolve(app, 'src/data/tokens.json'), JSON.stringify(tokens, null, 2) + '\n');
console.log(`设计变量已从固定 Foundation 读取：${tokens.length} 项。`);
