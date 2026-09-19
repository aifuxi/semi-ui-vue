import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { parse } from 'yaml';
import {
  contentRoot,
  defaultLocale,
  generatedDataRoot,
  guidePages,
  locales,
  normalizeSlug,
  overrideRoot,
  readBaseline,
  readCategories,
  readComponentDirectories,
  vendorContentRoot,
} from './upstream-config.mjs';
import { applyRewrites } from './upstream-rewrites.mjs';

/**
 * 当前不呈现示例代码：每个代码块渲染为紧凑的 DemoBlock 迁移状态条。
 * `## 代码演示` 章标题保留，正文层次与上游官网一致，只把代码换成状态提示。
 */
const demoBlockKinds = new Map([
  ['import', 'import'],
  ['live', 'live'],
]);

/** 上游 MDX 专属块：首版没有对应实现，整块丢弃并记入来源清单。 */
const droppedFenceLanguages = new Set(['overview', 'material', 'icon', 'changelog']);

/** 依赖上游设计系统站点的章节：首版整节丢弃。 */
const droppedSections = new Set(['设计变量', '相关物料', 'Design Token', 'Related Material']);

const frontmatterPattern = /^---\n([\s\S]*?)\n---\n?/;
const headingPattern = /^(#{2,4})\s+(.*?)\s*#*\s*$/;
const inlineTagPattern = /<\/?[A-Za-z][^>]*>/g;
const markdownLinkPattern = /\[([^\]]+)\]\(([^)]*)\)/g;

function stripInlineTags(line) {
  return line
    .replaceAll(/<br\s*\/?>/gi, ' ')
    .replaceAll(inlineTagPattern, '')
    .replaceAll(/\s{2,}/g, ' ')
    .trimEnd();
}

function isSeparatorCell(cell) {
  return /^:?-{2,}:?$/.test(cell);
}

function cleanTableRow(line, record) {
  // 设计规范表格会把完整 React 组件塞进单元格；移除标签后只剩 props 碎片，无法可靠降级。
  if (/<[A-Z][\w.-]*\s+[^>\n]*[\w-]+=/.test(line)) {
    record('inline-jsx-row', line.trim());
    return null;
  }
  const cleaned = stripInlineTags(line);
  const cells = cleaned
    .replace(/^\s*\|/, '')
    .replace(/\|\s*$/, '')
    .split('|')
    .map((cell) => cell.trim());
  const meaningful = cells.filter((cell) => cell !== '' && !isSeparatorCell(cell));
  if (meaningful.length === 0 && !cells.every(isSeparatorCell)) {
    record('inline-jsx-row', line.trim());
    return null;
  }
  return cleaned;
}

/** 与基线站点一致：按最后一个空格切分英文名与中文名（vendor/src/templates/postTemplate.js）。 */
function splitTitle(title) {
  const splitIndex = title.lastIndexOf(' ');
  if (splitIndex === -1) return { englishTitle: title, chineseTitle: title };
  return { englishTitle: title.slice(0, splitIndex), chineseTitle: title.slice(splitIndex + 1) };
}

/**
 * 站内链接按 slug 归一到本站路由：上游正文里存在 `/zh-CN/input/button`、`/zh-CN/tooltip`
 * 这类历史路径，直接照搬会 404。无法归一的链接保留为上游官网绝对地址，不做静默删除。
 */
function rewriteLinks(text, context, record) {
  return text.replaceAll(markdownLinkPattern, (match, label, url) => {
    // 上游有 `[联系我们]()` 这类由 JSX 表达式提供地址的链接，首版降级为纯文本。
    if (url === '') {
      record('link-downgrade', label);
      return label;
    }
    if (url.startsWith('#')) return match;
    const absolute = /^https?:\/\/semi\.design(\/.*)?$/i.exec(url);
    const local = url.startsWith('/') ? url : absolute?.[1];
    if (!local) return match;
    const [rawPath = '', hash] = local.split('#');
    const path = rawPath.replace(/\/+$/, '');
    const slug = path.split('/').filter(Boolean).pop();
    const localRoute = slug ? context.routesBySlug.get(slug) : undefined;
    if (localRoute) {
      record('link-local', url);
      return `[${label}](${localRoute}${hash ? `#${hash}` : ''})`;
    }
    if (!url.startsWith('/')) return match;
    record('link-upstream', url);
    return `[${label}](https://semi.design${path}${hash ? `#${hash}` : ''})`;
  });
}

