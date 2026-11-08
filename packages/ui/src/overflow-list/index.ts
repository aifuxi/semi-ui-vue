import OverflowListBase from './OverflowList.vue';

/** 保留 OverflowList 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const OverflowList: typeof OverflowListBase = OverflowListBase;
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
