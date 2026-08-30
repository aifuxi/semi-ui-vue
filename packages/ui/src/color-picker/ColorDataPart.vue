<script setup lang="ts">
import {
  rgbaToHex,
  roundColorPickerValue,
  splitColorPickerInput,
} from '@workspace/foundation-integration';
import { IconEyedropper } from '@workspace/icons';
import { computed, onMounted, shallowRef, watch } from 'vue';

import { Button } from '../button';
import { Input, InputGroup } from '../input';
import { InputNumber } from '../input-number';
import { Select, type SelectPrimitive } from '../select';
import type { ColorPickerFormat, ColorValue, HsvaColor, RgbaColor } from './types';

interface Props {
  alpha: boolean;
  currentColor: ColorValue;
  defaultFormat: ColorPickerFormat;
  eyeDropper: boolean;
  width: number;
}

interface EyeDropperResult {
  sRGBHex: string;
}
interface EyeDropperInstance {
  open(): Promise<EyeDropperResult>;
}
type EyeDropperConstructor = new () => EyeDropperInstance;

const props = defineProps<Props>();
const emit = defineEmits<{
  change: [color: HsvaColor | RgbaColor | string, format: ColorPickerFormat];
}>();
const format = shallowRef<ColorPickerFormat>(props.defaultFormat);
const inputValue = shallowRef('');
const formatOptions = ['hex', 'rgba', 'hsva'].map((value) => ({ label: value, value }));
const demoColor = computed(() => {
  const { r, g, b, a } = props.currentColor.rgba;
  return `rgba(${r},${g},${b},${a})`;
});

function getInputValue(): string {
  if (format.value === 'rgba') {
    const { r, g, b } = props.currentColor.rgba;
    return `${r},${g},${b}`;
  }
  if (format.value === 'hsva') {
    const { h, s, v } = props.currentColor.hsva;
    return `${h},${s},${v}`;
  }
  return props.currentColor.hex.slice(0, 7);
}

function handleInput(value: string): void {
  let result: HsvaColor | RgbaColor | string | false = false;
  if (format.value === 'rgba' || format.value === 'hsva') {
    result = splitColorPickerInput(value, format.value) as HsvaColor | RgbaColor | false;
  } else {
    const normalized = value.startsWith('#') ? value : `#${value}`;
    if (/#[\d\w]{6,8}/.test(normalized)) result = normalized;
  }
  if (result) emit('change', result, format.value);
  inputValue.value = value;
}

function handleAlpha(value: number): void {
  const alpha = Number((value / 100).toFixed(2));
  if (format.value === 'rgba') {
    emit('change', { ...props.currentColor.rgba, a: alpha }, 'rgba');
  } else if (format.value === 'hsva') {
    emit('change', { ...props.currentColor.hsva, a: alpha }, 'hsva');
  } else {
    emit('change', rgbaToHex({ ...props.currentColor.rgba, a: alpha }), 'hex');
  }
}

function handleFormat(value: SelectPrimitive | undefined): void {
  if (value !== 'hex' && value !== 'rgba' && value !== 'hsva') return;
  format.value = value;
  inputValue.value = getInputValue();
}

async function handleEyeDropper(): Promise<void> {
  if (typeof window === 'undefined') return;
  const Constructor = (window as Window & { EyeDropper?: EyeDropperConstructor }).EyeDropper;
  if (!Constructor) return;
  try {
    const color = (await new Constructor().open()).sRGBHex;
    if (color.startsWith('#')) emit('change', color, 'hex');
  } catch {
    // The fixed Adapter silently ignores cancellation and browser failures.
  }
}

watch(
  () => props.currentColor,
  () => (inputValue.value = getInputValue()),
  { deep: true },
);
watch(
  () => props.defaultFormat,
  (value) => {
    format.value = value;
    inputValue.value = getInputValue();
  },
);
onMounted(() => (inputValue.value = getInputValue()));
</script>

<template>
  <div class="semi-colorPicker-dataPart" :style="{ width: `${props.width}px` }">
    <div
      class="semi-colorPicker-colorDemoBlock"
      :style="{ minWidth: '20px', minHeight: '20px', backgroundColor: demoColor }"
    />
    <InputGroup size="small" class-name="semi-colorPicker-inputGroup">
      <Input
        class-name="semi-colorPicker-colorPickerInput"
        :value="inputValue"
        @change="handleInput"
      />
      <InputNumber
        v-if="props.alpha"
        :min="0"
        :max="100"
        class-name="semi-colorPicker-colorPickerInputNumber"
        :value="Number(roundColorPickerValue(props.currentColor.rgba.a * 100))"
        :hide-buttons="true"
        @number-change="handleAlpha"
      >
        <template #suffix>
          <span class="semi-colorPicker-inputNumberSuffix">%</span>
        </template>
      </InputNumber>
      <Select
        class="semi-colorPicker-formatSelect"
        size="small"
        :value="format"
        :option-list="formatOptions"
        @select="handleFormat"
      />
    </InputGroup>
    <Button
      v-if="props.eyeDropper"
      type="tertiary"
      theme="light"
      size="small"
      @click="handleEyeDropper"
    >
      <template #icon><IconEyedropper /></template>
    </Button>
  </div>
</template>
