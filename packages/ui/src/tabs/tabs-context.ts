import type { ComputedRef, InjectionKey } from 'vue';

import type { PlainTab, TabPosition } from './types';

export interface TabsContextValue {
  activeKey: ComputedRef<string>;
  forceDisableMotion: ComputedRef<boolean>;
  lazyRender: ComputedRef<boolean>;
  panes: ComputedRef<PlainTab[]>;
  prevActiveKey: ComputedRef<string | null>;
  tabPaneMotion: ComputedRef<boolean>;
  tabPosition: ComputedRef<TabPosition>;
}

export const tabsContextKey: InjectionKey<TabsContextValue> = Symbol('tabs-context');
