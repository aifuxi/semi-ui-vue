# Banner 文档批次验收

固定基线 v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。Basic、Types、Container、Custom 四例，双语 × 明暗 × LTR/RTL，共 32 项正式组合。

## 参考与范围

直接编译固定 Markdown 的四例，通过匿名函数入口命名接入参考页。布局装饰和非全屏边框使用参考站已加载的固定 docDemo.scss 产物；保留中文 Basic 的显式高度和英文无高度的原始差异，不复制 React 运行时代码。

逐节点检查文本、结构、语义、图标路径、计算样式和相对几何，额外检查布局伪元素。完整预览与各 Banner 局部截图使用既有门槛：几何 ≤0.5px，像素 threshold=0.1 / maxDiffPixelRatio=0.001，无 mask。

Basic 覆盖显示、父级隐藏、关闭回调使按钮恢复、再次挂载，以及 Tab/Enter/Space；Types 逐个关闭四种状态并验证余下内容不变；Container 验证无状态图标、无关闭按钮、四个链接目标与键盘焦点/hover；Custom 检查两个原生示例按钮无业务副作用及关闭。双语 light/LTR 验证源码、重置、在线编辑中的真实操作及退出清理。RTL 验证根方向与 semi-rtl 布局，不另行更改 Provider。

## 章节和迁移审阅

核对固定双语章节、API 表、无障碍和文案指南，以及本地 BannerProps/Emits/Slots 和关闭实现。保留英文 type 默认值由原文 default 校正为实际 info；React 节点映射为 props/slots，onClose 映射 @close，重新显示通过父级 v-if 挂载。Custom 的数值宽度和内边距转换为 Vue CSS 单位字符串。

正式结果以自动生成的 evidence/banner.json 和压缩报告为准；诊断不增加 accepted。