/**
 * 把上游 MDX 正文转成 VitePress Markdown：
 * 代码块 → DemoBlock 占位；多行 MDX 组件块与专属章节 → 丢弃；行内 JSX → 仅保留文本。
 */
function transformBody(body, page, context) {
  const record = (kind, detail) =>
    context.drops.push({ route: page.route, kind, detail: String(detail).slice(0, 200) });
  const withoutComments = body.replaceAll(/<!--[\s\S]*?-->/g, '');
  const lines = withoutComments.split('\n');
  const out = [];
  let lastHeading = '';
  let skipUntilLevel = null;
  let jsxOpen = false;
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? '';
    const fence = line.match(/^```(\S*)\s*(.*)$/);
    if (fence) {
      const language = (fence[1] ?? '').trim();
      const info = (fence[2] ?? '').trim();
      index += 1;
      while (index < lines.length && !/^```/.test(lines[index] ?? '')) index += 1;
      index += 1;
      if (droppedFenceLanguages.has(language)) {
        record('mdx-block', `\`\`\`${language}`);
        continue;
      }
      const kind =
        demoBlockKinds.get(info.split(/\s+/)[0] ?? '') ?? (info.includes('live') ? 'live' : 'code');
      out.push('', `<DemoBlock title="${lastHeading || page.title}" kind="${kind}" />`, '');
      record('demo-placeholder', `${kind}:${lastHeading}`);
      continue;
    }

    const heading = line.match(headingPattern);
    if (heading) {
      const level = heading[1].length;
      const text = stripInlineTags(heading[2]).trim();
      if (skipUntilLevel !== null && level > skipUntilLevel) {
        index += 1;
        continue;
      }
      skipUntilLevel = null;
      if (level === 2 && droppedSections.has(text)) {
        skipUntilLevel = level;
        record('mdx-section', text);
        index += 1;
        continue;
      }
      lastHeading = text;
      out.push(`##${'#'.repeat(level - 2)} ${text}`, '');
      index += 1;
      continue;
    }

    if (/^\s*\|.*\|\s*$/.test(line)) {
      const row = cleanTableRow(line, record);
      if (row !== null) out.push(row);
      index += 1;
      continue;
    }

    const trimmed = line.trim();
    if (jsxOpen) {
      if (/(?:\/>|>)\s*$/.test(trimmed)) jsxOpen = false;
      record('mdx-block', trimmed);
      index += 1;
      continue;
    }
    if (/^<[A-Za-z][\w.-]*(?:\s|$|\/)/.test(trimmed)) {
      if (!/(?:\/>|<\/[\w.-]+>)\s*$/.test(trimmed)) jsxOpen = true;
      record('mdx-block', trimmed);
      index += 1;
      continue;
    }

    out.push(stripInlineTags(line));
    index += 1;
  }

  let text = out
    .join('\n')
    .replaceAll(/\n{3,}/g, '\n\n')
    .trim();
  text = applyRewrites(text, (entry) =>
    record(`rewrite-${entry.kind}`, `${entry.from} → ${entry.to}`),
  );
  text = rewriteLinks(text, context, record);
  // Vue 模板会把 `{{ ... }}` 当成插值表达式；上游正文里有 `timePickerOpts={{ ... }}` 这类文字。
  // 把第二个花括号换成等价 HTML 实体，渲染结果不变，但不会进入模板编译。
  if (text.includes('{{')) {
    text = text.replaceAll('{{', '{&lbrace;');
    record('escape-mustache', '{{ → {&lbrace;');
  }

  // 上游示例位置只留迁移状态，这里同时交代 Vue 引入方式、固定基线和契约状态。
  if (page.componentDirectory) {
    const notice = `> **Vue 使用说明**：从 \`@aifuxi/semi-ui-vue/${page.componentDirectory}\` 子路径引入组件，全局样式由 \`@aifuxi/semi-theme-default\` 提供。正文基于固定 Semi Design v2.102.0 生成；示例代码与 Vue API 契约仍在逐项校准。\n`;
    const anchorIndex = text.indexOf('## 代码演示');
    text =
      anchorIndex === -1
        ? `${notice}\n${text}`
        : `${text.slice(0, anchorIndex)}${notice}\n${text.slice(anchorIndex)}`;
    record('polish-notice', `@aifuxi/semi-ui-vue/${page.componentDirectory}`);
  }

  return `${text}\n`;
}

