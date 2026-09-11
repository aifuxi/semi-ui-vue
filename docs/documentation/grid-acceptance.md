# Grid 文档批次验收

固定基线为 Semi Design v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21，来源为 basic/grid 双语 Markdown、Row/Col Adapter、Grid SCSS 和原站 docDemo.scss。

## 范围

七项示例全部覆盖双语 × light/dark × LTR/RTL，共 56 项正式用例。各例均在 1440px 与 390px 真实视口比较并回到桌面宽度；Responsive 额外逐一经过 575/576、767/768、991/992、1199/1200、1599/1600px，随后缩回 390px 并恢复 1440px。

| 示例          | 验收契约                                                                  |
| ------------- | ------------------------------------------------------------------------- |
| Basic         | 四行 24/12/8/6 栅格、十列、窄屏与桌面回程                                 |
| Gutter        | 水平 16 与 [16,24] 两维 gutter，Row 负半间距、Col 正半间距、每行八列换行  |
| Offset        | 8/6/12 列的三组偏移，LTR/RTL 镜像                                         |
| Flex          | start、center、end、space-between、space-around 五种分配                  |
| VerticalAlign | 三行固定 50px、列 30px，顶部/居中/底部偏移 0/10/20px                      |
| Order         | order 4/3/2/1 的视觉排序与 RTL 方向，DOM 阅读顺序保持不变                 |
| Responsive    | 数值列宽与对象 span/offset；六断点 CSS、gutter 更新、各边界两侧与缩放回程 |

逐节点比较文本、class、原生语义、默认样式、Row clearfix 伪元素和几何。各轴误差不超过 0.5 CSS px；全例与逐行紧裁剪截图均维持 threshold=0.1、maxDiffPixelRatio=0.001。逐行裁剪包含一像素 outline，不用整页空白稀释差异，不 mask。

参考容器采用当前文档预览的实际宽度、内边距（窄屏为 16px）及 overflow；后者形成的格式化上下文影响垂直 gutter 负 margin 的布局高度。视口变化后等待站点侧栏真实的 0.2 秒退场动画完成，不截取侧栏遮挡中的栅格，不关闭动画或暂停时钟。React/Vue 对照应用保留 Sass CSS 原始精度，禁用 Lightning CSS loader 与 CSS minifier 的二次改写：20.8333333333% 被截为 20.8333% 会在 575px 场景改变 Chromium 子像素取整和文字像素。默认及边界的样式精确比较与逐行像素门槛均未放宽。

双语亮色 LTR 验证源码、重置、编辑器首帧、退出及再次打开。Basic 实际编辑首列 24→12 并运行，Responsive 实际编辑六断点 gutter 为 32 并运行，之后重置恢复。编辑器响应式值按 iframe 实际宽度检查，不用外页宽度推断 iframe 的媒体查询。

## 源码与文档审阅

React 七例直接读取固定 Markdown，只有匿名示例导出适配；双语代码仅末尾空白不同。原站 docDemo.scss 已由既有站点资源管线提供，Vue SFC 使用等价的局部样式。VerticalAlign 的 value 属性是原站普通 div 属性，不将其误改为列高度。无新增预览容器、数据或品牌适配。

双语章节、公开 RowProps/ColProps、GridGutter、ColSize、默认插槽与原生 attrs 已核对。API 表统一 gutter 默认 0，其余 justify/order/offset/push/pull 默认为未设置；有效布局值与 prop 默认值分开说明。Vue Flex 用法明确为 type="flex"，英文 gutter/xl 大小写纠正；sm 断点保持实际源码的 576px。prefixCls 与 Col 必须位于 Row 内的约束继续保留。

Grid 没有业务事件、受控状态、Portal、动画或默认键盘行为；不额外赋予布局 div 按钮语义。实例内部 media query 通过真实视口变化验证，源码已有挂载/卸载监听边界。本批未改变组件运行时；文档 ClientOnly 预览不充当组件 SSR/hydration 验收。

审阅绑定当前上游及双语页面指纹，正式入口成功后才写入有效验收证据；没有 accepted deviation。
