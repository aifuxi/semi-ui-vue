<script setup lang="ts">
import { IconClose } from '@aifuxi/semi-icons-vue';
import { computed, useAttrs, useSlots } from 'vue';

import TabsNodeRenderer from './TabsNodeRenderer';
import type { TabItemEmits, TabItemProps, TabItemSlots } from './types';

defineOptions({ name: 'TabItem', inheritAttrs: false });
const props = withDefaults(defineProps<TabItemProps>(), {
  closable: false,
  disabled: false,
  selected: false,
  size: 'large',
  tabPosition: 'top',
  type: 'line',
});
const emit = defineEmits<TabItemEmits>();
defineSlots<TabItemSlots>();
const attrs = useAttrs();
const slots = useSlots();

const tabContent = computed(() => slots.tab?.() ?? props.tab);
const iconContent = computed(() => slots.icon?.() ?? props.icon);
const classes = computed(() => [
  'semi-tabs-tab',
  `semi-tabs-tab-${props.type}`,
  `semi-tabs-tab-${props.tabPosition}`,
  'semi-tabs-tab-single',
  props.selected ? 'semi-tabs-tab-active' : undefined,
  props.disabled ? 'semi-tabs-tab-disabled' : undefined,
  props.size === 'small' ? 'semi-tabs-tab-small' : undefined,
  props.size === 'medium' ? 'semi-tabs-tab-medium' : undefined,
  props.class,
  props.className,
  attrs.class,
]);
const forwardedAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([name]) => name !== 'class' && name !== 'style'),
  ),
);

function handleClick(event: MouseEvent): void {
  if (!props.disabled) emit('click', props.itemKey, event);
}

function handleKeyDown(event: KeyboardEvent): void {
  emit('keyDown', event, props.itemKey, props.closable);
}

function handleClose(event: MouseEvent): void {
  event.stopPropagation();
  emit('close', props.itemKey, event);
}
</script>

<template>
  <div
    v-bind="forwardedAttrs"
    :id="`semiTab${itemKey}`"
    :aria-controls="`semiTabPanel${itemKey}`"
    :aria-disabled="disabled ? 'true' : 'false'"
    :aria-selected="selected ? 'true' : 'false'"
    :class="classes"
    :data-tabkey="`semiTab${itemKey}`"
    role="tab"
    :style="[style, attrs.style]"
    :tabindex="selected ? 0 : -1"
    @click="handleClick"
    @keydown="handleKeyDown"
  >
    <span v-if="iconContent" class="semi-tabs-bar-icon">
      <TabsNodeRenderer :content="iconContent" />
    </span>
    <TabsNodeRenderer :content="tabContent" />
    <IconClose
      v-if="closable"
      aria-label="Close"
      class="semi-tabs-tab-icon-close"
      role="button"
      @click="handleClose"
    />
  </div>
</template>
