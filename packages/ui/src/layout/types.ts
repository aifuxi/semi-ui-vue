export const LAYOUT_BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;

export const LAYOUT_RESPONSIVE_MAP = Object.freeze({
  xs: '(max-width: 575px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  xxl: '(min-width: 1600px)',
});

export type LayoutBreakpoint = (typeof LAYOUT_BREAKPOINTS)[number];
export type LayoutResponsiveMap = typeof LAYOUT_RESPONSIVE_MAP;
export type LayoutTagName = keyof HTMLElementTagNameMap;

export interface LayoutProps {
  prefixCls?: string;
  hasSider?: boolean;
  tagName?: LayoutTagName;
}

export interface LayoutSectionProps {
  prefixCls?: string;
  tagName?: LayoutTagName;
}

export interface LayoutSiderProps {
  prefixCls?: string;
  breakpoint?: readonly LayoutBreakpoint[];
}

export interface LayoutSiderEmits {
  breakpoint: [screen: LayoutBreakpoint, match: boolean];
}

export interface LayoutSlots {
  default?: () => unknown;
}
