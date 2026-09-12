---
'@aifuxi/semi-ui-vue': patch
---

修复 Image 预览页码的文本节点渲染，使底栏宽度与固定 Semi 基线一致。
为 ImagePreview 分组恢复稳定的实例 ID。

修复 Modal 自定义渲染边界，使 modalRender 仅包装对话框内容，并正确保留外层布局与拖拽行为。
恢复静态 Modal 自定义 Semi 图标的尺寸和状态样式。

修复 Tooltip/Popover 初始焦点引用，优先调用组件公开的 focus 方法。
