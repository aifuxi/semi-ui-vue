import TabItemBase from './TabItem.vue';
import TabPaneBase from './TabPane.vue';
import TabsBase from './Tabs.vue';

/** 保留 TabsCompoundComponent 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export type TabsCompoundComponent = typeof TabsBase & {
  TabPane: typeof TabPaneBase;
  TabItem: typeof TabItemBase;
};

/** 保留 TabPane 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const TabPane: typeof TabPaneBase = TabPaneBase;
/** 保留 TabItem 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const TabItem: typeof TabItemBase = TabItemBase;
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
