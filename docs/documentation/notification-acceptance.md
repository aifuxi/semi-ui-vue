# Notification 文档批次验收

固定基线 v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。Basic、Position、Icons、Colored、Links、Delay、ManualClose、Update 八例，双语 × 明暗 × LTR/RTL，共 64 项正式组合。

## 参考与适配

直接编译固定双语 Markdown。参考与 Vue 示例使用一致的独立品牌替换：Bytedance 标题改为 `Hi, AIFUXI`；`ies dance dance dance` 和 `Hi, Bytedance dance dance` 改为 `AIFUXI design notification`；`semi-ui-notification` 改为 `aifuxi-notification`；Toutiao/Vigo Logo 改为通用 Bell/Star。其余字面保留固定双语源码。英文前两例把 `with`/`Position` 误写修正为 `duration`/`position`（中文示例同样使用修正后的公开 API），Manual Close 参考补入固定示例缺失的 `useState` import。为三个纯图标按钮在参考与 Vue 两侧同时补入双语 `aria-label`，不保留未命名按钮。

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

## 2026-09-13 历史审阅补齐

重新逐项对照固定双语 Markdown、16 个 Vue Demo、批次 adapter、Notification/Notice/Foundation 与 Vue 公开类型、命令式实现和 holder。章节、内联 API 表及迁移说明已复核；本页没有独立 API 数据模块，审阅指纹保留该缺失标记。修正文案中遗漏的品牌替换范围，明确局部 holder API 每次生成新 id，不能套用静态同 id 更新或全局配置/销毁方法。静态关闭回调描述按 Foundation 与 wrapper 移除路径核对；上游文档的 onCloseClick 类型宽泛描述以固定源码的 string id 为准。补齐卡片 direction/className/style、MouseEvent/string 回调参数及静态 close 的 string 返回值。NotificationConfig.direction 虽在 Vue 类型中声明，但 config 实现与固定上游配置方法均不读取它，正文明确不能据此配置全局方向。未改共享组件或放宽视觉门槛。

### 全部双语片段的诊断前提

| 索引 / 示例   | 固定前提与断言依据                                                                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1 Basic       | 两种语言均 1 个 `Display Notification` 按钮，open 默认类型、标题和正文、3 秒关闭；英文 `with` 改为公开 `duration`。                                                            |
| 2 Position    | 两组共 6 个按钮，顺序 top/topLeft/topRight/bottom/bottomRight/bottomLeft；英文 `with`/`Position` 拼写修正；默认 topRight 在 RTL 下也不自动换边。                               |
| 3 Icons       | 4 个文字状态按钮与 3 个自定义图标按钮；仅两组小标题和新增 aria-label 随语言变化。红 Bell、继承色 Star、粉 Star 保留颜色和次序；margin 4px、前两个自定义按钮 margin-right 5px。 |
| 4 Colored     | 两种语言均按 info/success/warning/error 纵向放置 4 个按钮；间隔两个 br，theme=light，duration=3。                                                                              |
| 5 Links       | 1 个触发按钮，正文 fragment 下恰好两个直接 div；两个 Typography 链接为查看详情/一会再看或 More Info/Show Later；纵向 8px、第二链接左侧 20px，无业务跳转回调。                  |
| 6 Delay       | 1 个 `Close After 10s` 按钮；无标题、duration=10，不能要求标题节点。                                                                                                           |
| 7 ManualClose | Show/Hide 两个按钮，duration=0，创建 id 队列按先进先出关闭；双语固定片段都漏 useState import，由 adapter 补齐。Vue shallowRef 和空队列保护保留演示终态。                       |
| 8 Update      | 1 个触发按钮；首次 3 秒，1 秒后同 id 更新为 updated 并重启 10 秒计时。编辑器需等更新后关闭；Vue 卸载清理未触发 timer 属生命周期清理。                                          |

全部片段无外部图片、资源固有尺寸或多文件编译依赖。只有 Icons 与 Links 存在语言可见文案差异；正文中的内部 NotificationCard 静态排版不是第九个 live 示例，中文另含推荐/不推荐对照表，保留其写作原则而不公开内部组件。

参考使用真实 body wrapper；默认态比较按钮结构，弹层以真实 placement list 为根，只统一宿主背景，不裁掉弹层。关闭、重开、键盘与实际有限动画结束复用现有矩阵；独立计时页与真实编辑器隔离。源码检查确认矩阵声明 8 × 2 语言 × 2 主题 × 2 方向 = 64 项，正式 Playwright 发现清单及代表诊断由主 agent 统一核对，不能用此次语义审阅代替浏览器证据。
