<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Form, useForm, type FormValidateStatus } from '@aifuxi/semi-ui-vue/form';
import { ref } from 'vue';
const [api] = useForm();
const help = ref('');
const status = ref<FormValidateStatus>('default');
const validator = (value: unknown) => {
  const password = String(value ?? '');
  status.value = !password ? 'error' : password.length <= 3 ? 'warning' : 'success';
  help.value = password && password.length <= 3 ? 'Password strength: weak' : '';
  return password ? '' : 'This field is required';
};
function generate() {
  api.setValue('Password', 'Semi42');
  api.setError('Password', '');
  help.value = '';
  status.value = 'success';
}
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
</script>
<template>
  <Form :form="api" show-validate-icon>
    <Form.Input
      field="Password"
      label="Password"
      :validator="validator"
      :validate-status="status"
      :help-text="help"
      extra-text="Use the button below to insert a demo password"
    />
    <Button html-type="button" @click="generate">Generate demo password</Button>
  </Form>
</template>
