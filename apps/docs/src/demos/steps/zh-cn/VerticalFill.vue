<script setup lang="ts">
import { Steps, Step } from '@aifuxi/semi-ui-vue/steps';
import '@aifuxi/semi-theme-default/steps.css';
function logChange(index: number) {
  console.log(index);
}
</script>

<template>
  <Steps direction="vertical" :current="1" :style="{ width: '300px' }" @change="logChange">
    <Step title="Finished" description="This is a description" />
    <Step title="In Progress" description="This is a description" />
    <Step title="Waiting" description="This is a description" />
  </Steps>
</template>
