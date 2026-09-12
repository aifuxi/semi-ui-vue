# Badge 文档验收

固定参考：只读 Semi v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。

6 项双语示例均覆盖 light/dark 与 LTR/RTL，共 48 项。逐节点比较公开 class、文本、内联 `style`、图标 SVG 属性与关键计算样式（含 direction、overflow、flex、白空格与盒模型）及几何（各轴 ≤0.5px），整体截图 threshold=0.1、maxDiffPixelRatio=0.001，并对每个 `.semi-badge` 单独裁剪比较，避免示例行间空白稀释缺陷。测量选择器额外包含 `span`，覆盖独立使用示例中位于 `.semi-badge` 之外的状态标签文本。

Badge 无 Locale 文案、Portal、Observer 与动效；交互矩阵覆盖示例中真实存在的可观察路径：源码展开/收起、重置与在线编辑 iframe 的挂载、渲染与退出。

## 参考适配器适配

固定 Markdown 直接编译，不复制上游实现：

- 固定六例均为匿名箭头片段，适配器只把首个 `() =>` 命名为默认导出，不改写固定实现、props 或文案。

## 章节/API/迁移审阅

双语保留固定上游章节与顺序（中文 10 个、英文 10 个），另补 Accessibility/FAQ 与 React→Vue 迁移表。API 以真实公开类型为准：`count` 为 `VNodeChild` 且另有 `#count` 插槽，`dot` 优先且内部无内容，`overflowCount` 仅作用于数字，`position` 缺省由 Provider 方向决定（LTR `rightTop`、RTL `leftTop`），`style` 为固定上游兼容语义（作用于徽标内容并优先于 `countStyle`），`theme`/`type` 取固定联合类型与缺省值，事件为原生 `MouseEvent`。

## 文案对齐

独立使用示例的状态标签按固定上游逐字恢复：中文页沿用上游双语标签（`进行中 processing`、`信息 info`、`成功 success`、`提醒 warning`、`错误 error`），英文页沿用上游小写字面（`processing`、`info`、`success`、`warning`、`error`）。迁移版本曾改写为单语与首字母大写，与固定站的逐字对照不符。

## 本批结论

本批未发现组件缺陷：唯一需要修正的是迁移时改写的状态标签文案，已按固定上游逐字恢复；矩阵据此一次通过，未放宽任何数值门槛，也没有新增限定差异。

正式状态以 evidence/badge.json 的完整矩阵与输入指纹为准，诊断不计入 accepted。
