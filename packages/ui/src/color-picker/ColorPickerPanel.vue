<script setup lang="ts">
import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

import AlphaSlider from './AlphaSlider.vue';
import ColorChooseArea from './ColorChooseArea.vue';
import ColorDataPart from './ColorDataPart.vue';
import ColorPickerNodeRenderer from './ColorPickerNodeRenderer';
import ColorSlider from './ColorSlider.vue';
import type { ColorPickerFormat, ColorValue, HsvaColor, RgbaColor } from './types';

interface Props {
  alpha: boolean;
  bottomSlot?: VNodeChild;
  classList?: HTMLAttributes['class'];
  currentColor: ColorValue;
  defaultFormat: ColorPickerFormat;
  eyeDropper: boolean;
  height: number;
  style?: StyleValue;
  topSlot?: VNodeChild;
  width: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  alphaChange: [alpha: number];
  colorChange: [color: HsvaColor | RgbaColor | string, format: ColorPickerFormat];
  hueChange: [hue: number];
}>();

function forwardColorChange(
  color: HsvaColor | RgbaColor | string,
  format: ColorPickerFormat,
): void {
  emit('colorChange', color, format);
}
</script>

<template>
  <div :class="['semi-colorPicker', props.classList]" :style="props.style">
    <slot name="top"><ColorPickerNodeRenderer :content="props.topSlot" /></slot>
    <ColorChooseArea
      :hsva="props.currentColor.hsva"
      :handle-size="20"
      :width="props.width"
      :height="props.height"
      @change="
        emit(
          'colorChange',
          {
            s: $event.s,
            v: $event.v,
            a: props.currentColor.hsva.a,
            h: props.currentColor.hsva.h,
          },
          'hsva',
        )
      "
    />
    <ColorSlider
      :width="props.width"
      :height="10"
      :handle-size="18"
      :hue="props.currentColor.hsva.h"
      @change="emit('hueChange', $event)"
    />
    <AlphaSlider
      v-if="props.alpha"
      :width="props.width"
      :height="10"
      :handle-size="18"
      :hsva="props.currentColor.hsva"
      @change="emit('alphaChange', $event)"
    />
    <ColorDataPart
      :current-color="props.currentColor"
      :eye-dropper="props.eyeDropper"
      :alpha="props.alpha"
      :width="props.width"
      :default-format="props.defaultFormat"
      @change="forwardColorChange"
    />
    <slot name="bottom"><ColorPickerNodeRenderer :content="props.bottomSlot" /></slot>
  </div>
</template>
