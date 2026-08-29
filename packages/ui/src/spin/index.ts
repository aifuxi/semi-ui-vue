import type { DefineComponent } from 'vue';

import SpinBase from './Spin.vue';
import type { SpinProps } from './types';

export const Spin = SpinBase as unknown as DefineComponent<SpinProps>;

export { SPIN_SIZES } from './types';
export type { SpinProps, SpinSize, SpinSlots } from './types';

export default Spin;
