import type { DefineComponent } from 'vue';

import HotKeysBase from './HotKeys.vue';
import { HOT_KEYS } from './types';
import type { HotKeysProps } from './types';

export type HotKeysComponent = DefineComponent<HotKeysProps> & {
  Keys: typeof HOT_KEYS;
};

export const HotKeys = Object.assign(HotKeysBase, {
  Keys: HOT_KEYS,
}) as unknown as HotKeysComponent;

export { HOT_KEYS } from './types';
export type { HotKeysEmits, HotKeysKey, HotKeysProps, HotKeysSlots } from './types';

export default HotKeys;
