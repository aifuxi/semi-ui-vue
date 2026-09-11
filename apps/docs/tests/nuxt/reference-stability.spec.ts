import { expect, test } from '@playwright/test';

test('冷加载其他文档示例不会重载已就绪的 React 参考页', async ({ context }) => {
  const anchor = await context.newPage();
  const url = (component: string, locale: string, example: number) =>
    `http://127.0.0.1:4173/docs.html?component=${component}&locale=${locale}&theme=light&example=${example}`;
  await anchor.goto(url('button', 'zh-cn', 1));
  await expect(anchor.locator('#root .semi-button').first()).toBeVisible();
  await anchor.locator('#root').evaluate((root) => {
    root.setAttribute('data-stability-marker', 'ready');
    root.setAttribute('dir', 'rtl');
    (root as HTMLElement).style.padding = '24px';
  });
  const navigations: string[] = [];
  anchor.on('framenavigated', (frame) => {
    if (frame === anchor.mainFrame()) navigations.push(frame.url());
  });

  // Cold modules in another page must not reset an in-progress comparison's DOM or focus.
  for (const [component, locale, example, selector] of [
    ['button', 'zh-cn', 9, '.semi-button'],
    ['button', 'en-us', 17, '.semi-button'],
    ['config-provider', 'zh-cn', 1, '.semi-select'],
    ['config-provider', 'zh-cn', 2, '.semi-typography'],
  ] as const) {
    await test.step(`${component}/${locale}/${example}`, async () => {
      const page = await context.newPage();
      await page.goto(url(component, locale, example));
      await expect(page.locator(`#root ${selector}`).first()).toBeVisible({ timeout: 10_000 });
      await expect(anchor.locator('#root')).toHaveAttribute('data-stability-marker', 'ready');
      await expect(anchor.locator('#root')).toHaveAttribute('dir', 'rtl');
      await expect(anchor.locator('#root')).toHaveCSS('padding', '24px');
      expect(navigations).toEqual([]);
      await page.close();
    });
  }
});
