<script setup lang="ts">
import '@aifuxi/semi-theme-default/icon.css';
import { IconAIBellLevel3, IconAIWandLevel3, IconAIFilledLevel3 } from '@aifuxi/semi-icons-vue';
</script>

<template>
  <div>
    <IconAIBellLevel3 :style="{ marginRight: '10px' }" size="extra-large" />
    <IconAIWandLevel3
      :fill="[
        'var(--semi-color-danger)',
        'var(--semi-color-success)',
        'var(--semi-color-primary)',
        'var(--semi-color-warning)',
      ]"
      :style="{ marginRight: '10px' }"
      size="extra-large"
    />
    <IconAIFilledLevel3
      :fill="['var(--semi-color-primary)', 'var(--semi-color-success)']"
      size="extra-large"
    />
  </div>
</template>
