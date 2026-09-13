# Divider 文档批次验收

基线：Semi Design v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。

## 范围与契约

逐项审阅固定 basic/divider 中英文 Markdown、semi-ui/divider/index.tsx 与 Foundation divider 样式，以及 Vue 双语 Demo、API 表和迁移段落。Divider 没有独立 Foundation 行为实例。

| 索引 | 示例        | 验收                                                                       |
| ---- | ----------- | -------------------------------------------------------------------------- |
| 1    | Basic       | 横向/纵向、实线/虚线六条分割线，12px 轴向 margin，标题、正文和行内阅读顺序 |
| 2    | WithContent | left/center/right 文字、默认居中图标插槽，分隔伪元素、文字和图标几何       |

全部覆盖双语 × light/dark × LTR/RTL，共 16 项。比较可见节点关键样式、边框线型及 ::before/::after；几何各轴差不超过 0.5 CSS px。截图使用同一 Chromium context、本地 Inter 和相同页面坐标，整段示例及每条分割线分别对照，threshold=0.1、maxDiffPixelRatio=0.001，不 mask 或放宽容差。

示例没有自身交互状态、Portal 或动画。检查可见源码与实际 SFC 一致；双语首主题 LTR 验证源码展示/重置、在线编辑首帧及退出清理。分割线没有默认 separator 角色和 Tab 焦点；语义分隔由消费者显式传入 role/aria-orientation。Demo 为 ClientOnly，不能把静态站构建当作组件 SSR render 证据。

## API、迁移与归属

七项上游 API 均保留：align、children/default slot、className/class、dashed、layout、margin、style。children 改为默认插槽，垂直不渲染内容；style 覆盖 margin 同名轴向值。英文 margin 说明按源码修正方向描述。标题、引入、两个示例、API 和设计变量均保留。

沿用既有品牌替换：双侧只将 IconSemiLogo 替换为 IconInfoCircle，参考适配器直接读取固定 Markdown，不维护 React 副本。该替换保留任意 VNode 内容示例，不代表原 Logo 的像素验收。无其他 accepted deviation。正式入口生成有效证据后才计入 accepted。

## 2026-09-13 历史审阅补齐

重读固定双语全部 4 个 live 片段、4 个 Vue SFC、固定 `packages/semi-ui/divider/index.tsx` 与 `packages/semi-foundation/divider/divider.scss`，并核对当前 Divider props、默认插槽渲染和双语内联 API。章节、七项 API 与迁移说明完整；英文上游 margin 的方向笔误已按固定源码解释为水平上下、垂直左右。审阅使用现有 `documentReview` 对最终双语正文生成指纹，不沿用历史声明。

| 示例（双语索引） | 固定片段前提与核查结论                                                                                                                                                                             |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Basic（1）       | 双语均为四个标题、两条水平线及四条垂直线；全部 margin 为 12px，后三个标题 marginTop 为 40px。英文左右文案为 Left/Middle/Right，正文与中文分别保留。没有按钮、浮层、异步状态或自定义资源。          |
| WithContent（2） | 双语均为 left/center/right 三条文本线及一条默认居中图标线；字符串内容由 inner-text span 包裹，图标不套该文本节点。固定 IconSemiLogo 仅按既有品牌规则双侧替换；未使用的 Typography 导入不影响演示。 |

本地 CSS 与图标是唯一资产前提。现有矩阵先检查固定 React 独立加载及 6/4 条线，再比较文本、ARIA、伪元素、几何和局部像素；没有把 Portal 或焦点动作强加给静态组件。源码、重置和编辑器首帧路径保留。源码循环为 2 示例 × 2 语言 × 2 主题 × 2 方向 = 16 项，实际列表与正式结果交由主调度核验。
