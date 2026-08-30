import type { DefineComponent } from 'vue';

import TreeSelectBase from './TreeSelect.vue';
import type {
  TreeSelectEmits,
  TreeSelectExposed,
  TreeSelectProps,
  TreeSelectSearchPosition,
  TreeSelectSearchRenderProps,
  TreeSelectSelectedItemProps,
  TreeSelectSize,
  TreeSelectSlots,
  TreeSelectTriggerRenderProps,
  TreeSelectValidateStatus,
} from './types';

export const TreeSelect = TreeSelectBase as unknown as DefineComponent<TreeSelectProps>;
export default TreeSelect;
export type {
  TreeSelectEmits,
  TreeSelectExposed,
  TreeSelectProps,
  TreeSelectSearchPosition,
  TreeSelectSearchRenderProps,
  TreeSelectSelectedItemProps,
  TreeSelectSize,
  TreeSelectSlots,
  TreeSelectTriggerRenderProps,
  TreeSelectValidateStatus,
};
export type { TreeKeyMaps, TreeNodeData, TreeValue } from './types';
