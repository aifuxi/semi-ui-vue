---
title: 'Form 表单'
description: '管理字段值、校验、布局和动态表单。'
locale: 'zh-CN'
slug: 'form'
category: 'input'
order: 40
englishTitle: 'Form'
icon: 'doc-form'
upstream: 'input/form'
---

`Form` 管理字段值、错误、touched、校验、提交和重置。本页逐项迁移固定 Semi Design **v2.102.0** 文档的 39 个 live 示例，以 Vue props/emits/slots/composables 表达相同章节意图。示例补齐不代表 React/Vue 像素对照已经完成。

## 表单与字段

Form 是状态容器；Field 是绑定某个 `field` 路径的控件。字段的值由 Form 接管，不使用控件本身的 `value`、`defaultValue`、`checked`、`defaultChecked` 或额外 `v-model` 初始化。普通 Checkbox/Radio 放在对应 Group 内时无需独立 field。

```vue
<script setup lang="ts">
import { Form } from '@aifuxi/semi-ui-vue/form';
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
</script>

<template>
  <Form :init-values="{ name: 'Semi' }">
    <Form.Input field="name" label="名称" />
  </Form>
</template>
```

仅导入需要的公开组件和样式子路径。Form 样式负责布局；使用到的 Input、Select 等控件需要各自样式。React 静态成员写法在 Vue 中保留，也可使用 `FormInput` 等命名导出。

## 代码演示

### 基本写法

使用 `field` 声明值路径，标签默认取字段名。`Form.Input` 等字段由 Form 接管值；Form 的 `@value-change` 接收值快照和本次修改的字段。

::demo-block{demo="form/zh-CN/Basic" title="基本写法"}
::

### 通过 render 属性声明

`render` 接收 `{ formState, formApi, values }`。Vue 的回调返回 VNode，本例通过 `h(RenderFields, scope)` 将字段模板交给独立 SFC；不要同时传 `component` 或默认插槽。

::demo-block{demo="form/zh-CN/Render" title="通过 render 属性声明"}
::

### 默认作用域插槽

默认作用域插槽是 Vue 推荐写法。`formState` 包含 `values`、`errors`、`touched`；在模板中直接读取以展示实时状态。

::demo-block{demo="form/zh-CN/ScopedSlot" title="默认作用域插槽"}
::

### 通过 component 声明

`component` 接收一个 Vue 组件，Form 将同一组作用域数据作为 props 传入。独立组件有助于复用字段组合，但不能在 Form 外调用依赖注入型 composable。

::demo-block{demo="form/zh-CN/Component" title="通过 component 声明"}
::

### 已支持的表单控件

已支持 Input、InputNumber、TextArea、Select、Checkbox/CheckboxGroup、Radio/RadioGroup、DatePicker、TimePicker、Switch、Slider、TreeSelect、Cascader、Rating、AutoComplete、Upload、TagInput、PinCode。字段仍接受相应控件的 size、placeholder 等属性。此例日期固定，Upload 仅选择本地文件并使用 custom trigger，不发起上传。

::demo-block{demo="form/zh-CN/SupportedFields" title="已支持的表单控件"}
::

### 表单控件值的绑定

`field` 支持点号、数组下标和带引号路径。下面的六个字段会构成对象与数组结构；不用把嵌套路径手动拼成扁平业务数据。

::demo-block{demo="form/zh-CN/ValuePaths" title="表单控件值的绑定"}
::

### 垂直布局

默认 `layout="vertical"` 按行排列字段。作用域中的 `values.agree` 可控制提交按钮；提交通过校验后才触发 `@submit`，结果仅显示在本页。

::demo-block{demo="form/zh-CN/Vertical" title="垂直布局"}
::

### 水平布局

`layout="horizontal"` 将字段水平排列并允许换行。标签位置由 `labelPosition` 独立控制，不要将两个属性混为一谈。

::demo-block{demo="form/zh-CN/Horizontal" title="水平布局"}
::

### 标签位置与对齐

`labelPosition` 支持 top、left、inset；本例动态比较 top/left。`labelAlign` 控制文本左/右对齐，`labelWidth` 控制宽度；字段上的显式设置优先于 Form。

::demo-block{demo="form/zh-CN/LabelLayout" title="标签位置与对齐"}
::

### 栅格布局

使用 Grid 的 Row/Col 把多个字段组织为一行，示例分别提供三列和四列。栅格布局分配字段容器，控件宽度由各控件样式决定。

::demo-block{demo="form/zh-CN/Grid" title="栅格布局"}
::

### 表单分组

`Form.Section` 提供标题和分隔线，不创建独立 FormState。基本信息、合格标准、考试时间和人员四个分组共享同一个 Form。

::demo-block{demo="form/zh-CN/Sections" title="表单分组"}
::

### wrapperCol / labelCol

`labelCol` 与 `wrapperCol` 采用 Grid 的 span/offset。本例使用 2/20 栅格和左侧右对齐标签；两者需要成对设置才能形成字段两列布局。

::demo-block{demo="form/zh-CN/LabelColumns" title="wrapperCol / labelCol"}
::

### 隐藏 Label 与 pure

`noLabel` 仅隐藏标签，仍保留字段包裹和错误信息；`pure` 只接管数据，省略 Label、ErrorMessage、extraText 等 DOM。隐藏标签后需要为控件提供可访问名称。

