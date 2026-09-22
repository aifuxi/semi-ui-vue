<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Form } from '@aifuxi/semi-ui-vue/form';
function validate(value: unknown) {
  return !value ? '此项不能为空' : String(value).length <= 5 ? '长度必须大于 5' : '';
}
async function asyncValidate(value: unknown) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return validate(value);
}
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
</script>
<template>
  <Form>
    <Form.Input field="name" label="异步校验 (2s)" :validator="asyncValidate" trigger="blur" />
    <Form.Input field="familyName" label="同步校验" :validator="validate" trigger="blur" />
    <Button html-type="reset"> 重置 </Button>
  </Form>
</template>
