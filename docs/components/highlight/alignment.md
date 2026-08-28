# Highlight 对齐矩阵

## 选择与固定证据

- 选择理由：Highlight 是固定 `content/order.js` 中紧随 Empty 的公开组件；它只依赖独立 Highlight Foundation 与 SCSS，不依赖尚未完成的 Image Preview、Modal 等后续组件，可独立完成验证。
- 固定基线：Semi Design `v2.102.0`，提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- Adapter 与公开类型：`vendor/semi-design/packages/semi-ui/highlight/index.tsx`。
- Foundation 与样式：`vendor/semi-design/packages/semi-foundation/highlight/foundation.ts`、`constants.ts`、`variables.scss`、`highlight.scss`。
- 默认主题：`vendor/semi-design/packages/semi-theme-default/scss/index.scss`、`global.scss`。
- 中英文文档与场景：`vendor/semi-design/content/show/highlight/`、`vendor/semi-design/packages/semi-ui/highlight/_story/`。

## Vue 组件边界

| 文件                                     | 单一职责                                       | 契约                                      |
| ---------------------------------------- | ---------------------------------------------- | ----------------------------------------- |
| `Highlight.vue`                          | 根据 props 计算 Foundation chunks              | 类型化 props；无 emits、slots、根 wrapper |
| `HighlightNodeRenderer.ts`               | 精确保留文本空白并输出动态高亮标签             | Highlight 内部 render function            |
| `types.ts`                               | 定义搜索词、样式和公开 props                   | 根入口与 `highlight` 子路径导出           |
| `index.ts`                               | 提供默认/具名导出                              | 根入口与 `highlight` 子路径               |
| `foundation-integration/src/highlight.*` | 隔离固定 Foundation 的匹配、重叠合并与补全算法 | 私有入口，构建后内联                      |

组件需要返回文本与标签组成的多个兄弟节点，使用 Vue Fragment 是模板能够表达固定 DOM 的最小实现；不增加包装元素。

## API、默认值与 Vue 映射

| Semi React v2.102.0  | 默认值   | Vue 契约                                         | 对齐门禁                                              |
| -------------------- | -------- | ------------------------------------------------ | ----------------------------------------------------- |
| `sourceString`       | `''`     | `string`                                         | 空值、普通文本和匹配文本                              |
| `searchWords`        | `[]`     | `(string \| HighlightSearchWord \| undefined)[]` | 空词过滤、字符串、对象、重叠词                        |
| `component`          | `'mark'` | `string`                                         | 默认 `mark` 与自定义 `span`/`strong`                  |
| `highlightClassName` | 无       | `string`                                         | 与 `.semi-highlight-tag` 及单词 class 合并            |
| `highlightStyle`     | 无       | Vue `CSSProperties`                              | 全局样式先应用，单词 style 后覆盖                     |
| `caseSensitive`      | `false`  | `boolean`                                        | 缺省、显式 `false`、显式 `true`                       |
| `autoEscape`         | `true`   | `boolean`                                        | 缺省、显式 `false`、显式 `true`；`false` 使用正则语义 |

`autoEscape` 是默认值为 `true` 的可选 Boolean prop。Vue 通过 `withDefaults` 保留缺省为 `true`，显式 `false` 不被 truthiness 覆盖；单元测试必须分别覆盖三种调用方式。组件没有 provider/global 覆盖，因此无需读取原始 VNode props。

## 匹配、合并与渲染

1. `autoEscape=true` 时转义正则字符；`false` 时搜索词按正则表达式解释。
2. `caseSensitive=false` 使用不区分大小写的全局匹配；`true` 保留大小写。
3. 空字符串搜索词被过滤；固定公开类型虽容许 `undefined` 数组项，但 Foundation 会在读取其 `text` 时抛错，本实现不擅自修复该上游行为。
4. 匹配区间按起点排序；相交或首尾相接的区间合并。合并 class 优先保留较早匹配的非空 class，style 以后一个匹配覆盖同名键。
5. 未匹配区间输出原始文本节点；匹配区间输出 `component` 指定标签。
6. 标签 class 顺序为 `.semi-highlight-tag`、全局 `highlightClassName`、单词 `className`；样式顺序为全局 `highlightStyle` 后单词 `style`。
7. 文本由 Vue 插值转义，不使用 `v-html`，与 React 文本节点的安全语义一致。

