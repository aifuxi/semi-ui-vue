<script setup lang="ts">
import { h } from 'vue';
import { Tooltip } from '@aifuxi/semi-ui-vue/tooltip';
import { IconHelpCircle } from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/tooltip.css';
import { Form } from '@aifuxi/semi-ui-vue/form';
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
import '@aifuxi/semi-theme-default/select.css';
const passwordLabel = {
  text: 'Password',
  extra: h(
    Tooltip,
    { content: 'Details' },
    { default: () => h(IconHelpCircle, { style: { color: 'var(--semi-color-text-2)' } }) },
  ),
};
</script>
<template>
  <Form layout="horizontal">
    <Form.Input field="UserName" label="Username" style="width: 80px" />
    <Form.Input field="Password" :label="passwordLabel" style="width: 176px" />
    <Form.Select field="Role" :label="{ text: 'Role', optional: true }" style="width: 176px">
      <Form.Select.Option value="admin">Administrator</Form.Select.Option>
      <Form.Select.Option value="user">User</Form.Select.Option>
      <Form.Select.Option value="guest">Guest</Form.Select.Option>
    </Form.Select>
  </Form>
</template>
