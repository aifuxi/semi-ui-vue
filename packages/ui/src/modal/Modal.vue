<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  h,
  inject,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  shallowRef,
  useAttrs,
  useSlots,
  useTemplateRef,
  watch,
  type VNodeChild,
} from 'vue';
import {
  ModalFoundation,
  type ModalAdapter,
  type FoundationModalState,
} from '@workspace/foundation-integration';

import { configContextKey, DEFAULT_CONFIG_LOCALE, semiGlobal } from '../config-provider';
import ModalDefaultFooter from './ModalDefaultFooter.vue';
import ModalDialog, { type ModalDialogExposed } from './ModalDialog.vue';
import type { ModalActionHandler, ModalEmits, ModalLocale, ModalProps, ModalSlots } from './types';

defineOptions({ name: 'Modal', inheritAttrs: false });
const props = defineProps<ModalProps>();
const emit = defineEmits<ModalEmits>();
defineSlots<ModalSlots>();
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
const injectedConfig = inject(configContextKey, undefined);
const dialog = useTemplateRef<ModalDialogExposed>('dialog');
const teleportTarget = shallowRef<HTMLElement | null>(null);
const mounted = shallowRef(false);
const haveRendered = shallowRef(false);
const cache = new Map<unknown, unknown>();
let activeCycle = false;
let hideTimer: ReturnType<typeof setTimeout> | undefined;
let originalBodyOverflow: string | null = null;
let originalBodyWidth = '';

function hasRawProp(key: keyof ModalProps): boolean {
  const kebabKey = String(key).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  const raw = instance?.vnode.props;
  return Boolean(
    raw &&
    (Object.prototype.hasOwnProperty.call(raw, key) ||
      Object.prototype.hasOwnProperty.call(raw, kebabKey)),
  );
}

function resolveProp<Key extends keyof ModalProps>(
  key: Key,
  fallback: NonNullable<ModalProps[Key]>,
): NonNullable<ModalProps[Key]> {
  if (hasRawProp(key) && props[key] !== undefined) {
    return props[key] as NonNullable<ModalProps[Key]>;
  }
  const globalValue = semiGlobal.config.overrideDefaultProps?.Modal?.[key];
  return (globalValue === undefined ? fallback : globalValue) as NonNullable<ModalProps[Key]>;
}

function resolveOptional<Key extends keyof ModalProps>(key: Key): ModalProps[Key] {
  if (hasRawProp(key)) return props[key] as ModalProps[Key];
  const globalValue = semiGlobal.config.overrideDefaultProps?.Modal?.[key];
  return (globalValue === undefined ? undefined : globalValue) as ModalProps[Key];
}

const config = computed(() => injectedConfig?.value);
const runtimeVisible = computed(() => resolveProp('visible', false));
const runtimeProps = computed(() => ({
  centered: resolveProp('centered', false),
  closable: resolveProp('closable', true),
  closeOnEsc: resolveProp('closeOnEsc', true),
  footerFill: resolveProp('footerFill', false),
  fullScreen: resolveProp('fullScreen', false),
  hasCancel: resolveProp('hasCancel', true),
  keepDOM: resolveProp('keepDOM', false),
  lazyRender: resolveProp('lazyRender', true),
  mask: resolveProp('mask', true),
  maskClosable: resolveProp('maskClosable', true),
  maskFixed: resolveProp('maskFixed', false),
  motion: resolveProp('motion', true),
  okType: resolveProp('okType', 'primary'),
  preventScroll: resolveProp('preventScroll', false),
  size: resolveProp('size', 'small'),
  visible: runtimeVisible.value,
  zIndex: resolveProp('zIndex', 1000),
}));
const state = shallowReactive<FoundationModalState>({
  displayNone: !runtimeVisible.value,
  isFullScreen: runtimeProps.value.fullScreen,
});

function invokeHandler(handler: ModalActionHandler | undefined, event: MouseEvent | KeyboardEvent) {
  return handler?.(event);
}

function disableBodyScroll(): void {
  if (typeof document === 'undefined' || teleportTarget.value !== document.body) return;
  originalBodyOverflow = document.body.style.overflow || '';
  originalBodyWidth = document.body.style.width;
  if (originalBodyOverflow === 'hidden') return;
  const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
  document.body.style.overflow = 'hidden';
  document.body.style.width = `calc(${originalBodyWidth || '100%'} - ${scrollbarWidth}px)`;
}

