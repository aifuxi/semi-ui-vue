import { test, expect } from './fixtures';

test('真实 tarball 支持组件交互、Prism 高亮与 JsonViewer Worker 搜索替换', async ({
  page,
  packedConsumer,
}, testInfo) => {
  const errors: string[] = [];
  const workerUrls: string[] = [];
  const origin = new URL(packedConsumer.url).origin;
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('requestfailed', (request) => {
    errors.push(request.url() + ': ' + request.failure()?.errorText);
  });
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== origin) {
      errors.push('Consumer requested an unexpected origin: ' + request.url());
    }
  });
  page.on('worker', (worker) => workerUrls.push(worker.url()));
  await testInfo.attach('packed-consumer-provenance', {
    body: JSON.stringify(packedConsumer.provenance, null, 2),
    contentType: 'application/json',
  });

  try {
    await page.goto(packedConsumer.url);
    await test.step('Button、Input 与 Select 使用真实安装包响应交互', async () => {
      await page.getByRole('button', { name: 'Packed button', exact: true }).click();
      await expect(page.getByRole('textbox', { name: 'Packed input' })).toHaveValue('Clicked');
      await page.getByRole('textbox', { name: 'Packed input' }).fill('Edited');
      await expect(page.locator('#packed-state')).toHaveText('Edited:first');
      await page.locator('.semi-select').click();
      await page.getByRole('option', { name: /Second/ }).click();
      await expect(page.locator('#packed-state')).toHaveText('Edited:second');
    });

    await test.step('Prism 工厂与行号插件在生产包中保留', async () => {
      await expect(page.locator('.line-numbers-rows > span')).toHaveCount(2);
      await expect(page.locator('.semi-codeHighlight .token.keyword').first()).toHaveText('const');
    });

    await test.step('内联 JsonViewer Worker 完成搜索、替换和关闭', async () => {
      await expect(page.locator('.lines-content')).toContainText('Semi');
      await page.getByRole('button', { name: '查找', exact: true }).click();
      await page.getByRole('textbox', { name: '查找', exact: true }).fill('Semi');
      await expect(page.locator('.semi-json-viewer-search-result')).toHaveCount(1);
      await page.getByRole('textbox', { name: '替换', exact: true }).fill('Packed worker');
      await page.getByRole('button', { name: '替换', exact: true }).click();
      await expect(page.locator('.lines-content')).toContainText('Packed worker');
      await page.getByRole('button', { name: 'Close search', exact: true }).click();
      await expect(page.getByRole('textbox', { name: '查找', exact: true })).toHaveCount(0);
      expect(workerUrls.length).toBeGreaterThan(0);
      expect(workerUrls.every((url) => url.startsWith('blob:' + origin + '/'))).toBe(true);
    });
    expect(errors).toEqual([]);
  } finally {
    await testInfo.attach('packed-consumer-browser-errors', {
      body: JSON.stringify({ errors, workerUrls }, null, 2),
      contentType: 'application/json',
    });
  }
});
