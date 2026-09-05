<script setup lang="ts">
import { Form } from '@aifuxi/semi-ui-vue/form';
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/date-picker.css';
import '@aifuxi/semi-theme-default/input.css';
import '@aifuxi/semi-theme-default/select.css';
</script>
<template>
  <Form label-position="inset" layout="horizontal">
    <Form.Input field="name" label="Username" init-value="semi" style="width: 250px" />
    <Form.Select
      field="role"
      label="Role"
      init-value="rd"
      style="width: 250px"
      :option-list="['operate', 'rd', 'pm', 'ued'].map((value) => ({ value, label: value }))"
    />
    <Form.DatePicker
      field="date"
      label="Date"
      :init-value="new Date(2024, 0, 15)"
      style="width: 250px"
    />
  </Form>
</template>
