<script setup lang="ts">
import { Form } from '@aifuxi/semi-ui-vue/form';
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
import '@aifuxi/semi-theme-default/select.css';
</script>
<template>
  <Form
    :wrapper-col="{ span: 20 }"
    :label-col="{ span: 2 }"
    label-position="left"
    label-align="right"
  >
    <Form.Input field="name" label="用户名" style="width: 250px" />
    <Form.Select
      field="role"
      label="角色"
      style="width: 250px"
      :option-list="['operate', 'rd', 'pm', 'ued'].map((value) => ({ value, label: value }))"
    />
  </Form>
</template>
