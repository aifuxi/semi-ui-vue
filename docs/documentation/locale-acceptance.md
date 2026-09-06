# Locale 文档严格验收

固定 v2.102.0 的三个 live 示例逐项映射，双语、light/dark，Components 增加 ar RTL，共 16 个组合。Provider 无 DOM；Custom 比较全部六行。Internationalization 检查独立分页和页大小。Components 按每个消费者裁剪，验证语言切换、RTL、Modal、分页及编辑器多文件初始状态。

每个节点关键 computed style 精确相等，rect 各轴 ≤ 0.5 CSS px；图片 threshold 0.1、maxDiffPixelRatio 0.001，不使用 mask。固定同一 Chromium、字体、时间、viewport 1440×900、DPR1。媒体和导航品牌两端执行相同显式适配，记录许可清单。

中文选项 57、英文 54，与各自固定源一致；React live evaluator 的隐式 hooks/render 仅在参考 ESM 入口补齐绑定。全部组合无重试/跳过通过后才能生成验收证据。

## 交互与证据

综合示例逐项比较完整语言菜单，切换日语后核验所有消费者的结构、文本、样式和几何；分页重置为 1，分页/空表/List/Transfer/Typography 分别裁剪。额外验证文本展开收起、Modal 的日语文案/ARIA/位置/截图及关闭、复制 Tooltip 的结构与完整箭头截图。亮色编辑器比较初始消费者文本和数量，覆盖多文件入口。

结果以 [机器证据](evidence/locale.json) 及其源指纹和原始报告为准，不能用历史截图或组件 ready 状态替代。早期失败、修复与最终执行记录见 [工作记录](../../ai-work/20260906-150000-locale-documentation.md)。
