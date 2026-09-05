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
  text: '密码',
  extra: h(
    Tooltip,
    { content: '详情' },
    { default: () => h(IconHelpCircle, { style: { color: 'var(--semi-color-text-2)' } }) },
  ),
};
</script>
<template>
  <Form layout="horizontal">
    <Form.Input field="UserName" label="用户名" style="width: 80px" />
    <Form.Input field="Password" :label="passwordLabel" style="width: 176px" />
    <Form.Select field="Role" :label="{ text: '角色', optional: true }" style="width: 176px">
      <Form.Select.Option value="admin">管理员</Form.Select.Option>
      <Form.Select.Option value="user">普通用户</Form.Select.Option>
      <Form.Select.Option value="guest">访客</Form.Select.Option>
    </Form.Select>
  </Form>
</template>
