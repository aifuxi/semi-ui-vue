import HotKeysBase from './HotKeys.vue';
import { HOT_KEYS } from './types';

/** 保留 HotKeysComponent 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export type HotKeysComponent = typeof HotKeysBase & {
  Keys: typeof HOT_KEYS;
};

export const HotKeys = Object.assign(HotKeysBase, {
  Keys: HOT_KEYS,
}) as unknown as HotKeysComponent;

export { HOT_KEYS } from './types';
export type { HotKeysEmits, HotKeysKey, HotKeysProps, HotKeysSlots } from './types';

export default HotKeys;
