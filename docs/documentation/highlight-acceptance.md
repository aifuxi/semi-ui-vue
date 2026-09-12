# Highlight 文档验收

固定参考：只读 Semi v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。

4 项双语示例均覆盖 light/dark 与 LTR/RTL，共 32 项。选中范围为 `[class*="semi-"], h2, mark, strong, br`，因此高亮片段（带 `semi-highlight-tag`）、其宿主标签（mark/strong）、外层 h2 与文本内容都在比较内。逐节点比较 class、属性、文本、关键计算样式（字体、颜色、背景、盒模型、边框圆角、内外边距）与几何（各轴 ≤0.5px）；整体截图 threshold=0.1、maxDiffPixelRatio=0.001，并对每个高亮片段按锚定到参考元素的固定裁剪区域单独比较。

## 本批修复与对齐

- **参考适配器**：新增 `apps/reference-react/docs-adapters/highlight.mjs`，只把匿名箭头示例命名为默认导出；示例本身与固定片段逐字一致（先用临时探针核对中英文 sourceString/searchWords 后确认无需改写）。
- **已知上游告警**：固定 Adapter 的 `searchWords` propTypes 仍声明为字符串数组，v2.71.0 起的对象数组写法（不同文本差异化样式示例）会在参考侧触发 `Failed prop type`。矩阵只按精确匹配豁免这一条上游告警，其余 console error 仍使用例失败；Vue 侧按公开类型同时支持两种写法，不产生告警。
- **逐片段裁剪改为固定裁剪区域**：不同宿主对同一小数像素矩形取整不一致会让元素截图出现 1px 尺寸差，改为按参考元素包围盒计算固定 clip 并对两侧使用同一区域，尺寸一致后才比较像素。
- 组件、主题与文档正文未修改。

## 限定等价项

- 中英文高亮片段数量不同（英文 Style 片段只有一段 Highlight），矩阵以参考页实际渲染数量为准，再要求 Vue 侧数量一致，避免写死语言相关常量。
- 数字内联样式（borderRadius/margin/padding 等）在 React 侧渲染为 px，Vue 示例按迁移表使用带单位字符串，计算样式一致。

除上述来源明确的等价项外，没有放宽裁剪、容差或门槛，也没有其它未解释差异。

## 交互覆盖

- 4 个示例都是纯展示型文本高亮，没有文档化交互；矩阵逐节点比较结构、文本、计算样式与几何，并对每个高亮片段单独比较像素。
- 双语 light/LTR 另执行源码展开/收起、重置与在线编辑 iframe 内的实际渲染与退出恢复，覆盖示例的加载与重挂载路径。

## 章节/API/迁移审阅

双语保留固定上游章节与顺序（代码演示/如何引入、基本用法、指定高亮样式、不同文本使用差异化样式、指定高亮标签、API 参考），另补设计变量说明、Accessibility/FAQ 与 React→Vue 迁移表。API 以真实公开 Vue 类型为准：`sourceString`、`searchWords`（字符串数组或 v2.71.0 对象数组，支持 `text`/`style`/`className`）、`highlightClassName`、`highlightStyle`、`component`、`autoEscape`、`caseSensitive`，默认高亮标签为 `mark`，命中片段带 `semi-highlight-tag` 类。

正式状态以 evidence/highlight.json 的完整矩阵与输入指纹为准，诊断不计入 accepted。
