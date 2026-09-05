import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const app = resolve(import.meta.dirname, '..');
const output = resolve(app, '.output/public');
const pages = JSON.parse(await readFile(resolve(app, 'src/data/pages.json'), 'utf8'));
const documents = new Map();
const errors = [];
const decode = (text) =>
  text
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
for (const page of pages) {
  const html = await readFile(resolve(output, page.path.slice(1), 'index.html'), 'utf8');
  const ids = new Set([...html.matchAll(/\bid="([^"]*)"/g)].map((match) => decode(match[1])));
  documents.set(page.path, { html, ids });
  if (!/<h1\b/.test(html) || !/<article\b/.test(html))
    errors.push(`SSR document missing: ${page.path}`);
  if (!/<link\b[^>]*rel="canonical"/.test(html)) errors.push(`Canonical missing: ${page.path}`);
  for (const locale of ['zh-CN', 'en-US'])
    if (!html.includes(`hreflang="${locale}"`))
      errors.push(`Hreflang missing: ${page.path}: ${locale}`);
}
for (const [path, { html }] of documents) {
  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)) {
    const href = decode(match[1]);
    const target = new URL(href, `https://docs.local${path}`);
    if (target.origin !== 'https://docs.local') continue;
    const document = documents.get(target.pathname);
    if (document) {
      if (target.hash && !document.ids.has(decodeURIComponent(target.hash.slice(1))))
        errors.push(`Missing anchor: ${path} → ${href}`);
    } else if (!['/', '/zh-cn/', '/en-us/'].includes(target.pathname)) {
      try {
        await access(resolve(output, target.pathname.slice(1)));
      } catch {
        errors.push(`Missing static destination: ${path} → ${href}`);
      }
    }
  }
}
if (errors.length) {
  console.error([...new Set(errors)].join('\n'));
  process.exitCode = 1;
} else
  console.log(`静态 HTML 检查通过：${pages.length} 页正文、canonical/hreflang、内部链接及锚点。`);
