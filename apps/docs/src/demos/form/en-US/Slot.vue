<script setup lang="ts">
import { Form } from '@aifuxi/semi-ui-vue/form';
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
</script>
<template>
  <Form label-position="left" :label-width="100" style="max-width: 600px">
    <Form.Input field="effect" label="Username" style="width: 250px" />
    <Form.Slot :label="{ text: 'SlotA' }">
      <p>Custom content follows the Form label layout</p>
      <Form.ErrorMessage error="Custom section error" />
    </Form.Slot>
    <Form.Slot :label="{ text: 'SlotB', width: 160, align: 'right' }">
      <p>This label overrides width and alignment</p>
    </Form.Slot>
  </Form>
</template>
