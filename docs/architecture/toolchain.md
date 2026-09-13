# 工具链与 IDE

Node.js 与 pnpm 的精确版本由根 `mise.toml` 管理；`package.json` 声明引擎和包管理器契约。`pnpm check:toolchain` 核对配置与实际版本，已纳入日常 check。

## 本地准备

```bash
mise trust
mise install
mise exec -- pnpm install --frozen-lockfile
mise exec -- pnpm check:toolchain
```

个人终端可用 `mise activate zsh` 自动切换；未激活时使用 `mise exec -- pnpm …`。无需额外启用 corepack 或全局安装 pnpm。

## WebStorm

共享运行配置在 [.run](../../.run/)，打开项目即可识别：

| 配置名称               | 用途                  |
| ---------------------- | --------------------- |
| `pnpm check:toolchain` | 验证 IDE 的 Node/pnpm |
| `pnpm check`           | 日常源码集成          |
| `pnpm check:artifacts` | 公开产物与真实包消费  |
| `pnpm check:full`      | 全量回归              |
| `pnpm release:check`   | 发布候选验证，不发布  |

配置使用 `$PROJECT_DIR$`、项目 Node runtime 和 `pnpm` 别名。首次设置项目 Node interpreter 与 package manager 时，分别选择 `mise which node`、`mise which pnpm` 返回的位置。升级版本后运行 `pnpm check:toolchain` 复核。

MCP 先用 `get_run_configurations` 获取名称，再用 `execute_run_configuration` 执行。npm 配置不支持动态参数覆盖；指定单测文件、浏览器 spec 或一次性环境变量时用 IDE 终端。长任务以实际退出码和日志判断结束，不能把启动成功当作检查通过。

CodeGraph 用于已索引代码的符号与依赖分析；配置、文档、索引遗漏或过期内容用定向读取补足。个人 MCP 连接保存在本地配置中，`.codex/config.toml` 不入库。

## 本地 Playwright

本地自动测试继续使用 `pnpm test:browser`，默认 3 workers，并以 `channel: 'chromium'`、`headless: true` 启动完整 Chromium 的新 headless 模式。先运行 `pnpm playwright:install` 准备浏览器；定位问题时可用 `pnpm exec playwright test <spec> --headed` 运行指定用例并临时打开窗口。

`pnpm playwright:cli` 复用已锁定的 `@playwright/test@1.62.1` 所带 CLI；对应官方 skill 安装在 [.agents/skills/playwright-cli](../../.agents/skills/playwright-cli/SKILL.md)。CLI 默认读取 [.playwright/cli.config.json](../../.playwright/cli.config.json)，同样使用完整 Chromium 的新 headless 模式。页面服务启动后，在项目根目录执行：

```bash
pnpm playwright:cli -s=semi-debug open http://127.0.0.1:4174
pnpm playwright:cli -s=semi-debug snapshot
pnpm playwright:cli -s=semi-debug close
# 需要可见窗口时临时启用
pnpm playwright:cli -s=semi-debug open http://127.0.0.1:4174 --headed
pnpm playwright:cli -s=semi-debug close
```

CLI 用于本地页面操作和问题定位；自动回归仍由 Playwright Test 执行。诊断截图、trace 和日志保存在已忽略目录，不提交 Git。

## 依赖与共享资源

依赖由 pnpm workspace、catalog、overrides 和统一 lockfile 管理，保留严格 peer/engine 校验与 `allowBuilds`。pnpm v12 lockfile 的独立 YAML 文档记录包管理器依赖，升级时一并审阅。使用默认用户 store，位置由 `pnpm store path` 查询。

React/Vue 对照默认端口为 4173/4174，手动调试分别使用 `pnpm dev:reference`、`pnpm dev:parity`。并行工作共享代码和构建产物，正式验收由一个执行者管理服务。仓库内 worktree 放在已忽略的 `.worktrees/`。

CI 从 mise.toml 读取工具版本；升级同步 packageManager/engines，按[验证入口](../testing/validation.md)验证受影响工具链与产物。不要清理其他项目的全局工具或缓存。
