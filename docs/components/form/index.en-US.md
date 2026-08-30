# Form

`Form` owns field values, errors, touched state, validation, submit, and reset. The implementation is pinned to Semi Design v2.102.0 while exposing Vue-native props, emits, slots, and composables.

## Basic usage

```vue
<script setup lang="ts">
import { Form, type FormApi } from '@workspace/ui/form';

let formApi: FormApi;
</script>

<template>
  <Form :get-form-api="(api) => (formApi = api)" @submit="(values) => console.log(values)">
    <Form.Input
      field="name"
      label="Name"
      :rules="[{ required: true, message: 'Name is required' }]"
    />
    <Form.Select field="role" label="Role">
      <Form.Select.Option value="admin">Administrator</Form.Select.Option>
    </Form.Select>
    <button type="submit">Submit</button>
  </Form>
</template>
```

A field `initValue` takes precedence over `Form.initValues`. `validate()` resolves with a value snapshot and rejects with errors; `{ silent: true }` returns validation results without updating the visible error state.

## External form and array fields

```vue
<script setup lang="ts">
import { ArrayField, Form, useForm } from '@workspace/ui/form';

const [formApi, formState, values] = useForm<{ people: Array<{ name: string }> }>();
</script>

<template>
  <Form :form="formApi" :init-values="{ people: [{ name: 'Semi' }] }">
    <ArrayField v-slot="{ arrayFields, addWithInitValue }" field="people">
      <Form.Input v-for="item in arrayFields" :key="item.key" :field="`${item.field}.name`" />
      <button type="button" @click="addWithInitValue({ name: '' })">Add</button>
    </ArrayField>
  </Form>
</template>
```

## Public surface

- Fields: `Input`, `InputNumber`, `TextArea`, `Select`, `Checkbox/CheckboxGroup`, `Radio/RadioGroup`, `DatePicker`, `TimePicker`, `Switch`, `Slider`, `TreeSelect`, `Cascader`, `Rating`, `AutoComplete`, `Upload`, `TagInput`, and `PinCode`.
- Presentation: `Label`, `ErrorMessage`, `InputGroup`, `Section`, and `Slot`.
- Extension: `createFormField/withField`, `useForm*`, `useField*`, and `withFormApi/withFormState`.
- Layout: `vertical/horizontal`, `top/left/inset`, Grid `labelCol/wrapperCol`, RTL, and dark theme.

See [alignment.md](./alignment.md) for source evidence, defaults, event order, DOM/ARIA, SSR, and browser gates. See [react-to-vue.md](./react-to-vue.md) for migration details.
