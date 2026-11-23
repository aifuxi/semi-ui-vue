---
name: semi-ui-vue
description: 在 Vue 3 项目中使用 @aifuxi/semi-ui-vue 搭建页面、按用途查找组件或排查用法，核对安装版本、公开导入、props、事件、插槽和示例。
---

# Semi UI Vue

## 页面选型

- 页面里的交互控件优先用当前版本的公开组件。常见搭配有 `Button`（提交、重置、筛选等操作）、`Input`（表单外的搜索）、`Select`（独立选择）、`Table`（数据表格）和 `Modal`（对话框）。由 `Form` 管理的字段优先用 `Form.Input`、`Form.Select` 等字段组件。
- 需要库提供的反馈行为时，按场景选组件，例如用 `Banner` 展示提示条，用 `Toast` 展示短时消息。字段校验反馈交给 `Form`。作为页面内容保留的简短提交结果可用带 `role="status"` 的原生容器。
- 页面结构和静态内容优先用语义 HTML，例如 `main`、`header`、`section`、标题、段落和用于导航的链接。普通布局容器可以用 `div` 和 CSS。没有合适的公开组件时，用带正确标签或无障碍名称的原生控件。

## 查证与验证

1. 从使用组件的应用目录解析 `@aifuxi/semi-ui-vue`。用 `node -p "require('@aifuxi/semi-ui-vue/package.json').version"` 查看实际安装版本，用 `require.resolve` 定位同一份包元数据。解析不到该入口时，用项目的包管理器或锁文件查这个应用解析出的完整版本。
2. 用 [组件用途索引](references/components.md) 从需求找到候选组件和公开子路径。Table 和 Form 还提供针对常见场景的参考页，签名以安装包的公开类型为准。
   - [Table](references/table.md) 用于表格、排序、筛选、分页或行选择。
   - [Form](references/form.md) 用于表单字段、校验、提交按钮或表单状态。
3. 从该版本包的 `package.json` 查看 `exports`，沿公开入口的 `types` 核对 props、事件参数、插槽和 `v-model` 对应的更新事件。Vue 的版本要求看 `peerDependencies`。
   - 需要查行为和示例时，在 [Semi UI Vue 仓库](https://github.com/aifuxi/semi-ui-vue) 查找 `@aifuxi/semi-ui-vue@<version>` 标签，以实际解析的版本替换 `<version>`。标签存在时从该标签打开组件契约及文档示例，具体目录见索引。工作区包可读当前检出的契约。
   - 找不到同版本文档时，以包的公开声明和实际交互验证为准。Semi Design 官方 React 文档使用独立版本号。
4. 检查 Vue 模板里的组件选型，再用消费项目的类型检查和相关交互验证导入、事件参数和实际行为。

复现示例时，沿用已有项目的依赖版本和样式入口。使用 pnpm 的新 Vite 项目可执行 `pnpm add @aifuxi/semi-ui-vue`，然后把示例复制为 `src/App.vue`，按安装版本的声明和使用说明调整导入、样式及 API。
