<script setup lang="ts">
import { HighlightFoundation } from '@workspace/foundation-integration';
import { computed, markRaw } from 'vue';

import HighlightNodeRenderer from './HighlightNodeRenderer';
import type { HighlightChunk } from './internal-types';
import type { HighlightProps } from './types';

defineOptions({ name: 'Highlight', inheritAttrs: false });
const props = withDefaults(defineProps<HighlightProps>(), {
  autoEscape: true,
  caseSensitive: false,
  component: 'mark',
  searchWords: () => [],
  sourceString: '',
});

const foundation = markRaw(new HighlightFoundation());
const chunks = computed<HighlightChunk[]>(
  () =>
    foundation.findAll({
      autoEscape: props.autoEscape,
      caseSensitive: props.caseSensitive,
      searchWords: props.searchWords as never,
      sourceString: props.sourceString,
    }) as HighlightChunk[],
);
</script>

<template>
  <HighlightNodeRenderer
    :chunks="chunks"
    :component="props.component"
    :highlight-class-name="props.highlightClassName"
    :highlight-style="props.highlightStyle"
    :source-string="props.sourceString"
  />
</template>
