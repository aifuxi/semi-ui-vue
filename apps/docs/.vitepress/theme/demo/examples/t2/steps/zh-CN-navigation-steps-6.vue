<script setup lang="ts">
import { Steps, Step } from '@aifuxi/semi-ui-vue/steps';
import '@aifuxi/semi-theme-default/steps.css';
function logChange(index: number) {
  console.log(index);
}
</script>

<template>
  <div :style="{ display: 'flex', justifyContent: 'center' }">
    <Steps type="nav" size="small" :current="1" :style="{ margin: 'auto' }" @change="logChange">
      <Step title="注册账号" />
      <Step title="这个项目的文字比较多多多多" />
      <Step title="产品用途" />
      <Step title="期待尝试功能" />
    </Steps>
  </div>
</template>
