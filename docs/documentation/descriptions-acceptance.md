# Descriptions 文档验收

固定参考：只读 Semi v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。

8 项双语示例均覆盖 light/dark 与 LTR/RTL，共 64 项。选中范围为 `[class*="semi-"], table, tr, th, td, svg path, br`，因此组件节点、表格结构、单元格几何与图标路径都在比较内。逐节点比较 class、属性、文本、关键计算样式（盒模型、表格布局、字体、颜色、边框、阴影）与几何（各轴 ≤0.5px）；整体截图 threshold=0.1、maxDiffPixelRatio=0.001，并对示例内每个 Descriptions 实例单独裁剪比较。

## 本批修复与对齐

- **英文示例数据按固定上游重写**：英文 Basic / Alignment / Items / DoubleRow 恢复 `Actual Users`、`7-day Rentention`、`Security Level/III`、`Category Tag/E-commerce`、`Authorized State/Unauthorized`；Horizontal 恢复固定英文片段的 `UID`、`Anchor Type`、`Classification/Tech News`、`Videos Count`、`Certification status` 与 column=4；KeyStyle 恢复 `John` / `john@example.com` / `Beijing`，ItemKeyStyle 恢复 `Job` / `Frontend Engineer`。
- **DoubleRow 容器样式**：中文与英文示例都去掉迁移时多加的 `maxWidth: '100%'`，与固定片段的 `width: 600px` 容器逐字一致。
- **英文 Vertical 示例**：固定英文页只有横向布局片段，没有纵向 live 示例。英文页补充的纵向示例改为复用同一份英文数据、仅把 `layout` 切为 `vertical`（`column` 仅影响横向分组），正文同步说明；参考侧由 `descriptions-vertical` 适配器读取同一固定片段并把 layout 改写为 vertical，避免新建第二份数据。
- **参考适配器**：`apps/reference-react/docs-adapters/descriptions.mjs` 只把匿名箭头示例命名为默认导出；`descriptions-vertical.mjs` 只在英文纵向示例上叠加一次 layout 改写。中文示例与固定上游逐字一致，未做修改（除 DoubleRow 的容器样式）。

## 限定等价项

- 矩阵按语言分别使用固定页的片段序号：中文顺序为 Basic/Alignment/Items/Vertical/Horizontal/DoubleRow/KeyStyle/ItemKeyStyle，英文固定页顺序为 Basic/Alignment/Row Display/Descriptions Using JSX/Set layout mode/Custom Key Style ×2，英文页的纵向示例因此复用横向片段序号。
- 英文页补充的 Vertical 示例没有固定英文 live 片段，其对照来自同一固定片段的 layout 改写，作为已发布英文示例的等价渲染处理。
- 固定片段中的数字内联样式（如 `width: 100`）在 React 侧渲染为 `100px`，Vue 示例按迁移表使用 `100px` 字符串，计算样式一致。

除上述来源明确的等价项外，没有放宽裁剪、容差或门槛，也没有其它未解释差异。

## 交互覆盖

- 本批 8 个示例都是纯展示型描述列表，没有文档化的交互状态；矩阵逐节点比较结构、文本、计算样式与几何，并对每个 Descriptions 实例单独裁剪比较（Alignment 4 个、DoubleRow 3 个、其余 1 个）。
- 双语 light/LTR 另执行源码展开/收起、重置与在线编辑 iframe 内的实际渲染与退出恢复，覆盖示例的加载与重挂载路径。

## 章节/API/迁移审阅

双语保留固定上游章节与顺序（代码演示/如何引入、基本用法、设置对齐方式、模板/JSX 写法、设置布局模式、双行显示、自定义 Key 样式、API 参考、文案规范、设计变量），另补 Accessibility/FAQ 与 React→Vue 迁移表。API 以真实公开 Vue 类型为准：`align` 默认 center、`row` false、`size` medium、`layout` vertical、`column` 3；DataItem 支持 `key`/`value`/`hidden`/`span`/`keyStyle`，DescriptionsItem 支持 `itemKey`/`hidden`/`className`/`style`/`span`/`keyStyle`；JSX children 映射为 DescriptionsItem 默认插槽，`data` 中的 render function 用 Vue `h()` 表达，数字内联样式改用带单位 CSS 字符串。

正式状态以 evidence/descriptions.json 的完整矩阵与输入指纹为准，诊断不计入 accepted。
