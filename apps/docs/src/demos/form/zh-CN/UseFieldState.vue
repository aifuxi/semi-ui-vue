<script setup lang="ts">
import { Form } from '@aifuxi/semi-ui-vue/form';
import Child from '../shared/FieldStateView.vue';
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
</script>
<template>
  <Form>
    <Form.Input field="name" init-value="mike" />
    <Form.Input field="country" init-value="china" />
    <Child field="name" />
    <Child field="country" />
  </Form>
</template>
