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
  workspaceRoot,
} from './upstream-config.mjs';
import { applyRewrites } from './upstream-rewrites.mjs';
import { vueApiContracts, vueTypeRewrites } from './vue-api-contracts.mjs';

/** 代码块统一交给 DemoBlock；已有 manifest 的示例会运行，其余继续显示迁移状态。 */
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

function markdownCell(value) {
  return String(value)
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('|', '\\|')
    .replaceAll('\n', ' ');
}

function renderContractTable(columns, rows) {
  return [
    `| ${columns.join(' | ')} |`,
    `| ${columns.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.map(markdownCell).join(' | ')} |`),
  ].join('\n');
}

function pushMethodGroups(out, heading, groups) {
  if (!groups?.length) return;
  out.push('', `#### ${heading}`);
  for (const group of groups) {
    out.push(
      '',
      `**${group.name}**`,
      '',
      renderContractTable(
        ['方法', '签名', '说明'],
        group.items.map((item) => [`\`${item.name}\``, item.signature, item.description]),
      ),
    );
  }
}

function renderVueContract(contract) {
  const out = [
    '### Vue 契约',
    '',
    `> 以下内容以 \`${contract.sources.join('`、`')}\` 的公开类型为准；属性说明、默认值和版本信息沿用固定上游基线。`,
  ];
  if (contract.models?.length) {
    out.push('', ...contract.models.map((model) => `- ${model}`));
  }
  if (contract.usageNotes?.length) {
    out.push('', '#### Vue 用法', '', ...contract.usageNotes.map((note) => `- ${note}`));
  }
  pushMethodGroups(out, 'Vue 静态方法', contract.methodGroups);
  pushMethodGroups(out, 'Vue 实例方法', contract.instanceMethodGroups);
  pushMethodGroups(out, 'Vue Composable', contract.composableGroups);
  if (contract.eventGroups?.length) {
    out.push('', '#### Vue 事件');
    for (const group of contract.eventGroups) {
      out.push(
        '',
        `**${group.name}**`,
        '',
        renderContractTable(
          ['事件', '参数', '说明'],
          group.items.map((item) => [item.name, item.parameters, item.description]),
        ),
      );
    }
  }
  if (contract.slotGroups?.length) {
    out.push('', '#### Vue 插槽');
    for (const group of contract.slotGroups) {
      out.push(
        '',
        `**${group.name}**`,
        '',
        renderContractTable(
          ['插槽', '作用域参数', '说明'],
          group.items.map((item) => [item.name, item.scope, item.description]),
        ),
      );
    }
  }
  return out.join('\n');
}

function firstTableCell(line) {
  return line
    .replace(/^\s*\|/, '')
    .split('|', 1)[0]
    ?.trim();
}

function extractInterfaceBody(source, interfaceName) {
  const start = source.indexOf(`export interface ${interfaceName}`);
  if (start === -1) throw new Error(`无法找到公开接口 ${interfaceName}。`);
  const open = source.indexOf('{', start);
  if (open === -1) throw new Error(`公开接口 ${interfaceName} 缺少起始花括号。`);
  let depth = 0;
  let quote = '';
  let escaped = false;
  for (let index = open; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = '';
      continue;
    }
    if (char === "'" || char === '"' || char === '`') {
      quote = char;
      continue;
    }
    if (char === '{') depth += 1;
    if (char !== '}') continue;
    depth -= 1;
    if (depth === 0) return source.slice(open + 1, index);
  }
  throw new Error(`公开接口 ${interfaceName} 缺少结束花括号。`);
}

function splitInterfaceMembers(body) {
  const members = [];
  let start = 0;
  let round = 0;
  let square = 0;
  let curly = 0;
  let quote = '';
  let escaped = false;
  for (let index = 0; index < body.length; index += 1) {
    const char = body[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = '';
      continue;
    }
    if (char === "'" || char === '"' || char === '`') {
      quote = char;
      continue;
    }
    if (char === '(') round += 1;
    else if (char === ')') round -= 1;
    else if (char === '[') square += 1;
    else if (char === ']') square -= 1;
    else if (char === '{') curly += 1;
    else if (char === '}') curly -= 1;
    else if (char === ';' && round === 0 && square === 0 && curly === 0) {
      members.push(body.slice(start, index));
      start = index + 1;
    }
  }
  return members;
}

