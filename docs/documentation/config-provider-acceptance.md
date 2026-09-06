# ConfigProvider 文档验收矩阵

固定来源：`vendor/semi-design/content/other/configprovider/index.md` 与 `index-en-US.md`；Adapter/Context 和默认主题证据见 `docs/components/config-provider/alignment.md`。

| 上游索引 | Vue 示例  | 公开行为与状态                                                                                       | 视觉范围                                              |
| -------- | --------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 1        | TimeZone  | GMT-11 至 GMT+14 共 26 个选项；初始 GMT+08；Select 切换后 DatePicker/TimePicker 消费时区；清除与键盘 | zh-CN/en-US、light/dark、选择器及日期/时间输入、弹层  |
| 2        | Consumer  | scoped slot 读取完整 Context；Typography 省略与 Tooltip                                              | 双语明暗、600px 文本与浮层；JSON 属性顺序属于展示映射 |
| 3        | Direction | 初始方向、LTR/RTL 按钮切换；输入、导航、展示、通知/Modal/Toast 命令式方向                            | 双语明暗、LTR/RTL；各组件分别裁剪，不以整页稀释差异   |

组件边界：TimeZone 管理一个时区值；Consumer 展示上下文；Direction 管理方向并组合 Buttons/Inputs/Navigation/Display/Feedback 五个子示例，Feedback 接收 direction prop。示例使用公开 API。消费者修复包含完整默认 Locale、日期/时间时区更新、既有 DOM/ARIA 契约、Typography 正式浮层及 Modal 动画终态；以当前源码矩阵证据为完成依据。

ConfigProvider 本身没有 Foundation、SCSS、焦点、ARIA、Portal 或动画节点。演示消费者的 DOM/class、关键 computed style 必须精确相等，rect 各轴不超过 0.5px；截图 threshold ≤0.1、maxDiffPixelRatio ≤0.001，无宽松 mask。禁用、选中、展开、焦点和命令式弹层由公开交互验证。默认桌面 1440×900 DPR1，响应式订阅文档另说明 mounted/cleanup 生命周期，不将非 live 代码计入三个 live Demo。

上游源码问题：第三项调用 Toast 却没有导入，React ESM 入口仅补该命名导入；保留上游 Spin 无效 CSS var 值，不自行修饰参考布局。Vue 的 VNode icon 数据用 h()，其余采用模板/slots。未解释的差异不计入 accepted。

文档站隔离：默认 box-sizing/font reset 不作用于示例或 Semi Portal；demo-preview 使用 overflow-wrap:normal，避免继承正文 anywhere。验收同时比较 box-sizing/min-width/flex-shrink/overflow-wrap/word-break/white-space 和公开 ARIA，组件截图按实际控件裁剪。

运行时回归要求：DatePicker/TimePicker 同时覆盖受控/非受控连续时区切换、新 value 与 timeZone 同 tick 更新；Consumer 必须包含完整 Tooltip 内容与箭头，检查绝对定位以及最小完整裁剪；Direction 对 Notification、Modal、Toast 逐个检查样式、几何、截图和键盘关闭，Modal 动画结束后不得保留入场 class/transform。浅色两种语言检查全部三个示例的在线编辑器，不能因前置失败把后续路径视为通过。

Typography 扩展门禁另覆盖双主题 Tooltip/Popover、Popover showArrow 缺省/false/true、稳定自定义容器首次可见、Document 滚动定位、恢复宽度后关闭及卸载清理。共享 Tooltip 外层内容必须保留固定 `.semi-tooltip-content`；Popover 内部自身的 `.semi-popover-content` 不变。

是否通过只认 `evidence/config-provider.json` 和对应压缩报告；须满足当前源码指纹、完整 16 项矩阵、无失败/重试/跳过以及规定的截图与行为附件。本文是验收合同，不是独立通过声明。

英文 Direction 保留上游 en_GB；参考入口从固定源码解析 Locale 子路径。文档原生控件 color-scheme 使用 normal，与参考环境一致，dark 色彩由固定 Token 提供。截图先将目标移到视口中部，Badge 包含越界角标的完整边界及 1px 抗锯齿边缘；没有 mask 或提高阈值。

浮层环境归一化：逐组件截图可能分别滚动两页，Consumer hover 前必须重新对齐触发器的绝对坐标，再检查浮层 x/y/width/height。命令式反馈的透明圆角会采样文档壳背景；仅在裁剪前将两页非 Portal 的 app 背景内容设为透明、body 设为相同 Token 底色，保留真实 Portal/遮罩及组件本身，结束后恢复。此处理不使用 mask、不缩小组件边界；定位原因的原始 Modal 图中全部差异均在外缘，距边缘 12px 以内部像素相同。TimeZone 另执行两个输入清除和在当前时区用键盘输入新时间后 Tab 提交。
