<script setup lang="ts">
import { computed, inject } from 'vue';

import { dropdownContextKey } from './dropdown-context';
import type { DropdownTitleProps, DropdownTitleSlots } from './types';

defineOptions({ name: 'DropdownTitle' });
defineProps<DropdownTitleProps>();
defineSlots<DropdownTitleSlots>();
const context = inject(dropdownContextKey, undefined);
const showTick = computed(() => context?.showTick.value ?? false);
</script>

<template>
  <div
    :class="[
      'semi-dropdown-title',
      showTick ? 'semi-dropdown-title-withTick' : undefined,
      $props.class,
    ]"
    :style="$props.style"
  >
    <slot />
  </div>
</template>
