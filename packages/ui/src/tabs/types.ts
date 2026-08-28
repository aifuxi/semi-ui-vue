import type { CSSProperties, HTMLAttributes, VNodeChild } from 'vue';

export type TabType = 'line' | 'card' | 'button' | 'slash';
export type TabSize = 'small' | 'medium' | 'large';
export type TabPosition = 'top' | 'left';
export type TabArrowPosition = 'start' | 'end' | 'both';

export interface PlainTab {
  disabled?: boolean;
  icon?: VNodeChild;
  itemKey: string;
  tab?: VNodeChild;
  closable?: boolean;
}

export interface TabsDropdownOptions {
  className?: string;
  style?: CSSProperties;
  trigger?: 'hover' | 'click';
  position?: 'bottomLeft' | 'bottomRight';
}

export interface TabsMoreOptions {
  count: number;
  render?: () => VNodeChild;
  dropdownProps?: TabsDropdownOptions;
}

export interface TabsDropdownProps {
  start?: TabsDropdownOptions;
  end?: TabsDropdownOptions;
}

export interface TabsProps {
  activeKey?: string;
  modelValue?: string;
  class?: HTMLAttributes['class'];
  className?: string;
  collapsible?: boolean | 'auto';
  contentStyle?: CSSProperties;
  defaultActiveKey?: string;
  keepDOM?: boolean;
  lazyRender?: boolean;
  showRestInDropdown?: boolean;
  size?: TabSize;
  style?: CSSProperties;
  tabBarClassName?: string;
  tabBarExtraContent?: VNodeChild;
  tabBarStyle?: CSSProperties;
  tabList?: PlainTab[];
  tabPaneMotion?: boolean;
  tabPosition?: TabPosition;
  type?: TabType;
  preventScroll?: boolean;
  more?: number | TabsMoreOptions;
  visibleTabsStyle?: CSSProperties;
  arrowPosition?: TabArrowPosition;
  dropdownProps?: TabsDropdownProps;
}

export interface TabsEmits {
  change: [activeKey: string];
  tabClick: [activeKey: string, event: MouseEvent | KeyboardEvent];
  tabClose: [tabKey: string];
  visibleTabsChange: [visibleState: Map<string, boolean>];
  'update:activeKey': [activeKey: string];
  'update:modelValue': [activeKey: string];
}

export interface TabsSlots {
  default?: () => VNodeChild;
  tabBarExtraContent?: () => VNodeChild;
  tabBar?: (props: TabsTabBarSlotProps) => VNodeChild;
  more?: (props: { hiddenTabs: PlainTab[] }) => VNodeChild;
  arrow?: (props: TabsArrowSlotProps) => VNodeChild;
}

export interface TabsTabBarSlotProps {
  activeKey: string;
  list: PlainTab[];
  onTabClick: (activeKey: string, event: MouseEvent | KeyboardEvent) => void;
}

export interface TabsArrowSlotProps {
  items: PlainTab[];
  position: 'start' | 'end';
  click: () => void;
  defaultNode: VNodeChild;
}

export interface TabPaneProps extends PlainTab {
  class?: HTMLAttributes['class'];
  className?: string;
  style?: CSSProperties;
  tabIndex?: number;
}

export interface TabPaneSlots {
  default?: () => VNodeChild;
  icon?: () => VNodeChild;
  tab?: () => VNodeChild;
}

export interface TabItemProps extends PlainTab {
  class?: HTMLAttributes['class'];
  className?: string;
  selected?: boolean;
  size?: TabSize;
  style?: CSSProperties;
  tabPosition?: TabPosition;
  type?: TabType;
}

export interface TabItemEmits {
  click: [itemKey: string, event: MouseEvent];
  keyDown: [event: KeyboardEvent, itemKey: string, closable: boolean];
  close: [itemKey: string, event: MouseEvent];
}

export interface TabItemSlots {
  icon?: () => VNodeChild;
  tab?: () => VNodeChild;
}
