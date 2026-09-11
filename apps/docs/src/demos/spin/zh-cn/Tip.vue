<script setup lang="ts">
import { Spin } from '@aifuxi/semi-ui-vue/spin';
import '@aifuxi/semi-theme-default/spin.css';
</script>

<template>
  <Spin tip="I am loading...">
    <div style="border: 1px solid var(--semi-color-primary); border-radius: 4px; padding-left: 8px">
      <p>Here are some texts.</p>
      <p>And more texts on the way.</p>
    </div>
  </Spin>
</template>