function enableBodyScroll(): void {
  if (typeof document === 'undefined' || originalBodyOverflow === null) return;
  if (originalBodyOverflow !== 'hidden') {
    document.body.style.overflow = originalBodyOverflow;
    document.body.style.width = originalBodyWidth;
  }
  originalBodyOverflow = null;
}

const adapter: ModalAdapter<typeof runtimeProps.value, FoundationModalState> = {
  getContext: () => undefined,
  getContexts: () => ({}),
  getProp: (key) => runtimeProps.value[key],
  getProps: () => runtimeProps.value,
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
  disabledBodyScroll: disableBodyScroll,
  enabledBodyScroll: enableBodyScroll,
  notifyCancel: (event) => {
    emit('update:visible', false);
    return invokeHandler(props.onCancel, event);
  },
  notifyOk: (event) => invokeHandler(props.onOk, event),
  notifyClose: () => {
    props.afterClose?.();
    if (props.onAfterClose !== props.afterClose) props.onAfterClose?.();
  },
  toggleDisplayNone: (displayNone, callback) => {
    if (state.displayNone !== displayNone) state.displayNone = displayNone;
    callback?.(displayNone);
  },
  notifyFullScreen: (isFullScreen) => {
    state.isFullScreen = isFullScreen;
  },
};
const foundation = markRaw(new ModalFoundation(adapter));

const popupGetter = computed(() => {
  const explicit = resolveOptional('getPopupContainer');
  if (explicit) return explicit;
  return config.value?.getPopupContainer;
});
const customContainer = computed(
  () => typeof document !== 'undefined' && teleportTarget.value !== document.body,
);
const direction = computed(() => resolveOptional('direction') ?? config.value?.direction ?? 'ltr');
const locale = computed<ModalLocale>(() => {
  const configured = config.value?.locale.Modal as ModalLocale | undefined;
  const fallback = DEFAULT_CONFIG_LOCALE.Modal as ModalLocale | undefined;
  return configured ?? fallback ?? { confirm: '确定', cancel: '取消' };
});
const bodyContent = computed<VNodeChild>(
  () => slots.body?.() ?? slots.default?.() ?? (hasRawProp('content') ? props.content : undefined),
);
const titleContent = computed<VNodeChild>(
  () => slots.title?.() ?? (hasRawProp('title') ? props.title : undefined),
);
const iconContent = computed<VNodeChild>(
  () => slots.icon?.() ?? (hasRawProp('icon') ? props.icon : undefined),
);
const closeIconContent = computed<VNodeChild>(
  () => slots.closeIcon?.() ?? (hasRawProp('closeIcon') ? props.closeIcon : undefined),
);
const headerProvided = computed(() => Boolean(slots.header) || hasRawProp('header'));
const headerContent = computed<VNodeChild>(() => slots.header?.() ?? props.header);
const footerProvided = computed(() => Boolean(slots.footer) || hasRawProp('footer'));
const footerContent = computed<VNodeChild>(() => {
  if (footerProvided.value) return slots.footer?.() ?? props.footer;
  return h(ModalDefaultFooter, {
    cancelButtonProps: resolveOptional('cancelButtonProps'),
    cancelLoading:
      resolveOptional('cancelLoading') ?? state.onCancelReturnPromiseStatus === 'pending',
    cancelText: resolveOptional('cancelText'),
    footerFill: runtimeProps.value.footerFill,
    hasCancel: runtimeProps.value.hasCancel,
    locale: locale.value,
    okButtonProps: resolveOptional('okButtonProps'),
    okLoading: resolveOptional('confirmLoading') ?? state.onOKReturnPromiseStatus === 'pending',
    okText: resolveOptional('okText'),
    okType: runtimeProps.value.okType,
    onCancel: (event: MouseEvent) => foundation.handleCancel(event),
    onOk: (event: MouseEvent) => foundation.handleOk(event),
  });
});
const dataAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => name.startsWith('data-'))),
);
const modalClasses = computed(() => [
  attrs.class,
  props.class,
  props.className,
  runtimeProps.value.keepDOM && state.displayNone ? 'semi-modal-displayNone' : undefined,
]);
const contentClass = computed(() => [
  resolveOptional('modalContentClass'),
  runtimeProps.value.motion
    ? runtimeVisible.value
      ? 'semi-modal-content-animate-show'
      : 'semi-modal-content-animate-hide'
    : undefined,
]);
const maskClass = computed(() =>
  runtimeProps.value.motion
    ? runtimeVisible.value
      ? 'semi-modal-mask-animate-show'
      : 'semi-modal-mask-animate-hide'
    : undefined,
);
const shouldRender = computed(() => {
  return (
    runtimeVisible.value ||
    (runtimeProps.value.keepDOM && (!runtimeProps.value.lazyRender || haveRendered.value)) ||
    (runtimeProps.value.motion && !state.displayNone)
  );
});
const portalStyle = computed(() => ({
  zIndex: runtimeProps.value.zIndex,
  ...(customContainer.value ? { position: 'static' as const } : {}),
}));

