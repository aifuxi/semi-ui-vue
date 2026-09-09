import { expect, test } from '@playwright/test';
import pages from '../../src/data/pages.json' with { type: 'json' };

test('导航、搜索、语言与主题切换', async ({ page }) => {
  await page.goto('/zh-cn/start/introduction/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('介绍');
  await page.getByRole('button', { name: '搜索', exact: true }).click();
  await page.getByRole('combobox').fill('Button');
  await expect(page.getByRole('option').first()).toBeVisible();
  await page.getByRole('combobox').press('Enter');
  await expect(page).toHaveURL(/\/zh-cn\/components\/button\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('按钮');
  await page.getByRole('link', { name: 'Switch to English', exact: true }).click();
  await expect(page).toHaveURL(/\/en-us\/components\/button\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
  await page.getByRole('button', { name: /^Switch to (light|dark) mode$/ }).click();
  await expect(page.locator('body')).toHaveAttribute('theme-mode', 'dark');
  await page.reload();
  await expect(page.locator('body')).toHaveAttribute('theme-mode', 'dark');
});

test('正文与 API 在没有 JavaScript 时仍可阅读', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto('/zh-cn/components/button/');
  await expect(page.locator('h1')).toHaveText('按钮');
  await expect(page.locator('[data-api-kind="props"]').first()).toContainText('disabled');
  expect(await page.locator('[data-demo-source]').first().textContent()).toContain('script setup');
  await context.close();
});

test('示例交互与在线编辑使用本地资源', async ({ page, baseURL }) => {
  const docsOrigin = new URL(baseURL!).origin;
  const external: string[] = [];
  page.on('request', (request) => {
    if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== docsOrigin)
      external.push(request.url());
  });
  await page.goto('/en-us/components/button/');
  const demo = page.locator('[data-demo-id="button/en-us/Loading"]');
  await demo.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(demo.getByRole('button', { name: 'Save', exact: true })).toHaveClass(
    /semi-button-loading/,
  );
  await demo.getByRole('button', { name: 'Edit online', exact: true }).click();
  await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 30_000 });
  const preview = page.frameLocator('.demo-editor iframe');
  await expect(preview.getByRole('button', { name: 'Save', exact: true })).toBeVisible({
    timeout: 30_000,
  });
  await preview.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(preview.getByRole('button', { name: 'Save', exact: true })).toHaveClass(
    /semi-button-loading/,
  );
  const sandbox = await page.locator('.demo-editor iframe').getAttribute('sandbox');
  expect(sandbox).not.toContain('allow-same-origin');
  const frame = page.frames().find((entry) => entry.parentFrame());
  expect(
    await frame!.evaluate(() => {
      try {
        return Boolean(parent.document.body);
      } catch {
        return false;
      }
    }),
  ).toBe(false);
  await page.getByRole('button', { name: /^Switch to (light|dark) mode$/ }).click();
  await expect(preview.locator('body')).toHaveAttribute('theme-mode', 'dark');
  await demo.getByRole('button', { name: 'Close editor', exact: true }).click();
  await expect(page.locator('.demo-editor iframe')).toHaveCount(0);
  expect(external).toEqual([]);
});

test('兼容地址、404、目录定位和历史导航', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/zh-cn\/start\/introduction\/$/);
  await page.goto('/zh-CN/components/button/');
  await expect(page).toHaveURL(/\/zh-cn\/components\/button\/$/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://semi.fuxiaochen.com/zh-cn/components/button/',
  );
  await expect(page.locator('link[hreflang="en-US"]')).toHaveAttribute(
    'href',
    'https://semi.fuxiaochen.com/en-us/components/button/',
  );
  const toc = page.getByRole('navigation', { name: '本页目录' });
  await toc.getByRole('link', { name: '设计变量', exact: true }).click();
  await expect(toc.getByRole('link', { name: '设计变量', exact: true })).toHaveAttribute(
    'aria-current',
    'location',
  );
  await page.goBack();
  await expect(page).not.toHaveURL(/#/);
  const response = await page.goto('/does-not-exist/');
  expect(response?.status()).toBe(404);
});

test('普通页面按需加载编辑器并限制初始请求', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/zh-cn/start/introduction/');
  await expect(page.locator('h1')).toHaveText('介绍');
  expect(requests.some((url) => url.includes('/repl/'))).toBe(false);
  expect(requests.length).toBeLessThanOrEqual(200);
});

test('窄屏导航、跳转链接与搜索焦点', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/en-us/start/introduction/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
  await expect(page.locator('.side-nav')).toHaveClass(/show/);
  await page.getByRole('button', { name: 'Close navigation', exact: true }).click();
  await expect(page.locator('.side-nav')).not.toHaveClass(/show/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});

for (const entry of pages) {
  test(`页面与示例可加载：${entry.path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (
        message.type() === 'error' ||
        /Failed to resolve component|Hydration.*mismatch/.test(message.text())
      )
        errors.push(message.text());
    });
    await page.goto(entry.path);
    await expect(page.locator('h1')).toHaveText(entry.title);
    await expect(page.locator('.demo-loading')).toHaveCount(0, { timeout: 20_000 });
    await expect(page.locator('.demo-error')).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}
