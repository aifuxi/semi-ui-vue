# Form 表单

以下用法按 `@aifuxi/semi-ui-vue@2.2.5` 核对。

```ts
import { Form, type FormApi, type FormEmits } from '@aifuxi/semi-ui-vue/form';
```

也可以从根入口 `@aifuxi/semi-ui-vue` 导入 `Form`。在 `<Form>` 中用 `Form.Input`、`Form.Select` 等字段组件，让 Form 按 `field` 注册并管理值。给字段设置 `label`，用 `rules` 声明校验。表单整体初始值用 `:init-values`，字段自身的 `init-value` 优先。挂载后收到的值通过 `formApi.setValues()` 更新。

| Vue 模板事件    | 参数                                          | 触发时机       |
| --------------- | --------------------------------------------- | -------------- |
| `@submit`       | `values, event?: Event`                       | 提交且校验成功 |
| `@submit-fail`  | `errors: unknown, values, event?: Event`      | 提交校验失败   |
| `@change`       | `formState`，含 `values`、`errors`、`touched` | 表单状态变化   |
| `@value-change` | `values, changedValues`                       | 字段值变化     |
| `@error-change` | `errors, changedErrors`                       | 字段错误变化   |
| `@reset`        | 无                                            | 表单重置       |

`values` 是完整的表单值对象，`changedValues` 是本次变更的部分。`@submit` 的第一个参数可以直接读取字段值。使用 `type="submit"` 的按钮触发表单校验。需要在模板中读取状态或调用 API 时，可以在 `<Form>` 上使用 `v-slot="{ formApi, formState, values }"`，也可以通过 `:get-form-api` 接收实例 API。

[可运行示例 FormExample.vue](../assets/FormExample.vue) 演示字段注册、必填校验和提交事件。示例通过 `trigger="custom"` 将自动校验推迟到提交。留空提交应显示「请输入姓名」。填写姓名再提交应显示成功状态，其中的姓名来自 `@submit` 的第一个参数。

[Vue 组件契约](https://github.com/aifuxi/semi-ui-vue/blob/ea1d94ff/docs/components/form/index.md) · [React → Vue 迁移说明](https://github.com/aifuxi/semi-ui-vue/blob/ea1d94ff/docs/components/form/react-to-vue.md) · [文档站 Vue 示例](https://github.com/aifuxi/semi-ui-vue/tree/ea1d94ff/apps/docs/.vitepress/theme/demo/examples/t5/form/zh-CN)
