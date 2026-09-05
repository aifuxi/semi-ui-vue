import type { Browser, TestInfo } from '@playwright/test';

export async function visualContext(
  browser: Browser,
  info: TestInfo,
  locale: string,
  theme: string,
) {
  const options = {
    locale: locale === 'en-us' ? 'en-US' : 'zh-CN',
    colorScheme: theme === 'dark' ? ('dark' as const) : ('light' as const),
    timezoneId: 'Asia/Shanghai',
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  };
  await info.attach('environment', {
    body: JSON.stringify(
      {
        browser: browser.version(),
        playwright: '1.62.1',
        ...options,
        date: '2024-08-15T10:24:30+08:00',
        baseline: 'cdfba6e520fc83ad871b30f51f36d8af3aaa5a21',
      },
      null,
      2,
    ),
    contentType: 'application/json',
  });
  return browser.newContext(options);
}
