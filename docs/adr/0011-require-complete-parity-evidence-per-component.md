---
status: accepted
---

# 每个组件必须通过完整对齐证据门槛

组件不能因为“代码已写完”、“单元测试通过”或“截图看起来一样”而标记完成。每个组件必须在同一垂直切片中交付下列证据：

- 基于固定源码的对齐矩阵。
- Vue 源码、类型验证与公开导出。
- 中英文文档、Vue 示例与 React→Vue 迁移表。
- 针对 props、slots、emits、受控/非受控状态与事件顺序的黑盒单元测试。
- Chromium 真实渲染中的原生事件、键盘、焦点、ARIA、Portal、布局、动效与清理测试。
- 适用时的 SSR render/hydration 证据。
- React/Vue 的 DOM/class、computed style、bounding rect 和裁剪截图对照。
- 真实 `npm pack` 产物的安装、导入、类型与样式验证。

## Consequences

- 测试优先从用户可见的 DOM、role、输入、输出与事件验证契约，不把私有 state/method 或 Foundation spy 当作主证据。
- 快照与截图必须与具体行为断言配对，不得单独使用或盲目更新。
- Teleport、真实焦点、拖拽、ResizeObserver、computed style 与动画不能用 jsdom/happy-dom 结果代替 Chromium 证据。
- 不存在未解释差异才能通过门槛。真正无法等价的差异必须记录源码证据、原因、用户影响与验收结论；未完成项不得伪装成 deviation。
