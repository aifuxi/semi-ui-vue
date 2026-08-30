import type { DefineComponent } from 'vue';

import NavigationBase from './Navigation.vue';
import NavFooterBase from './NavFooter.vue';
import NavHeaderBase from './NavHeader.vue';
import NavItemBase from './NavItem';
import SubNavBase from './SubNav.vue';
import type {
  NavFooterProps,
  NavHeaderProps,
  NavItemProps,
  NavigationProps,
  SubNavProps,
} from './types';

export type NavComponent = DefineComponent<NavigationProps>;
export type NavCompoundComponent = NavComponent & {
  Footer: DefineComponent<NavFooterProps>;
  Header: DefineComponent<NavHeaderProps>;
  Item: DefineComponent<NavItemProps>;
  Sub: DefineComponent<SubNavProps>;
};

const NavFooter = NavFooterBase as unknown as DefineComponent<NavFooterProps>;
const NavHeader = NavHeaderBase as unknown as DefineComponent<NavHeaderProps>;
export const NavItem = NavItemBase as unknown as DefineComponent<NavItemProps>;
export const SubNav = SubNavBase as unknown as DefineComponent<SubNavProps>;
export const Nav = Object.assign(NavigationBase, {
  Footer: NavFooter,
  Header: NavHeader,
  Item: NavItem,
  Sub: SubNav,
}) as unknown as NavCompoundComponent;

export type {
  CollapseButtonEmits,
  CollapseButtonProps,
  ItemKey,
  NavigationClickData,
  NavigationContent,
  NavigationEmits,
  NavigationItemInput,
  NavigationItemObject,
  NavigationItems,
  NavigationLocale,
  NavigationMode,
  NavigationOpenChangeData,
  NavigationProps,
  NavigationSelectData,
  NavigationSlots,
  NavigationState,
  NavigationWrapperData,
  NavFooterEmits,
  NavFooterProps,
  NavFooterSlots,
  NavHeaderProps,
  NavHeaderSlots,
  NavItemEmits,
  NavItemProps,
  NavItemSelectedData,
  NavItemSlots,
  SubNavProps,
  SubNavSlots,
  ToggleIconPosition,
} from './types';

export default Nav;
