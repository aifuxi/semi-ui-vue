<script setup lang="ts">
import { BackTop } from '@aifuxi/semi-ui-vue/back-top';
import '@aifuxi/semi-theme-default/back-top.css';
import { IconArrowUp } from '@aifuxi/semi-icons-vue';
</script>

<template>
  <div>
    <span
      >Scroll down to see the bottom-right
      <span style="color: #0077fa">blue circular</span> button.</span
    ><BackTop
      style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border-radius: 100%;
        background-color: #0077fa;
        color: white;
        bottom: 100px;
      "
      ><button type="button" class="custom-backtop" aria-label="Back to top"><IconArrowUp /></button
    ></BackTop>
  </div>
</template>

<style scoped>
.custom-backtop {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  padding: 0;
  color: inherit;
  background: transparent;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  cursor: pointer;
}
</style>
