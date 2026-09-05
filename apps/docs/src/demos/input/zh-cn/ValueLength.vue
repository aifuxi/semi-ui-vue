<script setup lang="ts">
import { Input, TextArea } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/input.css';
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Form, FormInput } from '@aifuxi/semi-ui-vue/form';
import '@aifuxi/semi-theme-default/form.css';
import { shallowRef } from 'vue';
const value = shallowRef('');
// Chromium provides Unicode grapheme segmentation without an extra demo dependency.
const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
function getValueLength(value: string): number {
  return [...segmenter.segment(value)].length;
}
function getTextAreaStrLength(value: string): number {
  return value.replace(/\s/g, '').length;
}
</script>

<template>
  <div>
    <h4>maxLength=10</h4>
    <div>
      <Text>尝试输入以下字符</Text>
      <div><Text copyable>💖</Text></div>
      <div><Text copyable>👨‍👩‍👧‍👦</Text></div>
    </div>
    <Input
      v-model="value"
      :max-length="10"
      :get-value-length="getValueLength"
      style="width: 200px; margin-top: 12px; margin-bottom: 12px"
    />
    <div v-if="value">
      <div>
        <Text type="tertiary">{{ `getValueLength=${getValueLength(value)}` }}</Text>
      </div>
      <div>
        <Text type="tertiary">{{ `length=${value.length}` }}</Text>
      </div>
    </div>
    <br /><br />
    <h4>Form.Input + minLength=4</h4>
    <Form layout="horizontal"
      ><FormInput
        no-label
        field="username"
        :min-length="4"
        :get-value-length="getValueLength"
        style="width: 200px"
      /><Button type="primary" html-type="submit">提交</Button></Form
    >
    <h4>maxCount=10</h4>
    <TextArea
      default-value="semi design"
      :rows="2"
      :max-count="10"
      :get-value-length="getTextAreaStrLength"
      style="width: 200px"
    />
  </div>
</template>
