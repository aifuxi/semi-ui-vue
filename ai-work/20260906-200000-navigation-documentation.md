# AI 工作记录：Navigation 示例补齐与严格视觉验收

- 日期：2026-09-06
- 状态：完成（Navigation 文档批次）

## 目标

按既定路线推进 Navigation：完整保留固定中文 10 个、英文 12 个 live 示例，补齐双语说明及正式视觉/行为证据。

## 验收标准

- 同进程 Chromium，1440×900 DPR1，双语 light/dark，适用 RTL。
- 结构/文本/ARIA/关键 computed style 精确相同，每轴几何误差 ≤0.5px；组件和 Portal 独立截图阈值 ≤0.1，差异比例 ≤0.001。
- 选择、内联展开、折叠恢复、滚动、水平 Portal 键盘验证；正式完整矩阵无重试/跳过后才计入 accepted。

## 风险与假设

- 两种语言固定源码章节数、顺序、图标和组合布局不同，不能共用中文数据来伪造英文对照。
- 固定参考 live evaluator 容忍重复 import，英文组合类缺少 super；ESM 适配必须明确且局限。
- 代表用例发现 Navigation/Dropdown 运行时差异，验证范围已扩大到相关单测/SSR、全仓 Chromium 和真实发布包；不修改全局样式。

## 修改范围

Navigation 双语示例/章节/映射/许可、React 固定文档编译与注册、专属文档矩阵、Navigation/Dropdown 运行时与回归测试、现有对齐矩阵增量记录。

## 关键决策与权衡

- 两语分别移植；英文 Plain/HeaderFooter 两个额外示例放入 Basic 用例独立子步骤，保留中文10项覆盖统计单位。
- Combined 入口只负责组合独立视图。其余每个 SFC 承载一个简单示例，无需额外抽象。
- 图标来自既有公开包，使用 IconApps 对称替换官网 Logo；归属与文件 SHA256 纳入站点许可。
- 参考编译器需要增加一种文档入口，将使已有五批证据失效；稳定后通过正式入口一起刷新，不修改指纹追踪规则。
- 回退：同时恢复此批文档、示例、参考接线、矩阵与证据，避免内容/来源不一致。

- 折叠 SubNav 保留空箭头容器与 Collapsible 外壳；浮层 NavItem 不额外携带父 SubNav class，消除嵌套菜单多余缩进。
- 单 VNode 图标插槽解包后执行尺寸契约，Item 保留显式 size，SubNav 强制位置尺寸。
- Dropdown 对齐 hover 模式 focus/blur 与 Escape 回焦顺序；纯 focus 且指针不在 trigger 上时按固定 Tooltip.portalInserted 再关闭。曾怀疑参考窗口焦点竞争，经 Foundation 源码核验后排除该解释。
- RTL 验收容器采用绝对坐标；方向容器本身不作为组件节点。父弹层动效结束后再开嵌套层，用可见坐标移动指针避免 locator 自动滚动。未增加 mask、放宽阈值或更新快照基线。

- 全仓首次运行发现 JsonViewer 441 pass + 1 flaky（failOnFlakyTests 正确阻止通过）。经协议单测固定时钟/随机值复现 init 响应错投 validate；只在既有 Foundation Worker 边界用实例递增 ID 替换时间戳随机 ID，保持公开协议与固定 Worker 核心。此修复阻塞全仓验收，因此纳入本轮。

## 验证证据

- `git status --short`：开始时工作区干净。
- submodule status / describe：固定提交 cdfba6e520fc83ad871b30f51f36d8af3aaa5a21，v2.102.0。
- `accept:nuxt:batch --affected --plan`：开始时五批证据有效。
- CodeGraph status（本版本使用位置参数）显示索引就绪；query Navigation 显式指定本仓路径，结合 rg 与固定源码核验依赖。

## 最终验证与交付

- Navigation 52 项双语/明暗/适用 RTL 正式矩阵通过，保留中文 10 / 英文 12 个 live 示例；27 个新 SFC 包含 5 个组合视图依赖，取代旧页面的两个占位示例。注册示例净增 20，现为 1496。
- `pnpm --filter @workspace/docs accept:nuxt:batch navigation --affected`：六批 224 项全部通过，无重试/跳过/全局错误，运行前后指纹一致；共享一次公开包/主题/Nuxt 构建、Nuxt 类型、196 页内容与静态产物检查。最终账本为 722/859 mapped、43/859 accepted。
- `CI=1 pnpm exec playwright test tests/browser`：修复后 442 项全部通过，无重试；JsonViewer 专项 `--repeat-each=5 --retries=0` 25 项全部通过。
- Navigation/Dropdown 与 Worker/JsonViewer 共 7 个单元/SSR 文件、42 项通过；Worker 碰撞先得到确定性失败，再以实例 ID 修复后通过。
- UI、Foundation、参考应用、根工具类型检查及变更 ESLint/格式、源码边界、主题与 SSR 产物检查通过。最终构建后的 `pnpm verify:pack-dist` 安装、exports、ESM、类型、样式和 SSR import 均通过。
- 人工查看 Template dark、组合导航 light、英文 RTL 水平导航和嵌套浮层的 React/Vue 裁剪，未发现可见局部差异。没有新增 mask、降低阈值或更新宿主快照基线。
- 本节保留 2026-09-06 当时的验证结论；原始单元/SSR、浏览器、Worker 复现、检查与 tarball 日志，以及正式环境、样式、截图和源码哈希附件已按[清理说明](../docs/documentation/README.md)移除。

## 剩余范围

本轮完成 Navigation 文档批次，不代表全部 859 个示例验收完成。下一批为 OverflowList 4 项；其余文档、站点整体视觉与传递依赖许可审计仍按既定计划推进。未提交或发布。
