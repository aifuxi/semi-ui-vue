import { expect, test } from '@playwright/test';

for (const locale of ['zh-cn', 'en-us']) {
  test(`文档导航按点击加载，不预取整站示例 ${locale}`, async ({ page }) => {
    const prefetched: string[] = [];
    const errors: string[] = [];
    page.on('request', (request) => {
      if (/prefetch/i.test(request.headers()['sec-purpose'] ?? request.headers().purpose ?? ''))
        prefetched.push(request.url());
    });
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.goto(`/${locale}/components/button/`);
    await expect(
      page.locator('[data-demo-id]').first().locator('.semi-button').first(),
    ).toBeVisible();
    const guide = page.locator('header').getByRole('link', {
      name: locale === 'zh-cn' ? '指南' : 'Guide',
      exact: true,
    });
    await guide.hover();
    // Let Nuxt's idle prefetch scheduling finish before inspecting network behavior.
    await page.evaluate(() => new Promise<void>((resolve) => requestIdleCallback(() => resolve())));
    await page.waitForLoadState('networkidle');
    expect(prefetched).toEqual([]);
    await guide.click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/start/getting-started/`));
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('[data-demo-id]').first()).toBeVisible();
    expect(errors).toEqual([]);
  });
}
