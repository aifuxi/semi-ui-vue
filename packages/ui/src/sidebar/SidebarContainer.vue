<script setup lang="ts">
import { IconClose } from '@aifuxi/semi-icons-vue';
import {
  SidebarContainerFoundation,
  type SidebarContainerAdapter,
  type SidebarContainerFoundationProps,
  type SidebarContainerFoundationState,
} from '@workspace/foundation-integration';
import {
  Comment,
  computed,
  Fragment,
  getCurrentInstance,
  markRaw,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  Text,
  useAttrs,
  useSlots,
  useTemplateRef,
  watch,
  type VNode,
} from 'vue';

import { Button } from '../button';
import { semiGlobal } from '../config-provider';
import { Resizable } from '../resizable';
import SidebarNodeRenderer from './SidebarNodeRenderer';
import type {
  SidebarContainerEmits,
  SidebarContainerExposed,
  SidebarContainerProps,
  SidebarContainerSlots,
} from './types';

defineOptions({ name: 'SidebarContainer', inheritAttrs: false });
const props = defineProps<SidebarContainerProps>();
const emit = defineEmits<SidebarContainerEmits>();
defineSlots<SidebarContainerSlots>();
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
const container = useTemplateRef<HTMLDivElement>('container');

function hasRawProp(key: keyof SidebarContainerProps): boolean {
  const raw = instance?.vnode.props;
  const kebabKey = String(key).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    raw &&
    (Object.prototype.hasOwnProperty.call(raw, key) ||
      Object.prototype.hasOwnProperty.call(raw, kebabKey)),
  );
}

function resolved<Key extends keyof SidebarContainerProps>(
  key: Key,
  fallback: NonNullable<SidebarContainerProps[Key]>,
): NonNullable<SidebarContainerProps[Key]> {
  const explicitValue = props[key];
  if (hasRawProp(key) && props[key] !== undefined) {
    return explicitValue as NonNullable<SidebarContainerProps[Key]>;
  }
  const configured = semiGlobal.config.overrideDefaultProps?.SidebarContainer?.[key];
  return (configured === undefined ? fallback : configured) as NonNullable<
    SidebarContainerProps[Key]
  >;
}

const visible = computed(() => resolved('visible', false));
const motion = computed(() => resolved('motion', true));
const resizable = computed(() => resolved('resizable', true));
const showClose = computed(() => resolved('showClose', true));
const minWidth = computed(() => resolved('minWidth', 150));
const closeOnEsc = computed(() => resolved('closeOnEsc', false));
const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([name]) => name !== 'class' && name !== 'style'),
  ),
);
const rootClasses = computed(() => [
  'semi-sidebar-container',
  props.class,
  props.className,
  attrs.class,
  motion.value && visible.value ? 'semi-sidebar-animation-content_show' : undefined,
  motion.value && !visible.value ? 'semi-sidebar-animation-content_hide' : undefined,
]);
const rootStyle = computed(() => [props.style, attrs.style]);
const resizeBindings = computed(() => ({
  minWidth: minWidth.value,
  enable: {
    left: true,
    right: false,
    top: false,
    bottom: false,
    topLeft: false,
    topRight: false,
    bottomLeft: false,
    bottomRight: false,
  },
  ...(props.defaultSize === undefined ? {} : { defaultSize: props.defaultSize }),
  ...(props.maxWidth === undefined ? {} : { maxWidth: props.maxWidth }),
}));
function hasRenderableContent(nodes: readonly VNode[]): boolean {
  return nodes.some((node) => {
    if (node.type === Comment) return false;
    if (node.type === Fragment && Array.isArray(node.children)) {
      return hasRenderableContent(node.children as VNode[]);
    }
    return (
      typeof node.children !== 'string' || node.children.trim().length > 0 || node.type !== Text
    );
  });
}

const customHeader = computed(() => {
  const content = slots.header?.();
  if (!content || !hasRenderableContent(content)) return props.renderHeader?.();
  return content ?? props.renderHeader?.();
});
const titleContent = computed(() => slots.title?.() ?? props.title);

