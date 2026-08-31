# CodeHighlight v2.102.0 对齐矩阵

## 路线、固定证据与组件边界

- 当前路线：实时 README 为 `68 / 85`，最新完成 `IconButton`；README 与固定
  `vendor/semi-design/content/order.js` 都把尚未完成且依赖边界较小的 `CodeHighlight`
  指定为下一项。完成后进度应为 `69 / 85`。
- React Adapter 与公开类型：`vendor/semi-design/packages/semi-ui/codeHighlight/index.tsx`。
- Foundation 与常量：`vendor/semi-design/packages/semi-foundation/codeHighlight/index.ts`、
  `constants.ts`。
- 样式：`vendor/semi-design/packages/semi-foundation/codeHighlight/codeHighlight.scss`、
  `variables.scss`，默认主题来自固定 `semi-theme-default/scss/index.scss` 与 `global.scss`。
- 中英文文档与故事：`vendor/semi-design/content/plus/codehighlight/`、
  `vendor/semi-design/packages/semi-ui/codeHighlight/_story/`。
- 固定版本为 `v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。

| 模块                                    | 单一职责                                                    | 状态与副作用                                                 |
| --------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------ |
| `CodeHighlight.vue`                     | 解析公开 props/全局默认值，输出固定 DOM，并在客户端触发高亮 | 只保存 code DOM ref；mounted 与固定更新条件下调用 Foundation |
| `foundation-integration/code-highlight` | 将固定 Prism 高亮与行号状态机隔离在私有边界                 | `Prism.manual = true`；不向公开声明泄漏 vendor 类型          |
| React/Vue 场景                          | 覆盖 JavaScript、CSS、无行号和无默认主题                    | 场景自身无业务状态，只提供可重复的代码文本                   |

组件只有一个展示职责，不需要额外子组件、composable、provider、Portal、Observer 或公开事件。

## 公开 API、默认值与显式性门禁

| React v2.102.0           | Vue API                                 | 默认值 / 优先级                                           | 结论         |
| ------------------------ | --------------------------------------- | --------------------------------------------------------- | ------------ |
| `code: string`           | 同名必填 prop                           | 纯文本；由 Prism 转成安全 token DOM                       | 等价         |
| `language: string`       | 同名必填 prop                           | 写入 `language-${language}`                               | 等价         |
| `lineNumber?: boolean`   | 同名 Boolean prop                       | 显式 prop → `overrideDefaultProps.CodeHighlight` → `true` | 等价         |
| `defaultTheme?: boolean` | 同名 Boolean prop                       | 显式 prop → `overrideDefaultProps.CodeHighlight` → `true` | 等价         |
| `className` / `style`    | 同名 prop，另合并 Vue `class` / `style` | 只作用于根节点                                            | Vue 原生映射 |
| `data-*`                 | Vue attrs                               | 固定 Adapter 只转发 data attrs                            | 等价         |

- `lineNumber` 与 `defaultTheme` 都是默认值为 `true` 的可选 Boolean，必须从原始 VNode props
  区分缺省和显式 `false`；普通 `props.value ?? true` 或 truthiness 不可作为默认值裁决。
- 单元门禁分别覆盖缺省、显式 `false`、显式 `true`，并覆盖全局默认值为 false 时显式 true
  仍优先。真实 SFC 模板宿主覆盖裸 Boolean，`h()` 宿主覆盖 true/false 输入。
- 无 default slot、emit 或 v-model；调用方代码始终作为纯文本 prop，不接收任意 HTML。

## 生命周期、Prism 与固定更新语义

- mounted 后，Foundation 在真实 `code` 节点上加入 `language-*`，按 `lineNumber` 加入
  `line-numbers`，再调用 `Prism.highlightElement(element, false)`。
- 固定 Foundation 使用 Prism 核心内置的 markup/html、css、clike、javascript 语法；其他语言继续由
  使用者显式导入对应 `prismjs/components/prism-*.js`，不在本切片膨胀默认运行时。
- 固定 React Adapter 的 `componentDidUpdate` 条件含原样拼写
  `this.props.language !== this.props.language`，因此只有 `code` 变化会重新高亮；单独改变
  `language`、`lineNumber` 或 `defaultTheme` 不触发 Foundation。Vue 保留这一可观察行为，并用单元测试
  固定，避免无证据修复上游行为。
- Foundation 只追加新的 `language-*` / `line-numbers` class，不主动移除历史 class；代码变化后的行为
  按固定源码验证，不创造额外清理状态机。
- Prism 生成的 `.token.*` 与 `.line-numbers-rows` 是 Foundation 结果，不由 Vue 模板伪造。

## DOM、class、样式与安全

- 根节点固定为 `div.semi-codeHighlight.semi-light-scrollbar`；启用默认主题时增加
  `.semi-codeHighlight-defaultTheme`。
- 固定子树为 `div > pre > code`。源码文本必须先由 Vue 文本节点转义，不能对调用方输入直接使用
  `v-html`；Prism 自己对 token 化输出进行编码。
- 行号插件会把 Foundation 暂时写到 code 的 `line-numbers` class 迁移到
  `pre.language-*.line-numbers`，code 保留 `language-*`，并生成
  `.line-numbers-rows > span`；行数由换行文本决定。
- 默认主题保持固定 monospace 字体、`13px / 1.5`、LTR 代码方向、pre padding/background、token
  颜色与行号边栏。`defaultTheme=false` 时组件仍高亮并输出 token class，只不附加主题根 class。
- 逐组件主题入口按 default tokens → global → codeHighlight.scss 编译；根主题已含相同固定 SCSS。

## 可访问性、键盘、焦点、RTL、国际化与动效

- 固定 Adapter 不创建交互控件、tab stop、ARIA role 或键盘事件；语义来自原生 `pre > code`。
- 组件无焦点管理、Portal 或动效；代码可以被浏览器原生选择和复制。
- 代码块在 RTL 页面仍由固定 CSS 强制 `direction:ltr; text-align:left`；容器本身不创建方向状态。
- 组件没有 locale 文案；zh-CN/en-US 场景使用相同代码与结构。
- 视觉矩阵覆盖 desktop/mobile 的 light/dark 与 RTL；暗色由 `--semi-*` token 驱动。

## SSR 与发布边界

- SSR 只输出已转义的原始代码和固定结构，不执行 DOM 高亮；hydration/mount 后再生成 Prism token 与行号。
- `prismjs` 作为公开运行时依赖固定版本、许可和 SBOM 证据；Foundation 入口保持私有并在 UI 构建中内联，
  公开 JS / `.d.ts` 不得出现 `vendor/**` 或 `@workspace/**`。
- 根包与 `./code-highlight` 子路径导出组件和公开类型；主题根 CSS 与
  `./code-highlight.css` 子路径导出编译样式。
- 真实 tarball 验证覆盖安装、根/子路径导入、类型、SSR-safe import、逐组件样式和 prismjs 许可证。

## 验收矩阵

| 层级                  | 门禁                                                                                                                                                       |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 单元                  | 缺省/false/true Boolean、全局默认值优先级、template 与 `h()`、JS/CSS token、行号、代码更新、固定 language-only 更新语义、class/style/data attrs、HTML 转义 |
| SSR                   | 原始文本安全转义、固定 DOM/class、无 token/行号 DOM、无 browser global                                                                                     |
| Chromium 行为         | 实际 Prism token/行号、代码可选择、无运行时错误与非 vendor 请求                                                                                            |
| computed style / 几何 | 根/pre/code/token/行号节点样式逐项相等；rect 各轴差不超过 `0.5 CSS px`                                                                                     |
| 视觉                  | desktop/mobile light/dark 与 RTL；阈值符合仓库约束，并独立比较 React/Vue PNG 字节                                                                          |
| 发布                  | typecheck、构建、主题产物、SSR dist、真实 tarball 的导入/类型/样式/依赖许可                                                                                |

## Deviation 与状态

- `className` 之外兼容 Vue 原生 `class`，属于框架属性映射，不改变固定 class 或 DOM。
- Prism 高亮只在客户端发生，是 React `componentDidMount` 到 Vue `onMounted` 的生命周期映射。
- 固定 Adapter 的 language-only 更新拼写问题按实际源码保留，不作为 Vue deviation；若未来升级基线，应重新裁决。

当前状态：`ready`。单元/SSR、受影响类型与构建、主题、同环境 Chromium、工作台 smoke 和真实
tarball 门禁均已通过；五组 React/Vue PNG 同时通过像素阈值比较与逐字节比较，当前没有 accepted
visual/behavior deviation。
