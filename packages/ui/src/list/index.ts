import ListBase from './List.vue';
import ListItemBase from './ListItem.vue';

/** 保留 ListCompoundComponent 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export type ListCompoundComponent = typeof ListBase & {
  Item: typeof ListItemBase;
};

/** 保留 ListItem 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const ListItem: typeof ListItemBase = ListItemBase;
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
