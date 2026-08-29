<script setup lang="ts">
import {
  Comment,
  Fragment,
  Text as VueText,
  cloneVNode,
  computed,
  h,
  isVNode,
  useAttrs,
  useSlots,
  type PropType,
  type VNode,
  type VNodeChild,
} from 'vue';

import TimelineItem from './TimelineItem.vue';
import type { TimelineData, TimelineMode, TimelineProps, TimelineSlots } from './types';

defineOptions({ name: 'Timeline', inheritAttrs: false });
const props = defineProps({
  ariaLabel: { type: String, default: undefined },
  class: { type: null as unknown as PropType<TimelineProps['class']>, default: undefined },
  className: {
    type: null as unknown as PropType<TimelineProps['className']>,
    default: undefined,
  },
  dataSource: {
    type: Array as PropType<readonly TimelineData[]>,
    default: undefined,
  },
  mode: { type: String as PropType<TimelineMode>, default: 'left' },
  style: { type: null as unknown as PropType<TimelineProps['style']>, default: undefined },
});
defineSlots<TimelineSlots>();
const attrs = useAttrs();
const slots = useSlots();

const prefixCls = 'semi-timeline';
const rootClasses = computed(() => [
  prefixCls,
  `${prefixCls}-${props.mode}`,
  props.class,
  props.className,
  attrs.class,
]);
const dataAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => name.startsWith('data-'))),
);
const ariaLabel = computed(() => props.ariaLabel ?? (attrs['aria-label'] as string | undefined));

function flattenChildren(nodes: VNodeChild[]): VNode[] {
  const output: VNode[] = [];
  const visit = (node: VNodeChild): void => {
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (!isVNode(node) || node.type === Comment) return;
    if (node.type === Fragment && Array.isArray(node.children)) {
      node.children.forEach((child) => visit(child as VNodeChild));
      return;
    }
    if (node.type === VueText && String(node.children ?? '').trim() === '') return;
    output.push(node);
  };
  nodes.forEach(visit);
  return output;
}

function positionClass(node: VNode, index: number): string {
  const position = node.props?.position as TimelineData['position'] | undefined;
  if (props.mode === 'alternate') {
    if (position) return `${prefixCls}-item-${position}`;
    return `${prefixCls}-item-${index % 2 === 0 ? 'left' : 'right'}`;
  }
  if (props.mode === 'center') {
    return `${prefixCls}-item-${position || 'left'}`;
  }
  return `${prefixCls}-item-${props.mode}`;
}

const sourceChildren = computed<VNode[]>(() => {
  if (props.dataSource?.length) {
    return props.dataSource.map((entry, index) => {
      const { content, ...itemProps } = entry;
      return h(
        TimelineItem,
        { ...itemProps, key: `timeline-item-${index}` },
        { default: () => content },
      );
    });
  }
  return flattenChildren((slots.default?.() ?? []) as VNodeChild[]);
});

const renderedChildren = computed(() => {
  let elementIndex = 0;
  return sourceChildren.value.map((node) => {
    if (node.type === VueText) return node;
    const child = cloneVNode(node, {
      class: [node.props?.class, node.props?.className, positionClass(node, elementIndex)],
    });
    elementIndex += 1;
    return child;
  });
});
</script>

<template>
  <ul
    v-bind="dataAttrs"
    :aria-label="ariaLabel"
    :class="rootClasses"
    :style="[props.style, attrs.style]"
  >
    <component :is="child" v-for="(child, index) in renderedChildren" :key="child.key ?? index" />
  </ul>
</template>
