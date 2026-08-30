# Form 表单

`Form` 管理字段值、错误、触碰状态、校验、提交与重置。实现基线固定为 Semi Design v2.102.0；公开接口使用 Vue 原生 props、emits、slots 与 composable。

## 基础用法

```vue
<script setup lang="ts">
import { Form, type FormApi } from '@workspace/ui/form';

let formApi: FormApi;
</script>

<template>
  <Form :get-form-api="(api) => (formApi = api)" @submit="(values) => console.log(values)">
    <Form.Input field="name" label="名称" :rules="[{ required: true, message: '请输入名称' }]" />
    <Form.Select field="role" label="角色">
      <Form.Select.Option value="admin">管理员</Form.Select.Option>
    </Form.Select>
    <button type="submit">提交</button>
  </Form>
</template>
```

字段 `initValue` 优先于 `Form.initValues`。`validate()` 成功时返回值快照，失败时 reject 错误；传入 `{ silent: true }` 可只获取结果而不写入错误展示。

## 外部表单与数组字段

```vue
<script setup lang="ts">
import { ArrayField, Form, useForm } from '@workspace/ui/form';

const [formApi, formState, values] = useForm<{ people: Array<{ name: string }> }>();
</script>

<template>
  <Form :form="formApi" :init-values="{ people: [{ name: 'Semi' }] }">
    <ArrayField v-slot="{ arrayFields, addWithInitValue }" field="people">
      <Form.Input v-for="item in arrayFields" :key="item.key" :field="`${item.field}.name`" />
      <button type="button" @click="addWithInitValue({ name: '' })">新增</button>
    </ArrayField>
  </Form>
</template>
```

## 公开能力

- 字段：`Input`、`InputNumber`、`TextArea`、`Select`、`Checkbox/CheckboxGroup`、`Radio/RadioGroup`、`DatePicker`、`TimePicker`、`Switch`、`Slider`、`TreeSelect`、`Cascader`、`Rating`、`AutoComplete`、`Upload`、`TagInput`、`PinCode`。
- 展示：`Label`、`ErrorMessage`、`InputGroup`、`Section`、`Slot`。
- 扩展：`createFormField/withField`、`useForm*`、`useField*`、`withFormApi/withFormState`。
- 布局：`vertical/horizontal`、`top/left/inset`、Grid `labelCol/wrapperCol`、RTL 与暗色主题。

完整源码证据、默认值、事件顺序、DOM/ARIA、SSR 与浏览器验收见 [alignment.md](./alignment.md)，React 迁移见 [react-to-vue.md](./react-to-vue.md)。
