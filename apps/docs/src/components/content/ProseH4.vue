<script setup lang="ts">
defineProps<{ id?: string }>();
</script>

<template>
  <h4 :id="id" class="md gatsby-h4"><slot /><HeadingAnchor v-if="id" :id="id" /></h4>
</template>
