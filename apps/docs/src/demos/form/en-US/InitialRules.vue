<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Form } from '@aifuxi/semi-ui-vue/form';
import type { FormRule } from '@aifuxi/semi-ui-vue/form';
const rules: FormRule[] = [
  { required: true, message: 'This field is required' },
  { type: 'string', message: 'Must be a string' },
  { validator: (_rule, value) => value === 'semi', message: 'Must equal semi' },
  {
    validator: (_rule, value) => String(value ?? '').startsWith('se'),
    message: 'Must start with se',
  },
];
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
</script>
<template>
  <Form :init-values="{ name: 'semi', shortcut: 'se' }">
    <Form.Input field="name" label="Username" trigger="blur" :rules="rules" />
    <Form.Input field="shortcut" label="Shortcut" stop-validate-with-error :rules="rules" />
    <Button html-type="submit">Submit</Button>
  </Form>
</template>
