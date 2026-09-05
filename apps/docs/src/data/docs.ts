import pagesData from './pages.json';

export type DocLocale = 'zh-CN' | 'en-US';
export interface DocPage {
  path: string;
  locale: DocLocale;
  slug: string;
  title: string;
  englishTitle: string;
  description: string;
  category: string;
  order: number;
  icon?: string;
  upstream?: string;
  navigation?: boolean;
}
export interface DocHeading {
  id: string;
  text: string;
  depth: number;
  children?: DocHeading[];
}
export const docPages = pagesData as DocPage[];
export const categories = [
  ['start', '开始', 'Start'],
  ['advanced', '主题', 'Theming'],
  ['experience', '体验增强', 'Experience'],
  ['ecosystem', '生态与帮助', 'Help'],
  ['ai', 'AI 组件', 'AI Components'],
  ['basic', '基础', 'Basic'],
  ['plus', 'Plus 组件', 'Plus'],
  ['input', '输入类', 'Input'],
  ['navigation', '导航类', 'Navigation'],
  ['show', '展示类', 'Display'],
  ['feedback', '反馈类', 'Feedback'],
  ['other', '其他', 'Other'],
  ['project', '项目', 'Project'],
] as const;
export function categoryLabel(category: string, locale: DocLocale) {
  const entry = categories.find(([id]) => id === category);
  return entry?.[locale === 'zh-CN' ? 1 : 2] ?? category;
}
export function localeFromPath(path: string): DocLocale {
  return /^\/en-us(?:\/|$)/i.test(path) ? 'en-US' : 'zh-CN';
}
export function canonicalPath(path: string) {
  return `${path.replace(/^\/(zh-cn|en-us)/i, (prefix) => prefix.toLowerCase()).replace(/\/+$/, '')}/`;
}
