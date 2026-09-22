<script setup lang="ts">
import { computed } from 'vue';
import { docsNav, sourceOf } from '../composables/use-docs-data';

const props = defineProps<{ path: string }>();
const entry = computed(() => sourceOf(props.path));
</script>

<template>
  <p v-if="entry" class="source-note">
    内容对齐 Semi Design {{ docsNav.baseline.version }} 官方文档（{{
      docsNav.baseline.commit.slice(0, 7)
    }}），来源：
    <code>{{ entry.source }}</code>
    <template v-if="entry.origin === 'override'">（手工精修页）</template>
  </p>
</template>
