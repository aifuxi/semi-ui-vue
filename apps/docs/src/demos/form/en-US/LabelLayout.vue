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
        label="Phone number"
        trigger="blur"
        :rules="[{ required: true, message: 'This field is required' }]"
      />
      <Form.Switch field="agree" label="I have read and agree to the terms" />
      <Form.InputNumber field="price" label="Price" />
      <Form.Select
        field="name"
        label="Username"
        :option-list="['mike', 'jane', 'kate'].map((value) => ({ value, label: value }))"
      />
      <Form.CheckboxGroup field="role" label="Role" :options="['admin', 'user', 'guest', 'root']" />
      <Form.RadioGroup field="sex" label="Sex">
        <Form.Radio value="male">male</Form.Radio>
        <Form.Radio value="female">female</Form.Radio>
      </Form.RadioGroup>
    </Form>
  </div>
</template>
