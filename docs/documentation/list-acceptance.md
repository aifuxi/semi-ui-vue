# List 文档验收

固定参考：只读 Semi v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。

本批覆盖 11 项双语示例（Basic、Template、Layout、Grid、Responsive、LoadMore、Pagination、Filter、AddRemove、Selection、Keyboard），每项都覆盖 light/dark 与 LTR/RTL，共 88 项。选中范围为 `[class*="semi-"], input, button, svg path, br, p, span`，因此组件节点、原生控件/输入值、图标路径、列表与段落结构、文案都在比较内。逐节点比较 class、属性（含 role/aria-*）、文本、`input` 的 value 与 checked、关键计算样式（盒模型、定位、字体、颜色、背景、flex、过渡相关）与几何（各轴 ≤0.5px）；整体截图 threshold=0.1、maxDiffPixelRatio=0.001。

## 本批范围与排除项

- ScrollLoad（7）依赖 `react-infinite-scroller`、Virtualized（8）依赖 `react-virtualized`、DragSort（9）依赖 `dnd-kit`。参考壳未内置这三个库，且任一新增依赖都会改写 `pnpm-lock.yaml`——lockfile 是所有批次的输入，会让已验收的 31 批证据全部失效；Virtualized 的 `AutoSizer` 在参考壳中还无法测量宽度，固定站渲染为空框。三项按 `batches/list.json` 的 `excludedExamples` 记录后排除，保留在验收队列中，不计入本批 `accepted`。
- 这三项的 Vue 示例本身已按补齐线交付并通过基础运行检查；本批不修改它们，也不为通过验收而在参考侧安装依赖或放宽比较范围。

## 本批修复与对齐

- **英文示例按固定片段重写**：Basic 的三段说明与 `<br />` 结构、LoadMore 的 `Load More`、Filter 的 `search` 占位符、Selection 的多选初值、Keyboard 的高亮类名 `component-list-demo-booklist-active-item` 均恢复上游写法。
- **书单容器结构**：AddRemove、Filter、Keyboard 的 `.book-list` 补回固定片段的外边框，List 自身改回 `border-bottom`；AddRemove 的删除按钮去掉迁移时新增的 `aria-label`，底部「新增书籍」从迁移版的 `#footer` 按钮恢复为固定上游的 `onClick` 容器 + 无文案按钮。
- **添加删除项行为**：新增操作改回固定上游的 `data.slice(list.length, list.length + 1)`，即按当前长度取下一项；因此「删除后再新增」会与上游一致地出现一条重复书名。迁移版曾用 `find` 规避重复，但那会与固定片段渲染出不同数据。
- **响应键盘事件**：按固定上游在 `window` 上监听上下方向键并循环高亮，去掉迁移时额外添加的可聚焦容器（`tabindex`/`role="group"`/`aria-label`）与容器内的 `@keydown`。页面正文同步描述该行为，并提示接入业务时自行限定监听范围。
- **参考适配器**：新增 `apps/reference-react/docs-adapters/list.mjs`，直接编译固定 Markdown，补上固定片段漏写的 React hooks 导入，并把英文 Basic 片段中误留的中文段落替换为固定英文文案。
- 组件、主题与共享参考壳未修改；本批不新增依赖。

## 限定等价项

- `CheckboxGroup`/`RadioGroup` 用 `cloneElement` 给子节点传 `role="listitem"`：固定 React List 丢弃该未知 prop，Vue List 按原生 attrs 透传到根节点，只有该值被忽略。
- `aria-disabled`/`aria-invalid`/`aria-required` 的 ARIA 1.2 默认值为 false，显式 `"false"` 与省略等价。
- React `getUuidShort` 与 Vue `useId` 生成实例 id：把根内每个 `id` 及其引用（`for`/`aria-labelledby`/`aria-describedby`/`aria-controls`/`aria-owns`/`aria-activedescendant`，以及属性与计算样式里的 `url(#…)`）按定义位置归一，缺失、重复或重排仍会失败。
- Vue SFC scoped 样式会在模板元素上留下 `data-v-*`，不参与属性比较；其启用的样式仍按计算值比较。
- 带筛选器的固定片段只在 `compositionEnd` 或清空时筛选，Vue 示例按 `v-model` + `computed` 响应完整输入值（迁移改进，页面正文已说明）。矩阵按 `compositionstart` → 填值 → `compositionend` 驱动固定片段的真实路径，两侧都走该路径后再比较。

除上述来源明确的等价项与排除项外，没有放宽裁剪、容差或门槛，也没有其它未解释差异。

## 交互覆盖

- LoadMore：点击「显示更多 / Load More」后断言行数增加 3 并比较加载态。
- Pagination：点击 `.semi-page-next` 翻页，断言首条文本变化后比较第二页。
- Filter：`compositionstart` → 填值 → `compositionend`，断言只剩 1 条并比较筛选态。
- AddRemove：删除首行后断言行数减 1，再点「新增书籍 / Add book」断言行数恢复并比较（覆盖上游按长度追加的数据路径）。
- Selection：勾选第二个多选项后断言 `input[type="checkbox"]` 已选中并比较多选态。
- Keyboard：在 window 上按 `ArrowDown` 后断言高亮项恰好 1 个并比较高亮态。
- 双语 light/LTR 另执行源码展开/收起、重置与在线编辑 iframe 内的实际渲染与退出恢复。

## 章节/API/迁移审阅

双语保留固定上游章节与顺序（代码演示/如何引入、11 个演示、API 参考、文案规范、设计变量），另补 Accessibility、FAQ 与 React→Vue 迁移表。API 以真实公开 Vue 类型与固定 Adapter 为准：List 的 `dataSource`/`renderItem`/`emptyContent`/`header`/`footer`/`loadMore`/`loading`/`split`/`size`/`layout`/`grid`/`bordered` 与 `@click`/`@right-click`；List grid props 的 `span`/`gutter`/`xs`…`xxl`；List.Item 的 `align` 默认 `flex-start`、`header`/`main`/`extra` 与鼠标事件。迁移表覆盖 `children`→默认插槽、`renderItem`→`#item` 作用域插槽、`List.Item`→`ListItem`、`onClick`/`onRightClick`/`onMouseEnter`/`onMouseLeave`→对应 Vue 事件、`className`→`class`（兼容 `className`）。审阅明细与指纹见 `mappings/list.json` 的 `review`。

正式状态以 `evidence/list.json` 的完整矩阵与输入指纹为准，诊断不计入 `accepted`；List 文档在剩余 3 项动态示例补齐验收前保持 `in-progress`。
