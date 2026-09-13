# Semi UI Vue

面向 Vue 3.5+ 的独立组件库，以 Semi Design `v2.102.0` 为固定基线，对齐视觉、行为、可访问性和主题。本项目不是 Semi Design 官方 Vue 版本。

## 安装与使用

预览版使用 `next` 渠道；稳定版验收仍在推进，API 与发布结构可能调整。

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

主包为 ESM，支持根入口和逐组件导入；消费者无需克隆上游 submodule。

| 公开包                           | 内容               |
| -------------------------------- | ------------------ |
| `@aifuxi/semi-ui-vue`            | Vue 组件           |
| `@aifuxi/semi-theme-default`     | 根主题和逐组件 CSS |
| `@aifuxi/semi-icons-vue`         | 稳定图标           |
| `@aifuxi/semi-icons-lab-vue`     | 实验图标           |
| `@aifuxi/semi-illustrations-vue` | light/dark 插画    |

## 开发与发布状态

固定基线的 85 个公开根模块已具备组件切片记录（含 `_base`、`_utils`），资产覆盖 57 个语言源、稳定/Lab 图标和公开插画。组件 ready 不等于稳定版已可发布，发布候选仍需有效的组件与产物验证。

- [组件契约与记录](docs/components/)：公开 API、对齐矩阵和已知差异。
- [测试体系迁移方案](docs/testing/vue-testing-strategy-proposal.md)：已实施并验证的 Vitest、Storybook 与本地 Playwright 分层。
- [发布审计](docs/release-audit-1.0.md)：稳定版剩余工作。
- [发布手册](docs/releasing.md)：Changesets 版本流程、渠道与外部接入状态；仓库中的版本号不代表 npm 已发布版本。

## 本地开发

[mise.toml](mise.toml) 固定 Node.js 与 pnpm。首次在仓库根执行：

```bash
git submodule update --init --recursive
mise trust
mise install
mise exec -- pnpm install --frozen-lockfile
mise exec -- pnpm dev
```

Storybook Vue 场景站默认运行于 `http://127.0.0.1:4174`，固定 React 参考应用通过 `mise exec -- pnpm dev:reference` 启动于 `http://127.0.0.1:4173`。浏览器检查前运行 `mise exec -- pnpm playwright:install`。`pnpm test:browser` 自行构建并启动 React/Storybook preview，默认完整 Chromium 新 headless、3 workers、0 retries；请先关闭占用相同端口的手动服务。真实安装包浏览器消费使用独立的 `pnpm test:consumer`。WebStorm 可直接使用 [.run](.run/) 中的共享配置，环境准备见[工具链](docs/architecture/toolchain.md)。

日常本地集成用 `pnpm check`（静态检查与 Vitest 单测），公开产物用 `pnpm check:artifacts`，完整本地回归用 `pnpm check:full`，发布候选用 `pnpm release:check`。组件单测（含源码 SSR）与浏览器消费测试在本地执行；CI 保留 `check:source`、Node 产物检查和发布职责。按影响选择，详见[验证入口](docs/testing/validation.md)。工程边界见[工作区架构](docs/architecture/workspace.md)，代理规则见 [AGENTS.md](AGENTS.md)。

Nuxt 文档站及旧逐示例验收体系已移除。静态组件契约继续保留，退役范围与历史追溯见[说明](docs/documentation/README.md)。

本项目使用 [MIT License](LICENSE)。发布包携带 Semi Design 及适用第三方许可证、归属声明和 SPDX SBOM。
