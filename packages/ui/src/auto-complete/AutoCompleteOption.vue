<script setup lang="ts">
import { computed, useAttrs } from 'vue';

import type { AutoCompleteOptionProps } from './types';

defineOptions({ name: 'AutoCompleteOption', inheritAttrs: false });
const props = defineProps<AutoCompleteOptionProps>();
const attrs = useAttrs();
const emit = defineEmits<{
  mouseenter: [event: MouseEvent];
  select: [event: MouseEvent];
}>();

const classes = computed(() => [
  'semi-autocomplete-option',
  props.class,
  props.className,
  props.disabled ? 'semi-autocomplete-option-disabled' : undefined,
  props.selected ? 'semi-autocomplete-option-selected' : undefined,
  props.focused ? 'semi-autocomplete-option-focused' : undefined,
  props.empty ? 'semi-autocomplete-option-empty' : undefined,
]);

function select(event: MouseEvent): void {
  if (!props.disabled && !props.empty) emit('select', event);
}
</script>

<template>
  <div
    v-bind="attrs"
    :class="classes"
    :style="props.style"
    role="option"
    :aria-selected="props.selected ? 'true' : 'false'"
    :aria-disabled="props.disabled ? 'true' : 'false'"
    @click="select"
    @mouseenter="emit('mouseenter', $event)"
  >
    <div v-if="props.showTick" class="semi-autocomplete-option-icon" />
    <slot />
  </div>
</template>
