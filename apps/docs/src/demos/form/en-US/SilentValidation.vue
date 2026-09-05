<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Form, useForm } from '@aifuxi/semi-ui-vue/form';
import { ref } from 'vue';
const [api] = useForm();
const result = ref('');
async function validate(silent: boolean) {
  try {
    await api.validate({ silent });
    result.value = 'Validation passed';
  } catch {
    result.value = silent
      ? 'Validation failed without updating visible errors'
      : 'Validation failed; check the fields';
  }
}
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
</script>
<template>
  <Form :form="api" layout="horizontal">
    <Form.Input
      field="username"
      label="Username"
      :rules="[
        { required: true, message: 'This field is required' },
        { min: 3, message: 'At least 3 characters' },
      ]"
    />
    <Form.Input
      field="email"
      label="Email"
      :rules="[
        { required: true, message: 'This field is required' },
        { type: 'email', message: 'Invalid email address' },
      ]"
    />
    <Button html-type="button" @click="validate(true)">Silent validation</Button>
    <Button html-type="button" @click="validate(false)">Normal validation</Button>
    <output aria-live="polite">{{ result }}</output>
  </Form>
</template>
