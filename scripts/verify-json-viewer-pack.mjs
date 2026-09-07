import { createServer } from 'node:http';
import path from 'node:path';
import { build } from 'vite';
import { writeFile } from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';

// Source parity alone cannot detect an empty inline Worker in the published bundle.
export async function verifyJsonViewerPackedWorker(consumerRoot) {
  const entry = path.join(consumerRoot, 'worker-consumer-entry.js');
  await writeFile(
    entry,
    `import { createApp, h } from 'vue';
import { JsonViewer } from '@aifuxi/semi-ui-vue/json-viewer';
import '@aifuxi/semi-theme-default/json-viewer.css';
createApp({ render: () => h(JsonViewer, { value: '{"name":"Semi"}', width: 600, height: 160 }) }).mount('#app');`,
  );
  const result = await build({
    root: consumerRoot,
    configFile: false,
    logLevel: 'silent',
    build: {
      write: false,
      lib: {
        entry,
        formats: ['es'],
        fileName: () => 'worker-consumer.js',
        cssFileName: 'worker-consumer',
      },
    },
    define: { 'process.env.NODE_ENV': '"production"' },
  });
  const files = new Map(
    (Array.isArray(result) ? result.flatMap((output) => output.output) : result.output).map(
      (file) => [`/${file.fileName}`, file.type === 'chunk' ? file.code : file.source],
    ),
  );
  const server = createServer((request, response) => {
    if (request.url === '/') {
      response.setHeader('content-type', 'text/html');
      response.end(
        '<link rel="stylesheet" href="/worker-consumer.css"><div id="app"></div><script type="module" src="/worker-consumer.js"></script>',
      );
      return;
    }
    const content = files.get(request.url);
    response.statusCode = content === undefined ? 404 : 200;
    response.setHeader(
      'content-type',
      request.url.endsWith('.css') ? 'text/css' : 'text/javascript',
    );
    response.end(content ?? '');
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    await expect(page.locator('.lines-content')).toContainText('Semi');
    await page.getByRole('button', { name: '查找', exact: true }).click();
    await page.getByRole('textbox', { name: '查找', exact: true }).fill('Semi');
    await expect(page.locator('.semi-json-viewer-search-result')).toHaveCount(1);
    await page.getByRole('textbox', { name: '替换', exact: true }).fill('Packed worker');
    await page.getByRole('button', { name: '替换', exact: true }).click();
    await expect(page.locator('.lines-content')).toContainText('Packed worker');
    await page.getByRole('button', { name: 'Close search', exact: true }).click();
    await expect(page.getByRole('textbox', { name: '查找', exact: true })).toHaveCount(0);
    expect(errors).toEqual([]);
  } finally {
    await browser?.close();
    await new Promise((resolve) => server.close(resolve));
  }
}
