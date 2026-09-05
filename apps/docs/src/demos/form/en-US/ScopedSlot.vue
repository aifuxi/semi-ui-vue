<script setup lang="ts">
import { Form } from '@aifuxi/semi-ui-vue/form';
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
import '@aifuxi/semi-theme-default/select.css';
</script>
<template>
  <Form v-slot="{ formState }" layout="horizontal">
    <Form.Input field="UserName" label="Username" style="width: 80px" />
    <Form.Input field="Password" label="Password" style="width: 176px" />
    <Form.Select field="Role" label="Role" style="width: 176px">
      <Form.Select.Option value="admin">Administrator</Form.Select.Option>
      <Form.Select.Option value="user">User</Form.Select.Option>
      <Form.Select.Option value="guest">Guest</Form.Select.Option>
    </Form.Select>
    <pre>{{ JSON.stringify(formState, null, 2) }}</pre>
  </Form>
</template>
