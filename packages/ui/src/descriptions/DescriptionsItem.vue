<script setup lang="ts">
import { computed, inject, useAttrs, type PropType, type VNodeChild } from 'vue';

import DescriptionsNodeRenderer from './DescriptionsNodeRenderer';
import { descriptionsContextKey } from './descriptions-context';
import type { DescriptionsItemProps, DescriptionsItemSlots } from './types';

defineOptions({ name: 'DescriptionsItem', inheritAttrs: false });
const props = defineProps({
  hidden: { type: Boolean, default: false },
  class: { type: null as unknown as PropType<DescriptionsItemProps['class']>, default: undefined },
  className: {
    type: null as unknown as PropType<DescriptionsItemProps['className']>,
    default: undefined,
  },
  style: { type: null as unknown as PropType<DescriptionsItemProps['style']>, default: undefined },
  itemKey: { type: null as unknown as PropType<VNodeChild>, default: undefined },
  span: { type: Number, default: undefined },
  keyStyle: {
    type: null as unknown as PropType<DescriptionsItemProps['keyStyle']>,
    default: undefined,
  },
  internalKey: {
    type: null as unknown as PropType<VNodeChild | (() => VNodeChild)>,
    default: undefined,
  },
  internalValue: {
    type: null as unknown as PropType<VNodeChild | (() => VNodeChild)>,
    default: undefined,
  },
});
defineSlots<DescriptionsItemSlots>();
const attrs = useAttrs();
const context = inject(descriptionsContextKey, undefined);

const align = computed(() => context?.align.value ?? 'center');
const layout = computed(() => context?.layout.value ?? 'vertical');
const isPlain = computed(() => align.value === 'plain');
const rowClasses = computed(() =>
  attrs.class || props.class || props.className
    ? [attrs.class, props.class, props.className]
    : undefined,
);
const rowStyle = computed(() =>
  attrs.style || props.style ? [props.style, attrs.style] : undefined,
);
const dataAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => name.startsWith('data-'))),
);
const resolvedKey = computed(() => props.internalKey ?? props.itemKey);
const valueColspan = computed(() => (props.span ? props.span * 2 - 1 : 1));
</script>

<template>
  <template v-if="!hidden">
    <template v-if="layout === 'horizontal'">
      <td v-if="isPlain" class="semi-descriptions-item" :colspan="span || 1">
        <span class="semi-descriptions-key" :style="keyStyle">
          <slot name="key"><DescriptionsNodeRenderer :content="resolvedKey" /></slot>:
        </span>
        <span class="semi-descriptions-value">
          <slot><DescriptionsNodeRenderer :content="internalValue" /></slot>
        </span>
      </td>
      <template v-else>
        <th class="semi-descriptions-item semi-descriptions-item-th">
          <span class="semi-descriptions-key" :style="keyStyle">
            <slot name="key"><DescriptionsNodeRenderer :content="resolvedKey" /></slot>
          </span>
        </th>
        <td class="semi-descriptions-item semi-descriptions-item-td" :colspan="valueColspan">
          <span class="semi-descriptions-value">
            <slot><DescriptionsNodeRenderer :content="internalValue" /></slot>
          </span>
        </td>
      </template>
    </template>
    <tr v-else :class="rowClasses" :style="rowStyle" v-bind="dataAttrs">
      <td v-if="isPlain" class="semi-descriptions-item" :colspan="span || 1">
        <span class="semi-descriptions-key" :style="keyStyle">
          <slot name="key"><DescriptionsNodeRenderer :content="resolvedKey" /></slot>:
        </span>
        <span class="semi-descriptions-value">
          <slot><DescriptionsNodeRenderer :content="internalValue" /></slot>
        </span>
      </td>
      <template v-else>
        <th class="semi-descriptions-item semi-descriptions-item-th">
          <span class="semi-descriptions-key" :style="keyStyle">
            <slot name="key"><DescriptionsNodeRenderer :content="resolvedKey" /></slot>
          </span>
        </th>
        <td class="semi-descriptions-item semi-descriptions-item-td" :colspan="valueColspan">
          <span class="semi-descriptions-value">
            <slot><DescriptionsNodeRenderer :content="internalValue" /></slot>
          </span>
        </td>
      </template>
    </tr>
  </template>
</template>
