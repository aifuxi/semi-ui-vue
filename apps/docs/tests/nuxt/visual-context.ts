import type { Browser, Locator, TestInfo } from '@playwright/test';

/** Wait for real local assets; a missing font/image must fail instead of using a fallback screenshot. */
export async function waitForVisualAssets(targets: Locator[]) {
  await Promise.all(
    targets.map(async (target) => {
      await target.page().evaluate(async () => {
        const fonts = await Promise.all([
          document.fonts.load('12px Inter'),
          document.fonts.load('600 14px Inter'),
        ]);
        if (fonts.some((faces) => !faces.length))
          throw new Error('Inter 字体未注册，不能验收视觉。');
        await document.fonts.ready;
      });
      await target
        .locator('img')
        .evaluateAll((images) =>
          Promise.all(images.map((image) => (image as HTMLImageElement).decode())),
        );
    }),
  );
}

export async function visualContext(
  browser: Browser,
  info: TestInfo,
  locale: string,
  theme: string,
  direction = 'ltr',
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
        direction,
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
