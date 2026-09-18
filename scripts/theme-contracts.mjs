import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Union of the original theme and packed-consumer assertions. Source import/order
// checks remain in verify-theme; both artifact locations share these CSS contracts.
const contracts = JSON.parse(
  await readFile(path.join(import.meta.dirname, 'theme-contracts.json'), 'utf8'),
);

export async function verifyThemeCss(directory) {
  for (const [file, selectors] of Object.entries(contracts)) {
    const css = await readFile(path.join(directory, file), 'utf8');
    for (const selector of selectors) {
      if (!css.includes(selector)) throw new Error(`${file} 缺少样式契约：${selector}`);
    }
  }
}
