import starlight from '@astrojs/starlight';
import vue from '@astrojs/vue';
import { defineConfig } from 'astro/config';

const componentSlugs = ['button', 'select', 'modal', 'table', 'icon', 'json-viewer'];
const localizedPaths = [
  '',
  'components',
  ...componentSlugs.map((slug) => `components/${slug}`),
  'project/license',
];
const localeAliases = Object.fromEntries(
  ['zh-CN', 'en-US'].flatMap((locale) =>
    localizedPaths.map((path) => {
      const suffix = path ? `/${path}/` : '/';
      return [`/${locale}${suffix}`, `/${locale.toLowerCase()}${suffix}`];
    }),
  ),
);

export default defineConfig({
  site: 'https://semi.fuxiaochen.com',
  output: 'static',
  redirects: localeAliases,
  integrations: [
    vue(),
    starlight({
      title: 'Semi UI Vue',
      description: 'Semi Design v2.102.0 的独立 Vue 3 实现',
      defaultLocale: 'zh-cn',
      locales: {
        'zh-cn': { label: '简体中文', lang: 'zh-CN' },
        'en-us': { label: 'English', lang: 'en-US' },
      },
      editLink: {
        baseUrl: 'https://github.com/aifuxi/semi-ui-vue/edit/master/apps/docs/',
      },
      sidebar: [
        {
          label: '组件',
          translations: { 'en-us': 'Components' },
          items: componentSlugs.map((slug) => ({
            label:
              slug === 'json-viewer' ? 'JsonViewer' : `${slug[0]?.toUpperCase()}${slug.slice(1)}`,
            link: `/components/${slug}/`,
          })),
        },
        {
          label: '项目',
          translations: { 'en-us': 'Project' },
          items: [{ label: 'License & notices', link: '/project/license/' }],
        },
      ],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/aifuxi/semi-ui-vue',
        },
      ],
      credits: false,
    }),
  ],
});
