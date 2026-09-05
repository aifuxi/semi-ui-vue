<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Form } from '@aifuxi/semi-ui-vue/form';
function validate(value: unknown) {
  return !value
    ? 'This field is required'
    : String(value).length <= 5
      ? 'Length must exceed 5'
      : '';
}
async function asyncValidate(value: unknown) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return validate(value);
}
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
</script>
<template>
  <Form>
    <Form.Input
      field="name"
      label="Asynchronous validation (2s)"
      :validator="asyncValidate"
      trigger="blur"
    />
    <Form.Input
      field="familyName"
      label="Synchronous validation"
      :validator="validate"
      trigger="blur"
    />
    <Button html-type="reset">Reset</Button>
  </Form>
</template>
