# Modal 文档批次验收

固定基线 v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。固定双语各 12 项，顺序一致；双语 × 明暗 × LTR/RTL 共 96 项正式用例。正式状态由 evidence/modal.json 与完整报告生成，准备与诊断不计 accepted。

## 双语片段前提审阅

全部 24 段已经逐段核对实例、控件、文案、事件、属性和依赖。每例初态仅一个触发按钮，Imperative 为 Info、Success、Error、Warning、Confirm、Custom 六个，顺序双语相同；每次只创建一个 Modal。没有图片与远程资源，图标为本地 SVG，Custom 三个 48px 图标，依赖 Button/List/Icons；Draggable 依赖 DragMove，Context 依赖 en_GB Locale。

| 索引 | 示例         | 固定前提与断言                                                                                                                                                                |
| ---- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Basic        | 中文标题“基本对话框”、英文“Basic Modal”；双语正文相同，br 分行。确定、取消与 afterClose 日志；显式 closeOnEsc=true。                                                          |
| 2    | FooterFill   | 与 Basic 相同，额外 footerFill=true。                                                                                                                                         |
| 3    | MaskClosable | maskClosable=false，遮罩点击保留弹窗；双语标题、触发文案不同，正文相同。                                                                                                      |
| 4    | ButtonText   | 默认按钮显示 Sounds great! / No, thanks.，可访问名仍是 confirm/cancel。                                                                                                       |
| 5    | ButtonProps  | 两个 footer 按钮均 small；确认 warning，取消 disabled；不能点击取消验收关闭。                                                                                                 |
| 6    | HeaderFooter | 默认头部，footer 只有 Yes, I Understand 一个自定义按钮，点击 handleOk 关闭。                                                                                                  |
| 7    | Style        | centered，body height=200 与 overflow=auto；双语两段简介和四个 li，文字逐语言保留。                                                                                           |
| 8    | Custom       | header=null，显式 header 存在使 body 采用标准分支，不生成 close 按钮；三项 List、48px 图标；footer 两个 240px 按钮，分别确认/取消。                                           |
| 9    | Fullscreen   | fullScreen 覆盖尺寸；中英文标题和触发文字不同，正文相同。                                                                                                                     |
| 10   | Imperative   | 六个静态方法调用（最后为自定义 info/IconSend）。固定片段没有 locale 或 okText/cancelText，静态实例脱离 Provider，双语均默认中文“确定/取消”；删除 Vue 英文例额外英文按钮覆盖。 |
| 11   | Context      | 双语都是 en_GB ConfigProvider 内 holder，确认/取消显示 Confirm/Cancel；静态方法语言不能套到 holder。                                                                          |
| 12   | Draggable    | title 双语不同，正文固定误称 sidesheet，原样保留。relative DragMove，只有 onCancel，没有 onOk，因此点确认不关闭。真实鼠标拖动 70px/40px 后比较位移和弹窗。                    |

React 适配器只补 live scope 的 useState、匿名组件和未声明的 ModalComponent 的 ESM 导出。英文声明式实例补原站 en_US Provider；Context 保留原片段 en_GB，Imperative 保留独立静态默认语言。仅将独立品牌约束排除的 IconSemiLogo/IconVigoLogo 替为和 Vue 相同的 IconInfoCircle/IconMoon，48px 与三项内容不变。Vue 触发器与自定义 footer 清理原迁移多出的首尾空格。

## 审阅和验证范围

章节顺序、完整手写 API、生成 API 元数据、迁移说明与公开 ModalProps/Slots/Emits/Handle 核对。onOk/onCancel 是读取 Promise 返回值的 callback props，不是 emits；useModal 返回方法和 ContextHolder；destroyAll 仅管理静态实例。API 元数据纠正三类方法签名。固定片段没有 Promise 状态，矩阵不发明异步演示；关闭等待 Portal 节点卸载（真实退出完成），Basic/FooterFill 校验 afterClose 日志、Esc、Tab 焦点及恢复触发器，全部例关闭后重开。

