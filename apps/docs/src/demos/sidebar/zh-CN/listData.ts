import type {
  SidebarCodeItemProps,
  SidebarFileItemProps,
  SidebarAnnotationGroup,
} from '@aifuxi/semi-ui-vue/sidebar';
export const codes: SidebarCodeItemProps[] = [
  {
    name: 'Component.vue',
    key: 'code1',
    language: 'html',
    content:
      "<script setup lang=\"ts\">\nimport { ref } from 'vue';\nimport { AutoComplete } from '@aifuxi/semi-ui-vue/auto-complete';\nconst value = ref('');\nconst data = ref<string[]>([]);\nfunction search(text: string) {\n  data.value = text ? ['gmail.com', '163.com', 'qq.com'].map(domain => text + domain) : [];\n}\n</script>\n<template>\n  <AutoComplete v-model=\"value\" :data=\"data\" show-clear placeholder=\"Search...\" @search=\"search\" />\n</template>",
  },
  {
    name: 'Style.css',
    key: 'code2',
    language: 'css',
    content:
      '.semi-animation-react-demo-auto {\n    button {\n        height: 50px;\n        border: 0;\n        cursor: pointer !important;\n        background: #777;\n        color: white;\n        outline: none;\n        -webkit-appearance: none;\n    }\n\n    button:hover {\n        background: #878787;\n    }\n\n    .auto-main {\n        display: grid;\n        grid-template-columns: repeat(3, 1fr);\n        grid-template-rows: auto 1fr;\n        background: #575757;\n    }\n\n    .content {\n        grid-column: span 3;\n    }\n\n    .item {\n        background: indianred;\n        width: 100%;\n        overflow: hidden;\n        color: white;\n    }\n\n    .item p {\n        margin: 0;\n        padding: 10px;\n    }\n}\n',
  },
  {
    name: 'Chart.json',
    key: 'code3',
    isJson: true,
    language: 'html',
    content:
      '{\n    "axisX": {\n        "title": {\n            "visible": false,\n            "position": "center"\n        },\n        "label": {\n            "visible": true,\n            "style": {\n                "fontSize": 12,\n                "fontWeight": 400,\n                "lineHeight": 16,\n                "fontFamily": [\n                    "Inter"\n                ],\n                "fill": "rgba(0, 0, 0, 0.47843137254901963)"\n            },\n            "space": 12\n        },\n        "domainLine": {\n            "visible": true,\n            "style": {\n                "lineWidth": 1,\n                "stroke": "rgba(0, 0, 0, 0.12156862745098039)",\n                "lineDash": []\n            }\n        },\n        "tick": {\n            "visible": false,\n            "style": {\n                "lineWidth": 1,\n                "stroke": "rgba(255, 255, 255, 0)"\n            }\n        },\n        "subTick": {\n            "visible": false\n        },\n        "grid": {\n            "visible": false\n        },\n        "subGrid": {\n            "visible": false\n        }\n    }\n}',
  },
];
export const files: SidebarFileItemProps[] = [
  {
    key: 'file1',
    name: 'Semi Design 介绍',
    content:
      '\n<h2>\n  Semi Design 介绍\n</h2>\n<p>\n  Semi Design 是由 <strong>抖音前端团队</strong>和MED产品设计团队设计、开发并维护的<em>设计系统</em>。作为一个全面、易用、优质的现代应用UI解决方案，Semi Design从字节跳动各业务线的复杂场景中提炼而来，目前已经支撑了近千个平台产品，服务了内外部超过10万用户，详情见https://semi.design/zh-CN/start/introduction。Semi Design的特点包括：\n</p>\n<ul>\n  <li>\n    设计简洁、现代化。\n  </li>\n  <li>\n    提供主题方案，可深度样式定制。\n  </li>\n</ul>\n<p>\n  国际化，覆盖了简/繁体中文、英语、日语、韩语、葡萄牙语等20+种语言，日期时间组件提供全球时区支持，全部组件可自动适配阿拉伯文RTL布局。\n</p>\n<pre><code class="language-css">body {\n  display: none;\n}</code></pre>\n<p>\n  采用 Foundation 和 Adapter 跨框架技术方案，方便扩展。\n</p>\n<blockquote>\n  Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统\n  <br />\n  — Semi Design\n</blockquote>\n<p>\n  Semi Design 是由 <strong>抖音前端团队</strong>和MED产品设计团队设计、开发并维护的<em>设计系统</em>。作为一个全面、易用、优质的现代应用UI解决方案，Semi Design从字节跳动各业务线的复杂场景中提炼而来，目前已经支撑了近千个平台产品，服务了内外部超过10万用户，详情见https://semi.design/zh-CN/start/introduction。Semi Design的特点包括：\n</p>\n<ul>\n  <li>\n    设计简洁、现代化。\n  </li>\n  <li>\n    提供主题方案，可深度样式定制。\n  </li>\n</ul>\n<p>\n  国际化，覆盖了简/繁体中文、英语、日语、韩语、葡萄牙语等20+种语言，日期时间组件提供全球时区支持，全部组件可自动适配阿拉伯文RTL布局。\n</p>\n<pre><code class="language-css">body {\n  display: none;\n}</code></pre>\n<p>\n  采用 Foundation 和 Adapter 跨框架技术方案，方便扩展。\n</p>\n<blockquote>\n  Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统\n  <br />\n  — Semi Design\n</blockquote>\n<p>\n  Semi Design 是由 <strong>抖音前端团队</strong>和MED产品设计团队设计、开发并维护的<em>设计系统</em>。作为一个全面、易用、优质的现代应用UI解决方案，Semi Design从字节跳动各业务线的复杂场景中提炼而来，目前已经支撑了近千个平台产品，服务了内外部超过10万用户，详情见https://semi.design/zh-CN/start/introduction。Semi Design的特点包括：\n</p>\n<ul>\n  <li>\n    设计简洁、现代化。\n  </li>\n  <li>\n    提供主题方案，可深度样式定制。\n  </li>\n</ul>\n<p>\n  国际化，覆盖了简/繁体中文、英语、日语、韩语、葡萄牙语等20+种语言，日期时间组件提供全球时区支持，全部组件可自动适配阿拉伯文RTL布局。\n</p>\n<pre><code class="language-css">body {\n  display: none;\n}</code></pre>\n<p>\n  采用 Foundation 和 Adapter 跨框架技术方案，方便扩展。\n</p>\n<blockquote>\n  Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统\n  <br />\n  — Semi Design\n</blockquote>\n',
  },
  {
    key: 'file2',
    name: 'Semi Design DSM',
    content:
      '<h2>\n  Semi Design DSM\n</h2>\n<p>Semi DSM is a design system management tool provided by Semi Design. It supports global and component-level style customization and keeps synchronization between Figma and front-end code. Suitable for teams of all sizes. Whether you need to simplify workflow, improve team collaboration, or increase productivity, we have features suitable for you.</p>\n',
  },
  {
    key: 'file3',
    name: 'React v19 Adaptation',
    content:
      '<h2>\n  React v19 Adaptation\n</h2>\n<p>Since the release of React v19, React has introduced numerous underlying mechanism and API changes, including upgrades and adjustments to the render mechanism, ref, context, TypeScript types, and related deprecated APIs. To ensure that the Semi Design component library is smoothly compatible with both React v19 and lower versions, we provide the original component package Semi React package for React versions below v19, as well as a new package Semi React 19 package specifically adapted for React v19, so users can choose as needed. This guide will help you understand how to install, use, and the precautions to take.\nInstallation & Usage\nIf your project is using React v19, please use Semi React 19 package. For React versions below v19, continue using Semi React package as before.</p>\n',
  },
];
export const references: SidebarAnnotationGroup[] = [
  {
    header: 'Semi design introduction',
    key: '1',
    annotations: [
      {
        order: 1,
        type: 'video',
        duration: 4432,
        title: 'Semi Design is a design system designed',
        url: '/demos/photo.svg',
        logo: '/demos/one.svg',
        siteName: 'Semi Design',
        detail:
          ' As a comprehensive, easy-to-use, and high-quality modern enterprise-level application UI solution',
        img: '/demos/photo.svg',
      },
      {
        order: 2,
        title: 'Quick start',
        type: 'video',
        duration: 56,
        url: '/demos/photo.svg',
        detail:
          ' As a comprehensive, easy-to-use, and high-quality modern enterprise-level application UI solution',
        logo: '/demos/one.svg',
        siteName: 'Semi Design',
        img: '/demos/photo.svg',
      },
      {
        order: 3,
        title: 'Use components in a modular way',
        url: '/demos/photo.svg',
        detail:
          'Semi provides esm format dist, and the css of the component is only imported by the corresponding js.\nWhen used in Webpack, Rspack, create-react-app or Vite projects, there is no need to configure any compilation items.',
        logo: '/demos/one.svg',
        siteName: 'Semi Design',
        img: '/demos/photo.svg',
      },
    ],
  },
  {
    header: 'Design resource',
    key: '2',
    annotations: [
      {
        order: 2,
        title: 'Semi Design resource',
        url: '/demos/photo.svg',
        detail:
          'Semi Design provides a wealth of design resources to help designers and developers collaborate efficiently. Whether you are a community user or a ByteDance internal designer, you can find UI Kit resource and Figma plug-ins that suit you here.',
        logo: '/demos/one.svg',
        siteName: 'Semi Design resource',
        img: '/demos/photo.svg',
      },
    ],
  },
];
export const defaultFileContent =
  '<h2>\n  Semi Design 介绍\n</h2>\n<p>\n  Semi Design 是由 <strong>抖音前端团队</strong>和MED产品设计团队设计、开发并维护的<em>设计系统</em>。作为一个全面、易用、优质的现代应用UI解决方案，Semi Design从字节跳动各业务线的复杂场景中提炼而来，目前已经支撑了近千个平台产品，服务了内外部超过10万用户，详情见https://semi.design/zh-CN/start/introduction。Semi Design的特点包括：\n</p>\n<ul>\n  <li>\n    设计简洁、现代化。\n  </li>\n  <li>\n    提供主题方案，可深度样式定制。\n  </li>\n</ul>\n<p>\n  国际化，覆盖了简/繁体中文、英语、日语、韩语、葡萄牙语等20+种语言，日期时间组件提供全球时区支持，全部组件可自动适配阿拉伯文RTL布局。\n</p>\n<pre><code class="language-css">body {\n  display: none;\n}</code></pre>\n<p>\n  采用 Foundation 和 Adapter 跨框架技术方案，方便扩展。\n</p>\n<blockquote>\n  Semi Design 是由抖音前端团队和MED产品设计团队设计、开发并维护的设计系统\n  <br />\n  — Semi Design\n</blockquote>';
export const cssCode =
  '.semi-animation-react-demo-auto {\n    button {\n        height: 50px;\n        border: 0;\n        cursor: pointer !important;\n        background: #777;\n        color: white;\n        outline: none;\n        -webkit-appearance: none;\n    }\n\n    button:hover {\n        background: #878787;\n    }\n\n    .auto-main {\n        display: grid;\n        grid-template-columns: repeat(3, 1fr);\n        grid-template-rows: auto 1fr;\n        background: #575757;\n    }\n\n    .content {\n        grid-column: span 3;\n    }\n\n    .item {\n        background: indianred;\n        width: 100%;\n        overflow: hidden;\n        color: white;\n    }\n\n    .item p {\n        margin: 0;\n        padding: 10px;\n    }\n}\n';
export const jsonCode =
  '{\n    "axisX": {\n        "title": {\n            "visible": false,\n            "position": "center"\n        },\n        "label": {\n            "visible": true,\n            "style": {\n                "fontSize": 12,\n                "fontWeight": 400,\n                "lineHeight": 16,\n                "fontFamily": [\n                    "Inter"\n                ],\n                "fill": "rgba(0, 0, 0, 0.47843137254901963)"\n            },\n            "space": 12\n        }\n    }\n}';
