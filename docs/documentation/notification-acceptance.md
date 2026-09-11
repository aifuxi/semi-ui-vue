# Notification 文档批次验收

固定基线 v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。Basic、Position、Icons、Colored、Links、Delay、ManualClose、Update 八例，双语 × 明暗 × LTR/RTL，共 64 项正式组合。

## 参考与适配

直接编译固定双语 Markdown。参考与 Vue 示例只做已声明的独立品牌替换：Bytedance 文案改为 AIFUXI，Toutiao/Vigo Logo 改为通用 Bell/Star；其余按钮与正文字面与固定源码逐字一致。英文前两例把 `with`/`Position` 误写修正为 `duration`/`position`（中文示例同样使用修正后的公开 API），Manual Close 参考补入固定示例缺失的 `useState` import。为三个纯图标按钮在参考与 Vue 两侧同时补入双语 `aria-label`，不保留未命名按钮。

命令式 wrapper 追加到 body。对照根使用各位置真实浮层 `.semi-notification-list[placement=...]`，因为两个宿主的页面滚动位置不同，不能以 wrapper 为几何原点。截图时只隐藏宿主页面内容并把 body 背景统一为主题背景色；固定定位弹层、阴影与圆角不裁剪、不遮盖。

双语文档的章节、API 与 React→Vue 迁移段落完成审阅，正文改为当前批次结论；固定源码中的内部 `NotificationCard` 仍不作为公开组件演示，保留文案规范。

## 验证边界

组件侧对齐固定实现的三处内部差异：

1. `semi-notification-notice-icon-show` 改为按合法 type 列表判断，`default` 类型同样带该类但仍不渲染状态图标（固定 `Notice` 的 `types.includes(type)`）。
2. 自定义 `icon` 中的 Semi 图标按显式 `size` 或 `large` 克隆，普通 VNode 原样渲染（固定 `isSemiIcon` + `cloneElement`）。
3. 中文 Links 示例改回固定示例的 fragment 结构，两个内容块直接挂在 `.semi-notification-notice-content` 下，不再多包一层 `div`。

比较完整弹层的文本、语义、计算样式、图标与几何：关键 computed style 精确相等，各轴几何差 ≤0.5 CSS px，截图 threshold ≤0.1、差异比例 ≤0.001。六种位置额外断言真实贴边/居中：`top*` 顶边为 0、`bottom*` 底边等于视口高、`top`/`bottom` 水平居中、`*Left` 左边为 0、`*Right` 右边等于视口宽；RTL 使用双方相同的 body 方向与 `semi-rtl` 祖先，默认位置仍为 `topRight`（固定实现合并默认值时已写入该位置）。

Chromium 真实动效验证：打开、悬停暂停自动关闭、关闭按钮与键盘关闭、退出动画结束后卸载、重开，以及 `animationstart`/`animationend` 的 `slideShow_*`/`slideHide_*` 实际发生。计时在独立、不加载编辑器的页面用受控时钟验证：3 秒通知在 2999ms 仍在、3000ms 进入退出；10 秒通知在 9999ms 仍在、10000ms 进入退出；Update 在 1000ms 更新为固定文案、原 3 秒期限不关闭、更新后 10 秒期限结束时退出；`duration: 0` 在 60 秒内不关闭。ManualClose 覆盖两条通知按创建顺序关闭与空队列安全忽略。

编辑器使用真实时钟并检查源码、重置、在线编辑、iframe 内打开/关闭通知与退出；Update 在关闭前等待固定示例 1 秒后的同 id 更新，避免把重新创建误判为未关闭。跨域沙箱的 Chromium 原生提示如需忽略，只允许精确匹配的固定文案并作为附件保留；其它 console error 与 pageerror 一律失败。

正式结果以自动生成的 evidence/notification.json 和压缩报告为准；诊断不增加 accepted。
