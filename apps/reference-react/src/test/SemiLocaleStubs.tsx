import React, { createContext, useContext, type ReactNode } from 'react';

interface StubLocale {
  code: string;
  currency: string;
  dateFnsLocale: { code: string };
  [componentName: string]: unknown;
}

const zhCN: StubLocale = {
  code: 'zh-CN',
  currency: 'CNY',
  dateFnsLocale: { code: 'zh-CN' },
};
const LocaleContext = createContext<StubLocale>(zhCN);

export const enGB: StubLocale = {
  code: 'en-GB',
  currency: 'GBP',
  dateFnsLocale: { code: 'en-GB' },
  TimePicker: { begin: 'Start Time' },
};

export const jaJP: StubLocale = {
  code: 'ja-JP',
  currency: 'JPY',
  dateFnsLocale: { code: 'ja' },
  Pagination: { jumpTo: 'ページへ' },
  TimePicker: { begin: '始まる時間' },
};

export function LocaleProviderStub({
  children,
  locale = zhCN,
}: {
  children?: ReactNode;
  locale?: StubLocale;
}): React.ReactElement {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function LocaleConsumerStub<ComponentLocale>({
  children,
  componentName,
}: {
  children?: (
    localeData: ComponentLocale,
    localeCode: string,
    dateFnsLocale: { code: string },
    currency: string,
  ) => ReactNode;
  componentName: string;
}): React.ReactElement | null {
  const locale = useContext(LocaleContext);
  return (
    <>
      {children?.(
        locale[componentName] as ComponentLocale,
        locale.code,
        locale.dateFnsLocale,
        locale.currency,
      )}
    </>
  );
}
