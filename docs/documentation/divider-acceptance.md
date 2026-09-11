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
