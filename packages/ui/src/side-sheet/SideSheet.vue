<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  inject,
  markRaw,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  shallowRef,
  useAttrs,
  useSlots,
  watch,
  type VNodeChild,
} from 'vue';
import {
  SideSheetFoundation,
  sideSheetStrings,
  type FoundationSideSheetState,
  type SideSheetAdapter,
} from '@workspace/foundation-integration';

import { configContextKey, semiGlobal } from '../config-provider';
import SideSheetContent from './SideSheetContent.vue';
import type { SideSheetEmits, SideSheetProps, SideSheetSlots } from './types';

defineOptions({ name: 'SideSheet', inheritAttrs: false });
const props = defineProps<SideSheetProps>();
const emit = defineEmits<SideSheetEmits>();
defineSlots<SideSheetSlots>();
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
const injectedConfig = inject(configContextKey, undefined);
const teleportTarget = shallowRef<HTMLElement | null>(null);
const mounted = shallowRef(false);
const cache = new Map<unknown, unknown>();
let activeCycle = false;
let hideTimer: ReturnType<typeof setTimeout> | undefined;
let originalBodyOverflow: string | null = null;
let originalBodyWidth = '';

function hasRawProp(key: keyof SideSheetProps): boolean {
  const kebabKey = String(key).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  const raw = instance?.vnode.props;
  return Boolean(
    raw &&
    (Object.prototype.hasOwnProperty.call(raw, key) ||
      Object.prototype.hasOwnProperty.call(raw, kebabKey)),
  );
}

function resolveProp<Key extends keyof SideSheetProps>(
  key: Key,
  fallback: NonNullable<SideSheetProps[Key]>,
): NonNullable<SideSheetProps[Key]> {
  const currentValue = props[key];
  if (hasRawProp(key) && currentValue !== undefined) {
    return currentValue as NonNullable<SideSheetProps[Key]>;
  }
  const globalValue = semiGlobal.config.overrideDefaultProps?.SideSheet?.[key];
  return (globalValue === undefined ? fallback : globalValue) as NonNullable<SideSheetProps[Key]>;
}

function resolveOptional<Key extends keyof SideSheetProps>(key: Key): SideSheetProps[Key] {
  const currentValue = props[key];
  if (hasRawProp(key)) return currentValue as SideSheetProps[Key];
  const globalValue = semiGlobal.config.overrideDefaultProps?.SideSheet?.[key];
  return (globalValue === undefined ? undefined : globalValue) as SideSheetProps[Key];
}

const runtimeVisible = computed(() => resolveProp('visible', false));
const runtimeProps = computed(() => ({
  canVerticalSetWidth: resolveProp('canVerticalSetWidth', false),
  closable: resolveProp('closable', true),
  closeOnEsc: resolveProp('closeOnEsc', false),
  disableScroll: resolveProp('disableScroll', true),
  keepDOM: resolveProp('keepDOM', false),
  mask: resolveProp('mask', true),
  maskClosable: resolveProp('maskClosable', true),
  motion: resolveProp('motion', true),
  placement: resolveProp('placement', 'right'),
  size: resolveProp('size', 'small'),
  visible: runtimeVisible.value,
  zIndex: resolveProp('zIndex', 1000),
}));
const state = shallowReactive<FoundationSideSheetState>({
  displayNone: !runtimeVisible.value,
});

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

const adapter: SideSheetAdapter<typeof runtimeProps.value, FoundationSideSheetState> = {
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
    emit('cancel', event);
  },
  notifyVisibleChange: (visible) => {
    props.afterVisibleChange?.(visible);
    emit('afterVisibleChange', visible);
  },
  setOnKeyDownListener: () => {
    if (typeof window !== 'undefined') window.addEventListener('keydown', handleKeyDown);
  },
  removeKeyDownListener: () => {
    if (typeof window !== 'undefined') window.removeEventListener('keydown', handleKeyDown);
  },
  toggleDisplayNone: (displayNone) => {
    state.displayNone = displayNone;
  },
};
const foundation = markRaw(new SideSheetFoundation(adapter));

