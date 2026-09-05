import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { format, resolveConfig } from 'prettier';
import { upstreamLiveDemos } from '../../../scripts/upstream-markdown.mjs';

const root = resolve(import.meta.dirname, '../../..');
const prettierConfig = (await resolveConfig(import.meta.filename)) ?? {};
const app = resolve(root, 'apps/docs');
const inventory = JSON.parse(
  await readFile(resolve(root, 'docs/inventory/semi-v2.102.0.json'), 'utf8'),
);
const pages = JSON.parse(await readFile(resolve(app, 'src/data/pages.json'), 'utf8'));
const demos = JSON.parse(await readFile(resolve(app, 'src/data/demos.json'), 'utf8'));
const exclusions = {
  'advanced/design-source': '上游设计资源下载平台不属于本站能力。',
  'advanced/design-to-code': '上游设计转代码平台不属于本站能力。',
  'ecosystem/react19': 'React 19 Adapter 专属迁移不适用于 Vue。',
  'ecosystem/update-to-v2': '上游 React v1 → v2 迁移不适用于本站版本。',
  'ecosystem/changelog': '上游 React 发布记录不代表本项目发布记录；本站接入指南记录当前版本。',
  'ecosystem/web-components': '上游 Web Components 包不是本项目公开包。',
  'start/mcp-skills': '上游 MCP/Skills 服务不作为本站能力呈现。',
  'show/chart': '上游图表包装依赖外部产品，固定根模块没有独立 Chart 导出。',
};
const buttonIds = [
  'Types',
  'TypeColors',
  'Themelight',
  'Themesolid',
  'Themeborderless',
  'Themeoutline',
  'Sizes',
  'Block',
  'Icons',
  'Links',
  'Disabled',
  'Loading',
  'Colorful',
  'GroupSizes',
  'GroupDisabled',
  'GroupTypes',
  'Split',
];
const mappingDirectory = resolve(root, 'docs/documentation/mappings');
await mkdir(mappingDirectory, { recursive: true });
const mappings = new Map();
for (const file of await readdir(mappingDirectory)) {
  if (!file.endsWith('.json')) continue;
  const mapping = JSON.parse(await readFile(resolve(mappingDirectory, file), 'utf8'));
  if (mappings.has(mapping.upstream)) throw new Error(`Duplicate mapping: ${mapping.upstream}`);
  mappings.set(mapping.upstream, mapping);
}
if (!mappings.has('basic/button'))
  mappings.set('basic/button', {
    demos: buttonIds.map((id, index) => ({
      index: index + 1,
      zhCN: `button/zh-cn/${id}`,
      enUS: `button/en-us/${id}`,
    })),
  });
const registeredIds = new Set(demos.map((demo) => demo.id));
const documents = [];
for (const doc of inventory.documentation) {
  const source = `${doc.category}/${doc.slug}`;
  const mapping = mappings.get(source);
  const indices = new Set();
  for (const demo of mapping?.demos ?? []) {
    if (indices.has(demo.index) || demo.index < 1 || demo.index > doc.zhCN.liveDemoCount)
      throw new Error(`Invalid source demo index: ${source}/${demo.index}`);
    indices.add(demo.index);
    for (const id of [demo.zhCN, demo.enUS])
      if (!registeredIds.has(id)) throw new Error(`Unregistered mapped demo: ${id}`);
  }
  const text = await readFile(resolve(root, doc.zhCN.path), 'utf8');
  const assigned = pages.filter((page) => page.upstream === source);
  const registered = demos.filter(
    (demo) => demo.upstream === source && demo.pages.some((path) => path.startsWith('/zh-cn/')),
  );
  const live = upstreamLiveDemos(text).map((match, index) => {
    const preceding = text.slice(0, match.index);
    const chapter = [...preceding.matchAll(/^#{2,5} (.+)$/gm)].at(-1)?.[1] ?? '';
    const entry = mapping?.demos.find((demo) => demo.index === index + 1);
    const mapped = entry?.zhCN ?? null;
    return {
      index: index + 1,
      line: preceding.split('\n').length,
      chapter,
      vue: mapped,
      englishVue: entry?.enUS ?? null,
      ...(entry?.notes ? { notes: entry.notes } : {}),
      status: mapped ? 'implemented-awaiting-parity' : 'unmapped',
    };
  });
  documents.push({
    source,
    sourceFiles: { 'zh-CN': doc.zhCN.path, 'en-US': doc.enUS.path },
    pages: assigned.map((page) => page.path),
    upstreamDemoCount: doc.zhCN.liveDemoCount,
    registeredChineseDemoCount: registered.length,
    status: exclusions[source] ? 'excluded' : assigned.length === 2 ? 'in-progress' : 'pending',
    ...(exclusions[source] ? { reason: exclusions[source] } : {}),
    chapters: [...text.matchAll(/^#{2,5} (.+)$/gm)].map((match) => ({
      title: match[1],
      status: 'needs-review',
    })),
    demos: live,
  });
}
const result = {
  baseline: inventory.source,
  inventorySummary: inventory.summary,
  status: 'in-progress',
  totals: {
    pages: pages.length,
    registeredDemos: demos.length,
    upstreamChineseDemos: documents.reduce((sum, doc) => sum + doc.upstreamDemoCount, 0),
    mappedChineseDemos: documents.flatMap((doc) => doc.demos).filter((demo) => demo.vue).length,
    acceptedChineseDemos: 0,
  },
  documents,
};
await writeFile(
  resolve(root, 'docs/documentation/coverage.json'),
  await format(JSON.stringify(result), { ...prettierConfig, parser: 'json' }),
);
console.log(
  `覆盖账本：${result.totals.pages} 页，${result.totals.mappedChineseDemos}/${result.totals.upstreamChineseDemos} 个上游 Demo 已建立逐项映射，尚无新增视觉验收结论。`,
);
if (process.argv.includes('--require-complete')) {
  console.error('全量迁移验收未完成：不能切换默认入口或声称像素级对齐。');
  process.exitCode = 1;
}
