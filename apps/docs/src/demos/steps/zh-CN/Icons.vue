<script setup lang="ts">
import { Steps, Step } from '@aifuxi/semi-ui-vue/steps';
import '@aifuxi/semi-theme-default/steps.css';
import { IconHome, IconLock } from '@aifuxi/semi-icons-vue';
function logChange(index: number) {
  console.log(index);
}
</script>

<template>
  <Steps type="basic" @change="logChange">
    <Step status="finish" title="已完成" />
    <Step status="error" title="错误" />
    <Step status="warning" title="警告" />
    <Step status="process" title="正在进行"
      ><template #icon><IconHome size="extra-large" /></template
    ></Step>
    <Step status="wait" title="等待"
      ><template #icon><IconLock size="extra-large" /></template
    ></Step>
  </Steps>
</template>
