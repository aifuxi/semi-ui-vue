import { readdir } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { expect, test } from '@playwright/test';

const workspaceRoot = resolve(import.meta.dirname, '../..');
const tier = (process.env.DOCS_EXAMPLE_TIER ?? 't3').toLowerCase();
if (!/^t[1-5]$/.test(tier)) throw new Error('DOCS_EXAMPLE_TIER 必须是 t1 至 t5');

const examplesRoot = resolve(workspaceRoot, 'apps/docs/.vitepress/theme/demo/examples', tier);
const vendorContentRoot = resolve(workspaceRoot, 'vendor/semi-design/content');
const routeSlugOverrides: Record<string, string> = { 'locale-provider': 'locale' };
const normalizeSlug = (value: string) => value.toLowerCase().replaceAll(/[-_]/g, '');

const vendorPages = (
  await Promise.all(
    (await readdir(vendorContentRoot, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map(async (category) =>
        (await readdir(resolve(vendorContentRoot, category.name), { withFileTypes: true }))
          .filter((entry) => entry.isDirectory())
          .map((entry) => ({ category: category.name, slug: entry.name })),
      ),
  )
).flat();

const pages = await Promise.all(
  (await readdir(examplesRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map(async (component) => {
      const routeSlug = routeSlugOverrides[component.name] ?? component.name;
      const matches = vendorPages.filter(
        (page) => normalizeSlug(page.slug) === normalizeSlug(routeSlug),
      );
      const match = matches[0];
      if (!match || matches.length !== 1) {
        throw new Error(`${component.name} 匹配到 ${matches.length} 个文档路由`);
      }
      const entries = await readdir(resolve(examplesRoot, component.name), { recursive: true });
      return {
        component: component.name,
        route: `/zh-CN/${match.category}/${match.slug}`,
        expectedExamples: entries.filter((entry) => /^zh-CN-.*\.vue$/.test(basename(entry))).length,
      };
    }),
);

for (const { component, route, expectedExamples } of pages) {
  test(`${tier.toUpperCase()} ${component}：${expectedExamples} 个示例可运行且无客户端错误`, async ({
    page,
  }) => {
    const clientErrors: string[] = [];
    page.setDefaultTimeout(5_000);
    page.setDefaultNavigationTimeout(15_000);
    page.on('console', (message) => {
      if (message.type() === 'error' && !message.text().startsWith('Failed to load resource:')) {
        clientErrors.push(message.text());
      }
    });
    page.on('pageerror', (error) => clientErrors.push(error.message));
    page.on('response', (response) => {
      if (response.status() >= 400) clientErrors.push(`${response.status()} ${response.url()}`);
    });

    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const liveExamples = page.locator('.demo-block[data-demo-kind="live"]');
    await expect.soft(liveExamples).toHaveCount(expectedExamples);
    await expect
      .soft(liveExamples.locator('.demo-block-status-ready'))
      .toHaveCount(expectedExamples);
    expect.soft(clientErrors, `客户端错误：\n${clientErrors.join('\n')}`).toEqual([]);
  });
}

if (tier === 't4') {
  test('T4 Select 可打开选项面板', async ({ page }) => {
    await page.goto('/zh-CN/input/select');
    const triggers = page
      .locator('.demo-block-preview')
      .first()
      .locator('[role="combobox"]:not([aria-disabled="true"])');
    await expect(triggers).toHaveCount(2);
    await triggers.first().press('Enter');
    await expect(triggers.first()).toHaveAttribute('aria-expanded', 'true');
  });

  test('T4 DragMove 可拖动元素', async ({ page }) => {
    await page.goto('/zh-CN/plus/dragMove');
    const item = page.locator('.demo-block-preview').first().getByText('Drag me', { exact: true });
    await expect(item).toHaveCount(1);
    await item.scrollIntoViewIfNeeded();
    const before = await item.getAttribute('style');
    const box = await item.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2 + 40, box!.y + box!.height / 2 + 20, {
      steps: 3,
    });
    await page.mouse.up();
    expect(await item.getAttribute('style')).not.toBe(before);
  });

  test('T4 Resizable 可拖动手柄改变宽度', async ({ page }) => {
    await page.goto('/zh-CN/basic/resizable');
    const preview = page.locator('.demo-block-preview').first();
    const box = preview.locator('.semi-resizable-resizable');
    const handle = preview.locator('.semi-resizable-resizableHandler-right');
    await expect(box).toHaveCount(1);
    await expect(handle).toHaveCount(1);
    await handle.scrollIntoViewIfNeeded();
    const before = await box.boundingBox();
    const target = await handle.boundingBox();
    expect(before).not.toBeNull();
    expect(target).not.toBeNull();
    await page.mouse.move(target!.x + target!.width / 2, target!.y + target!.height / 2);
    await page.mouse.down();
    await page.mouse.move(target!.x + target!.width / 2 + 80, target!.y + target!.height / 2, {
      steps: 5,
    });
    await page.mouse.up();
    expect((await box.boundingBox())!.width).toBeGreaterThan(before!.width + 20);
  });

  test('T4 VideoPlayer 可开始播放本地视频', async ({ page }) => {
    await page.goto('/zh-CN/plus/videoPlayer');
    const preview = page.locator('.demo-block-preview').first();
    const video = preview.locator('video');
    const buttons = preview.locator('button');
    await expect(video).toHaveCount(1);
    expect(await buttons.count()).toBeGreaterThan(0);
    await buttons.first().click();
    await expect
      .poll(() => video.evaluate((element) => (element as HTMLVideoElement).paused))
      .toBe(false);
  });

  test('T4 Upload 可选择文件并生成文件卡片', async ({ page }) => {
    await page.goto('/zh-CN/input/upload');
    const preview = page.locator('.demo-block-preview').first();
    const inputs = preview.locator('input[type="file"]');
    await expect(inputs).toHaveCount(2);
    await inputs.first().setInputFiles(resolve(workspaceRoot, 'apps/docs/assets/one.svg'));
    await expect(preview.locator('.semi-upload-file-card')).toHaveCount(1);
  });
}
