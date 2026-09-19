<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ title: string; kind?: 'live' | 'import' | 'code'; id?: string }>();

const kindLabel = computed(() => {
  switch (props.kind) {
    case 'import':
      return '引入方式示例';
    case 'live':
      return '可运行示例';
    default:
      return '代码示例';
  }
});
</script>

<template>
  <figure class="demo-block" :data-demo-kind="kind">
    <figcaption class="demo-block-footer">
      <span class="demo-block-title">{{ title }}</span>
      <span class="demo-block-kind">{{ kindLabel }}</span>
      <!-- 示例清单契约见 ../demo/types.ts；接入示例后在此消费 id 对应的 manifest。 -->
      <span class="demo-block-status"><span aria-hidden="true" />示例迁移中</span>
    </figcaption>
  </figure>
</template>
