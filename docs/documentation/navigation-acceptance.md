# Navigation 文档验收

固定 v2.102.0：中文 10 个 live 示例映射到英文对应章节；英文独有 Plain / HeaderFooter 在 Basic 用例中独立运行。英文 Combined 保留其横向加纵向菜单，中文 Combined 保留 Layout 组合；不把不同上游内容改成同一个示例。

- 桌面 1440×900、DPR1，双语 light/dark；Horizontal、TogglePosition、Indentation 另加 RTL。
- 默认结构、文本、ARIA、关键 computed style 精确相等；相对/截图几何每轴差不超过 0.5px。
- 独立 Navigation 裁剪与 Portal 菜单裁剪，threshold=0.1、maxDiffPixelRatio=0.001，无遮罩。
- Enter 选择与焦点、内联子菜单切换、默认折叠展开、折叠/恢复、滚动列表头尾固定、水平 Portal 的 ArrowDown/Escape 与嵌套 Portal 的 hover 展开。纯 focus 且指针不在 trigger 上时，按固定 Tooltip.portalInserted 行为再次关闭；先结束父层动效再打开嵌套层，避免测量动画中间帧。
- 每个例子的可见源码等于 SFC；Combined 的多文件依赖随内容检查验证，并在双语 light 场景打开在线编辑器验证编译、折叠与关闭。中文组合布局额外独立裁剪面包屑、骨架及页脚。
- React 编译只修复固定原文缺少 useState import、重复 import、缺少 super 的运行前提；品牌与 Logo 在两端对称替换。LocaleProvider 复现固定站点语言。

完整正式矩阵通过前不写 accepted。当前批次没有接受视觉/行为差异。
