import type { DefineComponent } from 'vue';

import TabItemBase from './TabItem.vue';
import TabPaneBase from './TabPane.vue';
import TabsBase from './Tabs.vue';
import type { TabItemProps, TabPaneProps, TabsProps } from './types';

export type TabsCompoundComponent = DefineComponent<TabsProps> & {
  TabPane: DefineComponent<TabPaneProps>;
  TabItem: DefineComponent<TabItemProps>;
};

export const TabPane = TabPaneBase as unknown as DefineComponent<TabPaneProps>;
export const TabItem = TabItemBase as unknown as DefineComponent<TabItemProps>;
export const Tabs = Object.assign(TabsBase, {
  TabPane,
  TabItem,
}) as unknown as TabsCompoundComponent;

export default Tabs;
export type {
  PlainTab,
  TabArrowPosition,
  TabItemEmits,
  TabItemProps,
  TabItemSlots,
  TabPaneProps,
  TabPaneSlots,
  TabPosition,
  TabSize,
  TabsArrowSlotProps,
  TabsDropdownOptions,
  TabsDropdownProps,
  TabsEmits,
  TabsMoreOptions,
  TabsProps,
  TabsSlots,
  TabsTabBarSlotProps,
  TabType,
} from './types';
