# Dropdown 文档验收

固定参考：只读 Semi v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。

6 项双语示例 × light/dark × LTR/RTL，共 48 项。独立适配器为原始函数/匿名箭头添加默认导出，并修正下述唯一英文 JSX 属性拼写；不修改固定示例交互与布局。六项逐一对应 Basic、Nested、Position、Trigger、Events、Menu。

## 断言范围

每项先独立加载 React 原块，再加载 Vue。逐节点比较 class、属性、ARIA、文本、关键 computed style 和四轴几何（≤0.5 CSS px），截图 threshold=0.1、maxDiffPixelRatio=0.001。浮层比较 wrapper 根及其全部组件子节点，单独记录 trigger 相对预览和浮层相对 trigger 几何，不归一化位置、颜色或菜单内容。复用既有矩阵的生成 id、同源路径和默认 false ARIA 等价规则。

所有触发器均打开→比较浮层→关闭并等待 wrapper 卸载→重开。Position 覆盖 bottom/bottomLeft/bottomRight；Trigger 中文覆盖 hover/focus/click/contextMenu，英文按固定原块覆盖 hover/focus/click；Nested 打开左右两层并关闭子层。Basic 覆盖 ArrowDown 和跳过禁用项、Escape 回焦；Events 逐项验证 click/mouseenter/mouseleave/contextmenu 对应的固定 Toast 文案。Menu 单击 JSON primary1 项，等待公开 console 回调输出 `click primary`，随后按 Escape 验证浮层关闭卸载。比较保留真实动效，截图时使用共享 freezeAnimations 采样 300ms，关闭以 DOM 卸载作为结束条件。

每个双语 light/LTR 示例另验证源码一致、展开/收起、重置、在线编辑实际渲染及退出恢复。

## 章节/API/迁移审阅

已核对固定双语六项 live block、章节、无障碍与文案规范。保留 Related Material 营销入口的既有排除。公开类型来源 packages/ui/src/dropdown/types.ts，运行默认值核对 Dropdown.vue、DropdownItem.vue 与固定 React Dropdown/Tooltip。mouseEnterDelay=50、mouseLeaveDelay=100、zIndex=1060；Item type 未设默认。更正正文事件为 Vue 模板监听语法，并补英文 contextMenu 枚举。菜单数据对象事件名仍是 onClick/onContextmenu/onKeydown/onMouseenter/onMouseleave，不能和模板语法混写。

迁移表覆盖 render/content 插槽、组合成员、menu 判别联合、v-model:visible、浮层事件、Item icon/事件和 class；还保留 focusTrigger/getPopupId/rePosition、Portal 容器与 SSR 生命周期说明。页面 API 为内联表，无 dropdown.ts 元数据。

本记录为准备阶段审阅，不宣称已通过浏览器或 accepted；最终状态由完整正式矩阵与运行前后输入指纹决定。诊断失败与共享组件修复由主 agent 统一处理。

## 触发器可访问性诊断与修复

第一轮代表诊断在默认态发现 Basic/Nested 缺少 aria-describedby；Position 另缺 tabIndex，并因模板 Tag 前导空格形成错误的 `Tag:  Bottom`。已完整检查三份 default-styles 附件，节点数量、其余属性、关键样式与几何无其他差异；此前失败仅证明默认态，尚不能证明浮层路径。

固定 Tooltip render 的 cloneElement 注入 aria-describedby 与 tabIndex。Vue 的 Tooltip 同样注入，但内部 DropdownTriggerRenderer 使用 inheritAttrs:false 且没有转发 attrs，丢失描述关系；它注入小写 tabindex，Tag 的显式 tabIndex prop 渲染又覆盖了该原生 attrs。Dropdown 局部修复将外层 attrs 合并到真正 trigger，保留子节点显式属性优先级，并使用组件可消费的 tabIndex（兼容模板 tab-index）。未修改 Tooltip 或 Tag。

