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
    <Form.Input field="phone" label="手机号码" />
    <Form.Input field="password" label="密码" type="password" />
    <Form.Checkbox field="agree" no-label>我已阅读并同意相关条款</Form.Checkbox>
    <Button html-type="submit" :disabled="!values.agree">登录</Button>
    <output aria-live="polite">{{ result }}</output>
  </Form>
</template>
