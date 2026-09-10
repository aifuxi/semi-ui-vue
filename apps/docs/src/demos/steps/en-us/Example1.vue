<script setup lang="ts">
import { shallowRef } from 'vue';
import { Step, Steps } from '@aifuxi/semi-ui-vue/steps';

const current = shallowRef(1);
import '@aifuxi/semi-theme-default/steps.css';
</script>

<template>
  <Steps :current="current" @change="current = $event">
    <Step title="Finished" description="First description" />
    <Step title="In progress" description="Second description" />
    <Step title="Waiting" description="Third description" />
  </Steps>

  <Steps type="basic" size="small" :current="current" @change="current = $event">
    <Step title="Finished" description="First description" />
    <Step title="In progress" description="Second description" />
    <Step title="Waiting" description="Third description" />
  </Steps>
</template>