公开行为测试先在原实现观察到 4 项失败，修复后 Dropdown 单元与 SSR 共 19 项通过；覆盖原生触发器的真实浮层描述关联、Tag 默认/负数/正数 tabIndex、模板显式描述和 tab-index 保留。本批双语 Tag/菜单标题与菜单项模板清理无意义前导空格，恢复固定文本；不在矩阵中归一化 aria-label。浏览器与依赖此组件的历史文档回归由主 agent 统一运行。

后续代表诊断（diagnostic-07）完整 styles 附件显示 Basic 默认/浮层/键盘与 Position 默认/首浮层无差异；Nested 首浮层两个子菜单触发项额外包含 aria-describedby/aria-haspopup。固定 dropdownItem.tsx 只输出 role=menuitem、tabIndex=-1、aria-disabled、声明事件/class/style 和 getDataAttr(props)，不透传外部任意 ARIA。Vue DropdownItem 恢复此 data-* 透传边界；普通 Button/Tag 触发器继续保留上一修复的描述关联，矩阵不删除 ARIA。嵌套公开行为断言先红（1 失败/15 通过），修复后 Dropdown 单元/SSR 19 项通过；红绿日志保存在本轮 documentation-smoke 的 dropdown-item-red.log / dropdown-item-green.log。完整浏览器结论仍待统一验收。

诊断 diagnostic-11 的完整附件中，Basic 和 Nested 已通过；Position 在 runner 因 Events 首次失败停止时中断，已采集三种位置双轮 styles 无超门槛差异；Trigger 在 focus 浮层截图时被同次停止中断，Menu 尚未运行。Events 唯一差异是固定 React 入场 class 尚未清理，transform 仍为 identity matrix，而 Vue 已清理为 none。固定 tooltip/animation.scss 入场时长为 100ms，CSSAnimation 在 animationend 更新 class，freezeAnimations 设置 currentTime 不等于等待此事件及渲染提交。矩阵在固定 300ms 采样后等待浮层真实入场 class 消失和可见终态，再作完整 class/style/geometry/像素比较；不关闭 motion、不增加 sleep、不归一化 class/transform。后续完整行为仍须代表与正式矩阵核验。

## 退出动画不抢回用户焦点（2026-09-12）

诊断 diagnostic-14 的 Events 重开差异是首菜单项的 focus-visible 背景，非 hover。固定 SCSS hover 同时改变 cursor，失败中双方 cursor 仍为 auto。真实 Chromium original 探针确认：Escape 已在隐藏前回焦 trigger，用户 blur 后 React 保持 blur，Vue 却在浮层卸载时再次 focusin BUTTON；第二次鼠标点击时 Vue 因而沿用键盘焦点可见状态。blur-after 对照两侧恢复一致仅用来证伪原因，正式矩阵仍保留原始 blur 时序。

固定 Tooltip Foundation _handleEscKeyDown 的顺序为 focusTrigger→hide，CSSAnimation leave 完成只执行 didLeave/afterClose，不再次聚焦。Dropdown 删除 restoreFocusAfterClose 状态与 afterClose 中的二次聚焦；同时去除 visibleChange(false) 通知里的无条件回焦，与固定 DropdownFoundation 仅更新状态/通知的行为一致。回焦集中于 trigger/popup 的 Escape 隐藏前，并受 returnFocusOnClose 判断；false 通知仍清理 enter timer。鼠标/外部点击关闭不会因状态通知无条件夺取焦点。用户在退出阶段将焦点移到其他控件后，浮层卸载不再抢回。

