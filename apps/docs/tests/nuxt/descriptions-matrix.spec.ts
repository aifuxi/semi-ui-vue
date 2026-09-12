import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { freezeAnimations } from './demo-parity';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

test.use({ actionTimeout: 10_000 });

// `zh`/`en` are the pinned live-block indexes of each locale. The pinned English page ships no
// vertical layout snippet, so that case renders the same block through the `descriptions-vertical`
// reference adapter instead of a second dataset.
const examples: Array<{ name: string; zh: number; en: number; enComponent?: string }> = [
  { name: 'Basic', zh: 1, en: 1 },
  { name: 'Alignment', zh: 2, en: 2 },
  { name: 'Items', zh: 3, en: 4 },
  { name: 'Vertical', zh: 4, en: 5, enComponent: 'descriptions-vertical' },
  { name: 'Horizontal', zh: 5, en: 5 },
  { name: 'DoubleRow', zh: 6, en: 3 },
  { name: 'KeyStyle', zh: 7, en: 6 },
  { name: 'ItemKeyStyle', zh: 8, en: 7 },
];

async function measure(root: Locator) {
  return root.evaluate((element) => {
    const origin = element.getBoundingClientRect();
    const properties = [
      'display',
      'position',
      'visibility',
      'color',
      'background-color',
      'background-image',
      'font-family',
      'font-size',
      'font-weight',
      'font-style',
      'line-height',
      'letter-spacing',
      'text-align',
      'text-decoration-line',
      'text-overflow',
      'text-transform',
      'white-space',
      'word-break',
      'direction',
      'opacity',
      'overflow-x',
      'overflow-y',
      'align-items',
      'justify-content',
      'flex',
      'flex-direction',
      'flex-wrap',
      'column-gap',
      'row-gap',
      'border-radius',
      'border-collapse',
      'box-shadow',
      'transform',
      'vertical-align',
      'box-sizing',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'border-top-width',
      'border-top-style',
      'border-top-color',
      'border-right-width',
      'border-right-style',
      'border-right-color',
      'border-bottom-width',
      'border-bottom-style',
      'border-bottom-color',
      'border-left-width',
      'border-left-style',
      'border-left-color',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',
      'width',
      'min-width',
      'max-width',
      'height',
      'min-height',
      'max-height',
      'table-layout',
      'fill',
      'fill-opacity',
      'stroke',
      'stroke-width',
    ];
    // Descriptions renders a table; component nodes carry a `semi-` class while the table, rows and
    // cells keep their geometry, and icon paths keep their path data.
    return [...element.querySelectorAll('[class*="semi-"], table, tr, th, td, svg path, br')].map(
      (node) => {
        const rect = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return {
          tag: node.tagName,
          classes: [...node.classList].sort(),
          attributes: Object.fromEntries(
            [...node.attributes]
              .filter((attribute) => !['style', 'class'].includes(attribute.name))
              .map((attribute) => [attribute.name, attribute.value])
              .sort((left, right) => (left[0]! < right[0]! ? -1 : 1)),
          ),
          text: (() => {
            const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
            const parts: string[] = [];
            while (walker.nextNode()) {
              const text = walker.currentNode.textContent?.replace(/\s+/g, ' ').trim();
              if (text) parts.push(text);
            }
            return parts;
          })(),
          styles: Object.fromEntries(properties.map((key) => [key, style.getPropertyValue(key)])),
          rect: {
            x: rect.x - origin.x,
            y: rect.y - origin.y,
            width: rect.width,
            height: rect.height,
          },
        };
      },
    );
  });
}

/** Give both roots the same box, page scroll and writing direction before comparing. */
async function align(
  referencePage: Page,
  expected: Locator,
  vuePage: Page,
  actual: Locator,
  direction: string,
) {
  await waitForVisualAssets([expected, actual]);
  for (const root of [expected, actual])
    await root.evaluate((element, dir) => {
      (element as HTMLElement).dir = dir;
      element.classList.toggle('semi-rtl', dir === 'rtl');
    }, direction);
  await actual.scrollIntoViewIfNeeded();
  const box = await actual.boundingBox();
  await expected.evaluate((element, rect) => {
    Object.assign((element as HTMLElement).style, {
      boxSizing: 'border-box',
      padding: '24px',
      width: `${rect!.width}px`,
      position: 'relative',
      left: `${rect!.x}px`,
      top: `${rect!.y}px`,
    });
  }, box);
  const scroll = await vuePage.evaluate(() => ({
    y: scrollY,
    height: document.documentElement.scrollHeight,
  }));
  await referencePage.evaluate(({ y, height }) => {
    document.body.style.minHeight = `${height}px`;
    const root = document.getElementById('root')!;
    root.style.top = `${parseFloat(root.style.top) + y}px`;
    window.scrollTo(0, y);
  }, scroll);
  await Promise.all([referencePage, vuePage].map((page) => page.mouse.move(1400, 880)));
}

