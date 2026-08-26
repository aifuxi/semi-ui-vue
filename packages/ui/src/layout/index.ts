import type { DefineComponent } from 'vue';

import LayoutComponent from './Layout.vue';
import LayoutContent from './LayoutContent.vue';
import LayoutFooter from './LayoutFooter.vue';
import LayoutHeader from './LayoutHeader.vue';
import LayoutSider from './LayoutSider.vue';
import type { LayoutProps, LayoutSectionProps, LayoutSiderProps } from './types';

export type LayoutCompoundComponent = DefineComponent<LayoutProps> & {
  Header: DefineComponent<LayoutSectionProps>;
  Footer: DefineComponent<LayoutSectionProps>;
  Content: DefineComponent<LayoutSectionProps>;
  Sider: DefineComponent<LayoutSiderProps>;
};

export const Layout = Object.assign(LayoutComponent, {
  Header: LayoutHeader,
  Footer: LayoutFooter,
  Content: LayoutContent,
  Sider: LayoutSider,
}) as unknown as LayoutCompoundComponent;

export { LayoutContent, LayoutFooter, LayoutHeader, LayoutSider };
export { LAYOUT_BREAKPOINTS, LAYOUT_RESPONSIVE_MAP } from './types';
export type {
  LayoutBreakpoint,
  LayoutProps,
  LayoutResponsiveMap,
  LayoutSectionProps,
  LayoutSiderEmits,
  LayoutSiderProps,
  LayoutSlots,
  LayoutTagName,
} from './types';

export default Layout;