固定 React Adapter 返回数组且没有根元素。Vue 组件同样没有元素 wrapper；Vue Fragment 的边界注释是框架 hydration 标记，不改变元素 DOM、文本、布局或可访问树。

## 样式、主题、RTL 与动效

- `.semi-highlight-tag`：文字颜色 `var(--semi-color-highlight)`、背景 `var(--semi-color-highlight-bg)`、字重 `600`。
- light：默认黑色文字与 yellow-4 背景；dark：默认白色文字与 yellow-2 背景，均由固定 `global.scss` Token 驱动。
- Highlight 没有专属布局、RTL SCSS、Portal 或动效；文本方向继承调用方祖先，RTL 场景验证文本流和几何不产生 Vue 偏差。
- 逐组件 `highlight.css` 包含固定主题 Token 与 Highlight SCSS，消费者无需额外导入根主题。

## 可访问性、国际化与 SSR

| 维度        | 契约                                                                             |
| ----------- | -------------------------------------------------------------------------------- |
| 键盘/焦点   | 不创建可聚焦节点或键盘处理；自定义标签保持调用方选择的原生语义                   |
| ARIA        | 固定 Adapter 没有 ARIA props 或根节点；高亮文本仍属于连续可访问文本              |
| 国际化      | 无内置 locale 文案；Unicode/中英文文本均按 JavaScript 正则索引匹配               |
| Portal/动效 | 不适用                                                                           |
| SSR         | import/setup 不访问 DOM；服务端输出相同文本和高亮标签，Fragment 可稳定 hydration |

## 测试与验收矩阵

- 单元：默认 DOM、默认值三态、普通/对象搜索词、大小写、正则转义开关、重叠合并、class/style 覆盖、自定义标签、空词、无匹配、响应式更新和 HTML 转义。
- SSR：根/子路径 import 安全；默认 `mark`、自定义标签、样式与转义文本稳定。
- React/Vue 场景：基础中文、统一 class/style、大小写、正则、重叠词与自定义标签。对象差异化样式由固定 Foundation 和 Vue 单元测试覆盖；固定 Adapter 的旧 PropTypes 会错误地把文档支持的对象数组报告为非字符串，因此视觉场景不注入该开发态警告。
- computed style：默认标签、对象标签和自定义标签的颜色、背景、字重、display、padding、border radius。
- geometry：全部 parity target 的 bounding rect 各轴差值不超过 `0.5 CSS px`。
- 截图：桌面 `1440×900`、移动 `390×844` 的 light/dark，以及 RTL；`threshold <= 0.1`、`maxDiffPixelRatio <= 0.001`，并直接比较 React/Vue 裁剪 PNG buffer。
- 发布：根/`highlight` 子路径 ESM 与声明、`highlight.css`、tree-shaking、SSR-safe import、tarball 离线安装、许可证、第三方声明和 SBOM。

## Deviation

当前没有 accepted deviation。Vue Fragment 边界注释是无元素 wrapper 组件的框架级 hydration 标记，不进入元素 DOM、可访问树或截图，不视为公开行为偏差。

## 验收状态

- 当前状态：`ready`，没有 accepted deviation。
- 行为门禁：完整 `pnpm check` 通过，共 `73` 个测试文件、`539` 个单元与 SSR 测试。
- 浏览器门禁：Highlight 定向 `7/7` 通过，全量 Chromium 回归 `285/285` 通过；五组 React/Vue 裁剪 PNG 均由独立截图 buffer 直接比较且字节相等。
- 发布门禁：根/子路径 ESM、公开类型、逐组件主题、SSR import、真实 tarball 安装与合规扫描全部通过。
