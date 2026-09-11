# Space 文档批次验收

基线：Semi Design v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。

## 范围与契约

逐项审阅固定 basic/space 中英文 Markdown、semi-ui/space/index.tsx、utils 与 Foundation space 样式，以及 Vue 双语 Demo、API 表和迁移段落。Space 无独立 Foundation 行为实例。

| 索引 | 示例      | 验收                                                                |
| ---- | --------- | ------------------------------------------------------------------- |
| 1    | Basic     | 默认勾选、三类按钮、点击与 Space 键切换、Tab 阅读顺序               |
| 2    | Alignment | start/center/end/baseline 四组不同高度内容的布局                    |
| 3    | Spacing   | tight/medium/loose/array 切换和返回，8/16/24px 与双轴间距，十项换行 |
| 4    | Vertical  | 四个按钮垂直排列                                                    |
| 5    | Wrap      | 十个按钮默认及 240px 容器真实换行                                   |

全部覆盖双语 × light/dark × LTR/RTL，共 40 项。比较关键 computed style、Space 和子节点几何（各轴 ≤0.5 CSS px），同一 Chromium context、本地 Inter 和相同页面坐标截图（threshold=0.1、maxDiffPixelRatio=0.001）。不使用 mask 或放宽容差。

双语首主题 LTR 检查源码展示/重置、在线编辑首帧与退出清理。无 Portal；开关交互后按既有 fixture 在 300ms 采样。Demo 为 ClientOnly，静态构建不代替组件 SSR render 证据。

## API、迁移与归属

保留六项上游 API：align、className/class、spacing、style、vertical、wrap；children 映射到默认插槽，数组第一项是水平间距，第二项是垂直间距，vertical 忽略 wrap，数字间距覆盖 style 同轴 gap。默认 tight；上游英文表的 medium 已按源码纠正。引入、五个示例、API、设计变量和迁移段落齐全。

Alignment 移除无效 lineHight 拼写，不影响浏览器样式；参考直接编译固定 Markdown，未复制维护 React 源码。无品牌替换或新增资产。完整正式入口成功且证据有效后才计入 accepted。
