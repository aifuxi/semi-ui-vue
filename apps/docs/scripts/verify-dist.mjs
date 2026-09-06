import { createHash } from 'node:crypto';
import { access, readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const app = resolve(import.meta.dirname, '..');
const output = resolve(app, '.output/public');
const pages = JSON.parse(await readFile(resolve(app, 'src/data/pages.json'), 'utf8'));
const required = [
  'index.html',
  '404.html',
  '_redirects',
  '_headers',
  'sitemap.xml',
  'search-index.json',
  'repl/import-map.json',
  'upstream/site.css',
  'upstream/sources.json',
  'licenses/sources.json',
  'licenses/artifacts.json',
  ...pages.map((page) => `${page.path.slice(1)}index.html`),
];
const errors = [];
for (const file of required) {
  try {
    await access(resolve(output, file));
  } catch {
    errors.push(`静态产物缺少 ${file}`);
  }
}
// Fail with the missing paths before trying to parse absent generated resources.
if (errors.length) throw new Error(errors.join('\n'));

const redirects = await readFile(resolve(output, '_redirects'), 'utf8');
for (const locale of ['zh-cn', 'en-us', 'zh-CN', 'en-US']) {
  const target = `/${locale.toLowerCase()}/start/introduction/`;
  if (!redirects.split('\n').includes(`/${locale}/ ${target} 301`))
    errors.push(`缺少历史语言入口：${locale}`);
}
const search = JSON.parse(await readFile(resolve(output, 'search-index.json'), 'utf8'));
const sitemap = await readFile(resolve(output, 'sitemap.xml'), 'utf8');
for (const page of pages) {
  if (!search.some((entry) => entry.path === page.path && entry.locale === page.locale))
    errors.push(`搜索索引缺少页面：${page.path}`);
  if (!sitemap.includes(`<loc>https://semi.fuxiaochen.com${page.path}</loc>`))
    errors.push(`sitemap 缺少页面：${page.path}`);
  const html = await readFile(resolve(output, `.${page.path}`, 'index.html'), 'utf8');
  if (!/<h1(?:\s|>)/.test(html) || !html.includes('rel="canonical"'))
    errors.push(`页面缺少服务端正文或 canonical：${page.path}`);
  const alias = page.path.replace(/^\/(zh-cn|en-us)/, `/${page.locale}`);
  if (!redirects.split('\n').includes(`${alias} ${page.path} 301`))
    errors.push(`缺少大小写兼容入口：${alias}`);
}
const imports = JSON.parse(await readFile(resolve(output, 'repl/import-map.json'), 'utf8')).imports;
for (const [name, url] of Object.entries(imports)) {
  if (typeof url !== 'string' || !url.startsWith('/repl/')) {
    errors.push(`REPL 依赖不是本站资源：${name}`);
    continue;
  }
  await access(resolve(output, url.slice(1))).catch(() => errors.push(`REPL 资源缺失：${url}`));
}
const sources = JSON.parse(await readFile(resolve(output, 'licenses/sources.json'), 'utf8'));
for (const name of ['nuxt', '@nuxt/content', 'vue', '@vue/repl'])
  if (!sources.packages.some((entry) => entry.name === name)) errors.push(`许可清单缺少 ${name}`);
const artifacts = JSON.parse(await readFile(resolve(output, 'licenses/artifacts.json'), 'utf8'));
for (const artifact of artifacts) {
  const bytes = await readFile(resolve(output, `.${artifact.path}`));
  if (createHash('sha256').update(bytes).digest('hex') !== artifact.sha256)
    errors.push(`产物散列不匹配：${artifact.path}`);
}
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = resolve(directory, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (entry.name.endsWith('.html')) {
      const html = await readFile(file, 'utf8');
      if (
        /https:\/\/(?:www\.)?(?:google-analytics|googletagmanager|plausible|segment|cdn\.jsdelivr|unpkg)\./i.test(
          html,
        )
      )
        errors.push(`静态页面包含禁用的外部运行时：${file.slice(output.length + 1)}`);
      if (/<astro-island\b|\/_astro\//.test(html))
        errors.push(`静态页面包含旧框架运行时：${file.slice(output.length + 1)}`);
    }
  }
}
await walk(output);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else
  console.log(`Nuxt 静态产物门禁通过：${pages.length} 页、搜索与历史入口、本地 REPL、许可及散列。`);
