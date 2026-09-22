<script setup lang="ts">
import { Form } from '@aifuxi/semi-ui-vue/form';
import { ref } from 'vue';
const position = ref<'left' | 'top'>('left');
const align = ref<'left' | 'right'>('left');
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/checkbox.css';
import '@aifuxi/semi-theme-default/input.css';
import '@aifuxi/semi-theme-default/input-number.css';
import '@aifuxi/semi-theme-default/radio.css';
import '@aifuxi/semi-theme-default/select.css';
import '@aifuxi/semi-theme-default/switch.css';
</script>
<template>
  <div>
    <label
      >labelPosition
      <select v-model="position">
        <option>left</option>
        <option>top</option>
      </select>
    </label>
    <label
      >labelAlign
      <select v-model="align">
        <option>left</option>
        <option>right</option>
      </select>
    </label>
    <Form
      :key="position + align"
      :label-position="position"
      :label-align="align"
      :label-width="position === 'left' ? '180px' : 'auto'"
      style="max-width: 600px"
    >
      <Form.Input
        field="input"
        label="手机号码"
        trigger="blur"
        :rules="[{ required: true, message: '此项不能为空' }]"
      />
      <Form.Switch field="agree" label="我已阅读并同意相关条款" />
      <Form.InputNumber field="price" label="价格" />
      <Form.Select
        field="name"
        label="用户名"
        :option-list="['mike', 'jane', 'kate'].map((value) => ({ value, label: value }))"
      />
      <Form.CheckboxGroup field="role" label="角色" :options="['admin', 'user', 'guest', 'root']" />
      <Form.RadioGroup field="sex" label="性别">
        <Form.Radio value="male">male</Form.Radio>
        <Form.Radio value="female">female</Form.Radio>
      </Form.RadioGroup>
    </Form>
  </div>
</template>
