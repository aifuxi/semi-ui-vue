# Form v2.102.0 对齐矩阵

## 基线与选择理由

- 唯一基线：`vendor/semi-design` tag `v2.102.0`，提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- 公开入口：`packages/semi-ui/form/index.tsx`、`baseForm.tsx`、`field.tsx`、`arrayField.tsx`、`hoc/` 与 `hooks/`；状态机来自 `packages/semi-foundation/form/`，样式来自固定 `form.scss`、`rtl.scss` 和默认主题 Token。
- 文档与测试：`content/input/form/` 以及 `packages/semi-ui/form/__test__/`。
- 当前 README 路线在 DatePicker 后进入 Form；Input、Select、Checkbox、Radio、DatePicker、TimePicker、TreeSelect、Cascader、Upload 等公开字段依赖均已 ready，因此 Form 已可独立形成第 66 个根模块切片。

## 组件边界

| 模块                                                          | 单一职责                                                    | 公开契约                                           |
| ------------------------------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------- |
| `Form`                                                        | Foundation 生命周期、provider、原生 submit/reset 与布局编排 | props/emits/scoped slots、`getFormApi`、`form`     |
| `createFormField` / `withField`                               | 接管一个控件的值、事件、校验、Label/Error DOM 和 ARIA       | `CommonFieldProps`、Vue 原生更新事件、公开扩展函数 |
| `FormLabel` / `FormErrorMessage` / `FormSection` / `FormSlot` | 单一表单展示结构                                            | props/slots                                        |
| `FormInputGroup`                                              | 合并一组字段的 Label、错误与栅格布局                        | props/default slot                                 |
| `ArrayField`                                                  | 数组行 key、增删和 Foundation 数组值同步                    | scoped default slot                                |
| `useForm*` / `useField*`                                      | Vue setup 内读取或创建响应式 Form/Field API                 | composables                                        |
| `withFormApi` / `withFormState`                               | React HOC 的 Vue 兼容映射                                   | 返回注入 `formApi`/`formState` prop 的 Vue 组件    |

`Form` 保持为 provider/原生表单组合面；字段状态、展示结构、数组逻辑和 composable 分文件实现。动态控件包装需要精确转发 VNode 与事件，因此 `withField` 使用范围受限的 render function。

## 公开 API 与 Vue 映射

| React v2.102.0                                                       | 默认值                     | Vue 契约 / 验收                                                                                        |
| -------------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------ |
| `initValues`                                                         | `{}`                       | 首次创建 Foundation 时深拷贝；字段 `initValue` 优先                                                    |
| `layout`                                                             | `vertical`                 | `vertical/horizontal`，保留 `.semi-form-*` class                                                       |
| `labelPosition` / `labelAlign`                                       | `top` / `left`             | Form 级默认，可被 Field 显式值覆盖                                                                     |
| `allowEmpty` / `showValidateIcon` / `autoScrollToError`              | `false` / `true` / `false` | 缺省、显式 false、显式 true 三态门禁；Field `allowEmptyString` 优先                                    |
| `trigger`                                                            | `change`                   | `change/blur/custom/mount` 或数组，Field 显式值优先                                                    |
| `validator` / `validateFields`                                       | -                          | Form 级同步/异步校验；新名称优先，旧名称兼容                                                           |
| `onSubmit/onSubmitFail/onChange/onValueChange/onErrorChange/onReset` | noop                       | 对应 Vue emits；原生 submit/reset 先 preventDefault，再按配置 stopPropagation                          |
| `getFormApi` / `form`                                                | -                          | 回调取得 API；`useForm()` 创建的外部 controller 在 mount/unmount 绑定/解绑                             |
| render props / function children                                     | -                          | 默认 scoped slot `{ formState, formApi, values }`；兼容 `render` 与 `component` prop                   |
| `Form.Input` 等字段静态成员                                          | -                          | `Form.Input`、`Form.Select.Option` 等 compound API，并导出具名字段组件                                 |
| `withField`                                                          | -                          | Vue 组件工厂；值接管使用 `modelValue`，Checkbox/Radio/Switch 使用 `checked`，Upload 使用 `fileList`    |
| `useFormApi/useFormState/useFieldApi/useFieldState`                  | -                          | Vue composable；字段状态为响应式只读计算结果                                                           |
| React HOC                                                            | -                          | `withFormApi/withFormState` 返回显式注入 prop 的 Vue wrapper；记录为框架语义迁移，不字面复制 React ref |

## Field 状态、校验与事件顺序

