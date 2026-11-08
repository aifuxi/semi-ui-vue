import DropdownBase from './Dropdown.vue';
import DropdownDividerBase from './DropdownDivider.vue';
import DropdownItemBase from './DropdownItem.vue';
import DropdownMenuBase from './DropdownMenu.vue';
import DropdownTitleBase from './DropdownTitle.vue';

/** 保留 DropdownComponent 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export type DropdownComponent = typeof DropdownBase;
/** 保留 DropdownCompoundComponent 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export type DropdownCompoundComponent = DropdownComponent & {
  Divider: typeof DropdownDividerBase;
  Item: typeof DropdownItemBase;
  Menu: typeof DropdownMenuBase;
  Title: typeof DropdownTitleBase;
};

/** 保留 DropdownDivider 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const DropdownDivider: typeof DropdownDividerBase = DropdownDividerBase;
/** 保留 DropdownItem 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const DropdownItem: typeof DropdownItemBase = DropdownItemBase;
/** 保留 DropdownMenu 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const DropdownMenu: typeof DropdownMenuBase = DropdownMenuBase;
/** 保留 DropdownTitle 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const DropdownTitle: typeof DropdownTitleBase = DropdownTitleBase;
export const Dropdown = Object.assign(DropdownBase, {
  Divider: DropdownDivider,
  Item: DropdownItem,
  Menu: DropdownMenu,
  Title: DropdownTitle,
}) as unknown as DropdownCompoundComponent;

export { DROPDOWN_ITEM_TYPES } from './types';
export type {
  DropdownDividerProps,
  DropdownEmits,
  DropdownExposed,
  DropdownItemEmits,
  DropdownItemProps,
  DropdownItemSlots,
  DropdownItemType,
  DropdownMenuItem,
  DropdownMenuItemDivider,
  DropdownMenuItemItem,
  DropdownMenuItemTitle,
  DropdownMenuProps,
  DropdownMenuSlots,
  DropdownProps,
  DropdownSlots,
  DropdownTitleProps,
  DropdownTitleSlots,
} from './types';

export default Dropdown;
