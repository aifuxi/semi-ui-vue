<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Form } from '@aifuxi/semi-ui-vue/form';
const validator = (values: Record<string, unknown>) => ({
  ...(values.name === 'mike' ? {} : { name: 'Name must be mike' }),
  familyName: [
    { before: 'Invalid before field', after: 'Invalid after field' },
    'Invalid familyName[1]',
  ],
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
    <Button html-type="submit">Submit</Button>
    <Button html-type="reset">Reset</Button>
  </Form>
</template>
