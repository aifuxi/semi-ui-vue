// 这是唯一允许从 vendor/semi-design 的 Foundation TypeScript 源码建立运行时依赖的包。
// 具体组件适配会在对应对齐矩阵建立后加入，并由公开包构建阶段内联。
export { AutoCompleteFoundation } from './auto-complete.js';
export type { AutoCompleteAdapter } from './auto-complete.js';
export { CheckboxFoundation, CheckboxGroupFoundation } from './checkbox.js';
export type { CheckboxAdapter, CheckboxGroupAdapter } from './checkbox.js';
export { InputFoundation, TextAreaFoundation } from './input.js';
export type { InputAdapter, TextAreaAdapter } from './input.js';
export { InputNumberFoundation } from './input-number.js';
export type { InputNumberAdapter } from './input-number.js';
export { PinCodeFoundation } from './pin-code.js';
export type { PinCodeAdapter } from './pin-code.js';
export * from './resizable.js';
export { SelectFoundation } from './select.js';
export type { SelectAdapter } from './select.js';
export { SwitchFoundation } from './switch.js';
export type { SwitchAdapter } from './switch.js';
export { TooltipFoundation } from './tooltip.js';
export type { TooltipAdapter, TooltipPopupContainerRect } from './tooltip.js';
export * from './typography.js';
