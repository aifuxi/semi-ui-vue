import { expect, test, type Page } from '@playwright/test';
import { readdir, readFile } from 'node:fs/promises';
import {
  captureComparableGeometry,
  expectScreenshotPixelsToMatch,
  waitForStableRendering,
  waitForTargetStable,
} from './parity-harness';

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

test('共享几何捕获按定位方式选择文档或视口坐标', async ({ page }) => {
  await page.setContent(`
    <style>
      body { height: 1200px; margin: 0; }
      #document-target { position: absolute; left: 20px; top: 240px; width: 40px; height: 30px; }
      #viewport-target { position: fixed; left: 30px; top: 50px; width: 60px; height: 40px; }
    </style>
    <div id="document-target"></div>
    <div id="viewport-target"></div>
  `);
  await page.evaluate(() => window.scrollTo(0, 120));
  await waitForStableRendering(page);

  const [documentGeometry, viewportGeometry] = await Promise.all([
    captureComparableGeometry(page.locator('#document-target')),
    captureComparableGeometry(page.locator('#viewport-target')),
  ]);

  expect(documentGeometry).toMatchObject({
    coordinateSpace: 'document',
    pageScrollY: 120,
    x: 20,
    y: 240,
  });
  expect(viewportGeometry).toMatchObject({
    coordinateSpace: 'viewport',
    pageScrollY: 120,
    x: 30,
    y: 50,
  });
});

test('共享目标稳定等待会等有限动画进入最终帧', async ({ page }) => {
  await page.setContent(`
    <style>
      body { margin: 0; }
      @keyframes move-target { from { transform: translateX(0); } to { transform: translateX(40px); } }
      #animated-target { width: 20px; height: 20px; animation: move-target 80ms linear forwards; }
    </style>
    <div id="animated-target"></div>
  `);
  const target = page.locator('#animated-target');

  await waitForTargetStable(target);
  await waitForStableRendering(page);

  const geometry = await captureComparableGeometry(target);
  expect(geometry.x).toBe(40);
});
