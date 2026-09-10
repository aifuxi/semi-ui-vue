<script setup lang="ts">
import { Steps, Step } from '@aifuxi/semi-ui-vue/steps';
import '@aifuxi/semi-theme-default/steps.css';
import { shallowRef } from 'vue';
const current = shallowRef(1);
const steps = [{ title: 'First' }, { title: 'Second' }, { title: 'Last' }];
function onChange(index: number) {
  current.value = index;
}
</script>

<template>
  <div>
    <Steps type="basic" :current="current" @change="onChange"
      ><Step v-for="step in steps" :key="step.title" :title="step.title"
    /></Steps>
  </div>
</template>
