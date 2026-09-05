<script setup lang="ts">
import { ArrayField, Form, useForm } from '@aifuxi/semi-ui-vue/form';

const [formApi] = useForm();
import '@aifuxi/semi-theme-default/form.css';
</script>

<template>
  <Form :form="formApi" :init-values="{ people: [{ name: 'Semi' }] }">
    <ArrayField v-slot="{ arrayFields, addWithInitValue }" field="people">
      <Form.Input v-for="item in arrayFields" :key="item.key" :field="`${item.field}.name`" />
      <button type="button" @click="addWithInitValue({ name: '' })">新增</button>
    </ArrayField>
  </Form>
</template>
