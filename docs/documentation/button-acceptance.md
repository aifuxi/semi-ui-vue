# Button 文档验收矩阵

基线：`v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。

## 范围

17 个索引按 `batches/button.json` 关联两种语言原始示例和 Vue SFC。所有示例执行 zh-CN/en-US × light/dark，1440×900、DPR1、固定 Chromium 同一 context；参考根节点与 Vue 场景使用相同的实际屏幕坐标，避免 SVG 在不同坐标下的栅格化差异；对比目标为 Demo 内容和独立裁剪的 Dropdown 菜单，不包括站点壳。图标、三种 ButtonGroup 示例增加 RTL 容器对照，共 84 条用例；每条内部按可用控件验证状态。

每条核对页面展示源码与对应 SFC 文件逐字一致；light/LTR 的 34 个双语场景还打开在线编辑，核对预览初始内容、编译错误与关闭后的 iframe 清理。编辑初始文件由 DemoBlock 的同一源码映射传入 REPL，不维护第二份示例副本。

- 1–9：类型、Token 字体色、四主题、尺寸、block、图标；默认样式/几何/截图，所有可用按钮 hover/active/focus-visible，disabled 原生语义。
- 10：Typography 链接文本、下划线、图标；保留 Vue 文档本地导航替代上游官网链接。
- 11、15：disabled 与 aria-disabled 一致，不触发 click。
- 加载样式以固定动画时刻比较；时间从固定日期起正常推进，避免干扰 Vue 的事件时间戳。
- 12：初始 2 个 loading，关闭变为 0，开启变为 3，保存变为 1；Enter/Space 激活；旋转固定在 150ms。
- 13：Colorful 全部组合、禁用与加载图标；默认态与按钮状态，空内容图标按钮提供可访问名称。
- 14、16：组尺寸/类型及分隔线；原生 Tab/Shift+Tab 顺序。
- 17：三种主题分裂按钮；展开菜单及外部点击关闭恢复，独立菜单视觉。菜单圆角会露出下方文档，成对场景使用相同、无指针交互的背景层（位于 Portal 下方），避免无关正文影响透明边缘；没有 mask。

API/DOM/SSR 总契约沿用 `docs/components/button/alignment.md`；此矩阵只新增文档示例证据，不凭文档加载结果重新认定组件发布验收。

## 有依据的适配

- 中英文分别读取上游对应 Markdown，不假设两端文案、布局、图标尺寸与菜单相同。英文 Disabled Status 标题的示例本身没有 disabled 属性，保留该源码行为；disabled 专项由索引 11/15 覆盖。
- 两种语言 Split 的 `handleVisibleChange` 均给未声明的 `newBtnVisible` 赋值。参考构建器只为该赋值补 `const`，以适配 ESM 的严格模式；不修改 vendor、不改变菜单状态转换。Vue 使用局部 reactive 状态。
- Vue 为纯图标 Colorful 和 Split 按钮补 aria-label；不删除这些无视觉影响的可访问性信息以模仿上游缺漏。
- Links 的前两项改为本站接入页，避免 Demo 主动访问第三方；第三项保留上游无 href 的 link 样式。文字和视觉仍逐项对照。
- 固定站点声明远程 `Inter-Bold`，submodule 仅含 Regular/SemiBold。Button 组件目标使用 Inter（400/600 及 strong 的合成粗体），不使用 Inter-Bold 字体族；站点壳 Bold 替代问题保留为收尾阻塞，不能从 Button 验收外推站点字体已完全对齐。

## 完成依据

只认 `evidence/button.json` 及其压缩 Playwright 报告；源码指纹、报告哈希或完整矩阵验证失败时回到待验收。没有这些有效证据时，本文件仅为验收要求，不是通过声明。
