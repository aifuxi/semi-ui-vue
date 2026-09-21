<script setup lang="ts">
import { Form } from '@aifuxi/semi-ui-vue/form';
import Child from '../shared/StateReceiver.vue';
import { withFormState } from '@aifuxi/semi-ui-vue/form';
const Wrapped = withFormState(Child);
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
</script>
<template>
  <Form>
    <Form.Input field="name" init-value="semi" />
    <Form.Input field="familyName" init-value="design" />
    <Wrapped />
  </Form>
</template>
