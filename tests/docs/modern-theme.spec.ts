import { expect, test } from '@playwright/test';
import { expectElevatedShadow } from './theme-assertions';

test('modern theme 保留各主题下的圆角，Button 沿用默认阴影与焦点轮廓', async ({ page }) => {
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
  const disabledBorderless = page
    .locator('[data-demo-id="zh-CN-basic-button-12"] .semi-button-borderless')
    .first();
  const grouped = page
    .locator('[data-demo-id="zh-CN-basic-button-15"] .semi-button-group .semi-button')
    .first();

  for (const mode of ['light', 'dark'] as const) {
    if (mode === 'dark') await page.getByRole('button', { name: '切换到暗色模式' }).click();
    const body = page.locator('body');
    await expect(body).toHaveAttribute('theme-mode', mode);
    for (const scope of ['', 'semi-always-dark', 'semi-always-light']) {
      const region = scope ? solid.locator('..') : body;
      if (scope) await region.evaluate((element, name) => element.classList.add(name), scope);
      const radii = await region.evaluate((element) => {
        const style = getComputedStyle(element);
        return ['extra-small', 'small', 'medium', 'large', 'circle', 'full'].map((size) =>
          style.getPropertyValue(`--semi-border-radius-${size}`).trim(),
        );
      });
      expect(radii).toEqual(['4px', '8px', '16px', '24px', '50%', '9999px']);
      await expect(solid).toHaveCSS('border-radius', '8px');
      await expect(solid).toHaveCSS('box-shadow', 'none');
      if (scope) await region.evaluate((element, name) => element.classList.remove(name), scope);
    }

    for (const button of [
      solid,
      light,
      outline,
      borderless,
      disabled,
      disabledBorderless,
      grouped,
    ]) {
      await expect(button).toHaveCSS('box-shadow', 'none');
    }
    await expect(borderless).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await borderless.hover();
    await expect(borderless).toHaveCSS('box-shadow', 'none');
    await page.mouse.down();
    await expect(borderless).toHaveCSS('box-shadow', 'none');
    await page.mouse.up();
    await disabledBorderless.hover();
    await expect(disabledBorderless).toHaveCSS('box-shadow', 'none');
  }

  await solid.focus();
  await page.keyboard.press('Tab');
  await expect(
    page.locator('[data-demo-id="zh-CN-basic-button-5"] .semi-button-solid').nth(1),
  ).toHaveCSS('outline-style', 'solid');
});

test('modern theme 保留 Card 圆角及默认的常驻、悬浮和网格阴影', async ({ page }) => {
  await page.goto('/zh-CN/show/card');

  const bordered = page.locator('[data-demo-id="zh-CN-show-card-4"] .semi-card').first();
  const borderless = page.locator('[data-demo-id="zh-CN-show-card-5"] .semi-card').first();
  const hover = page.locator('[data-demo-id="zh-CN-show-card-6"] .semi-card-shadows-hover');
  const always = page.locator('[data-demo-id="zh-CN-show-card-6"] .semi-card-shadows-always');
  const grid = page
    .locator('[data-demo-id="zh-CN-show-card-15"] .semi-card-group-grid > .semi-card')
    .first();

  for (const mode of ['light', 'dark'] as const) {
    if (mode === 'dark') await page.getByRole('button', { name: '切换到暗色模式' }).click();
    await expect(page.locator('body')).toHaveAttribute('theme-mode', mode);
    await expect(bordered).toHaveCSS('border-radius', '16px');
    for (const card of [bordered, borderless, grid, hover]) {
      await expect(card).toHaveCSS('box-shadow', 'none');
    }
    await expect(grid).toHaveCSS('border-radius', '0px');
    await expectElevatedShadow(always);
    await grid.hover();
    await expectElevatedShadow(grid);
    await hover.hover();
    await expectElevatedShadow(hover);
    await page.mouse.move(0, 0);
    await expect(hover).toHaveCSS('box-shadow', 'none');
  }
});
