<script setup lang="ts">
import '@aifuxi/semi-theme-default/icon.css';
import { IconAIWandLevel2, IconAIFilledLevel2 } from '@aifuxi/semi-icons-vue';
</script>

<template>
  <div>
    <IconAIWandLevel2
      :fill="['var(--semi-color-danger)', 'var(--semi-color-success)']"
      :style="{ marginRight: '10px' }"
      size="extra-large"
    />
    <IconAIFilledLevel2 :fill="'var(--semi-color-success)'" size="extra-large" />
  </div>
</template>
