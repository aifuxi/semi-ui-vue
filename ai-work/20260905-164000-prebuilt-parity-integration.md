# AI 工作记录：预构建接入 Chromium 对照测试

- 日期：2026-09-05
- 状态：完成

## 目标

在不降低对齐验收标准的前提下，将浏览器运行时的按需编译移到测试启动前，降低加载等待与请求开销。延续加载实验，实际运行完整门禁后再决定 CI 是否切换。

## 验收标准

- 开发模式继续可用，预构建每次从当前源码生成，禁止复用未知或过期服务器。
- 保留相同 Chromium、环境、三 workers、retries 2、failOnFlakyTests、行为与视觉断言。
- 原始模块请求改为实际请求代码块的构建来源映射，不用静态白名单替代证据。
- 针对构建路径差异提供回归测试，跑 Linux 完整浏览器测试与相关质量检查。
- 不修改组件、vendor 或公开 API，不提交、推送或触发 Actions。

## 修改范围

- `scripts/serve-parity-build.mjs`：验证固定 vendor 后构建独立临时产物，启动静态预览并在退出时关闭服务。
- `scripts/parity-build-provenance.*`：生成来源映射，关联实际请求的代码块；验证转导出入口、跨来源请求和未请求的动态代码块。
- `scripts/parity-build-runtime.*`：只对测试构建处理 Prism 的隐式依赖和 Worker 的 sideEffects 元数据。
- Playwright 配置、package 入口和网络来源断言：支持显式 `PARITY_SERVER_MODE=build`，本地默认保留 dev；CI 浏览器 job 显式使用 build。Locale 的独立语言源码检查也使用来源映射。
- README 与对照测试文档：说明两种入口、来源证据、独立实验与回退方式。

## 关键决策与权衡

### 预编译开发环境，不替换成生产环境

- 首次直接 production build 导致 InputNumber 的开发期诊断断言失败。现有门禁以开发运行模式为基线，因此明确保留 development 环境，生产构建仍由质量门禁独立检查。
- 保留可读、未压缩产物方便诊断；关闭压缩本身未修复 JSON Worker 问题，不能把它宣称为根因修复。
- 两个应用各自独立 Node 进程，与正式 Playwright webServer 拓扑一致；不直接沿用第一阶段单进程 API 实验的性能数字。

### 来源证据

- 从构建器最终 chunk.moduleIds 生成映射；补充被优化掉的静态转导出入口，保留 Vue public 子路径证据。
- 遍历只补充未分配到实际代码块的静态依赖，不跨入其他已输出代码块，不跟随动态 import；未请求的代码块不能提供来源证明。
- 映射获取失败或格式错误必须失败，不回退为固定清单。原始 dev 网络路径验证仍保留。

### Prism 初始化顺序

- 本地完整预构建运行中 Chat、AIChatDialogue 报 `Prism is not defined`。固定源码在 foundation 中按 core、JSX、TSX 引入，但语言脚本本身依赖隐式全局，代码块拆分使顺序不再可靠。
- 编译时为 JSX/TSX 声明显式 core 依赖，TSX 同时声明 JSX 依赖；不新增语言、不修改 vendor 文件。
- 回归单测通过真实 Vite 构建并执行输出，证明共享语言表读取顺序；Chat/AIChatDialogue 浏览器对照验证实际第三方代码。

### JSON Worker 被裁剪为空

- 替换操作稳定失败，浏览器错误显示折叠模型未初始化。检查实际产物发现内联 Worker 的 `jsContent` 是空字符串，而非简单的等待不足或代码压缩问题。
- 固定 JSON core 的 package sideEffects 清单未包含源码 Worker，导入仅提供消息处理副作用，被构建器裁剪。
- 仅为 worker 构建中该精确入口返回 `moduleSideEffects: true`，不全局禁用 tree-shaking，不修改 worker 协议或组件逻辑。
- 回归单测用 sideEffects=false 的小型包证明未适配时消息处理器被消除、适配后实际消息往返可用。
- 这是测试构建修正；公开发布产物是否存在同类问题需另行验证，不能凭本轮宣称发布包已解决。

