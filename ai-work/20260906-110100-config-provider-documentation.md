# AI 工作记录：ConfigProvider 示例补齐与严格验收

- 日期：2026-09-06
- 状态：两份已批准补丁和回归完成；ConfigProvider 剩余时区、Tooltip、Modal 差异未通过

## 目标与验收标准

按既定批次补齐 ConfigProvider 的三个固定上游 live Demo 双语映射，并执行同进程 Chromium 1440×900 DPR1、双语、light/dark、适用 RTL 的严格对照。computed style 精确一致、几何各轴 ≤0.5px，逐组件截图 threshold ≤0.1、maxDiffPixelRatio ≤0.001；不放宽阈值或更新基线隐藏差异。

## 范围与决策

- TimeZone、Consumer、Direction；Direction 按上游 Buttons/Input/Navigation/Display/Feedback 拆分，主示例只管理方向。
- React 示例直接从固定 submodule 读取；导入适配支持 ConfigConsumer、Row/Col、Toast。第三个上游示例遗漏 Toast 导入，入口只补该绑定；ghost=false 的固定 React 警告单独记录。
- Consumer 用显式字段顺序展示上下文，保持上游 JSON 展示顺序；不补造缺失的配置字段。
- 文档站的全局 box-sizing 与 font reset 不应进入组件/Portal；正文 overflow-wrap:anywhere 不应改变示例的 min-content。修复站点 CSS，并把相关属性加入矩阵。
- 用户已明确授权应用 `20260906-110100-config-provider-runtime.patch`：ConfigProvider 直接复用已有集成入口的完整 pinnedLocale_zh_CN；DatePicker readonly class 跟随 inputReadOnly/insetInput。未复制 vendor 数据，构建沿用现有归属/SBOM 管线。
- 回退两处运行时变更即可恢复旧默认配置和 class 行为；示例、严格测试和失败证据可独立保留。

## 初始失败与定位

- 初始完整文档矩阵 16 项均被严格门禁拒绝，无 accepted 记录。
- DatePicker 默认非 readonly 仍输出 semi-datepicker-input-readonly。
- 默认 Locale 缺少 dateFnsLocale、DatePicker、TimePicker、Chat 等完整上游字段。
- 站点 border-box 使 TextArea counter 从 32px 缩到 24px，引起后续布局 8px 偏差；overflow-wrap:anywhere 使 Suffix 从单行变为两行。
- 新增公开 Consumer/SSR 与 DatePicker 三态回归：修复前 3 失败、1 通过，补丁应用后定向 ConfigProvider/DatePicker 23/23 通过。
- 全仓单元首次 1153 个断言通过，但出现两个 JsonViewer Worker 未处理 rejection，因此该次不算通过。固定上游使用 Date.now()+Math.random() 作为请求 ID，在 epoch 数值下存在小数精度碰撞；同步 TestWorker 改用递增 Date.now fixture，不修改生产 Worker 或增加重试。随后全仓 170 文件、1153/1153 通过，无未处理错误。

## 验证证据

- `pnpm test`：170 文件、1153/1153 通过，无 unhandled rejection（`/tmp/config-all-unit-fixed.log`）。
- `CI=1 pnpm test:browser`：434/434 通过，无重试、无快照更新（`/tmp/config-all-browser.log`）。这验证组件工作台既有场景，不替代新增文档组合示例矩阵。单元/浏览器/发布包原始日志另归档于 `20260906-110100-config-provider-regressions.json.gz`。
- `pnpm verify:pack-dist`：真实 tarball 安装、exports、ESM、类型、样式、SSR import 通过；新增完整默认 Locale 与 DatePicker readonly 三态消费验证（`/tmp/config-pack.log`）。
- 受影响 UI/reference/docs typecheck、源码边界、SSR dist、文档构建与内容检查通过；文档证据校验器 10/10 通过。未执行聚合 `pnpm check`，未宣称整个文档批次通过。
- ConfigProvider 完整文档矩阵初始 16/16 失败，首轮补丁后定向 4 项仍未通过。失败报告压缩文件保留在本目录。
- Consumer 在显式定格 CSS animation 到 1000ms 后，zh-CN/en-US × light/dark 四项均以 24px 内容宽度差失败。已保存 `20260906-111500-config-provider-consumer-settled.report.json.gz`，其中嵌入实际失败截图；没有更新 accepted 证据。

