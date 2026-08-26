---
status: accepted
---

# 对 Chromium 视觉对齐执行严格数值门槛

React/Vue 视觉对照对组件、Portal 弹层或最小完整场景本身进行裁剪，避免使用大页面面积稀释局部差异。

每个对照场景必须满足：

- 对齐矩阵列出的关键 computed style 逐项精确相等。
- 对应节点 bounding rect 的 x、y、width 和 height 差值均不超过 `0.5 CSS px`。
- Playwright 截图 `threshold <= 0.1`。
- Playwright 截图 `maxDiffPixelRatio <= 0.001`（0.1%）。

## Consequences

- 截图比例门槛只用于吸收少量抗锯齿或渲染噪声，不是可见差异的免责线。
- 任何肉眼可见或局部集中差异都必须定位；只有真正无法等价时才可进入 accepted deviation。
- Mask 必须对应有证据的非确定内容，使用最小几何范围并在测试中注明原因。
- 更新截图基线必须同时重新生成 React 参考与 Vue 对照证据，不得只接受 Vue 一侧的新截图。
