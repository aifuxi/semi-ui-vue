<script setup lang="ts">
import {
  computed,
  h,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  shallowRef,
  useId,
  watch,
  type StyleValue,
  type HTMLAttributes,
  type VNodeChild,
} from 'vue';
import {
  ModalContentFoundation,
  ModalFocusTrapHandle,
  type ModalContentAdapter,
} from '@workspace/foundation-integration';

import ModalInnerContent, { type ModalInnerContentExposed } from './ModalInnerContent.vue';
import ModalNodeRenderer from './ModalNodeRenderer';
import type { ConfigDirection } from '../config-provider';
import type { ModalSize } from './types';

interface Props {
  body: VNodeChild;
  bodyStyle?: StyleValue | undefined;
  centered: boolean;
  class?: HTMLAttributes['class'];
  closable: boolean;
  closeIcon: VNodeChild;
  closeOnEsc: boolean;
  contentClass: HTMLAttributes['class'];
  customContainer: boolean;
  dataAttrs: Record<string, unknown>;
  direction: ConfigDirection;
  footer: VNodeChild;
  fullScreen: boolean;
  header: VNodeChild;
  headerProvided: boolean;
  height?: string | number | undefined;
  hidden: boolean;
  icon: VNodeChild;
  mask: boolean;
  maskClass: HTMLAttributes['class'];
  maskClosable: boolean;
  maskFixed: boolean;
  maskStyle?: StyleValue | undefined;
  modalRender?: ((dialog: VNodeChild) => VNodeChild) | undefined;
  outerStyle?: StyleValue | undefined;
  preventScroll: boolean;
  size: ModalSize;
  title: VNodeChild;
  visible: boolean;
  width?: string | number | undefined;
}

export interface ModalDialogExposed {
  activate: () => Promise<void>;
  deactivate: () => void;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  animationEnd: [event: AnimationEvent];
  close: [event: MouseEvent | KeyboardEvent];
}>();
const dialogId = useId();
const inner = shallowRef<ModalInnerContentExposed | null>(null);
const state = shallowReactive({
  dialogMouseDown: false,
  prevFocusElement: null as HTMLElement | null,
});
const cache = new Map<unknown, unknown>();
let focusTrap: InstanceType<typeof ModalFocusTrapHandle> | undefined;
let mouseResetTimer: ReturnType<typeof setTimeout> | undefined;
let active = false;

const foundationProps = computed(() => ({ closeOnEsc: props.closeOnEsc }));
const adapter: ModalContentAdapter<typeof foundationProps.value, typeof state> = {
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
  stopPropagation: (event) => event?.stopPropagation?.(),
  persistEvent: () => undefined,
  notifyClose: (event) => emit('close', event),
  notifyDialogMouseDown: () => {
    state.dialogMouseDown = true;
  },
  notifyDialogMouseUp: () => {
    if (!state.dialogMouseDown) return;
    clearTimeout(mouseResetTimer);
    mouseResetTimer = setTimeout(() => {
      state.dialogMouseDown = false;
    }, 0);
  },
  addKeyDownEventListener: () => document.addEventListener('keydown', foundation.handleKeyDown),
  removeKeyDownEventListener: () =>
    document.removeEventListener('keydown', foundation.handleKeyDown),
  getMouseState: () => state.dialogMouseDown,
  modalDialogFocus: () => {
    const element = inner.value?.element;
    if (!element) return;
    const current = ModalFocusTrapHandle.getActiveElement();
    const activeInDialog = current instanceof Node && element.contains(current);
    focusTrap?.destroy();
    focusTrap = markRaw(new ModalFocusTrapHandle(element, { preventScroll: props.preventScroll }));
    if (!activeInDialog) element.focus({ preventScroll: props.preventScroll });
  },
  modalDialogBlur: () => {
    inner.value?.element?.blur();
    focusTrap?.destroy();
    focusTrap = undefined;
  },
  prevFocusElementReFocus: () => {
    state.prevFocusElement?.focus?.({ preventScroll: props.preventScroll });
  },
};
const foundation = markRaw(new ModalContentFoundation(adapter));

const rootClasses = computed(() => [
  props.class,
  {
    'semi-modal-popup': props.customContainer && !props.maskFixed,
    'semi-modal-fixed': props.maskFixed,
    'semi-modal-rtl': props.direction === 'rtl',
  },
]);
const innerVNode = computed(() =>
  h(ModalInnerContent, {
    ref: inner,
    body: props.body,
    bodyStyle: props.bodyStyle,
    centered: props.centered,
    closable: props.closable,
    closeIcon: props.closeIcon,
    contentClass: props.contentClass,
    dialogId,
    footer: props.footer,
    fullScreen: props.fullScreen,
    header: props.header,
    headerProvided: props.headerProvided,
    height: props.height,
    icon: props.icon,
    outerStyle: props.outerStyle,
    size: props.size,
    title: props.title,
    width: props.width,
    onAnimationEnd: (event: AnimationEvent) => emit('animationEnd', event),
    onClose: (event: MouseEvent) => foundation.close(event),
    onMousedown: () => foundation.handleDialogMouseDown(),
  }),
);
const renderedDialog = computed(() => props.modalRender?.(innerVNode.value) ?? innerVNode.value);

async function activate(): Promise<void> {
  if (active || typeof document === 'undefined') return;
  active = true;
  state.prevFocusElement = ModalFocusTrapHandle.getActiveElement();
  foundation.handleKeyDownEventListenerMount();
  await nextTick();
  if (!active) return;
  foundation.modalDialogFocus();
  const element = inner.value?.element;
  if (element && !element.contains(document.activeElement)) {
    const autofocus = element.querySelector<HTMLElement>('[autofocus]');
    const focusable = ModalFocusTrapHandle.getFocusableElements(element);
    (autofocus ?? focusable[0])?.focus({ preventScroll: props.preventScroll });
  }
}

function deactivate(): void {
  if (!active || typeof document === 'undefined') return;
  active = false;
  foundation.destroy();
}

function handleMaskClick(event: MouseEvent): void {
  if (props.maskClosable) foundation.handleMaskClick(event);
}

function handleMaskMouseUp(): void {
  if (props.maskClosable) foundation.handleMaskMouseUp();
}

onMounted(() => {
  if (props.visible && !props.hidden) void activate();
});
watch(
  () => props.visible,
  (visible) => {
    if (visible && !props.hidden) void activate();
  },
);
watch(
  () => props.hidden,
  (hidden) => {
    if (hidden) deactivate();
  },
);
onBeforeUnmount(() => {
  clearTimeout(mouseResetTimer);
  deactivate();
});

defineExpose({ activate, deactivate });
</script>

<template>
  <div v-bind="props.dataAttrs" :class="rootClasses">
    <div
      v-if="props.mask"
      class="semi-modal-mask"
      :class="props.maskClass"
      :style="props.maskStyle"
      @animationend="emit('animationEnd', $event)"
    />
    <div
      role="none"
      class="semi-modal-wrap"
      :class="{ 'semi-modal-wrap-center': props.centered }"
      @click="handleMaskClick"
      @mouseup="handleMaskMouseUp"
    >
      <ModalNodeRenderer :content="renderedDialog" />
    </div>
  </div>
</template>
