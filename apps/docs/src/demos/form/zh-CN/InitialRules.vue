<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Form } from '@aifuxi/semi-ui-vue/form';
import type { FormRule } from '@aifuxi/semi-ui-vue/form';
const rules: FormRule[] = [
  { required: true, message: '此项不能为空' },
  { type: 'string', message: '必须为字符串' },
  { validator: (_rule, value) => value === 'semi', message: '必须为 semi' },
  { validator: (_rule, value) => String(value ?? '').startsWith('se'), message: '必须以 se 开头' },
];
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
</script>
<template>
  <Form :init-values="{ name: 'semi', shortcut: 'se' }">
    <Form.Input field="name" label="用户名" trigger="blur" :rules="rules" />
    <Form.Input field="shortcut" label="缩写" stop-validate-with-error :rules="rules" />
    <Button html-type="submit">提交</Button>
  </Form>
</template>
