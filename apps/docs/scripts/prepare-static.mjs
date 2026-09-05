import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const app = resolve(import.meta.dirname, '..');
const output = resolve(app, '.output/public');
const pages = JSON.parse(await readFile(resolve(app, 'src/data/pages.json'), 'utf8'));
const aliases = new Map([['/', '/zh-cn/start/introduction/']]);
for (const locale of ['zh-cn', 'en-us']) {
  const upper = locale === 'zh-cn' ? 'zh-CN' : 'en-US';
  for (const prefix of [locale, upper])
    aliases.set(`/${prefix}/`, `/${locale}/start/introduction/`);
}
for (const page of pages) {
  aliases.set(page.path.replace(/^\/(zh-cn|en-us)/, `/${page.locale}`), page.path);
}
for (const [alias, target] of aliases) {
  if (alias === target) continue;
  const directory = resolve(output, `.${alias}`);
  const existing = await stat(resolve(directory, 'index.html')).catch(() => null);
  const canonical = await stat(resolve(output, `.${target}`, 'index.html')).catch(() => null);
  // APFS is usually case-insensitive: an alias write would overwrite its canonical
  // page and create a redirect loop. Static hosts can use the emitted redirect rules.
  if (existing && canonical && existing.ino === canonical.ino) continue;
  await mkdir(directory, { recursive: true });
  // Keep old bookmarks functional on any static host, including with JavaScript disabled.
  await writeFile(
    resolve(directory, 'index.html'),
    `<!doctype html><html lang="${target.startsWith('/en-us') ? 'en' : 'zh-CN'}"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${target}"><link rel="canonical" href="https://semi.fuxiaochen.com${target}"><title>Semi UI Vue</title></head><body><a href="${target}">Semi UI Vue</a><script>location.replace(${JSON.stringify(target)} + location.search + location.hash)</script></body></html>`,
  );
}
await writeFile(
  resolve(output, '_redirects'),
  [...aliases]
    .filter(([alias, target]) => alias !== target)
    .map(([alias, target]) => `${alias} ${target} 301`)
    .join('\n') + '\n',
);
console.log(`静态兼容入口已生成：${aliases.size} 个。`);
