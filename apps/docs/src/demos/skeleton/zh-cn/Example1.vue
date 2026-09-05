<script setup lang="ts">
import { shallowRef } from 'vue';
import { Skeleton } from '@aifuxi/semi-ui-vue/skeleton';

const loading = shallowRef(true);
import '@aifuxi/semi-theme-default/skeleton.css';
</script>

<template>
  <Skeleton :loading="loading" active>
    <template #placeholder>
      <div style="display: flex; gap: 12px">
        <Skeleton.Avatar />
        <div style="width: 240px">
          <Skeleton.Title style="width: 120px; margin-bottom: 12px" />
          <Skeleton.Paragraph :rows="3" />
        </div>
      </div>
    </template>

    <article>实际内容</article>
  </Skeleton>
</template>
