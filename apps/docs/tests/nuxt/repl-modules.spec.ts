import { expect, test } from '@playwright/test';

test('REPL 公开入口共享实例并可渲染 Chat Markdown', async ({ page, request }) => {
  const response = await request.get('/repl/import-map.json');
  expect(response.ok()).toBe(true);
  const importMap = await response.json();
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/repl-contract.html', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: `<div id="app"></div><script type="importmap">${JSON.stringify(importMap)}</script>`,
    }),
  );
  await page.goto('/repl-contract.html');
  const result = await page.evaluate(async () => {
    // Resolve the site's import map in the browser, without a Nuxt module transform.
    const load = (specifier: string) => import(specifier);
    const ui = await load('@aifuxi/semi-ui-vue');
    const typography = await load('@aifuxi/semi-ui-vue/typography');
    const icons = await load('@aifuxi/semi-icons-vue');
    const icon = await load('@aifuxi/semi-icons-vue/icons/IconAlertCircle');
    const { createApp, h, nextTick } = await load('vue');
    const app = createApp(() =>
      h(ui.Chat, {
        chats: [{ id: '1', role: 'assistant', content: '[link](https://example.com) **bold**' }],
        roleConfig: { assistant: { name: 'Assistant' } },
      }),
    );
    app.mount('#app');
    await nextTick();
    const result = {
      typography: ui.Typography === typography.Typography,
      icon: icons.IconAlertCircle === icon.default,
      bold: document.querySelector('strong')?.textContent,
      link: document.querySelector('a')?.href,
    };
    app.unmount();
    return result;
  });
  expect(result).toEqual({
    typography: true,
    icon: true,
    bold: 'bold',
    link: 'https://example.com/',
  });
  expect(errors).toEqual([]);
});
