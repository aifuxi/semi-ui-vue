<script setup lang="ts">
import { computed } from 'vue';

import { Collapse, CollapsePanel, type CollapseActiveKey } from '../collapse';
import SidebarCodeItem from './SidebarCodeItem.vue';
import SidebarCollapseHeader from './SidebarCollapseHeader.vue';
import type {
  SidebarActiveKey,
  SidebarCodeContentEmits,
  SidebarCodeContentProps,
  SidebarCodeItemProps,
} from './types';

defineOptions({ name: 'SidebarCodeContent' });
const props = defineProps<SidebarCodeContentProps>();
const emit = defineEmits<SidebarCodeContentEmits>();
const classes = computed(() => [
  'semi-sidebar-collapse',
  'semi-sidebar-collapse-code',
  props.class,
  props.className,
]);

function handleChange(activeKey: CollapseActiveKey): void {
  emit('change', activeKey as SidebarActiveKey);
}

function handleExpand(event: MouseEvent, content: SidebarCodeItemProps): void {
  emit('expand', event, content, 'code');
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
      v-for="(code, index) in props.codes ?? []"
      :key="code.key ?? index"
      :item-key="code.key ?? String(index)"
    >
      <template #header>
        <SidebarCollapseHeader :content="code" mode="code" @expand="handleExpand($event, code)" />
      </template>
      <SidebarCodeItem v-bind="code" />
    </CollapsePanel>
  </Collapse>
</template>
