# Accessibility 文档批次验收

固定基线 v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。ImageAlt 一例，双语 × 明暗 × LTR/RTL，共 8 项正式组合。

## 参考与范围

直接编译固定 Markdown 的 Avatar 示例；双方采用现有映射声明的 `/demos/photo.svg` 本地图像。该资源替换保留图像与 alt 的演示意图，不声明与远程人物图片像素相同。Avatar 组件结构、样式、几何与完整局部图像在同一资源下严格对照，不 mask；几何 ≤0.5px，像素 threshold=0.1 / maxDiffPixelRatio=0.001。

验证图像真实解码、Person Name 可访问名称、浏览器可访问树一致、无多余按钮及正反向 Tab 跳过非交互头像。双语 light/LTR 验证源码一致、重置、在线编辑中的图片实际解码，以及退出清理。此例不包含点击或浮层功能，不扩展为完整 Avatar 组件验收。

## 章节和迁移审阅

审阅固定双语指南、现有本地内容、Avatar alt/src/style 与 Vue 类型及非交互分支。指南没有独立组件 API，保留同名 props 及 Vue style 映射。已有 DSM 专用主题、正文 ImageBox 的语义 HTML 替换及 WCAG 单位/例外校正保持映射中的明确边界。正文主题建议和对比度说明不等同于整站 WCAG 合规认证。

正式结果以自动生成的 evidence/accessibility.json 和压缩报告为准；诊断不增加 accepted。
