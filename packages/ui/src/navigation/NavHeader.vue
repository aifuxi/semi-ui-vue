<script setup lang="ts">
import { computed, inject } from 'vue';

import { navigationContextKey } from './navigation-context';
import NavigationNodeRenderer from './NavigationNodeRenderer';
import type { NavHeaderProps, NavHeaderSlots } from './types';

defineOptions({ name: 'NavHeader', inheritAttrs: false });
const props = withDefaults(defineProps<NavHeaderProps>(), { prefixCls: 'semi-navigation' });
defineSlots<NavHeaderSlots>();
const context = inject(navigationContextKey);
if (!context) throw new Error('please make sure <NavHeader> inside <Nav>');

const classes = computed(() => [
  props.class,
  props.className,
  'semi-navigation-header',
  context.isCollapsed.value ? 'semi-navigation-header-collapsed' : undefined,
]);
</script>

<template>
  <div :class="classes" :style="props.style">
    <a
      v-if="typeof props.link === 'string'"
      :class="`${props.prefixCls}-header-link`"
      :href="props.link"
      v-bind="props.linkOptions"
    >
      <i v-if="$slots.logo || props.logo" class="semi-navigation-header-logo">
        <slot name="logo"><NavigationNodeRenderer :content="props.logo" /></slot>
      </i>
      <span
        v-if="
          ($slots.text || (props.text !== null && props.text !== undefined)) &&
          !context.isCollapsed.value
        "
        class="semi-navigation-header-text"
      >
        <slot name="text"><NavigationNodeRenderer :content="props.text" /></slot>
      </span>
      <slot />
    </a>
    <template v-else>
      <i v-if="$slots.logo || props.logo" class="semi-navigation-header-logo">
        <slot name="logo"><NavigationNodeRenderer :content="props.logo" /></slot>
      </i>
      <span
        v-if="
          ($slots.text || (props.text !== null && props.text !== undefined)) &&
          !context.isCollapsed.value
        "
        class="semi-navigation-header-text"
      >
        <slot name="text"><NavigationNodeRenderer :content="props.text" /></slot>
      </span>
      <slot />
    </template>
  </div>
</template>
