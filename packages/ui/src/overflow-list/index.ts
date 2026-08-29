import type { DefineComponent } from 'vue';

import OverflowListBase from './OverflowList.vue';
import type { OverflowListProps } from './types';

export const OverflowList = OverflowListBase as unknown as DefineComponent<OverflowListProps>;
export default OverflowList;
export type {
  OverflowItem,
  OverflowListCollapseFrom,
  OverflowListEmits,
  OverflowListKey,
  OverflowListProps,
  OverflowListRenderDirection,
  OverflowListRenderMode,
  OverflowListSlots,
} from './types';
