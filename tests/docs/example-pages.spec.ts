import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
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
      const entries = await readdir(resolve(examplesRoot, component.name));
      return {
        component: component.name,
        route: `/zh-CN/${match.category}/${match.slug}`,
        expectedExamples: entries.filter((entry) => /^zh-CN-.*\.vue$/.test(entry)).length,
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
      if (message.type() === 'error') clientErrors.push(message.text());
    });
    page.on('pageerror', (error) => clientErrors.push(error.message));

    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const liveExamples = page.locator('.demo-block[data-demo-kind="live"]');
    await expect.soft(liveExamples).toHaveCount(expectedExamples);
    await expect
      .soft(liveExamples.locator('.demo-block-status-ready'))
      .toHaveCount(expectedExamples);
    expect.soft(clientErrors, `客户端错误：\n${clientErrors.join('\n')}`).toEqual([]);
  });
}
