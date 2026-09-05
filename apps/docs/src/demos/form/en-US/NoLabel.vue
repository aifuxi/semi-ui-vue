<script setup lang="ts">
import { Form } from '@aifuxi/semi-ui-vue/form';
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
</script>
<template>
  <Form>
    <Form.Input
      field="name"
      label="Username"
      no-label
      aria-label="Username"
      placeholder="Username"
    />
    <Form.Input
      field="purename"
      pure
      aria-label="Manage data only"
      placeholder="Manage data only"
    />
  </Form>
</template>
