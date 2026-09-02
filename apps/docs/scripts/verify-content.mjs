import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../../..');
const docsRoot = resolve(root, 'apps/docs');
const pilots = ['button', 'select', 'modal', 'table', 'icon', 'json-viewer'];
const locales = ['zh-CN', 'en-US'];
const errors = [];

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

const astroConfig = await readFile(resolve(docsRoot, 'astro.config.ts'), 'utf8');
if (/\bcustomCss\s*:|\bcomponents\s*:/.test(astroConfig)) {
  errors.push('Starlight 配置不得注册 customCss 或组件 override');
}
if (await exists(resolve(docsRoot, 'src/theme'))) {
  errors.push('默认 Starlight 文档站不得保留 src/theme');
}

for (const slug of pilots) {
  const required = [
    resolve(docsRoot, `src/demos/${slug}/Showcase.vue`),
    resolve(docsRoot, `src/data/api/${slug}.ts`),
    resolve(root, `docs/components/${slug}/coverage.md`),
    ...locales.map((locale) =>
      resolve(docsRoot, `src/content/docs/${locale}/components/${slug}.mdx`),
    ),
  ];

  for (const path of required) {
    if (!(await exists(path))) errors.push(`缺少 ${path.slice(root.length + 1)}`);
  }

  for (const locale of locales) {
    const pagePath = resolve(docsRoot, `src/content/docs/${locale}/components/${slug}.mdx`);
    if (!(await exists(pagePath))) continue;
    const page = await readFile(pagePath, 'utf8');
    for (const marker of ['DemoBlock', 'ApiTable', 'React']) {
      if (!page.includes(marker)) errors.push(`${slug}/${locale} 缺少 ${marker}`);
    }
    if (/待补充|即将支持|TODO|TBD/i.test(page)) {
      errors.push(`${slug}/${locale} 包含未完成占位内容`);
    }
  }

  for (const legacy of ['index.md', 'index.en-US.md', 'react-to-vue.md']) {
    const legacyPath = resolve(root, `docs/components/${slug}/${legacy}`);
    if (await exists(legacyPath))
      errors.push(`仍存在重复用户文档 ${legacyPath.slice(root.length + 1)}`);
  }
}

const runtimeFiles = [
  resolve(docsRoot, 'src/components/DemoBlock.astro'),
  resolve(docsRoot, 'src/components/ApiTable.astro'),
  ...pilots.map((slug) => resolve(docsRoot, `src/demos/${slug}/Showcase.vue`)),
];

for (const path of runtimeFiles) {
  const source = await readFile(path, 'utf8');
  if (source.includes('vendor/semi-design') || source.includes('@douyinfe/')) {
    errors.push(`公开文档运行时越过边界 ${path.slice(root.length + 1)}`);
  }
  if (path.endsWith('.vue') && /<style(?:\s|>)/i.test(source)) {
    errors.push(`Demo 不得维护文档站自定义样式 ${path.slice(root.length + 1)}`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`文档内容门禁通过：${pilots.length} 个组件、${locales.length} 种语言。`);
}
