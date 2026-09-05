<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Form } from '@aifuxi/semi-ui-vue/form';
async function validator(values: Record<string, unknown>) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return {
    ...(values.name === 'mike' ? {} : { name: 'Name must be mike' }),
    ...(values.sex === 'female' ? {} : { sex: 'Enter female for this example' }),
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
    <Button html-type="submit">Submit</Button>
    <Button html-type="reset">Reset</Button>
  </Form>
</template>
