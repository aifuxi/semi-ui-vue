import ColorPickerBase, { colorStringToValue } from './ColorPicker.vue';
import type { ColorValue } from './types';

/** 保留 ColorPickerComponent 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export type ColorPickerComponent = typeof ColorPickerBase & {
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
