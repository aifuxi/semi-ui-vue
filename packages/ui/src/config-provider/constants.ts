import { DEFAULT_TYPOGRAPHY_LOCALE } from '../typography';

import type { BreakpointScreens, ResponsiveMap, SemiLocale } from './types';

export const defaultResponsiveMap: Readonly<ResponsiveMap> = Object.freeze({
  xs: '(max-width: 575px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  xxl: '(min-width: 1600px)',
});

export const DEFAULT_BREAKPOINT_SCREENS: Readonly<BreakpointScreens> = Object.freeze({
  xs: false,
  sm: false,
  md: false,
  lg: false,
  xl: false,
  xxl: false,
});

export const DEFAULT_CONFIG_LOCALE: Readonly<SemiLocale> = Object.freeze({
  code: 'zh-CN',
  currency: 'CNY',
  Typography: DEFAULT_TYPOGRAPHY_LOCALE,
});
