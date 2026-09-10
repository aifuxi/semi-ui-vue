<script setup lang="ts">
defineProps<{ label: string }>();
</script>
<template>
  <span
    style="
      border: 2px solid var(--semi-color-border);
      padding-left: 4px;
      padding-right: 4px;
      border-radius: 4px;
    "
    >{{ label }}</span
  >
</template>
