import { expect, test } from './fixtures';

for (const motion of [true, false]) {
  test(`Select 展开时第一次 Esc 只收起下拉，第二次 Esc 关闭 Modal，motion=${motion}`, async ({
    page,
    packedConsumer,
  }) => {
    await page.goto(`${packedConsumer.url}?select-escape${motion ? '' : '&no-motion'}`);
    const dialog = page.getByRole('dialog', { name: '分享设置' });
    const trigger = dialog.getByRole('combobox', { name: '分享权限' });
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Escape');
    await expect(dialog).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });
}

for (const input of ['mouse', 'keyboard'] as const) {
  test(`Select ${input} 选中后焦点仍留在触发器，Esc 关闭 Modal`, async ({
    page,
    packedConsumer,
  }) => {
    await page.goto(`${packedConsumer.url}?select-escape`);
    const dialog = page.getByRole('dialog', { name: '分享设置' });
    const trigger = dialog.getByRole('combobox', { name: '分享权限' });
    await trigger.click();
    if (input === 'mouse') {
      await page.getByRole('option', { name: '编辑' }).click();
    } else {
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
    }
    await expect(trigger).toContainText('编辑');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });
}
