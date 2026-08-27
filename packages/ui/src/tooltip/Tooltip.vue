<script setup lang="ts">
import { computed, getCurrentInstance, inject, watch } from 'vue';

import { configContextKey, semiGlobal, type ConfigContextValue } from '../config-provider';

import TooltipPortal from './TooltipPortal.vue';
import TooltipTriggerRenderer from './TooltipTriggerRenderer';
import type {
  TooltipEmits,
  TooltipExposed,
  TooltipProps,
  TooltipRuntimeProps,
  TooltipSlots,
} from './types';
import { useTooltipFoundation } from './use-tooltip-foundation';

defineOptions({ name: 'Tooltip', inheritAttrs: false });
const props = defineProps<TooltipProps>();
const emit = defineEmits<TooltipEmits>();
defineSlots<TooltipSlots>();
const instance = getCurrentInstance();

const injectedConfig = inject(configContextKey, undefined);
const config = computed<ConfigContextValue>(() =>
  injectedConfig
    ? injectedConfig.value
    : ({
        direction: 'ltr',
        getPopupContainer: undefined,
      } as ConfigContextValue),
);

function resolveProp<Key extends keyof TooltipProps>(
  key: Key,
  fallback: NonNullable<TooltipProps[Key]>,
): NonNullable<TooltipProps[Key]> {
  const kebabKey = String(key).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  const rawProps = instance?.vnode.props;
  const isExplicit = Boolean(
    rawProps &&
    (Object.prototype.hasOwnProperty.call(rawProps, key) ||
      Object.prototype.hasOwnProperty.call(rawProps, kebabKey)),
  );
  const explicit = props[key];
  if (isExplicit && explicit !== undefined) {
    return explicit as NonNullable<TooltipProps[Key]>;
  }
  const globalValue = semiGlobal.config.overrideDefaultProps?.Tooltip?.[key];
  return (globalValue === undefined ? fallback : globalValue) as NonNullable<TooltipProps[Key]>;
}

const runtimeProps = computed(
  () =>
    ({
      ...props,
      arrowBounding: resolveProp('arrowBounding', {
        height: 7,
        offsetX: 0,
        offsetY: 2,
        width: 24,
      }) as Required<NonNullable<TooltipProps['arrowBounding']>>,
      arrowPointAtCenter: resolveProp('arrowPointAtCenter', true),
      autoAdjustOverflow: resolveProp('autoAdjustOverflow', true),
      class: props.class,
      closeOnEsc: resolveProp('closeOnEsc', false),
      condition: resolveProp('condition', true),
      disableArrowKeyDown: resolveProp('disableArrowKeyDown', false),
      disableFocusListener: resolveProp('disableFocusListener', false),
      guardFocus: resolveProp('guardFocus', false),
      keepDOM: resolveProp('keepDOM', false),
      margin: resolveProp('margin', 0),
      motion: resolveProp('motion', true),
      mouseEnterDelay: resolveProp('mouseEnterDelay', 50),
      mouseLeaveDelay: resolveProp('mouseLeaveDelay', 50),
      position: resolveProp('position', 'top'),
      prefixCls: resolveProp('prefixCls', 'semi-tooltip'),
      returnFocusOnClose: resolveProp('returnFocusOnClose', false),
      role: resolveProp('role', 'tooltip'),
      showArrow: resolveProp('showArrow', true),
      spacing: resolveProp('spacing', 8),
      style: props.style,
      transformFromCenter: resolveProp('transformFromCenter', true),
      trigger: resolveProp('trigger', 'hover'),
      wrapWhenSpecial: resolveProp('wrapWhenSpecial', true),
      zIndex: resolveProp('zIndex', 1060),
    }) as TooltipRuntimeProps,
);

const {
  animationEnd,
  animationStart,
  focusTrigger,
  handleContainerKeydown,
  hide,
  portalTarget,
  rePosition,
  setInitialFocusElement,
  setPortalElement,
  setTriggerElement,
  state,
} = useTooltipFoundation({
  config,
  onAfterClose: () => emit('afterClose'),
  onClickOutside: (event) => emit('clickOutside', event),
  onEscKeydown: (event) => emit('escKeydown', event),
  onVisibleChange: (visible) => {
    emit('visibleChange', visible);
    emit('update:visible', visible);
  },
  runtimeProps,
});

watch(
  () => [runtimeProps.value.mouseEnterDelay, runtimeProps.value.mouseLeaveDelay] as const,
  ([enterDelay, leaveDelay]) => {
    if (leaveDelay < enterDelay) {
      console.warn(
        "[Semi Tooltip] 'mouseLeaveDelay' cannot be less than 'mouseEnterDelay', which may cause the dropdown layer to not be hidden.",
      );
    }
  },
  { immediate: true },
);

function getPopupId(): string | undefined {
  return state.id;
}

defineExpose<TooltipExposed>({ focusTrigger, getPopupId, rePosition });
</script>

<template>
  <TooltipPortal
    v-if="state.isInsert && portalTarget"
    :click-to-hide="Boolean(runtimeProps.clickToHide)"
    :content="runtimeProps.content"
    :direction="config.direction"
    :initial-focus-ref="setInitialFocusElement"
    :motion="runtimeProps.motion"
    :popup-class="runtimeProps.class"
    :popup-style="runtimeProps.style"
    :portal-target="portalTarget"
    :prefix-cls="runtimeProps.prefixCls"
    :role="runtimeProps.role"
    :show-arrow="runtimeProps.showArrow"
    :state="state"
    :stop-propagation="Boolean(runtimeProps.stopPropagation)"
    @animation-start="animationStart"
    @animation-end="animationEnd"
    @hide="hide"
    @keydown="handleContainerKeydown"
    @portal-element="setPortalElement"
  >
    <template v-if="$slots.content" #content="{ initialFocusRef }">
      <slot name="content" :initial-focus-ref="initialFocusRef" />
    </template>
    <template v-if="$slots.arrow" #arrow><slot name="arrow" /></template>
  </TooltipPortal>

  <TooltipTriggerRenderer
    v-bind="state.id === undefined ? {} : { popupId: state.id }"
    :event-set="state.triggerEventSet"
    :role="runtimeProps.role"
    :set-trigger-element="setTriggerElement"
    :trigger="runtimeProps.trigger"
    :visible="state.visible"
    :wrap-when-special="runtimeProps.wrapWhenSpecial"
    :wrapper-class-name="runtimeProps.wrapperClassName"
  >
    <slot />
  </TooltipTriggerRenderer>
</template>
