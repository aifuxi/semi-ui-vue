import { visualContext } from './visual-context';
import { expect, test, type Locator } from '@playwright/test';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

const properties = [
  'color',
  'background-color',
  'font-family',
  'font-size',
  'font-weight',
  'line-height',
  'border-radius',
  'border-top-width',
  'padding-left',
  'padding-right',
];
async function measure(buttons: Locator) {
  return buttons.evaluateAll((nodes, keys) => {
    const origin = nodes[0]!.getBoundingClientRect();
    return nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      const styles = getComputedStyle(node);
      return {
        text: node.textContent,
        styles: Object.fromEntries(keys.map((key) => [key, styles.getPropertyValue(key)])),
        rect: {
          x: rect.x - origin.x,
          y: rect.y - origin.y,
          width: rect.width,
          height: rect.height,
        },
      };
    });
  }, properties);
}

for (const locale of ['zh-cn', 'en-us'])
  for (const theme of ['light', 'dark']) {
    test(`固定上游导航 ${locale} ${theme}`, async ({ browser }, info) => {
      const context = await visualContext(browser, info, locale, theme);
      const reference = await context.newPage();
      const vue = await context.newPage();
      await Promise.all([
        reference.clock.setFixedTime(new Date('2024-08-15T10:24:30+08:00')),
        vue.clock.setFixedTime(new Date('2024-08-15T10:24:30+08:00')),
      ]);
      await vue.addInitScript((value) => localStorage.setItem('semi-docs-theme', value), theme);
      await Promise.all([
        reference.goto(
          `http://127.0.0.1:4173/docs.html?region=navigation&locale=${locale}&theme=${theme}`,
        ),
        vue.goto(`/${locale}/start/introduction/`),
      ]);
      const expected = reference.locator('.side-nav .semi-navigation-sub').first();
      const actual = vue.locator('.side-nav .semi-navigation-sub').first();
      await expect(expected).toBeVisible();
      await expect(actual).toBeVisible();
      await Promise.all([
        reference.evaluate(() => document.fonts.ready),
        vue.evaluate(() => document.fonts.ready),
      ]);
      const [expectedData, actualData] = await Promise.all([
        measure(expected.locator('.semi-navigation-item')),
        measure(actual.locator('.semi-navigation-item')),
      ]);
      await info.attach('navigation-style-and-geometry', {
        body: JSON.stringify({ expected: expectedData, actual: actualData }, null, 2),
        contentType: 'application/json',
      });
      expect(actualData.length).toBe(expectedData.length);
      for (let index = 0; index < actualData.length; index++) {
        expect(actualData[index]!.text).toBe(expectedData[index]!.text);
        expect(actualData[index]!.styles).toEqual(expectedData[index]!.styles);
        for (const axis of ['x', 'y', 'width', 'height'] as const)
          expect(
            Math.abs(actualData[index]!.rect[axis] - expectedData[index]!.rect[axis]),
          ).toBeLessThanOrEqual(0.5);
      }
      const [referenceImage, vueImage] = await Promise.all([
        expected.screenshot({ animations: 'disabled' }),
        actual.screenshot({ animations: 'disabled' }),
      ]);
      await info.attach('navigation-reference', {
        body: referenceImage,
        contentType: 'image/png',
      });
      await info.attach('navigation-vue', {
        body: vueImage,
        contentType: 'image/png',
      });
      await expectScreenshotPixelsToMatch(vue, vueImage, referenceImage, '文档导航起始分组');
      await reference.close();
      await vue.close();
      await context.close();
    });
    test(`固定上游 Button 类型 Demo ${locale} ${theme}`, async ({ browser }, info) => {
      const context = await visualContext(browser, info, locale, theme);
      const reference = await context.newPage();
      const vue = await context.newPage();
      await Promise.all([
        reference.clock.setFixedTime(new Date('2024-08-15T10:24:30+08:00')),
        vue.clock.setFixedTime(new Date('2024-08-15T10:24:30+08:00')),
      ]);
      await vue.addInitScript((value) => localStorage.setItem('semi-docs-theme', value), theme);
      await Promise.all([
        reference.goto(`http://127.0.0.1:4173/docs.html?locale=${locale}&theme=${theme}`),
        vue.goto(`/${locale}/components/button/`),
      ]);
      const expected = reference.locator('#root .semi-button');
      const actual = vue.locator(`[data-demo-id="button/${locale}/Types"] .semi-button`);
      await expect(expected).toHaveCount(5);
      await expect(actual).toHaveCount(5);
      await Promise.all([
        reference.evaluate(() => document.fonts.ready),
        vue.evaluate(() => document.fonts.ready),
      ]);
      await actual.first().scrollIntoViewIfNeeded();
      const origin = await actual.first().boundingBox();
      // Keep the same fractional device-pixel origin when cropping each component.
      // Otherwise Chromium rounds a 32px element to 33 image pixels on only one side.
      await reference.locator('#root').evaluate((element, point) => {
        Object.assign((element as HTMLElement).style, {
          position: 'relative',
          left: `${point!.x % 1}px`,
          top: `${point!.y % 1}px`,
        });
      }, origin);
      const [expectedData, actualData] = await Promise.all([measure(expected), measure(actual)]);
      await info.attach('computed-style-and-geometry', {
        body: JSON.stringify({ expected: expectedData, actual: actualData }, null, 2),
        contentType: 'application/json',
      });
      for (let index = 0; index < 5; index++) {
        expect(actualData[index]!.text).toBe(expectedData[index]!.text);
        expect(actualData[index]!.styles).toEqual(expectedData[index]!.styles);
        for (const axis of ['x', 'y', 'width', 'height'] as const)
          expect(
            Math.abs(actualData[index]!.rect[axis] - expectedData[index]!.rect[axis]),
          ).toBeLessThanOrEqual(0.5);
        const sourceImage = await expected.nth(index).screenshot({ animations: 'disabled' });
        const vueImage = await actual.nth(index).screenshot({ animations: 'disabled' });
        await info.attach(`reference-${index}`, {
          body: sourceImage,
          contentType: 'image/png',
        });
        await info.attach(`vue-${index}`, {
          body: vueImage,
          contentType: 'image/png',
        });
        await expectScreenshotPixelsToMatch(vue, vueImage, sourceImage, `Button ${index}`);
      }
      await reference.close();
      await vue.close();
      await context.close();
    });
  }
