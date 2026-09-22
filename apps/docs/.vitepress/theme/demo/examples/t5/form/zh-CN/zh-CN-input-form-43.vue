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
      :labels="{ name: '名称', role: '角色', development: '开发', design: '设计' }"
      :label="{ text: '基本信息', required: true }"
    />
    <pre>{{ JSON.stringify(formState, null, 2) }}</pre>
  </Form>
</template>
