import type { ComputedRef, InjectionKey } from 'vue';

import type { ConfigDirection } from '../config-provider';

import type { AnchorPosition, AnchorShowTooltip, AnchorSize } from './types';

export interface AnchorContextValue {
  activeLink: ComputedRef<string>;
  autoCollapse: ComputedRef<boolean>;
  childMap: ComputedRef<Record<string, ReadonlySet<string>>>;
  direction: ComputedRef<ConfigDirection>;
  position: ComputedRef<AnchorPosition | undefined>;
  showTooltip: ComputedRef<AnchorShowTooltip>;
  size: ComputedRef<AnchorSize>;
  addLink(token: symbol, href: string, parentHref?: string): void;
  removeLink(token: symbol, href: string): void;
  onClick(event: MouseEvent | KeyboardEvent, href: string): void;
}

export const anchorContextKey: InjectionKey<AnchorContextValue> = Symbol('semi-anchor-context');
export const anchorParentHrefKey: InjectionKey<ComputedRef<string | undefined>> =
  Symbol('semi-anchor-parent-href');
export const anchorLevelKey: InjectionKey<ComputedRef<number>> = Symbol('semi-anchor-level');
