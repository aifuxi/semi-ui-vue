<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Steps, Step } from '@aifuxi/semi-ui-vue/steps';
import '@aifuxi/semi-theme-default/steps.css';
import { computed, shallowRef } from 'vue';
const current = shallowRef(0);
const steps = [
  { title: 'First', content: 'First-content' },
  { title: 'Second', content: 'Second-content' },
  { title: 'Last', content: 'Last-content' },
];
const content = computed(() => steps[current.value]?.content);
function next() {
  current.value += 1;
}
function previous() {
  current.value -= 1;
}
function logChange(index: number) {
  console.log(index);
}
function done() {
  console.log('Processing complete!');
}
</script>

<template>
  <div>
    <Steps type="basic" :current="current" @change="logChange"
      ><Step v-for="step in steps" :key="step.title" :title="step.title"
    /></Steps>
    <div class="steps-content" style="margin-top: 4px; margin-bottom: 4px">{{ content }}</div>
    <div class="steps-action">
      <Button v-if="current < steps.length - 1" type="primary" @click="next">Next</Button>
      <Button v-if="current === steps.length - 1" type="primary" @click="done">Done</Button>
      <Button v-if="current > 0" style="margin-left: 8px" @click="previous">Previous</Button>
    </div>
  </div>
</template>
