<script setup lang="ts">
import { computed } from 'vue';

import { Collapse, CollapsePanel, type CollapseActiveKey } from '../collapse';
import SidebarCollapseHeader from './SidebarCollapseHeader.vue';
import SidebarFileItem from './SidebarFileItem.vue';
import type {
  SidebarActiveKey,
  SidebarFileContentEmits,
  SidebarFileContentProps,
  SidebarFileItemProps,
} from './types';

defineOptions({ name: 'SidebarFileContent' });
const props = defineProps<SidebarFileContentProps>();
const emit = defineEmits<SidebarFileContentEmits>();
const classes = computed(() => [
  'semi-sidebar-collapse',
  'semi-sidebar-collapse-file',
  props.class,
  props.className,
]);

function handleChange(activeKey: CollapseActiveKey): void {
  emit('change', activeKey as SidebarActiveKey);
}

function handleExpand(event: MouseEvent, file: SidebarFileItemProps): void {
  emit('expand', event, file, 'file');
}
</script>

<template>
  <Collapse
    :class="classes"
    :style="props.style"
    v-bind="props.activeKey === undefined ? {} : { activeKey: props.activeKey }"
    :click-header-to-expand="false"
    @change="handleChange"
  >
    <CollapsePanel
      v-for="(file, index) in props.files ?? []"
      :key="file.key ?? index"
      :item-key="file.key ?? String(index)"
    >
      <template #header>
        <SidebarCollapseHeader :content="file" mode="file" @expand="handleExpand($event, file)" />
      </template>
      <SidebarFileItem :content="file.content ?? ''" :editable="false" />
    </CollapsePanel>
  </Collapse>
</template>
