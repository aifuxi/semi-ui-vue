---
status: accepted
---

# 仅以锁定的 Chromium 作为浏览器目标

Vue 移植版的实现、验收与回归只覆盖项目锁定的 Playwright Chromium 构建。Firefox 和 WebKit 不在兼容性范围内；Chrome、Edge 等其他 Chromium 衍生浏览器也不单独构成验收目标。

像素对齐以同一 Chromium 环境中的 React 参考场景和 Vue 实现场景为对照双方。浏览器构建、字体、viewport、DPR、Locale、主题、数据和动画时刻必须一致且可复现。

## Consequences

- Playwright 版本和对应 Chromium revision 必须由 lockfile 与 CI 环境锁定。
- 全量行为、键盘、焦点、ARIA、布局、动画和视觉回归均在 Chromium 执行。
- Firefox/WebKit 失效不阻塞发布，也不需要建立对应测试基线。
- 本机 Chrome 的手工截图可用于调试，但不能代替锁定环境中的 React/Vue 对照证据。
