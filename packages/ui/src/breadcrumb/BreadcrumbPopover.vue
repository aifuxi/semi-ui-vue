<script setup lang="ts">
import type { VNodeChild } from 'vue';

import Tooltip from '../tooltip/Tooltip.vue';

import BreadcrumbNodeRenderer from './BreadcrumbNodeRenderer';
import BreadcrumbPopoverArrow from './BreadcrumbPopoverArrow.vue';

defineOptions({ name: 'BreadcrumbPopover' });
defineProps<{ content: VNodeChild }>();
</script>

<template>
  <Tooltip
    :arrow-bounding="{ width: 24, height: 8, offsetX: 0, offsetY: 6 }"
    auto-adjust-overflow
    close-on-esc
    disable-focus-listener
    guard-focus
    position="bottom"
    prefix-cls="semi-popover"
    return-focus-on-close
    :show-arrow="true"
    :spacing="10"
    :style="{ padding: '12px' }"
    trigger="hover"
    :z-index="1030"
  >
    <slot />
    <template #content>
      <div class="semi-popover">
        <div class="semi-popover-content">
          <BreadcrumbNodeRenderer :content="content" />
        </div>
      </div>
    </template>
    <template #arrow><BreadcrumbPopoverArrow /></template>
  </Tooltip>
</template>
