# 本项目的 Playwright CLI

在仓库根目录运行命令，使用项目锁定的 Playwright 1.62.1。CLI 与自动测试默认通过 `channel: 'chromium'`、`headless: true` 使用完整 Chrome for Testing 的新 headless 模式。CLI 配置位于 `.playwright/cli.config.json`，组件回归配置位于 `playwright.config.ts`，真实安装包浏览器消费配置位于 `playwright.consumer.config.ts`；组件与 consumer 浏览器测试均在本地执行。

## 探索与调试

- 使用 `pnpm playwright:cli --help` 或具体命令帮助核对当前版本的参数；无需全局安装，不使用下载 latest 的 npx 命令。
- 先检查已有本项目服务和日志。Storybook Vue／React 手动入口分别为 `pnpm dev`、`pnpm dev:reference`，端口为 4174／4173；服务由一个执行者管理。正式 `pnpm test:browser` 自行构建并启动 React/Storybook preview，不复用这些手动服务；`pnpm test:browser:dev` 用于开发服务诊断。
- 创建独立命名会话，例如 `pnpm playwright:cli -s=semi-switch open 'http://127.0.0.1:4174/iframe.html?id=parity-switch--scenario&viewMode=story'`；主题、方向、语言使用 Storybook globals。后续命令沿用相同 `-s`；使用最新 snapshot 的引用，页面变化后重新获取，不能猜测引用编号。
- CLI 默认没有浏览器窗口；需要现场观察时显式给 `open` 添加 `--headed`。自动测试可用 `pnpm exec playwright test tests/browser/components/switch.spec.ts --headed` 临时观察。
- 调试现有失败测试时，使用 `pnpm exec playwright test <spec> --debug=cli --workers=1 --retries=0`，保持测试进程运行，等到其输出调试会话名后用 `pnpm playwright:cli attach <tw-session>` 连接。沿用测试 fixture 的页面、主题与来源设置。
- 结束时关闭本次命名会话并停止本次启动的调试进程。不要用 `close-all`／`kill-all` 干扰其他任务。重新运行目标正式测试，以实际退出码确认结果。

## 契约与证据

- 唯一行为基线是只读 `vendor/semi-design` 的 `v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。以现有组件契约组织场景，不额外创建通用 seed／plan 账本或机械限制每个文件只能有一个测试。
- CLI 的录制结果用于提取操作和稳定 locator，必须补充公开行为断言。Vue 当前页面的表现不能作为预期值来源；React／Vue 来源核验和正式几何／像素比较仍由项目测试负责。
- 通用 test-generation／heal 指引涉及按页面现状改写预期、`fixme` 或扩大容差时，改为先核对固定 Semi 契约并修复真实缺陷；失败、跳过和 flaky 不计验收通过。不要用固定等待、重试或覆盖旧图片制造通过。
- 自动回归默认 3 workers、0 retries。CLI 临时操作不会替代 `pnpm test:browser`、`pnpm test:consumer`、Vitest dom/node 或发布检查；CI 静态与 Node 产物检查通过也不能替代本地组件结果。
- 默认输出进入 `test-results/playwright-cli`；手动指定截图、trace、状态文件路径时也放入已忽略的 `test-results`。只提交仍被正式测试使用的快照基线。

现行入口见 [工具链](../../../../docs/architecture/toolchain.md) 与 [验证入口](../../../../docs/testing/validation.md)。
