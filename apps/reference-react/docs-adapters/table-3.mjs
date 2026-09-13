import { readFileSync } from 'node:fs';
import { URL } from 'node:url';
import { adapt as adaptTable } from './table-1.mjs';

export const upstream = 'show/table';
export const exampleCount = { 'zh-cn': 7, 'en-us': 7 };

export function adapt(_code, context) {
  const { locale, number } = context;
  // Chinese blocks 31–37 correspond to English blocks 29–35.
  const sourceUrl =
    locale === 'en-us'
      ? new URL('../../../vendor/semi-design/content/show/table/index-en-US.md', import.meta.url)
      : new URL('../../../vendor/semi-design/content/show/table/index.md', import.meta.url);
  const source = readFileSync(sourceUrl, 'utf8');
  const snippets = [...source.matchAll(/```[^\n]*live=true[^\n]*\n([\s\S]*?)```/g)];
  const index = number + (locale === 'en-us' ? 27 : 29);
  const code = snippets[index]?.[1];
  if (!code || number < 1 || number > 7)
    throw new Error(`Missing pinned table block ${locale}/${index + 1}`);
  const entry = code.match(/^render\((\w+)\);?$/m)?.[1];
  if (!entry) throw new Error(`Missing pinned Table entry ${locale}/${index + 1}`);
  // Reuse only the established import, local image and language Provider adapter.
  // Missing InfiniteScroll hooks are supplied by that same live-scope adapter.
  return adaptTable(code, { ...context, entry });
}
