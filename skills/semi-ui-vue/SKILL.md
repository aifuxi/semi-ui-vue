---
name: semi-ui-vue
description: 在 Vue 3 项目中使用 @aifuxi/semi-ui-vue 编写或排查组件代码，核对安装版本、公开导入、props、事件和插槽。内含 Table 表格和 Form 表单的 Vue 用法及可运行示例。
---

# Semi UI Vue

1. 从消费项目的实际安装、锁文件或依赖声明确认 `@aifuxi/semi-ui-vue` 版本。组件库参考的 Semi Design `v2.102.0` 是 React 基线，Vue 包使用自己的版本号。
2. 按任务只读所用组件的参考页。参考页标注了核对版本，包含公开导入、事件参数和完整 Vue 单文件组件。
   - [Table](references/table.md) 用于表格、排序、筛选、分页或行选择。
   - [Form](references/form.md) 用于表单字段、校验、提交或表单状态。
3. 对于其他组件或不同版本，查对应版本的 [Vue 组件契约](https://github.com/aifuxi/semi-ui-vue/tree/master/docs/components) 和已安装包的 `exports`、类型声明。优先采用消费项目已有的公开导入方式。涉及双向绑定时，先确认组件确实提供对应的 `v-model` 和更新事件。遇到上游 React 示例时，用 Vue 契约确认事件、插槽和模板写法。
4. 用消费项目的类型检查和相关交互验证生成代码，重点检查事件参数是否符合组件声明。

组件库面向 Vue 3.5+。项目可从 `@aifuxi/semi-ui-vue` 根入口或公开组件子路径导入，浏览器构建会按需加载默认主题。要复现本 Skill 的示例，在 Vue 3.5+ 的 Vite 项目中执行 `pnpm add @aifuxi/semi-ui-vue@2.2.5`，然后把对应 `.vue` 文件复制为 `src/App.vue`。
