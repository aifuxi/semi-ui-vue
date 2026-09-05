<script setup lang="ts">
import { Form } from '@aifuxi/semi-ui-vue/form';
const paths = [
  'username',
  'user[0]',
  'siblings.1',
  "siblings['2']",
  'parents[0].name',
  "parents[1]['name']",
];
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
</script>
<template>
  <Form v-slot="{ values }">
    <Form.Input v-for="field in paths" :key="field" :field="field" />
    <Form.Label text="FormState.values" />
    <pre>{{ JSON.stringify(values, null, 2) }}</pre>
  </Form>
</template>
