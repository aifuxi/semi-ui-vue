<script setup lang="ts">
import { Form, withField } from '@aifuxi/semi-ui-vue/form';
import ObjectInput from '../shared/ObjectInput.vue';
const CustomField = withField(ObjectInput, { valueProp: 'value', onUpdateEvent: 'onChange' });
import '@aifuxi/semi-theme-default/form.css';
</script>
<template>
  <Form v-slot="{ formState }">
    <CustomField
      field="baseInfo"
      :labels="{ name: 'Name', role: 'Role', development: 'Development', design: 'Design' }"
      :label="{ text: 'Basic information', required: true }"
    />
    <pre>{{ JSON.stringify(formState, null, 2) }}</pre>
  </Form>
</template>
