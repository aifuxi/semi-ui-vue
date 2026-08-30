import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

import type { PopoverProps } from '../popover';

export interface HsvColor {
  h: number;
  s: number;
  v: number;
}
export interface HsvaColor extends HsvColor {
  a: number;
}
export interface RgbColor {
  r: number;
  g: number;
  b: number;
}
export interface RgbaColor extends RgbColor {
  a: number;
}
export interface HslColor {
  h: number;
  s: number;
  l: number;
}
export interface HslaColor extends HslColor {
  a: number;
}
export type ObjectColor = RgbColor | HslColor | HsvColor | RgbaColor | HslaColor | HsvaColor;
export type AnyColor = string | ObjectColor;
export interface ColorModel<T extends AnyColor> {
  defaultColor: T;
  toHsva(defaultColor: T): HsvaColor;
  fromHsva(hsva: HsvaColor): T;
  equal(first: T, second: T): boolean;
}
export interface ColorValue {
  hsva: HsvaColor;
  rgba: RgbaColor;
  hex: string;
}
export type ColorPickerFormat = 'hex' | 'rgba' | 'hsva';

export interface ColorPickerProps {
  alpha?: boolean;
  bottomSlot?: VNodeChild;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  defaultFormat?: ColorPickerFormat;
  defaultValue?: ColorValue;
  eyeDropper?: boolean;
  height?: number;
  modelValue?: ColorValue;
  popoverProps?: PopoverProps;
  style?: StyleValue;
  topSlot?: VNodeChild;
  usePopover?: boolean;
  value?: ColorValue;
  width?: number;
}

export interface ColorPickerEmits {
  change: [value: ColorValue];
  'update:modelValue': [value: ColorValue];
  'update:value': [value: ColorValue];
}

export interface ColorPickerSlots {
  bottom?: () => VNodeChild;
  default?: () => VNodeChild;
  top?: () => VNodeChild;
}