::demo-block{demo="form/zh-CN/NoLabel" title="隐藏 Label 与 pure"}
::

### 内嵌 Label

`labelPosition="inset"` 将标签放到支持该模式的控件内部。示例覆盖 Input、Select 和 DatePicker；不要假定所有第三方自定义控件都支持内嵌标签。

::demo-block{demo="form/zh-CN/Inset" title="内嵌 Label"}
::

### 使用 Form.Slot

`Form.Label`、`Form.ErrorMessage` 可独立使用。`Form.Slot` 为任意模板内容提供与 Form 一致的标签布局，但不自动注册字段或接管值；本例显式组合 ErrorMessage。

::demo-block{demo="form/zh-CN/Slot" title="使用 Form.Slot"}
::

### 校验状态和 helpText

`helpText` 和校验错误共享信息区，错误优先；`extraText` 可与错误同时存在。本例按密码长度切换 error/warning/success，短密码仅提示弱强度仍通过校验；演示密码为固定值。

::demo-block{demo="form/zh-CN/HelpText" title="校验状态和 helpText"}
::

### extraText 显示位置

`extraTextPosition="middle"` 将提示放在标签和控件之间，`bottom` 放在控件后。字段可以覆盖 Form 统一设置；左侧标签遇到多行提示时不保证与控件首行基线重合。

::demo-block{demo="form/zh-CN/ExtraText" title="extraText 显示位置"}
::

### InputGroup 组合多个 Field

`Form.InputGroup` 把区号和号码组合在同一标签下，但每个 Field 保留独立值和校验。使用 `initValue` 初始化，不能改用受控控件的 defaultValue。

::demo-block{demo="form/zh-CN/InputGroup" title="InputGroup 组合多个 Field"}
::

### Modal 弹出层中的表单

在 Modal 的确认操作中调用 `formApi.validate()` 并捕获失败。校验通过后才能关闭；表单挂载之前不要调用外部 FormApi。本例仅输出本地结果。

::demo-block{demo="form/zh-CN/Modal" title="Modal 弹出层中的表单"}
::

### 配置初始值与校验规则

`initValues` 只在挂载时消费一次；Field 的 `initValue` 优先级更高。`rules` 基于 async-validator；`stopValidateWithError` 在第一条失败规则后停止后续规则。

::demo-block{demo="form/zh-CN/InitialRules" title="配置初始值与校验规则"}
::

### 同步 Form 校验

Form 级 `validator(values)` 返回错误对象或空字符串。配置 Form 级校验器后，提交/手动整体校验不会再执行 Field 级校验器；嵌套错误结构应与值路径一致。本例故意保留 familyName 错误以观察嵌套错误映射。

::demo-block{demo="form/zh-CN/FormValidator" title="同步 Form 校验"}
::

### 异步 Form 校验

Form 级校验器可返回 Promise。本例等待 2 秒后检查 name=mike、sex=female，仅模拟等待，不依赖远端服务。

::demo-block{demo="form/zh-CN/AsyncFormValidator" title="异步 Form 校验"}
::

### 自定义 Field 校验

Field 级 `validator(value, values)` 返回错误字符串，空字符串或 undefined 表示通过，也可返回 Promise。`validate` 是兼容别名，新代码使用 `validator`；触发时机由 `trigger` 控制。

::demo-block{demo="form/zh-CN/FieldValidator" title="自定义 Field 校验"}
::

### 静默校验

`validate({ silent: true })` 仍返回成功值或拒绝错误，但不会写入可见错误状态。适合先检查是否可继续某一步骤；静默校验不会自动清除先前已显示的错误。

::demo-block{demo="form/zh-CN/SilentValidation" title="静默校验"}
::

### 局部校验与重置

`validate([paths])` 和 `reset([paths])` 可仅处理所选字段，父路径可覆盖其后代字段。空数组不会等同于全表校验；需要全表时传完整范围或不传参数。

::demo-block{demo="form/zh-CN/PartialValidation" title="局部校验与重置"}
::

### 表单联动

字段 `@change` 中通过 FormApi 修改另一个字段即可联动。值状态仍由 Form 管理；不要给 Form.Field 再套一份独立 v-model。

::demo-block{demo="form/zh-CN/Dependencies" title="表单联动"}
::

### 动态删减表单项

用 `v-if` 根据 values 增删 Field。默认卸载后清理其值、错误和 touched；如果只是视觉隐藏而不想注销，应使用其他展示方式或明确配置 keepState。

::demo-block{demo="form/zh-CN/Dynamic" title="动态删减表单项"}
::

### 动态表单保留状态

`keepState` 在字段卸载后保留 value/error/touched，重新挂载时恢复。示例同时展示保留与不保留两个字段；Form 外部的开关只控制挂载。

::demo-block{demo="form/zh-CN/KeepState" title="动态表单保留状态"}
::

### 使用 ArrayField

ArrayField 的默认插槽提供 `arrayFields`、`add`、`addWithInitValue`；每行使用稳定 `key` 和由库提供的 `field` 路径。删除行使用对应 `remove()`，不要按索引缓存 fieldApi。

::demo-block{demo="form/zh-CN/ArrayFields" title="使用 ArrayField"}
::

### 嵌套 ArrayField

把嵌套 ArrayField 的路径设为父行 `${field}.rules`。独立子组件只管理这一层规则，外层管理规则组；各层增删会同步调整表单数据路径。