默认预览比较忽略框架组合产生的无 class div 容器，保留可见组件节点、文本、样式和几何；弹窗比较不忽略这些 div。比较 `.semi-modal` 与遮罩计算样式、相对几何及 viewport 绝对位置，保证 Portal 不被根坐标归一化掩盖。SVG path、role/ARIA、颜色、边框、字体、transform/animation 均参与。几何每轴 ≤0.5 CSS px，像素 threshold ≤0.1、差异比例 ≤0.001，无 mask 或容差放宽。等待真实动画 finished 后采样稳定打开态。双语明亮 LTR 还覆盖源码、重置与在线编辑器中打开/关闭；仅记录 Chromium 跨源 iframe 明确阻止 autofocus 的已知提示，不屏蔽其他错误。

截图前只将 html/body 设为统一主题底色并隐藏 Portal 之外的站点内容，保留真实半透明遮罩及全部弹窗节点，避免圆角透明像素透出不同文档外壳。遮罩的计算样式仍独立比较。源码区内容逐字等于磁盘 .vue 文件。

Basic/FooterFill 初始 cancel 焦点来自固定 Modal.tsx renderFooter 的 autoFocus=true；React 在子按钮挂载提交时聚焦，ModalContent.componentDidMount 仅在焦点不处于对话框内时取首个可聚焦节点。Vue footer 提供 autofocus，ModalDialog.activate 在 nextTick 后保持已有内部焦点，缺失时优先选 autofocus。DOM footer 顺序为 cancel 后 confirm，因此 Tab 期望 confirm，不由按钮视觉顺序推导。最终仍由 Chromium 校验实际焦点。

最终证据以主 agent 统一诊断和正式验收为准；本记录不预先声称浏览器通过。

## 代表诊断文本采样修正

diagnostic-06 的 Basic/FooterFill 双语同类正文均为文本→br→文本。原 measure 丢弃 br 再直接连接文本，React 产生 `modal.More`，Vue 保留源码空格产生 `modal. More`，这不是浏览器显示内容差异。已查归档 Basic 双侧截图，两行正文的文字与换行一致，正文样式及 398×40 几何也一致。采样改为按直接 br 分段并逐段比较，依据已比较的 white-space=normal/nowrap 仅折叠 ASCII CSS 空白及行首尾空格；其余 white-space 模式保留原文本，非断行空格与词序不删除，br 数量也由数组分段体现。适用全部示例，不修改 Demo 或基线文本，不降低截图门槛。失败截图保留于 parallel-round-20260912-next/diagnostic-06。

代表诊断 diagnostic-08 暴露测试注入脚本在 sandbox REPL iframe 中访问 localStorage；主题初始化现限定 window===window.top，仅主文档写入主题偏好。全批仅此一个 addInitScript，无其他存储注入。保留 iframe sandbox 权限和完整 pageerror/console error 门禁，未屏蔽存储异常。

代表诊断 diagnostic-11 的 Draggable 首次打开 18 对节点中仅外层 `.semi-modal` cursor 不同（React auto / Vue move）。固定 modalRender 仅包装内部 `.semi-modal-content`，Vue 原包装了外层，现修正共享边界；拖动位移断言也改为内容节点，外层 Portal 几何门槛保留。产品修复详情及范围外数字 width 问题记录在组件 alignment.md。修复后的正式证据需统一重建验收，不能复用本次变化前的矩阵。

诊断 diagnostic-17 的 Imperative 第六种自定义 IconSend 漏用组件内的 extra-large 与类型类名，导致图标24px变16px、类型蓝色缺失以及标题水平偏移。已修 ConfirmModal 的自定义 Semi Icon 克隆逻辑；固定双语 Demo 均保持仅 h(IconSend)，普通VNode/null不套图标props。正式样式与像素门槛保持不变。

诊断 diagnostic-20 纠正 Custom 前提审阅：header=null 不等于 header 缺省。固定 renderHeader 返回null，renderBody 的 hasHeader 仍为true，故没有任何 close 按钮。归档样式与DOM双侧一致、只有 Continue / Learn more features 两个按钮。首次、重置后和 REPL 关闭点击 Learn more features；重开后 Continue 验证确认。矩阵显式断言两个按钮和不存在可访问名close的按钮；未改产品或Demo。
