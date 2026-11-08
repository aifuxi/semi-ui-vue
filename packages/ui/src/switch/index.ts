import SwitchBase from './Switch.vue';

/** 保留 SwitchComponent 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export type SwitchComponent = typeof SwitchBase;

export const Switch = SwitchBase as unknown as SwitchComponent;

export { SWITCH_SIZES } from './types';
export type { SwitchEmits, SwitchProps, SwitchSize, SwitchSlots } from './types';

export default Switch;
