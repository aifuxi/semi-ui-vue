<script setup lang="ts">
import { computed, useAttrs, useSlots, type CSSProperties, type VNode } from 'vue';

import ButtonAiLoadingIcon from './ButtonAiLoadingIcon.vue';
import ButtonIconRenderer from './ButtonIconRenderer';
import ButtonLoadingIcon from './ButtonLoadingIcon.vue';
import type { ButtonEmits, ButtonIconFill, ButtonProps, ButtonSlots } from './types';

defineOptions({
  name: 'Button',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ButtonProps>(), {
  block: false,
  circle: false,
  colorful: false,
  disabled: false,
  htmlType: 'button',
  iconPosition: 'left',
  loading: false,
  noHorizontalPadding: false,
  prefixCls: 'semi-button',
  size: 'default',
  theme: 'light',
  type: 'primary',
});
const emit = defineEmits<ButtonEmits>();
const slots = defineSlots<ButtonSlots>();
const runtimeSlots = useSlots();
const attrs = useAttrs();

const hasDefaultContent = computed(() => Boolean(runtimeSlots.default));
const usesIconLayout = computed(
  () => Boolean(runtimeSlots.icon) || (props.loading && !props.disabled),
);
const isIconOnly = computed(() => usesIconLayout.value && !hasDefaultContent.value);
const usesAiLoadingIcon = computed(
  () =>
    (props.colorful && ['light', 'outline', 'borderless'].includes(props.theme)) ||
    (props.theme === 'solid' && props.type === 'tertiary'),
);

const buttonClasses = computed(() => [
  props.prefixCls,
  props.disabled ? `${props.prefixCls}-disabled` : `${props.prefixCls}-${props.type}`,
  props.disabled ? `${props.prefixCls}-${props.type}-disabled` : null,
  props.size === 'large' ? `${props.prefixCls}-size-large` : null,
  props.size === 'small' ? `${props.prefixCls}-size-small` : null,
  props.block ? `${props.prefixCls}-block` : null,
  props.circle ? `${props.prefixCls}-circle` : null,
  `${props.prefixCls}-${props.theme}`,
  props.colorful ? `${props.prefixCls}-colorful` : null,
  usesIconLayout.value ? `${props.prefixCls}-with-icon` : null,
  isIconOnly.value ? `${props.prefixCls}-with-icon-only` : null,
  usesIconLayout.value && props.loading ? `${props.prefixCls}-loading` : null,
  attrs.class,
]);

const rootAttrs = computed(() => {
  return Object.fromEntries(
    Object.entries(attrs).filter(([attributeName]) => !['class', 'style'].includes(attributeName)),
  );
});

const horizontalPaddingStyle = computed<CSSProperties>(() => {
  if (!usesIconLayout.value) return {};

  const padding = props.noHorizontalPadding;
  const removesLeft =
    padding === true || padding === 'left' || (Array.isArray(padding) && padding.includes('left'));
  const removesRight =
    padding === true ||
    padding === 'right' ||
    (Array.isArray(padding) && padding.includes('right'));

  return {
    ...(removesLeft ? { paddingLeft: 0 } : {}),
    ...(removesRight ? { paddingRight: 0 } : {}),
  };
});

const buttonStyle = computed(() => [horizontalPaddingStyle.value, attrs.style]);
const contentTextClass = computed(() =>
  props.iconPosition === 'right'
    ? `${props.prefixCls}-content-left`
    : `${props.prefixCls}-content-right`,
);

const iconFill = computed<ButtonIconFill | undefined>(() => {
  if (!props.colorful) return undefined;

  const multipleColor =
    (props.theme === 'solid' && props.type === 'tertiary') ||
    (props.type === 'primary' && ['light', 'borderless'].includes(props.theme));
  const twoColor =
    props.type === 'tertiary' && ['light', 'borderless', 'outline'].includes(props.theme);

  if (multipleColor) {
    return props.disabled
      ? Array.from({ length: 4 }, () => 'var(--semi-color-disabled-text)')
      : [
          'var(--semi-button-colorful-multiple-fill-0)',
          'var(--semi-button-colorful-multiple-fill-1)',
          'var(--semi-button-colorful-multiple-fill-2)',
          'var(--semi-button-colorful-multiple-fill-3)',
        ];
  }
  if (twoColor) {
    return props.disabled
      ? Array.from({ length: 2 }, () => 'var(--semi-color-disabled-text)')
      : ['var(--semi-button-colorful-fill-primary)', 'var(--semi-button-colorful-fill-secondary)'];
  }
  return undefined;
});

const iconNodes = computed(
  () =>
    (slots.icon?.({
      fill: iconFill.value,
      iconSize: props.iconSize,
      iconStyle: props.iconStyle,
    }) ?? []) as VNode[],
);

function emitMouseEvent(eventName: keyof ButtonEmits, event: MouseEvent): void {
  if (props.disabled) return;
  switch (eventName) {
    case 'click':
      emit('click', event);
      break;
    case 'mousedown':
      emit('mousedown', event);
      break;
    case 'mouseenter':
      emit('mouseenter', event);
      break;
    case 'mouseleave':
      emit('mouseleave', event);
      break;
  }
}
</script>

<template>
  <button
    v-bind="rootAttrs"
    :disabled="props.disabled"
    :class="buttonClasses"
    :style="buttonStyle"
    :type="props.htmlType"
    :aria-disabled="props.disabled"
    @click="emitMouseEvent('click', $event)"
    @mousedown="emitMouseEvent('mousedown', $event)"
    @mouseenter="emitMouseEvent('mouseenter', $event)"
    @mouseleave="emitMouseEvent('mouseleave', $event)"
  >
    <span
      :class="[`${props.prefixCls}-content`, props.contentClass]"
      :x-semi-prop="usesIconLayout ? undefined : 'children'"
    >
      <template v-if="usesIconLayout">
        <template v-if="props.iconPosition === 'left'">
          <ButtonAiLoadingIcon
            v-if="props.loading && !props.disabled && usesAiLoadingIcon"
            :class="`${props.prefixCls}-content-loading-icon`"
          />
          <ButtonLoadingIcon v-else-if="props.loading && !props.disabled" />
          <ButtonIconRenderer
            v-else
            :nodes="iconNodes"
            v-bind="iconFill === undefined ? {} : { fill: iconFill }"
          />
        </template>

        <span v-if="hasDefaultContent" :class="contentTextClass" x-semi-prop="children">
          <slot />
        </span>

        <template v-if="props.iconPosition === 'right'">
          <ButtonAiLoadingIcon
            v-if="props.loading && !props.disabled && usesAiLoadingIcon"
            :class="`${props.prefixCls}-content-loading-icon`"
          />
          <ButtonLoadingIcon v-else-if="props.loading && !props.disabled" />
          <ButtonIconRenderer
            v-else
            :nodes="iconNodes"
            v-bind="iconFill === undefined ? {} : { fill: iconFill }"
          />
        </template>
      </template>
      <slot v-else />
    </span>
  </button>
</template>
