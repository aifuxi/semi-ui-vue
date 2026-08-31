<script setup lang="ts">
import { computed } from 'vue';

import { CodeHighlight } from '../code-highlight';
import { JsonViewer } from '../json-viewer';
import type { SidebarCodeItemProps } from './types';

defineOptions({ name: 'SidebarCodeItem' });
const props = defineProps<Omit<SidebarCodeItemProps, 'key'>>();
const jsonOptions = computed(() => ({
  readOnly: true,
  autoWrap: true,
  ...(props.jsonViewerProps?.options ?? {}),
}));
const jsonBindings = computed(() => ({
  ...(props.jsonViewerProps ?? {}),
  value: props.content ?? '',
  height: '100%',
  width: '100%',
  showSearch: false,
  options: jsonOptions.value,
}));
const codeBindings = computed(() => ({
  ...(props.codeHighlightProps ?? {}),
  language: props.language ?? 'text',
  code: props.content ?? '',
}));
</script>

<template>
  <div class="semi-sidebar-code-content">
    <JsonViewer v-if="props.isJson" v-bind="jsonBindings" />
    <CodeHighlight v-else v-bind="codeBindings" />
  </div>
</template>
