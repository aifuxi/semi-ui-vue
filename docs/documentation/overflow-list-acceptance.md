# OverflowList 文档验收

固定参考：只读 Semi v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。

4 项双语示例均覆盖 light/dark 与 LTR/RTL，共 32 项。选中范围为 `[class*="semi-"], input, button, svg path, br, p, span`，因此列表项、Tag 内容与图标、Slider 手柄与边界都进入比较。逐节点比较 class、属性（含 role/aria-*/tabindex）、文本、关键计算样式（盒模型、定位、字体、颜色、背景、flex、过渡相关）与几何（各轴 ≤0.5px）；整体截图 threshold=0.1、maxDiffPixelRatio=0.001。

## 本批修复与对齐

- **组件修复：隐藏项计数不再滞后**。折叠模式下 `+N` 与滚动模式两端的边缘计数此前停留在首次渲染值：折叠模式把 overflow 渲染器放在 computed 中调用，VNode 在渲染之外创建；滚动模式把槽位直接渲染在模板里，而 Vue 会跳过 props 未变化子组件的 stable 槽更新。组件改为在渲染期调用 overflow 渲染器，并在隐藏项变化时以隐藏项键重建折叠包装节点与滚动边缘片段（折叠模式仍只在渲染器返回可渲染内容时输出 `.semi-overflow-list-overflow`，与固定实现的 `isValidElement` 判定一致）。
- **回归用例**：`OverflowList.test.ts` 增加「槽内容随容器宽度重新渲染」「槽位用组件封装计数时同样随隐藏项更新」「槽位没有可渲染内容时不渲染溢出包装节点」三项，旧实现无法通过。
- **示例按固定上游收敛**：去掉迁移时为 Slider 额外添加的 `aria-label`（固定片段没有该属性），其余结构与文案与固定片段逐字一致。
- **参考适配器**：新增 `apps/reference-react/docs-adapters/overflow-list.mjs`，补上固定片段漏写的 `useState` 导入、把匿名箭头示例命名为默认导出，并把固定片段的 `>+{n}<` 规范为单个文本子节点。
- 组件修复只改动 OverflowList 自身，未触碰 Foundation、主题与共享参考壳；`--affected --plan` 显示历史 32 批证据仍然有效。

## 限定等价项

- **`>+{n}<` 的文本节点分段**：React 的 JSX 把 `+` 与表达式渲染成两个子节点，使 Tag 走 `center` 分支、不推导 `Tag: +N` 且字形宽度差约 0.016px；Vue 模板只能把同一文案合并成一个文本节点。参考适配器把该表达式写成等价的模板字符串，使两侧渲染同一文本节点后再严格比较文本、类名、属性与几何。
- **根外生成的实例 id**：Slider 的 `aria-describedby`/`data-popupid` 指向根外弹出的元素，不在根内 id 表内；矩阵按出现顺序把它们归一为稳定 token 后比较，根内 id 仍按定义位置归一（缺失、重复或重排会失败）。
- **滚动模式边缘计数等待终态**：边缘计数由 IntersectionObserver 异步给出，矩阵等待两侧计数停止变化后再比较，不猜中间帧。

除上述来源明确的等价项外，没有放宽裁剪、容差或门槛，也没有其它未解释差异。

## 交互覆盖

- 每个示例都用真实滑块把手（键盘方向键，按页面实际方向映射）把容器收窄到文档描述的位置：Collapse 50%、CollapseFromStart 30%、MinVisibleItems 20%、Scroll 60%，并比较收窄后的结构、`+N` 与截图；折叠示例同时覆盖恢复宽度后 `+N` 消失。
- 滚动模式另等待两端边缘计数稳定，覆盖 IntersectionObserver 更新路径。
- 双语 light/LTR 另执行源码展开/收起、重置与在线编辑 iframe 内的实际渲染与退出恢复。

## Slider Portal 键盘锚点补充

全部示例的 narrow 键盘阶段保留最终把手焦点，在根预览截图之前，等待可见 `.semi-slider-handle-tooltip` 的 top 方位及水平中心落在把手中心（误差≤0.5px）的可观察终态，不增加固定等待。随后独立比较浮层根和子孙的属性、class、关键样式、几何与截图，保存 `narrow-tooltip-anchored-geometry`：各侧水平中心须≤0.5px，浮层相对把手的 x/y/width/height 跨侧误差也须≤0.5px。实例 id 按该浮层根内定义归一，Portal 外部文档坐标不直接互比；截图门槛不变。

该补充防止仅比较文档根子孙时遗漏 Portal 定位偏移，覆盖全部双语、明暗与方向 narrow 状态。历史 Scroll dark 的把手 Tooltip 曾水平偏移约9px，原根内样式和几何检查无法捕捉；完整证据以新矩阵为准。

## 章节/API/迁移审阅

双语保留固定上游章节与顺序（代码演示/如何引入、折叠模式 - 默认/方向/最小展示的数目、滚动模式、API 参考），另补迁移表与滚动模式结构差异说明。API 以公开 Vue 类型与固定 Adapter 为准：`items`、`renderMode`、`collapseFrom`、`minVisibleItems`、`threshold`、`overflowRenderDirection`、`itemKey`、`class`/`className`/`style`/`wrapperClassName`/`wrapperStyle`，插槽 `#visibleItem`、`#overflow` 与事件 `@overflow`/`@intersect`/`@visibleStateChange`。审阅明细与指纹见 `mappings/overflow-list.json` 的 `review`。

正式状态以 `evidence/overflow-list.json` 的完整矩阵与输入指纹为准，诊断不计入 `accepted`。
