<script setup lang="ts">
import { computed } from 'vue';
import { docPages, categories, type DocPage } from '../../data/docs';
const props = defineProps<{ page: DocPage }>();
const siblings = computed(() =>
  docPages
    .filter((entry) => entry.locale === props.page.locale)
    .sort(
      (a, b) =>
        categories.findIndex(([id]) => id === a.category) -
          categories.findIndex(([id]) => id === b.category) || a.order - b.order,
    ),
);
const index = computed(() => siblings.value.findIndex((entry) => entry.path === props.page.path));
const previous = computed(() => siblings.value[index.value - 1]);
const next = computed(() => siblings.value[index.value + 1]);
</script>

<template>
  <nav class="previous-next" :aria-label="page.locale === 'zh-CN' ? '相邻文档' : 'Adjacent pages'">
    <NuxtLink v-if="previous" :to="previous.path"
      ><small>{{ page.locale === 'zh-CN' ? '上一篇' : 'Previous' }}</small
      ><span
        >← {{ previous.englishTitle }} {{ page.locale === 'zh-CN' ? previous.title : '' }}</span
      ></NuxtLink
    >
    <NuxtLink v-if="next" class="next" :to="next.path"
      ><small>{{ page.locale === 'zh-CN' ? '下一篇' : 'Next' }}</small
      ><span
        >{{ next.englishTitle }} {{ page.locale === 'zh-CN' ? next.title : '' }} →</span
      ></NuxtLink
    >
  </nav>
</template>
