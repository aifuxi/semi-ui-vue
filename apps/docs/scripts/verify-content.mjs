import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const app = resolve(import.meta.dirname, '..');
const pages = JSON.parse(await readFile(resolve(app, 'src/data/pages.json'), 'utf8'));
const demos = JSON.parse(await readFile(resolve(app, 'src/data/demos.json'), 'utf8'));
const paths = new Set(pages.map((page) => page.path));
const errors = [];
const exists = (file) =>
  access(file).then(
    () => true,
    () => false,
  );
for (const page of pages) {
  const file = resolve(app, 'content', page.path.slice(1).replace(/\/$/, '') + '.md');
  const source = await readFile(
    (await exists(file)) ? file : file.replace(/\.md$/, '/index.md'),
    'utf8',
  );
  if (!page.title || !page.description || !page.category || !Number.isFinite(page.order))
    errors.push(`Invalid metadata: ${page.path}`);
  if (
    !paths.has(
      page.path.replace(/^\/(?:zh-cn|en-us)/, page.locale === 'zh-CN' ? '/en-us' : '/zh-cn'),
    )
  )
    errors.push(`Missing translation: ${page.path}`);
  if ([...source.matchAll(/```[^\n]*\n([\s\S]*?)```/g)].some((match) => !match[1].trim()))
    errors.push(`Empty code block: ${page.path}`);
  if (!/^## .+/m.test(source) && !source.includes('::component-overview'))
    errors.push(`Missing sections: ${page.path}`);
  for (const match of source.matchAll(/::demo-block\{[^}]*demo="([^"]+)"/g)) {
    if (!demos.some((demo) => demo.id === match[1] && demo.pages.includes(page.path)))
      errors.push(`Unregistered demo: ${page.path}: ${match[1]}`);
  }
  for (const match of source.replace(/```[\s\S]*?```/g, '').matchAll(/\]\(([^\s)]+)\)/g)) {
    const target = new URL(match[1], `https://docs.local${page.path}`);
    if (target.origin !== 'https://docs.local' || target.pathname === page.path) continue;
    if (
      !paths.has(target.pathname) &&
      !(await exists(resolve(app, 'public', target.pathname.slice(1))))
    )
      errors.push(`Broken link: ${page.path}: ${match[1]}`);
  }
}
const importMap = JSON.parse(
  await readFile(resolve(app, 'public/repl/import-map.json'), 'utf8'),
).imports;
for (const demo of demos) {
  for (const dependency of demo.dependencies)
    if (!(dependency in importMap))
      errors.push(`Sandbox dependency missing: ${demo.id}: ${dependency}`);
  for (const file of Object.values(demo.files)) {
    const source = await readFile(resolve(app, 'src/demos', file), 'utf8');
    if (/vendor\/semi-design|@douyinfe\//.test(source))
      errors.push(`Runtime crosses public boundary: ${file}`);
    if (
      file.endsWith('.vue') &&
      (!source.includes('<script setup lang="ts">') || !source.includes('<template>'))
    )
      errors.push(`Incomplete Vue SFC: ${file}`);
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else
  console.log(
    `Nuxt 内容结构检查通过：${pages.length} 页，${demos.length} 个已注册 Demo。此检查不替代上游覆盖与视觉验收。`,
  );
