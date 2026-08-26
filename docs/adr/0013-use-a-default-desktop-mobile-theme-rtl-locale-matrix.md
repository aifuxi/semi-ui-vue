---
status: accepted
---

# 使用固定桌面、移动、主题、RTL 与 Locale 对照矩阵

所有组件的默认 React/Vue 对照矩阵包含桌面 viewport `1440×900`、DPR 1 下的 light 和 dark 场景。

在此基础上：

- 响应式、输入与浮层类组件增加移动 viewport `390×844`、DPR 1。
- 方向敏感组件增加 RTL 视觉与行为场景。
- 国际化敏感组件对 zh-CN 和 en-US 执行视觉与行为对照。
- 全部 57 个 Locale 执行数据完整性、公开导出和可渲染验证。

## Consequences

- 默认矩阵是最低要求，不得代替组件对齐矩阵中的专属场景。
- 每个组件仍需根据契约补齐适用的 hover、active、focus-visible、disabled、loading、validation、open/close、键盘、Portal、动画和清理场景。
- 移动场景仍使用项目锁定的 Chromium，不表示增加 WebKit/iOS Safari 兼容性承诺。
- 某个 Locale 数据可导入但无法在适用组件中渲染时，不得仅因数据完整性测试通过而宣称该 Locale 完成。
