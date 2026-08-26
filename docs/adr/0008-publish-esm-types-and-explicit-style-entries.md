---
status: accepted
---

# 发布 ESM、类型与明确样式入口

首版发布产物以 ESM、TypeScript 声明、根 CSS 入口、逐组件样式入口和明确的 `exports` 为契约，并支持 tree-shaking 与 SSR-safe import。CJS 和 UMD 不在首版范围内。

## Consequences

- 主包与每个可发布资产包必须声明完整 `exports`、`types` 和 style side effects，不依赖未承诺的文件结构。
- 既支持根 CSS 一次引入，也支持逐组件样式入口；两种方式必须保持正确的 theme/global/animation/component 顺序。
- 发布验证必须安装真实 `npm pack` 产物，检查 ESM import、TypeScript、样式、tree-shaking 和 SSR-safe import。
- 只有经明确消费环境证明必需时，才通过新决策增加 CJS 或 UMD，不为表面对齐上游产物而增加构建面。
