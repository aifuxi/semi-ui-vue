import { expect, test, type Locator } from '@playwright/test';

async function shadowOf(locator: Locator): Promise<string> {
  return locator.evaluate((element) => getComputedStyle(element).boxShadow);
}

test('modern theme 的 Button 仅为独立填充按钮增加内侧层次', async ({ page }) => {
  await page.goto('/zh-CN/basic/button');

  const solid = page.locator('[data-demo-id="zh-CN-basic-button-5"] .semi-button-solid').first();
  const light = page.locator('[data-demo-id="zh-CN-basic-button-4"] .semi-button-light').first();
  const outline = page
    .locator('[data-demo-id="zh-CN-basic-button-7"] .semi-button-outline')
    .first();
  const borderless = page
    .locator('[data-demo-id="zh-CN-basic-button-6"] .semi-button-borderless')
    .first();
  const disabled = page.locator('[data-demo-id="zh-CN-basic-button-12"] .semi-button-solid');
  const grouped = page
    .locator('[data-demo-id="zh-CN-basic-button-15"] .semi-button-group .semi-button')
    .first();

  await expect(solid).toBeVisible();
  const lightModeShadow = await shadowOf(solid);
  expect(lightModeShadow).toContain('inset');
  expect(lightModeShadow).toContain('0px 2px 4px');
  const lightButtonShadow = await shadowOf(light);
  expect(lightButtonShadow).toContain('inset');
  expect(lightButtonShadow).not.toBe(lightModeShadow);
  for (const button of [outline, borderless, disabled, grouped]) {
    await expect(button).toHaveCSS('box-shadow', 'none');
  }

  const buttonRegion = solid.locator('..');
  await buttonRegion.evaluate((element) => element.classList.add('semi-always-dark'));
  expect(await shadowOf(solid)).not.toBe(lightModeShadow);
  await buttonRegion.evaluate((element) => element.classList.remove('semi-always-dark'));
  expect(await shadowOf(solid)).toBe(lightModeShadow);

  await solid.focus();
  await page.keyboard.press('Tab');
  await expect(
    page.locator('[data-demo-id="zh-CN-basic-button-5"] .semi-button-solid').nth(1),
  ).toHaveCSS('outline-style', 'solid');

  await page.getByRole('button', { name: '切换到暗色模式' }).click();
  await expect(page.locator('body')).toHaveAttribute('theme-mode', 'dark');
  const darkModeShadow = await shadowOf(solid);
  expect(darkModeShadow).toContain('inset');
  expect(darkModeShadow).not.toBe(lightModeShadow);

  await buttonRegion.evaluate((element) => element.classList.add('semi-always-light'));
  expect(await shadowOf(solid)).toBe(lightModeShadow);
});

test('modern theme 的独立 Card 仅使用细边缘阴影并保留网格边界', async ({ page }) => {
  await page.goto('/zh-CN/show/card');

  const bordered = page.locator('[data-demo-id="zh-CN-show-card-4"] .semi-card').first();
  const borderless = page.locator('[data-demo-id="zh-CN-show-card-5"] .semi-card').first();
  const hover = page.locator('[data-demo-id="zh-CN-show-card-6"] .semi-card-shadows-hover');
  const always = page.locator('[data-demo-id="zh-CN-show-card-6"] .semi-card-shadows-always');
  const grid = page
    .locator('[data-demo-id="zh-CN-show-card-15"] .semi-card-group-grid > .semi-card')
    .first();

  await expect(bordered).toBeVisible();
  const lightModeShadow = await shadowOf(bordered);
  expect(lightModeShadow).toContain('inset');
  await expect(borderless).toHaveCSS('box-shadow', 'none');
  await expect(grid).toHaveCSS('box-shadow', 'none');
  await expect(always).toHaveCSS('box-shadow', lightModeShadow);
  await expect(hover).toHaveCSS('box-shadow', lightModeShadow);
  const cardRegion = bordered.locator('..');
  await cardRegion.evaluate((element) => element.classList.add('semi-always-dark'));
  expect(await shadowOf(bordered)).not.toBe(lightModeShadow);
  await cardRegion.evaluate((element) => element.classList.remove('semi-always-dark'));
  expect(await shadowOf(bordered)).toBe(lightModeShadow);

  await grid.hover();
  await expect(grid).toHaveCSS('box-shadow', /4px 14px/);
  expect(await shadowOf(grid)).not.toContain('inset');
  await hover.hover();
  await expect(hover).toHaveCSS('box-shadow', lightModeShadow);

  await page.getByRole('button', { name: '切换到暗色模式' }).click();
  await expect(page.locator('body')).toHaveAttribute('theme-mode', 'dark');
  const darkModeShadow = await shadowOf(bordered);
  expect(darkModeShadow).toContain('inset');
  expect(darkModeShadow).not.toBe(lightModeShadow);

  await cardRegion.evaluate((element) => element.classList.add('semi-always-light'));
  expect(await shadowOf(bordered)).toBe(lightModeShadow);
});
