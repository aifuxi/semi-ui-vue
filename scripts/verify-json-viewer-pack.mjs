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
    `import { createApp, h, ref } from 'vue';
import { Button, CodeHighlight, Input, Select } from '@aifuxi/semi-ui-vue';
import { JsonViewer } from '@aifuxi/semi-ui-vue/json-viewer';
import '@aifuxi/semi-theme-default/json-viewer.css';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/input.css';
import '@aifuxi/semi-theme-default/select.css';
import '@aifuxi/semi-theme-default/code-highlight.css';
const input = ref('Initial');
const selected = ref('first');
createApp({ render: () => h('main', [
  h(Button, { onClick: () => { input.value = 'Clicked'; } }, () => 'Packed button'),
  h(Input, { value: input.value, 'aria-label': 'Packed input', onChange: value => { input.value = value; } }),
  h(Select, { value: selected.value, 'aria-label': 'Packed select', optionList: [{ label: 'First', value: 'first' }, { label: 'Second', value: 'second' }], onChange: value => { selected.value = value; } }),
  h('output', { id: 'packed-state' }, input.value + ':' + selected.value),
  h(CodeHighlight, { code: ${JSON.stringify('const ready = true;\nready();')}, language: 'javascript' }),
  h(JsonViewer, { value: '{"name":"Semi"}', width: 600, height: 160 }),
]) }).mount('#app');`,
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
  const errors = [];
  try {
    browser = await chromium.launch({ channel: 'chromium', headless: true });
    const page = await browser.newPage();
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    await page.getByRole('button', { name: 'Packed button', exact: true }).click();
    await expect(page.getByRole('textbox', { name: 'Packed input' })).toHaveValue('Clicked');
    await page.getByRole('textbox', { name: 'Packed input' }).fill('Edited');
    await expect(page.locator('#packed-state')).toHaveText('Edited:first');
    await page.locator('.semi-select').click();
    await page.getByRole('option', { name: /Second/ }).click();
    await expect(page.locator('#packed-state')).toHaveText('Edited:second');
    await expect(page.locator('.line-numbers-rows > span')).toHaveCount(2);
    await expect(page.locator('.semi-codeHighlight .token.keyword').first()).toHaveText('const');
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
  } catch (error) {
    throw new Error(`Packed JsonViewer failed; browser errors: ${JSON.stringify(errors)}`, {
      cause: error,
    });
  } finally {
    await browser?.close();
    await new Promise((resolve) => server.close(resolve));
  }
}
