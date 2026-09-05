<script setup lang="ts">
defineProps<{ href?: string; target?: string }>();
</script>

<template>
  <a :href="href" :target="target" class="md gatsby-a"><slot /></a>
</template>
