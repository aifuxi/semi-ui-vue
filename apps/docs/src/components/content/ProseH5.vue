<script setup lang="ts">
defineProps<{ id?: string }>();
</script>

<template>
  <h5 :id="id" class="md gatsby-h5"><slot /><HeadingAnchor v-if="id" :id="id" /></h5>
</template>
