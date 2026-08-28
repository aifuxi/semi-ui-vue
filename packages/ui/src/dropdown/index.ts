import type { DefineComponent } from 'vue';

import DropdownBase from './Dropdown.vue';
import DropdownDividerBase from './DropdownDivider.vue';
import DropdownItemBase from './DropdownItem.vue';
import DropdownMenuBase from './DropdownMenu.vue';
import DropdownTitleBase from './DropdownTitle.vue';
import type {
  DropdownDividerProps,
  DropdownExposed,
  DropdownItemProps,
  DropdownMenuProps,
  DropdownProps,
  DropdownTitleProps,
} from './types';

export type DropdownComponent = DefineComponent<DropdownProps, DropdownExposed>;
export type DropdownCompoundComponent = DropdownComponent & {
  Divider: DefineComponent<DropdownDividerProps>;
  Item: DefineComponent<DropdownItemProps>;
  Menu: DefineComponent<DropdownMenuProps>;
  Title: DefineComponent<DropdownTitleProps>;
};

export const DropdownDivider =
  DropdownDividerBase as unknown as DefineComponent<DropdownDividerProps>;
export const DropdownItem = DropdownItemBase as unknown as DefineComponent<DropdownItemProps>;
export const DropdownMenu = DropdownMenuBase as unknown as DefineComponent<DropdownMenuProps>;
export const DropdownTitle = DropdownTitleBase as unknown as DefineComponent<DropdownTitleProps>;
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
