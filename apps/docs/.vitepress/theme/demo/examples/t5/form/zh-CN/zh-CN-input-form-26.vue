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
    result.value = '校验通过';
  } catch {
    result.value = silent ? '校验失败，未更新页面错误状态' : '校验失败，请检查字段';
  }
}
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
</script>
<template>
  <Form :form="api" layout="horizontal">
    <Form.Input
      field="username"
      label="用户名"
      :rules="[
        { required: true, message: '此项不能为空' },
        { min: 3, message: '至少 3 个字符' },
      ]"
    />
    <Form.Input
      field="email"
      label="邮箱"
      :rules="[
        { required: true, message: '此项不能为空' },
        { type: 'email', message: '邮箱格式不正确' },
      ]"
    />
    <Button html-type="button" @click="validate(true)">静默校验</Button>
    <Button html-type="button" @click="validate(false)">普通校验</Button>
    <output aria-live="polite">{{ result }}</output>
  </Form>
</template>
