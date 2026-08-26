<script setup lang="ts">
import { computed, useAttrs } from 'vue';

import FloatButtonBadge from './FloatButtonBadge.vue';
import FloatButtonNodeRenderer from './FloatButtonNodeRenderer';
import type { FloatButtonEmits, FloatButtonProps, FloatButtonSlots } from './types';

defineOptions({
  name: 'FloatButton',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<FloatButtonProps>(), {
  colorful: false,
  disabled: false,
  shape: 'round',
  size: 'default',
});
const emit = defineEmits<FloatButtonEmits>();
defineSlots<FloatButtonSlots>();

const attrs = useAttrs();
const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([attributeName]) => !['class', 'style'].includes(attributeName)),
  ),
);
const rootClasses = computed(() => [
  'semi-floatButton',
  `semi-floatButton-${props.size}`,
  `semi-floatButton-${props.shape}`,
  attrs.class,
]);
const bodyClasses = computed(() => [
  'semi-floatButton-body',
  `semi-floatButton-${props.shape}`,
  props.colorful ? 'semi-floatButton-colorful' : null,
  props.disabled ? 'semi-floatButton-disabled' : null,
  `semi-floatButton-${props.size}`,
]);

function handleClick(event: MouseEvent): void {
  if (props.disabled) return;

  if (props.href && typeof window !== 'undefined') {
    if (props.target === '_blank') {
      window.open(props.href, '_blank');
    } else {
      window.location.href = props.href;
    }
  }

  emit('click', event);
}
</script>

<template>
  <div v-bind="rootAttrs" :class="rootClasses" :style="attrs.style" @click="handleClick">
    <FloatButtonBadge v-if="props.badge" v-bind="props.badge">
      <div :class="bodyClasses">
        <slot name="icon">
          <FloatButtonNodeRenderer :content="props.icon" />
        </slot>
      </div>
    </FloatButtonBadge>
    <div v-else :class="bodyClasses">
      <slot name="icon">
        <FloatButtonNodeRenderer :content="props.icon" />
      </slot>
    </div>
  </div>
</template>
