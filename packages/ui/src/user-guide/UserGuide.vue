<script setup lang="ts">
import {
  UserGuideFoundation,
  userGuideCssClasses,
  userGuideNumbers,
  type UserGuideAdapter,
} from '@workspace/foundation-integration';
import {
  computed,
  getCurrentInstance,
  inject,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  useId,
  useSlots,
  watch,
  type VNodeChild,
} from 'vue';

import { configContextKey, DEFAULT_CONFIG_LOCALE, semiGlobal } from '../config-provider';
import Modal from '../modal/Modal.vue';
import Popover from '../popover/Popover.vue';
import UserGuideModalContent from './UserGuideModalContent.vue';
import UserGuidePopupContent from './UserGuidePopupContent.vue';
import type {
  UserGuideButtonProps,
  UserGuideEmits,
  UserGuideLocale,
  UserGuideProps,
  UserGuideSlotProps,
  UserGuideSlots,
  UserGuideStepItem,
} from './types';

defineOptions({ name: 'UserGuide', inheritAttrs: false });
const props = defineProps<UserGuideProps>();
const emit = defineEmits<UserGuideEmits>();
defineSlots<UserGuideSlots>();
const slots = useSlots();
const instance = getCurrentInstance();
const injectedConfig = inject(configContextKey, undefined);
const cache = new Map<unknown, unknown>();
const rawId = useId();
const spotlightMaskId = `semi-user-guide-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

interface UserGuideState {
  current: number;
  spotlightRect: DOMRect | null;
}

const state = shallowReactive<UserGuideState>({
  current: props.current || userGuideNumbers.DEFAULT_CURRENT,
  spotlightRect: null,
});
let mounted = false;
let destroyed = false;
let activeCycle = false;
let measureFrame: number | undefined;
let originalBodyOverflow = '';
let originalBodyWidth = '';
let changedBodyStyle = false;
let scrollbarWidth = 0;

function hasExplicitProp(key: keyof UserGuideProps): boolean {
  const rawProps = instance?.vnode.props;
  const kebabKey = String(key).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    rawProps &&
    (Object.prototype.hasOwnProperty.call(rawProps, key) ||
      Object.prototype.hasOwnProperty.call(rawProps, kebabKey)),
  );
}

function resolveProp<Key extends keyof UserGuideProps>(
  key: Key,
  fallback: NonNullable<UserGuideProps[Key]>,
): NonNullable<UserGuideProps[Key]> {
  if (hasExplicitProp(key) && props[key] !== undefined) {
    return props[key] as NonNullable<UserGuideProps[Key]>;
  }
  const globalValue = semiGlobal.config.overrideDefaultProps?.UserGuide?.[key];
  return (globalValue === undefined ? fallback : globalValue) as NonNullable<UserGuideProps[Key]>;
}

const runtimeSteps = computed<readonly UserGuideStepItem[]>(() => resolveProp('steps', []));
const runtimeVisible = computed(() => resolveProp('visible', false));
const runtimeMask = computed(() => resolveProp('mask', true));
const runtimeMode = computed(() => resolveProp('mode', 'popup'));
const runtimePosition = computed(() => resolveProp('position', 'bottom'));
const runtimeTheme = computed(() => resolveProp('theme', 'default'));
const showPrevButton = computed(() => resolveProp('showPrevButton', true));
const showSkipButton = computed(() => resolveProp('showSkipButton', true));
const spotlightPadding = computed(() => resolveProp('spotlightPadding', 0));
const zIndex = computed(() => resolveProp('zIndex', userGuideNumbers.DEFAULT_Z_INDEX));
const isControlled = computed(() => hasExplicitProp('current'));
const current = computed(() =>
  isControlled.value && props.current !== null && props.current !== undefined
    ? props.current
    : state.current,
);
const activeStep = computed<UserGuideStepItem | undefined>(() => runtimeSteps.value[current.value]);
const isFirst = computed(() => current.value === 0);
const isLast = computed(() => current.value === runtimeSteps.value.length - 1);
const isPrimary = computed(
  () => runtimeTheme.value === 'primary' || activeStep.value?.theme === 'primary',
);
const finalPadding = computed(
  () =>
    activeStep.value?.spotlightPadding ||
    spotlightPadding.value ||
    userGuideNumbers.DEFAULT_SPOTLIGHT_PADDING,
);
const locale = computed<UserGuideLocale>(() => {
  const configured = injectedConfig?.value.locale.UserGuide as UserGuideLocale | undefined;
  const fallback = DEFAULT_CONFIG_LOCALE.UserGuide as UserGuideLocale | undefined;
  return configured ?? fallback ?? { skip: '跳过', next: '下一步', prev: '上一步', finish: '完成' };
});
const slotProps = computed<UserGuideSlotProps | undefined>(() =>
  activeStep.value
    ? { current: current.value, index: current.value, step: activeStep.value }
    : undefined,
);
const coverContent = computed<VNodeChild>(() =>
  slotProps.value ? (slots.cover?.(slotProps.value) ?? activeStep.value?.cover) : undefined,
);
const titleContent = computed<VNodeChild>(() =>
  slotProps.value ? (slots.title?.(slotProps.value) ?? activeStep.value?.title) : undefined,
);
const descriptionContent = computed<VNodeChild>(() =>
  slotProps.value
    ? (slots.description?.(slotProps.value) ?? activeStep.value?.description)
    : undefined,
);
const nextText = computed<VNodeChild>(() =>
  isLast.value
    ? props.finishText || locale.value.finish
    : props.nextButtonProps?.content || locale.value.next,
);
const prevText = computed<VNodeChild>(() => props.prevButtonProps?.content || locale.value.prev);
const popupClass = computed(() => [
  `${userGuideCssClasses.PREFIX}-popover`,
  props.class,
  props.className,
]);
const popupStyle = computed(() => [
  { padding: 0 },
  isPrimary.value ? { backgroundColor: 'var(--semi-color-primary)' } : undefined,
  props.style,
]);
const triggerStyle = computed(() => {
  const rect = state.spotlightRect;
  return rect
    ? {
        position: 'fixed' as const,
        left: `${rect.x}px`,
        top: `${rect.y}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        pointerEvents: 'none' as const,
      }
    : undefined;
});