- 字段 mount 时注册 `{ value, error, touched, status }`；unmount 时按 `keepState` 决定保留或删除。ArrayField 内忽略 `keepState`，避免索引位移恢复错误状态。
- 用户更新顺序为：计算 `valuePath`/`convert` → 静默准备本地值与 FormState → 调用调用方更新监听 → touched → 提交 FormState 通知 → 按 `trigger=change` 校验。调用方抛错时回滚。
- blur 先调用调用方监听，再标记 touched，最后按 `trigger=blur` 校验。
- `validator`/旧 `validate` 优先于 `rules`；rules 使用固定上游要求的 `async-validator@3.5.2`。异步校验只接受最后一次结果；`silent` 不更新错误 DOM/touched。
- `formApi.validate()` 成功 resolve 深拷贝 values，失败 reject errors；Form 级 validator 存在时不再执行 Field 级规则。
- `setValue/setValues/setError/setTouched/reset` 同步字段局部状态与 Foundation；对外 getter 返回隔离副本。

## 子 VNode、Boolean 与字段注入门禁

- FormInputGroup 只装饰真实的 Form Field VNode；Fragment、注释和空白需正规化，非字段子节点不伪造成字段。
- 子 VNode 的裸 `disabled`/布尔字段值按“键存在且值不是显式 false”解释；SFC 裸属性、`:disabled="false"`、`h()` true/false 均有测试。
- Field 的 `stopValidateWithError`、`disabled` 等继承项从原始 VNode props 判断是否显式传入，优先级为 Field 显式值 > Form 值 > 固定默认值。
- 包装器不修改调用方 VNode；新 props 合并到本次渲染的控件 VNode，调用方事件仍只触发一次。

## DOM、class、样式与 ARIA

- 根保留 `.semi-form`、`.semi-form-vertical/.semi-form-horizontal`、`x-form-id`；Field 保留 `.semi-form-field`、`.semi-form-field-main`、`x-field-id`、`x-label-pos`、`x-extra-pos`。
- Label 保留 `.semi-form-field-label*`、`x-semi-prop=label`、required/disabled/optional/extra 结构；可选文案取 ConfigProvider Locale。
- Error/help/extra 保留 `.semi-form-field-error-message`、`.semi-form-field-help-text`、`.semi-form-field-extra*` 与验证图标。
- Field 将 `id`、`name`、`aria-required`、`aria-labelledby`、`aria-describedby`、`aria-errormessage`、`aria-invalid` 注入真实控件；inset label 使用 `insetLabel/insetLabelId`。
- `labelCol + wrapperCol` 使用现有 Row/Col；逐组件 CSS 直接编译固定 `form.scss`，不更名 class/Token。

## ArrayField、RTL、国际化与 SSR

- ArrayField 支持 `add(index?)`、`addWithInitValue(value,index?)`、`remove()`，外部 setValue/setValues/reset 会刷新行 key 和嵌套字段路径。
- RTL 由 ConfigProvider/父文档方向与固定 `rtl.scss` 驱动；水平布局的 label、间距、错误图标方向对齐 React。
- zh-CN/en-US 覆盖 Label optional 文案；57 Locale 的数据完整性继续由 ConfigProvider 既有门禁覆盖。
- import 阶段不访问 DOM；Field 注册在 setup/SSR 中可构造，DOM 查询与 `scrollToField/scrollToError` 仅在客户端执行；SSR 输出稳定 form/label/control/ARIA DOM。

## 验收矩阵

- 单元：初值优先级、受控字段、事件顺序、嵌套路径、allowEmpty、同步/异步/rules 校验、trigger、silent、submit/fail/reset、keepState、ArrayField、hooks、HOC 映射、Label/Error/ARIA、裸 Boolean template/render host。
- SSR：根/子路径安全 import、默认/水平/必填/错误结构，无浏览器全局访问。
- Chromium：同一 BrowserContext 下 React/Vue 的请求来源、错误、computed style、bounding rect 与局部截图；desktop `1440x900`、mobile `390x844`、light/dark、RTL，并覆盖输入、错误和 submit 行为。
- 发布：根导出、`@aifuxi/semi-ui-vue/form`、`@aifuxi/semi-theme-default/form.css`、声明、tree-shaking、SSR import、真实 tarball consumer、async-validator License/SBOM。

## Deviation

- React render props/function children 统一映射为 Vue scoped slot；`render`/`component` 仅作兼容入口。React HOC 统一映射为 Vue wrapper/composable。这些是框架原生语义差异，不改变 FormState、FormApi、字段事件、DOM 或视觉结果。
