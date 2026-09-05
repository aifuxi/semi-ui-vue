<script setup lang="ts">
import { Radio, RadioGroup } from '@aifuxi/semi-ui-vue/radio';
import '@aifuxi/semi-theme-default/radio.css';
</script>

<template>
  <RadioGroup
    type="card"
    :default-value="2"
    direction="vertical"
    aria-label="RadioGroup demo"
    name="zh-cn-radio-card"
    ><Radio
      v-for="value in [1, 2, 3]"
      :key="value"
      :value="value"
      :disabled="value === 1"
      extra="Semi Design 是由抖音前端团队与 UED 团队共同设计开发并维护的设计系统"
      style="width: 280px"
      >单选框标题</Radio
    ></RadioGroup
  >
</template>
