<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Form, useForm } from '@aifuxi/semi-ui-vue/form';
const [api, state, values] = useForm();
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
</script>
<template>
  <div>
    <Button html-type="button" @click="api.setValue('username', 'semi')"
      >Set value externally</Button
    >
    <Button html-type="button" @click="api.reset()">Reset</Button>
    <Form :form="api">
      <Form.Input field="username" label="Username" />
      <Form.Input field="email" label="Email" />
    </Form>
    <pre>{{ JSON.stringify(values, null, 2) }}</pre>
    <pre>{{ JSON.stringify(state.touched, null, 2) }}</pre>
  </div>
</template>
