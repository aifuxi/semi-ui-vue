<script setup lang="ts">
import { Skeleton, SkeletonParagraph, SkeletonButton } from '@aifuxi/semi-ui-vue/skeleton';
import '@aifuxi/semi-theme-default/skeleton.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
const columnStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  width: '300px',
  marginBottom: '10px',
};
</script>

<template>
  <Skeleton :loading="true" style="text-align: center">
    <template #placeholder
      ><div :style="columnStyle">
        <SkeletonParagraph :style="columnStyle" :rows="3" /><SkeletonButton /></div
    ></template>
    <div style="text-align: center">
      <p>Hi, Bytedance dance dance.</p>
      <p>Hi, Bytedance dance dance.</p>
      <Button>Button</Button>
    </div>
  </Skeleton>
</template>
