import type { DefineComponent } from 'vue';

import SwitchBase from './Switch.vue';
import type { SwitchProps } from './types';

export type SwitchComponent = DefineComponent<SwitchProps>;

export const Switch = SwitchBase as unknown as SwitchComponent;

export { SWITCH_SIZES } from './types';
export type { SwitchEmits, SwitchProps, SwitchSize, SwitchSlots } from './types';

export default Switch;
