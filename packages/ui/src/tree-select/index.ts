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

/** 保留 TreeSelect 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const TreeSelect: typeof TreeSelectBase = TreeSelectBase;
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
