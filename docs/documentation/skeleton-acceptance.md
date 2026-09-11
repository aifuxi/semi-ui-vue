# Skeleton 文档验收

固定参考：只读 Semi v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。

8 项双语示例均覆盖 light/dark；除 Table 外的 7 项同时覆盖 LTR/RTL，共 60 项。逐节点比较公开 class、文本、ARIA、计算样式（含背景、动效与 direction）与几何（各轴 ≤0.5px），截图 threshold=0.1、maxDiffPixelRatio=0.001。Basic 覆盖开关切换占位/内容两个状态，Animation 在隔离动画相位 300ms 与 1000ms 采样，验证高亮动画真实推进且两侧同步。

参考适配器直接编译固定 Markdown，仅做 ESM 导出、本地素材替换与固定站环境复现，不复制上游实现。固定站每个示例都渲染在 `LocaleProvider`（只提供 locale）内，参考侧同样包裹；英文 Table 片段把 `dataIndex` 写成数字，只触发 React propTypes 警告，参考侧对齐中文片段与本站示例的字符串写法。

上游示例图片为远程 CDN（中文 dy.png、英文 avatarDemo.jpeg），本站与参考统一使用既有本地 `/demos/photo.svg`：图片视觉内容与上游不同，但双侧同源同尺寸，几何与像素比较仍然逐项成立；该替换沿用 Accessibility 批次的既有约定。

Table 示例有一个限定差异：固定站没有 ConfigProvider（只有 locale Provider），React Table 的 `direction` 因此是 `undefined`，输出 `class="semi-table-wrapper-undefined"`；Vue Table 按公开契约把缺省 direction 归一为 `ltr`，输出 `semi-table-wrapper-ltr`。固定 `table/table.scss` 只为 `-wrapper-ltr` 写入 `direction: ltr`，在文档站实际渲染的 LTR 页面里两侧计算样式、几何与像素完全一致，矩阵只把这两个「无显式方向」输出映射为同一 class。在合成的 RTL 容器下 React 会继承 `direction: rtl` 而 Vue 保持 `ltr`——这是「未设 Provider」与「公开缺省值」两种配置的差异，固定站与本站文档都不会渲染这种组合，因此该示例不设合成 RTL 用例；Table 自身的 `-wrapper-rtl` 路径没有任何示例设置 `direction`，属于 Table 文档批次范围。除此以外本批没有 accepted deviation。

RTL 有意义：`.semi-rtl .semi-skeleton { direction: rtl }` 会改变占位根内部的文本方向与 flex 行顺序，因此除 Table 外的 7 项都纳入 RTL 矩阵，而不是只取方向敏感子集。

Basic 的 Switch 在两侧都可切换 loading；断言占位数量、`aria-checked` 与内容组件（Avatar/Button）同时变化。双语 light/LTR 执行每项源码、重置、实际在线编辑与退出恢复，编辑为真实 Monaco 运行。

章节/API/迁移审阅：双语均保留 12 个上游章节与 8 项顺序；引入示例统一为公开 Vue 子路径 `@aifuxi/semi-ui-vue/skeleton` 与独立 `@aifuxi/semi-theme-default/skeleton.css`，英文概述改用 `SkeletonAvatar` 等 Vue 名称，与中文页及 API 章节一致。API 以真实公开类型为准：`active`/`loading` 为布尔 prop，`placeholder` 为 `VNodeChild` 且 `#placeholder` 优先，五个子组件为独立具名导出并保留 `Skeleton.Avatar` 等复合形式，`rows` 默认 4、`size` 默认 medium、`shape` 默认 circle。`loading` 为单向 prop，无 emits/v-model。文档演示为客户端渲染，不作为 SSR/hydration 证据。

正式状态以 evidence/skeleton.json 的完整矩阵与输入指纹为准，诊断不计入 accepted。
