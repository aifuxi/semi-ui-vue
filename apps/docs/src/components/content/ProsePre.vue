<script setup lang="ts">
defineProps<{
  code?: string;
  language?: string;
  filename?: string;
  highlights?: number[];
  meta?: string;
}>();
</script>

<template>
  <pre class="docs-code"><slot /></pre>
</template>
