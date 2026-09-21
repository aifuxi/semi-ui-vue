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
      label="通知方式"
      extra-text="未选择时使用红点提醒，可同时选择多种方式"
      :options="[
        { label: 'Lark', value: 'lark' },
        { label: 'Email', value: 'email' },
        { label: 'Banner', value: 'notification' },
      ]"
    />
    <Form.InputNumber
      field="force"
      label="强制读取时长（可选）"
      extra-text="指定消息多久之后才能标记为已读"
      extra-text-position="bottom"
    />
  </Form>
</template>
