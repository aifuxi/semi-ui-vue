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
  // 可见时浏览器可能仍按原生 rows 布局，等自动测量写入初始高度。
  await expect.poll(() => original.evaluate((element) => element.style.height)).not.toBe('');
  const height = () => original.evaluate((element) => element.getBoundingClientRect().height);
  const initialHeight = await height();
  await original.fill('第一行\n第二行\n第三行');

  await expect.poll(height).toBeGreaterThan(initialHeight);
  expect(errors).toEqual([]);
});

test('父级 v-model 回填与清空后，真实安装包 TextArea 自动增高和回缩', async ({
  page,
  packedConsumer,
}) => {
  const errors: Error[] = [];
  page.on('pageerror', (error) => errors.push(error));
  await page.goto(`${packedConsumer.url}?textarea-controlled-autosize`);
  const textarea = page.getByRole('textbox', { name: '受控备注' });
  await expect(textarea).toHaveValue('短文本');
  await expect.poll(() => textarea.evaluate((element) => element.style.height)).not.toBe('');
  const height = () => textarea.evaluate((element) => element.getBoundingClientRect().height);
  const initialHeight = await height();

  await page.getByRole('button', { name: '回填多行备注' }).click();
  await expect(textarea).toHaveValue('第一行\n第二行\n第三行');
  await expect.poll(height).toBeGreaterThan(initialHeight);

  await page.getByRole('button', { name: '清空备注' }).click();
  await expect(textarea).toHaveValue('');
  await expect.poll(height).toBe(initialHeight);
  expect(errors).toEqual([]);
});
