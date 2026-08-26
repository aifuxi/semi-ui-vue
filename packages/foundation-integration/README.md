# Foundation 集成边界

本包保持私有，是项目中唯一允许从以下固定源码建立运行时依赖的边界：

- `vendor/semi-design/packages/semi-foundation`
- `vendor/semi-design/packages/semi-animation`
- `vendor/semi-design/packages/semi-json-viewer-core`

Vue 组件不能绕过本包散落地导入这些目录。发布构建必须内联所需 Foundation 逻辑，最终产物不得包含 `vendor/` 路径或本包的运行时依赖。
