---
status: accepted
---

# 保留 Semi 的 DOM class 与 CSS Token 兼容面

首个完整版本保留 Semi Design v2.102.0 的 `.semi-*` DOM/state class、placement 属性和 `--semi-*` CSS Token。这使 Vue 移植版可以直接复用固定基线的 SCSS 与主题逻辑，也为现有 Semi 样式扩展提供明确的迁移边界。

项目的 npm 包名、仓库名和对外品牌与 Semi 独立；样式前缀兼容不代表品牌或商标身份相同。

## Consequences

- Vue 渲染器需保留 SCSS 依赖的 DOM 层级、兄弟关系、class、placement 属性与 ARIA 落点。
- `.semi-*` 和 `--semi-*` 是首个完整版本的显式兼容契约，不得仅为追求 Vue 命名风格而更名。
- 主题编译顺序、global/base 样式、暗色作用域、RTL 与 Portal class 都必须与参考基线单独验证。
- 任何前缀迁移都属于破坏性改动，需要新的 ADR 和完整对齐基线。
