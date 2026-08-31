<script setup lang="ts">
import { computed } from 'vue';
import { LocaleConsumer } from '../locale';
import SidebarAnnotationContent from './SidebarAnnotationContent.vue';
import SidebarContainer from './SidebarContainer.vue';
import type { SidebarAnnotationProps, SidebarLocale } from './types';

defineOptions({ name: 'SidebarAnnotation', inheritAttrs: false });
const props = defineProps<SidebarAnnotationProps>();
const containerBindings = computed<Record<string, unknown>>(() =>
  Object.fromEntries(
    Object.entries({
      title: props.title,
      visible: props.visible,
      motion: props.motion,
      minWidth: props.minWidth,
      maxWidth: props.maxWidth,
      resizable: props.resizable,
      defaultSize: props.defaultSize,
      showClose: props.showClose,
      closeOnEsc: props.closeOnEsc,
      style: props.style,
      renderHeader: props.renderHeader,
      containerRef: props.containerRef,
      onCancel: props.onCancel,
      afterVisibleChange: props.afterVisibleChange,
    }).filter(([, value]) => value !== undefined),
  ),
);
const contentBindings = computed<Record<string, unknown>>(() =>
  Object.fromEntries(
    Object.entries({
      activeKey: props.activeKey,
      info: props.info,
      renderItem: props.renderItem,
      onChange: props.onChange,
      onClick: props.onClick,
    }).filter(([, value]) => value !== undefined),
  ),
);
</script>

<template>
  <LocaleConsumer v-slot="{ localeData }" component-name="Sidebar">
    <SidebarContainer
      v-bind="containerBindings"
      :title="
        props.title ??
        (localeData as SidebarLocale | undefined)?.annotationTitle ??
        'Reference Source'
      "
      :class="['semi-sidebar-annotation', props.class, props.className]"
    >
      <SidebarAnnotationContent v-bind="contentBindings">
        <template v-if="$slots.item" #item="slotProps"
          ><slot name="item" v-bind="slotProps"
        /></template>
      </SidebarAnnotationContent>
    </SidebarContainer>
  </LocaleConsumer>
</template>
