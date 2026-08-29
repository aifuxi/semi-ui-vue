<script setup lang="ts">
import { computed, getCurrentInstance, inject, useAttrs, useSlots, type PropType } from 'vue';

import { Col, type ColProps } from '../grid';
import ListNodeRenderer from './ListNodeRenderer';
import { listContextKey } from './list-context';
import type { ListItemAlign, ListItemEmits, ListItemProps, ListItemSlots } from './types';

defineOptions({ name: 'ListItem', inheritAttrs: false });
const props = defineProps({
  align: { type: String as PropType<ListItemAlign>, default: 'flex-start' },
  class: { type: null as unknown as PropType<ListItemProps['class']>, default: undefined },
  className: {
    type: null as unknown as PropType<ListItemProps['className']>,
    default: undefined,
  },
  extra: { type: null as unknown as PropType<ListItemProps['extra']>, default: undefined },
  header: { type: null as unknown as PropType<ListItemProps['header']>, default: undefined },
  main: { type: null as unknown as PropType<ListItemProps['main']>, default: undefined },
  style: { type: null as unknown as PropType<ListItemProps['style']>, default: undefined },
});
const emit = defineEmits<ListItemEmits>();
defineSlots<ListItemSlots>();
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
const context = inject(listContextKey, undefined);
const colPropNames = [
  'span',
  'order',
  'offset',
  'push',
  'pull',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'xxl',
] as const;

const headerContent = computed(() => slots.header?.() ?? props.header);
const mainContent = computed(() => slots.main?.() ?? props.main);
const extraContent = computed(() => slots.extra?.() ?? props.extra);
const hasBody = computed(() => headerContent.value != null || mainContent.value != null);
const grid = computed(() => context?.grid.value);
const colProps = computed<ColProps>(() => {
  const value = grid.value;
  if (!value) return {};
  const result: ColProps = {};
  for (const name of colPropNames) {
    if (value[name] !== undefined) Object.assign(result, { [name]: value[name] });
  }
  return result;
});
const itemAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(
      ([attributeName]) => attributeName !== 'class' && attributeName !== 'style',
    ),
  ),
);

function hasListener(name: 'onClick' | 'onRightClick'): boolean {
  return Boolean(
    instance?.vnode.props && Object.prototype.hasOwnProperty.call(instance.vnode.props, name),
  );
}

function handleClick(event: MouseEvent): void {
  if (hasListener('onClick')) emit('click', event);
  else context?.onClick(event);
}

function handleContextMenu(event: MouseEvent): void {
  if (hasListener('onRightClick')) emit('rightClick', event);
  else context?.onRightClick(event);
}
</script>

<template>
  <Col v-if="grid" v-bind="colProps">
    <li
      v-bind="itemAttrs"
      class="semi-list-item"
      :class="[attrs.class, props.class, props.className]"
      :style="[attrs.style, props.style]"
      @click="handleClick"
      @contextmenu="handleContextMenu"
      @mouseenter="emit('mouseEnter', $event)"
      @mouseleave="emit('mouseLeave', $event)"
    >
      <div v-if="hasBody" class="semi-list-item-body" :class="`semi-list-item-body-${align}`">
        <div v-if="headerContent != null" class="semi-list-item-body-header">
          <ListNodeRenderer :content="headerContent" />
        </div>
        <div v-if="mainContent != null" class="semi-list-item-body-main">
          <ListNodeRenderer :content="mainContent" />
        </div>
      </div>
      <slot />
      <div v-if="extraContent != null" class="semi-list-item-extra">
        <ListNodeRenderer :content="extraContent" />
      </div>
    </li>
  </Col>
  <li
    v-else
    v-bind="itemAttrs"
    class="semi-list-item"
    :class="[attrs.class, props.class, props.className]"
    :style="[attrs.style, props.style]"
    @click="handleClick"
    @contextmenu="handleContextMenu"
    @mouseenter="emit('mouseEnter', $event)"
    @mouseleave="emit('mouseLeave', $event)"
  >
    <div v-if="hasBody" class="semi-list-item-body" :class="`semi-list-item-body-${align}`">
      <div v-if="headerContent != null" class="semi-list-item-body-header">
        <ListNodeRenderer :content="headerContent" />
      </div>
      <div v-if="mainContent != null" class="semi-list-item-body-main">
        <ListNodeRenderer :content="mainContent" />
      </div>
    </div>
    <slot />
    <div v-if="extraContent != null" class="semi-list-item-extra">
      <ListNodeRenderer :content="extraContent" />
    </div>
  </li>
</template>
