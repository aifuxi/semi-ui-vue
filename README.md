# Semi UI Vue

以 Semi Design `v2.102.0` 为固定参考基线、面向 Vue 3.5+ 的独立组件库，目标是视觉与行为对齐。

> 本项目不是 Semi Design 官方 Vue 版本，也不代表 DouyinFE 的授权、合作或品牌身份。预览版使用 `next` 渠道，API 和发布结构在稳定版验收前仍可能调整。

## 安装与使用

```bash
pnpm add @aifuxi/semi-ui-vue@next @aifuxi/semi-theme-default@next
```

```vue
<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
</script>

<template>
  <Button type="primary">开始使用</Button>
</template>
```

主包为 ESM-only，要求 Vue `>=3.5.0`，支持根入口和逐组件导入。消费者无需克隆上游 submodule。

| 公开包                           | 内容                   |
| -------------------------------- | ---------------------- |
| `@aifuxi/semi-ui-vue`            | Vue 组件               |
| `@aifuxi/semi-theme-default`     | 根主题和逐组件编译 CSS |
| `@aifuxi/semi-icons-vue`         | 稳定图标               |
| `@aifuxi/semi-icons-lab-vue`     | 实验图标               |
| `@aifuxi/semi-illustrations-vue` | light/dark 插画        |

仓库处于 Changesets 发布迁移接入期：本地五包 `0.1.0` 是未发布基线，首个机器人版本 PR 目标为 `1.0.0-next.0`，不等同于 npm 已发布版本。发布流程与外部接入状态见[发布手册](docs/releasing.md)。

## 当前状态

- **组件实现：85/85 个公开根模块已完成垂直切片（ready）**，包含 `_base`、`_utils`，不等于 85 个可视组件。范围以[固定上游清单](docs/inventory/semi-v2.102.0.json)的 `summary.rootModuleCount` 为准，API 映射与验收记录见[组件目录](docs/components/)。
- **资产：**覆盖固定基线的 57 个语言源、稳定/Lab 图标与公开插画。
- **文档：**已统一为 Nuxt（Rspack builder）。覆盖账本记录 859/859 个上游中文 Demo 已映射至双语实现；映射不等于视觉与行为验收通过。有效验收数量见[覆盖账本](docs/documentation/coverage.json)，下一批及剩余工作见[双线计划](docs/documentation/batch-plan.md)。
- **稳定版：**仍需文档严格验收、章节/API/迁移审阅、站点与许可审计及发布接入闭环，见[1.0 发布审计](docs/release-audit-1.0.md)。

组件 ready、文档映射、当前有效验收和稳定发布是不同状态；历史通过记录不证明当前源码已通过全部门禁。

## 本地开发

维护环境由 [mise.toml](mise.toml) 固定 Node.js `24.18.0` 与 pnpm `12.3.4`。在仓库根目录执行：

```bash
git submodule update --init --recursive
mise trust
mise install
mise exec -- pnpm install --frozen-lockfile
mise exec -- pnpm check:vendor
mise exec -- pnpm dev
```

`pnpm dev` 启动 Nuxt 文档站（默认 `http://127.0.0.1:4321`），启动时准备公开包与文档资源。终端启用 `mise activate zsh` 后可直接运行 pnpm；未激活的终端和自动化使用 `mise exec -- pnpm …`。IDE 配置见[工具链管理](docs/architecture/toolchain.md)。

运行浏览器测试前执行 `mise exec -- pnpm playwright:install`；Linux CI 在镜像准备阶段使用 `pnpm exec playwright install --with-deps chromium`。浏览器基线只覆盖锁定的 Chromium，截图按平台维护，Linux 基线须单独审核，不能覆盖 macOS 基线。

## 常用命令

| 命令                                    | 用途                                                 |
| --------------------------------------- | ---------------------------------------------------- |
| `pnpm dev`                              | Nuxt 文档站                                          |
| `pnpm dev:parity`                       | Vue 对照工作台                                       |
| `pnpm dev:reference`                    | 固定 React 参考工作台                                |
| `pnpm --filter @workspace/docs build`   | 生成静态文档站                                       |
| `pnpm --filter @workspace/docs preview` | 预览已构建文档站                                     |
| `pnpm check`                            | 日常静态检查、源码类型、Rstest 单测与工具测试        |
| `pnpm check:docs`                       | 文档准备、构建、Nuxt 类型与内容/产物检查             |
| `pnpm check:artifacts`                  | 构建、文档检查、主题、SSR 与真实包安装               |
| `pnpm test:browser`                     | 组件 Chromium React/Vue 对照                         |
| `pnpm test:browser:built`               | 使用预构建工作台的组件对照                           |
| `pnpm test:browser:docs`                | 准备文档站并运行文档浏览器矩阵                       |
| `pnpm check:full`                       | 日常检查、产物检查及组件/文档浏览器回归              |
| `pnpm release:check`                    | 发布前依赖审计、全量回归、隔离包安装与发布元数据检查 |

按变更影响选择检查，细节见[验证入口](docs/testing/validation.md)；文档批次严格验收使用[文档流程](docs/documentation/workflow.md)。

## 参与维护

协作规则见 [AGENTS.md](AGENTS.md)，目录职责与依赖边界见[工作区架构](docs/architecture/workspace.md)，参考场景和对照方法见[React/Vue 验收流程](docs/testing/react-vue-parity.md)。

公开产物变更使用 `pnpm changeset`，纯文档、测试或内部工具使用 `pnpm changeset --empty`；五包版本由机器人统一维护。

本项目使用 [MIT License](LICENSE)。发布包携带 Semi Design 及适用第三方许可证、归属声明和 SPDX SBOM。
