<script setup lang="ts">
import { computed, inject } from 'vue';

import { configContextKey, type ConfigContextValue } from '../config-provider';
import Tooltip from '../tooltip/Tooltip.vue';
import type { TooltipProps } from '../tooltip/types';
import type { TagInputRestPopoverProps } from './types';

const props = defineProps<{
  disabled?: boolean;
  popoverProps?: TagInputRestPopoverProps | undefined;
  restCount: number;
}>();
const injectedConfig = inject(configContextKey, undefined);
const config = computed<ConfigContextValue>(() =>
  injectedConfig
    ? injectedConfig.value
    : ({ direction: 'ltr', getPopupContainer: undefined } as ConfigContextValue),
);
const tooltipProps = computed<TooltipProps>(() => {
  const output: TooltipProps = {
    autoAdjustOverflow: props.popoverProps?.autoAdjustOverflow ?? true,
    mouseEnterDelay: props.popoverProps?.mouseEnterDelay ?? 50,
    mouseLeaveDelay: props.popoverProps?.mouseLeaveDelay ?? 50,
    position: props.popoverProps?.position ?? 'top',
    prefixCls: 'semi-popover',
    role: 'dialog',
    zIndex: props.popoverProps?.zIndex ?? 1030,
  };
  const popupContainer = props.popoverProps?.getPopupContainer ?? config.value.getPopupContainer;
  if (popupContainer) output.getPopupContainer = popupContainer;
  if (props.popoverProps?.className !== undefined) output.class = props.popoverProps.className;
  if (props.popoverProps?.style !== undefined) output.style = props.popoverProps.style;
  return output;
});
</script>

<template>
  <Tooltip v-bind="tooltipProps">
    <template #content
      ><div class="semi-popover-content"><slot /></div
    ></template>
    <span
      :class="[
        'semi-tagInput-wrapper-n',
        props.disabled ? 'semi-tagInput-wrapper-n-disabled' : undefined,
      ]"
      >+{{ props.restCount }}</span
    >
  </Tooltip>
</template>
