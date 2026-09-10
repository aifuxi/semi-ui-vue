<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { SideSheet } from '@aifuxi/semi-ui-vue/side-sheet';

const host = useTemplateRef<HTMLElement>('host');
const visible = ref(true);
import '@aifuxi/semi-theme-default/side-sheet.css';
</script>

<template>
  <section ref="host" class="sheet-host">
    <SideSheet
      v-model:visible="visible"
      placement="left"
      width="320px"
      title="容器内侧栏"
      :get-popup-container="() => host!"
    >
      内容
    </SideSheet>
  </section>
</template>
