---
status: accepted
---

# 从首版起按可公开发布标准维护合规与品牌边界

项目从开发首日起按可公开发布的标准处理源码、样式、图标、插画、文档和依赖。完整保留 Semi Design MIT License 和适用的第三方声明，并为真实发布产物生成 SBOM/许可清单。

项目不复用 Semi Logo，对外品牌和 npm scope 使用独立名称。

## Consequences

- 引入、替换或内联第三方代码/资产的同一个垂直切片必须同步更新归属、许可和 SBOM 输入。
- CI 以实际 `npm pack` 文件列表和依赖图生成发布许可清单，避免 workspace 与发布包内容不一致。
- `.semi-*` 与 `--semi-*` 是技术兼容标识，不得用它们暗示官方 Vue 版、商标授权或合作关系。
- README、文档站、发布页和包 metadata 都必须使用独立品牌，并准确说明与 Semi Design v2.102.0 的技术对齐关系。
