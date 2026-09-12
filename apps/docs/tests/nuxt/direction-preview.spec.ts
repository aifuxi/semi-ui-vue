import { expect, test } from '@playwright/test';

const basic = '[data-demo-id="table/en-us/Basic"]';
const preview = `${basic} [data-demo-preview]`;

test('文档方向预览：未指定或非法方向保持默认树', async ({ page }) => {
  for (const query of ['', '?direction=invalid', '?direction=rtl&direction=ltr']) {
    await page.goto(`/en-us/components/table/${query}`);
    await expect(page.locator(`${preview} > .semi-table-wrapper-ltr`)).toHaveCount(1);
    await expect(page.locator(`${preview} > .semi-rtl`)).toHaveCount(0);
  }
});

test('文档方向预览：显式 LTR 保留英文内容与源码', async ({ page }) => {
  await page.goto('/en-us/components/table/?direction=ltr');
  await expect(page.locator(`${preview} > .semi-table-wrapper-ltr`)).toHaveCount(1);
  await expect(page.locator(`${preview} th`).first()).toContainText('Title');
  const source = page.locator(`${basic} [data-demo-source]`);
  await page.locator(`${basic} .demo-toolbar`).getByRole('button', { name: 'View source' }).click();
  await expect(source).toBeVisible();
  await expect(source).not.toContainText('ConfigProvider');
  await expect(
    page
      .locator('[data-demo-id="table/en-us/Selection"] [data-demo-preview]')
      .getByLabel('Page 2', { exact: true }),
  ).toBeVisible();
});

test('文档方向预览：真实 RTL 上下文在重置后保留并可恢复默认', async ({ page }) => {
  await page.goto('/en-us/components/table/?direction=rtl');
  await expect(page.locator(`${preview} > .semi-rtl > .semi-table-wrapper-rtl`)).toHaveCount(1);
  await expect(page.locator(`${preview} th`).first()).toContainText('Title');
  await page
    .locator(`${basic} .demo-toolbar`)
    .getByRole('button', { name: 'Reset', exact: true })
    .click();
  await expect(page.locator(`${preview} > .semi-rtl > .semi-table-wrapper-rtl`)).toHaveCount(1);
  await page.goto('/en-us/components/table/');
  await expect(page.locator(`${preview} > .semi-table-wrapper-ltr`)).toHaveCount(1);
  await expect(page.locator(`${preview} > .semi-rtl`)).toHaveCount(0);
});
