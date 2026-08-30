import { expect, test, type Page } from '@playwright/test';
import { readdir, readFile } from 'node:fs/promises';
import { expectScreenshotPixelsToMatch, waitForStableRendering } from './parity-harness';

async function createComparisonPng(page: Page, changedPixelCount: number): Promise<Buffer> {
  const pngBase64 = await page.evaluate((pixelCount) => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('测试 Canvas 不可用');

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#000000';
    for (let index = 0; index < pixelCount; index += 1) {
      context.fillRect(index % canvas.width, Math.floor(index / canvas.width), 1, 1);
    }

    return canvas.toDataURL('image/png').split(',')[1]!;
  }, changedPixelCount);

  return Buffer.from(pngBase64, 'base64');
}

test('共享截图比较允许阈值内像素抖动并拒绝超限差异', async ({ page }) => {
  await page.setContent('<main>parity harness</main>');
  await waitForStableRendering(page);

  const expected = await createComparisonPng(page, 0);
  const withinThreshold = await createComparisonPng(page, 1);
  const overThreshold = await createComparisonPng(page, 11);

  await expectScreenshotPixelsToMatch(page, withinThreshold, expected, '阈值内像素抖动');
  await expect(
    expectScreenshotPixelsToMatch(page, overThreshold, expected, '超限像素差异'),
  ).rejects.toThrow(/像素差异超限/);
});

test('组件对照规格统一使用像素阈值而非 PNG 字节相等', async () => {
  const componentDirectory = new URL('./components/', import.meta.url);
  const files = (await readdir(componentDirectory)).filter((file) => file.endsWith('.spec.ts'));

  for (const file of files) {
    const source = await readFile(new URL(file, componentDirectory), 'utf8');
    expect(source, `${file} 不得回退到 Buffer.equals 截图断言`).not.toMatch(/\.equals\(/);
  }
});
