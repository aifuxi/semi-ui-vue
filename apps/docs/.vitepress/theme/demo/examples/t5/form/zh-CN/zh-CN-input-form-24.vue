<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Form } from '@aifuxi/semi-ui-vue/form';
async function validator(values: Record<string, unknown>) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return {
    ...(values.name === 'mike' ? {} : { name: '名称必须为 mike' }),
    ...(values.sex === 'female' ? {} : { sex: '此示例必须填写 female' }),
  };
}
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
</script>
<template>
  <Form :validator="validator" layout="horizontal">
    <Form.Input field="name" />
    <Form.Input field="familyName[0].before" />
    <Form.Input field="familyName[1]" />
    <Form.Input field="sex" />
    <Button html-type="submit">提交</Button>
    <Button html-type="reset">重置</Button>
  </Form>
</template>
