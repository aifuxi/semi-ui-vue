<script setup lang="ts">
import { Form, withField } from '@aifuxi/semi-ui-vue/form';
import NativeInput from '../shared/NativeInput.vue';
const CustomInput = withField(NativeInput, {
  valueProp: 'value',
  onUpdateEvent: 'onChange',
  valuePath: 'target.value',
});
import '@aifuxi/semi-theme-default/form.css';
</script>
<template>
  <Form v-slot="{ formState }">
    <CustomInput field="name" label="Username" />
    <pre>{{ JSON.stringify(formState, null, 2) }}</pre>
  </Form>
</template>
