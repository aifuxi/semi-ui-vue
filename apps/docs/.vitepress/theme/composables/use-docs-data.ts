import navData from '../generated/nav.json';
import sourcesData from '../generated/sources.json';

export interface DocsNavPage {
  title: string;
  englishTitle: string;
  path: string;
  icon?: string | null;
  order: number;
  source?: string;
  origin?: string;
}

export interface DocsNavCategory {
  id: string;
  label: string;
  pages: DocsNavPage[];
}

export interface DocsNav {
  baseline: { version: string; commit: string };
  categories: DocsNavCategory[];
}

interface DocsSourceEntry {
  origin: string;
  source: string;
  sha256: string | null;
}

interface DocsSources {
  baseline: { version: string; commit: string };
  pages: Record<string, DocsSourceEntry>;
}

export const docsNav = navData as DocsNav;
export const docsSources = sourcesData as DocsSources;

export const docsPages: DocsNavPage[] = docsNav.categories.flatMap((category) => category.pages);

/** 规范化路由：去掉尾部斜杠，/index 归一为根路径。 */
export function normalizeRoute(path: string): string {
  const withoutHash = path.split('#')[0] ?? path;
  const trimmed = withoutHash.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

export function findNavPage(path: string): DocsNavPage | undefined {
  const route = normalizeRoute(path);
  return docsPages.find((page) => page.path === route);
}

export function categoryOf(path: string): DocsNavCategory | undefined {
  const route = normalizeRoute(path);
  return docsNav.categories.find((category) => category.pages.some((page) => page.path === route));
}

export function neighbors(path: string): {
  prev: DocsNavPage | undefined;
  next: DocsNavPage | undefined;
} {
  const route = normalizeRoute(path);
  const index = docsPages.findIndex((page) => page.path === route);
  if (index === -1) return { prev: undefined, next: undefined };
  return {
    prev: index > 0 ? docsPages[index - 1] : undefined,
    next: index < docsPages.length - 1 ? docsPages[index + 1] : undefined,
  };
}

export function sourceOf(path: string): DocsSourceEntry | undefined {
  return docsSources.pages[normalizeRoute(path)];
}

export function iconUrl(icon: string | null | undefined): string | undefined {
  return icon ? `/doc-icons/${icon}.svg` : undefined;
}

export function splitPageTitle(title: string): { englishTitle: string; chineseTitle: string } {
  /** 与基线站点一致：按最后一个空格切分英文名与中文名。 */
  const splitIndex = title.lastIndexOf(' ');
  if (splitIndex === -1) return { englishTitle: title, chineseTitle: title };
  return { englishTitle: title.slice(0, splitIndex), chineseTitle: title.slice(splitIndex + 1) };
}
