<script setup lang="ts">
import { IconBookOpenStroked } from '@aifuxi/semi-icons-vue';
import { computed, useSlots, type VNodeChild } from 'vue';

import { Collapse, CollapsePanel, type CollapseActiveKey } from '../collapse';
import SidebarAnnotationItem from './SidebarAnnotationItem.vue';
import SidebarNodeRenderer from './SidebarNodeRenderer';
import type {
  SidebarActiveKey,
  SidebarAnnotationContentEmits,
  SidebarAnnotationContentProps,
  SidebarAnnotationContentSlots,
  SidebarAnnotationItem as AnnotationItem,
} from './types';

defineOptions({ name: 'SidebarAnnotationContent' });
const props = defineProps<SidebarAnnotationContentProps>();
const emit = defineEmits<SidebarAnnotationContentEmits>();
defineSlots<SidebarAnnotationContentSlots>();
const slots = useSlots();
const classes = computed(() => ['semi-sidebar-collapse', props.class, props.className]);

function handleChange(activeKey: CollapseActiveKey): void {
  emit('change', activeKey as SidebarActiveKey);
}
function customItem(annotation: AnnotationItem): VNodeChild {
  return slots.item?.({ annotation }) ?? props.renderItem?.(annotation);
}
function handleClick(event: MouseEvent, item: AnnotationItem): void {
  emit('click', event, item);
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
    <CollapsePanel v-for="group in props.info ?? []" :key="group.key" :item-key="group.key">
      <template #header>
        <div class="semi-sidebar-collapse-header-content">
          <IconBookOpenStroked />
          <SidebarNodeRenderer :content="group.header" />
        </div>
      </template>
      <div class="semi-sidebar-annotation-content">
        <template v-for="(annotation, index) in group.annotations" :key="index">
          <SidebarNodeRenderer
            v-if="slots.item || props.renderItem"
            :content="customItem(annotation)"
          />
          <SidebarAnnotationItem v-else v-bind="annotation" @click="handleClick" />
        </template>
      </div>
    </CollapsePanel>
  </Collapse>
</template>
