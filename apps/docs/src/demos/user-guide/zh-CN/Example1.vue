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
      title: '创建任务',
      description: '从这里开始创建一条新任务。',
      position: 'bottom',
    },
  ];
});
</script>

<template>
  <button ref="target" type="button" @click="visible = true">开始引导</button>
  <UserGuide
    v-model:current="current"
    :visible="visible"
    :steps="steps"
    @finish="visible = false"
    @skip="visible = false"
  />
</template>
