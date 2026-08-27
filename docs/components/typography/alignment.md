# Typography v2.102.0 对齐矩阵

## 固定证据

- 公开入口：`vendor/semi-design/packages/semi-ui/typography/index.tsx`
- 共享 Adapter：`vendor/semi-design/packages/semi-ui/typography/base.tsx`
- 公开组件：`typography.tsx`、`title.tsx`、`text.tsx`、`paragraph.tsx`、`numeral.tsx`
- 复制与截断：`copyable.tsx`、`util.tsx`
- Foundation：`packages/semi-foundation/typography/{constants.ts,formatNumeral.ts,typography.scss,rtl.scss}`
- 中英文文档：`vendor/semi-design/content/basic/typography/`
- 上游单测：`vendor/semi-design/packages/semi-ui/typography/__test__/typography.test.js`

以上文件均来自只读 submodule 的 `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。

## 组件边界

- `Typography.vue` 是默认 `article` 的无状态聚合根。
- `Title.vue`、`Text.vue`、`Paragraph.vue`、`Numeral.vue` 只负责各自默认标签和专属 props。
- `TypographyBase.vue` 统一装饰顺序、尺寸继承、link、copyable、CSS/JS ellipsis、Tooltip/Popover 和 attrs。
- `TypographyCopyable.vue` 管理复制、键盘触发、成功状态与计时器清理。
- `typography-utils.ts` 负责 VNode 文本提取、递归数值格式化和 Chromium 测量截断。
- `packages/foundation-integration/src/typography.js` 是固定 `FormatNumeral` 的唯一运行时入口；发布构建会将逻辑内联。

## 公开 API 与默认值

| 固定 React API         | v2.102.0                                                       | Vue API                                     | 结论         |
| ---------------------- | -------------------------------------------------------------- | ------------------------------------------- | ------------ |
| `Typography`           | 默认 `article`，可用 `component` 改标签                        | 同名 prop + 默认 slot                       | 等价         |
| `Typography.Title`     | `heading=1`，默认 h1；component 可覆盖标签但保留 heading class | `Title` / `Typography.Title`                | 等价         |
| `Typography.Text`      | 默认 span，`size=normal`                                       | `Text` / `Typography.Text`                  | 等价         |
| `Typography.Paragraph` | 默认 p，`spacing=normal`                                       | `Paragraph` / `Typography.Paragraph`        | 等价         |
| `Typography.Numeral`   | 默认 span；rule=text、precision=0、truncate=round              | `Numeral` / `Typography.Numeral`            | 等价         |
| `type`                 | primary/secondary/danger/warning/success/tertiary/quaternary   | 同名 typed prop                             | 等价         |
| 装饰                   | mark → code → underline → strong → delete → link 的嵌套顺序    | 同名 boolean props                          | 等价         |
| `link`                 | true 或 a 属性对象；disabled 时改为 span                       | 同名 prop；对象透传给内部 a                 | 等价         |
| `copyable`             | boolean 或配置；content、tip、icon、render、onCopy、duration   | 同名 typed prop；另有 copyIcon/copied slots | Vue 原生增强 |
| `ellipsis`             | CSS 快速路径；middle/expandable/suffix/copyable 进入 JS 测量   | 同名配置；`@expand` 和 tooltip slot         | Vue 原生映射 |
| `icon`                 | Semi Icon 按文本 small/default 尺寸克隆                        | prop 或 icon slot；本地图标保持同一尺寸规则 | 等价         |
| `className/style/ref`  | 根节点契约                                                     | 原生 class/style attrs 与 template ref      | Vue 原生映射 |

`copyable.render` 保留函数配置以便直接迁移；更符合 Vue 的写法是 `copyIcon` / `copied` slot。React `showTooltip.renderTooltip` 映射为 `tooltip` scoped slot，避免把 ReactNode render prop 作为 Vue 公共契约。

## DOM、class 与样式

- 所有公开文本根节点保留 `semi-typography`，并输出 `semi-typography-{type|size|spacing}`。
- Title 保留真实 h1-h6 默认标签与 `semi-typography-h{n}`；字符串 weight 输出 heading weight class，数字 weight 写入 inline `font-weight`。
- Paragraph 固定增加 `semi-typography-paragraph`。
- link 根增加 `semi-typography-link`，内部文字增加 `semi-typography-link-text`；underline link 使用 `semi-typography-link-underline`。
- icon 容器为 `span.semi-typography-icon[x-semi-prop=icon]`。
- copyable 保留 `semi-typography-action-copy` / `semi-typography-action-copied` 与默认 IconCopy/IconTick。
- ellipsis 保留 single/multiple/text/overflow class、`-webkit-line-clamp`、展开按钮 role/tabindex/aria-label。
- 逐组件 CSS 包含 theme/global、Portal、Popover、Tooltip、Typography 与 Icon 固定依赖，dark/RTL 继续使用上游 Token 和选择器。

## 状态、事件与运行环境

- copy 点击或 Enter：写入剪贴板 → 调用配置 `onCopy` → 发出 Vue `copy(event, content, result)` → 进入 copied 状态；默认 3 秒复位，卸载时清理计时器。
- expand 点击或 Enter：先调用配置 `onExpand(next, event)`，再发出 Vue `expand(next, event)`，最后更新展开状态。
- CSS ellipsis 用 Range/scroll 几何判断溢出；JS ellipsis 使用与固定源码一致的隐藏测量容器和二分截断。
- ResizeObserver 同时观察根与父元素宽度，卸载时 disconnect；SSR import/render 不访问 DOM、window、navigator 或 ResizeObserver。
- 默认 Typography locale 为 zh-CN；同一注入键提供 en-US 文案，并为后续 ConfigProvider/Locale 复用。全部 Locale 的公开导出与完整性仍由 Locale 垂直切片统一交付，不在本组件复制 57 份上游数据。

## 验收矩阵

| 证据                | 场景                                                                                                                        |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 单元/SSR            | 聚合根、四组件标签、装饰顺序、link/disabled、尺寸/字重、复制/键盘/计时器、CSS/JS ellipsis、数值六规则与 parser、locale、SSR |
| Chromium 行为       | 固定源码请求、DOM/class、标题/段落/链接/禁用、CSS Tooltip、JS 展开收起、数值/复制、无运行时错误                             |
| computed style/几何 | 10 个目标逐项比较颜色、字体、字重、行高、截断、margin、cursor、user-select；各轴差值不超过 0.5px                            |
| 视觉                | desktop 1440×900 与 mobile 390×844，light/dark；组件级裁剪                                                                  |
| 发布                | 根/typography 子路径 ESM/types、根/typography.css、SSR import、真实 tarball 安装与 SBOM                                     |

截图阈值为 `threshold=0.1`、`maxDiffPixelRatio=0.001`；仍需人工排除局部集中差异。

## Deviation

没有 accepted visual/behavior deviation。React children、ReactNode 和 ref 分别迁移为默认/命名 slot、VNodeChild 与 template ref；`renderTooltip` 迁移为 scoped slot，属于框架原生 API 映射。
