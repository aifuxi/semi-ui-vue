# Collapse 文档验收

固定参考：只读 Semi v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。

6 项双语示例均覆盖 light/dark 与 LTR/RTL，共 48 项。选中范围为 `[class*="semi-"], input, svg path, br, p`，因此组件节点、图标路径、正文段落与原生控件都在比较内。逐节点比较 class、属性（含 role/aria-*/tabindex）、文本、关键计算样式（盒模型、flex、定位、字体、颜色、边框、过渡）与几何（各轴 ≤0.5px）；整体截图 threshold=0.1、maxDiffPixelRatio=0.001，并对示例内每个面板单独裁剪比较。

## 本批修复与对齐

- **组件**：`packages/ui/src/collapse/CollapsePanel.vue` 的 `aria-owns` 改为跟随 Collapse 共享展开集传播。固定 Adapter 在 `componentDidMount` 赋值面板 id 且不触发渲染，因此首屏所有面板 `aria-owns=""`；React 在展开集变化时会重渲染全部 context 消费者，所有面板从那次渲染起都输出各自 id。Vue 此前只有自身重渲染过的面板才拿到 id（点开一个面板后，另外两个仍为 `aria-owns=""`），现按同一时机传播；默认态仍保持空值。契约同步记录在 `docs/components/collapse/alignment.md`。
- **参考适配器**：新增 `apps/reference-react/docs-adapters/collapse.mjs`。固定英文「基本用法」示例把 `itemKey` 误写为 `ItemKey`，适配器按真实公开 prop 名修正（否则该面板拿不到 key，三面板 DOM 与 ARIA 均不同）；固定 extra 示例把 Tag 文案写成三段 child（`{' '}Recommended{' '}`），React 侧因此是数组子节点、固定 Tag 输出 `aria-label=""`，而 Vue 模板插值只能产生单个文本节点，适配器改用等价的 `{' Recommended '}` 单字符串子节点，使两侧文本与 `aria-label` 一致。
- 示例与文档正文未修改，章节、API 与迁移表按固定上游核对。

## 限定等价项

- 生成标识：面板短 id 由固定 `getUuidShort` / 本地 `createCollapsePanelId` 生成，按根内 `[id]` 与 `aria-owns`/`aria-controls`/`aria-labelledby`/`aria-describedby`/`for` 的首次出现顺序归一为 `id-N`；折叠面板引用的内容节点此时未挂载，引用本身也参与登记，缺项、重复或改序仍会失败。

除上述来源明确的等价项外，没有放宽裁剪、容差或门槛，也没有其它未解释差异。

## 交互覆盖

- Basic / HideIcon / CustomIcon / Extra：点击首个面板标题展开，断言 `semi-collapse-item-active`、`aria-expanded="true"` 与展开后截图；HideIcon 另有「首面板不渲染箭头图标」的显式断言，CustomIcon 覆盖 IconPlus/IconMinus 切换，Extra 覆盖 `extra` 字符串、图标与 Tag 三种形式。
- Accordion：连续点击两个面板，断言始终只有一个面板展开且为后点击者。
- Disabled：对 `aria-disabled="true"` 的标题派发真实点击事件，断言面板不展开；随后点击第二个面板正常展开。
- 展开/收起交互统一等待过渡终态（`semi-collapsible-transition` 消失且高度稳定）后再比较，不比较中间帧。
- 双语 light/LTR 另执行源码展开/收起、重置与在线编辑 iframe 内的实际渲染与退出恢复。

## 章节/API/迁移审阅

双语保留固定上游章节与顺序（代码演示 / Demos、如何引入、6 个演示、API 参考、Collapse、Collapse.Panel、Accessibility/ARIA、文案规范、设计变量、FAQ），另补 React→Vue 迁移表。API 以固定 Adapter 源码为准：`defaultActiveKey` 为 `''`、`clickHeaderToExpand` 默认 true、`expandIconPosition` 默认 `right`、`lazyRender` 默认 false；`expandIcon` 缺省为 IconChevronDown、`collapseIcon` 缺省为 IconChevronUp（固定上游表格中两者颠倒，已在文档与映射说明中修正）。`Collapse.Panel` 映射为 `CollapsePanel` 并保留复合入口，`onChange`/`onMotionEnd` 映射为 `@change`/`@motion-end`，并补充 `v-model:activeKey`；插槽为 default、expandIcon、collapseIcon 与面板的 default、header、extra。

正式状态以 evidence/collapse.json 的完整矩阵与输入指纹为准，诊断不计入 accepted。
