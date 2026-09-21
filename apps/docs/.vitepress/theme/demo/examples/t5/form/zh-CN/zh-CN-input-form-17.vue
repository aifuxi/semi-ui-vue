<script setup lang="ts">
import { Form } from '@aifuxi/semi-ui-vue/form';
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
</script>
<template>
  <Form label-position="left" :label-width="100" style="max-width: 600px">
    <Form.Input field="effect" label="用户名" style="width: 250px" />
    <Form.Slot :label="{ text: 'SlotA' }">
      <p>自定义内容遵循 Form 标签布局</p>
      <Form.ErrorMessage error="自定义区域错误信息" />
    </Form.Slot>
    <Form.Slot :label="{ text: 'SlotB', width: 160, align: 'right' }">
      <p>此标签独立设置宽度与对齐</p>
    </Form.Slot>
  </Form>
</template>