const config = computed(() => injectedConfig?.value);
const popupGetter = computed(
  () => resolveOptional('getPopupContainer') ?? config.value?.getPopupContainer,
);
const customContainer = computed(
  () => typeof document !== 'undefined' && teleportTarget.value !== document.body,
);
const direction = computed(() => config.value?.direction ?? 'ltr');
const bodyContent = computed<VNodeChild>(() => slots.default?.());
const titleContent = computed<VNodeChild>(
  () => slots.title?.() ?? (hasRawProp('title') ? props.title : undefined),
);
const footerContent = computed<VNodeChild>(
  () => slots.footer?.() ?? (hasRawProp('footer') ? props.footer : undefined),
);
const closeIconContent = computed<VNodeChild>(
  () => slots.closeIcon?.() ?? (hasRawProp('closeIcon') ? props.closeIcon : undefined),
);
const dataAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => name.startsWith('data-'))),
);
const rootClasses = computed(() => [attrs.class, props.class, props.className]);
const isHorizontal = computed(
  () => runtimeProps.value.placement === 'top' || runtimeProps.value.placement === 'bottom',
);
const contentWidth = computed(() => {
  const width = resolveOptional('width');
  if (!isHorizontal.value || runtimeProps.value.canVerticalSetWidth) return width;
  return '100%';
});
const contentHeight = computed(() =>
  isHorizontal.value ? resolveOptional('height') || sideSheetStrings.HEIGHT : '100%',
);
const maskClass = computed(() =>
  runtimeProps.value.motion
    ? runtimeVisible.value
      ? 'semi-sidesheet-animation-mask_show'
      : 'semi-sidesheet-animation-mask_hide'
    : undefined,
);
const dialogClass = computed(() =>
  runtimeProps.value.motion
    ? runtimeVisible.value
      ? `semi-sidesheet-animation-content_show_${runtimeProps.value.placement}`
      : `semi-sidesheet-animation-content_hide_${runtimeProps.value.placement}`
    : undefined,
);
const shouldRender = computed(
  () =>
    runtimeVisible.value ||
    runtimeProps.value.keepDOM ||
    (runtimeProps.value.motion && !state.displayNone),
);
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

function handleKeyDown(event: KeyboardEvent): void {
  foundation.handleKeyDown(event);
}

function beginShow(): void {
  clearTimeout(hideTimer);
  const wasHidden = state.displayNone;
  resolveContainer();
  state.displayNone = false;
  activeCycle = true;
  foundation.beforeShow();
  if (wasHidden) foundation.onVisibleChange(true);
}

function finishHide(): void {
  if (!activeCycle || runtimeVisible.value || state.displayNone) return;
  clearTimeout(hideTimer);
  foundation.toggleDisplayNone(true);
  activeCycle = false;
  foundation.onVisibleChange(false);
}

function beginHide(): void {
  if (!activeCycle) return;
  foundation.afterHide();
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
  if (runtimeVisible.value) beginShow();
});
watch(runtimeVisible, (visible, previous) => {
  if (!mounted.value || visible === previous) return;
  if (visible) beginShow();
  else beginHide();
});
watch(popupGetter, () => {
  if (mounted.value) resolveContainer();
});
onBeforeUnmount(() => {
  clearTimeout(hideTimer);
  if (activeCycle) foundation.destroy();
  else enableBodyScroll();
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
      <SideSheetContent
        :aria-label="resolveOptional('aria-label')"
        :body="bodyContent"
        :body-style="resolveOptional('bodyStyle')"
        :class="rootClasses"
        :closable="runtimeProps.closable"
        :close-icon="closeIconContent"
        :custom-container="customContainer"
        :data-attrs="dataAttrs"
        :dialog-class="dialogClass"
        :footer="footerContent"
        :header-style="resolveOptional('headerStyle')"
        :height="contentHeight"
        :hidden="runtimeProps.keepDOM && state.displayNone"
        :mask="runtimeProps.mask"
        :mask-class="maskClass"
        :mask-closable="runtimeProps.maskClosable"
        :mask-style="resolveOptional('maskStyle')"
        :outer-style="[attrs.style, resolveOptional('style')]"
        :placement="runtimeProps.placement"
        :rtl="direction === 'rtl'"
        :size="runtimeProps.size"
        :title="titleContent"
        :width="contentWidth"
        :wrapper-width="resolveOptional('width')"
        @animation-end="handleAnimationEnd"
        @close="(event) => foundation.handleCancel(event)"
      />
    </div>
  </Teleport>
</template>
