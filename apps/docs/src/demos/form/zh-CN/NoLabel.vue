<script setup lang="ts">
import { Form } from '@aifuxi/semi-ui-vue/form';
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
</script>
<template>
  <Form>
    <Form.Input field="name" label="用户名" no-label aria-label="用户名" placeholder="用户名" />
    <Form.Input field="purename" pure aria-label="仅接管数据流" placeholder="仅接管数据流" />
  </Form>
</template>
