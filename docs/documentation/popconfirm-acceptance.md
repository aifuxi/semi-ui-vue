# Popconfirm 文档批次验收

固定基线 v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21，来源为 feedback/popconfirm 双语 Markdown、四个已补齐 Demo、Foundation 状态机与 Popover/Button 依赖。Basic、Types、Async、InitialFocus 四例覆盖双语 × 明暗 × LTR/RTL，共 32 项正式组合。

## 参考与适配

直接编译固定双语 Markdown。英文示例统一包一层 `LocaleProvider(enUS)`，与文档页的 ConfigProvider 消费者一致；否则参考侧页脚按钮会回退中文文案。en-US Types 的根导入固定为 `@douyinfe/semi-ui/`（带尾斜杠），共享导入改写器不匹配该写法，批次适配器替换为标准根导入。匿名箭头示例导出为命名组件，Types 的 `function TypesConfirmDemo` 直接作为默认导出。独立品牌替换不适用于本组件；其余文案逐字保留。

比较范围是 `.semi-popconfirm` 卡片：逐节点文本、class、`role`、`disabled`、SVG path、计算样式，各轴几何差 ≤0.5 CSS px；卡片像素 threshold ≤0.1、差异比例 ≤0.001。

## 示例与组件对齐

- 两个 Types 示例删除固定上游没有的局部容器与 `getPopupContainer`；浮层与固定基线一致通过 body 级 Portal 渲染，`position: relative` 容器限制显示区域的写法不作为该示例的预设。
- 修复 `RadioGroup` 丢弃顶层 `v-for` 的问题：`renderSlotChildren` 原先把 slot 内的 `Fragment` 整体过滤掉，模板里直接 `v-for` 的 `Radio` 全部不渲染（Types 的类型切换因此没有可点击项）。现在按固定 React `React.Children.map` 的行为摊平 `Fragment` 并保留 Text/Comment 过滤，并新增模板回归用例。该修复使 config-provider、feedback、locale 三批证据失效。
- 站点 shell 的 `:focus-visible` 焦点环原先只排除 `[data-demo-preview] *` 与元素自身的 `semi-` 类，Portal 内的 demo 内容离开预览子树后会被套上站点焦点环；固定基线的裸 `<input>` 保留浏览器默认焦点环。`site.css` 增加 `.semi-portal` / `.semi-portal-inner` 排除后，Portal 内 demo 内容保持上游焦点样式。该文件被全部批次跟踪，因此本轮与所有失效批次共享一次公开包、主题、站点构建与浏览器运行重验。

## 验证边界

- 浮层通过 trigger 的 `aria-controls` 关联的 popover 面板定位，不依赖文档页中多个 Demo 的挂载顺序；Types 在文档页默认展开，截图时只保留当前采样面板，其余 Portal 与页面 chrome 隐藏，面板的半透明背景统一在 `--semi-color-bg-0` 上采样。
- 面板与 trigger 的绝对位置逐轴对齐（≤0.5px）。Types 挂载即展开，移走参考根后用窗口 resize 让两侧按真实 trigger 几何重新定位。面板内部样式与几何单独比较，不因页面位置差异放宽。
- 行为覆盖：Basic 点击打开、确认/取消 Toast、重新打开与真实进出动效；Types 四种图标/确认按钮类型、`danger` 的 okType、受控时 Esc 不关闭；Async 2 秒 Promise 的 resolve 关闭与 reject 保持打开并清除 loading，loading 态在 300ms 固定采样时刻比较；InitialFocus 的 `okButtonProps.autoFocus`、`cancelButtonProps.autoFocus` 与 `initialFocusRef` 三种初始焦点按 `document.activeElement` 对照。
- 真实 `zoomIn`/`zoomOut` 由 `animationstart`/`animationend` 记录断言，不只比较类名。亮色 LTR 验证源码、重置以及真实编辑器 iframe 内打开与关闭。

审阅绑定当前上游、双语页面与映射指纹，正式入口成功后才写入有效验收证据；本批没有 accepted deviation。正式结果以自动生成的 evidence/popconfirm.json 与压缩报告为准，诊断不增加 accepted。

## 2026-09-13 历史审阅补齐

重读固定双语全部 8 个 live 片段、8 个映射 Vue SFC，核对固定 Popconfirm、Tooltip 默认值、locale、PopconfirmFoundation 及 Vue props、插槽、监听器返回值和内联 API。全部章节、ARIA、FAQ、设计变量和迁移段落均保留。英文正文 `OK Type`/`Cancel Type` 改为实际 `okType`/`cancelType`；motion 按 Vue 公开 boolean 类型描述，不承诺对象参数。中文 okText 默认值按固定 zh_CN locale 改为“确定”，覆盖原 API 表“确认”的笔误。审阅通过现有 `documentReview` 绑定最终双语正文。

已有源码纠错仍有效：arrowPointAtCenter 实际继承 Tooltip 的 true；defaultVisible 初始 false；position 按 LTR/RTL 选择 bottomLeft/bottomRight，英文重复且缺值的 position 行合并；延时回调为 onConfirm，不是上游正文 onOk。上游 content 函数版本中文写 2.10.0、英文写 2.30.0，Vue 不据此新增历史版本承诺，统一说明作用域插槽及 initialFocusRef。

| 示例（双语索引）  | 固定片段前提与核查结论                                                                                                                                                                                                                                                                                                |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Basic（1）        | 单个保存触发按钮、标题及正文，确认 success Toast、取消 warning Toast；英文标题含 want to，与 Types/Async 文案不同。英文页脚由完整 enUS locale 提供 Confirm/Cancel，中文为确定/取消。通过 body Portal 打开、关闭、动效结束后重开。                                                                                     |
| Types（2）        | 四个 Radio，初始 default、visible=true、trigger=custom。中文 type=button 和 span，英文默认 Radio 和 strong，均有上下 14px margin；保留语言结构差异。只有 danger 显式 okType，其他类型沿用 primary。没有局部容器；trigger 切换受控 visible，Esc 不能作为受控关闭路径。英文根导入尾斜杠及命名组件导出由既有适配器处理。 |
| Async（3）        | 单个保存按钮；2 秒后 confirm resolve 关闭，cancel reject 保持打开并恢复 loading。双语日志相同；Vue 增加卸载清 timer 和 settle Promise，不改变挂载期间时序。动画 spinner 在既有 300ms 时点采样后恢复，不把业务 Promise 改成即时完成。                                                                                  |
| InitialFocus（4） | 三个触发按钮对应确认、取消、content input；确认按钮同时为 danger，input placeholder 为 focus here。英文标题使用 save this edit，分别保留。content 函数转作用域插槽 callback ref；三条路径按真实 activeElement 对照，关闭并等待退出后再打开下一项。                                                                    |

所有片段无图片、网络数据或资源固有尺寸依赖，图标/CSS/Locale 使用固定本地资源。Portal 卡片按 aria-controls 关联，默认展开的其他 Types 卡片只在采样上下文中隔离，不遮盖当前卡片；面板与触发器位置、卡片文本/SVG/样式/几何及像素均保留门槛。现有矩阵源码循环为 4 示例 × 2 语言 × 2 主题 × 2 方向 = 32 项，覆盖真实进出动画与编辑器开关。实际列表、独立 React 诊断及正式结果由主调度统一核验。
