---
title: 复用仓库 Playwright 配置验证真实浏览器行为
impact: MEDIUM
impactDescription: 另建浏览器配置会偏离锁定 Chromium、场景环境与视觉门禁，降低对照证据的可比性
type: best-practice
tags: [vue3, testing, e2e, playwright, chromium, end-to-end]
---

# 复用仓库 Playwright 配置验证真实浏览器行为

本仓库已经采用 Playwright。扩展测试时读取相关配置和相邻 spec，复用 pnpm lockfile 指定的版本与浏览器构建；不运行 `npm init playwright@latest`，不另建三浏览器或 mobile 项目模板。其他项目应先确认其已有工具和支持范围，再决定是否需要搭建基础设施。

## 选择已有入口

| 验证目标                                | 入口                                                                                                                                                                    |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| React/Vue 组件行为和视觉对照            | [根 Playwright 配置](../../../../playwright.config.ts)、[组件 spec](../../../../tests/browser/components)、[测试基础设施](../../../../packages/test-infra/src/index.ts) |
| Nuxt 文档站、SSR 输出后的交互和文档示例 | [文档站配置](../../../../apps/docs/playwright.config.ts)、[文档工作流](../../../../docs/documentation/workflow.md)                                                      |
| 测试命令、构建前置条件和版本            | [根脚本](../../../../package.json)、[文档站脚本](../../../../apps/docs/package.json)、[pnpm lockfile](../../../../pnpm-lock.yaml)                                       |

从仓库根目录运行受影响的 spec，例如已有 Button 场景：

```bash
pnpm exec playwright test tests/browser/components/button.spec.ts --project=chromium
```

文档站使用 `pnpm --filter @workspace/docs test:nuxt`，其配置启动静态预览；先按文档工作流准备构建和证据，再缩小到受影响的测试文件。不要用开发服务器通过来代替所要求的生产静态验收。

## 场景与断言

- 先观察实际 DOM、ARIA、Portal 和 iframe 视口，再选择 role、label 或稳定场景标识；Portal 内容应在真实容器中查询。
- 从用户交互出发断言公开输出、事件顺序、键盘与焦点结果。只检查节点存在、截图或私有方法调用都不足以证明行为正确。
- 保留触发缺陷的首次挂载、SSR hydration、退出动画、重开或卸载条件。测试隔离应清理自身创建的 DOM、监听器、Observer、时钟与网络替身。
- 优先使用 locator 的可等待断言和确定性 fixture。单独运行通过、联合运行失败时定位共享状态或异步竞争，不能靠增加 retries、随意固定等待或更新截图掩盖问题。

## 视觉证据

以 [AGENTS.md](../../../../AGENTS.md) 和现有 fixture 为准：同一 Chromium 进程内对照 React/Vue，固定字体、viewport、DPR、Locale、主题、数据与动画时刻。默认桌面 `1440×900`、DPR 1，覆盖 light/dark；窄视口、触摸、RTL 与国际化场景按固定上游契约补充，不自动扩成全量移动端矩阵。

裁剪组件、Portal 弹层或最小完整场景，结合关键 computed style 和 bounding rect 比较。复用现有阈值与截图策略，不用整页面积、扩大 mask 或放宽阈值稀释局部差异。保留 CI 的 `failOnFlakyTests` 与既有 retries 配置。

## 参考

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Vue.js E2E Testing](https://vuejs.org/guide/scaling-up/testing#e2e-testing)
