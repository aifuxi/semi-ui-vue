import { expect, test } from './fixtures';

for (const scenario of ['custom', 'built-in', 'span', 'tag', 'controlled', 'no-focus']) {
  for (const key of ['Enter', 'Space']) {
    test(`真实 tarball Dropdown 用 ${key} 展开菜单仅激活一次触发器：${scenario}`, async ({
      page,
      packedConsumer,
    }) => {
      await page.goto(`${packedConsumer.url}?dropdown-activation=${scenario}`);
      const trigger = page.getByTestId('dropdown-activation-trigger');
      const item = page.getByRole('menuitem', { name: '首项' });
      const status = page.getByText(/^trigger=/);

      await trigger.press(key);
      await expect(item).toBeVisible();
      await expect(scenario === 'no-focus' ? trigger : item).toBeFocused();
      await expect(status).toHaveText('trigger=1;actions=0');

      await item.press(key);
      await expect(status).toHaveText('trigger=1;actions=1');
    });
  }
}

test('真实 tarball Dropdown 的文本输入触发器保留空格和 Enter 提交', async ({
  page,
  packedConsumer,
}) => {
  await page.goto(`${packedConsumer.url}?dropdown-activation=input`);
  const input = page.getByRole('textbox', { name: '搜索操作' });
  const item = page.getByRole('menuitem', { name: '首项' });
  const status = page.getByText(/^trigger=/);

  await input.fill('搜索');
  await input.press('Space');
  await expect(input).toHaveValue('搜索 ');
  await input.press('Enter');
  await expect(page.getByTestId('dropdown-activation-submits')).toHaveText('1');
  await expect(status).toHaveText('trigger=0;actions=0');
  await expect(item).toHaveCount(0);

  await input.click();
  await expect(item).toBeFocused();
  await expect(status).toHaveText('trigger=1;actions=0');
});
