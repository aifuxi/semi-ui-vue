import { readFile, writeFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

test('Rspack 更新示例模板时保留状态，并自动显示和还原 Markdown 正文', async ({ page }) => {
  const vuePath = new URL('../../src/demos/guides/en-us/state/Counter.vue', import.meta.url);
  const contentPath = new URL('../../content/en-us/start/introduction.md', import.meta.url);
  const vue = await readFile(vuePath, 'utf8');
  const content = await readFile(contentPath, 'utf8');
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  try {
    await page.goto('/en-us/start/getting-started/');
    const demo = page.locator('[data-demo-id="guides/en-us/state/Counter"]');
    await demo.getByRole('button', { name: 'Clicks: 0', exact: true }).click();
    await expect(demo.getByRole('button', { name: 'Clicks: 1', exact: true })).toBeVisible();
    await writeFile(vuePath, vue.replace('Clicks: {{ count }}', 'HMR Clicks: {{ count }}'));
    await expect(demo.getByRole('button', { name: 'HMR Clicks: 1', exact: true })).toBeVisible({
      timeout: 30_000,
    });
    await writeFile(vuePath, vue);
    await expect(demo.getByRole('button', { name: 'Clicks: 1', exact: true })).toBeVisible({
      timeout: 30_000,
    });

    await page.goto('/en-us/start/introduction/');
    await expect(page.getByRole('heading', { name: /^What is Semi UI Vue\?/ })).toBeVisible();
    await writeFile(
      contentPath,
      content.replace('## What is Semi UI Vue?', '## HMR What is Semi UI Vue?'),
    );
    await expect(page.getByRole('heading', { name: /^HMR What is Semi UI Vue\?/ })).toBeVisible({
      timeout: 30_000,
    });
    await writeFile(contentPath, content);
    await expect(page.getByRole('heading', { name: /^What is Semi UI Vue\?/ })).toBeVisible({
      timeout: 30_000,
    });
    expect(errors).toEqual([]);
  } finally {
    await writeFile(vuePath, vue);
    await writeFile(contentPath, content);
  }
});
