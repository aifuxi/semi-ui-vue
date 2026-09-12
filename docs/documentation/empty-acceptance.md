# Empty 文档验收

固定参考：只读 Semi v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。

5 项双语示例均覆盖 light/dark 与 LTR/RTL，共 40 项。选中范围为 `[class*="semi-"], svg, svg path, br`，因此组件节点、内联插画的 svg 根与路径（viewBox、尺寸、path data）、以及 Typography 文本节点都在比较内。逐节点比较 class、属性、文本、关键计算样式（盒模型、flex、字体、颜色、填充）与几何（各轴 ≤0.5px）；整体截图 threshold=0.1、maxDiffPixelRatio=0.001，并对每个 Empty 实例单独裁剪比较（Illustrations 示例逐张裁剪八张插画）。

## 本批修复与对齐

- **参考适配器**：新增 `apps/reference-react/docs-adapters/empty.mjs`。除把匿名箭头示例命名为默认导出外，还需把固定片段的 `@douyinfe/semi-illustrations` 指向固定 vendor 插画入口（参考侧只别名了该入口，仓库既有做法）；不复制上游实现。
- **示例**：中英文 5 个示例的文案、结构与内联样式与固定片段逐字一致，未做改写（先用临时探针核对固定片段与示例的文案差异，清理探针输出中的解析噪音后无残留差异）。
- 组件、主题与文档正文未修改。

## 限定等价项

- 插画在 Vue 侧来自 `@aifuxi/semi-illustrations-vue` 的逐组件子路径，参考侧来自固定 `semi-illustrations` 入口；两侧渲染同一份固定 SVG 几何，矩阵比较 svg 根属性、path data、填充与几何。
- 空状态本身没有交互状态；主题差异（light/dark 分别使用 `image` 与 `darkModeImage`）由矩阵的主题轴覆盖。

除上述来源明确的等价项外，没有放宽裁剪、容差或门槛，也没有其它未解释差异。

## 交互覆盖

- 5 个示例都是纯展示型占位内容，没有文档化交互；矩阵逐节点比较结构、文本、插画属性、计算样式与几何，并对每个 Empty 实例单独裁剪（Illustrations 八张、其余一张）。
- 双语 light/LTR 另执行源码展开/收起、重置与在线编辑 iframe 内的实际渲染与退出恢复，覆盖示例的加载与重挂载路径。

## 章节/API/迁移审阅

双语保留固定上游章节与顺序（代码演示/如何引入、基本用法、自定义、不同布局、占位图插画、API 参考、Accessibility/ARIA、文案规范、设计变量、FAQ），另补 React→Vue 迁移表。API 以真实公开 Vue 类型为准：`image`/`darkModeImage`/`title`/`description`/`children` 既支持 VNodeChild prop 也支持同名插槽（插槽优先），`layout` 默认 `vertical` 并支持 `horizontal`，插画由 `EmptySvgNode` 渲染。

正式状态以 evidence/empty.json 的完整矩阵与输入指纹为准，诊断不计入 accepted。
