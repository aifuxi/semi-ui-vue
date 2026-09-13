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
| `pnpm dev:docs`        | 启动文档开发服务      |
| `pnpm check`           | 日常源码集成          |
| `pnpm check:docs`      | 文档构建、类型与内容  |
| `pnpm check:artifacts` | 公开产物与真实包消费  |
| `pnpm check:full`      | 全量回归              |
| `pnpm release:check`   | 发布候选验证，不发布  |

配置使用 `$PROJECT_DIR$`、项目 Node runtime 和 `pnpm` 别名。首次设置项目 Node interpreter 与 package manager 时，分别选择 `mise which node`、`mise which pnpm` 返回的位置。升级版本后运行 `pnpm check:toolchain` 复核。

MCP 先用 `get_run_configurations` 获取名称，再用 `execute_run_configuration` 执行。npm 配置不支持动态参数覆盖；指定单测文件、文档 batch 或一次性环境变量时用 IDE 终端。长任务以实际退出码和日志判断结束，不能把启动成功当作检查通过。

CodeGraph 用于已索引代码的符号与依赖分析；配置、文档、索引遗漏或过期内容用定向读取补足。个人 MCP 连接保存在本地配置中，`.codex/config.toml` 不入库。

## 依赖与共享资源

依赖由 pnpm workspace、catalog、overrides 和统一 lockfile 管理，保留严格 peer/engine 校验与 `allowBuilds`。pnpm v12 lockfile 的独立 YAML 文档记录包管理器依赖，升级时一并审阅。使用默认用户 store，位置由 `pnpm store path` 查询。

文档默认端口 4321，React/Vue 对照为 4173/4174。并行工作共享代码和构建产物，正式验收由一个执行者管理服务；隔离文档端口可用 `DOCS_PORT`，验收模式用 `DOCS_ACCEPTANCE=1`。仓库内 worktree 放在已忽略的 `.worktrees/`。

CI 从 mise.toml 读取工具版本；升级同步 packageManager/engines，按[验证入口](../testing/validation.md)验证受影响工具链与产物。不要清理其他项目的全局工具或缓存。
