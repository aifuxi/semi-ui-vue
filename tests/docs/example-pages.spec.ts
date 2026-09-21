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

test('引入示例展示 Vue 代码且不运行预览', async ({ page }) => {
  await page.goto('/zh-CN/basic/button');
  const example = page.locator('.demo-block[data-demo-kind="import"]');
  await expect(example).toHaveCount(1);
  await expect(example.locator('.demo-block-preview')).toHaveCount(0);
  await expect(example.locator('.demo-block-status-ready')).toHaveCount(1);
  await expect(example.locator('.demo-block-source')).toHaveAttribute('open', '');
  await expect(example.locator('code')).toContainText(
    "import { Button, SplitButtonGroup } from '@aifuxi/semi-ui-vue';",
  );

  await page.goto('/zh-CN/show/table');
  const tableExample = page.locator('.demo-block[data-demo-kind="import"]');
  await expect(tableExample.locator('code')).toHaveText(
    "import { Table, Tag } from '@aifuxi/semi-ui-vue';",
  );
});

test('静态代码示例展示 Vue 代码且不运行预览', async ({ page }) => {
  await page.goto('/zh-CN/input/select');
  const example = page
    .locator('.demo-block[data-demo-kind="code"]')
    .filter({ hasText: 'TypeScript 泛型支持' });
  await expect(example).toHaveCount(1);
  await expect(example.locator('.demo-block-preview')).toHaveCount(0);
  await expect(example.locator('.demo-block-status-ready')).toHaveCount(1);
  await expect(example.locator('.demo-block-source')).toHaveAttribute('open', '');
  await expect(example.locator('summary')).toContainText('ts');
  await expect(example.locator('code')).toContainText('SelectModelValue');
  await expect(example.locator('code')).not.toContainText('React');

  await page.goto('/zh-CN/other/configprovider');
  const faq = page.locator('.demo-block[data-demo-kind="code"]').filter({ hasText: 'FAQ' });
  await expect(faq.locator('code')).toContainText('固定保留 .semi-* / --semi-* 兼容契约');
  await expect(faq.locator('code')).not.toContainText('@douyinfe');
});

test('通用指南的 22 个代码块全部使用 code-only 展示', async ({ page }) => {
  const guides = [
    ['/zh-CN/start/getting-started', 4],
    ['/zh-CN/experience/accessibility', 2],
    ['/zh-CN/advanced/customize-theme', 11],
    ['/zh-CN/advanced/dark-mode', 5],
  ] as const;

  for (const [route, expected] of guides) {
    await page.goto(route);
    const examples = page.locator('.demo-block[data-demo-kind="code"]');
    await expect(examples).toHaveCount(expected);
    await expect(examples.locator('.demo-block-status-ready')).toHaveCount(expected);
    await expect(page.getByText('示例迁移中')).toHaveCount(0);
    expect((await examples.locator('code').allTextContents()).join('\n')).not.toMatch(
      /@douyinfe|\bReact(?:DOM)?\b/,
    );
  }
});

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

if (tier === 't5') {
  test('T5 Form 可新增数组字段', async ({ page }) => {
    await page.goto('/zh-CN/input/form');
    const preview = page
      .locator("figure.demo-block:has(.demo-block-title:text-is('使用 ArrayField'))")
      .locator('.demo-block-preview');
    await expect(preview.getByRole('button', { name: '删除行' })).toHaveCount(2);
    await preview.getByRole('button', { name: '新增带初始值的行' }).click();
    await expect(preview.getByRole('button', { name: '删除行' })).toHaveCount(3);
    await expect(preview.locator('input').nth(2)).toHaveValue('Semi DSM');
  });

  test('T5 Table 可选择数据行', async ({ page }) => {
    await page.goto('/zh-CN/show/table');
    const preview = page
      .locator("figure.demo-block:has(.demo-block-title:text-is('行选择操作'))")
      .locator('.demo-block-preview');
    const checkboxes = preview.getByRole('checkbox');
    await expect(checkboxes).toHaveCount(4);
    await preview.locator('.semi-checkbox-inner-display').nth(1).click();
    await expect(checkboxes.nth(1)).toBeChecked();
  });

  test('T5 Chat 可发送消息并接收异步回复', async ({ page }) => {
    await page.goto('/zh-CN/plus/chat');
    const preview = page.locator('.demo-block-preview').first();
    await preview.getByRole('textbox').fill('T5 消息');
    await preview.getByRole('button', { name: 'send message' }).click();
    await expect(preview.getByText('T5 消息', { exact: true })).toBeVisible();
    await expect(preview.getByText('这是一条 mock 回复信息', { exact: true })).toBeVisible();
  });

  test('T5 AIChatInput 可提交结构化消息', async ({ page }) => {
    await page.goto('/zh-CN/ai/aiChatInput');
    const preview = page
      .locator("figure.demo-block:has(.demo-block-title:text-is('消息发送'))")
      .locator('.demo-block-preview');
    await preview.getByRole('button', { name: 'Send' }).click();
    await expect(preview.locator('.sent-message')).toContainText('inputContents');
    await expect(preview.locator('.sent-message')).toContainText(
      '点击发送按钮，观察上传内容、引用内容、输入框内容变化',
    );
    await expect(preview.getByRole('button', { name: 'Stop' })).toBeVisible();
  });

  test('T5 AIChatDialogue 可取消全部消息选择', async ({ page }) => {
    await page.goto('/zh-CN/ai/aiChatDialogue');
    const preview = page
      .locator("figure.demo-block:has(.demo-block-title:text-is('选择'))")
      .locator('.demo-block-preview');
    const checkboxes = preview.getByRole('checkbox');
    await expect(checkboxes).toHaveCount(3);
    await preview.getByText('取消全选', { exact: true }).click();
    await expect(preview.locator('output')).toHaveText('已选: ');
    for (let index = 0; index < 3; index += 1)
      await expect(checkboxes.nth(index)).not.toBeChecked();
  });

  test('T5 Sidebar 可隐藏并重新展示容器', async ({ page }) => {
    await page.goto('/zh-CN/ai/sidebar');
    const preview = page.locator('.demo-block-preview').first();
    await expect(preview.locator('.semi-sidebar-container')).toBeVisible();
    await preview.getByRole('button', { name: '点我隐藏容器' }).click();
    await expect(preview.locator('.semi-sidebar-container')).toHaveCount(0);
    await expect(preview.getByRole('button', { name: '点我展示容器' })).toBeVisible();
  });
}
