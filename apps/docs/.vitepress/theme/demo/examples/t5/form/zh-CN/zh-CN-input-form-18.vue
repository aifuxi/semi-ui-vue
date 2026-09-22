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
  help.value = password && password.length <= 3 ? '密码强度：弱' : '';
  return password ? '' : '此项不能为空';
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
      label="密码"
      :validator="validator"
      :validate-status="status"
      :help-text="help"
      extra-text="可使用下方按钮填入演示密码"
    />
    <Button html-type="button" @click="generate">生成演示密码</Button>
  </Form>
</template>
