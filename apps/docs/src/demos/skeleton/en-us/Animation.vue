<script setup lang="ts">
import {
  Skeleton,
  SkeletonAvatar,
  SkeletonTitle,
  SkeletonParagraph,
} from '@aifuxi/semi-ui-vue/skeleton';
import '@aifuxi/semi-theme-default/skeleton.css';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
</script>

<template>
  <Skeleton :loading="true" active>
    <template #placeholder
      ><div style="display: flex; align-items: flex-start">
        <SkeletonAvatar style="margin-right: 12px" />
        <div>
          <SkeletonTitle
            style="width: 120px; margin-bottom: 12px; margin-top: 12px"
          /><SkeletonParagraph style="width: 240px" :rows="3" />
        </div></div
    ></template>
    <div style="display: flex; align-items: flex-start">
      <Avatar color="blue" style="margin-right: 12px">UI</Avatar>
      <div>
        <h3>Semi UI</h3>
        <p>Hi, Bytedance dance dance.</p>
        <p>Hi, Bytedance dance dance.</p>
        <p>Hi, Bytedance dance dance.</p>
      </div>
    </div>
  </Skeleton>
</template>
