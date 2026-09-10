<script setup lang="ts">
import { Steps, Step } from '@aifuxi/semi-ui-vue/steps';
import '@aifuxi/semi-theme-default/steps.css';
import { IconClear, IconHome, IconLock, IconTickCircle } from '@aifuxi/semi-icons-vue';
function logChange(index: number) {
  console.log(index);
}
</script>

<template>
  <Steps type="basic" @change="logChange">
    <Step status="finish" title="Login"
      ><template #icon><IconHome /></template
    ></Step>
    <Step status="finish" title="Verification"
      ><template #icon><IconLock /></template
    ></Step>
    <Step status="process" title="Pay"
      ><template #icon><IconClear /></template
    ></Step>
    <Step status="wait" title="Done"
      ><template #icon><IconTickCircle /></template
    ></Step>
  </Steps>

  <Steps type="basic" @change="logChange">
    <Step status="finish" title="Finished" />
    <Step status="error" title="Error" />
    <Step status="warning" title="Warning" />
    <Step status="process" title="In progress"
      ><template #icon><IconHome size="extra-large" /></template
    ></Step>
    <Step status="wait" title="Waiting"
      ><template #icon><IconLock size="extra-large" /></template
    ></Step>
  </Steps>
</template>
