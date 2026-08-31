import type { VNodeChild } from 'vue';
import type { Locale as DateFnsLocale } from 'date-fns';

import type { TypographyLocale } from '../typography';
import type { PaginationLocale } from '../pagination';
import type { ImageLocale } from '../image';
import type { ListLocale } from '../list/types';
import type { ModalLocale } from '../modal/types';
import type { NavigationLocale } from '../navigation/types';
import type { PopconfirmLocale } from '../popconfirm/types';
import type { TableLocale } from '../table/types';
import type { UploadLocaleConfig } from '../upload/types';
import type { UserGuideLocale } from '../user-guide/types';

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
  dateFnsLocale?: DateFnsLocale;
  Typography?: TypographyLocale;
  Pagination?: PaginationLocale;
  Image?: ImageLocale;
  List?: ListLocale;
  Modal?: ModalLocale;
  Navigation?: NavigationLocale;
  Popconfirm?: PopconfirmLocale;
  Table?: TableLocale;
  Upload?: UploadLocaleConfig;
  UserGuide?: UserGuideLocale;
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
