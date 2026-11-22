import { expect, test } from './fixtures';

test('切换详情后卸载的 TextArea 停止测量，新的 TextArea 正常自动增高', async ({
  page,
  packedConsumer,
}) => {
  const errors: Error[] = [];
  page.on('pageerror', (error) => errors.push(error));
  await page.goto(`${packedConsumer.url}?textarea-autosize`);
  const duplicate = page.getByRole('textbox', { name: '重复缺陷备注' });
  await expect(duplicate).toBeVisible();

  await page.getByRole('button', { name: '查看原缺陷' }).click();
  await expect(duplicate).toHaveCount(0);
  const original = page.getByRole('textbox', { name: '原缺陷备注' });
  await expect(original).toBeVisible();
  const height = () => original.evaluate((element) => element.getBoundingClientRect().height);
  const initialHeight = await height();
  await original.fill('第一行\n第二行\n第三行');

  await expect.poll(height).toBeGreaterThan(initialHeight);
  expect(errors).toEqual([]);
});
