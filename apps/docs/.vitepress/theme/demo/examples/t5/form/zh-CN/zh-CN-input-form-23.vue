<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Form } from '@aifuxi/semi-ui-vue/form';
const validator = (values: Record<string, unknown>) => ({
  ...(values.name === 'mike' ? {} : { name: '名称必须为 mike' }),
  familyName: [{ before: 'before 字段错误', after: 'after 字段错误' }, 'familyName[1] 字段错误'],
});
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
</script>
<template>
  <Form :validator="validator" layout="horizontal">
    <Form.Input field="name" />
    <Form.Input field="familyName[0].before" />
    <Form.Input field="familyName[0].after" />
    <Form.Input field="familyName[1]" />
    <Button html-type="submit">提交</Button>
    <Button html-type="reset">重置</Button>
  </Form>
</template>
