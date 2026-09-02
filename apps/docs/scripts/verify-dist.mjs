import { access, readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const appRoot = resolve(import.meta.dirname, '..');
const dist = resolve(appRoot, 'dist');
const pilots = ['button', 'select', 'modal', 'table', 'icon', 'json-viewer'];
const required = [
  'index.html',
  '404.html',
  'sitemap-index.xml',
  'pagefind/pagefind.js',
  ...['zh-cn', 'en-us'].flatMap((locale) => [
    `${locale}/index.html`,
    `${locale}/components/index.html`,
    `${locale}/project/license/index.html`,
    ...pilots.map((slug) => `${locale}/components/${slug}/index.html`),
  ]),
  ...['zh-CN', 'en-US'].flatMap((locale) => [
    `${locale}/index.html`,
    ...pilots.map((slug) => `${locale}/components/${slug}/index.html`),
  ]),
];
const errors = [];

for (const path of required) {
  try {
    await access(resolve(dist, path));
  } catch {
    errors.push(`静态产物缺少 ${path}`);
  }
}

const htmlPaths = [];
async function walk(path) {
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const child = resolve(path, entry.name);
    if (entry.isDirectory()) await walk(child);
    else if (entry.name.endsWith('.html')) htmlPaths.push(child);
  }
}
await walk(dist);

for (const path of htmlPaths) {
  const html = await readFile(path, 'utf8');
  if (
    /https:\/\/(?:www\.)?(?:google-analytics|googletagmanager|plausible|segment|cdn\.jsdelivr|unpkg)\./i.test(
      html,
    )
  ) {
    errors.push(`静态页面包含禁用的外部运行时 ${path.slice(dist.length + 1)}`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`静态产物门禁通过：${required.length} 个必需入口、无跟踪运行时。`);
}
