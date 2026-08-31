<script setup lang="ts">
import { computed } from 'vue';
import { LocaleConsumer } from '../locale';
import SidebarContainer from './SidebarContainer.vue';
import SidebarMCPConfigureContent from './SidebarMCPConfigureContent.vue';
import type { SidebarLocale, SidebarMCPConfigureProps } from './types';

defineOptions({ name: 'SidebarMCPConfigure', inheritAttrs: false });
const props = defineProps<SidebarMCPConfigureProps>();
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
      options: props.options,
      customOptions: props.customOptions,
      filter: props.filter,
      placeholder: props.placeholder,
      renderItem: props.renderItem,
      onStatusChange: props.onStatusChange,
      onSearch: props.onSearch,
      onAddClick: props.onAddClick,
      onConfigureClick: props.onConfigureClick,
      onEditClick: props.onEditClick,
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
        (localeData as SidebarLocale | undefined)?.mcpConfigure ??
        'MCP Configuration'
      "
      :class="[props.class, props.className]"
    >
      <SidebarMCPConfigureContent v-bind="contentBindings">
        <template v-if="$slots.item" #item="slotProps"
          ><slot name="item" v-bind="slotProps"
        /></template>
      </SidebarMCPConfigureContent>
    </SidebarContainer>
  </LocaleConsumer>
</template>
