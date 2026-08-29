import type { DefineComponent } from 'vue';

import ScrollItemBase from './ScrollItem.vue';
import ScrollListBase from './ScrollList.vue';
import type { ScrollItemProps } from './types';

export type ScrollListCompoundComponent = typeof ScrollListBase & {
  Item: DefineComponent<ScrollItemProps>;
};

export const ScrollItem = ScrollItemBase as unknown as DefineComponent<ScrollItemProps>;
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
