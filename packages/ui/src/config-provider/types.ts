import type { VNodeChild } from 'vue';

import type { TypographyLocale } from '../typography';

export const CONFIG_BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;

export type Breakpoint = (typeof CONFIG_BREAKPOINTS)[number];
export type ConfigDirection = 'ltr' | 'rtl';

export interface ResponsiveMap {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
}

export type BreakpointScreens = Record<Breakpoint, boolean>;
export type OnBreakpointScreensCallback = (screens: Readonly<BreakpointScreens>) => void;
export type OnBreakpointChangeCallback = (screen: Breakpoint, match: boolean) => void;

export interface OnBreakpoint {
  (callback: OnBreakpointScreensCallback): () => void;
  (breakpoints: readonly Breakpoint[], callback: OnBreakpointChangeCallback): () => void;
}

export interface SemiLocale {
  code?: string;
  currency?: string;
  Typography?: TypographyLocale;
  [componentName: string]: unknown;
}

export interface ConfigContextValue {
  direction: ConfigDirection;
  timeZone?: string | number | undefined;
  locale: SemiLocale;
  getPopupContainer?: (() => HTMLElement) | undefined;
  responsiveObserve: boolean;
  responsiveMap: ResponsiveMap;
  onBreakpoint: OnBreakpoint;
  screens: Readonly<BreakpointScreens>;
}

export interface ConfigProviderProps {
  direction?: ConfigDirection;
  timeZone?: string | number;
  locale?: SemiLocale;
  getPopupContainer?: () => HTMLElement;
  responsiveObserve?: boolean;
  responsiveMap?: ResponsiveMap;
}

export interface ConfigProviderSlots {
  default?: () => VNodeChild;
}

export interface ConfigConsumerSlots {
  default?: (context: ConfigContextValue) => VNodeChild;
}

export interface ResponsiveConfig {
  responsiveMap?: ResponsiveMap;
  onBreakpoint?: OnBreakpoint;
  screens?: Readonly<BreakpointScreens>;
}

export interface SemiGlobalConfig {
  overrideDefaultProps?: Record<string, Record<string, unknown>>;
}
