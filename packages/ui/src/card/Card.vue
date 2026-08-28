<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue';

import { Space } from '../space';
import { Title } from '../typography';
import CardNodeRenderer from './CardNodeRenderer';
import CardSkeleton from './CardSkeleton.vue';
import { hasCardContent } from './card-content';
import type { CardProps, CardSlots } from './types';

defineOptions({ name: 'Card', inheritAttrs: false });
const props = withDefaults(defineProps<CardProps>(), {
  bordered: true,
  footerLine: false,
  headerLine: true,
  loading: false,
});
defineSlots<CardSlots>();
const attrs = useAttrs();
const slots = useSlots();

const header = computed(() => slots.header?.() ?? props.header);
const title = computed(() => slots.title?.() ?? props.title);
const headerExtraContent = computed(() => slots.headerExtraContent?.() ?? props.headerExtraContent);
const cover = computed(() => slots.cover?.() ?? props.cover);
const body = computed(() => slots.default?.() ?? []);
const footer = computed(() => slots.footer?.() ?? props.footer);
const actions = computed(() => slots.actions?.() ?? props.actions ?? []);

const hasHeader = computed(() => hasCardContent(header.value));
const hasTitle = computed(() => hasCardContent(title.value));
const hasHeaderExtraContent = computed(() => hasCardContent(headerExtraContent.value));
const hasHeaderRegion = computed(
  () => hasHeader.value || hasTitle.value || hasHeaderExtraContent.value,
);
const hasCover = computed(() => hasCardContent(cover.value));
const hasBody = computed(() => hasCardContent(body.value));
const hasFooter = computed(() => hasCardContent(footer.value));
const hasActions = computed(() => Boolean(slots.actions) || Array.isArray(props.actions));
const titleIsStringProp = computed(
  () => !slots.title && typeof props.title === 'string' && Boolean(props.title),
);
const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([attributeName]) => !['class', 'style'].includes(attributeName)),
  ),
);
</script>

<template>
  <div
    v-bind="rootAttrs"
    :aria-busy="props.loading"
    class="semi-card"
    :class="[
      attrs.class,
      props.class,
      props.className,
      {
        'semi-card-bordered': props.bordered,
        'semi-card-shadows': props.shadows,
        [`semi-card-shadows-${props.shadows}`]: props.shadows,
      },
    ]"
    :style="[attrs.style, props.style]"
  >
    <div
      v-if="hasHeaderRegion"
      class="semi-card-header"
      :class="{ 'semi-card-header-bordered': props.headerLine }"
      :style="props.headerStyle"
    >
      <CardNodeRenderer v-if="hasHeader" :content="header" />
      <div v-else class="semi-card-header-wrapper">
        <div
          v-if="hasHeaderExtraContent"
          class="semi-card-header-wrapper-extra"
          x-semi-prop="headerExtraContent"
        >
          <CardNodeRenderer :content="headerExtraContent" />
        </div>
        <div
          v-if="hasTitle"
          class="semi-card-header-wrapper-title"
          :class="{ 'semi-card-header-wrapper-spacing': hasHeaderExtraContent }"
        >
          <Title
            v-if="titleIsStringProp"
            :ellipsis="{ showTooltip: true, rows: 1 }"
            :heading="6"
            x-semi-prop="title"
          >
            {{ props.title }}
          </Title>
          <CardNodeRenderer v-else :content="title" />
        </div>
      </div>
    </div>

    <div v-if="hasCover" class="semi-card-cover" x-semi-prop="cover">
      <CardNodeRenderer :content="cover" />
    </div>

    <div class="semi-card-body" :style="props.bodyStyle">
      <template v-if="hasBody">
        <CardSkeleton v-if="props.loading" />
        <CardNodeRenderer v-else :content="body" />
      </template>
      <div v-if="hasActions" class="semi-card-body-actions">
        <Space :spacing="12">
          <div
            v-for="(action, index) in actions"
            :key="index"
            class="semi-card-body-actions-item"
            :x-semi-prop="`actions.${index}`"
          >
            <CardNodeRenderer :content="action" />
          </div>
        </Space>
      </div>
    </div>

    <div
      v-if="hasFooter"
      class="semi-card-footer"
      :class="{ 'semi-card-footer-bordered': props.footerLine }"
      :style="props.footerStyle"
      x-semi-prop="footer"
    >
      <CardNodeRenderer :content="footer" />
    </div>
  </div>
</template>
