import type { ComputedRef, InjectionKey, VNodeChild } from 'vue';

import type { DropdownProps } from '../dropdown';
import type {
  ItemKey,
  NavigationClickData,
  NavigationContent,
  NavigationLocale,
  NavigationMode,
  NavigationOpenChangeData,
  NavigationSelectData,
  NavigationWrapperData,
  NavItemProps,
  SubNavProps,
  ToggleIconPosition,
} from './types';

export interface NavigationContextValue {
  addOpenKey(key: ItemKey): void;
  direction: ComputedRef<'ltr' | 'rtl'>;
  expandIcon: ComputedRef<NavigationContent | undefined>;
  getPopupContainer: ComputedRef<(() => HTMLElement) | undefined>;
  isCollapsed: ComputedRef<boolean>;
  isInSubNav: boolean;
  limitIndent: ComputedRef<boolean>;
  locale: ComputedRef<NavigationLocale>;
  mode: ComputedRef<NavigationMode>;
  notifyClick(data: NavigationClickData): void;
  notifyOpenChange(data: NavigationOpenChangeData): void;
  notifySelect(data: NavigationSelectData): void;
  openKeys: ComputedRef<ItemKey[]>;
  openKeysControlled: ComputedRef<boolean>;
  prefixCls: ComputedRef<string>;
  removeOpenKey(key: ItemKey): void;
  selectedKeys: ComputedRef<ItemKey[]>;
  selectedKeysControlled: ComputedRef<boolean>;
  setSelectedKeys(keys: ItemKey[]): void;
  subDropdownProps: ComputedRef<DropdownProps | undefined>;
  subNavCloseDelay: ComputedRef<number>;
  subNavMotion: ComputedRef<boolean>;
  subNavOpenDelay: ComputedRef<number>;
  toggleCollapsed(): void;
  toggleIconPosition: ComputedRef<ToggleIconPosition>;
  tooltipHideDelay: ComputedRef<number>;
  tooltipShowDelay: ComputedRef<number>;
  wrapItem(data: NavigationWrapperData): VNodeChild;
}

export const navigationContextKey: InjectionKey<NavigationContextValue> = Symbol('navigation');

export type NavigationChildProps = NavItemProps | SubNavProps;
