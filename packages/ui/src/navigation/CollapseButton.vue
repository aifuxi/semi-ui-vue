<script setup lang="ts">
import { IconSidebar } from '@aifuxi/semi-icons-vue';
import { computed } from 'vue';

import Button from '../button/Button.vue';
import Tooltip from '../tooltip/Tooltip.vue';
import NavigationNodeRenderer from './NavigationNodeRenderer';
import type { CollapseButtonEmits, CollapseButtonProps, NavigationContent } from './types';

defineOptions({ name: 'NavigationCollapseButton' });
const props = withDefaults(defineProps<CollapseButtonProps>(), {
  isCollapsed: false,
  locale: () => ({ collapseText: '收起侧边栏', expandText: '展开侧边栏' }),
  prefixCls: 'semi-navigation',
});
const emit = defineEmits<CollapseButtonEmits>();
const finalText = computed<NavigationContent>(() =>
  props.collapseText
    ? () => props.collapseText?.(props.isCollapsed)
    : props.isCollapsed
      ? props.locale.expandText
      : props.locale.collapseText,
);
</script>

<template>
  <div :class="`${props.prefixCls}-collapse-btn`">
    <Tooltip v-if="props.isCollapsed" position="right">
      <template #content><NavigationNodeRenderer :content="finalText" /></template>
      <span :class="`${props.prefixCls}-collapse-wrapper`">
        <Button theme="borderless" type="tertiary" @click="emit('click', !props.isCollapsed)">
          <template #icon><IconSidebar /></template>
        </Button>
      </span>
    </Tooltip>
    <Button v-else theme="borderless" type="tertiary" @click="emit('click', true)">
      <template #icon><IconSidebar /></template>
      <NavigationNodeRenderer :content="finalText" />
    </Button>
  </div>
</template>
