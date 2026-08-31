<script setup lang="ts">
import {
  DragMoveFoundation,
  type DragMoveAdapter,
  type DragMoveFoundationProps,
} from '@workspace/foundation-integration';
import {
  computed,
  getCurrentInstance,
  markRaw,
  onBeforeUnmount,
  onMounted,
  watch,
  type PropType,
} from 'vue';

import { semiGlobal } from '../config-provider';
import DragMoveRenderer from './DragMoveRenderer';
import type {
  DragMoveAllowMove,
  DragMoveConstrainer,
  DragMoveCustomMove,
  DragMoveEmits,
  DragMovePositionStrategy,
  DragMoveSlots,
} from './types';

defineOptions({ name: 'DragMove', inheritAttrs: false });
const props = defineProps({
  allowInputDrag: { type: Boolean, default: undefined },
  allowMove: { type: Function as PropType<DragMoveAllowMove>, default: undefined },
  constrainer: {
    type: [String, Function] as PropType<DragMoveConstrainer>,
    default: undefined,
    validator: (value: DragMoveConstrainer) => value === 'parent' || typeof value === 'function',
  },
  customMove: { type: Function as PropType<DragMoveCustomMove>, default: undefined },
  handler: {
    type: Function as PropType<() => HTMLElement | null | undefined>,
    default: undefined,
  },
  positionStrategy: {
    type: String as PropType<DragMovePositionStrategy>,
    default: undefined,
    validator: (value: DragMovePositionStrategy) => value === 'absolute' || value === 'relative',
  },
});
const emit = defineEmits<DragMoveEmits>();
defineSlots<DragMoveSlots>();
const instance = getCurrentInstance();

function hasRawProp(name: 'allowInputDrag' | 'positionStrategy'): boolean {
  const rawProps = instance?.vnode.props;
  const kebabName = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    rawProps &&
    (Object.prototype.hasOwnProperty.call(rawProps, name) ||
      Object.prototype.hasOwnProperty.call(rawProps, kebabName)),
  );
}

const allowInputDrag = computed(() => {
  if (hasRawProp('allowInputDrag') && props.allowInputDrag !== undefined) {
    return props.allowInputDrag;
  }
  const globalValue = semiGlobal.config.overrideDefaultProps?.DragMove?.allowInputDrag;
  return typeof globalValue === 'boolean' ? globalValue : false;
});
const positionStrategy = computed<DragMovePositionStrategy>(() => {
  if (hasRawProp('positionStrategy') && props.positionStrategy !== undefined) {
    return props.positionStrategy;
  }
  const globalValue = semiGlobal.config.overrideDefaultProps?.DragMove?.positionStrategy;
  return globalValue === 'relative' || globalValue === 'absolute' ? globalValue : 'absolute';
});
const foundationProps = computed<DragMoveFoundationProps>(() => ({
  allowInputDrag: allowInputDrag.value,
  allowMove: props.allowMove,
  customMove: props.customMove,
  positionStrategy: positionStrategy.value,
}));

type DragMoveFoundationState = Record<string, unknown>;
let dragElement: HTMLElement | null = null;
let initialized = false;
const state: DragMoveFoundationState = {};
const cache = new Map<unknown, unknown>();

function setDragElement(element: HTMLElement | null): void {
  dragElement = element;
}

const adapter: DragMoveAdapter<DragMoveFoundationProps, DragMoveFoundationState> = {
  getContext: () => undefined,
  getContexts: () => ({}),
  getProp: (key) => foundationProps.value[key],
  getProps: () => foundationProps.value,
  getState: (key) => state[key],
  getStates: () => state,
  setState: (nextState, callback) => {
    Object.assign(state, nextState);
    callback?.();
  },
  getCache: (key) => cache.get(key),
  getCaches: () => cache,
  setCache: (key, value) => cache.set(key, value),
  stopPropagation: (event) => event.stopPropagation?.(),
  persistEvent: () => undefined,
  getDragElement: () => dragElement as HTMLElement,
  getConstrainer: () => {
    if (props.constrainer === 'parent') {
      return dragElement?.parentNode instanceof HTMLElement ? dragElement.parentNode : null;
    }
    return typeof props.constrainer === 'function' ? (props.constrainer() ?? null) : null;
  },
  getHandler: () =>
    (typeof props.handler === 'function' ? props.handler() : dragElement) as HTMLElement,
  notifyMouseDown: (event) => emit('mouseDown', event),
  notifyMouseMove: (event) => emit('mouseMove', event),
  notifyMouseUp: (event) => emit('mouseUp', event),
  notifyTouchStart: (event) => emit('touchStart', event),
  notifyTouchMove: (event) => emit('touchMove', event),
  notifyTouchEnd: (event) => emit('touchEnd', event),
  notifyTouchCancel: (event) => emit('touchCancel', event),
};
const foundation = markRaw(new DragMoveFoundation(adapter));

watch(
  positionStrategy,
  (value, previous) => {
    if (initialized && value !== previous) foundation.updatePositionStrategy();
  },
  { flush: 'post' },
);

onMounted(() => {
  foundation.init();
  initialized = true;
});

onBeforeUnmount(() => {
  if (initialized) foundation.destroy();
  initialized = false;
  dragElement = null;
  cache.clear();
});
</script>

<template>
  <DragMoveRenderer :set-element="setDragElement"><slot /></DragMoveRenderer>
</template>
