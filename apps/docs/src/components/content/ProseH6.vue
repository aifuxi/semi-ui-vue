<script setup lang="ts">
defineProps<{ id?: string }>();
</script>

<template>
  <h6 :id="id" class="md gatsby-h6"><slot /><HeadingAnchor v-if="id" :id="id" /></h6>
</template>
