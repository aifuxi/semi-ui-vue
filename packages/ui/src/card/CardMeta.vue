<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue';

import CardNodeRenderer from './CardNodeRenderer';
import { hasCardContent } from './card-content';
import type { CardMetaProps, CardMetaSlots } from './types';

defineOptions({ name: 'CardMeta', inheritAttrs: false });
const props = defineProps<CardMetaProps>();
defineSlots<CardMetaSlots>();
const attrs = useAttrs();
const slots = useSlots();

const avatar = computed(() => slots.avatar?.() ?? props.avatar);
const title = computed(() => slots.title?.() ?? props.title);
const description = computed(() => slots.description?.() ?? props.description);
const hasAvatar = computed(() => hasCardContent(avatar.value));
const hasTitle = computed(() => hasCardContent(title.value));
const hasDescription = computed(() => hasCardContent(description.value));
const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([attributeName]) => !['class', 'style'].includes(attributeName)),
  ),
);
</script>

<template>
  <div
    v-bind="rootAttrs"
    class="semi-card-meta"
    :class="[attrs.class, props.class, props.className]"
    :style="[attrs.style, props.style]"
  >
    <div v-if="hasAvatar" class="semi-card-meta-avatar">
      <CardNodeRenderer :content="avatar" />
    </div>
    <div v-if="hasTitle || hasDescription" class="semi-card-meta-wrapper">
      <div v-if="hasTitle" class="semi-card-meta-wrapper-title">
        <CardNodeRenderer :content="title" />
      </div>
      <div v-if="hasDescription" class="semi-card-meta-wrapper-description">
        <CardNodeRenderer :content="description" />
      </div>
    </div>
  </div>
</template>