function resolveContainer(): void {
  if (typeof document === 'undefined') return;
  const getter = popupGetter.value;
  const target = getter?.();
  teleportTarget.value = target instanceof HTMLElement ? target : getter ? null : document.body;
}

async function openCycle(): Promise<void> {
  clearTimeout(hideTimer);
  activeCycle = true;
  state.displayNone = false;
  state.isFullScreen = runtimeProps.value.fullScreen;
  haveRendered.value = true;
  resolveContainer();
  foundation.beforeShow();
  await nextTick();
  await dialog.value?.activate();
}

function finishHide(): void {
  if (!activeCycle || runtimeVisible.value) return;
  clearTimeout(hideTimer);
  dialog.value?.deactivate();
  foundation.toggleDisplayNone(true);
  activeCycle = false;
  foundation.afterHide();
}

function beginHide(): void {
  if (!activeCycle) return;
  if (!runtimeProps.value.motion) {
    finishHide();
    return;
  }
  clearTimeout(hideTimer);
  hideTimer = setTimeout(finishHide, 180);
}

function handleAnimationEnd(): void {
  if (!runtimeVisible.value) finishHide();
}

onMounted(() => {
  mounted.value = true;
  resolveContainer();
  if (runtimeVisible.value) void openCycle();
});
watch(runtimeVisible, (visible, previous) => {
  if (!mounted.value || visible === previous) return;
  if (visible) void openCycle();
  else beginHide();
});
watch(popupGetter, () => {
  if (mounted.value) resolveContainer();
});
watch(
  () => runtimeProps.value.fullScreen,
  (fullScreen) => foundation.notifyFullScreen(fullScreen),
);
onBeforeUnmount(() => {
  clearTimeout(hideTimer);
  dialog.value?.deactivate();
  if (activeCycle) foundation.destroy();
  else foundation.enabledBodyScroll();
});
</script>

<template>
  <Teleport :to="teleportTarget ?? 'body'" :disabled="teleportTarget === null">
    <div
      v-if="shouldRender"
      class="semi-portal"
      :class="{ 'semi-portal-rtl': direction === 'rtl' }"
      :style="portalStyle"
    >
      <ModalDialog
        ref="dialog"
        :body="bodyContent"
        :body-style="resolveOptional('bodyStyle')"
        :centered="runtimeProps.centered"
        :class="modalClasses"
        :closable="runtimeProps.closable"
        :close-icon="closeIconContent"
        :close-on-esc="runtimeProps.closeOnEsc"
        :content-class="contentClass"
        :custom-container="customContainer"
        :data-attrs="dataAttrs"
        :direction="direction"
        :footer="footerContent"
        :full-screen="state.isFullScreen"
        :header="headerContent"
        :header-provided="headerProvided"
        :height="resolveOptional('height')"
        :hidden="state.displayNone"
        :icon="iconContent"
        :mask="runtimeProps.mask"
        :mask-class="maskClass"
        :mask-closable="runtimeProps.maskClosable"
        :mask-fixed="runtimeProps.maskFixed"
        :mask-style="resolveOptional('maskStyle')"
        :modal-render="resolveOptional('modalRender')"
        :outer-style="[attrs.style, resolveOptional('style')]"
        :prevent-scroll="runtimeProps.preventScroll"
        :size="runtimeProps.size"
        :title="titleContent"
        :visible="runtimeVisible"
        :width="resolveOptional('width')"
        @animation-end="handleAnimationEnd"
        @close="(event) => foundation.handleCancel(event)"
      />
    </div>
  </Teleport>
</template>
