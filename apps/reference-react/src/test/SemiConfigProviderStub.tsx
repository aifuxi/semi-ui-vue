import React, { createContext, useContext } from 'react';

export interface ConfigContextValue {
  direction?: 'ltr' | 'rtl';
  timeZone?: string | number;
  locale?: { code?: string; [key: string]: unknown };
  responsiveObserve?: boolean;
  responsiveMap?: Record<string, string>;
  screens?: Record<string, boolean>;
  onBreakpoint(callback: (screens: Record<string, boolean>) => void): () => void;
}

const defaultScreens = { xs: false, sm: false, md: false, lg: false, xl: false, xxl: false };
const defaultLocale = { code: 'zh-CN' };
const defaultContext: ConfigContextValue = {
  direction: 'ltr',
  locale: defaultLocale,
  responsiveObserve: false,
  screens: defaultScreens,
  onBreakpoint(callback) {
    callback(defaultScreens);
    return () => undefined;
  },
};
const Context = createContext(defaultContext);

export function ConfigConsumer({
  children,
}: {
  children: (context: ConfigContextValue) => React.ReactNode;
}): React.ReactElement {
  return <>{children(useContext(Context))}</>;
}

export default function ConfigProvider({
  children,
  direction = 'ltr',
  locale = defaultLocale,
  ...rest
}: Partial<ConfigContextValue> & { children?: React.ReactNode }): React.ReactElement {
  const context: ConfigContextValue = {
    ...defaultContext,
    ...rest,
    direction,
    locale,
    screens: defaultScreens,
  };
  const content = <Context.Provider value={context}>{children}</Context.Provider>;
  return direction === 'rtl' ? <div className="semi-rtl">{content}</div> : content;
}
