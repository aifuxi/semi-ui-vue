# Resizable 文档批次验收

固定基线为 Semi Design v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。

14 项示例覆盖双语、明暗与 LTR/RTL，共 112 项正式矩阵。关键 computed style 精确相等，各轴几何误差不超过 0.5 CSS px，截图 threshold=0.1、maxDiffPixelRatio=0.001，不 mask。比较预览内全部 div、控件、文本容器与图标，包括手柄、拖动背景、尺寸、约束、光标、缩放和旋转。React 容器同步真实 Vue 预览的宽度、padding、overflow、位置与页面滚动；保留上游 1000px 嵌套布局及文档的实际溢出裁剪。

单体示例真实鼠标伸缩并回程，断言尺寸实际变化。Basic 验证拖动文字、开始/结束反馈与背景移除；Direction 连续开启、Space 关闭并核对真实焦点、重新开启左手柄；Ratio、两项 AspectRatio、Scale、父元素 Bounds、Limits 上下限、Handle 自定义图标和 Grid 阶段变化均对照。Scale 只有约 10px 可见高度，角手柄覆盖侧手柄中点，故明确抓取右下角验证缩放坐标。Controlled 验证拖动后 Enter 触发按钮继续增加尺寸，再从角部拖动。

Group 操作全部三个手柄，验证固定/百分比/权重布局和约束后的回程。Nested 同时操作外层纵向与内层横向；ComplexNested 覆盖上下横向、深层纵向和最大尺寸、外层纵向。DynamicDirection 先操作内外横向手柄，再切到纵向、拖动、恢复横向并继续拖动。每一步均比较拖动中和释放后状态；有可见回调的路径断言 resizing 文案。

Basic 和 Nested 的短时 Toast 使用不加载编辑器的独立 context。Playwright 时钟在 context 内共享，双侧完成操作后仅推进一次 300ms；按固定 Toast 进入与堆叠 300ms 动效采样。逐条验证开始/结束两条堆叠 Toast 的文本、样式、几何与紧裁剪像素，推进原有业务定时器并等待实际卸载，再次触发完整流程。没有延长 duration、关闭 motion 或将模拟时钟带入 Monaco。

双语亮色 LTR 全部验证源码、重置、编辑器首帧、退出及再次打开。Basic 实际修改提示文字并运行；DynamicDirection 修改其响应式文本并运行，随后重置恢复。编辑器使用真实时钟。手柄按上游保留指针语义，不虚构键盘缩放支持；Switch 和 Button 沿用组件公开语义。

React 参考直接编译固定双语 Markdown，仅补遗漏 Toast/Button 导入、已有固定 Resizable 命名导出入口及 IconTransfer → IconHandle。固定 Foundation 将标量 grid 转成双轴元组，而 React PropTypes 只声明数组；参考使用等价 [100,100] 避免原示例警告，Vue 保留 100。英文 Grid 源码原本已有完整闭合标签，不作修补。该家族和示例 Toast 不消费需要额外注入的语言表。

章节、公开类型、事件、插槽和迁移表依据固定 Adapter/Foundation 与 Vue 类型审阅。补齐 snap.x/y 类型，修正英文 @change，区分 ResizeItem 百分比/px 固定尺寸与数字权重。取消开始通过 beforeResizeStart 函数 prop；ResizeItem 无受控 size。文档预览为 ClientOnly，不充当组件 SSR/hydration 验收。本批无组件运行时或公开包产物变更。
