<script setup lang="ts">
import { computed, useAttrs } from 'vue';

import FloatButtonBadge from './FloatButtonBadge.vue';
import FloatButtonNodeRenderer from './FloatButtonNodeRenderer';
import type { FloatButtonGroupEmits, FloatButtonGroupProps, FloatButtonGroupSlots } from './types';

defineOptions({
  name: 'FloatButtonGroup',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<FloatButtonGroupProps>(), {
  disabled: false,
});
const emit = defineEmits<FloatButtonGroupEmits>();
defineSlots<FloatButtonGroupSlots>();
const attrs = useAttrs();

const groupClasses = computed(() => [
  'semi-floatButtonGroup',
  props.disabled ? 'semi-floatButtonGroup-disabled' : null,
  attrs.class,
]);
const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([attributeName]) => !['class', 'style'].includes(attributeName)),
  ),
);

function handleClick(event: MouseEvent): void {
  const target = event.target;
  const value = target instanceof HTMLElement ? target.dataset.value : undefined;
  emit('click', value as string, event);
}
</script>

<template>
  <div v-bind="rootAttrs" :class="groupClasses" :style="attrs.style" @click="handleClick">
    <template v-for="(item, index) in props.items" :key="index">
      <FloatButtonBadge v-if="item.badge" v-bind="item.badge">
        <div class="semi-floatButtonGroup-item" :data-value="item.value">
          <slot name="item" :item="item" :index="index">
            <FloatButtonNodeRenderer :content="item.icon" />
            <FloatButtonNodeRenderer :content="item.content" />
          </slot>
        </div>
      </FloatButtonBadge>
      <div v-else class="semi-floatButtonGroup-item" :data-value="item.value">
        <slot name="item" :item="item" :index="index">
          <FloatButtonNodeRenderer :content="item.icon" />
          <FloatButtonNodeRenderer :content="item.content" />
        </slot>
      </div>
    </template>
  </div>
</template>
