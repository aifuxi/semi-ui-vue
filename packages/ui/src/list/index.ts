import type { DefineComponent } from 'vue';

import ListBase from './List.vue';
import ListItemBase from './ListItem.vue';
import type { ListItemProps } from './types';

export type ListCompoundComponent = typeof ListBase & {
  Item: DefineComponent<ListItemProps>;
};

export const ListItem = ListItemBase as unknown as DefineComponent<ListItemProps>;
export const List = Object.assign(ListBase, { Item: ListItem }) as ListCompoundComponent;
export default List;

export {
  LIST_ITEM_ALIGNS,
  LIST_LAYOUTS,
  LIST_SIZES,
  type ListEmits,
  type ListGrid,
  type ListItemAlign,
  type ListItemEmits,
  type ListItemProps,
  type ListItemSlots,
  type ListLayout,
  type ListLocale,
  type ListProps,
  type ListSize,
  type ListSlots,
} from './types';
