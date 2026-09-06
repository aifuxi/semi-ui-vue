# ConfigProvider 文档验收矩阵

固定来源：`vendor/semi-design/content/other/configprovider/index.md` 与 `index-en-US.md`；Adapter/Context 和默认主题证据见 `docs/components/config-provider/alignment.md`。

| 上游索引 | Vue 示例  | 公开行为与状态                                                                                       | 视觉范围                                              |
| -------- | --------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 1        | TimeZone  | GMT-11 至 GMT+14 共 26 个选项；初始 GMT+08；Select 切换后 DatePicker/TimePicker 消费时区；清除与键盘 | zh-CN/en-US、light/dark、选择器及日期/时间输入、弹层  |
| 2        | Consumer  | scoped slot 读取完整 Context；Typography 省略与 Tooltip                                              | 双语明暗、600px 文本与浮层；JSON 属性顺序属于展示映射 |
| 3        | Direction | 初始方向、LTR/RTL 按钮切换；输入、导航、展示、通知/Modal/Toast 命令式方向                            | 双语明暗、LTR/RTL；各组件分别裁剪，不以整页稀释差异   |

组件边界：TimeZone 管理一个时区值；Consumer 只展示上下文；Direction 仅管理方向并组合 Buttons/Inputs/Navigation/Display/Feedback 五个子示例，Feedback 接收 direction prop。示例使用现有公开 API。经用户确认，生产运行时另修复完整默认 Locale 与 DatePicker readonly class；其他消费者差异仍待修复，不能把本矩阵描述为已通过。

ConfigProvider 本身没有 Foundation、SCSS、焦点、ARIA、Portal 或动画节点。演示消费者的 DOM/class、关键 computed style 必须精确相等，rect 各轴不超过 0.5px；截图 threshold ≤0.1、maxDiffPixelRatio ≤0.001，无宽松 mask。禁用、选中、展开、焦点和命令式弹层由公开交互验证。默认桌面 1440×900 DPR1，响应式订阅文档另说明 mounted/cleanup 生命周期，不将非 live 代码计入三个 live Demo。

上游源码问题：第三项调用 Toast 却没有导入，React ESM 入口仅补该命名导入；保留上游 Spin 无效 CSS var 值，不自行修饰参考布局。Vue 的 VNode icon 数据用 h()，其余采用模板/slots。未解释的差异不计入 accepted。

文档站隔离：默认 box-sizing/font reset 不作用于示例或 Semi Portal；demo-preview 使用 overflow-wrap:normal，避免继承正文 anywhere。验收同时比较 box-sizing/min-width/flex-shrink/overflow-wrap/word-break/white-space 和公开 ARIA，组件截图按实际控件裁剪。

当前结论：三个示例已建立双语映射，但严格验收未完成。Consumer 在双语、明暗四项定格对照中均存在 24px 内容宽度差；Typography 手写 Tooltip 缺少上游箭头和定位行为。Direction/TimeZone 还存在消费者默认 DOM、ARIA 与点击状态差异，第二份补丁 `ai-work/20260906-111500-config-provider-consumers.patch` 已获用户确认并应用；补齐了 DatePicker 四种类型、Steps 当前项/动态监听器，以及 Navigation 依赖的 Dropdown 缺省 expanded 状态。严格组合矩阵仍须在当前源码上重新通过，不能以定向回归替代。矩阵中的键盘、弹层与命令式反馈是完成要求，不能因前置断言失败而视为已验证。

最终续验（第二份补丁应用后）：16 项严格用例均因明确差异未通过。TimeZone 四项在切换 GMT+00:00 后仍显示旧日期时间；Consumer 四项缺少完整 Tooltip 外壳/箭头；Direction 八项已通过默认计算样式、几何、完整控件裁剪、输入/开关和 Notification 检查，但在 Modal 显示结束后的 class/transform 对照失败。后续 Toast 和在线编辑器路径未全部到达，不计作已验证。

英文 Direction 保留上游 en_GB；参考入口从固定源码解析 Locale 子路径。文档原生控件 color-scheme 使用 normal，与参考环境一致，dark 色彩由固定 Token 提供。截图先将目标移到视口中部，Badge 包含越界角标的完整边界及 1px 抗锯齿边缘；没有 mask 或提高阈值。
