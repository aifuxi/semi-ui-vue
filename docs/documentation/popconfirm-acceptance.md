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
