<script setup lang="ts">
import { computed, inject, useAttrs, type CSSProperties } from 'vue';

import { gridRowContextKey } from './grid-context';
import {
  GRID_BREAKPOINTS,
  type ColProps,
  type ColSize,
  type GridBreakpoint,
  type GridSlots,
} from './types';

defineOptions({
  name: 'Col',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ColProps>(), {
  prefixCls: 'semi',
});
defineSlots<GridSlots>();

const attrs = useAttrs();
const rowContext = inject(gridRowContextKey, null);
if (!rowContext) throw new Error('please make sure <Col> inside <Row>');

function resolveSize(screen: GridBreakpoint): ColSize {
  const value = props[screen];
  return typeof value === 'number' ? { span: value } : (value ?? {});
}

function hasDefinedValue(value: number | undefined): value is number {
  return value !== undefined;
}

const colClasses = computed(() => {
  const prefix = `${props.prefixCls}-col`;
  const classes: Array<string | undefined | unknown> = [
    prefix,
    hasDefinedValue(props.span) ? `${prefix}-${props.span}` : undefined,
    props.order ? `${prefix}-order-${props.order}` : undefined,
    props.offset ? `${prefix}-offset-${props.offset}` : undefined,
    props.push ? `${prefix}-push-${props.push}` : undefined,
    props.pull ? `${prefix}-pull-${props.pull}` : undefined,
    attrs.class,
  ];

  for (const screen of GRID_BREAKPOINTS) {
    const size = resolveSize(screen);
    if (hasDefinedValue(size.span)) classes.push(`${prefix}-${screen}-${size.span}`);
    if (hasDefinedValue(size.order)) classes.push(`${prefix}-${screen}-order-${size.order}`);
    if (hasDefinedValue(size.offset)) classes.push(`${prefix}-${screen}-offset-${size.offset}`);
    if (hasDefinedValue(size.push)) classes.push(`${prefix}-${screen}-push-${size.push}`);
    if (hasDefinedValue(size.pull)) classes.push(`${prefix}-${screen}-pull-${size.pull}`);
  }
  return classes;
});
const colStyle = computed<CSSProperties>(() => ({
  ...(rowContext.gutters.value[0] > 0
    ? {
        paddingLeft: `${rowContext.gutters.value[0] / 2}px`,
        paddingRight: `${rowContext.gutters.value[0] / 2}px`,
      }
    : {}),
  ...(rowContext.gutters.value[1] > 0
    ? {
        paddingTop: `${rowContext.gutters.value[1] / 2}px`,
        paddingBottom: `${rowContext.gutters.value[1] / 2}px`,
      }
    : {}),
}));
const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(
      ([attributeName]) => attributeName !== 'class' && attributeName !== 'style',
    ),
  ),
);
</script>

<template>
  <div
    v-bind="rootAttrs"
    :class="colClasses"
    :style="[colStyle, attrs.style]"
    x-semi-prop="children"
  >
    <slot />
  </div>
</template>
