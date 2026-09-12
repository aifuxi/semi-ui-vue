import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { freezeAnimations } from './demo-parity';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

test.use({ actionTimeout: 10_000 });

// Both locales use the same four pinned snippets in the same order, but the English page renders
// fewer highlighted chunks (its Style snippet has one Highlight instead of two), so the expected
// chunk count is read from the reference page itself.
const examples = ['Basic', 'Style', 'Keywords', 'Tag'] as const;

async function measure(root: Locator) {
  return root.evaluate((element) => {
    const origin = element.getBoundingClientRect();
    const properties = [
      'display',
      'position',
      'visibility',
      'color',
      'background-color',
      'font-family',
      'font-size',
      'font-weight',
      'font-style',
      'line-height',
      'letter-spacing',
      'text-align',
      'text-decoration-line',
      'white-space',
      'word-break',
      'direction',
      'opacity',
      'overflow-x',
      'overflow-y',
      'border-radius',
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
      'border-right-width',
      'border-bottom-width',
      'border-left-width',
      'top',
      'right',
      'bottom',
      'left',
      'width',
      'min-width',
      'max-width',
      'height',
      'min-height',
      'max-height',
    ];
    // Highlight renders the matched chunks as the documented tag (mark/span/strong) plus plain
    // text nodes; the shared `semi-highlight-tag` class, the h2 wrapper and its geometry are the
    // compared surface.
    return [...element.querySelectorAll('[class*="semi-"], h2, mark, strong, br')].map((node) => {
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
    });
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
        test(`Highlight 文档 ${example} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
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
                if (message.type() !== 'error') return;
                const text = message.text();
                // The pinned Adapter still declares `searchWords` as an array of strings, so the
                // documented v2.71.0 object form logs a propTypes warning in the reference only;
                // the Vue port accepts both forms. Any other console error still fails the case.
                if (
                  /Invalid prop `searchWords\[\d+\]` of type `object` supplied to `Highlight`, expected `string`/.test(
                    text,
                  )
                )
                  return;
                errors.push(text);
              });
            };
            for (const page of [reference, vue]) observe(page);
            await vue.addInitScript((value) => {
              if (window === window.top) localStorage.setItem('semi-docs-theme', value);
            }, theme);
            await reference.goto(
              `http://127.0.0.1:4173/docs.html?component=highlight&locale=${locale}&theme=${theme}&example=${index + 1}`,
            );
            const expected = reference.locator('#root');
            // Establish the reference independently before loading the Vue page.
            const highlights = await expected.locator('.semi-highlight-tag').count();
            expect(highlights, '参考页未渲染任何高亮片段').toBeGreaterThan(0);
            await vue.goto(`/${locale}/components/highlight/`);
            const demo = vue.locator(`[data-demo-id="highlight/${locale}/${example}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual.locator('.semi-highlight-tag')).toHaveCount(highlights);
            await expect(actual).toBeVisible();
            const source = await readFile(
              new URL(`../../src/demos/highlight/${locale}/${example}.vue`, import.meta.url),
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
              // Each highlighted chunk is its own crop so surrounding text cannot dilute a defect.
              for (let item = 0; item < highlights; item++) {
                // Anchor a fixed clip to the reference chunk: both roots share the same box after
                // `align`, and an explicit clip keeps the crops the same size even when the same
                // sub-pixel rect rounds differently per host.
                const box = await expected.locator('.semi-highlight-tag').nth(item).boundingBox();
                const clip = {
                  x: Math.round(box!.x) - 2,
                  y: Math.round(box!.y) - 2,
                  width: Math.round(box!.width) + 4,
                  height: Math.round(box!.height) + 4,
                };
                const crops = await Promise.all([
                  reference.screenshot({ clip }),
                  vue.screenshot({ clip }),
                ]);
                for (const [i, label] of ['reference', 'vue'].entries())
                  await info.attach(`${state}-chunk-${item}-${label}`, {
                    body: crops[i]!,
                    contentType: 'image/png',
                  });
                await expectScreenshotPixelsToMatch(
                  vue,
                  crops[1]!,
                  crops[0]!,
                  `${state}-chunk-${item}`,
                );
              }
            };
            await test.step('默认结构、样式、几何与逐高亮片段截图', () => compare('default'));

            if (theme === 'light' && direction === 'ltr') {
              await test.step('源码、重置与在线编辑生命周期', async () => {
                const block = vue.locator(`[data-demo-id="highlight/${locale}/${example}"]`);
                const preview = block.locator('[data-demo-preview]');
                const action = (zh: string, en: string) =>
                  block.getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
                await action('查看源码', 'View source').click();
                await expect(block.locator('[data-demo-source]')).toBeVisible();
                expect(await block.locator('[data-demo-source] code').textContent()).toBe(source);
                await action('查看源码', 'View source').click();
                await expect(block.locator('[data-demo-source]')).toBeHidden();
                await action('重置', 'Reset').click();
                await expect(preview.locator('.semi-highlight-tag')).toHaveCount(highlights);
                await action('在线编辑', 'Edit online').click();
                const editor = block.frameLocator('iframe').locator('#app');
                await expect(editor.locator('.semi-highlight-tag')).toHaveCount(highlights, {
                  timeout: 30_000,
                });
                await expect(block.locator('.msg.err')).toHaveCount(0);
                await action('退出编辑', 'Close editor').click();
                await expect(block.locator('iframe')).toHaveCount(0);
                await expect(preview.locator('.semi-highlight-tag')).toHaveCount(highlights);
              });
            }
            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'show/highlight',
                index: index + 1,
                name: example,
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
