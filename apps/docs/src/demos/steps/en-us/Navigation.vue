<script setup lang="ts">
import { Steps, Step } from '@aifuxi/semi-ui-vue/steps';
import '@aifuxi/semi-theme-default/steps.css';
function logChange(index: number) {
  console.log(index);
}
</script>

<template>
  <div :style="{ display: 'flex', justifyContent: 'center' }">
    <Steps type="nav" :current="1" :style="{ margin: 'auto' }" @change="logChange">
      <Step title="Register an account" />
      <Step title="There is a lot of text in this project" />
      <Step title="Product Usage" />
      <Step title="Looking forward to trying out features" />
    </Steps>
  </div>
</template>
