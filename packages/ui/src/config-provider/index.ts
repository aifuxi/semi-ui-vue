import ConfigProviderBase from './ConfigProvider.vue';

import { defaultResponsiveMap } from './constants';

export type ConfigProviderComponent = typeof ConfigProviderBase & {
  defaultResponsiveMap: typeof defaultResponsiveMap;
};

export const ConfigProvider = Object.assign(ConfigProviderBase, {
  defaultResponsiveMap,
}) as ConfigProviderComponent;

export { default as ConfigConsumer } from './ConfigConsumer.vue';
export { configContextKey } from './config-context';
export {
  DEFAULT_BREAKPOINT_SCREENS,
  DEFAULT_CONFIG_LOCALE,
  defaultResponsiveMap,
} from './constants';
export { default as semiGlobal } from './semi-global';
export { CONFIG_BREAKPOINTS } from './types';
export type {
  Breakpoint,
  BreakpointScreens,
  ConfigConsumerSlots,
  ConfigContextValue,
  ConfigDirection,
  ConfigProviderProps,
  ConfigProviderSlots,
  OnBreakpoint,
  OnBreakpointChangeCallback,
  OnBreakpointScreensCallback,
  ResponsiveConfig,
  ResponsiveMap,
  SemiGlobalConfig,
  SemiLocale,
} from './types';

export default ConfigProvider;