## 验证证据

- 所有本地 pnpm 使用全局 12.3.1，并设置 `npm_config_manage_package_manager_versions=false`。
- macOS 初始预构建 workspace/divider：8 项通过，包含来源、子路径、200 请求门禁、light/dark/RTL。
- 适配单测：5 项通过（2 个文件）。
- 首轮 Linux 全套（生产构建，修正前）：415 passed、14 failed、4 flaky，2.9 分钟，门禁失败；未将速度当成通过证据。
- 相关 Linux dev 对照：37 项通过，33.8 秒。
- 补齐 Prism、开发环境、Locale 来源后：35 passed、1 failed、1 flaky，30.3 秒；剩余 JSON 替换与 UserGuide 1 CSS px 几何抖动。
- 关闭压缩的专项：11 passed、1 failed，28.6 秒；JSON 问题仍存在，排除单纯压缩解释。
- Worker sideEffects 修正后 Linux JsonViewer：5 项通过，9.5 秒，含搜索替换、light/dark/RTL。
- 第二轮 Linux 全套：432 passed、1 flaky，2.3 分钟；仍按门禁失败处理，未以重试通过掩盖问题。
- 共享等待原来只检查自身与子节点动画，漏掉会改变几何的祖先弹层动画。新增真实 Chromium 回归先复现失败；加入祖先动画等待后，共享工具 6 项通过（7.1 秒），不改变几何/截图阈值。
- UserGuide 连续十轮复核：70 项通过、无失败/重试，38.7 秒。
- 最后一轮 Linux 全套：434 项全部通过，无失败、无重试，2.5 分钟，退出 0；使用 CI=true、build、3 workers、retries 2、failOnFlakyTests。宿主同时执行质量检查，计时不作为隔离性能基准，也不能外推 GitHub runner 的耗时。
- `pnpm typecheck:root`：通过（修改来源 helper 后）。
- `pnpm check`：退出 0；168 文件、1138 项单测全部通过，现有 statements/branches/functions/lines 覆盖率均为 100%，包括类型、lint、构建、主题、SSR 与真实 tarball 安装验证。
- 最终新增文档及 workflow 经单独 Prettier 检查通过；`git diff --check` 通过。
- 最终默认 dev 入口复核 workspace 与共享工具：9 项通过，3.7 秒；开发服务器路径和原始源码请求断言仍可用。

## 环境与诊断产物

- 沿用既有 act Linux arm64 容器；恢复其缺失的空 `.git/modules/vendor/semi-design/refs` 目录后，固定版本和只读状态验证通过，vendor 文件未改动。
- 首轮完整 HTML 报告已保存到 `/tmp/semi-prebuilt-full-evidence.80GIWQ/playwright-report/`，其中含失败附件。
- 最终通过报告已保存到 `/tmp/semi-prebuilt-gate-evidence.o6S7xc/playwright-report/index.html`；最后完整门禁日志为 `/tmp/semi-prebuilt-linux-gate.log`，质量检查日志为 `/tmp/semi-prebuilt-quality.log`。
- Linux 比较日志在主机 `/tmp/semi-prebuilt-linux-full.log`、`/tmp/semi-dev-comparison.log`、`/tmp/semi-prebuilt-comparison.log`、`/tmp/semi-prebuilt-worker-fix.log`、`/tmp/semi-prebuilt-linux-final.log`。

## 未验证事项与剩余风险

- 尚未在 GitHub runner 运行，不能将本地时间外推为云端承诺。
- UserGuide 十轮复核和最后完整回归均通过；没有降低 flaky 门禁或增加 retries。
- 正式构建模式与最初生产构建实验不同，需以最终完整测试计时作为收益证据。
- CI 配置已本地切换并通过完整本地门禁；未提交、推送或触发 Actions。工作区仅有本轮脚本、测试、配置和说明变更，无浏览器生成报告、coverage 或缓存进入待提交文件。
