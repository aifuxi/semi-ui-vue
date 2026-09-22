<script setup lang="ts">
import { Form } from '@aifuxi/semi-ui-vue/form';
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
</script>
<template>
  <Form layout="horizontal">
    <Form.Input field="phone" label="手机号码" />
    <Form.Input field="password" label="密码" type="password" />
  </Form>
</template>
