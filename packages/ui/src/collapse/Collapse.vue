<script setup lang="ts">
import {
  CollapseFoundation,
  type CollapseAdapter,
  type CollapseFoundationProps,
} from '@workspace/foundation-integration';
import {
  computed,
  getCurrentInstance,
  markRaw,
  onBeforeUnmount,
  provide,
  shallowRef,
  useAttrs,
  useSlots,
  watch,
  type PropType,
} from 'vue';

import { semiGlobal } from '../config-provider';
import { collapseContextKey } from './collapse-context';
import type {
  CollapseActiveKey,
  CollapseEmits,
  CollapseIconPosition,
  CollapseProps,
  CollapseSlots,
} from './types';

defineOptions({ name: 'Collapse', inheritAttrs: false });
const props = defineProps({
  activeKey: {
    type: [String, Array] as PropType<CollapseActiveKey>,
    default: undefined,
  },
  defaultActiveKey: {
    type: [String, Array] as PropType<CollapseActiveKey>,
    default: undefined,
  },
  accordion: { type: Boolean, default: undefined },
  clickHeaderToExpand: { type: Boolean, default: undefined },
  expandIcon: {
    type: null as unknown as PropType<CollapseProps['expandIcon']>,
    default: undefined,
  },
  collapseIcon: {
    type: null as unknown as PropType<CollapseProps['collapseIcon']>,
    default: undefined,
  },
  expandIconPosition: {
    type: String as PropType<CollapseIconPosition>,
    default: undefined,
    validator: (value: string) => value === 'left' || value === 'right',
  },
  keepDOM: { type: Boolean, default: undefined },
  motion: { type: Boolean, default: undefined },
  lazyRender: { type: Boolean, default: undefined },
  class: { type: null as unknown as PropType<CollapseProps['class']>, default: undefined },
  className: {
    type: null as unknown as PropType<CollapseProps['className']>,
    default: undefined,
  },
  style: { type: null as unknown as PropType<CollapseProps['style']>, default: undefined },
});
const emit = defineEmits<CollapseEmits>();
defineSlots<CollapseSlots>();
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();

function hasRawProp(name: keyof CollapseProps): boolean {
  const rawProps = instance?.vnode.props;
  const kebabName = String(name).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    rawProps &&
    (Object.prototype.hasOwnProperty.call(rawProps, name) ||
      Object.prototype.hasOwnProperty.call(rawProps, kebabName)),
  );
}

function resolveProp<Key extends keyof CollapseProps>(
  key: Key,
  fallback: NonNullable<CollapseProps[Key]>,
): NonNullable<CollapseProps[Key]> {
  if (hasRawProp(key) && props[key] !== undefined) {
    return props[key] as NonNullable<CollapseProps[Key]>;
  }
  const globalValue = semiGlobal.config.overrideDefaultProps?.Collapse?.[key];
  return (globalValue === undefined ? fallback : globalValue) as NonNullable<CollapseProps[Key]>;
}

function resolveOptional<Key extends keyof CollapseProps>(key: Key): CollapseProps[Key] {
  if (hasRawProp(key)) return props[key] as CollapseProps[Key];
  return semiGlobal.config.overrideDefaultProps?.Collapse?.[key] as CollapseProps[Key];
}

const runtimeActiveKey = computed(() => resolveOptional('activeKey'));
const runtimeDefaultActiveKey = computed(() => resolveProp('defaultActiveKey', ''));
const runtimeAccordion = computed(() => resolveProp('accordion', false));
const runtimeClickHeaderToExpand = computed(() => resolveProp('clickHeaderToExpand', true));
const runtimeExpandIconPosition = computed(() => resolveProp('expandIconPosition', 'right'));
const runtimeKeepDOM = computed(() => resolveProp('keepDOM', false));
const runtimeMotion = computed(() => resolveProp('motion', true));
const runtimeLazyRender = computed(() => resolveProp('lazyRender', false));

const foundationProps = computed<CollapseFoundationProps>(() => ({
  accordion: runtimeAccordion.value,
  activeKey: runtimeActiveKey.value,
  defaultActiveKey: runtimeDefaultActiveKey.value,
}));
const activeSet = shallowRef<Set<string>>(new Set());
const adapter: CollapseAdapter = {
  getProps: () => foundationProps.value,
  getStates: () => ({ activeSet: activeSet.value }),
  handleChange: (nextActiveKey, event) => {
    emit('change', nextActiveKey, event);
    emit('update:activeKey', nextActiveKey);
  },
  addActiveKey: (nextActiveSet) => {
    activeSet.value = nextActiveSet;
  },
};
const foundation = markRaw(new CollapseFoundation(adapter));
activeSet.value = new Set(foundation.initActiveKey());

function setsEqual(current: ReadonlySet<string>, next: ReadonlySet<string>): boolean {
  if (current.size !== next.size) return false;
  for (const key of current) if (!next.has(key)) return false;
  return true;
}

watch(runtimeActiveKey, (value) => {
  if (!value) return;
  const nextSet = new Set(Array.isArray(value) ? value : [value]);
  if (!setsEqual(activeSet.value, nextSet)) activeSet.value = nextSet;
});

provide(collapseContextKey, {
  activeSet: computed(() => activeSet.value),
  clickHeaderToExpand: runtimeClickHeaderToExpand,
  collapseIcon: () => slots.collapseIcon?.() ?? resolveOptional('collapseIcon'),
  expandIcon: () => slots.expandIcon?.() ?? resolveOptional('expandIcon'),
  expandIconPosition: runtimeExpandIconPosition,
  keepDOM: runtimeKeepDOM,
  lazyRender: runtimeLazyRender,
  motion: runtimeMotion,
  onClick: (itemKey, event) => foundation.handleChange(itemKey, event),
});

const rootClasses = computed(() => ['semi-collapse', attrs.class, props.class, props.className]);
const rootStyle = computed(() => [props.style, attrs.style]);
const dataAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => name.startsWith('data-'))),
);

onBeforeUnmount(() => foundation.destroy());
</script>

<template>
  <div v-bind="dataAttrs" :class="rootClasses" :style="rootStyle">
    <slot />
  </div>
</template>
