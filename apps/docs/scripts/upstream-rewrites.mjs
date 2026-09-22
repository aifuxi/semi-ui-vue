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
  [
    'Semi Design 是由抖音前端团队，MED 产品设计团队设计、开发并维护的设计系统。',
    '固定基线所对应的 Semi Design 是由抖音前端团队、MED 产品设计团队设计、开发并维护的设计系统。Semi UI Vue 是基于该设计系统的独立 Vue 3 实现，并非 Semi Design 官方项目；下文关于团队、工具和未来规划的第一人称描述均来自固定上游，不代表本项目承诺。',
  ],
  [
    '同时，为了进一步提升开发体验，我们也提供了将未规范化的存量旧工程一键兼容到 Semi 暗色模式的 cli 工具，通过自动化的方式规避迁移成本。',
    '固定上游另有面向存量工程的暗色模式迁移工具；该工具不属于 Semi UI Vue 的公开包或支持范围。',
  ],
  [
    '目前，我们实现了 Adapter 的 React 版本，你可以直接通过引入 semi-ui 来使用我们的 React 组件。',
    '固定上游提供 React Adapter；Semi UI Vue 通过私有集成边界复用固定 Foundation，并以 Vue props、emits、slots 与 v-model 暴露公开 API。',
  ],
  [
    '各组件文档中的 Accessibility 章节对 WAI-ARIA 支持程度给出了详细的描述以及最佳实践建议，同时，我们对于高频使用的组件也提供了键盘事件支持以及焦点可访问性的无障碍支持。但由于无障碍的改进是一项工作量较大的工程，目前我们尚未在所有组件上提供完备键盘与焦点无障碍功能，更多的进展可查阅 [A11y Issue](https://github.com/DouyinFE/semi-design/issues/205)',
    '各组件文档保留固定基线的 Accessibility 说明；Semi UI Vue 的语义、键盘与焦点能力以对应组件契约和当前浏览器验证为准，未记录的能力不作额外承诺。',
  ],
  [
    'Semi 团队后续仍会持续关注并提升组件的可操作性、可感知性，在持续迭代中，在基于鼠标的操作外提供更便捷的键盘交互以及更完善的无障碍功能。',
    '固定上游的后续规划不自动成为 Semi UI Vue 的交付承诺；本项目按固定 v2.102.0 基线维护已记录的可访问性契约。',
  ],
  [
    '我们团队当前阶段重点会聚焦于 React 体系内，但 WebComponent 也是我们重点关注的方向之一。未来时机合适，我们会进行更多的尝试，敬请期待。',
    '上述多框架展望来自固定上游文档；Semi UI Vue 当前只维护 Vue 3.5+ 的公开实现。',
  ],
  [
    '创建完成主题下载后，使用 Semi 插件可以快速地接入选择的主题。每种构建工具都可以通过下面三种方式自定义主题，**优先级由低到高**：',
    '创建或下载主题后，直接导入主题包提供的编译 CSS。Webpack 与 Vite 都遵循标准 CSS 顺序，后导入的规则覆盖先导入的规则：',
  ],
  ['通过插件参数传入键值对覆盖', '通过业务作用域覆盖组件样式'],
  [
    '对于使用 Webpack 的用户，可以使用 SemiWebpackPlugin 来接入定制主题。',
    'Webpack 可直接加载主题包 CSS；Semi UI Vue 不要求安装额外主题插件。',
  ],
  [
    '安装：`yarn add -D @douyinfe/semi-webpack-plugin` 或 `npm i -D @douyinfe/semi-webpack-plugin`',
    '安装你的主题包后，在应用入口导入其 CSS。',
  ],
  ['替换 CSS 选择器前缀', '使用业务作用域隔离覆盖'],
  [
    'Semi Design 的 CSS 选择器默认以 `semi` 作为前缀（如 `.semi-button`），可以通过 `prefixCls` 替换：',
    'Semi UI Vue 保留 `.semi-*` 兼容类名；需要隔离覆盖时增加业务作用域：',
  ],
  [
    '替换后选择器将变为 `.custom-button`。',
    '兼容类名仍保持 `.semi-*`；业务作用域只限制覆盖规则的生效范围。',
  ],
  [
    '对于使用 Vite 的用户，可以使用 SemiVitePlugin 来接入定制主题。',
    'Vite 可直接加载主题包 CSS；Semi UI Vue 不要求安装额外主题插件。',
  ],
  [
    '安装：`yarn add -D @douyinfe/semi-vite-plugin` 或 `npm i -D @douyinfe/semi-vite-plugin`',
    '安装你的主题包后，在应用入口导入其 CSS。',
  ],
  [
    '> 同时支持 `cssLayer: true`（将编译产物包裹在 `@layer semi { ... }` 中）和 `omitCss: true`（注释掉 semi 包内的 `.css` 引入，适用于 Next.js 等不允许从 `node_modules` 引入全局 CSS 的场景）。',
    '> 主题包只提供编译 CSS；构建工具的 CSS Layer、代码分割和全局样式限制由消费项目自行配置。',
  ],
  [
    '更多工程化方案（如 Next.js）的主题接入，可参考 [DSM 文档](https://semi.design/dsm_manual/zh-CN/web/use#dsm_%E5%A6%82%E4%BD%95%E6%B6%88%E8%B4%B9%E4%B8%BB%E9%A2%98)',
    '消费项目只需保证主题 CSS 先于业务覆盖加载；框架专属插件不属于本项目的公开契约。',
  ],
  ['使组件级变量的改动生效', '覆盖组件级样式'],
  [
    '如果在定制主题的过程中你修改了组件级别的变量，`theme` 字段需要用如下配置使改动生效：',
    '需要覆盖单个组件时，在主题 CSS 之后加载对应业务样式：',
  ],
  [
    '若你希望对弹出层也生效，应当使用 getPopupContainer 将弹出层插入节点置于你挂载 `.semi-always-dark` 或 `.semi-always-light` 类名的元素内部',
    '若你希望对弹出层也生效，应通过 `ConfigProvider` 的 `getPopupContainer` prop（模板中使用 `:get-popup-container`）把弹出层挂载到带有 `.semi-always-dark` 或 `.semi-always-light` 的元素内部',
  ],
  [
    '该属性目前处于实验阶段，请留意浏览器兼容性 (Chrome >= 76, Safari >= 12.1) 及未来可能发生的改变。',
    '该媒体查询已被现代浏览器广泛支持；消费项目仍应按自身浏览器范围验证。',
  ],
  [
    'Semi 在开发过程中，有可能出于设计考虑更新或者添加部分通用变量。如果你使用的是定制主题，当 Semi 发布了新的通用变量后（我们会在更新日志里标注），我们建议你前往 [Semi DSM](https://semi.design/dsm/) 更新该主题（大部分情况下仅需重新执行一次发布操作即可）',
    'Semi UI Vue 固定对齐 Semi Design v2.102.0。使用自定义主题时应核对其变量与该基线兼容，不自动跟随上游后续版本。',
  ],
  [
    '- 现代浏览器（Semi 的暗色模式/样式文件依赖于 CSS variable，最低版本要求为 edge，ie11 及以下均不支持）',
    '- 下表是固定上游的兼容性参考；Semi UI Vue 当前发布门禁固定完整 Chromium，其他现代浏览器未建立发布矩阵。主题依赖 CSS variables，不支持 IE11。',
  ],
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
