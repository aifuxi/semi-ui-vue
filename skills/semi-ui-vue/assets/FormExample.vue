<script setup lang="ts">
import { ref } from 'vue';
import { Form, type FormEmits } from '@aifuxi/semi-ui-vue/form';

const message = ref('');

const handleSubmit: (...args: FormEmits['submit']) => void = (values) => {
  message.value = `提交成功：${String(values.name)}`;
};
</script>

<template>
  <Form trigger="custom" @submit="handleSubmit" @submit-fail="message = '请检查表单中的错误'">
    <Form.Input
      field="name"
      label="姓名"
      autocomplete="name"
      :rules="[{ required: true, message: '请输入姓名' }]"
    />
    <button type="submit">提交</button>
  </Form>
  <p role="status">{{ message }}</p>
</template>
