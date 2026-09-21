<script setup lang="ts">
import { Skeleton, SkeletonImage, SkeletonTitle } from '@aifuxi/semi-ui-vue/skeleton';
import '@aifuxi/semi-theme-default/skeleton.css';
</script>

<template>
  <Skeleton :loading="true">
    <template #placeholder
      ><div>
        <SkeletonImage style="width: 200px; height: 150px" /><SkeletonTitle
          style="width: 120px; margin-top: 10px"
        /></div
    ></template>
    <img src="/demos/photo.svg" height="150" alt="avatar" />
    <h4>Semi UI</h4>
  </Skeleton>
</template>
