<script setup lang="ts">
import { shallowRef } from 'vue';
import { Step, Steps } from '@aifuxi/semi-ui-vue/steps';

const current = shallowRef(1);
import '@aifuxi/semi-theme-default/steps.css';
</script>

<template>
  <Steps :current="current" @change="current = $event">
    <Step title="已完成" description="第一步说明" />
    <Step title="进行中" description="第二步说明" />
    <Step title="等待中" description="第三步说明" />
  </Steps>

  <Steps type="basic" size="small" :current="current" @change="current = $event">
    <Step title="已完成" description="第一步说明" />
    <Step title="进行中" description="第二步说明" />
    <Step title="等待中" description="第三步说明" />
  </Steps>
</template>
