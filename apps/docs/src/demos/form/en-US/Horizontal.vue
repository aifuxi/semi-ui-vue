<script setup lang="ts">
import { Form } from '@aifuxi/semi-ui-vue/form';
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
</script>
<template>
  <Form layout="horizontal">
    <Form.Input field="phone" label="Phone number" />
    <Form.Input field="password" label="Password" type="password" />
  </Form>
</template>
