# AI 工作记录：ConfigProvider 严格视觉验收续行

- 日期：2026-09-06
- 状态：本批完成，未提交或发布。
- 授权：用户要求后续按推荐方案直接进行；未要求提交或发布。

## 目标与范围

继续当前 ConfigProvider 批次的三个双语示例，修复阻塞其严格视觉验收的消费者差异。固定只读 Semi v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21；不更新 vendor、不放宽 computed style/0.5px/0.1/0.001 门槛、不用 mask 隐藏组件差异。

## 实施与取舍

- DatePicker/TimePicker 区分新 UTC value 与仅时区变化的 zoned state，修复非受控更新、受控连续转换及同 tick 更新的重复转换。
- Typography 用项目既有 Tooltip/Popover 包裹完整文本，传递原 VNode 内容、opts 和 tooltip slot；保留 Popover 箭头三态。适配器以有限 render function 保留无需浮层时的原 DOM 根，根节点替换后重新观察 ResizeObserver。
- ConfigProvider 直接读取 typography-locale 注入键，消除 Provider→Typography→Tooltip→Provider 聚合入口的初始化循环；该循环由完整 Table 单测实际暴露。
- Tooltip 外层内容 class 按上游固定为 semi-tooltip-content；Popover 内层 class 保持不变。
- Modal 为 mask/content 分别清理已结束的入场 class，重开和 motion 变化时复位。
- Toast 两个渲染分支移除上游未设置的关闭按钮 aria-label，仍由 IconClose 提供名称，原生键盘关闭保留。

新增公开行为单测与双主题 Tooltip/Popover 浏览器矩阵覆盖连续时区、同步值更新、Modal 生命周期、原 VNode、slot、箭头缺省/false/true、首次自定义容器、Document 滚动定位、宽度恢复和卸载。文档场景补充绝对浮层定位、完整箭头裁剪、输入清除及键盘输入后 Tab 提交。

## 环境差异证据

- Nuxt dev 字体请求曾 NetworkError；使用既定静态预览重跑，未修改字体来源或使用替代字体。
- 截图居中操作让 Consumer 两端触发器纵坐标相差 46px；hover 前重新对齐参考场景根节点，而非移动 Tooltip，然后检查实际浮层绝对位置。
- Modal 的 computed style 与各节点 rect 完全相同，原 PNG 有 491 个原始不同像素，全部位于边缘；距各边 12px 以内部差异为 0。阈值检测差异为 132（0.186%）。两份原图保留在 `20260906-132900-modal-corner-reference.png` / `-vue.png`。
- 原因是透明圆角/边框采样两种文档壳。裁剪命令式 Portal 时临时统一 app 背景与 body Token 底色，保留真实遮罩/Portal/组件，随后恢复；不使用 mask、不内缩裁剪。Typography 滚动测试重新 hover 并等待动画终态，避免截图采到鼠标离开后的退出动画。

## 已完成验证

- 新回归在原源码 7 项中 6 失败；草稿注入后 DatePicker/TimePicker/Modal 的 37 项通过。原始证据见 pending 报告与日志。
- 全仓单测：173 文件、1175 项通过；随后 Toast 局部 ARIA 修正的 11 项定向测试通过。
- 全仓 Chromium：442 项通过，无失败/跳过/重试；随后 Toast 局部修正追加 5 项通过。全仓结果包含新增 8 项完整箭头浮层矩阵。
- UI/React/Vue 工作台 typecheck、工具 typecheck、修改范围 lint/format、源码边界通过。
- 文档静态构建与产物检查通过：196 页、搜索/历史入口、本地 REPL、许可和散列；证据校验器 10 项通过。
- 真实 tarball 安装/ESM/exports/类型/样式/SSR import 与 SSR dist 通过；Toast 最终产物已在正式验收构建后再次通过真实 tarball 与 SSR dist。
- 未运行聚合 pnpm check；按实际范围运行上述检查，共享 Portal 变化已触发一次全仓浏览器回归。Toast 后续局部改动仅追加直接受影响检查。

## 正式验收与最终审计

ConfigProvider 正式入口 `pnpm --filter @workspace/docs accept:nuxt:batch config-provider` 已通过，16/16 无重试/跳过/失败；范围包含双语、明暗、Direction LTR/RTL、三个编辑器路径、反馈关闭与 TimeZone 清除/键盘输入。证据为 `docs/documentation/evidence/config-provider.json` 和对应压缩报告。后续 Button/Icon 仅复用这次同源码下已完成的公开 JS/主题/Nuxt 构建、docs 类型与全站内容检查，分别重新运行完整浏览器矩阵；刷新前后指纹与 ConfigProvider 已验收证据都须保持一致，通过仓库 validateReport 后才能写入记录。复用来源写入各 evidence 的 checksReusedFrom，原始刷新日志另存。

## 最终结果

- ConfigProvider 16/16、Button 84/84、Icon 48/48，均无失败/重试/跳过；三批当前源码指纹、报告哈希和完整附件已由仓库 acceptedBatch/validateReport 验证。
- 最终映射 707/859、有效严格验收 28/859；README、文档总览和批次计划同步，下一批 Locale 3 项。本轮不把其余 831 项描述为已验收。
- Button/Icon 使用原完整矩阵和 DOCS_ACCEPTANCE 独占服务；只复用同一源码下已完成的公共构建、docs 类型/内容检查，不复用任何旧浏览器结论。每份 evidence 记录 checksReusedFrom 的 ConfigProvider 指纹及报告哈希。
- 最终真实 tarball 与 SSR dist、文档静态产物验证通过。没有新增 accepted deviation，没有更新任何旧截图基线。
- 所有任务修改均保持未暂存；vendor 无修改。测试服务清理后恢复 4321 Nuxt dev。
