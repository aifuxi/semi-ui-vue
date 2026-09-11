# Typography 文档批次验收

基线：Semi Design v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。

用户已确认保留 Vue 的三行布局。正式矩阵按下述限定差异验收；完整结果以自动生成的 evidence/typography.json 为准。

## 范围与契约

十例：Title、Text、Link、Paragraph、Numeral、Parser、Size、Copyable、Ellipsis、TooltipWrapping。全部覆盖双语 × light/dark × LTR/RTL，共 80 项。

逐项核对标题层级、文本装饰/颜色、链接目标及 hover/active/焦点、段落行距、六组数字规则及 parser、尺寸继承、六组实际剪贴板复制和三秒复位、CSS/JS 省略、Tooltip/Popover、展开折叠与宽度重测。英文省略原有八组，中文九组；英文自定义浮层标题为 h6。

根与可见子节点 computed style 精确对照；各轴几何差 ≤0.5 CSS px。同一 Chromium context、固定本地 Inter、相同页面坐标；局部截图 threshold=0.1、maxDiffPixelRatio=0.001，不 mask 或放宽容差。RTL 通过固定 .semi-rtl 布局契约对照。

日期固定为 2024-08-15T10:24:30+08:00，计时器和编辑器保留真实时钟。复制检测真实 navigator.clipboard.readText；复制回调确认 Toast，并比较完整提示。浮层必须完成退出后重开，箭头包含在截图内。双语首主题 LTR 验证源码、重置、在线编辑首帧及退出清理。

## 参考环境与 Vue 映射

React 直接编译固定 Markdown，仅补上 live scope 提供但源码遗漏的 Toast/useCallback 导入、英文 LocaleProvider、第十例的后续 SCSS，以及文本示例的本地 Inconsolata 字体。没有复制维护 React 实现。

还原省略原文、语言差异和标题级别；移除额外展开状态 output。tooltip scoped slot 仅提供内容，opts 样式/类名作用于实际浮层。复制图标采用现有 VNode 配置，自定义 render 保留 span 与成功后再次复制。Numeral 使用固定默认 span；示例由 ClientOnly 挂载，不将此例的块级 children 声称为 SSR HTML 验收。粘贴区保留 Vue 的显式无障碍名称，Parser 外链保留 rel 安全属性。数字与尺寸嵌套处去掉模板换行引入的额外空格；英文 Parser 恢复固定原文的措辞和大小写。

## 文档与 API 审阅

审阅固定双语 Markdown、Typography Base/Copyable/Numeral 与 Foundation 数值/样式，以及 Vue 公开类型、双语内容、API 和迁移段落。完整正式验收及审阅指纹有效后才计入 accepted。

## 用户确认的限定基线差异

英文 Ellipsis 的可展开段落由 300px 加宽至 480px 后不再溢出，展开按钮卸载。恢复至 300px 时，固定 React 仅监听宽度，首次计算未预留尚未挂载的按钮，最终四行（80px）；Vue 的 ResizeObserver 会因高度变化再次计算，最终三行（60px）。用户于 2026-09-11 明确同意保留 Vue 的三行布局并记录差异，不修改运行时去复现这一排版缺陷。

例外仅限英文 Ellipsis 的 480px → 300px 恢复阶段，覆盖明暗及 LTR/RTL。测试精确验证 React 的四行、80px 和截断原文，Vue 的三行、60px 和初始截断原文；归档双方完整样式、几何及截图，并要求 Vue 恢复后的全部样式、几何和局部像素与其初始三行状态一致。其他状态仍执行原有 React/Vue 精确对照，中文恢复路径不豁免。此项属于用户明确接受的视觉/行为差异，不声称与固定 React 完全相同。

页面上方的省略示例异步计算会使下方预览位移。采样前等待三行布局和展开按钮就绪，再统一两侧坐标；宽度重测用双方相同的外部样式，避免直接 DOM style 被 VDOM 更新覆盖。SVG path 只归一化语法等价的空白，几何和像素门槛不变。

## 验证记录

前期定点诊断累计通过 76 个组合，并稳定复现上述英文恢复差异。用户确认取舍后运行英文 Ellipsis 的四个定点组合，再执行完整 80 项正式矩阵。正式结果由 runner 归档，不以分次诊断替代。组件运行时未改动。

诊断期间一次机器睡眠导致超时；系统记录为 19:25:35 至 19:42:44，持续 1029 秒。恢复后重新诊断，无 retries。
