import { expect, test, type Page } from '@playwright/test';

const pilots = ['button', 'select', 'modal', 'table', 'icon', 'json-viewer'] as const;

async function waitForStablePage(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  });
}

test('根路径、大小写兼容路径与语言关联可用', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/zh-cn\/$/);

  await page.goto('/zh-CN/components/button/');
  await expect(page).toHaveURL(/\/zh-CN\/components\/button\/$/);

  const canonical = page.locator('link[rel="canonical"]');
  await expect(canonical).toHaveAttribute(
    'href',
    'https://semi.fuxiaochen.com/zh-cn/components/button/',
  );
  await expect(page.locator('link[hreflang="en-US"]')).toHaveAttribute(
    'href',
    'https://semi.fuxiaochen.com/en-us/components/button/',
  );
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
});

for (const locale of ['zh-cn', 'en-us'] as const) {
  for (const slug of pilots) {
    test(`${locale}/${slug} 包含正式内容、同源 Demo 与 API`, async ({ page }) => {
      const runtimeErrors: string[] = [];
      page.on('pageerror', (error) => runtimeErrors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') runtimeErrors.push(message.text());
      });

      await page.goto(`/${locale}/components/${slug}/`);
      await waitForStablePage(page);

      await expect(page.locator('main h1')).toBeVisible();
      await expect(page.locator('[data-demo-title]')).toHaveCount(1);
      await expect(page.locator('[data-demo-preview]')).toBeVisible();
      await expect(page.locator('[data-demo-source] summary')).toBeVisible();
      expect(await page.locator('[data-api-kind] tbody tr').count()).toBeGreaterThan(0);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
      ).toBe(true);
      expect(runtimeErrors).toEqual([]);
    });
  }
}

test('六组件公开交互可在文档页执行', async ({ page }) => {
  await page.goto('/zh-cn/components/button/');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('button', { name: 'Saving' })).toBeVisible();

  await page.goto('/zh-cn/components/select/');
  await expect(page.locator('.semi-select-selection-text').first()).toHaveText('Douyin');
  await page.locator('.semi-select').first().click();
  await expect(page.locator('.semi-select-option').filter({ hasText: 'CapCut' })).toBeVisible();
  await page.keyboard.press('Escape');

  await page.goto('/zh-cn/components/modal/');
  await page.getByRole('button', { name: 'Open modal' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const cancelButton = page.getByRole('button', { name: 'cancel' });
  await expect(cancelButton).toHaveText('Review later');
  await cancelButton.click();
  await expect(page.getByRole('dialog')).toBeHidden();

  await page.goto('/zh-cn/components/table/');
  await expect(page.locator('.semi-table-tbody .semi-table-row')).toHaveCount(3);
  await expect(page.locator('.semi-table-row-selected')).toContainText('API Gateway');

  await page.goto('/zh-cn/components/icon/');
  await expect(page.getByRole('list', { name: 'Icon variants' }).locator('.semi-icon')).toHaveCount(
    6,
  );

  await page.goto('/zh-cn/components/json-viewer/');
  await expect(page.locator('.semi-json-viewer')).toBeVisible();
});

test('键盘、主题与移动布局保持可用', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('starlight-theme', 'dark'));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/en-us/components/modal/');
  await waitForStablePage(page);

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: /Skip to content/i })).toBeFocused();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
  ).toBe(true);
});
