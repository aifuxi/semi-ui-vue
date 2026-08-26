---
status: accepted
---

# 从只读 submodule 选择性编译 Foundation 与样式

`vendor/semi-design` 是 Foundation、SCSS 和相关资产的唯一源码输入。Vue 移植版在构建期选择性编译并内联可复用的上游源码，项目内只维护 Vue Adapter 和必要的隔离层。

## Consequences

- 不修改、格式化或在 `vendor/semi-design` 中生成文件，也不将 Foundation 复制到项目目录后形成第二份源码。
- 上游深层导入必须收敛在项目自有的 Foundation 集成边界；Vue 组件只依赖该边界。
- 集成边界负责隔离上游残留的 React 类型、SyntheticEvent 假设、DOM/browser global 以及 callback 式 `setState` 语义。
- 发布产物包含运行所需的 Foundation 逻辑和编译后样式；组件库消费者不需要初始化 submodule。
- 构建和发布产物必须保留 MIT 许可与适用的第三方声明。
