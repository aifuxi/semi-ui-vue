<script setup lang="ts">
import { IconCodeStroked, IconFile, IconFullScreenStroked } from '@aifuxi/semi-icons-vue';

import { Button } from '../button';
import type { SidebarCodeItemProps, SidebarFileItemProps } from './types';

const props = defineProps<{
  content: SidebarCodeItemProps | SidebarFileItemProps;
  mode: 'code' | 'file';
}>();
const emit = defineEmits<{
  expand: [
    event: MouseEvent,
    content: SidebarCodeItemProps | SidebarFileItemProps,
    mode: 'code' | 'file',
  ];
}>();
</script>

<template>
  <div class="semi-sidebar-collapse-header-content">
    <IconCodeStroked v-if="props.mode === 'code'" />
    <IconFile v-else />
    <span class="semi-sidebar-collapse-header-text">{{ props.content.name }}</span>
    <Button
      class="semi-sidebar-collapse-header-expand-btn"
      theme="borderless"
      type="tertiary"
      aria-label="expand"
      @click="emit('expand', $event, props.content, props.mode)"
    >
      <template #icon><IconFullScreenStroked /></template>
    </Button>
  </div>
</template>
