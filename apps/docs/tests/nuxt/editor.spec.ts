import { expect, test } from '@playwright/test';

test('多文件编辑、运行、编译和运行错误恢复、重置与实例隔离', async ({ page }) => {
  await page.goto('/en-us/start/getting-started/');
  const counter = page.locator('[data-demo-id="guides/en-us/state/Counter"]');
  const other = page.locator('[data-demo-id="guides/en-us/GettingStarted1"]');
  await counter.getByRole('button', { name: 'Edit online', exact: true }).click();
  const frame = counter.frameLocator('iframe');
  await expect(frame.getByRole('button', { name: 'Clicks: 0', exact: true })).toBeVisible();
  await frame.getByRole('button', { name: 'Clicks: 0', exact: true }).click();
  await expect(frame.getByRole('button', { name: 'Clicks: 1', exact: true })).toBeVisible();
  await expect(counter.getByText('initial.ts', { exact: true })).toBeVisible();
  const editor = counter.locator('.monaco-editor textarea.inputarea');
  async function edit(source: string) {
    await editor.focus();
    await editor.press('ControlOrMeta+A');
    await page.keyboard.insertText(source);
    await counter.getByRole('button', { name: 'Run', exact: true }).click();
  }
  await edit(
    '<script setup lang="ts">const value = ;</script><template><p>{{ value }}</p></template>',
  );
  await expect(counter.locator('.msg.err').first()).toBeVisible();
  await edit(
    '<script setup lang="ts">throw new Error("demo-runtime-error")</script><template><p>broken</p></template>',
  );
  await expect(counter.getByText(/demo-runtime-error/).last()).toBeVisible();
  await edit(
    '<script setup lang="ts">import { initialCount } from "./initial.ts";</script><template><p>Recovered: {{ initialCount }}</p></template>',
  );
  await expect(frame.getByText('Recovered: 0', { exact: true })).toBeVisible();
  await other.getByRole('button', { name: 'Edit online', exact: true }).click();
  await expect(
    other.frameLocator('iframe').getByRole('button', { name: 'Get started', exact: true }),
  ).toBeVisible();
  await expect(frame.getByText('Recovered: 0', { exact: true })).toBeVisible();
  await counter.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(frame.getByRole('button', { name: 'Clicks: 0', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Guide', exact: true }).click();
  await page.getByRole('link', { name: 'Semi UI Vue', exact: true }).click();
  await expect(page.locator('.demo-editor iframe')).toHaveCount(0);
});

test('上传示例只模拟本地响应', async ({ page }) => {
  const submissions: string[] = [];
  page.on('request', (request) => {
    if (request.method() === 'POST') submissions.push(request.url());
  });
  await page.goto('/en-us/components/upload/');
  const demo = page.locator('[data-demo-id="upload/en-US/Example1"]');
  await demo.locator('input.semi-upload-hidden-input').setInputFiles({
    name: 'sample.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4\nlocal demonstration'),
  });
  await expect(demo).toContainText('sample.pdf');
  await expect(demo.locator('.semi-upload-file-fail')).toHaveCount(0);
  expect(submissions).toEqual([]);
});
