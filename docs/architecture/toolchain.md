# 工具链管理

Node.js 与 pnpm 的开发、CI 版本由根 `mise.toml` 精确声明，当前为 Node 24.18.0 / pnpm 12.3.4。`package.json` 保留包管理器声明和引擎契约；`pnpm check:toolchain` 核对配置和实际运行版本，已接入 `pnpm check`。

## 本地与 IDE

安装 mise 后，在仓库根执行：

```bash
mise trust
mise install
mise exec -- pnpm install --frozen-lockfile
mise exec -- pnpm check:toolchain
mise exec -- pnpm dev
```

希望终端自动切换版本时，在个人 zsh 配置加入 `eval "$(mise activate zsh)"`。未激活的终端、自动化任务统一使用 `mise exec --`。无需执行 `corepack enable`，也不需要全局安装 pnpm。

WebStorm 的 Node interpreter 与 package manager 分别选用 `mise which node`、`mise which pnpm` 返回的位置。版本升级后重新核对 IDE 选择；个人绝对路径不写入共享配置。用 IDE 运行 `pnpm check:toolchain` 确认 IDE 与终端一致。

`.nvmrc` 与 `.node-version` 已移除，避免多个工具版本来源。已有全局工具不必卸载，项目命令通过 mise 选择版本。

## 依赖与缓存

依赖仍由 pnpm workspace、catalog、overrides 和统一 `pnpm-lock.yaml` 管理。`pmOnFail: error` 要求当前 pnpm 满足项目声明，不自动下载另一个版本；依赖脚本使用 `allowBuilds` 白名单。保持严格 peer 与 engine 检查。

pnpm v12 在锁文件的独立 YAML 文档中记录包管理器依赖，普通业务依赖保留在另一个文档中。升级须审核完整 diff，不能把包管理器记录误认为业务依赖升级。安装采用用户级默认 store，实际位置用 `mise exec -- pnpm store path` 查询，不配置项目内 `.pnpm-store`。

## CI 与升级

GitHub Actions 使用固定提交的 `jdx/mise-action` 和固定 mise 版本读取 `mise.toml`；CI 不再单独声明 Node/pnpm 版本。发布保留 npm 11.16.0 与官方 registry、OIDC 权限，实际发布命令仍显式指定官方 registry。

升级时同步修改 `mise.toml`、`package.json` 的 `packageManager` / `engines.pnpm` 及本文版本，安装新工具后首先尝试 frozen install。只有确需更新锁文件时执行一次非 frozen 安装并审查差异，随后重新执行 frozen install 和 `pnpm check:full`。提交精确版本，不使用 `latest` 或主版本浮动范围。

项目内隔离 worktree 放在 `.worktrees/`，Git、Prettier 和 ESLint 都忽略该目录。文档浏览器测试需要避开主工作区服务时，可以设置 `DOCS_PORT=14321 DOCS_ACCEPTANCE=1`；该端口仅用于本次文档预览与验收，默认仍为 4321。React/Vue 对照仍使用 4173/4174，运行前确认空闲。

回退可恢复迁移前的工具声明、配置、锁文件和脚本，并重新安装依赖；不要清理其他项目的全局工具或缓存。

参考：[mise CI](https://mise.jdx.dev/continuous-integration.html)、[pnpm v12 发布说明](https://github.com/pnpm/pnpm/releases/tag/v12.0.0)。
