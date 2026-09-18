# AI 工作记录：Feedback 文档严格验收

- 日期：2026-09-11
- 状态：完成

## 目标与范围

按固定 v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21 验收 Feedback 七例的双语、明暗及 RTL；包含 Popup/Modal 真实动效、退出重开、成功提示与编辑器。开始于干净的 c933ef6，已有 101/859 项有效验收。

## 调查与关键决策

- 既有映射的 Custom 初始化和英文闭包修正在参考侧做同等最小适配，未修改 vendor。
- 首轮构建后内容检查发现新增相对链接不符合站点路由；改成双语绝对路径并定点通过内容检查，随后重建受影响站点。
- 首轮浏览器发现参考 Popup 贴底，Vue 离底 50px。浏览器 CSSOM 明确显示：参考聚合 CSS 的 SideSheet 固定定位规则排在 Feedback 规则后且优先级相同。固定公开入口顺序相反。批次适配器直接编译固定 Feedback SCSS 后加载，恢复原始 50px 间距及关键帧；不以 Vue CSS 作参考、不修改共享参考样式。
- 继续严格对照发现 Vue SideSheet 进入动画结束后保留 class。修复为独立记录 mask/content 动画阶段，在各自 animationend 清理；重开重新启动。进一步采集事件证明 Vue 退出只有 animationstart，没有 animationend：从状态变化起算的 180ms 定时器早于下一帧才启动的 180ms CSS 动画。移除该兜底，按固定源码等待真实 animationend。CSS 时长和公共 API 不变。此项真实组件差异没有在采样器中忽略。
- Completion 的弹窗像素差异定位在圆角及底边透出的文档背景；截图时统一 Portal 外宿主背景，保留被测弹窗与真实遮罩。修正后 Basic/Custom/Completion 双语六项通过，包括精确计时边界。
- 单选键盘态发现 opacity=0 的原生 input 被宿主通用 outline 命中；保留原始 computed 附件，只排除透明 outline 比较，外层实际 Semi 焦点环及像素保持严格。双语 Radio/Checkbox 四项通过。
- Modal 编辑器触发 Chromium 跨域沙箱原生 autofocus 限制；仅编辑器期间的完全匹配提示单列附件，应用异常仍阻断，实际打开和手动关闭必须成功。
- RTL 代表默认截图发现参考触发按钮离开视口，原因为宿主使用 relative + left 叠加 RTL 起始位置。改为两侧同物理坐标的 absolute 宿主对齐；组件布局和方向保持原状。
- 精确计时和真实编辑器使用独立页面。没有关闭被测动效、扩大像素容差或给失败增加重试。

## 验证与交付

- 定点 SideSheet/Feedback 单元与 SSR：4 文件、22 项通过。
- `pnpm check` 通过：格式、lint、源码类型、1207 项单测和工具测试；Nuxt 类型、内容和静态产物检查通过。后续仅变更批次采样器，另行执行 Nuxt 类型及本批 lint。
- `pnpm verify:ssr-dist` 与 `pnpm verify:pack-dist` 通过，真实 tarball 的安装、exports、ESM、类型、样式、SSR、tree-shaking 和 JsonViewer Worker 消费均通过；Feedback / SideSheet / Modal 三组件 Chromium 15/15 通过（11.4s），覆盖行为、明暗、RTL、几何与独立像素对照。
- 默认代表矩阵 22/22 通过（43.1s，零重试），包含全部示例双语首主题、暗色和方向敏感 RTL；人工检查英文暗色 RTL 的 Popup/Modal 成功提示截图。
- 正式 `accept:nuxt:batch feedback`：56/56 通过，零跳过、零失败、零 flaky；浏览器阶段 87.7s，复用有效公开产物与站点。证据为 `docs/documentation/evidence/feedback.json` 及 `feedback.report.json.gz`。
- 覆盖账本 108/859，剩余 751；既有十五批加本批共十六批、744 项正式组合。下一批 Notification 8 项。
- 本批剩余阻断问题：无；沙箱 autofocus 浏览器限制已单列记录，不代表编辑器内原生自动聚焦可用。提交按仓库自动提交约定执行，仅包含本批文件。
