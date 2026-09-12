# Collapsible 文档验收

固定参考：只读 Semi v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。

4 项双语示例均覆盖 light/dark 与 LTR/RTL，共 32 项。选中范围为 `[class*="semi-"], input, svg path, br, p, ul, li, a`，因此组件节点、原生控件、列表/段落结构、`+ Show More` 锚点与图标路径都在比较内。逐节点比较 class、属性（含 role/aria-*/tabindex/step）、文本、`input` 值、关键计算样式（盒模型、定位、字体、颜色、过渡、mask）与几何（各轴 ≤0.5px）；整体截图 threshold=0.1、maxDiffPixelRatio=0.001，面板可见时另做局部裁剪比较。

## 本批修复与对齐

- **示例**：4 个示例按固定上游逐字恢复，去掉迁移时额外附加的可访问性关联与结构差异。
  - 基本用法、嵌套使用、自定义折叠高度：去掉按钮上的 `aria-expanded`/`aria-controls` 与 Collapsible 的 `id`；固定 live 示例未使用它们，`id` + `aria-controls` 的模式仍由 Accessibility/ARIA 章节的独立示例记录。
  - 自定义动画时间：标签按固定上游使用 `label`，英文恢复全角冒号 `Set animation duration：`。
  - 嵌套使用：中文说明按固定上游恢复为 `Semi Design的设计原则包括：`。
  - 自定义折叠高度：`+ Show More` 恢复固定上游的内联样式锚点（含 `bottom: -10px`、`fontWeight: 700` 等），去掉上游没有的 `<br />` 与迁移时新增的 scoped 样式块。
- **参考适配器**：新增 `apps/reference-react/docs-adapters/collapsible.mjs`。固定「嵌套使用」片段使用了 `useState` 却只 `import React from 'react'`，适配器补上命名导入，其余只把匿名箭头示例命名为默认导出。
- 组件、主题与文档正文未修改。

## 限定等价项

- `aria-disabled`/`aria-invalid`/`aria-required` 的 ARIA 1.2 默认值为 false，显式 `"false"` 与省略等价。本批只有内嵌 InputNumber 显式输出这三者，其自身批次仍会审阅该形式。
- 展开/收起统一等待过渡终态（`semi-collapsible-transition` 消失且各面板高度稳定）后再比较，不比较中间帧；完全收起的面板没有可截取区域，此时只做整例截图比较。

除上述来源明确的等价项外，没有放宽裁剪、容差或门槛，也没有其它未解释差异。

## 交互覆盖

- Basic：点击 Toggle 展开，断言面板高度从 0 变为非 0 并比较展开态；再次点击收回，比较收起态。
- Duration：断言输入框初值 250，改为 500 并回车提交后断言两侧输入值一致，再展开比较（覆盖 duration 由 InputNumber 驱动的路径）。
- Nested：先展开父面板（此时子面板才挂载，包裹节点由 1 个变为 2 个），再展开子面板，断言父子高度均大于 0 后比较。
- CollapseHeight：初始折叠高度约 60px 且 `+ Show More` 可见；点击后链接消失、高度大于初始值，再比较展开态。
- 双语 light/LTR 另执行源码展开/收起、重置与在线编辑 iframe 内的实际渲染与退出恢复。

## 章节/API/迁移审阅

双语保留固定上游章节与顺序（使用场景、代码演示/如何引入、4 个演示、API 参考、Accessibility/ARIA、FAQ），另补设计变量说明与 React→Vue 迁移表。API 以固定 Adapter 源码为准：`collapseHeight` 默认 0、`duration` 默认 250、`fade`/`isOpen`/`keepDOM`/`lazyRender` 默认 false、`motion` 默认 true、`collapseHeightAdaptive` 默认 false，`reCalcKey` 为 number|string，`id` 传递给 wrapper；`children` 映射默认插槽，`onMotionEnd` 映射 `@motion-end`。文档明确 Collapsible 不提供 v-model 与内置开关，动画与高度测量只在客户端进行。

正式状态以 evidence/collapsible.json 的完整矩阵与输入指纹为准，诊断不计入 accepted。
