<script setup lang="ts">
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
import IconCamera from '@aifuxi/semi-icons-vue/icons/IconCamera';
</script>

<template>
  <Avatar color="red" alt="Bob Downton">
    <template #default>BD</template>
    <template #hoverMask
      ><div
        style="
          background-color: var(--semi-color-overlay-bg);
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        <IconCamera /></div
    ></template>
  </Avatar>
</template>
