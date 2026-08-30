# Form React → Vue 迁移

| React v2.102.0                            | Vue                                               | 说明                                                                |
| ----------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------- |
| `<Form onSubmit={fn}>`                    | `<Form @submit="fn">`                             | submit/fail/reset/change/valueChange/errorChange 均使用 Vue emits。 |
| `<Form.Input field="name" />`             | `<Form.Input field="name" />`                     | 保留组件名、field、rules 与 `.semi-*` DOM 契约。                    |
| `onChange(value, event, values)`          | `@change="(value, event, values) => ..."`         | 字段监听先执行，随后 Form change/valueChange。                      |
| `children={({ formApi }) => ...}`         | `v-slot="{ formApi, formState, values }"`         | render props 映射为默认 scoped slot。                               |
| `Form.useForm()`                          | `const [api, state, values] = useForm()`          | Vue 返回响应式 `Ref/ComputedRef`。                                  |
| `withField(Control, options)`             | `createFormField(Control, options)` / `withField` | Vue 控件通过 `value` 或配置的 `valueProp` 接管。                    |
| `withFormApi(Component)`                  | `withFormApi(Component)` 或 `useFormApi()`        | 推荐 setup 内 composable；HOC 作为迁移兼容层。                      |
| `<ArrayField>{scope => ...}</ArrayField>` | `<ArrayField v-slot="scope">...</ArrayField>`     | `add/addWithInitValue/remove/arrayFields` 语义保持。                |
| React `component` / `render`              | `component` / `render` 或默认 slot                | 同时出现时按上游优先级处理；新代码优先 slot。                       |
| React ref                                 | `ref` + 暴露的控件实例 / `FormApi`                | 不复制 React ref 语义。                                             |

Vue 中不要修改 props 或依赖普通 truthiness 判断继承布尔值。字段的显式 `false` 会覆盖 Form 级默认，SFC 裸属性和 render function 输入均按原始 VNode prop 是否存在判定。

实现差异仅限框架原生表达：React children/render props/HOC 分别映射为 Vue slots/composables/wrapper；FormState、校验、事件顺序、DOM class、主题和 ARIA 不因此缩减。
