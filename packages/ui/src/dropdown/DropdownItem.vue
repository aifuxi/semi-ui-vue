<script setup lang="ts">
import { IconTick } from '@aifuxi/semi-icons-vue';
import { computed, inject } from 'vue';

import { dropdownContextKey } from './dropdown-context';
import DropdownNodeRenderer from './DropdownNodeRenderer';
import type { DropdownItemEmits, DropdownItemProps, DropdownItemSlots } from './types';

defineOptions({ name: 'DropdownItem', inheritAttrs: false });
const props = withDefaults(defineProps<DropdownItemProps>(), {
  active: false,
  disabled: false,
  hover: false,
  showTick: false,
});
const emit = defineEmits<DropdownItemEmits>();
defineSlots<DropdownItemSlots>();
const context = inject(dropdownContextKey, undefined);
const realShowTick = computed(() => context?.showTick.value ?? props.showTick);
const nested = computed(() => (context?.level ?? 0) !== 1);

function setElement(element: unknown): void {
  props.forwardRef?.(element instanceof HTMLLIElement ? element : null);
}

function mouseEvent(name: 'contextmenu' | 'mouseenter' | 'mouseleave', event: MouseEvent): void {
  if (props.disabled) return;
  if (name === 'contextmenu') emit('contextmenu', event);
  else if (name === 'mouseenter') emit('mouseenter', event);
  else emit('mouseleave', event);
}

function click(event: MouseEvent): void {
  if (!props.disabled && !nested.value) emit('click', event);
}

function mousedown(event: MouseEvent): void {
  if (!props.disabled && nested.value && event.button === 0) emit('click', event);
}
</script>

<template>
  <li
    v-bind="$attrs"
    :ref="setElement"
    role="menuitem"
    tabindex="-1"
    :aria-disabled="disabled"
    :class="[
      'semi-dropdown-item',
      disabled ? 'semi-dropdown-item-disabled' : undefined,
      hover ? 'semi-dropdown-item-hover' : undefined,
      realShowTick ? 'semi-dropdown-item-withTick' : undefined,
      type ? `semi-dropdown-item-${type}` : undefined,
      active ? 'semi-dropdown-item-active' : undefined,
      $props.class,
    ]"
    :style="$props.style"
    @click="click"
    @mousedown="mousedown"
    @mouseenter="mouseEvent('mouseenter', $event)"
    @mouseleave="mouseEvent('mouseleave', $event)"
    @contextmenu="mouseEvent('contextmenu', $event)"
    @keydown="emit('keydown', $event)"
  >
    <IconTick v-if="realShowTick" :style="active ? undefined : { color: 'transparent' }" />
    <div v-if="$slots.icon || icon" class="semi-dropdown-item-icon">
      <slot name="icon"><DropdownNodeRenderer :content="icon" /></slot>
    </div>
    <slot />
  </li>
</template>
