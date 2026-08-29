<script setup lang="ts">
import { popoverNumbers } from '@workspace/foundation-integration';
import { computed, getCurrentInstance, inject, useTemplateRef } from 'vue';

import { configContextKey, semiGlobal, type ConfigContextValue } from '../config-provider';
import { Tooltip, type TooltipExposed } from '../tooltip';
import TooltipNodeRenderer from '../tooltip/TooltipNodeRenderer';

import PopoverArrow from './PopoverArrow.vue';
import type { PopoverEmits, PopoverExposed, PopoverProps, PopoverSlots } from './types';

defineOptions({ name: 'Popover', inheritAttrs: false });
const props = defineProps<PopoverProps>();
const emit = defineEmits<PopoverEmits>();
defineSlots<PopoverSlots>();
const instance = getCurrentInstance();
const tooltipRef = useTemplateRef<TooltipExposed>('tooltip');
const injectedConfig = inject(configContextKey, undefined);
const config = computed<ConfigContextValue>(() =>
  injectedConfig
    ? injectedConfig.value
    : ({ direction: 'ltr', getPopupContainer: undefined } as ConfigContextValue),
);

function hasExplicitProp(key: keyof PopoverProps): boolean {
  const kebabKey = String(key).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  const rawProps = instance?.vnode.props;
  return Boolean(
    rawProps &&
    (Object.prototype.hasOwnProperty.call(rawProps, key) ||
      Object.prototype.hasOwnProperty.call(rawProps, kebabKey)),
  );
}

function resolveProp<Key extends keyof PopoverProps>(
  key: Key,
  fallback: NonNullable<PopoverProps[Key]>,
): NonNullable<PopoverProps[Key]> {
  const explicit = props[key];
  if (hasExplicitProp(key) && explicit !== undefined) {
    return explicit as NonNullable<PopoverProps[Key]>;
  }
  const globalValue = semiGlobal.config.overrideDefaultProps?.Popover?.[key];
  return (globalValue === undefined ? fallback : globalValue) as NonNullable<PopoverProps[Key]>;
}

const showArrow = computed(() => resolveProp('showArrow', false));
const runtimeProps = computed(() => ({
  arrowBounding: resolveProp('arrowBounding', { ...popoverNumbers.ARROW_BOUNDING }),
  arrowPointAtCenter: resolveProp('arrowPointAtCenter', true),
  autoAdjustOverflow: resolveProp('autoAdjustOverflow', true),
  clickToHide: resolveProp('clickToHide', false),
  closeOnEsc: resolveProp('closeOnEsc', true),
  condition: resolveProp('condition', true),
  disableArrowKeyDown: resolveProp('disableArrowKeyDown', false),
  disableFocusListener: resolveProp('disableFocusListener', true),
  guardFocus: resolveProp('guardFocus', true),
  keepDOM: resolveProp('keepDOM', false),
  margin: resolveProp('margin', 0),
  motion: resolveProp('motion', true),
  mouseEnterDelay: resolveProp('mouseEnterDelay', 50),
  mouseLeaveDelay: resolveProp('mouseLeaveDelay', 50),
  position: resolveProp('position', 'bottom'),
  prefixCls: resolveProp('prefixCls', 'semi-popover'),
  preventScroll: resolveProp('preventScroll', false),
  returnFocusOnClose: resolveProp('returnFocusOnClose', true),
  spacing: resolveProp(
    'spacing',
    showArrow.value ? popoverNumbers.SPACING_WITH_ARROW : popoverNumbers.SPACING,
  ),
  stopPropagation: resolveProp('stopPropagation', false),
  trigger: resolveProp('trigger', 'hover'),
  wrapWhenSpecial: resolveProp('wrapWhenSpecial', true),
  zIndex: resolveProp('zIndex', popoverNumbers.DEFAULT_Z_INDEX),
}));
const role = computed(() =>
  runtimeProps.value.trigger === 'click' || runtimeProps.value.trigger === 'custom'
    ? 'dialog'
    : 'tooltip',
);
const popupClass = computed(() => [props.class, props.className]);
const contentClass = computed(() => [
  runtimeProps.value.prefixCls,
  props.contentClassName,
  { [`${runtimeProps.value.prefixCls}-rtl`]: config.value.direction === 'rtl' },
]);
const tooltipOptionalProps = computed(() => ({
  ...(props.getPopupContainer ? { getPopupContainer: props.getPopupContainer } : {}),
  ...(props.rePosKey !== undefined ? { rePosKey: props.rePosKey } : {}),
  ...(hasExplicitProp('visible') ? { visible: props.visible } : {}),
  ...(props.wrapperClassName !== undefined ? { wrapperClassName: props.wrapperClassName } : {}),
  ...(props.wrapperId !== undefined ? { wrapperId: props.wrapperId } : {}),
}));

function focusTrigger(): void {
  tooltipRef.value?.focusTrigger();
}

defineExpose<PopoverExposed>({ focusTrigger });
</script>

<template>
  <Tooltip
    ref="tooltip"
    v-bind="tooltipOptionalProps"
    :arrow-bounding="runtimeProps.arrowBounding"
    :arrow-point-at-center="runtimeProps.arrowPointAtCenter"
    :auto-adjust-overflow="runtimeProps.autoAdjustOverflow"
    :class="popupClass"
    :click-to-hide="runtimeProps.clickToHide"
    :close-on-esc="runtimeProps.closeOnEsc"
    :condition="runtimeProps.condition"
    :disable-arrow-key-down="runtimeProps.disableArrowKeyDown"
    :disable-focus-listener="runtimeProps.disableFocusListener"
    :guard-focus="runtimeProps.guardFocus"
    :keep-d-o-m="runtimeProps.keepDOM"
    :margin="runtimeProps.margin"
    :motion="runtimeProps.motion"
    :mouse-enter-delay="runtimeProps.mouseEnterDelay"
    :mouse-leave-delay="runtimeProps.mouseLeaveDelay"
    :position="runtimeProps.position"
    :prefix-cls="runtimeProps.prefixCls"
    :prevent-scroll="runtimeProps.preventScroll"
    :return-focus-on-close="runtimeProps.returnFocusOnClose"
    :role="role"
    :show-arrow="showArrow"
    :spacing="runtimeProps.spacing"
    :stop-propagation="runtimeProps.stopPropagation"
    :style="props.style"
    :trigger="runtimeProps.trigger"
    :wrap-when-special="runtimeProps.wrapWhenSpecial"
    :z-index="runtimeProps.zIndex"
    @after-close="emit('afterClose')"
    @click-outside="emit('clickOutside', $event)"
    @esc-keydown="emit('escKeydown', $event)"
    @update:visible="emit('update:visible', $event)"
    @visible-change="emit('visibleChange', $event)"
  >
    <template #content="{ initialFocusRef }">
      <div :class="contentClass">
        <div :class="`${runtimeProps.prefixCls}-content`">
          <slot v-if="$slots.content" name="content" :initial-focus-ref="initialFocusRef" />
          <TooltipNodeRenderer v-else :content="props.content" />
        </div>
      </div>
    </template>
    <template v-if="showArrow" #arrow>
      <PopoverArrow
        :arrow-style="props.arrowStyle"
        :pop-style="props.style"
        :position="runtimeProps.position"
      />
    </template>
    <slot />
  </Tooltip>
</template>
