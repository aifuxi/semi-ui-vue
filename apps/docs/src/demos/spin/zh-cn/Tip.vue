<script setup lang="ts">
import { Spin } from '@aifuxi/semi-ui-vue/spin';
import '@aifuxi/semi-theme-default/spin.css';
</script>

<template>
  <Spin tip="正在加载…">
    <div style="border: 1px solid var(--semi-color-primary); border-radius: 4px; padding-left: 8px">
      <p>这里是一些文字。</p>
      <p>更多文字正在加载。</p>
    </div>
  </Spin>
</template>
