import { expect, test } from '@playwright/test';

for (const [routeLocale, demoLocale] of [
  ['zh-cn', 'zh-CN'],
  ['en-us', 'en-US'],
] as const) {
  const zh = routeLocale === 'zh-cn';
  for (const theme of ['light', 'dark'] as const) {
    test(`Form 文档：${routeLocale} ${theme} 校验、外部控制与动态字段`, async ({ page }) => {
      await page.addInitScript((value) => localStorage.setItem('semi-docs-theme', value), theme);
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(`/${routeLocale}/components/form/`);
      await expect(page.locator('[data-demo-id]')).toHaveCount(39);
      await expect(page.locator('.demo-loading')).toHaveCount(0);
      await expect(page.locator('.demo-error')).toHaveCount(0);
      const preview = (name: string) =>
        page.locator(`[data-demo-id="form/${demoLocale}/${name}"] [data-demo-preview]`);

      const silent = preview('SilentValidation');
      await silent
        .getByRole('button', { name: zh ? '静默校验' : 'Silent validation', exact: true })
        .click();
      await expect(silent.locator('output')).toHaveText(
        zh ? '校验失败，未更新页面错误状态' : 'Validation failed without updating visible errors',
      );
      await expect(silent.locator('[aria-invalid="true"]')).toHaveCount(0);
      await silent
        .getByRole('button', { name: zh ? '普通校验' : 'Normal validation', exact: true })
        .click();
      await expect(silent.locator('[aria-invalid="true"]')).toHaveCount(2);
      await silent.getByRole('textbox').nth(0).fill('Semi');
      await silent.getByRole('textbox').nth(1).fill('semi@example.com');
      await silent
        .getByRole('button', { name: zh ? '普通校验' : 'Normal validation', exact: true })
        .click();
      await expect(silent.locator('output')).toHaveText(zh ? '校验通过' : 'Validation passed');
      await expect(silent.locator('[aria-invalid="true"]')).toHaveCount(0);

      const external = preview('ExternalForm');
      await external
        .getByRole('button', { name: zh ? '外部设置值' : 'Set value externally' })
        .click();
      await expect(external.getByRole('textbox').first()).toHaveValue('semi');
      await expect(external.locator('pre').first()).toContainText('"username": "semi"');
      await external.getByRole('button', { name: zh ? '重置' : 'Reset', exact: true }).click();
      await expect(external.getByRole('textbox').first()).toBeEmpty();

      const keep = preview('KeepState');
      await keep.getByRole('textbox').nth(0).fill('retained');
      await keep.getByRole('textbox').nth(1).fill('cleared');
      const visibility = keep.getByRole('checkbox', {
        name: zh ? '显示条件字段' : 'Show conditional fields',
      });
      await visibility.focus();
      await visibility.press('Space');
      await expect(visibility).not.toBeChecked();
      await expect(keep.getByRole('textbox')).toHaveCount(0);
      await expect(keep.locator('pre')).toContainText('retained');
      await expect(keep.locator('pre')).not.toContainText('cleared');
      await visibility.focus();
      await visibility.press('Space');
      await expect(visibility).toBeChecked();
      await expect(keep.getByRole('textbox').nth(0)).toHaveValue('retained');
      await expect(keep.getByRole('textbox').nth(1)).toBeEmpty();

      const native = preview('CustomNative');
      await native.getByRole('textbox').fill('Native field');
      await expect(native.locator('pre')).toContainText('"name": "Native field"');
      expect(errors).toEqual([]);
    });
  }

  test(`Form 文档：${routeLocale} 嵌套数组增删与提交`, async ({ page }) => {
    await page.goto(`/${routeLocale}/components/form/`);
    await expect(page.locator('.demo-loading')).toHaveCount(0);
    const preview = (name: string) =>
      page.locator(`[data-demo-id="form/${demoLocale}/${name}"] [data-demo-preview]`);
    const nested = preview('NestedArrays');
    await expect(nested.locator('.rule-row')).toHaveCount(3);
    await nested
      .getByRole('button', { name: zh ? '新增收信规则' : 'Add mail rule', exact: true })
      .click();
    await expect(nested.locator('.rule-row')).toHaveCount(5);
    await nested
      .getByRole('button', { name: zh ? '删除规则组' : 'Remove rule group', exact: true })
      .last()
      .click();
    await expect(nested.locator('.rule-row')).toHaveCount(3);
    await expect(nested.locator('pre')).not.toContainText('New rule');

    const vertical = preview('Vertical');
    await vertical.getByRole('textbox').first().fill('123456789');
    await vertical.locator('input[type="password"]').fill('Semi42');
    const submit = vertical.getByRole('button', { name: zh ? '登录' : 'Log in', exact: true });
    await expect(submit).toBeDisabled();
    await vertical.getByRole('checkbox').focus();
    await vertical.getByRole('checkbox').press('Space');
    await expect(vertical.getByRole('checkbox')).toBeChecked();
    await submit.click();
    await expect(vertical.locator('output')).toContainText('123456789');
    await expect(vertical.locator('output')).toContainText('"agree":true');
  });
}
