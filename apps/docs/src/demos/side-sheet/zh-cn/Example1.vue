<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { SideSheet } from '@aifuxi/semi-ui-vue/side-sheet';
import '@aifuxi/semi-theme-default/side-sheet.css';

const visible = ref(false);
import '@aifuxi/semi-theme-default/button.css';
</script>

<template>
  <Button @click="visible = true">打开详情</Button>
  <SideSheet v-model:visible="visible" title="资源详情">
    <p>这里是侧边栏内容。</p>
  </SideSheet>
</template>
