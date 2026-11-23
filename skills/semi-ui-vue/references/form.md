# Form 表单

根据 [版本查证流程](../SKILL.md#查证与验证) 核对安装包的 `/form`、`/button` 导出与类型。

```ts
import { Button } from '@aifuxi/semi-ui-vue/button';
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

`values` 是完整的表单值对象，`changedValues` 是本次变更的部分。`@submit` 的第一个参数可以直接读取字段值。需要在模板中读取状态或调用 API 时，可以在 `<Form>` 上使用 `v-slot="{ formApi, formState, values }"`，也可以通过 `:get-form-api` 接收实例 API。

在 `<Form>` 内用 `<Button html-type="submit">提交</Button>` 触发表单校验。`html-type` 会写到原生按钮的 `type`，默认值是 `button`。需要原生重置时用 `html-type="reset"`。Button 的 `type="primary"` 等取值用于视觉样式。提交成功和失败逻辑分别绑定在 Form 的 `@submit` 和 `@submit-fail`。

[可运行示例 FormExample.vue](../assets/FormExample.vue) 演示字段注册、必填校验和提交事件。示例通过 `trigger="custom"` 将自动校验推迟到提交。留空提交应显示「请输入姓名」。填写姓名再提交应显示成功状态，其中的姓名来自 `@submit` 的第一个参数。

仓库中的 Form 契约和迁移说明位于 `docs/components/form/`，Button 契约位于 `docs/components/button/index.md`。文档站示例可从 `apps/docs/content/zh-CN/input/form.md` 查找。
