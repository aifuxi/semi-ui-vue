<script setup lang="ts">
import { useAttrs } from 'vue';
defineOptions({ inheritAttrs: false });
defineProps<{ label: string }>();
const attrs = useAttrs();
</script>
<template>
  <span
    v-bind="attrs"
    style="
      border: 2px solid var(--semi-color-border);
      padding-left: 4px;
      padding-right: 4px;
      border-radius: 4px;
    "
    >{{ label }}</span
  >
</template>
