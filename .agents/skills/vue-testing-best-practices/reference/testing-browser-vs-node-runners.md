---
title: 按验证能力选择已有 Node 与浏览器测试入口
impact: MEDIUM
impactDescription: jsdom 的 DOM 模拟不能代替浏览器布局、原生交互或 SSR hydration 证据
type: capability
tags: [vue3, testing, component-testing, vitest, browser, jsdom]
---

# 按验证能力选择已有 Node 与浏览器测试入口

本仓库使用 [Vitest + jsdom](../../../../vitest.config.ts) 完成适合模拟环境的单测，使用 [Playwright Chromium](../../../../playwright.config.ts) 验证真实浏览器行为。需要浏览器证据不等于需要 Vitest Browser Mode；不要为本技能另装 `@vitest/browser`、浏览器 provider 或创建第二套 runner。

## 选择能证明目标行为的环境

| 目标                                               | 适用证据                                                 | 边界                                                                 |
| -------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------- |
| 纯逻辑、公开 props/emits/slots/v-model、异步结果   | 已有 Vitest 与 Vue Test Utils 黑盒单测                   | 驱动公开输入，断言用户可观察输出；不依赖私有 state 或 Foundation spy |
| DOM/class 兼容结构                                 | 单测可检查公开结构；必要时在浏览器复核                   | class 存在不能证明样式、几何或视觉正确                               |
| computed style、bounding rect、hover、布局与滚动   | 已有 Playwright Chromium 场景                            | jsdom 支持部分样式解析，但没有真实布局与绘制结果                     |
| 真实焦点、键盘默认行为、拖拽、ResizeObserver、动效 | 已有 Playwright 用户交互与可观察结果                     | 合成事件、手工 Observer 回调或模拟时钟不能单独证明浏览器行为         |
| Portal 容器、浮层定位、关闭/重开与卸载             | 浏览器中挂载真实 Portal，并覆盖相关生命周期              | Teleport stub 只验证被隔离的单测目标，不能证明真实容器和焦点契约     |
| SSR-safe import、SSR render                        | 已有无浏览器全局对象的 import 检查及适用的服务端渲染测试 | jsdom 自带 DOM，不能证明代码在无 DOM 环境可导入                      |
| SSR hydration 与客户端生命周期衔接                 | 在 Chromium 中激活真实 SSR 输出                          | 客户端从空容器 mount 不能复现 hydration 差异                         |

Cookie API 的模拟测试可以验证调用逻辑；若目标涉及实际浏览器存储策略、请求携带或同源边界，使用已有浏览器 fixture，不把模拟结果当作浏览器保证。

## 生命周期与测试隔离

只使用响应式 API 的 composable 可直接测试；依赖 inject 或组件生命周期时，使用宿主组件，在 mount 前设置 provider，结束后 unmount。涉及 DOM、Observer、全局事件或 Portal 的行为，还需要客户端挂载与清理证据；按缺陷触发条件保留 SSR、退出动画和再次打开的路径。

异步更新先等待对应 Promise、Vue 更新或可观察 UI 状态。布局、真实动画与焦点测试按已有 Chromium fixture 执行；不能只让 jsdom 用例通过，也不要把所有单测迁到浏览器。具体场景、环境锁定与执行入口见 [Playwright 指南](testing-e2e-playwright-recommended.md)。

## 参考

- [Vue.js Component Testing](https://vuejs.org/guide/scaling-up/testing#component-testing)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
