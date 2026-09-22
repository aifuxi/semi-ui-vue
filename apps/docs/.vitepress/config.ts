import { defineConfig } from 'vitepress';
import { applyProseClasses, type MarkdownItLike } from './theme/markdown/prose-classes';

/** 亮暗色由站点自己管理，首帧先按 localStorage 恢复，避免闪烁。 */
const themeBootScript = `(function(){try{if(localStorage.getItem('semi-docs-theme')==='dark'){document.documentElement.setAttribute('theme-mode','dark');document.documentElement.setAttribute('data-theme','dark');}}catch(error){}})();`;
const hydrationDiagnostics = process.env.DOCS_HYDRATION_DIAGNOSTICS === '1';

export default defineConfig({
  title: 'Semi UI Vue',
  description: 'Semi UI Vue 组件库文档，使用说明对齐 Semi Design v2.102.0 官方文档。',
  lang: 'zh-CN',
  cleanUrls: true,
  appearance: false,
  srcDir: 'content',
  cacheDir: 'cache',
  outDir: 'dist',
  vite: {
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(hydrationDiagnostics),
    },
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'stylesheet', href: '/upstream/site.css' }],
    ['script', {}, themeBootScript],
  ],
  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' },
    // 上游正文里存在 `{ width?: number | string }` 这类类型描述，
    // markdown-it-attrs 会把它们当成行内属性，这里关闭该语法。
    attrs: { disable: true },
    // 右栏页内目录与上游官网一致，只取二级、三级标题。
    headers: { level: [2, 3] },
    config: (md) => applyProseClasses(md as unknown as MarkdownItLike),
  },
});
