<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  provide,
  shallowReactive,
  useAttrs,
  type CSSProperties,
} from 'vue';

import { gridRowContextKey } from './grid-context';
import { registerGridMediaQuery } from './media-query';
import {
  GRID_BREAKPOINTS,
  GRID_RESPONSIVE_MAP,
  GRID_RESPONSIVE_PRIORITY,
  type GridBreakpoint,
  type GridGutter,
  type GridGutters,
  type GridSlots,
  type RowProps,
} from './types';

defineOptions({
  name: 'Row',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<RowProps>(), {
  prefixCls: 'semi',
  gutter: 0,
});
defineSlots<GridSlots>();

const attrs = useAttrs();
const screens = shallowReactive<Record<GridBreakpoint, boolean>>({
  xs: true,
  sm: true,
  md: true,
  lg: true,
  xl: true,
  xxl: true,
});
const unRegisters: Array<() => void> = [];

function resolveGutter(gutter: GridGutter | undefined): number {
  if (typeof gutter === 'number') return gutter || 0;
  if (!gutter) return 0;

  for (const breakpoint of GRID_RESPONSIVE_PRIORITY) {
    const value = gutter[breakpoint];
    if (screens[breakpoint] && value !== undefined) return value;
  }
  return 0;
}

const gutters = computed<GridGutters>(() => {
  const normalized = Array.isArray(props.gutter) ? props.gutter.slice(0, 2) : [props.gutter, 0];
  return [resolveGutter(normalized[0]), resolveGutter(normalized[1])];
});

provide(gridRowContextKey, { gutters });

const rowClasses = computed(() => {
  const prefix = `${props.prefixCls}-row`;
  return [
    props.type === 'flex' ? `${prefix}-flex` : prefix,
    props.type && props.justify ? `${prefix}-${props.type}-${props.justify}` : undefined,
    props.type && props.align ? `${prefix}-${props.type}-${props.align}` : undefined,
    attrs.class,
  ];
});
const rowStyle = computed<CSSProperties>(() => ({
  ...(gutters.value[0] > 0
    ? {
        marginLeft: `${gutters.value[0] / -2}px`,
        marginRight: `${gutters.value[0] / -2}px`,
      }
    : {}),
  ...(gutters.value[1] > 0
    ? {
        marginTop: `${gutters.value[1] / -2}px`,
        marginBottom: `${gutters.value[1] / -2}px`,
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

onMounted(() => {
  for (const screen of GRID_BREAKPOINTS) {
    unRegisters.push(
      registerGridMediaQuery(GRID_RESPONSIVE_MAP[screen], (matches) => {
        if (typeof props.gutter !== 'object') return;
        screens[screen] = matches;
      }),
    );
  }
});

onBeforeUnmount(() => {
  for (const unRegister of unRegisters) unRegister();
});
</script>

<template>
  <div
    v-bind="rootAttrs"
    :class="rowClasses"
    :style="[rowStyle, attrs.style]"
    x-semi-prop="children"
  >
    <slot />
  </div>
</template>