const state = shallowReactive<SidebarContainerFoundationState>({
  displayNone: !visible.value,
});
const foundationProps = computed<SidebarContainerFoundationProps>(() => ({
  visible: visible.value,
  closeOnEsc: closeOnEsc.value,
}));
const cache = new Map<unknown, unknown>();
let listening = false;

function notifyCancel(event: MouseEvent | KeyboardEvent): void {
  emit('cancel', event);
}

function notifyVisibleChange(nextVisible: boolean): void {
  props.afterVisibleChange?.(nextVisible);
  emit('after-visible-change', nextVisible);
}

function handleKeyDown(event: KeyboardEvent): void {
  foundation.handleKeyDown(event);
}

function addKeydown(): void {
  if (listening || typeof window === 'undefined') return;
  window.addEventListener('keydown', handleKeyDown);
  listening = true;
}

function removeKeydown(): void {
  if (!listening || typeof window === 'undefined') return;
  window.removeEventListener('keydown', handleKeyDown);
  listening = false;
}

const adapter: SidebarContainerAdapter = {
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
  notifyCancel: (event) => notifyCancel(event as MouseEvent | KeyboardEvent),
  notifyVisibleChange,
  setOnKeyDownListener: addKeydown,
  removeKeyDownListener: removeKeydown,
  toggleDisplayNone: (displayNone) => {
    state.displayNone = displayNone;
  },
};
const foundation = markRaw(new SidebarContainerFoundation(adapter));

function finishVisibilityChange(): void {
  foundation.handleAnimationEnd();
  notifyVisibleChange(visible.value);
}

function handleAnimationEnd(event: AnimationEvent): void {
  if (event.target !== container.value) return;
  finishVisibilityChange();
}

function handleClose(event: MouseEvent): void {
  foundation.handleCancel(event);
}

watch(visible, (nextVisible, previousVisible) => {
  if (nextVisible === previousVisible) return;
  if (nextVisible) {
    state.displayNone = false;
    foundation.beforeShow();
  }
  if (!motion.value) {
    finishVisibilityChange();
    if (!nextVisible) foundation.afterHide();
  }
});

watch(container, (element) => props.containerRef?.(element));

onMounted(() => {
  props.containerRef?.(container.value);
  if (visible.value) foundation.beforeShow();
});

onBeforeUnmount(() => {
  foundation.destroy();
  removeKeydown();
  props.containerRef?.(null);
});

defineExpose<SidebarContainerExposed>({ getContainerElement: () => container.value });
</script>

<template>
  <Resizable v-if="!state.displayNone && resizable" v-bind="resizeBindings">
    <div
      v-bind="rootAttrs"
      ref="container"
      :class="rootClasses"
      :style="rootStyle"
      @animationend="handleAnimationEnd"
    >
      <SidebarNodeRenderer v-if="customHeader" :content="customHeader" />
      <div v-else class="semi-sidebar-container-header">
        <div class="semi-sidebar-container-header-title">
          <SidebarNodeRenderer :content="titleContent" />
        </div>
        <Button
          v-if="showClose"
          class="semi-sidebar-container-header-closeBtn"
          theme="borderless"
          type="tertiary"
          size="small"
          aria-label="close"
          @click="handleClose"
        >
          <template #icon><IconClose /></template>
        </Button>
      </div>
      <div class="semi-sidebar-container-content"><slot /></div>
    </div>
  </Resizable>
  <div
    v-else-if="!state.displayNone"
    v-bind="rootAttrs"
    ref="container"
    :class="rootClasses"
    :style="rootStyle"
    @animationend="handleAnimationEnd"
  >
    <SidebarNodeRenderer v-if="customHeader" :content="customHeader" />
    <div v-else class="semi-sidebar-container-header">
      <div class="semi-sidebar-container-header-title">
        <SidebarNodeRenderer :content="titleContent" />
      </div>
      <Button
        v-if="showClose"
        class="semi-sidebar-container-header-closeBtn"
        theme="borderless"
        type="tertiary"
        size="small"
        aria-label="close"
        @click="handleClose"
      >
        <template #icon><IconClose /></template>
      </Button>
    </div>
    <div class="semi-sidebar-container-content"><slot /></div>
  </div>
</template>
