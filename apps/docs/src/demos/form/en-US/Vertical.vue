<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Form } from '@aifuxi/semi-ui-vue/form';
import { ref } from 'vue';
const result = ref('');
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/checkbox.css';
import '@aifuxi/semi-theme-default/input.css';
</script>
<template>
  <Form v-slot="{ values }" style="max-width: 400px" @submit="result = JSON.stringify($event)">
    <Form.Input field="phone" label="Phone number" />
    <Form.Input field="password" label="Password" type="password" />
    <Form.Checkbox field="agree" no-label>I have read and agree to the terms</Form.Checkbox>
    <Button html-type="submit" :disabled="!values.agree">Log in</Button>
    <output aria-live="polite">{{ result }}</output>
  </Form>
</template>
