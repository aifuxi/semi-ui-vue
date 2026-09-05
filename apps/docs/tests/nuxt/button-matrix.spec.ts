import { visualContext } from './visual-context';
import { expect, test, type Locator } from '@playwright/test';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

const examples = [
  'Types',
  'TypeColors',
  'Themelight',
  'Themesolid',
  'Themeborderless',
  'Themeoutline',
  'Sizes',
  'Block',
  'Icons',
  'Links',
  'Disabled',
  'Loading',
  'Colorful',
  'GroupSizes',
  'GroupDisabled',
  'GroupTypes',
  'Split',
];
async function contentBounds(root: Locator) {
  return root.evaluate((element) => {
    const rectangles = [...element.querySelectorAll('.semi-button,hr')].map((node) =>
      node.getBoundingClientRect(),
    );
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      if (!walker.currentNode.textContent?.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(walker.currentNode);
      rectangles.push(...range.getClientRects());
    }
    const visible = rectangles.filter((rect) => rect.width && rect.height);
    const x = Math.min(...visible.map((rect) => rect.left)),
      y = Math.min(...visible.map((rect) => rect.top));
    return {
      x,
      y,
      width: Math.max(...visible.map((rect) => rect.right)) - x,
      height: Math.max(...visible.map((rect) => rect.bottom)) - y,
    };
  });
}
for (const locale of ['zh-cn', 'en-us'])
  for (const theme of ['light', 'dark'])
    for (const [index, name] of examples.entries()) {
      test(`Button 文档 ${name} ${locale} ${theme}`, async ({ browser }, info) => {
        const context = await visualContext(browser, info, locale, theme);
        const reference = await context.newPage();
        const vue = await context.newPage();
        await Promise.all([
          reference.clock.setFixedTime(new Date('2024-08-15T10:24:30+08:00')),
          vue.clock.setFixedTime(new Date('2024-08-15T10:24:30+08:00')),
        ]);
        const errors: string[] = [];
        reference.on('pageerror', (error) => errors.push(error.message));
        vue.on('pageerror', (error) => errors.push(error.message));
        await vue.addInitScript((value) => localStorage.setItem('semi-docs-theme', value), theme);
        await Promise.all([
          reference.goto(
            `http://127.0.0.1:4173/docs.html?locale=${locale}&theme=${theme}&example=${index + 1}`,
          ),
          vue.goto(`/${locale}/components/button/`),
        ]);
        const expected = reference.locator('#root');
        const actual = vue.locator(`[data-demo-id="button/${locale}/${name}"] [data-demo-preview]`);
        await expect(expected).not.toHaveText('Loading fixed reference');
        await expect(actual).toBeVisible();
        await expect(actual.locator('.demo-loading')).toHaveCount(0);
        await Promise.all([
          reference.evaluate(() => document.fonts.ready),
          vue.evaluate(() => document.fonts.ready),
        ]);
        await actual.scrollIntoViewIfNeeded();
        const box = await actual.boundingBox();
        await expected.evaluate((element, rect) => {
          Object.assign((element as HTMLElement).style, {
            boxSizing: 'border-box',
            padding: '24px',
            width: `${rect!.width}px`,
            position: 'relative',
            left: `${rect!.x % 1}px`,
            top: `${rect!.y % 1}px`,
          });
        }, box);
        await Promise.all([reference.mouse.move(1439, 899), vue.mouse.move(1439, 899)]);
        const normalize = (value: string | null) => value?.replace(/\s+/g, ' ').trim();
        const [sourceText, vueText] = await Promise.all([
          expected.textContent(),
          actual.textContent(),
        ]);
        await info.attach('text', {
          body: JSON.stringify({ reference: sourceText, vue: vueText }, null, 2),
          contentType: 'application/json',
        });
        expect.soft(normalize(vueText)).toBe(normalize(sourceText));
        await Promise.all(
          [reference, vue].map((page) =>
            page.evaluate(() =>
              document.getAnimations().forEach((animation) => {
                animation.pause();
                animation.currentTime = 0;
              }),
            ),
          ),
        );
        const [sourceBounds, vueBounds] = await Promise.all([
          contentBounds(expected),
          contentBounds(actual),
        ]);
        expect(Math.abs(sourceBounds.width - vueBounds.width)).toBeLessThanOrEqual(0.5);
        expect(Math.abs(sourceBounds.height - vueBounds.height)).toBeLessThanOrEqual(0.5);
        // The DemoBlock frame is outside this component-level comparison.
        const [sourceImage, vueImage] = await Promise.all([
          reference.screenshot({
            clip: sourceBounds,
            path: info.outputPath('reference.png'),
          }),
          vue.screenshot({ clip: vueBounds, path: info.outputPath('vue.png') }),
        ]);
        await info.attach('reference', {
          body: sourceImage,
          contentType: 'image/png',
        });
        await info.attach('vue', { body: vueImage, contentType: 'image/png' });
        await expectScreenshotPixelsToMatch(
          vue,
          vueImage,
          sourceImage,
          `${locale}/${name}/${theme}`,
        );
        expect(errors).toEqual([]);
        await reference.close();
        await vue.close();
        await context.close();
      });
    }
