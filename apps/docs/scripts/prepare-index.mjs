import { access, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { basename, relative, resolve } from 'node:path';
import { parse } from 'yaml';

const appRoot = resolve(import.meta.dirname, '..');
const contentRoot = resolve(appRoot, 'content');
const examplesRoot = resolve(appRoot, '.vitepress/theme/demo/examples');
const generatedRoot = resolve(appRoot, '.vitepress/theme/generated');
const categories = JSON.parse(await readFile(resolve(appRoot, 'data/categories.json'), 'utf8'));
const codeSources = JSON.parse(await readFile(resolve(appRoot, 'data/code-sources.json'), 'utf8'));
const categoryLabels = new Map(categories.map(({ id, label }) => [id, label]));
const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const demoPattern = /<DemoBlock\b([\s\S]*?)\/>/g;
const attributePattern = /\b(id|kind)="([^"]+)"/g;

async function collectFiles(directory, predicate) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (directory === contentRoot && entry.name === 'public') continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectFiles(path, predicate)));
    else if (predicate(entry.name)) files.push(path);
  }
  return files;
}

function routeOf(path) {
  const name = relative(contentRoot, path).replaceAll('\\', '/').replace(/\.md$/, '');
  return `/${name.replace(/(?:^|\/)index$/, '')}`.replace(/\/$/, '') || '/';
}

function splitTitle(title) {
  const index = title.lastIndexOf(' ');
  return index === -1
    ? { englishTitle: title, chineseTitle: title }
    : { englishTitle: title.slice(0, index), chineseTitle: title.slice(index + 1) };
}

function searchTextOf(body) {
  return body
    .replaceAll(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replaceAll(/[#*`|>{}]/g, ' ')
    .replaceAll(/\s+/g, ' ')
    .trim();
}

const exampleFiles = await collectFiles(examplesRoot, (name) => /^zh-CN-.*\.vue$/.test(name));
const exampleIds = new Set();
for (const path of exampleFiles) {
  const id = basename(path, '.vue');
  if (exampleIds.has(id)) throw new Error(`示例 ID 重复：${id}`);
  exampleIds.add(id);
}

const pages = [];
const seenRoutes = new Set();
const seenDemos = new Set();
for (const path of await collectFiles(contentRoot, (name) => name.endsWith('.md'))) {
  const source = await readFile(path, 'utf8');
  const match = source.match(frontmatterPattern);
  if (!match) throw new Error(`文档缺少 frontmatter：${path}`);
  const values = parse(match[1]);
  const route = routeOf(path);
  if (seenRoutes.has(route)) throw new Error(`文档路由重复：${route}`);
  seenRoutes.add(route);
  if (typeof values?.title !== 'string' || !values.title.trim())
    throw new Error(`文档缺少标题：${route}`);
  if (typeof values?.type !== 'string' || !categoryLabels.has(values.type))
    throw new Error(`文档分类无效：${route}`);
  if (typeof values?.order !== 'number') throw new Error(`文档顺序无效：${route}`);
  if (values.icon) {
    try {
      await access(resolve(contentRoot, 'public/doc-icons', `${values.icon}.svg`));
    } catch {
      throw new Error(`文档图标不存在：${route} (${values.icon})`);
    }
  }

  const body = source.slice(match[0].length);
  for (const demo of body.matchAll(demoPattern)) {
    const attributes = Object.fromEntries(
      [...demo[1].matchAll(attributePattern)].map(([, name, value]) => [name, value]),
    );
    const { id, kind } = attributes;
    if (!id || !['live', 'import', 'code'].includes(kind))
      throw new Error(`DemoBlock 缺少有效 id 或 kind：${route}`);
    if (seenDemos.has(id)) throw new Error(`DemoBlock ID 重复：${id}`);
    seenDemos.add(id);
    if (kind === 'live' && !exampleIds.has(id))
      throw new Error(`可运行示例缺少 Vue 文件：${route} (${id})`);
    if (kind !== 'live' && codeSources[id]?.kind !== kind)
      throw new Error(`代码示例缺少本地源码：${route} (${id})`);
  }

  pages.push({
    route,
    title: values.title,
    description: typeof values.description === 'string' ? values.description : '',
    type: values.type,
    order: values.order,
    icon: values.icon ?? null,
    searchText: searchTextOf(body),
  });
}

for (const id of exampleIds) {
  if (!seenDemos.has(id)) throw new Error(`Vue 示例未被文档引用：${id}`);
}
for (const id of Object.keys(codeSources)) {
  if (!seenDemos.has(id)) throw new Error(`代码示例未被文档引用：${id}`);
}

const nav = {
  categories: categories
    .map(({ id, label }) => ({
      id,
      label,
      pages: pages
        .filter((page) => page.type === id && page.route !== '/')
        .sort(
          (left, right) =>
            left.order - right.order || left.title.localeCompare(right.title, 'zh-Hans-CN'),
        )
        .map((page) => ({
          title: page.title,
          englishTitle: splitTitle(page.title).englishTitle,
          path: page.route,
          icon: page.icon,
          order: page.order,
        })),
    }))
    .filter((category) => category.pages.length > 0),
};
const searchIndex = pages
  .filter((page) => page.route !== '/')
  .map((page) => {
    const { englishTitle, chineseTitle } = splitTitle(page.title);
    return {
      title: `${englishTitle} ${chineseTitle}`,
      path: page.route,
      category: categoryLabels.get(page.type),
      text: `${page.description} ${page.searchText}`.replaceAll(/\s+/g, ' ').trim().slice(0, 4000),
    };
  });

await mkdir(generatedRoot, { recursive: true });
await writeFile(resolve(generatedRoot, 'nav.json'), `${JSON.stringify(nav, null, 2)}\n`);
await writeFile(
  resolve(contentRoot, 'public/search-index.json'),
  `${JSON.stringify(searchIndex)}\n`,
);
console.log(`文档索引已生成：${pages.length} 页、${seenDemos.size} 个示例。`);
