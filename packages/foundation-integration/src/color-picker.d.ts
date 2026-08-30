interface DefaultAdapter<Props, State> {
  getContext(key: string): unknown;
  getContexts(): unknown;
  getProp(key: keyof Props): unknown;
  getProps(): Props;
  getState(key: keyof State): unknown;
  getStates(): State;
  setState<Key extends keyof State>(state: Pick<State, Key>, callback?: () => void): void;
  getCache(key: string): unknown;
  getCaches(): Map<unknown, unknown>;
  setCache(key: unknown, value: unknown): unknown;
  stopPropagation(event?: { stopPropagation?: () => void }): void;
  persistEvent(event?: unknown): void;
}

export interface FoundationHsvColor {
  h: number;
  s: number;
  v: number;
}
export interface FoundationHsvaColor extends FoundationHsvColor {
  a: number;
}
export interface FoundationRgbColor {
  r: number;
  g: number;
  b: number;
}
export interface FoundationRgbaColor extends FoundationRgbColor {
  a: number;
}
export interface FoundationHslColor {
  h: number;
  s: number;
  l: number;
}
export interface FoundationHslaColor extends FoundationHslColor {
  a: number;
}
export interface FoundationColorValue {
  hsva: FoundationHsvaColor;
  rgba: FoundationRgbaColor;
  hex: string;
}

export interface ColorPickerFoundationProps {
  alpha?: boolean;
  value?: FoundationColorValue;
}
export interface ColorPickerFoundationState {
  currentColor: FoundationColorValue;
}
export interface ColorPickerAdapter<Props, State> extends DefaultAdapter<Props, State> {
  notifyChange(value: FoundationColorValue): void;
}

export class ColorPickerFoundation<
  Props extends ColorPickerFoundationProps,
  State extends ColorPickerFoundationState,
> {
  constructor(adapter: ColorPickerAdapter<Props, State>);
  static hsvaToRgba(value: FoundationHsvaColor): FoundationRgbaColor;
  static rgbaToHsva(value: FoundationRgbaColor): FoundationHsvaColor;
  static rgbaToHex(value: FoundationRgbaColor): string;
  static hsvaToHex(value: FoundationHsvaColor): string;
  static hexToRgba(value: string): FoundationRgbaColor;
  static hexToHsva(value: string): FoundationHsvaColor;
  static hsvaToHslaString(value: FoundationHsvaColor): string;
  static hsvaToHslString(value: FoundationHsvaColor): string;
  static rgbaStringToHsva(value: string): FoundationHsvaColor;
  static rgbaStringToRgba(value: string): FoundationRgbaColor;
  init(): void;
  destroy(): void;
  getCurrentColor(): FoundationColorValue;
  handleChangeH(currentColor: FoundationColorValue, hue: number): void;
  handleChangeA(currentColor: FoundationColorValue, alpha: number): void;
  handleChange(
    color: FoundationHsvaColor | FoundationRgbaColor | string,
    format: 'hex' | 'rgba' | 'hsva',
  ): void;
  handleAlphaChangeByHandle(value: { a: number }): void;
  handleColorChangeByHandle(value: { h: number }): void;
  getHandlePositionByHSVA(
    hsva: FoundationHsvaColor,
    size: { width: number; height: number },
    handleSize: number,
  ): { x: number; y: number };
  getHandlePositionByMousePosition(
    position: { x: number; y: number },
    size: { width: number; height: number },
    handleSize: number,
  ): { x: number; y: number } | null;
  getAlphaHandlePositionByMousePosition(
    position: number,
    width: number,
    handleSize: number,
  ): number | null;
  getColorHandlePositionByMousePosition(
    position: number,
    width: number,
    handleSize: number,
  ): number | null;
}

export const colorPickerCssClasses: { PREFIX: 'semi-colorPicker' };
export function roundColorPickerValue(value: number, digits?: number): number;
export function splitColorPickerInput(
  value: string,
  mode: 'rgba' | 'hsva',
): FoundationRgbaColor | FoundationHsvaColor | false;
export function hexToHsva(value: string): FoundationHsvaColor;
export function hexToRgba(value: string): FoundationRgbaColor;
export function hslaStringToHsva(value: string): FoundationHsvaColor;
export function hslaToHsl(value: FoundationHslaColor): FoundationHslColor;
export function hslaToHsva(value: FoundationHslaColor): FoundationHsvaColor;
export function hsvaStringToHsva(value: string): FoundationHsvaColor;
export function hsvaToHex(value: FoundationHsvaColor): string;
export function hsvaToHslString(value: FoundationHsvaColor): string;
export function hsvaToHsla(value: FoundationHsvaColor): FoundationHslaColor;
export function hsvaToHslaString(value: FoundationHsvaColor): string;
export function hsvaToHsv(value: FoundationHsvaColor): FoundationHsvColor;
export function hsvaToHsvaString(value: FoundationHsvaColor): string;
export function hsvaToHsvString(value: FoundationHsvaColor): string;
export function hsvaToRgbString(value: FoundationHsvaColor): string;
export function hsvaToRgba(value: FoundationHsvaColor): FoundationRgbaColor;
export function hsvaToRgbaString(value: FoundationHsvaColor): string;
export function parseHue(value: string, unit?: string): number;
export function rgbaStringToHsva(value: string): FoundationHsvaColor;
export function rgbaStringToRgba(value: string): FoundationRgbaColor;
export function rgbaToHex(value: FoundationRgbaColor): string;
export function rgbaToHsva(value: FoundationRgbaColor): FoundationHsvaColor;
export function rgbaToRgb(value: FoundationRgbaColor): FoundationRgbColor;
export function rgbStringToHsva(value: string): FoundationHsvaColor;
export function rgbStringToRgba(value: string): FoundationRgbaColor;
export function roundHsva(value: FoundationHsvaColor): FoundationHsvaColor;