for (const locale of ['zh-cn', 'en-us'])
  for (const theme of ['light', 'dark'])
    for (const [index, example] of examples.entries())
      for (const direction of ['ltr', 'rtl'])
        test(`Descriptions 文档 ${example.name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
          browser,
        }, info) => {
          test.setTimeout(120_000);
          const context = await visualContext(browser, info, locale, theme, direction);
          try {
            const reference = await context.newPage(),
              vue = await context.newPage();
            const errors: string[] = [];
            const observe = (page: Page) => {
              page.on('pageerror', (error) => errors.push(error.message));
              page.on('console', (message) => {
                if (message.type() === 'error') errors.push(message.text());
              });
            };
            for (const page of [reference, vue]) observe(page);
            await vue.addInitScript((value) => {
              if (window === window.top) localStorage.setItem('semi-docs-theme', value);
            }, theme);
            const referenceNumber = locale === 'en-us' ? example.en : example.zh;
            const component =
              locale === 'en-us' && example.enComponent ? example.enComponent : 'descriptions';
            await reference.goto(
              `http://127.0.0.1:4173/docs.html?component=${component}&locale=${locale}&theme=${theme}&example=${referenceNumber}`,
            );
            const expected = reference.locator('#root');
            // Establish the reference independently before loading the Vue page.
            await expect(expected.locator('.semi-descriptions')).not.toHaveCount(0);
            await vue.goto(`/${locale}/components/descriptions/`);
            const demo = vue.locator(`[data-demo-id="descriptions/${locale}/${example.name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual.locator('.semi-descriptions')).toHaveCount(
              await expected.locator('.semi-descriptions').count(),
            );
            await expect(actual).toBeVisible();
            const source = await readFile(
              new URL(
                `../../src/demos/descriptions/${locale}/${example.name}.vue`,
                import.meta.url,
              ),
              'utf8',
            );
            expect(await demo.locator('[data-demo-source] code').textContent()).toBe(source);
            await align(reference, expected, vue, actual, direction);
            const compare = async (state: string) => {
              await waitForVisualAssets([expected, actual]);
              await Promise.all([reference, vue].map((page) => page.mouse.move(1400, 880)));
              await freezeAnimations([reference, vue], 300);
              const [referenceNodes, vueNodes] = await Promise.all([
                measure(expected),
                measure(actual),
              ]);
              await info.attach(`${state}-styles`, {
                body: JSON.stringify({ expected: referenceNodes, actual: vueNodes }),
                contentType: 'application/json',
              });
              expect(vueNodes, `${state} 节点数量`).toHaveLength(referenceNodes.length);
              for (const [i, node] of vueNodes.entries()) {
                const { rect: a, ...actualNode } = node;
                const { rect: b, ...expectedNode } = referenceNodes[i]!;
                expect(actualNode, `${state} node ${i}`).toEqual(expectedNode);
                for (const axis of ['x', 'y', 'width', 'height'] as const)
                  expect(
                    Math.abs(a[axis] - b[axis]),
                    `${state} node ${i} ${axis}`,
                  ).toBeLessThanOrEqual(0.5);
              }
              const images = await Promise.all([expected, actual].map((root) => root.screenshot()));
              for (const [i, label] of ['reference', 'vue'].entries())
                await info.attach(state === 'default' ? label : `${state}-${label}`, {
                  body: images[i]!,
                  contentType: 'image/png',
                });
              await expectScreenshotPixelsToMatch(vue, images[1]!, images[0]!, state);
              // Each rendered Descriptions is its own crop so spacing cannot dilute a defect.
              const instances = await actual.locator('.semi-descriptions').count();
              for (let item = 0; item < instances; item++) {
                const crops = await Promise.all(
                  [expected, actual].map((root) =>
                    root.locator('.semi-descriptions').nth(item).screenshot(),
                  ),
                );
                for (const [i, label] of ['reference', 'vue'].entries())
                  await info.attach(`${state}-instance-${item}-${label}`, {
                    body: crops[i]!,
                    contentType: 'image/png',
                  });
                await expectScreenshotPixelsToMatch(
                  vue,
                  crops[1]!,
                  crops[0]!,
                  `${state}-instance-${item}`,
                );
              }
            };
            await test.step('默认结构、样式、几何与逐实例截图', () => compare('default'));

            if (theme === 'light' && direction === 'ltr') {
              await test.step('源码、重置与在线编辑生命周期', async () => {
                const block = vue.locator(
                  `[data-demo-id="descriptions/${locale}/${example.name}"]`,
                );
                const preview = block.locator('[data-demo-preview]');
                const action = (zh: string, en: string) =>
                  block.getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
                const instances = await preview.locator('.semi-descriptions').count();
                await action('查看源码', 'View source').click();
                await expect(block.locator('[data-demo-source]')).toBeVisible();
                expect(await block.locator('[data-demo-source] code').textContent()).toBe(source);
                await action('查看源码', 'View source').click();
                await expect(block.locator('[data-demo-source]')).toBeHidden();
                await action('重置', 'Reset').click();
                await expect(preview.locator('.semi-descriptions')).toHaveCount(instances);
                await action('在线编辑', 'Edit online').click();
                const editor = block.frameLocator('iframe').locator('#app');
                await expect(editor.locator('.semi-descriptions')).toHaveCount(instances, {
                  timeout: 30_000,
                });
                await expect(block.locator('.msg.err')).toHaveCount(0);
                await action('退出编辑', 'Close editor').click();
                await expect(block.locator('iframe')).toHaveCount(0);
                await expect(preview.locator('.semi-descriptions')).toHaveCount(instances);
              });
            }
            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'show/descriptions',
                index: index + 1,
                name: example.name,
                locale,
                theme,
                direction,
                checks: ['text', 'styles', 'geometry', 'screenshots', 'interaction'],
              }),
              contentType: 'application/json',
            });
          } finally {
            await context.close();
          }
        });
