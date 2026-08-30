<script setup lang="ts">
import {
  ColorPickerFoundation,
  hexToHsva,
  hexToRgba,
  hsvaStringToHsva,
  hsvaToHex,
  hsvaToRgba,
  rgbaStringToHsva,
  rgbaStringToRgba,
  rgbaToHex,
  rgbStringToHsva,
  rgbStringToRgba,
  type ColorPickerAdapter,
} from '@workspace/foundation-integration';
import {
  computed,
  getCurrentInstance,
  markRaw,
  onBeforeUnmount,
  onMounted,
  reactive,
  useAttrs,
  useSlots,
  type VNodeChild,
} from 'vue';

import { Popover, type PopoverProps } from '../popover';
import ColorPickerPanel from './ColorPickerPanel.vue';
import type {
  ColorPickerEmits,
  ColorPickerProps,
  ColorPickerSlots,
  ColorValue,
  HsvaColor,
  RgbaColor,
} from './types';

const DEFAULT_COLOR: ColorValue = {
  hsva: { h: 176, s: 71, v: 77, a: 1 },
  rgba: { r: 57, g: 197, b: 187, a: 1 },
  hex: '#39c5bb',
};

defineOptions({ name: 'ColorPicker', inheritAttrs: false });
const props = withDefaults(defineProps<ColorPickerProps>(), {
  alpha: true,
  defaultFormat: 'hex',
  defaultValue: () => ({
    hsva: { h: 176, s: 71, v: 77, a: 1 },
    rgba: { r: 57, g: 197, b: 187, a: 1 },
    hex: '#39c5bb',
  }),
  eyeDropper: true,
  height: 280,
  popoverProps: () => ({}),
  usePopover: false,
  width: 280,
});
const emit = defineEmits<ColorPickerEmits>();
defineSlots<ColorPickerSlots>();
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();

function hasRawProp(name: string): boolean {
  const raw = instance?.vnode.props;
  const kebab = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    raw &&
    (Object.prototype.hasOwnProperty.call(raw, name) ||
      Object.prototype.hasOwnProperty.call(raw, kebab)),
  );
}

const modelControlled = computed(() => hasRawProp('modelValue'));
const valueControlled = computed(() => hasRawProp('value'));
const controlled = computed(() => modelControlled.value || valueControlled.value);
const incomingValue = computed<ColorValue | undefined>(() =>
  modelControlled.value ? props.modelValue : valueControlled.value ? props.value : undefined,
);
const state = reactive({
  currentColor: incomingValue.value ?? props.defaultValue ?? DEFAULT_COLOR,
});
const cache = new Map<unknown, unknown>();

type FoundationProps = ColorPickerProps & { value?: ColorValue };
type FoundationState = { currentColor: ColorValue };
function runtimeProps(): FoundationProps {
  const output = { ...props } as FoundationProps;
  if (controlled.value && incomingValue.value !== undefined) output.value = incomingValue.value;
  else delete output.value;
  return output;
}
const adapter: ColorPickerAdapter<FoundationProps, FoundationState> = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key) => runtimeProps()[key],
  getProps: runtimeProps,
  getState: (key) => state[key],
  getStates: () => state,
  setState: (nextState, callback) => {
    Object.assign(state, nextState);
    callback?.();
  },
  getCache: (key) => cache.get(key),
  getCaches: () => cache,
  setCache: (key, value) => cache.set(key, value),
  stopPropagation: (event) => event?.stopPropagation?.(),
  persistEvent: () => undefined,
  notifyChange: (value) => {
    const publicValue = value as ColorValue;
    emit('change', publicValue);
    emit('update:modelValue', publicValue);
    emit('update:value', publicValue);
  },
};
const foundation = markRaw(new ColorPickerFoundation(adapter));
const currentColor = computed(() => foundation.getCurrentColor() as ColorValue);
const pickerClasses = computed(() => [attrs.class, props.class, props.className]);
const pickerStyle = computed(() => [attrs.style, props.style]);
const popoverProps = computed(() => {
  const input = props.popoverProps as PopoverProps & Record<string, unknown>;
  const { class: _class, className: _className, content: _content, ...rest } = input;
  return rest;
});
const popoverClass = computed(() => [
  'semi-colorPicker-popover',
  props.popoverProps.class,
  props.popoverProps.className,
]);
const topContent = computed<VNodeChild>(() => slots.top?.() ?? props.topSlot);
const bottomContent = computed<VNodeChild>(() => slots.bottom?.() ?? props.bottomSlot);

function handleChange(color: HsvaColor | RgbaColor | string, format: 'hex' | 'rgba' | 'hsva') {
  foundation.handleChange(color, format);
}

onMounted(() => foundation.init());
onBeforeUnmount(() => foundation.destroy());
</script>

<template>
  <Popover v-if="props.usePopover" v-bind="popoverProps" :class="popoverClass">
    <template #content>
      <ColorPickerPanel
        :alpha="props.alpha"
        :bottom-slot="bottomContent"
        :class-list="pickerClasses"
        :current-color="currentColor"
        :default-format="props.defaultFormat"
        :eye-dropper="props.eyeDropper"
        :height="props.height"
        :style="pickerStyle"
        :top-slot="topContent"
        :width="props.width"
        @alpha-change="foundation.handleAlphaChangeByHandle({ a: $event })"
        @color-change="handleChange"
        @hue-change="foundation.handleColorChangeByHandle({ h: $event })"
      />
    </template>
    <slot>
      <div
        class="semi-colorPicker-popover-defaultChildren"
        :style="{ backgroundColor: currentColor.hex }"
      />
    </slot>
  </Popover>
  <ColorPickerPanel
    v-else
    :alpha="props.alpha"
    :bottom-slot="bottomContent"
    :class-list="pickerClasses"
    :current-color="currentColor"
    :default-format="props.defaultFormat"
    :eye-dropper="props.eyeDropper"
    :height="props.height"
    :style="pickerStyle"
    :top-slot="topContent"
    :width="props.width"
    @alpha-change="foundation.handleAlphaChangeByHandle({ a: $event })"
    @color-change="handleChange"
    @hue-change="foundation.handleColorChangeByHandle({ h: $event })"
  />
</template>

<script lang="ts">
export function colorStringToValue(raw: string): ColorValue {
  if (raw.startsWith('#')) {
    return { hsva: hexToHsva(raw), rgba: hexToRgba(raw), hex: raw };
  }
  if (raw.startsWith('rgba')) {
    const rgba = rgbaStringToRgba(raw);
    return { hsva: rgbaStringToHsva(raw), rgba, hex: rgbaToHex(rgba) };
  }
  if (raw.startsWith('rgb')) {
    const rgba = rgbStringToRgba(raw);
    return { hsva: rgbStringToHsva(raw), rgba, hex: rgbaToHex(rgba) };
  }
  if (raw.startsWith('hsv')) {
    const hsva = hsvaStringToHsva(raw);
    return { hsva, rgba: hsvaToRgba(hsva), hex: hsvaToHex(hsva) };
  }
  throw new Error(
    `Semi ColorPicker: error on static colorStringToValue method, input value is invalid: ${raw}`,
  );
}
</script>