::demo-block{demo="form/zh-CN/NestedArrays" title="嵌套 ArrayField"}
::

### useFormApi

`useFormApi()` 在 Form 的后代组件 setup 中调用，返回最近一个 Form 的 API。不要在负责渲染 Form 的同一组件 setup 中调用，它尚不位于 provider 内部。

::demo-block{demo="form/zh-CN/UseFormApi" title="useFormApi"}
::

### useFormState

`useFormState()` 返回只读响应式 Ref，模板自动解包。若在脚本中读取，应使用 `.value`；不要修改返回状态来更新表单。

::demo-block{demo="form/zh-CN/UseFormState" title="useFormState"}
::

### useFieldApi

`useFieldApi("name")` 返回单字段 getter/setter，无需每次重复字段路径。依然必须在 Form 后代组件中调用。

::demo-block{demo="form/zh-CN/UseFieldApi" title="useFieldApi"}
::

### useFieldState

`useFieldState(field)` 返回该字段的 value/error/touched ComputedRef。将不同字段观察组件分开，避免把一次读取的快照当作响应式源。

::demo-block{demo="form/zh-CN/UseFieldState" title="useFieldState"}
::

### withFormApi

`withFormApi(Component)` 为子组件注入 formApi prop，作为 React HOC 迁移兼容写法。本例实际包装一个声明 FormApi prop 的 SFC；新代码通常优先 composable。

::demo-block{demo="form/zh-CN/WithFormApi" title="withFormApi"}
::

### withFormState

`withFormState(Component)` 将当前 FormState 作为 prop 注入，每次状态变化都会更新。接收组件只读 props，不修改 Form 内部状态。

::demo-block{demo="form/zh-CN/WithFormState" title="withFormState"}
::

### withField 封装原生控件

`withField`/`createFormField` 将原生控件接入数据流。Vue 配置使用 `valueProp`、`onUpdateEvent`（监听器键，例如 onChange）、`valuePath`；本例从 Event.target.value 提取值并过滤非 DOM 属性。

::demo-block{demo="form/zh-CN/CustomNative" title="withField 封装原生控件"}
::

### withField 封装组合控件

组合控件也可以作为单个字段，值是包含 name/role 的对象。子控件通过 emit 一个新对象通知 Form，不能原地修改传入的 value。

::demo-block{demo="form/zh-CN/CustomObject" title="withField 封装组合控件"}
::

### 使用 Form.useForm()

`useForm()`（亦可 `Form.useForm()`）返回 `[formApi, formStateRef, valuesComputedRef]`。把 api 传给 `<Form :form="api">`，然后在挂载后的事件中从外部修改值、重置或提交。

::demo-block{demo="form/zh-CN/ExternalForm" title="使用 Form.useForm()"}
::

## API 参考

以下保留固定上游 API 的语义，事件改为 Vue emits，ReactNode 改为 VNodeChild。类型以公开子路径导出为准。

### Form Props

