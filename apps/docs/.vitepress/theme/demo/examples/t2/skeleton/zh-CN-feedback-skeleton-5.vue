<script setup lang="ts">
import { Skeleton, SkeletonAvatar, SkeletonTitle } from '@aifuxi/semi-ui-vue/skeleton';
import '@aifuxi/semi-theme-default/skeleton.css';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
</script>

<template>
  <Skeleton :loading="true">
    <template #placeholder
      ><div style="display: flex; align-items: center">
        <SkeletonAvatar style="margin-right: 12px" /><SkeletonTitle style="width: 120px" /></div
    ></template>
    <Avatar color="blue" style="margin-right: 12px">UI</Avatar><span>Semi UI</span>
  </Skeleton>
</template>
