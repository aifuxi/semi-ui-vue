<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { UserGuide, type UserGuideStepItem } from '@aifuxi/semi-ui-vue/user-guide';
import '@aifuxi/semi-theme-default/user-guide.css';

const target = useTemplateRef<HTMLElement>('target');
const visible = ref(false);
const current = ref(0);
const steps = ref<UserGuideStepItem[]>([]);

onMounted(() => {
  steps.value = [
    {
      target: () => target.value,
      title: 'Create a task',
      description: 'Start a new task from here.',
      position: 'bottom',
    },
  ];
});
</script>

<template>
  <button ref="target" type="button" @click="visible = true">Start guide</button>
  <UserGuide
    v-model:current="current"
    :visible="visible"
    :steps="steps"
    @finish="visible = false"
    @skip="visible = false"
  />
</template>
