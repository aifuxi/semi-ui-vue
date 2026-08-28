<script setup lang="ts">
import { computed } from 'vue';

import Tooltip from '../tooltip/Tooltip.vue';
import type { TooltipPosition } from '../tooltip';

const props = withDefaults(
  defineProps<{
    position?: TooltipPosition;
    rePosKey?: number | undefined;
    zIndex?: number;
  }>(),
  { position: 'bottom', rePosKey: undefined, zIndex: 1030 },
);
const tooltipBindings = computed(() => ({
  position: props.position,
  ...(props.rePosKey === undefined ? {} : { rePosKey: props.rePosKey }),
  zIndex: props.zIndex,
}));
</script>

<template>
  <Tooltip
    v-bind="tooltipBindings"
    auto-adjust-overflow
    guard-focus
    prefix-cls="semi-popover"
    role="tooltip"
    :show-arrow="false"
    :spacing="4"
    trigger="hover"
  >
    <slot />
    <template #content>
      <div class="semi-popover">
        <div class="semi-popover-content"><slot name="content" /></div>
      </div>
    </template>
  </Tooltip>
</template>
