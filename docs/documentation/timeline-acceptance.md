# Timeline 文档验收

固定参考：只读 Semi v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。

8 项中英文示例覆盖 light/dark 与 LTR/RTL，共 64 项。比较全部 `.semi-*` 节点、自定义 span、SVG 及 path 的 class、属性、文本、关键 computed style 与各轴几何（≤0.5 CSS px）；整个示例局部截图沿用 threshold=0.1、maxDiffPixelRatio=0.001。时间轴节点、辅助说明、日期、自定义图标、粉色圆点与 18px 文案均在裁剪范围内。

## 参考与覆盖

参考适配器仅把上游匿名箭头命名并默认导出，以独立 ESM 加载原始片段；不替换功能或改写样式。每项先等待参考 Timeline 实际渲染，再打开 Vue 页面。节点数量（前两例 3 个，其余 4 个）、各模式的位置类与 dot/tail 的 `aria-hidden=true` 均有独立断言。

固定 8 项均无业务交互控件。双语 light/LTR 逐项检查源码等于本地 SFC、源码展开/收起、重置、在线编辑 iframe 实际渲染、退出恢复；其余主题/方向比较完整默认结构与视觉。所有页面 console error/pageerror 均阻断通过。

## 章节、API 与迁移审阅

保留固定双语章节与 8 项顺序：基本、节点类型、自定义节点、left/center/alternate/right、dataSource，以及如何引入、API、Accessibility/ARIA、设计变量。迁移表按真实公开 Vue 类型核对：默认/命名插槽、VNodeChild、`h` 数据节点、`@click` MouseEvent、`aria-label`/`ariaLabel`、`class`/`className` 与组合成员。

英文 API 的 time 从 string 修正为 VNodeChild，节点枚举从 Error 修正为 error。非空 dataSource 优先于默认插槽，position 在 center/alternate 控制单项位置；默认 mode=left、type=default、time 为空串。审阅指纹见 mappings/timeline.json，绑定固定双语源码和实际页面。

目前无声明的视觉 deviation。正式状态以 evidence/timeline.json 的完整矩阵与输入指纹为准；准备和诊断不能计入 accepted。
