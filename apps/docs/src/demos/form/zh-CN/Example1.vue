<script setup lang="ts">
import { shallowRef } from 'vue';
import { Form, type FormApi } from '@aifuxi/semi-ui-vue/form';

const formApi = shallowRef<FormApi>();
import '@aifuxi/semi-theme-default/form.css';
</script>

<template>
  <Form
    :get-form-api="(api) => (formApi = api)"
    @submit="(values: Record<string, unknown>) => console.log(values)"
  >
    <Form.Input field="name" label="名称" :rules="[{ required: true, message: '请输入名称' }]" />
    <Form.Select field="role" label="角色">
      <Form.Select.Option value="admin">管理员</Form.Select.Option>
    </Form.Select>
    <button type="submit">提交</button>
    <button type="button" @click="formApi?.reset()">重置</button>
  </Form>
</template>
