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
    <Form.Input
      field="name"
      label="Name"
      :rules="[{ required: true, message: 'Name is required' }]"
    />
    <Form.Select field="role" label="Role">
      <Form.Select.Option value="admin">Administrator</Form.Select.Option>
    </Form.Select>
    <button type="submit">Submit</button>
    <button type="button" @click="formApi?.reset()">Reset</button>
  </Form>
</template>