function renderFrontmatter(page) {
  const entries = [
    ['title', page.title],
    ['description', page.description],
    ['type', page.type],
    ['order', page.order],
    ['icon', page.icon],
    ['upstream', page.upstream],
  ].filter(([, value]) => value !== undefined && value !== null && value !== '');
  const lines = entries.map(([key, value]) =>
    typeof value === 'number' ? `${key}: ${value}` : `${key}: ${JSON.stringify(String(value))}`,
  );
  return `---\n${lines.join('\n')}\n---\n`;
}

function searchTextOf(source) {
  return source
    .replace(frontmatterPattern, '')
    .replaceAll(markdownLinkPattern, '$1')
    .replaceAll(/[#*`|>{}]/g, ' ')
    .replaceAll(/\s+/g, ' ')
    .trim();
}

async function collectOverrideFiles() {
  const files = new Map();
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const fullPath = resolve(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }
      if (entry.name.endsWith('.md')) files.set(fullPath.slice(overrideRoot.length + 1), fullPath);
    }
  }
  await walk(overrideRoot);
  return files;
}

// 只清理页面正文；`content/public` 由 prepare-assets 负责，避免把编译好的站点资源删掉。
for (const locale of locales) {
  await rm(resolve(contentRoot, locale), { recursive: true, force: true });
}
await rm(resolve(contentRoot, 'index.md'), { force: true });
await mkdir(contentRoot, { recursive: true });
await mkdir(generatedDataRoot, { recursive: true });
await cp(overrideRoot, contentRoot, { recursive: true });

const categories = await readCategories();
const componentDirectories = await readComponentDirectories();
const overrideFiles = await collectOverrideFiles();
const baseline = readBaseline();

/** 第一遍：确定收录范围与路由，供链接归一使用。 */
const entries = [];
const routesBySlug = new Map();

for (const [relativePath, absolutePath] of overrideFiles) {
  const source = await readFile(absolutePath, 'utf8');
  const values = parse(source.match(frontmatterPattern)?.[1] ?? '');
  const route = `/${relativePath.replace(/\.md$/, '').replace(/\/index$/, '')}`;
  const pageRoute = route === '/index' ? '/' : route;
  entries.push({
    origin: 'override',
    route: pageRoute,
    title: values.title ?? pageRoute,
    description: values.description ?? '',
    type: values.type ?? 'start',
    order: typeof values.order === 'number' ? values.order : 0,
    icon: values.icon,
    source: `apps/docs/overrides/${relativePath}`,
    searchText: searchTextOf(source),
  });
}

const overrideRoutes = new Set(entries.map((entry) => entry.route));

