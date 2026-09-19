<script setup lang="ts">
import { computed } from 'vue';
import { withBase } from 'vitepress';
import { neighbors, normalizeRoute } from '../composables/use-docs-data';

const props = defineProps<{ path: string }>();
const links = computed(() => neighbors(normalizeRoute(props.path)));
</script>

<template>
  <nav class="prev-next" aria-label="文档翻页">
    <a v-if="links.prev" class="prev-next-link prev" :href="withBase(links.prev.path)" rel="prev">
      <span class="prev-next-label">上一篇</span>
      <span class="prev-next-title">{{ links.prev.title }}</span>
    </a>
    <a v-if="links.next" class="prev-next-link next" :href="withBase(links.next.path)" rel="next">
      <span class="prev-next-label">下一篇</span>
      <span class="prev-next-title">{{ links.next.title }}</span>
    </a>
  </nav>
</template>