## 剩余事项

- 第二份候选补丁 `20260906-111500-config-provider-consumers.patch` 后续已获用户确认并应用，详见本记录续验及 `20260906-114000-config-provider-consumers-verification.md`。涉及 DatePicker 图标 ARIA、TextArea 默认 class、Checkbox card enable class、Switch 原生 aria-checked 默认状态、Steps 点击状态、TimePicker 触发节点和 Navigation 默认箭头/ARIA。补丁内 7 条公开契约测试在当前实现中全部失败；`git apply --check` 通过。
- 独立检查又发现 Typography 手写 Tooltip 的宽度、箭头和定位差异；尚未修改，也不包含在第二份候选补丁中。动画定格后仍可复现，不能作为动画噪声豁免。
- ConfigProvider 严格前置门禁未通过，后续键盘/命令式反馈/在线编辑器完整路径不能声称验证完成。
- Button 因共享源码和文档站 CSS 变化完成证据刷新：`pnpm --filter @workspace/docs accept:nuxt:batch button` 84/84 通过，无重试/跳过，源码指纹验证通过，恢复 17 项有效验收。Icon 同入口批次 48/48 通过，无重试/跳过，恢复 8 项有效验收。最终映射 707/859、有效严格验收 25/859，ConfigProvider 三项不计入通过。
- 不自动提交或发布。

## 最终审计

- Button/Icon 两批当前源码指纹重新计算一致；有效严格验收保持 25/859。
- `pnpm --filter @workspace/docs check:dist` 通过：196 页、搜索/历史入口、本地 REPL、许可及文件散列。
- `git diff --check` 通过，vendor 工作区无修改；未暂存、提交或发布。
- 测试启动的 4173/4321 服务已清理；恢复 4321 Nuxt 开发服务。

## 第二份补丁确认后的续验

- 用户明确回复“确认”，应用第二份消费者补丁。DatePicker 原补丁遗漏单日期分支，已补齐 date/dateTime/dateRange/dateTimeRange 并验证装饰图标。
- Steps 对照固定源码，将是否注入 handler 与监听器存在性绑定；当前项保留点击 class，但 handler 不通知 change。通过真实父组件动态增删监听器验证更新。
- Navigation 的 aria-expanded 经 Dropdown 克隆覆盖，单改 title 不生效。为完成已授权的导航 ARIA 修复，Dropdown 内部状态和触发器保留缺省 visible，显式 false/true 及后续状态转换保持布尔值；未引入公开 API。
- 首轮受影响单元 107/107 通过；最终全仓单元 171 文件、1164/1164 通过，无未处理错误（`/tmp/config-second-all-unit.log`）。
- 受影响组件/工作台 Chromium 44/44 通过；Dropdown 下层修复后追加 Navigation/Dropdown 10/10 通过，未更新快照。此次未重复全仓 Chromium；修改范围为组件运行时，使用直接受影响场景。
- UI typecheck 与修改范围 lint 通过。真实 tarball 首轮验证通过；最终包将在源码构建完成后再次验证 Dropdown 改动。
- 文档夹具：精确 option 名称不含上游可访问图标名导致等待，改按选项文本选择；统一 CSS 动画定格至 300ms，Tooltip 为 1000ms。显式等待双方示例挂载和 Inter 字体载入，避免假通过。
- 开发 Nuxt 预览的跨端口字体加载失败，不能作为同字体证据。只使用正式静态预览执行验收；开发预览失败结果不计 accepted。
- 原 16 项组合运行因选项等待问题中止，后续定向运行继续定位，均未计入 accepted。Button/Icon 当前源码证据刷新中。
