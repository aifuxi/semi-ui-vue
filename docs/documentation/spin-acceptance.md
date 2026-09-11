# Spin 文档验收

固定参考：只读 Semi v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。

5 项双语示例均覆盖 light/dark 与 LTR/RTL，共 40 项；英文独有 Controlled（英文索引 6）在 Delay 的 en-us 用例内一并覆盖。逐节点比较公开 class、文本、ARIA、SVG、计算样式（含动画属性与 direction）与几何（各轴 ≤0.5px），截图 threshold=0.1、maxDiffPixelRatio=0.001，并逐 `.semi-spin` 局部裁剪比较。

默认指示符用实例唯一的线性渐变 id（React `getUuidShort`、Vue `useId`）。矩阵按 SVG 内 `[id]` 定义顺序把 paint server 解析为 `url(#definition-N)` 后比较，未解析的引用直接失败，因此不忽略 `stroke`/`fill` 的渲染差异，也不放宽容差。

Delay 示例保留真实 1000ms 延迟与真实时钟：点击后等待 `.semi-spin-wrapper` 可观察出现，并断言实际经过时间 ≥900ms；再次点击立即隐藏。Controlled 不设延迟，点击后立即出现。动画不关闭，截图在固定相位冻结后采样。

参考适配器直接编译固定 Markdown，只做 ESM 默认导出适配，不复制上游实现；Spin 不消费 locale 或 Provider 默认值，参考侧保持固定站原样渲染。中文示例恢复固定上游文案（`A basic spin.`、`I am loading...`、`Here are some texts.`、`And more texts on the way.`、`A spin with customized indicator.`、`延迟显示的spin`），与已验收组件保留上游 copy 的做法一致。

章节/API/迁移审阅：双语均保留固定上游章节与顺序（中文 11 个章节、英文 12 个）；引入示例统一为公开 Vue 子路径 `@aifuxi/semi-ui-vue/spin` 与独立 `@aifuxi/semi-theme-default/spin.css`。API 以真实公开类型为准：`size` 为 `small|middle|large`、缺省 middle，`spinning` 缺省 true 且为受控输入，`delay` 只延迟 false→true，`indicator`/`tip` 为 `VNodeChild` 且具名插槽优先，`childStyle`/`style` 为 `StyleValue`，`wrapperClassName` 合并到根；无 emits、`v-model` 或公开 ref。文档演示为客户端渲染，不作为 SSR/hydration 证据。

本批没有 accepted deviation；正式状态以 evidence/spin.json 的完整矩阵与输入指纹为准，诊断不计入 accepted。
