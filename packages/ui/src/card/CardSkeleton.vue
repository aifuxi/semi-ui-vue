<script setup lang="ts">
defineOptions({ name: 'CardSkeleton' });
</script>

<template>
  <div class="semi-skeleton semi-skeleton-active" x-semi-prop="placeholder">
    <div>
      <div class="semi-skeleton-title" />
      <br />
      <ul class="semi-skeleton-paragraph">
        <li v-for="index in 3" :key="index" />
      </ul>
    </div>
  </div>
</template>