新增 motion=true 的公开行为回归派发真实 wrapper animationend 出口事件，先验证 Escape 回焦及退出 class，等待可见状态通知稳定且退出 class 仍存在后再转移用户焦点，验证卸载/afterClose 后焦点不变。true/false 参数覆盖：修复前 true 分支真实失败（1 失败/17 通过），修复后单元+SSR共 21 项通过。原始红绿日志为本轮 dropdown-focus-red.log / dropdown-focus-green.log；中间仅移除 afterClose 焦点但测试未等待关闭通知稳定的失败保留为 dropdown-focus-green-failed.log，不作通过证据；真实探针在 focus-probe-original 与 focus-probe-blur-after 中。后续浏览器重新构建验证由主 agent 统一执行；不以单元模拟替代 Chromium 输入模态证据。

诊断 diagnostic-17 的 Events 完整通过，退出焦点修复已在该代表生效。Menu 失败发生在第一侧 React 点击定位阶段：showTick 的图标可访问名称为 tick，菜单项名称不是裸 primary1；快照明确保留图标和文本。该根因由调用栈与快照静态支持，修正后仍待浏览器确认。定位改用 menuitem 角色加精确文本 /^primary1$/，不修改上游 ARIA/菜单；console 精确等待与 click 组成 Promise.all，避免点击失败时孤立 waiter 提前拒绝损坏 trace。回调断言仍要求 log 类型及完全相等的 click primary。

自审补充：新增 trigger Escape 回焦明确排除 custom，符合固定 Tooltip.focusTrigger 的边界，未改 custom 现有关闭逻辑。合成键盘事件在外部控件已聚焦时不会新增抢焦；回归先红 1 失败/18 通过，修复后 Dropdown 单元+SSR 22 项通过，日志 dropdown-custom-red.log / dropdown-custom-green.log。

诊断 diagnostic-18 的中文六项及其余已运行项共 8 项通过，Menu 精确文本定位与回调得到浏览器确认。英文 Nested 固定子菜单标题为 Menu Item 1，中文为 Nested Menu Item 1；矩阵按 locale 精确断言，保留两语言原示例。已一次核对全部 12 个固定 live 片段与 spec 硬编码可见文案：四条 Events Toast 双语一致；Menu primary1/click primary 双语一致；源码工具栏按实际 DemoBlock 文案使用 查看源码/View source、重置/Reset、在线编辑/Edit online、退出编辑/Close editor。其他示例通过结构定位和完整文本对照，不额外假定中英文同文案。未修改 Demo 或参考适配。

诊断 diagnostic-19 中 54 项代表通过（含 Carousel 25/Cropper 16），Dropdown Trigger 英文失败来自测试假定与中文一样有第四个触发器，固定英文和 Vue 都只含 hover/focus/click。测试改为固定的双语 triggerKinds 列表并对双方真实触发器数量作精确断言；中文 contextMenu 与所有双语主题/方向矩阵保留，不按运行时实际数量缩减验收。

逐一结构复核 12 个固定片段及所有索引前提：Basic 双语均六项且第三项 disabled，键盘从第二跳第四成立；Nested 父菜单三项、前两项分别 rightTop/leftTop，子菜单各三项；Position 三个触发器且各三项；Trigger 中文四个/英文三个且各三项；Events 均四条事件项；Menu 均两个 title、一个 divider、五个 item，primary1 位于首项。矩阵增加这些关键数量与 Basic 禁用索引断言。文档在线编辑数量取重置初始值时，其值已由固定列表精确校验，不据缺失内容自动减小范围。未改正确的 Demo 或 adapter。

diagnostic-20 中英文 Trigger 的完整交互通过，但最终 console 门禁捕获固定英文第 4 块 `<Dropdown.Menu tabindex={-1}>` 的 React Invalid DOM property 警告/错误。参考 adapter 仅在 en-us/example4 对该完整片段作唯一命中校验后改为 React 正确属性 tabIndex，最终 DOM 仍是 tabindex=-1；中文原块已正确。未改 vendor、未屏蔽 console，未更改三种英文触发方式及其行为。固定两语言共 12 块通过适配后 JSX 编译检查，正式浏览器结论仍待统一运行。
