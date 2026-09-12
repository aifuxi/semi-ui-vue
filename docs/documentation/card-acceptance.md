# Card 文档验收

固定参考：只读 Semi v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。

14 项双语示例均覆盖 light/dark 与 LTR/RTL，共 112 项。选中范围为 `[class*="semi-"], input, img, svg path, br`，因此组件节点、原生控件、封面与头像图片、图标路径都在比较内。逐节点比较 class、属性（含 role/aria-*、`input` 的 name/value 与 `x-semi-prop`）、文本、`checked` property、关键计算样式（盒模型、flex/grid、定位、字体、颜色、阴影、过渡）与几何（各轴 ≤0.5px）；整体截图 threshold=0.1、maxDiffPixelRatio=0.001，并对示例内每张卡片单独裁剪比较。

## 本批修复与对齐

- **示例**：英文「卡片组」的引导文案按固定上游恢复为 `Slide to adjust the card spacing`（迁移版本写成 `Slide to adjust Card spacing`）。中文示例逐字沿用固定上游，无需修改。
- **参考适配器**：新增 `apps/reference-react/docs-adapters/card.mjs`。固定 Markdown 的封面引用混用 `card-cover-docs-demo2.jpeg`（封面示例）与 `card-cover-docs-demo.jpeg`（更灵活的内容展示、预加载、操作区示例），两者都映射到本地 `poster.svg`；头像引用映射到本地 `photo.svg`。两侧因此加载同一份离线资源。
- **组件**：本批未修改 `packages/ui/src/card`，也未放宽任何断言；Card 的 DOM、样式与交互按固定 Adapter 逐节点一致。

## 限定等价项

- 生成标识：Tabs 在标题栏写入随机 `data-uuid`，按根内 `[data-uuid]` 定义顺序归一为 `uuid-N`；缺项、重复或改序仍会失败。
- Vue 3.5 的 `patchProp` 会把模板 `:checked` 绑定同时写入属性与 property，React 只写 property；矩阵删除该属性、改比较 `checked` property。
- `aria-disabled`/`aria-invalid`/`aria-required` 的 ARIA 1.2 默认值为 false，显式 `"false"` 与省略等价。本批只有内嵌 Rating 显式输出 `aria-disabled="false"`，其自身批次仍会审阅该形式。
- 图片 `src` 两侧来源不同（参考用绝对地址、文档站用站内路径），比较时归一为站内路径；资源缺失或换成其它文件仍会失败。

除上述来源明确的等价项外，没有放宽裁剪、容差或门槛，也没有其它未解释差异。

## 交互覆盖

- Loading / Skeleton：点击 Switch，断言开关进入 checked、内置 loading 占位（`.semi-card .semi-skeleton`）清零；Skeleton 示例同时断言真实头像出现。
- Tabs：点击「Tab 2」，断言激活面板切到 `content2`，并等待进入动效的起始类消失后再比较终态。
- Group：聚焦滑块按一次 `ArrowRight`，断言 `aria-valuenow` 由 12 变为 13 且相邻卡片间距增大，再失焦后比较（比较期间无浮层）。
- Shadows：hover 第一张卡片，等待过渡结束后比较 hover 终态阴影。
- 双语 light/LTR 另执行源码展开/收起、重置与在线编辑 iframe 内的实际渲染与退出恢复。

## 章节/API/迁移审阅

双语保留固定上游章节与顺序（中文 16 个演示/说明章节 + API 参考、Accessibility、文案规范、设计变量），另补 FAQ 与 React→Vue 迁移表；上游「相关物料」为外部营销平台，按映射记录排除。API 以固定 Adapter 源码为准：`bordered`、`headerLine` 默认 true，`footerLine`、`loading` 默认 false，`shadows` 为 `hover | always`；`title`/`cover`/`footer`/`header`/`headerExtraContent`/`actions` 保留 VNodeChild prop 并新增同名插槽（插槽优先），`Card.Meta` 映射为 `CardMeta` 且保留 `Card.Meta` 组合成员。CardGroup 的 `spacing` 运行时默认值为 16，固定上游文档表格写 `12px`，本文与组件契约均以 Adapter 源码为准；`type="grid"` 时 spacing 强制为 0。

正式状态以 evidence/card.json 的完整矩阵与输入指纹为准，诊断不计入 accepted。
