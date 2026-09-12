# ScrollList 文档验收

固定参考：只读 Semi v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。

本批为 `show/scrolllist` 唯一示例，双语、light/dark、LTR/RTL 共 8 项正式矩阵。当前文档记录矩阵设计和源码审阅；实际状态以 `evidence/scroll-list.json` 的完整报告与输入指纹为准，诊断不能计入 accepted。

## 参考适配与来源

固定 `content/show/scrolllist/index.md` 和 `index-en-US.md` 的第 1 个 live 示例具有相同三列结构、初始索引 1、时段非循环、小时与分钟循环、type=1/2/3、小时/分钟选择日志以及只输出 close 的 Ok 按钮。

- 原片段匿名箭头函数转换为具名默认导出，保留 useState 与真实回调。
- 原片段在函数内以 `Math.random() > 0.5 ? true : false` 生成每分钟 disabled，每次选择重新渲染时数据也会改变。参考适配器仅将该表达式替换为 `index % 2 === 0`，与现有 Vue 演示固定偶数分钟禁用一致；保留 60 项、混排与初始可选分钟 1，不更改全局随机函数。这是明确的确定性演示数据适配，偶数分布本身并非固定上游指定。
- 双语 Vue 示例已有时段/小时/分钟列标签；参考侧依照固定上游 Accessibility/ARIA 章节支持的 aria-label 增加相同标签。标签进入属性精确比较，不过滤无障碍属性。

不修改 vendor、共享参考运行时或组件实现，不用 no-op 替代演示功能。

## 严格矩阵设计

选中 `[class*="semi-"], ul, li, button, svg path, span`，包含滚轮副本与所有禁用/启用选项。节点数量、class、文本、属性（role、aria-*、tabindex 等）和关键 computed style 精确比较，几何各轴差 ≤0.5 CSS px；完整示例局部截图 threshold=0.1、maxDiffPixelRatio=0.001。仅忽略样式序列化、class 排序与 Vue data-v 属性，实际 class 与计算样式仍比较；局部生成 id 按定义位置归一。

先独立等待 React 三列初始选中项居中，再加载 Vue；真实时钟等待选中 class 与选择线几何终态，不用固定延时猜测动画。

首轮诊断在 React 初始状态发现前置断言错误：固定 `scrollList.scss` 的 selector 使用 36px 内容高度并带上下各 1px 边框，通过 `top: 50%` 与 `translateY(-50%)` 居中；选项为 36px border-box，因此顶部本来相差 1px。前置状态检查已改为比较两者纵向中心，仍要求差 ≤0.5px。此修正不改变 React/Vue 逐节点几何比较、截图门槛或组件源码，修正后 4 项代表诊断通过，完整状态仍以正式证据为准。

每个用例设计覆盖：

- 初始下午/PM、2 点、1 分的结构、样式、几何、截图。
- 点击上午/AM、3 点、3 分，等待受控状态居中；点击禁用 4 分后仍为 3 分，再比较三列状态。
- 小时列真实鼠标滚轮移动两项，等待 5 点居中，再比较完整结果。
- 点击 Ok，观察真实 close 控制台日志且列表仍可见。
- 双语 light/LTR 另验证源码完整一致、展开/收起、重置恢复初始三列、在线编辑 iframe 内实际加载、退出恢复。
- 所有用例收集 pageerror 与 console.error，结束时必须为空。

## 章节/API/迁移审阅

双语已核对如何引入、基本使用、ScrollList/ScrollItem/ItemData API、ARIA 与设计变量，补足原页面缺少的 ItemData 字段表和设计变量说明。API 与 `packages/ui/src/scroll-list/types.ts` 及固定 Adapter 对照，记录 header/footer 插槽优先、受控 selectedIndex、select 载荷与禁用规则。补齐 React → Vue 段落及本页已有锚点目标。

固定文档声称 aria-selected，但 `packages/semi-ui/scrollList/scrollItem.tsx` 明确注释掉该属性；页面如实说明以固定源码 DOM 为准，没有方向键状态机或 roving tabindex。此差异不作为视觉豁免。

审阅指纹见 `mappings/scroll-list.json` 的 review；正式执行后才能确认上述矩阵通过。
