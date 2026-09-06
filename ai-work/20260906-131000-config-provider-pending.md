# AI 工作记录：ConfigProvider 剩余差异续验与待批准补丁

- 日期：2026-09-06
- 状态：补丁待确认；ConfigProvider 严格验收仍为 in-progress。

## 目标与验收标准

继续当前 ConfigProvider 示例批次，关闭 TimeZone、Consumer、Direction 的严格验收阻塞。继续使用只读 v2.102.0（cdfba6e520fc83ad871b30f51f36d8af3aaa5a21）、同进程 Chromium、1440×900 DPR1、双语 light/dark 及适用 RTL；computed style 精确一致、几何 ≤0.5 CSS px、截图 threshold ≤0.1 / ratio ≤0.001，不增加 mask。

## 调查与权限边界

工作区开始时干净，当前提交 d1b807b。上次记录明确将时区更新、Typography Tooltip/Popover 集成、Modal 动画清理留作未批准的新运行时修复。本次先准备可审阅补丁，以测试配置的 load hook 临时加载草稿，未应用到正式组件源码。

CodeGraph CLI 的 `codegraph status --path /Users/chen/fc-studio/semi-ui-vue` 返回 unknown option；本次使用精确源码搜索、组件调用链及公开行为测试补足调查。

## 已生成补丁

文件：`20260906-131000-config-provider-pending.patch`，包含三个生产文件和一个新增回归测试文件。

- DatePicker：按上游 datePicker.tsx:417 的分支，公开 value 变化优先作为 UTC 输入初始化；只有时区变化时，将 state.value 从旧时区转换到新时区。这一分支同时服务受控和非受控模式，避免重复转换公开值。
- TimePicker：按上游 TimePicker.tsx:305 合并 value/timeZone 监听；value 变化时不传旧时区，时区变化时使用当前已转换的 state.value。连续切换与同 tick 更新只执行一条转换路径。
- Modal：按上游 Modal.tsx:377 和 _cssAnimation/index.tsx 的独立动画状态，为 mask/content 分别记录是否仍在动画中；结束后清除对应 class，重新打开或切换 motion 时重置。保留现有关闭收敛路径。
- 新增 7 项公开行为回归：两种 Picker 的受控/非受控连续时区切换、同时更新 value/timeZone、随后单独更新 value、不发出 change，以及 Modal 两层独立动画结束与关闭/重开。

推荐应用此补丁。备选是保留源码与失败状态；示例 remount、硬编码日期或移除动画 class 的测试归一化会掩盖消费者缺陷，不采用。影响是日期时间显示转换和 Modal 动画终态，公开 API 不变；回退为逆向应用该补丁，验收恢复未通过。

## Consumer 后续方案

尚未生成 Typography 补丁。源码 typography/base.tsx:739 使用正式 Tooltip/Popover 包裹完整 Typography 节点，内容保留原 children；Vue 当前在内部手写 Teleport 和固定坐标，缺少完整箭头及定位行为。

推荐用项目现有 Tooltip/Popover 完成该内部集成，保留当前 ellipsis props 与 tooltip slot，并覆盖默认 Tooltip、Popover opts、溢出/恢复、容器与滚动、卸载、SSR 及对应样式入口。此方案增加 Typography 对现有浮层实现的内部依赖，可能影响其子路径加载体积；需要同时核验依赖环、构建和真实包样式。备选是独立补写完整浮层逻辑，重复维护成本高，不推荐。回退可独立撤销 Typography 集成，不影响日期/Modal 补丁。

## 已运行证据

1. 正式源码上运行新增 7 项回归：6 failed / 1 passed，证明日期非受控更新、受控连续转换、value 更新和 Modal 入场清理缺陷。日志 `*-before.log.gz`。其中 TimePicker 非受控连续转换原已通过。
2. 临时加载草稿后运行新增回归及 DatePicker/TimePicker/Modal 的全部单元与 SSR 测试：7 文件、37/37 passed，无生产文件替换。命令：`REVIEW_PATCH=1 pnpm exec vitest run --config .config-provider-review.config.ts packages/ui/src/config-provider/PendingConsumers.test.ts packages/ui/src/date-picker packages/ui/src/time-picker packages/ui/src/modal`。临时配置和测试源已清理；新增测试保留在补丁内。日志 `*-after.log.gz`。
3. 正式静态产物定向 Chromium：`pnpm --filter @workspace/docs exec playwright test -c playwright.config.ts config-provider-matrix.spec.ts --grep 'zh-cn light$' --retries=0 --reporter=json`，3 failed / 0 passed。诊断运行不重试，不作为 acceptance 入口；没有更改仓库 retries 配置。
   - TimeZone：GMT+00 后 React 为 2020-02-13 13:08:25，Vue 仍为 21:08:25。
   - Consumer：Tooltip 比较节点数 React 3 / Vue 2。
   - Direction：Modal 多出 semi-modal-content-animate-show，transform 为 matrix(1, 0, 0, 1, 0, 0)，React 为 none。
   - 报告 `*-before.static.browser.json.gz`，含比较附件与截图。
4. 首次复用 Nuxt dev 时三个场景均在 document.fonts.load 处 NetworkError；该运行只作为环境诊断记录 `*-before.browser.json.gz`。随后暂时停止 dev，使用既定 static preview 重跑得到上述真实差异；4321 Nuxt dev 已重新启动，测试启动的 reference/static 服务由 Playwright 清理。
5. 草稿和测试使用项目 Prettier 配置格式化；补丁通过 `git apply --check`，最终 `git diff --check` 通过，vendor 与生产源码未修改。

## 未验证事项

补丁尚未经过 Chromium、typecheck、build 或真实 tarball 验证，不能宣称视觉修复完成；Modal 的 DOM animationend 单测不能替代真实动画证据。Consumer 的方案尚待实施。双语明暗完整矩阵、RTL、后续 Toast/编辑器路径仍待完成。

本次不改变 coverage/evidence/README 完成数量，不提交或发布。应用确认后先完成上述运行时修复与定向严格验收，再按实际依赖影响刷新已有批次证据。

## 后续授权

用户随后明确要求“后面有什么需要确认的都按你推荐的来，我不review了，直接继续进行”。上述补丁已应用，Typography 集成及后续必要修复按推荐方案继续；本文前述“待确认”是当时的阶段记录，最终结果见后续验收报告。
