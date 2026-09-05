<script setup lang="ts">
import { Form } from '@aifuxi/semi-ui-vue/form';
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/checkbox.css';
import '@aifuxi/semi-theme-default/input.css';
import '@aifuxi/semi-theme-default/input-number.css';
</script>
<template>
  <Form extra-text-position="middle">
    <Form.CheckboxGroup
      field="notify"
      label="Notification channels"
      extra-text="An unread dot is the default; multiple channels can be selected"
      :options="[
        { label: 'Lark', value: 'lark' },
        { label: 'Email', value: 'email' },
        { label: 'Banner', value: 'notification' },
      ]"
    />
    <Form.InputNumber
      field="force"
      label="Required reading time (optional)"
      extra-text="Specify when a message can be marked as read"
      extra-text-position="bottom"
    />
  </Form>
</template>
