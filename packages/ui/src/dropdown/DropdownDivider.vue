<script setup lang="ts">
import type { DropdownDividerProps } from './types';

defineOptions({ name: 'DropdownDivider' });
defineProps<DropdownDividerProps>();
</script>

<template>
  <div :class="['semi-dropdown-divider', $props.class]" :style="$props.style" />
</template>