function foundationProps(): UserGuideProps {
  const resolved: UserGuideProps = {
    steps: runtimeSteps.value,
  };
  if (props.spotlightPadding !== undefined) resolved.spotlightPadding = props.spotlightPadding;
  if (isControlled.value) {
    (resolved as Record<string, unknown>).current = props.current;
  }
  return resolved;
}

function disableBodyScroll(): void {
  if (typeof document === 'undefined' || props.getPopupContainer || changedBodyStyle) return;
  originalBodyOverflow = document.body.style.overflow || '';
  originalBodyWidth = document.body.style.width;
  if (originalBodyOverflow === 'hidden') return;
  document.body.style.overflow = 'hidden';
  document.body.style.width = `calc(${originalBodyWidth || '100%'} - ${scrollbarWidth}px)`;
  changedBodyStyle = true;
}

function enableBodyScroll(): void {
  if (typeof document === 'undefined' || !changedBodyStyle) return;
  document.body.style.overflow = originalBodyOverflow;
  document.body.style.width = originalBodyWidth;
  changedBodyStyle = false;
}

const adapter: UserGuideAdapter<UserGuideProps, UserGuideState> = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key) => foundationProps()[key as keyof UserGuideProps],
  getProps: foundationProps,
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
  notifyChange: (nextCurrent) => {
    emit('change', nextCurrent);
    emit('update:current', nextCurrent);
  },
  notifyFinish: () => emit('finish'),
  notifyNext: (nextCurrent) => emit('next', nextCurrent),
  notifyPrev: (nextCurrent) => emit('prev', nextCurrent),
  notifySkip: () => emit('skip'),
  setCurrent: (nextCurrent) => {
    queueMicrotask(() => {
      if (!destroyed) state.current = nextCurrent;
    });
  },
};
const foundation = markRaw(new UserGuideFoundation<UserGuideProps, UserGuideState>(adapter));

watch(
  () => props.current,
  (nextCurrent) => {
    if (isControlled.value && nextCurrent !== null && nextCurrent !== undefined) {
      state.current = nextCurrent;
    }
  },
  { flush: 'sync' },
);

