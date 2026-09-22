<script setup lang="ts">
import { Radio, RadioGroup } from '@aifuxi/semi-ui-vue/radio';
import '@aifuxi/semi-theme-default/radio.css';
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/space.css';
</script>

<template>
  <Space vertical spacing="loose" align="start">
    <RadioGroup
      type="button"
      button-size="small"
      :default-value="1"
      aria-label="RadioGroup demo"
      name="zh-cn-radio-small"
      ><Radio :value="1">即时推送</Radio><Radio :value="2">定时推送</Radio
      ><Radio :value="3">动态推送</Radio></RadioGroup
    >
    <RadioGroup
      type="button"
      button-size="middle"
      :default-value="1"
      aria-label="RadioGroup demo"
      name="zh-cn-radio-middle"
      ><Radio :value="1">即时推送</Radio><Radio :value="2">定时推送</Radio
      ><Radio :value="3">动态推送</Radio></RadioGroup
    >
    <RadioGroup
      type="button"
      button-size="large"
      :default-value="1"
      aria-label="RadioGroup demo"
      name="zh-cn-radio-large"
      ><Radio :value="1">即时推送</Radio><Radio :value="2">定时推送</Radio
      ><Radio :value="3">动态推送</Radio></RadioGroup
    >
  </Space>
</template>
