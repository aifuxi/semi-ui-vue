<script setup lang="ts">
import { DropdownMenuFoundation } from '@workspace/foundation-integration';
import { inject, markRaw, useAttrs } from 'vue';

import { dropdownContextKey } from './dropdown-context';
import type { DropdownMenuProps, DropdownMenuSlots } from './types';

defineOptions({ name: 'DropdownMenu', inheritAttrs: false });
defineProps<DropdownMenuProps>();
defineSlots<DropdownMenuSlots>();
const attrs = useAttrs();
const context = inject(dropdownContextKey, undefined);
const foundation = markRaw(
  new DropdownMenuFoundation({
    getContext: (key: string) => (key === 'trigger' ? context?.trigger.value : undefined),
  }),
);

function forwardedAttrs(): Record<string, unknown> {
  return Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'onKeydown'));
}

function handleKeydown(event: KeyboardEvent): void {
  foundation.onMenuKeydown(event);
  const handler = attrs.onKeydown as
    ((event: KeyboardEvent) => void) | Array<(event: KeyboardEvent) => void> | undefined;
  if (Array.isArray(handler)) handler.forEach((entry) => entry(event));
  else handler?.(event);
}
</script>

<template>
  <ul
    v-bind="forwardedAttrs()"
    role="menu"
    aria-orientation="vertical"
    :class="['semi-dropdown-menu', $props.class]"
    :style="$props.style"
    @keydown="handleKeydown"
  >
    <slot />
  </ul>
</template>