function resolveTarget(step: UserGuideStepItem | undefined): Element | null {
  if (!step?.target || typeof document === 'undefined') return null;
  const resolved = typeof step.target === 'function' ? step.target() : step.target;
  return resolved instanceof Element ? resolved : null;
}

function cancelMeasure(): void {
  if (measureFrame !== undefined && typeof cancelAnimationFrame === 'function') {
    cancelAnimationFrame(measureFrame);
  }
  measureFrame = undefined;
}

function updateSpotlightRect(): void {
  cancelMeasure();
  if (!runtimeVisible.value || runtimeMode.value !== 'popup') {
    state.spotlightRect = null;
    return;
  }
  const target = resolveTarget(activeStep.value);
  if (!target) {
    state.spotlightRect = null;
    return;
  }
  const rect = target.getBoundingClientRect();
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const isInViewport =
    rect.top >= 0 && rect.left >= 0 && rect.bottom <= viewportHeight && rect.right <= viewportWidth;
  if (!isInViewport && 'scrollIntoView' in target) {
    target.scrollIntoView({ behavior: 'auto', block: 'center' });
  }
  const measured = target.getBoundingClientRect();
  const padding = finalPadding.value;
  const nextRect = new DOMRect(
    measured.x - padding,
    measured.y - padding,
    measured.width + padding * 2,
    measured.height + padding * 2,
  );
  measureFrame = requestAnimationFrame(() => {
    measureFrame = undefined;
    if (!destroyed) state.spotlightRect = nextRect;
  });
}

function normalizeButtonOverrides(buttonProps?: UserGuideButtonProps): Record<string, unknown> {
  const overrides = { ...buttonProps } as Record<string, unknown>;
  delete overrides.content;
  const customClass = [overrides.class, overrides.className];
  delete overrides.className;
  if (customClass.some(Boolean)) overrides.class = customClass;
  return overrides;
}

function actionButtonBindings(
  kind: 'skip' | 'prev' | 'next',
  buttonProps?: UserGuideButtonProps,
): Record<string, unknown> {
  const overrides = normalizeButtonOverrides(buttonProps);
  const primaryStyle = { backgroundColor: 'var(--semi-color-fill-2)' };
  const defaults =
    kind === 'skip'
      ? {
          style: isPrimary.value ? primaryStyle : {},
          theme: isPrimary.value ? 'solid' : 'light',
          type: isPrimary.value ? 'primary' : 'tertiary',
          onClick: () => foundation.handleSkip(),
        }
      : kind === 'prev'
        ? {
            style: isPrimary.value ? primaryStyle : {},
            theme: isPrimary.value ? 'solid' : 'light',
            type: isPrimary.value ? 'primary' : 'tertiary',
            onClick: () => foundation.handlePrev(),
          }
        : {
            style: isPrimary.value ? { backgroundColor: '#FFF' } : {},
            theme: isPrimary.value ? 'borderless' : 'solid',
            type: 'primary',
            onClick: () => foundation.handleNext(),
          };
  return { ...defaults, ...overrides };
}

const popupSkipBindings = computed(() => actionButtonBindings('skip'));
const popupPrevBindings = computed(() => actionButtonBindings('prev', props.prevButtonProps));
const popupNextBindings = computed(() => actionButtonBindings('next', props.nextButtonProps));
const modalSkipBindings = computed(() => ({
  type: 'tertiary',
  onClick: () => foundation.handleSkip(),
}));
const modalPrevBindings = computed(() => ({
  type: 'tertiary',
  onClick: () => foundation.handlePrev(),
  ...normalizeButtonOverrides(props.prevButtonProps),
}));
const modalNextBindings = computed(() => ({
  theme: 'solid',
  onClick: () => foundation.handleNext(),
  ...normalizeButtonOverrides(props.nextButtonProps),
}));

function beginShow(): void {
  if (!isControlled.value) state.current = userGuideNumbers.DEFAULT_CURRENT;
  foundation.beforeShow();
  activeCycle = true;
  updateSpotlightRect();
}

function finishHide(): void {
  cancelMeasure();
  state.spotlightRect = null;
  if (activeCycle) foundation.afterHide();
  activeCycle = false;
}