function extractInterfaceProps(source, interfaceName) {
  return splitInterfaceMembers(extractInterfaceBody(source, interfaceName))
    .map((member) =>
      member
        .replaceAll(/\/\*[\s\S]*?\*\//g, '')
        .replaceAll(/\/\/.*$/gm, '')
        .trim(),
    )
    .filter((member) => member !== '' && !member.startsWith('['))
    .map((member) => {
      const match = member.match(/^(?:readonly\s+)?['"]?([\w.-]+)['"]?(\?)?:\s*([\s\S]+)$/);
      if (!match) return null;
      return {
        name: match[1],
        required: match[2] !== '?',
        type: match[3].replaceAll(/\s+/g, ' ').trim(),
      };
    })
    .filter(Boolean);
}

function parseTableCells(line) {
  const cells = [];
  let current = '';
  let escaped = false;
  for (const char of line.replace(/^\s*\|/, '').replace(/\|\s*$/, '')) {
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }
    if (char === '\\') {
      escaped = true;
      continue;
    }
    if (char === '|') {
      cells.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  cells.push(current.trim());
  return cells;
}

function isTableSeparator(line) {
  const cells = parseTableCells(line);
  return cells.length > 0 && cells.every((cell) => /^:?-+:?$/.test(cell));
}

function renderVuePropsTable(section, props, headerLine, originalRows) {
  const headers = parseTableCells(headerLine);
  const rows = props.map(({ name, required, type }) => {
    const upstreamName = section.aliases?.[name] ?? name;
    const original = originalRows.get(upstreamName) ?? [];
    const row = Array.from({ length: headers.length }, () => '');
    row[0] = name;
    row[1] = section.descriptions?.[name] ?? (original[1] || '—');
    row[2] = required ? `${type}（必填）` : type;
    if (headers.length > 3) row[3] = section.defaults?.[name] ?? (original[3] || '—');
    for (let index = 4; index < headers.length; index += 1) row[index] = original[index] ?? '';
    return `| ${row.map(markdownCell).join(' | ')} |`;
  });
  return [`| ${headers.join(' | ')} |`, `| ${headers.map(() => '---').join(' | ')} |`, ...rows];
}

async function loadVuePropSections() {
  const sources = new Map();
  const result = new Map();
  for (const [route, contract] of vueApiContracts) {
    if (!contract.propSections?.length) continue;
    const sections = [];
    for (const section of contract.propSections) {
      const fragments = section.sources ?? [
        { source: section.source, interfaces: section.interfaces },
      ];
      const props = [];
      for (const fragment of fragments) {
        let source = sources.get(fragment.source);
        if (!source) {
          source = await readFile(resolve(workspaceRoot, fragment.source), 'utf8');
          sources.set(fragment.source, source);
        }
        const omitted = new Set(fragment.omit ?? []);
        props.push(
          ...fragment.interfaces
            .flatMap((name) => extractInterfaceProps(source, name))
            .filter((prop) => !omitted.has(prop.name)),
        );
      }
      const uniqueProps = [...new Map(props.map((prop) => [prop.name, prop])).values()];
      sections.push({ ...section, props: uniqueProps });
    }
    result.set(route, sections);
  }
  return result;
}

function replacePropsTables(text, page, recordRewrite) {
  const sections = vuePropSections.get(page.route);
  if (!sections) return text;
  const lines = text.split('\n');
  for (const section of sections) {
    const heading = `${'#'.repeat(section.level)} ${section.heading}`;
    const headingIndex = lines.findIndex((line) => line === heading);
    if (headingIndex === -1) throw new Error(`${page.route} 缺少属性章节：${heading}`);
    let sectionEnd = lines.length;
    for (let index = headingIndex + 1; index < lines.length; index += 1) {
      const nextHeading = lines[index]?.match(headingPattern);
      if (nextHeading && nextHeading[1].length <= section.level) {
        sectionEnd = index;
        break;
      }
    }
    let tableStart = -1;
    let remainingTables = section.tableIndex ?? 0;
    for (let index = headingIndex + 1; index < sectionEnd - 1; index += 1) {
      if (/^\s*\|/.test(lines[index] ?? '') && isTableSeparator(lines[index + 1] ?? '')) {
        if (remainingTables > 0) {
          remainingTables -= 1;
          continue;
        }
        tableStart = index;
        break;
      }
    }
    if (tableStart === -1) throw new Error(`${page.route} 的 ${heading} 缺少属性表。`);
    let tableEnd = tableStart + 2;
    while (tableEnd < sectionEnd && /^\s*\|/.test(lines[tableEnd] ?? '')) {
      tableEnd += 1;
    }
    const originalRows = new Map();
    for (const line of lines.slice(tableStart + 2, tableEnd)) {
      const cells = parseTableCells(line);
      if (cells[0]) originalRows.set(cells[0], cells);
    }
    const eventRows =
      contractForRoute(page.route)?.eventSections?.find(
        (eventSection) =>
          eventSection.level === section.level && eventSection.heading === section.heading,
      )?.rows ?? [];
    const props = section.props.filter((prop) => !eventRows.includes(prop.name));
    lines.splice(
      tableStart,
      tableEnd - tableStart,
      ...renderVuePropsTable(section, props, lines[tableStart] ?? '', originalRows),
    );
    recordRewrite('vue-props', `${section.heading}: ${props.length} props`);
  }
  return lines.join('\n');
}

function contractForRoute(route) {
  return vueApiContracts.get(route);
}

function removeReactEventRows(text, contract, recordRewrite) {
  if (!contract.eventSections?.length) return text;
  const lines = text.split('\n');
  let activeSection = null;
  return lines
    .filter((line) => {
      const heading = line.match(headingPattern);
      if (heading) {
        const level = heading[1].length;
        const title = stripInlineTags(heading[2]).trim();
        activeSection =
          contract.eventSections.find(
            (section) => section.level === level && section.heading === title,
          ) ?? null;
        return true;
      }
      if (!activeSection || !/^\s*\|.*\|\s*$/.test(line)) return true;
      const name = firstTableCell(line);
      if (!activeSection.rows.includes(name)) return true;
      recordRewrite('vue-event-row', `${activeSection.heading}.${name}`);
      return false;
    })
    .join('\n');
}

function applyVueApiContract(text, page, recordRewrite) {
  const contract = contractForRoute(page.route);
  if (!contract) return text;
  let result = removeReactEventRows(text, contract, recordRewrite);
  for (const [from, to] of [...vueTypeRewrites, ...(contract.textRewrites ?? [])]) {
    if (!result.includes(from)) continue;
    result = result.replaceAll(from, to);
    recordRewrite('vue-term', `${from} → ${to}`);
  }
  result = replacePropsTables(result, page, recordRewrite);
  const apiHeading = '## API 参考';
  if (!result.includes(apiHeading)) {
    throw new Error(`${page.route} 缺少 API 参考章节，无法注入 Vue 契约。`);
  }
  result = result.replace(apiHeading, `${apiHeading}\n\n${renderVueContract(contract)}`);
  recordRewrite('vue-contract', contract.sources.join(', '));
  return result;
}

function removeDanglingExampleReferences(text, recordRewrite) {
  const replacements = [
    ['如下图所示', ''],
    ['如下图', ''],
    ['下图所示', ''],
    ['如下所示', ''],
    ['点击运行', '示例迁移完成后可在线运行'],
  ];
  let result = text;
  for (const [from, to] of replacements) {
    if (!result.includes(from)) continue;
    result = result.replaceAll(from, to);
    recordRewrite('dangling-example-reference', `${from} → ${to || '移除'}`);
  }
  return result
    .replaceAll(/\s+([，。；：])/g, '$1')
    .replaceAll(/，\s*。/g, '。')
    .replaceAll(/：\s*。/g, '。');
}

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
 * 代码块 → 带稳定 id 的 DemoBlock；多行 MDX 组件块与专属章节 → 丢弃；行内 JSX → 仅保留文本。
 */
function transformBody(body, page, context) {
  const recordDrop = (kind, detail) =>
    context.drops.push({ route: page.route, kind, detail: String(detail).slice(0, 200) });
  const recordRewrite = (kind, detail) =>
    context.rewrites.push({ route: page.route, kind, detail: String(detail).slice(0, 200) });
  const withoutComments = body.replaceAll(/<!--[\s\S]*?-->/g, '');
  const lines = withoutComments.split('\n');
  const out = [];
  let lastHeading = '';
  let skipUntilLevel = null;
  let jsxOpen = false;
  let index = 0;
  let demoIndex = 0;

  while (index < lines.length) {
    const line = lines[index] ?? '';
    const fence = line.match(/^[ \t]{0,3}```\s*(\S*)\s*(.*)$/);
    if (fence) {
      const language = (fence[1] ?? '').trim();
      const info = (fence[2] ?? '').trim();
      index += 1;
      while (index < lines.length && !/^[ \t]{0,3}```/.test(lines[index] ?? '')) index += 1;
      index += 1;
      if (droppedFenceLanguages.has(language)) {
        recordDrop('mdx-block', `\`\`\`${language}`);
        continue;
      }
      const kind =
        demoBlockKinds.get(info.split(/\s+/)[0] ?? '') ?? (info.includes('live') ? 'live' : 'code');
      demoIndex += 1;
      const demoId = `${page.route.replace(/^\//, '').replaceAll('/', '-')}-${demoIndex}`;
      out.push(
        '',
        `<DemoBlock id="${demoId}" title="${lastHeading || page.title}" kind="${kind}" />`,
        '',
      );
      recordDrop('demo-placeholder', `${kind}:${lastHeading}`);
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
        recordDrop('mdx-section', text);
        index += 1;
        continue;
      }
      lastHeading = text;
      out.push(`##${'#'.repeat(level - 2)} ${text}`, '');
      index += 1;
      continue;
    }

    if (/^\s*\|.*\|\s*$/.test(line)) {
      const row = cleanTableRow(line, recordDrop);
      if (row !== null) out.push(row);
      index += 1;
      continue;
    }

    const trimmed = line.trim();
    if (jsxOpen) {
      if (/(?:\/>|>)\s*$/.test(trimmed)) jsxOpen = false;
      recordDrop('mdx-block', trimmed);
      index += 1;
      continue;
    }
    if (/^<[A-Za-z][\w.-]*(?:\s|$|\/)/.test(trimmed)) {
      if (!/(?:\/>|<\/[\w.-]+>)\s*$/.test(trimmed)) jsxOpen = true;
      recordDrop('mdx-block', trimmed);
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
    recordRewrite(`rewrite-${entry.kind}`, `${entry.from} → ${entry.to}`),
  );
  text = rewriteLinks(text, context, recordRewrite);
  text = removeDanglingExampleReferences(text, recordRewrite);
  text = applyVueApiContract(text, page, recordRewrite);
  // Vue 模板会把 `{{ ... }}` 当成插值表达式；上游正文里有 `timePickerOpts={{ ... }}` 这类文字。
  // 把第二个花括号换成等价 HTML 实体，渲染结果不变，但不会进入模板编译。
  if (text.includes('{{')) {
    text = text.replaceAll('{{', '{&lbrace;');
    recordRewrite('escape-mustache', '{{ → {&lbrace;');
  }

  // 上游示例位置只留迁移状态，这里同时交代 Vue 引入方式、固定基线和契约状态。
  if (page.componentDirectory) {
    const contractStatus = vueApiContracts.has(page.route)
      ? '本页 Vue API 契约已按公开类型校准；示例代码仍在逐项迁移。'
      : '示例代码与 Vue API 契约仍在逐项校准。';
    const notice = `> **Vue 使用说明**：从 \`@aifuxi/semi-ui-vue/${page.componentDirectory}\` 子路径引入组件，全局样式由 \`@aifuxi/semi-theme-default\` 提供。正文基于固定 Semi Design v2.102.0 生成；${contractStatus}\n`;
    const anchorIndex = text.indexOf('## 代码演示');
    text =
      anchorIndex === -1
        ? `${notice}\n${text}`
        : `${text.slice(0, anchorIndex)}${notice}\n${text.slice(anchorIndex)}`;
    recordRewrite('polish-notice', `@aifuxi/semi-ui-vue/${page.componentDirectory}`);
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
const vuePropSections = await loadVuePropSections();

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
  `文档内容已生成：${entries.length} 页（${generatedCount} 页来自基线，${overrideFiles.size} 页手工覆盖），${context.drops.length} 条裁剪、${context.rewrites.length} 条改写记录。`,
);
