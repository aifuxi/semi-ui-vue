import NavigationBase from './Navigation.vue';
import NavFooterBase from './NavFooter.vue';
import NavHeaderBase from './NavHeader.vue';
import NavItemBase from './NavItem';
import SubNavBase from './SubNav.vue';

/** 保留 NavComponent 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export type NavComponent = typeof NavigationBase;
/** 保留 NavCompoundComponent 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export type NavCompoundComponent = NavComponent & {
  Footer: typeof NavFooterBase;
  Header: typeof NavHeaderBase;
  Item: typeof NavItemBase;
  Sub: typeof SubNavBase;
};

/** 保留 NavFooter 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
const NavFooter = NavFooterBase;
/** 保留 NavHeader 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
const NavHeader = NavHeaderBase;
/** 保留 NavItem 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const NavItem: typeof NavItemBase = NavItemBase;
/** 保留 SubNav 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const SubNav: typeof SubNavBase = SubNavBase;
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
