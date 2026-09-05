<script setup lang="ts">
defineProps<{ id?: string }>();
</script>

<template>
  <h2 :id="id" class="md gatsby-h2"><slot /><HeadingAnchor v-if="id" :id="id" /></h2>
</template>
