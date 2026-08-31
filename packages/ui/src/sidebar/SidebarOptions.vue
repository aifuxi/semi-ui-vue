<script setup lang="ts">
import { computed, useSlots, type VNodeChild } from 'vue';

import { Button } from '../button';
import SidebarNodeRenderer from './SidebarNodeRenderer';
import type { SidebarOption } from './types';

const props = defineProps<{
  activeKey?: string;
  options?: SidebarOption[];
  renderOptionItem?: (
    option: SidebarOption,
    onChange: (event: MouseEvent, activeKey: string) => void,
  ) => VNodeChild;
}>();
const emit = defineEmits<{ change: [event: MouseEvent, activeKey: string] }>();
const slots = useSlots();

const items = computed(() => props.options ?? []);
const onChange = (event: MouseEvent, key: string) => emit('change', event, key);
function customItem(option: SidebarOption): VNodeChild {
  return slots.option?.({ option, onChange }) ?? props.renderOptionItem?.(option, onChange);
}
</script>

<template>
  <div class="semi-sidebar-options">
    <template v-for="option in items" :key="option.key">
      <SidebarNodeRenderer
        v-if="slots.option || props.renderOptionItem"
        :content="customItem(option)"
      />
      <Button
        v-else
        class="semi-sidebar-options-button"
        :class="{ 'semi-sidebar-options-normal': props.activeKey !== option.key }"
        @click="onChange($event, option.key)"
      >
        <template #icon><SidebarNodeRenderer :content="option.icon" /></template>
        <SidebarNodeRenderer :content="option.name" />
      </Button>
    </template>
  </div>
</template>
