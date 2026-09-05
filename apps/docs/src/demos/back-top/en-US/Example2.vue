<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { BackTop } from '@aifuxi/semi-ui-vue/back-top';

const panel = useTemplateRef<HTMLElement>('panel');
const getTarget = () => panel.value;
import '@aifuxi/semi-theme-default/back-top.css';
</script>

<template>
  <div ref="panel" class="scroll-panel">
    <div class="long-content">...</div>
    <BackTop
      aria-label="Back to panel top"
      role="button"
      tabindex="0"
      :duration="300"
      :target="getTarget"
      :visibility-height="160"
      :style="{ right: '40px', bottom: '40px' }"
    >
      <span class="custom-back-top">TOP</span>
    </BackTop>
  </div>
</template>
