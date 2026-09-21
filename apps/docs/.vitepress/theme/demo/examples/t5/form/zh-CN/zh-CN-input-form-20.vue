<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Form } from '@aifuxi/semi-ui-vue/form';
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
import '@aifuxi/semi-theme-default/select.css';
</script>
<template>
  <Form style="max-width: 400px">
    <Form.InputGroup :label="{ text: '手机号码', required: true }" label-position="top">
      <Form.Select
        field="phonePrefix"
        init-value="+86"
        :rules="[{ required: true }]"
        :option-list="['+1', '+852', '+86', '+81'].map((value) => ({ value, label: value }))"
        style="width: 150px"
        show-clear
      />
      <Form.Input
        field="phoneNumber"
        init-value="18912345678"
        :rules="[{ required: true }]"
        style="width: 250px"
        show-clear
      />
    </Form.InputGroup>
    <Form.Input field="name" label="用户名" init-value="Semi" />
    <Button html-type="submit"> 提交 </Button>
  </Form>
</template>
