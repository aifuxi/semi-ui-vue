import ScrollItemBase from './ScrollItem.vue';
import ScrollListBase from './ScrollList.vue';

/** 保留 ScrollListCompoundComponent 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export type ScrollListCompoundComponent = typeof ScrollListBase & {
  Item: typeof ScrollItemBase;
};

/** 保留 ScrollItem 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const ScrollItem: typeof ScrollItemBase = ScrollItemBase;
export const ScrollList = Object.assign(ScrollListBase, {
  Item: ScrollItem,
}) as ScrollListCompoundComponent;

export default ScrollList;
export {
  SCROLL_ITEM_MODES,
  type ScrollItemData,
  type ScrollItemEmits,
  type ScrollItemExposed,
  type ScrollItemMode,
  type ScrollItemProps,
  type ScrollItemSelectData,
  type ScrollListProps,
  type ScrollListSlots,
  type ScrollMotion,
  type ScrollMotionObject,
} from './types';
