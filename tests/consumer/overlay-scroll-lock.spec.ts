import { expect, test } from './fixtures';

test('真实 tarball 的 Modal 根入口与 SideSheet 子路径共享页面滚动锁', async ({
  page,
  packedConsumer,
}) => {
  await page.goto(packedConsumer.url + '?overlay-scroll-lock');
  const readBodyStyles = () =>
    page.locator('body').evaluate(({ style }: HTMLElement) => ({
      overflow: style.overflow,
      overflowY: style.overflowY,
      overflowYPriority: style.getPropertyPriority('overflow-y'),
      width: style.width,
    }));

  const openModal = page.getByRole('button', { name: '打开页面弹窗' });
  await expect(openModal).toBeVisible();
  const originalStyles = await readBodyStyles();
  expect(originalStyles).toEqual({
    overflow: '',
    overflowY: 'scroll',
    overflowYPriority: 'important',
    width: '80%',
  });
  await openModal.click();
  const modal = page.getByRole('dialog', { name: '页面弹窗' });
  const sideSheet = page.getByRole('dialog', { name: '页面侧栏' });
  await expect(modal).toBeVisible();
  const lockedStyles = await readBodyStyles();
  expect(lockedStyles.overflow).toBe('hidden');
  expect(lockedStyles.width).not.toBe(originalStyles.width);

  await modal.getByRole('button', { name: '打开侧栏' }).click();
  await expect(sideSheet).toBeVisible();
  expect(await readBodyStyles()).toEqual(lockedStyles);
  await sideSheet.getByRole('button', { name: '关闭下层弹窗' }).click();
  await expect(page.locator('.semi-modal-content')).toHaveCount(0);
  await expect(sideSheet).toBeVisible();
  expect(await readBodyStyles()).toEqual(lockedStyles);

  await sideSheet.locator('.semi-sidesheet-close').click();
  await expect(page.locator('.semi-sidesheet-inner')).toHaveCount(0);
  expect(await readBodyStyles()).toEqual(originalStyles);
});
