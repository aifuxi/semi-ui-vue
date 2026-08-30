import type { DefineComponent } from 'vue';

import ColorPickerBase, { colorStringToValue } from './ColorPicker.vue';
import type { ColorPickerProps, ColorValue } from './types';

export type ColorPickerComponent = DefineComponent<ColorPickerProps> & {
  colorStringToValue(raw: string): ColorValue;
};

export const ColorPicker = Object.assign(ColorPickerBase, {
  colorStringToValue,
}) as unknown as ColorPickerComponent;

export type {
  AnyColor,
  ColorModel,
  ColorPickerEmits,
  ColorPickerFormat,
  ColorPickerProps,
  ColorPickerSlots,
  ColorValue,
  HslColor,
  HslaColor,
  HsvColor,
  HsvaColor,
  ObjectColor,
  RgbColor,
  RgbaColor,
} from './types';

export { colorStringToValue };
export default ColorPicker;