for (const category of categories) {
  const directory = resolve(vendorContentRoot, category.id);
  const directoryEntries = await readdir(directory, { withFileTypes: true }).catch(() => []);
  for (const entry of directoryEntries) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    const componentDirectory = componentDirectories.get(normalizeSlug(slug));
    if (!componentDirectory && !guidePages.has(normalizeSlug(slug))) continue;
    const sourcePath = resolve(directory, slug, 'index.md');
    const source = await readFile(sourcePath, 'utf8');
    const values = parse(source.match(frontmatterPattern)?.[1] ?? '');
    const route = `/${defaultLocale}/${category.id}/${slug}`;
    if (overrideRoutes.has(route)) continue;
    entries.push({
      origin: 'generated',
      route,
      title: values.title ?? slug,
      description: values.brief ?? '',
      type: category.id,
      order: typeof values.order === 'number' ? values.order : 0,
      icon: values.icon,
      upstream: `${category.id}/${slug}`,
      componentDirectory,
      source: `vendor/semi-design/content/${category.id}/${slug}/index.md`,
      sha256: createHash('sha256').update(source).digest('hex'),
      rawBody: source.replace(frontmatterPattern, ''),
    });
  }
}

for (const entry of entries) {
  const slug = entry.route.split('/').filter(Boolean).pop();
  if (slug && !routesBySlug.has(slug)) routesBySlug.set(slug, entry.route);
}

/** 第二遍：生成正文，手工覆盖页直接使用 overrides 的原文。 */
const context = { routesBySlug, drops: [], rewrites: [] };

for (const entry of entries) {
  if (entry.origin !== 'generated') continue;
  const body = transformBody(entry.rawBody ?? '', entry, context);
  const target = resolve(contentRoot, `${entry.route.replace(/^\//, '')}.md`);
  await mkdir(resolve(target, '..'), { recursive: true });
  await writeFile(target, `${renderFrontmatter(entry)}\n${body}`);
  entry.searchText = searchTextOf(body);
}

entries.sort((left, right) => left.route.localeCompare(right.route));

const nav = {
  baseline,
  categories: categories
    .map((category) => ({
      id: category.id,
      label: category.label,
      pages: entries
        .filter((entry) => entry.type === category.id && entry.route !== '/')
        .sort(
          (left, right) =>
            left.order - right.order || left.title.localeCompare(right.title, 'zh-Hans-CN'),
        )
        .map((entry) => ({
          title: entry.title,
          englishTitle: splitTitle(entry.title).englishTitle,
          path: entry.route,
          icon: entry.icon ?? null,
          order: entry.order,
        })),
    }))
    .filter((category) => category.pages.length > 0),
};

const sources = {
  baseline,
  pages: Object.fromEntries(
    entries
      .filter((entry) => entry.route !== '/')
      .map((entry) => [
        entry.route,
        {
          origin: entry.origin,
          source: entry.source,
          sha256: entry.sha256 ?? null,
        },
      ]),
  ),
  drops: context.drops,
  rewrites: context.rewrites,
};

const searchIndex = entries
  .filter((entry) => entry.route !== '/')
  .map((entry) => {
    const { englishTitle, chineseTitle } = splitTitle(entry.title);
    return {
      title: `${englishTitle} ${chineseTitle}`,
      path: entry.route,
      category: categories.find((category) => category.id === entry.type)?.label ?? '',
      text: `${entry.description} ${entry.searchText ?? ''}`
        .replaceAll(/\s+/g, ' ')
        .trim()
        .slice(0, 4000),
    };
  });

await writeFile(resolve(generatedDataRoot, 'nav.json'), `${JSON.stringify(nav, null, 2)}\n`);
await writeFile(
  resolve(generatedDataRoot, 'sources.json'),
  `${JSON.stringify(sources, null, 2)}\n`,
);
await mkdir(resolve(contentRoot, 'public'), { recursive: true });
await writeFile(
  resolve(contentRoot, 'public/search-index.json'),
  `${JSON.stringify(searchIndex)}\n`,
);

const generatedCount = entries.filter((entry) => entry.origin === 'generated').length;
console.log(
  `文档内容已生成：${entries.length} 页（${generatedCount} 页来自基线，${overrideFiles.size} 页手工覆盖），${context.drops.length} 条内容裁剪记录。`,
);
