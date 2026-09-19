/**
 * 上游正文里的包名、来源链接与 React 措辞改写表。
 * 规则显式列出并逐条记录，未命中的内容保持原文，避免把改写退化成不可控的正则。
 */
export const packageRewrites = [
  ['@douyinfe/semi-icons-lab', '@aifuxi/semi-icons-lab-vue'],
  ['@douyinfe/semi-icons', '@aifuxi/semi-icons-vue'],
  ['@douyinfe/semi-ui', '@aifuxi/semi-ui-vue'],
  ['@douyinfe/semi-foundation', '@aifuxi/semi-ui-vue/_base'],
];

export const phraseRewrites = [
  ['React UI 桌面端组件库', 'Vue 3 UI 桌面端组件库'],
  ['React UI 组件库', 'Vue 3 组件库'],
  ['React 版本开箱即用的', 'Vue 3 版本开箱即用的'],
  ['你可在任意 React 项目中引入使用', '你可在任意 Vue 3 项目中引入使用'],
  ['在 React 项目中使用', '在 Vue 3 项目中使用'],
  ['基于 React 的', '基于 Vue 3 的'],
];

/** 上游仓库链接 → 本项目仓库；上游站点链接在 prepare-content 中按收录情况归一。 */
export const linkRewrites = [
  ['https://github.com/DouyinFE/semi-design', 'https://github.com/aifuxi/semi-ui-vue'],
];

export function applyRewrites(text, record) {
  let result = text;
  for (const [from, to] of packageRewrites) {
    if (result.includes(from)) {
      result = result.replaceAll(from, to);
      record({ kind: 'package', from, to });
    }
  }
  for (const [from, to] of phraseRewrites) {
    if (result.includes(from)) {
      result = result.replaceAll(from, to);
      record({ kind: 'phrase', from, to });
    }
  }
  for (const [from, to] of linkRewrites) {
    if (result.includes(from)) {
      result = result.replaceAll(from, to);
      record({ kind: 'link', from, to });
    }
  }
  return result;
}