onMounted(() => {
  mounted = true;
  scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
  foundation.init();
  if (runtimeVisible.value && runtimeSteps.value.length > 0) updateSpotlightRect();
});
watch(runtimeVisible, (visible, previous) => {
  if (!mounted || visible === previous) return;
  if (visible && runtimeSteps.value.length > 0) beginShow();
  else finishHide();
});
watch(
  [current, activeStep, runtimeMode],
  () => {
    if (mounted && runtimeVisible.value) void nextTick(updateSpotlightRect);
  },
  { flush: 'post' },
);
onBeforeUnmount(() => {
  destroyed = true;
  cancelMeasure();
  foundation.destroy();
});
</script>

<template>
  <template v-if="runtimeVisible && runtimeSteps.length > 0 && activeStep">
    <template v-if="runtimeMode === 'popup' && state.spotlightRect">
      <Popover
        :class="popupClass"
        :position="activeStep.position || runtimePosition"
        :re-pos-key="current"
        :show-arrow="activeStep.showArrow !== false"
        :style="popupStyle"
        trigger="custom"
        :visible="true"
      >
        <template #content>
          <UserGuidePopupContent
            :cover="coverContent"
            :current="current"
            :description="descriptionContent"
            :is-first="isFirst"
            :is-last="isLast"
            :is-primary="isPrimary"
            :locale="locale"
            :next-bindings="popupNextBindings"
            :next-text="nextText"
            :prev-bindings="popupPrevBindings"
            :prev-text="prevText"
            :show-prev-button="showPrevButton"
            :show-skip-button="showSkipButton"
            :skip-bindings="popupSkipBindings"
            :step-count="runtimeSteps.length"
            :title="titleContent"
          />
        </template>
        <div :style="triggerStyle" />
      </Popover>

      <svg class="semi-userGuide-spotlight" :style="{ zIndex }">
        <defs>
          <mask :id="spotlightMaskId">
            <rect width="100%" height="100%" fill="white" />
            <rect
              class="semi-userGuide-spotlight-rect"
              :x="state.spotlightRect.x"
              :y="state.spotlightRect.y"
              :width="state.spotlightRect.width"
              :height="state.spotlightRect.height"
              rx="4"
              fill="black"
            />
          </mask>
        </defs>
        <template v-if="runtimeMask">
          <rect
            width="100%"
            height="100%"
            fill="var(--semi-color-overlay-bg)"
            :mask="`url(#${spotlightMaskId})`"
          />
          <rect
            x="0"
            y="0"
            width="100%"
            :height="state.spotlightRect.y"
            fill="transparent"
            class="semi-userGuide-spotlight-transparent-rect"
          />
          <rect
            x="0"
            :y="state.spotlightRect.y"
            :width="state.spotlightRect.x"
            :height="state.spotlightRect.height"
            fill="transparent"
            class="semi-userGuide-spotlight-transparent-rect"
          />
          <rect
            :x="state.spotlightRect.x + state.spotlightRect.width"
            :y="state.spotlightRect.y"
            :width="`calc(100% - ${state.spotlightRect.x + state.spotlightRect.width}px)`"
            :height="state.spotlightRect.height"
            fill="transparent"
            class="semi-userGuide-spotlight-transparent-rect"
          />
          <rect
            x="0"
            :y="state.spotlightRect.y + state.spotlightRect.height"
            width="100%"
            :height="`calc(100% - ${state.spotlightRect.y + state.spotlightRect.height}px)`"
            fill="transparent"
            class="semi-userGuide-spotlight-transparent-rect"
          />
        </template>
      </svg>
    </template>

    <Modal
      v-else-if="runtimeMode === 'modal'"
      :body-style="{ padding: 0 }"
      centered
      class="semi-userGuide-modal"
      :footer="null"
      :header="null"
      :mask="runtimeMask"
      :mask-closable="false"
      :visible="true"
    >
      <UserGuideModalContent
        :cover="coverContent"
        :current="current"
        :description="descriptionContent"
        :is-first="isFirst"
        :is-last="isLast"
        :locale="locale"
        :next-bindings="modalNextBindings"
        :next-text="nextText"
        :prev-bindings="modalPrevBindings"
        :prev-text="prevText"
        :show-prev-button="showPrevButton"
        :show-skip-button="showSkipButton"
        :skip-bindings="modalSkipBindings"
        :step-count="runtimeSteps.length"
        :title="titleContent"
      />
    </Modal>
  </template>
</template>
