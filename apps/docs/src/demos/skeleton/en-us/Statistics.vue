<script setup lang="ts">
import { Skeleton, SkeletonParagraph, SkeletonTitle } from '@aifuxi/semi-ui-vue/skeleton';
import '@aifuxi/semi-theme-default/skeleton.css';
import { Descriptions } from '@aifuxi/semi-ui-vue/descriptions';
import '@aifuxi/semi-theme-default/descriptions.css';
const data = [{ key: 'Actual User', value: '1,480,000' }];
</script>

<template>
  <Skeleton :loading="true">
    <template #placeholder
      ><div>
        <SkeletonParagraph :rows="1" style="width: 80px; margin-bottom: 10px" /><SkeletonTitle
          style="width: 120px"
        /></div
    ></template>
    <Descriptions :data="data" row />
  </Skeleton>
</template>
