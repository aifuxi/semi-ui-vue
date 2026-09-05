<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Form, useForm } from '@aifuxi/semi-ui-vue/form';
import { ref } from 'vue';
const [api] = useForm();
const result = ref('');
const fields = ['a[1]', 'a[0]', 'b.name[0]', 'b.name[1]', 'b.type', 'c', 'd'];
const options = ['a', 'b', 'c', 'd', 'b.name'];
const validator = (value: unknown) =>
  !value ? 'This field is required' : String(value).length <= 5 ? 'Length must exceed 5' : '';
async function validate(all = false) {
  try {
    await api.validate(all ? options : ((api.getValue('validateScope') as string[]) ?? []));
    result.value = 'Validation passed';
  } catch {
    result.value = 'Validation failed; check the fields';
  }
}
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/checkbox.css';
import '@aifuxi/semi-theme-default/input.css';
</script>
<template>
  <Form :form="api" auto-scroll-to-error>
    <Form.Input
      v-for="field in fields"
      :key="field"
      :field="field"
      :validator="validator"
      trigger="blur"
    />
    <Form.CheckboxGroup
      field="validateScope"
      label="Fields to validate"
      :options="options"
      :init-value="['a', 'b']"
    />
    <Form.CheckboxGroup field="resetScope" label="Fields to reset" :options="options" />
    <Button html-type="reset"> Reset</Button>
    <Button html-type="button" @click="validate(true)">Validate all</Button>
    <Button html-type="button" @click="validate()">Validate selected</Button>
    <Button html-type="button" @click="api.reset(api.getValue('resetScope') as string[])">
      Reset selected</Button
    >
    <output>{{ result }}</output>
  </Form>
</template>
