<script setup lang="ts">
defineProps<{ id?: string }>();
</script>

<template>
  <h3 :id="id" class="md gatsby-h3"><slot /><HeadingAnchor v-if="id" :id="id" /></h3>
</template>
