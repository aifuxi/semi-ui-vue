# Toast 文档批次验收

固定基线 v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。Basic、Types、Colored、Links、Delay、ManualClose、Update、Context、Factory 九例，双语 × 明暗 × LTR/RTL，共 72 项正式组合；英文独有 Stacking 在 Basic 的 en-us 用例内额外覆盖。组件内部对齐修复使 ConfigProvider、Resizable、Typography 证据失效，四批共享一次公开包、主题与站点构建重验。

## 参考与适配

直接编译固定双语 Markdown。独立品牌替换 Bytedance→AIFUXI；英文 Other Types 固定示例的 `Hi,Bytedance dance dance` 缺一个空格，按 Vue 示例修正为 `Hi, AIFUXI dance dance`，其余文案逐字保留。

固定源码依赖三处 live scope 能力，均在批次适配器内补齐，不改共享构建别名：英文 Basic 的 `lodash-es` throttle 用等价 leading-only 实现替换；英文 Stacking 没有 `import React`；所有 `render(Demo)` 调用移除并导出命名组件。固定 `semi-ui/index.ts` 的组合导出 `export { default as Toast, ToastFactory }` 超出共享参考导入映射，这两个名字改走已公开的 `@semi-v2.102.0/toast` 别名。

Context 的 `title` 字段固定公开类型不消费，Vue 示例移除；Factory 参考沿用固定 DOM id，Vue 用模板 ref 与 `data-toast-container`，对照选择器不依赖该差异。双语文档的章节、API 与 React→Vue 迁移段落审阅有效；内部 `ToastCard` 仍不作为公开组件演示。

## 验证边界

组件侧对齐固定 `HookToast`：

1. `useToast` holder 改为逐条就地渲染裸 `ToastNotice`（内部 `ToastContextList`），空 holder 不渲染节点；命令式路径继续使用 wrapper/innerWrapper。
2. `ToastNotice.positionInList` 改为可选，hook 缺省时 `reservedIndex` 为 0，与固定 `HookToast` 不传列表位置一致。

比较 Toast 根节点的文本、语义、计算样式与几何：含 `role`/`aria-label`、`max-width`、RTL margin、`transform` 与 `animation-*`，各轴几何差 ≤0.5 CSS px。像素在 `.semi-toast-content` 上比较，threshold ≤0.1、差异比例 ≤0.001；因为 `theme="light"` 的填充是半透明的，截图期间只保留提示祖先链并把 `html/body` 背景统一为 `--semi-color-bg-0`，不裁剪或遮盖提示本体。

行为覆盖：3 秒与 10 秒自动关闭的 2999/3000、9999/10000 边界；`duration: 0` 60 秒常驻；同 id 更新内容/类型并在更新时刻重启计时；leading-only 10 秒节流、窗口内重复调用被忽略、关闭后取消节流；堆叠折叠与 hover 展开（含固定 `perspective` 3D 缩放）；重复展示去重与空操作关闭；自定义容器实例隔离与 fixed 定位；真实进出动效与编辑器内打开/关闭。计时在独立且不加载编辑器的页面用受控时钟验证。

两个方法学注意点：Vue 文档页所有示例共享同一个命令式实例，Stacking 对照前会重载页面以对齐参考页的全新实例状态；折叠采样前先进入再离开堆叠组，使 `mouseInSide` 复位（关闭后 innerWrapper 高度为 0 时，固定实现的 mouseleave 守卫不会再复位它）。

正式结果以自动生成的 evidence/toast.json 和压缩报告为准；诊断不增加 accepted。
