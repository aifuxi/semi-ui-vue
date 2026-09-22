import { execFileSync } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const appRoot = resolve(fileURLToPath(import.meta.url), '../..');
export const workspaceRoot = resolve(appRoot, '../..');
export const vendorRoot = resolve(workspaceRoot, 'vendor/semi-design');
export const vendorContentRoot = resolve(vendorRoot, 'content');
export const contentRoot = resolve(appRoot, 'content');
export const overrideRoot = resolve(appRoot, 'overrides');
export const generatedDataRoot = resolve(appRoot, '.vitepress/theme/generated');
export const locales = ['zh-CN'];
export const defaultLocale = 'zh-CN';

/**
 * 侧栏分组沿用固定基线的 `src/utils/category.js`：分组标签与顺序只有一处来源。
 * 该文件属于上游 CJS 工程，不能用 ESM import，这里做最小解析并在失败时硬报错。
 */
export async function readCategories() {
  const source = await readFile(resolve(vendorRoot, 'src/utils/category.js'), 'utf8');
  const categories = [...source.matchAll(/\{\s*itemKey:\s*'([^']+)',\s*text:\s*'([^']+)'/g)].map(
    ([, id, label]) => ({ id, label }),
  );
  if (categories.length === 0) {
    throw new Error('无法从 vendor/semi-design/src/utils/category.js 解析侧栏分组。');
  }
  return categories;
}

/**
 * 收录规则：组件页必须有对应的 packages/ui/src 目录；指南页来自显式白名单。
 * 未收录页面（React 专属指南、无 Vue 实现的组件等）不生成，正文内指向它们的链接降级为纯文本。
 */
const guideSlugs = [
  'introduction',
  'getting-started',
  'customize-theme',
  'dark-mode',
  'accessibility',
  'internationalization',
  'content-guidelines',
];

export const guidePages = new Set(guideSlugs.map((slug) => slug.replaceAll('-', '')));

/** 手工精修页以 overrides/ 为准，生成阶段跳过同名路由。 */
export function pageSlug(type, slug) {
  return `${type}/${slug}`;
}

export function normalizeSlug(value) {
  return value.toLowerCase().replaceAll(/[-_]/g, '');
}

export async function readComponentDirectories() {
  const entries = await readdir(resolve(workspaceRoot, 'packages/ui/src'), { withFileTypes: true });
  return new Map(
    entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => [normalizeSlug(entry.name), entry.name]),
  );
}

/** 基线版本只在构建期读取，用于页面页脚的来源说明。 */
export function readBaseline() {
  const git = (args) =>
    execFileSync('git', ['-C', vendorRoot, ...args], { encoding: 'utf8' }).trim();
  try {
    return {
      version: git(['describe', '--tags', '--exact-match']),
      commit: git(['rev-parse', 'HEAD']),
    };
  } catch {
    return { version: 'unknown', commit: 'unknown' };
  }
}
