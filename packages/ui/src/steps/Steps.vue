<script setup lang="ts">
import {
  Comment,
  Fragment,
  Text as VueText,
  cloneVNode,
  computed,
  isVNode,
  provide,
  useAttrs,
  useSlots,
  type VNode,
  type VNodeChild,
} from 'vue';

import { Col, Row } from '../grid';
import { stepsContextKey } from './steps-context';
import type {
  InternalStepProps,
  StepsEmits,
  StepsProps,
  StepsSlots,
  StepsStatus,
  StepsType,
} from './types';

defineOptions({ name: 'Steps', inheritAttrs: false });
const props = withDefaults(defineProps<StepsProps>(), {
  current: 0,
  direction: 'horizontal',
  hasLine: true,
  initial: 0,
  prefixCls: 'semi-steps',
  size: 'default',
  status: 'process',
  type: 'fill',
});
const emit = defineEmits<StepsEmits>();
defineSlots<StepsSlots>();
const attrs = useAttrs();
const slots = useSlots();

const resolvedType = computed<StepsType>(() => props.type);
provide(stepsContextKey, { type: resolvedType });

function flattenValidVNodes(nodes: VNodeChild[]): VNode[] {
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

function hasVNodeProp(node: VNode, name: string): boolean {
  const kebab = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    node.props &&
    (Object.prototype.hasOwnProperty.call(node.props, name) ||
      Object.prototype.hasOwnProperty.call(node.props, kebab)),
  );
}

const sourceChildren = computed(() =>
  flattenValidVNodes((slots.default?.() ?? []) as VNodeChild[]),
);

function inferredStatus(node: VNode, index: number): StepsStatus {
  if (props.type === 'nav') return 'wait';
  if (hasVNodeProp(node, 'status')) return node.props?.status as StepsStatus;
  const stepNumber = props.initial + index;
  if (stepNumber === props.current) return props.status;
  return stepNumber < props.current ? 'finish' : 'wait';
}

function internalProps(node: VNode, index: number): InternalStepProps {
  const stepNumber = props.initial + index;
  const output: InternalStepProps = {
    ...(props.type === 'nav'
      ? {
          active: index === props.current,
          index,
          total: sourceChildren.value.length,
        }
      : {
          status: inferredStatus(node, index),
          stepNumber: `${stepNumber + 1}`,
        }),
    ...(props.type === 'basic'
      ? {
          active: stepNumber === props.current,
          done: stepNumber < props.current,
          size: props.size === 'default' ? '' : props.size,
        }
      : {}),
  };

  if (index !== props.current) output.onStepChange = () => emit('change', index + props.initial);

  if (props.status === 'error' && index === props.current - 1) {
    output.className = `${props.prefixCls}-next-error`;
  }
  return output;
}

const renderedChildren = computed(() =>
  sourceChildren.value.map((node, index) =>
    cloneVNode(node, internalProps(node, index) as Record<string, unknown>),
  ),
);
const fillColumnStyle = computed(() =>
  props.direction === 'vertical' || renderedChildren.value.length === 0
    ? undefined
    : { width: `${100 / renderedChildren.value.length}%` },
);
const rootClasses = computed(() => {
  if (props.type === 'fill') {
    return [
      props.prefixCls,
      `${props.prefixCls}-${props.direction}`,
      props.class,
      props.className,
      attrs.class,
    ];
  }
  if (props.type === 'basic') {
    return [
      `${props.prefixCls}-basic`,
      `${props.prefixCls}-${props.direction}`,
      props.size !== 'default' ? `${props.prefixCls}-${props.size}` : undefined,
      props.hasLine ? `${props.prefixCls}-hasline` : undefined,
      props.class,
      props.className,
      attrs.class,
    ];
  }
  return [
    `${props.prefixCls}-nav`,
    props.size !== 'default' ? `${props.prefixCls}-${props.size}` : undefined,
    props.class,
    props.className,
    attrs.class,
  ];
});
const dataAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => name.startsWith('data-'))),
);
const ariaLabel = computed(() => props.ariaLabel ?? (attrs['aria-label'] as string | undefined));
</script>

<template>
  <div
    v-bind="dataAttrs"
    :aria-label="ariaLabel"
    :class="rootClasses"
    :style="[props.style, attrs.style]"
  >
    <Row v-if="type === 'fill'" type="flex" justify="start">
      <Col
        v-for="(child, index) in renderedChildren"
        :key="child.key ?? index"
        :style="fillColumnStyle"
      >
        <component :is="child" />
      </Col>
    </Row>
    <template v-else>
      <component :is="child" v-for="(child, index) in renderedChildren" :key="child.key ?? index" />
    </template>
  </div>
</template>
