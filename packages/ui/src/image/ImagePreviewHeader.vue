<script setup lang="ts">
import { IconClose } from '@workspace/icons';
import { computed, useSlots, useTemplateRef, type VNodeChild } from 'vue';

import ImageNodeRenderer from './ImageNodeRenderer';

const props = defineProps<{
  className?: string | undefined;
  closable: boolean;
  renderCloseIcon?: VNodeChild | (() => VNodeChild) | undefined;
  renderHeader?: ((title: VNodeChild) => VNodeChild) | undefined;
  title?: VNodeChild | undefined;
}>();
const emit = defineEmits<{ close: [event: MouseEvent] }>();
const slots = useSlots();
const root = useTemplateRef<HTMLElement>('root');
const headerContent = computed(
  () => slots.header?.({ title: props.title }) ?? props.renderHeader?.(props.title) ?? props.title,
);
const closeContent = computed(
  () =>
    slots.closeIcon?.() ??
    (typeof props.renderCloseIcon === 'function' ? props.renderCloseIcon() : props.renderCloseIcon),
);

defineExpose({ element: root });
</script>

<template>
  <section ref="root" :class="['semi-image-preview-header', props.className]">
    <section class="semi-image-preview-header-title">
      <ImageNodeRenderer :content="headerContent" />
    </section>
    <section
      v-if="props.closable"
      class="semi-image-preview-header-close"
      @mouseup="emit('close', $event)"
    >
      <ImageNodeRenderer v-if="closeContent" :content="closeContent" />
      <IconClose v-else />
    </section>
  </section>
</template>