| 属性                  | 说明                                                                                                                                                                                                                           | 类型                                             | 默认值     |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ | ---------- |
| autoScrollToError     | 若为 true，submit 或者调用 formApi.validate()校验失败时，将会自动滚动至出错的字段。object 型配置参考[options](https://github.com/stipsan/scroll-into-view-if-needed#options)                                                   | boolean\| object                                 | false      |
| allowEmpty            | 是否保留values中为空值的field的key，true时保留key，false时移除key                                                                                                                                                              | boolean                                          | false      |
| className             | form 标签的 classname                                                                                                                                                                                                          | string                                           |
| component             | 声明字段的 Vue 组件，与 render/default slot 三选一                                                                                                                                                                             | Component                                        | —          |
| disabled              | 统一应用在每个 Field 的 disabled 属性                                                                                                                                                                                          | boolean                                          | false      |
| extraTextPosition     | 统一应用在每个 Field 上的extraTextPosition属性，控制extraText的显示位置，可选`middle`（垂直方向以Label、extraText、Field主体的顺序显示）、`bottom` (垂直方向以Label、Field主体、extraText的顺序显示)                           | string                                           | 'bottom'   |
| getFormApi            | form mounted 时会回调该函数，将 formAPI 作为参数传入。formApi 可用于修改 form 内部状态（值、校验状态、错误信息）                                                                                                               | function(formApi:object)                         |            |
| form                  | 外部传入的 formApi 实例，可通过 `Form.useForm()` 创建。用于在 Form 外部控制表单状态。**>=2.94.0**                                                                                                                              | object                                           |            |
| initValues            | 用于统一设置表单初始值（仅会在组件挂载时消费一次），例如{fieldA:'hello', fieldB:['arr1', 'arr2']}                                                                                                                              | object                                           |            |
| layout                | Form 表单控件间的布局，目前支持水平(horizontal)、垂直(vertical)两种                                                                                                                                                            | string                                           | 'vertical' |
| labelAlign            | 统一配置label 的 text-align 值                                                                                                                                                                                                 | string                                           | 'left'     |
| labelCol              | 统一应用在每个 Field 的 label 标签布局，同[Col 组件](/zh-cn/components/grid/)，设置`span`、`offset`值，如{span: 6, offset: 2}                                                                                                  | object                                           |
| labelPosition         | 统一配置Field 中 label 的位置，可选'top'、'left'、'inset'(inset 标签内嵌仅部分组件支持)                                                                                                                                        | string                                           | 'top'      |
| labelWidth            | 统一配置label 宽度                                                                                                                                                                                                             | string\|number                                   |            |
| @change               | form 更新时触发，包括表单控件挂载/卸载/值变更/blur/验证状态变更/错误提示变更, 入参为 formState                                                                                                                                 | function(formState:object)                       |            |
| @value-change         | form 的值被更新时触发，仅在表单控件值发生变化时触发。第一个入参为 formState.values，第二个入参为当前发生变化的 field                                                                                                           | function(values:object, changedValue: object)    |            |
| @error-change         | form 的校验状态被更新时触发。第一个入参为 formState.errors，第二个入参为当前发生变化的 field 的名称与校验结果（v2.66后提供）                                                                                                   | function(values:object, changedError: object)    |            |
| @reset                | 点击 reset 按钮或调用 `formApi.reset()`时的回调函数                                                                                                                                                                            | function()                                       |            |
| @submit               | 点击 submit 按钮或调用 `formApi.submitForm()`，数据验证成功后的回调函数                                                                                                                                                        | function(values:object, e: event)                |            |
| @submit-fail          | 点击 submit 按钮或调用 `formApi.submitForm()`，数据验证失败后的回调函数                                                                                                                                                        | function(errors:object, values:object, e: event) |            |
| render                | 用于声明表单控件，不可与 component、默认插槽 同时使用                                                                                                                                                                          | function                                         |
| showValidateIcon      | Field 内的校验信息区块否自动添加对应状态的 icon 展示                                                                                                                                                                           | boolean                                          | true       |
| style                 | 可将内联样式传入 form 标签                                                                                                                                                                                                     | object                                           |
| stopValidateWithError | 统一应用在每个 Field 的 stopValidateWithError，使用说明见 Field props中同名 API （v2.42后提供）                                                                                                                                | boolean                                          | false      |
| stopPropagation       | 是否阻止 submit或reset事件冒泡，用于嵌套 Form 场景下，内部 Form submit或reset时阻止事件往外传播，触发外部Form的事件。默认为 `{ reset: false, submit: false }`（v2.63后提供）                                                   | object                                           |            |
| trigger               | 统一应用在每个 Field 的 trigger，使用说明详见 Field props中同名 API（v2.42后提供）                                                                                                                                             | string\|array                                    | 'change'   |
| validator             | Form 级别的自定义校验函数（推荐，v2.97.0 后提供），submit 时或 formApi.validate 时会被调用（配置 Form 级别校验器后，Field 级别校验器在 submit 或 formApi.validate() 时不会再被触发）。支持同步校验、异步校验                   | function(values)                                 |            |
| validateFields        | Form 级别的自定义校验函数（已废弃，建议使用 validator；仍保持兼容）。submit 时或 formApi.validate 时会被调用（配置 Form 级别校验器后，Field 级别校验器在 submit 或 formApi.validate() 时不会再被触发）。支持同步校验、异步校验 | function(values)                                 |            |
| wrapperCol            | 统一应用在每个 Field 上的布局，同[Col 组件](/zh-cn/components/grid/)，设置`span`、`offset`值，如{span: 20, offset: 4}                                                                                                          | object                                           |

### FormState

| Name    | 说明                                                                | 初始值 | 示例                            |
| ------- | ------------------------------------------------------------------- | ------ | ------------------------------- |
| values  | 表单的值                                                            | {}     | { fieldA: 'str', fieldB: true } |
| errors  | 表单错误信息集合,你可以通过判断是否有错误信息来决定是否允许用户提交 | {}     | { fieldA: 'length not valid'}   |
| touched | 用户点击过的 field 集合                                             | {}     | { fieldA: true }                |

### FormApi

| Function      | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | example                                                                                                                                                                                                                        |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| getFormProps  | 获取 Form 组件上当前所有props的值，例如可用于读取 disabled 等。v 2.57.0 后提供                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | formApi.getFormProps(propNames?: string[])                                                                                                                                                                                     |
| getFormState  | 获取 FormState                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | formApi.getFormState()                                                                                                                                                                                                         |
| submitForm    | 可手动触发 submit 提交操作                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | formApi.submitForm()                                                                                                                                                                                                           |
| reset         | 可手动对 form 进行重置                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | formApi.reset(fields?: Array <string\>)                                                                                                                                                                                        |
| validate      | 可手动触发对表单的校验，不传参时默认触发整全体Field的校验（配置Form级别校验器后，Field级别校验器在submit或formApi.validate()时不会再被触发），若想触发部分field的校验，将目标field数组传入即可<br/><br/>**v2.94.0 版本后支持静默校验**：传入 `{ silent: true }` 可在不触发 UI 更新（不显示错误提示、不设置 touched 状态）的情况下获取校验结果，也可通过 `{ fields: ['fieldA'], silent: true }` 对指定字段进行静默校验                                                                                                                                                                                            | formApi.validate()<br/>.then(values=>{})<br/>.catch(errors=>{}) <br/>或 formApi.validate(\['fieldA','fieldB'\])<br/>或 formApi.validate({ silent: true })<br/>或 formApi.validate({ fields: \['fieldA'\], silent: true })<br/> |
| setValues     | 设置整个表单的值。第二个参数中的 isOverride 默认为 false<br/>**isOverride 为 false 时**：遍历 Form 中所有已注册的 field，从 `newValues` 中取对应字段的值更新到 `formState.values` 中。如果 `newValues` 中不包含某个已注册 field 的值，该字段会被设置为 undefined。<br/>**isOverride 为 true 时**：直接用 `newValues` 整体替换 `formState.values`，包括 `newValues` 中存在但表单中没有对应 field 的额外 key 也会写入。<br/><br/>**推荐用法**：如果只需要更新部分字段，建议使用 `formApi.setValue(field, value)` 逐个更新，或者先获取当前值再合并：`formApi.setValues({ ...formApi.getValues(), name: newValue })` | formApi.setValues(newValues: object, { isOverride: boolean })                                                                                                                                                                  |
| setValue      | 提供直接修改 formState.values 方法，与 setValues 的区别是它仅修改单个 field                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | formApi.setValue(field: string, newFieldValue: any)                                                                                                                                                                            |
| getValue      | 获取 单个 Field 的值                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | formApi.getValue() <br/>formApi.getValue(field: string)                                                                                                                                                                        |
| getValues     | 获取 所有 Field 的值                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | formApi.getValues()                                                                                                                                                                                                            |
| setTouched    | 修改 formState.touched                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | formApi.setTouched(field: string, isTouched: boolean) <br/>                                                                                                                                                                    |
| getTouched    | 获取 Field 的 touched 状态                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | formApi.getTouched(field: string)                                                                                                                                                                                              |
| setError      | 修改 某个 field 的 error 信息                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | formApi.setError(field: string, fieldErrorMessage: string)                                                                                                                                                                     |
| getError      | 获取 Field 的 error 状态                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | formApi.getError(field: string)                                                                                                                                                                                                |
| getFieldExist | 获取 Form 中是否存在对应的 field                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | formApi.getFieldExist(field: string)                                                                                                                                                                                           |
| scrollToField | 滚动至指定的 field, 第二个入参将透传至scroll-into-view-if-needed                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | formApi.scrollToField(field: string, scrollOpts: [ScrollIntoViewOptions](https://github.com/stipsan/scroll-into-view-if-needed#options))                                                                                       |
| scrollToError | 滚动至校验错误的field，可传指定 field 或者 index，传入 index 则滚动到第 index 个错误的 DOM，若不传参则滚动到DOM树中第一个校验出错的位置。 v2.61.0后提供                                                                                                                                                                                                                                                                                                                                                                                                                                                          | formApi.scrollToError(<ApiType detail='{field?: string; index?: number; scrollOpts?: ScrollIntoViewOptions }'>ScrollToErrorOptions</ApiType>)                                                                                  |

### Field Props

| 属性                  | 说明                                                                                                                                                                                                                                    | 类型                                          | 默认值    |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | --------- |
| convert               | field 值改变后，在 rerender 前，对 filed 的值进行二次更新<br/> 使用示例: (value) => newValue                                                                                                                                            | function(fieldValue)                          |           |
| field                 | 该表单控件的值在 formState.values 中的映射路径，Form 会使用该值来区分内部的表单控件<br/>**必填!!!** 示例：[Bindding Syntax](#表单控件值的绑定)                                                                                          | string                                        |           |
| label                 | 该表单控件的 label 标签文本，不传的时候默认与 field 同名, 传入 object 时会将其透传给 Form.Label，具体配置请参考[Label](#Form.Label)                                                                                                     | string\|object                                |
| labelPosition         | 该表单控件的 label 位置，可选'top'/'left'/'inset'。在Form与Field上同时传入时，以Field props为准                                                                                                                                         | string                                        |
| labelAlign            | 该表单控件的 label 文本的 text-align。在Form与Field上同时传入时，以Field props为准                                                                                                                                                      | string                                        |
| labelWidth            | 该表单控件的 label 文本的 width。在Form与Field上同时传入时，以Field props为准                                                                                                                                                           | string\|number                                |
| noLabel               | 当你不需要自动添加 label 时，可以将该值置为 true                                                                                                                                                                                        | boolean                                       |
| noErrorMessage        | 当你不需要自动添加 ErrorMessage 模块时，可以将该值置为 true，注意此时 helpText 也不会被展示                                                                                                                                             | boolean                                       |
| name                  | 控件名称，传入时会自动在对应 field wrapper div 追加对应的 className，如：abc => '.semi-form-field-abc'。 v2.24 后，还会将 name 透传至底层组件消费，例如你可以用于配置 input的name属性                                                   | string                                        |
| fieldClassName        | 整个 fieldWrapper 的 className，作用与 name 参数一致，区别是不会自动追加前缀                                                                                                                                                            | string                                        |
| fieldStyle            | 整个 fieldWrapper 的 内联样式                                                                                                                                                                                                           | object                                        |
| initValue             | 该表单控件的初始值（仅在 Field mounted 时消费一次，后续更新无效），相比 Form 的 initValues 中的值，它的优先级更高                                                                                                                       | any（类型取决于当前组件，详细见各组件的 api） |
| validator             | **推荐**（v2.97.0 后提供）。该表单控件的自定义校验函数。支持同步、异步校验（通过返回 promise）。<br/>设置了 validator 时，rules 不会生效<br/>使用示例：(fieldValue, values) => fieldValue >= 5 ? 'value not valid' : ''                 | function(fieldValue, values)                  |           |
| validate              | **已废弃（仍兼容）**。请使用 validator 替代。该表单控件的自定义校验函数。支持同步、异步校验（通过返回 promise）。<br/>设置了 validate 时，rules 不会生效<br/>使用示例：(fieldValue, values) => fieldValue >= 5 ? 'value not valid' : '' | function(fieldValue, values)                  |           |
| rules                 | 校验规则，校验库基于[async-validator](https://github.com/yiminghe/async-validator) <br/> 使用示例：const rules=\[{ required: true, message: 'can't be null ' },<br/>{ max: 10, message: 'can't more than 10 word' }\]                   | array                                         |           |
| validateStatus        | 该表单控件的校验结果状态（仅影响样式），可选值:`success`/`error`/`warning`/`default`                                                                                                                                                    | string                                        | 'default' |
| trigger               | 触发校验的时机，可选值:`blur`/`change`/`custom`/`mount`，或以上值的组合\[`'blur'`,`'change'`\]<br/>1、设置为 custom 时，仅会由 formApi/fieldApi 触发校验时被触发<br/>2、mount（挂载时即触发一次校验）                                   | string/array                                  | 'change'  |
| @change               | 字段值变化的回调，最后一个参数提供最新表单 values；使用 `@change="handleChange"`                                                                                                                                                        | `(fieldValue, event, ...args, latestValues?)` | —         |
| onBlur                | 失去焦点时触发的回调                                                                                                                                                                                                                    | function() （具体参见各组件的 onBlur 方法）   |
| transform             | 校验前转换字段值，转换后的值仅会在校验时被消费，对 formState 无影响<br/> 使用示例: (value) => Number                                                                                                                                    | function(fieldValue)                          |           |
| allowEmptyString      | 是否允许值为空字符串。默认情况下值为''时，该 field 对应的 key 会从 values 中移除，如果你希望保留该 key，那么需要将 allowEmptyString 设为 true                                                                                           | boolean                                       | false     |
| keepState             | 是否在 Field 卸载后保留其状态（value、error、touched）。为 true 时，Field 卸载后其值、校验信息、交互状态不会丢失，再次挂载时会自动恢复                                                                                                  | boolean                                       | false     |
| stopValidateWithError | 为 true 时，使用 rules 校验，碰到第一个检验不通过的 rules 后，将不再触发后续 rules 的校验                                                                                                                                               | boolean                                       | false     |
| helpText              | 自定义提示信息，与校验信息公用同一区块展示，两者均有值时，优先展示校验信息                                                                                                                                                              | VNodeChild                                    |           |
| extraText             | 额外的提示信息，当需要错误信息和提示文案同时出现时，可以使用这个，位于 helpText/errorMessage 后                                                                                                                                         | VNodeChild                                    |           |
| pure                  | 是否仅接管数据流，为 true 时不会自动插入 ErrorMessage、Label、extraText 等模块，样式、DOM 结构与原始的组件保持一致                                                                                                                      | boolean                                       | false     |
| extraTextPosition     | 控制extraText的显示位置，可选`middle`（垂直方向以Label、extraText、Field主体的顺序显示）、`bottom` (垂直方向以Label、Field主体、extraText的顺序显示)；在Form与Field上同时传入时，以Field props为准                                      | string                                        | 'bottom'  |
| ...other              | 组件的其他可配置属性，与上面的属性平级一并传入即可，例如 Input 的 size/placeholder，**Field 会将其透传至组件本身**                                                                                                                      |                                               |

### ArrayField Props

| 属性         | 说明                                                                                                                                                           | 类型        | 默认值 |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------ |
| field        | 该表单控件的值在 formState.values 中的映射路径<br/>必填，例如存在 ArrayField负责 a[0].name、a[1].name、a[2].name三行渲染，他们的父级为a，此处props.field应为 a | string      |        |
| initValue    | ArrayField的初始值，如果同时在 formProps.initValues 与 arrayFieldProps.initValue 中都配置了初始值，后者优先级更高                                              | Array       | []     |
| default slot | 作用域为 `{ arrayFields, add, addWithInitValue }`，每行含 key/field/remove                                                                                     | scoped slot | —      |

### Form.Section

| 属性         | 说明     | 类型       | 版本 |
| ------------ | -------- | ---------- | ---- |
| text         | 段落标题 | VNodeChild | -    |
| className    | 样式类名 | string     | -    |
| style        | 内联样式 | object     | -    |
| default slot | 段落内容 | VNodeChild | -    |

### Form.Label

| 属性      | 说明                                                                                                                                                                                           | 类型          | 默认值 | 版本    |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------ | ------- |
| text      | Label 内容                                                                                                                                                                                     | VNodeChild    |        |         |
| required  | 是否展示必填的\*号                                                                                                                                                                             | boolean       | false  |         |
| extra     | 跟随在 required 后的内容                                                                                                                                                                       | VNodeChild    |        | -       |
| align     | text-align                                                                                                                                                                                     | string        | 'left' |         |
| className | 样式类名                                                                                                                                                                                       | string        |        |         |
| style     | 内联样式                                                                                                                                                                                       | string        |        |         |
| width     | label 宽度                                                                                                                                                                                     | number/string |        |         |
| optional  | 是否自动在text后追加"（可选）"文字标识（根据Locale配置的不同语言自动切换相同语义文本）。当该项为true时，required的\*号将不再展示。若当表单项多数均为必填时，仅强调可选项会更使得整体视觉更简洁 | boolean       | false  | v2.18.0 |

### Form.InputGroup

| 属性              | 说明                                                                                                                                         | 类型            | 默认值   | 版本    |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | -------- | ------- |
| className         | 样式类名                                                                                                                                     | string          |          |
| style             | 内联样式                                                                                                                                     | object          |          |
| label             | InputGroup 的 label 标签文本                                                                                                                 | Label \| string |          |
| labelPosition     | 该表单控件的 label 位置，可选'top'/'left'。在 Form 与 InputGroup 同时传入时，以 InputGroup props为准                                         | string          | 'top'    |
| extraText         | 额外的提示信息，当需要错误信息和提示文案同时出现时，可以使用这个，位于 errorMessage 后                                                       | VNodeChild      |          | v2.29.0 |
| extraTextPosition | 控制extraText的显示位置，可选`middle`（垂直方向以Label、extraText、Group的顺序显示）、`bottom` (垂直方向以Label、Group、extraText的顺序显示) | string          | 'bottom' | v2.29.0 |

### Form.Slot

| 属性         | 说明                                                                                                                               | 类型           |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| label        | slot 的[Label 配置](#Form.Label), 例如{ text: 'semi', align: 'left' }；也可以直接传入 string，Slot 内部会自动封装成合法 Label 格式 | object\|string |
| className    | slot 样式类名                                                                                                                      | string         |
| style        | slot 内联样式                                                                                                                      | object         |
| default slot | slot 的主体内容                                                                                                                    | VNodeChild     |

当前 Vue `FormSlotComponentProps` 公开类型只列出 label/className/style；运行时支持的 error/labelPosition/noLabel 尚未完整声明。本页通过独立 Form.ErrorMessage 组合错误区，不把类型缺口表述为新的公开契约。

### Form.ErrorMessage

| 属性             | 说明                                                                                       | 类型                               |
| ---------------- | ------------------------------------------------------------------------------------------ | ---------------------------------- |
| error            | 错误信息内容                                                                               | string\|array\|VNodeChild\|boolean |
| className        | 样式类名                                                                                   | string                             |
| style            | 内联样式                                                                                   | object                             |
| showValidateIcon | 是否自动加上 validateStatus 对应的 icon                                                    | boolean                            |
| validateStatus   | 信息所属的校验状态，可选 default/error/warning/success（success一般建议与default样式相同） | string                             |

### 公开类型补充

| 范围              | 属性                                                       | 类型 / 含义                                            |
| ----------------- | ---------------------------------------------------------- | ------------------------------------------------------ |
| Form              | id、ariaLabel                                              | string；表单 DOM 标识与可访问名称，亦可透传 aria-label |
| Field             | noErrorMessage                                             | boolean；隐藏自动错误区，仍执行校验                    |
| Field             | labelCol、wrapperCol                                       | ColProps；覆盖 Form 栅格配置                           |
| Field             | required                                                   | boolean；显式必填标识                                  |
| Field             | emptyValue                                                 | unknown；控件空值的适配输入                            |
| Form.Label        | id、name、disabled                                         | 标签标识、关联控件名和禁用态                           |
| Form.ErrorMessage | helpText、helpTextId、errorMessageId                       | 辅助文案和无障碍关联 ID                                |
| Form.ErrorMessage | isInInputGroup                                             | boolean；组合字段内的信息布局                          |
| FormApi           | getInitValue(field)、getInitValues()、getFieldExist(field) | 读取初始化快照和已注册字段状态                         |

### Vue 扩展与辅助类型

| API                                                           | 契约                                                                                             |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `useForm()` / `Form.useForm()`                                | 返回 `[FormApi, Ref<FormState>, ComputedRef<Values>]`，传 api 给 Form.form 后连接实例            |
| `useFormApi()` / `useFormState()`                             | 在 Form 后代 setup 中获取最近的 API / 只读状态 Ref                                               |
| `useFieldApi(field)`                                          | getValue/setValue/getError/setError/getTouched/setTouched                                        |
| `useFieldState(field)`                                        | `ComputedRef<{ value, error, touched }>`                                                         |
| `withFormApi(Component)` / `withFormState(Component)`         | 通过 props 注入 api/state 的迁移兼容包装                                                         |
| `withField(Component, options)` / `createFormField` / `Field` | 把控件转换为具有 CommonFieldProps 的表单字段                                                     |
| `ArrayField` 插槽                                             | `add(index?)`、`addWithInitValue(value, index?)`、`arrayFields`；每项 `key`、`field`、`remove()` |

### withFieldOption

| Vue 配置       | 说明                                             | 默认值   |
| -------------- | ------------------------------------------------ | -------- |
| valueProp      | 控件表示值的 prop，例如 value/checked            | value    |
| onUpdateEvent  | Vue 监听器 prop 键，例如 onChange（不是 change） | onChange |
| valuePath      | 从事件第一个参数提取值的路径，例如 target.value  | 参数本身 |
| maintainCursor | 适用于文本控件的光标保持                         | false    |

### FormApi 与状态说明

`getValue/getValues/getFormState` 返回快照；`setValue/setValues` 通过 API 更新，避免改动 getter 返回对象或 props。嵌套 Form、多个表单实例的上下文相互隔离。`setValues(values, { isOverride: true })` 替换已有值，默认逐个更新已注册字段，未提供的字段被置为 undefined；更新部分字段时应使用 setValue，或先把 getValues() 与局部值合并后再调用 setValues；`reset` 恢复初始化状态而非一律置空。`validate` 返回 Promise，拒绝必须处理；`submitForm()` 触发校验后发出 submit 或 submit-fail。

`@change` 包括字段挂载、卸载、blur 和校验状态变化；`@value-change` 只关注值变化。Field 的监听器先执行，再更新 Form 的 change/value-change。`trigger` 支持 change/blur/mount/custom 或数组；custom 时由 API 主动触发。字段显式 false 会覆盖 Form 布尔默认值，不用 truthiness 推导是否传入。

## React → Vue 迁移

| React v2.102.0                                 | Vue                                          | 说明                                                                         |
| ---------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------- |
| `onSubmit/onSubmitFail`                        | `@submit/@submit-fail`                       | 参数保留，事件订阅使用 emits                                                 |
| `onChange/onValueChange/onErrorChange/onReset` | `@change/@value-change/@error-change/@reset` | Field onChange 与 Form onChange 参数不同                                     |
| children render function                       | 默认 scoped slot                             | 提供 formState、formApi、values                                              |
| render 返回 JSX                                | render 返回 VNode / `h(SFC, scope)`          | 推荐模板 slot；示例保留 render 教学                                          |
| props.component                                | Vue Component                                | 接收 FormSlotProps                                                           |
| React ref                                      | `useForm()`、getFormApi 或组件 ref           | setup 阶段不能调用尚未挂载的 API                                             |
| hooks 直接返回状态对象                         | Ref/ComputedRef                              | 脚本 `.value`，模板自动解包                                                  |
| valueKey / onKeyChangeFnName                   | valueProp / onUpdateEvent                    | 使用 Vue 的监听器 prop 键 onChange                                           |
| ReactNode                                      | VNodeChild / slot                            | Field validator 当前公开类型返回 string/undefined，错误展示可用 ErrorMessage |
| className                                      | class 或兼容 className                       | `.semi-*` 和 `--semi-*` 保持样式契约                                         |
| ArrayField children                            | scoped slot + v-for                          | 每行绑定库提供的稳定 key                                                     |

## Accessibility

### ARIA、键盘与焦点

Field 根据 id/name/field 构建标签关联；普通标签使用 `for`，inset 模式使用标签 div 和 `aria-labelledby`。必填规则/标签会提供 `aria-required`（Switch、CheckboxGroup 按各自语义处理）；错误状态关联 `aria-invalid` 和 `aria-errormessage`，帮助/额外提示关联 `aria-describedby`。CheckboxGroup 的 ARIA 不应假设与单个 Input 完全一致。

使用 `noLabel`、`pure` 或自定义控件时仍需提供可访问名称。键盘行为遵循底层控件；本页操作按钮为 button/submit/reset 对应语义。动态增删后应在业务应用中将焦点移到合适的新字段或操作按钮。Modal 中的焦点与自动滚动需要真实 Chromium 验证，不能用 jsdom 代替。

## 文案规范

标签用简短名称描述字段，不把填写说明塞入标签；填写规则放在 helpText/extraText。英文标签采用句首大写。错误信息应指出问题和可执行修正方式；提交按钮明确动作。无标签控件不能只靠 placeholder 提供名称。

## 设计变量

Form 保留 `.semi-form`、`.semi-form-field`、标签位置属性及 `--semi-*` Token。默认主题通过 `form.css` 编译固定 Foundation SCSS；文本、边框、danger/warning/success 色值继承默认主题。暗色/RTL/Locale 由应用级 Provider 和主题上下文控制，业务页面不要复制上游 SCSS 或更名 class/Token。此页新增示例尚未逐例完成同 Chromium 的 light/dark 截图与 computed style 对照。

## FAQ

- **输入后 values 没有变化？** 检查 Field 的 field 必填路径，普通控件不会自动注册到 Form；自定义控件需通过 withField 接管。
- **defaultValue/defaultChecked 不生效？** Form 已接管值，请使用 initValues/initValue，后续修改用 FormApi。
- **异步数据加载后 initValues 不更新？** 初始化只消费一次；数据到达后调用 setValues。不要通过反复重建 Form 丢弃用户输入。
- **空字符串为什么从 values 消失？** 默认 allowEmpty=false；按需求使用 Form.allowEmpty 或 Field.allowEmptyString。
- **拿不到 formApi 或 hook 报错？** 注入型 composable 必须在 Form 后代 setup 中；外部控制使用 useForm 并等待挂载。
- **值修改正确但提交未通过？** 检查 Form validator 是否覆盖 Field 校验，以及 rules、trigger 和 Promise 拒绝；不要吞掉校验失败。
- **子组件 props/状态如何同步？** 使用 API setter 或 emit 新值，不修改 props 和 API getter 快照；各个表单实例保持隔离。

## 参考与验收边界

源码固定为 `vendor/semi-design` v2.102.0（`cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`），按 React adapter/types → Foundation/SCSS → 默认主题 → 本地中英文文档核对。上游真实上传、外部业务资源、随机值和系统当前日期改为本地确定性演示；React render/HOC 等章节保留对应 Vue 机制。39 对示例映射记录在 `docs/documentation/mappings/form.json`。类型/静态编译与章节覆盖属于本次文档证据；像素、真实焦点、Portal、暗色/RTL 和发布包验收仍须独立执行，不能从映射数量推断完成。
