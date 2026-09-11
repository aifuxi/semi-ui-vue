# Feedback 文档批次验收

固定基线 v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。Basic、Text、Radio、Checkbox、Custom、Modal、Completion 七例，双语 × 明暗 × LTR/RTL，共 56 项正式组合。

## 参考与适配

直接编译固定双语 Markdown。参考入口命名匿名函数，英文补入完整 en_US LocaleProvider，插画复用指向固定源码的现有别名。Custom 在双方采用已有映射声明的两项修正：自引用初始化改为空字符串，英文 renderContent 闭包补入 value 依赖。其余交互和计时不改写。

参考聚合样式把 SideSheet 放在 Feedback 之后，同优先级的固定定位规则使 Popup 贴底。固定公开入口的顺序相反。本批参考适配器直接编译只读 Feedback SCSS 并在当前示例补载，恢复 50px 底部间距和 Feedback 的进出关键帧；不更改共享参考样式，也不以 Vue 样式作为参考。

双语文档补回 Modal/SideSheet 参数直接透传的说明，并校正回调参数为事件的 Vue 契约；自定义内容、控制可见性和 Promise 返回值按现有公开类型审阅。Completion 保留父级输入状态和 1500ms 关闭、200ms 复原提示的原始时序。

## 验证边界

SideSheet 修复进入动画结束后残留 class 的缺陷：分别跟踪 mask/content 阶段，重开时恢复进入态；退出等待真实 animationend，移除提前截断 CSS 动画的 180ms JS 兜底。默认 CSS 时长及公开类型不变；历史文档证据按实际依赖重新验收。

比较完整弹层及局部内容的文本、语义、计算样式、图标、几何与像素，几何 ≤0.5px，像素 threshold=0.1 / maxDiffPixelRatio=0.001；不扩大容差，不遮盖被测组件。圆角边缘会透出不同的宿主页面，截图时仅将 Portal 外宿主内容隐藏并统一 body 背景，真实弹层及遮罩保留。透明原生 radio/checkbox 输入的 outline 不参与绘制，保留原始样式附件但不比较该不可见 outline；外层实际 Semi 焦点环仍做样式及像素对照。RTL 使用双方相同的 body 方向和 semi-rtl 祖先，覆盖 Portal 布局。

真实 Chromium 验证输入、空值提交门禁、表情及原因变化日志、单选互斥、多选清空、自定义受控输入、关闭后重开和取消。Popup/Modal 保留默认进入与退出动画并等待实际结束；Completion 验证两种容器的成功插画、footer 隐藏、自动关闭与提示复原。编辑器检查使用真实时钟，保留 Chromium 对跨域沙箱内原生 autofocus 的限制提示为附件，实际打开/手动点击关闭仍须通过；精确计时检查使用独立、不加载编辑器的页面。

正式结果以自动生成的 evidence/feedback.json 和压缩报告为准；诊断不增加 accepted。
