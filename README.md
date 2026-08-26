# Semi UI Vue

这是一个以 Semi Design `v2.102.0` 为固定参考基线、面向 Vue 3.5+ 的像素级复刻工程。

当前仓库只完成工程边界和质量门禁的搭建，尚未宣称任何组件已完成复刻。唯一参考源码位于只读 submodule `vendor/semi-design`。

## 本地环境

- Node.js `24.18.0`（支持 `20.19+`、`22.13+` 和 `24.x`）
- pnpm `11.19.0`
- Playwright 固定 Chromium 构建

```bash
corepack enable
pnpm install
pnpm playwright:install
pnpm check:vendor
pnpm check:full
```

Linux CI 需要在镜像准备阶段执行 `pnpm exec playwright install --with-deps chromium`；普通 `pnpm install` 不会下载浏览器。当前首份截图校准基线生成于 macOS（Darwin），Linux 在纳入 `check:full` 前必须单独生成并人工审核对应平台基线，不能自动更新覆盖。

## 常用命令

```bash
pnpm dev             # Vue 文档/对照应用
pnpm dev:reference   # React 参考应用
pnpm check           # 格式、lint、类型、单测、构建与 SSR import
pnpm test:browser    # 单一 Chromium 进程中的 React/Vue 对照基础设施
```

目录职责、依赖方向和新增组件流程见 `docs/architecture/workspace.md`。
