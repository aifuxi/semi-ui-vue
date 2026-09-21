<script setup lang="ts">
import { Form } from '@aifuxi/semi-ui-vue/form';
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
import '@aifuxi/semi-theme-default/select.css';
</script>
<template>
  <Form v-slot="{ formState }" layout="horizontal">
    <Form.Input field="UserName" label="用户名" style="width: 80px" />
    <Form.Input field="Password" label="密码" style="width: 176px" />
    <Form.Select field="Role" label="角色" style="width: 176px">
      <Form.Select.Option value="admin">管理员</Form.Select.Option>
      <Form.Select.Option value="user">普通用户</Form.Select.Option>
      <Form.Select.Option value="guest">访客</Form.Select.Option>
    </Form.Select>
    <pre>{{ JSON.stringify(formState, null, 2) }}</pre>
  </Form>
</template>
