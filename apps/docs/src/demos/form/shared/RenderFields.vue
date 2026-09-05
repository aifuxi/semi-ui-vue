<script setup lang="ts">
import { Form, type FormApi, type FormState } from '@aifuxi/semi-ui-vue/form';
import '@aifuxi/semi-theme-default/input.css';
import '@aifuxi/semi-theme-default/select.css';
defineProps<{ formApi: FormApi; formState: FormState; values: Record<string, unknown> }>();
</script>
<template>
  <Form.Select
    field="Role"
    style="width: 176px"
    :option-list="['admin', 'user', 'guest'].map((value) => ({ value, label: value }))"
  />
  <Form.Input field="UserName" style="width: 80px" />
  <Form.Input field="Password" style="width: 176px" />
  <pre>{{ JSON.stringify(formState, null, 2) }}</pre>
</template>
