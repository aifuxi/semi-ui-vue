import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { freezeAnimations } from './demo-parity';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

test.use({ actionTimeout: 10_000 });

// Chinese and English share indices 1-5; the English page adds `Controlled` (index 6),
// whose behavior the Chinese page folds into its Delay example.
const examples = [
  { name: 'Basic', spinners: 1 },
  { name: 'Size', spinners: 3 },
  { name: 'Tip', spinners: 1 },
  { name: 'Indicator', spinners: 1 },
  { name: 'Delay', spinners: 1 },
];
const controlledExample = 6;

async function measure(root: Locator) {
  return root.evaluate((element) => {
    const origin = element.getBoundingClientRect();
    const properties = [
      'display',
      'position',
      'color',
      'background-color',
      'background-image',
      'font-family',
      'font-size',
      'font-weight',
      'line-height',
      'text-align',
      'direction',
      'opacity',
      'overflow',
      'align-items',
      'justify-content',
      'border-radius',
      'outline-color',
      'outline-style',
      'outline-width',
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
      'border-left-width',
      'border-left-style',
      'border-left-color',
      'border-right-width',
      'border-right-style',
      'border-right-color',
      'border-bottom-width',
      'border-bottom-style',
      'border-bottom-color',
      'top',
      'width',
      'height',
      'flex',
      'flex-direction',
      'flex-wrap',
      'column-gap',
      'row-gap',
      'fill',
      'fill-opacity',
      'stroke',
      'stroke-width',
      'stroke-linecap',
      'stop-color',
      'stop-opacity',
      'animation-name',
      'animation-duration',
      'animation-timing-function',
      'animation-delay',
      'animation-iteration-count',
    ];
    // The default indicator paints through a per-instance gradient id. Resolve each paint
    // server to its position inside the owning SVG, so the comparison stays exact while a
    // missing or reordered definition still fails.
    const normalizePaint = (node: Element, value: string) =>
      value.replace(/url\(["']?#([^)"']+)["']?\)/g, (_, id: string) => {
        const definitions = [...(node.closest('svg')?.querySelectorAll('[id]') ?? [])];
        const index = definitions.findIndex((definition) => definition.id === id);
        if (index < 0) throw new Error(`Unresolved SVG paint ${id}`);
        return `url(#definition-${index})`;
      });
    return [
      ...element.querySelectorAll(
        '.semi-spin, .semi-spin *, .semi-button, .semi-button-content, .semi-icon, .semi-icon *',
      ),
    ].map((node) => {
      const rect = node.getBoundingClientRect();
      const styles = (pseudo: string | null) => {
        const style = getComputedStyle(node, pseudo);
        return Object.fromEntries(
          properties.map((key) => [key, normalizePaint(node, style.getPropertyValue(key))]),
        );
      };
      return {
        tag: node.tagName,
        classes: [...node.classList].filter((name) => name.startsWith('semi-')).sort(),
        text: (() => {
          const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
          const parts: string[] = [];
          while (walker.nextNode()) {
            const text = walker.currentNode.textContent?.replace(/\s+/g, ' ').trim();
            if (text) parts.push(text);
          }
          return parts;
        })(),
        role: node.getAttribute('role'),
        hidden: node.getAttribute('aria-hidden'),
        label: node.getAttribute('aria-label'),
        icon: node.getAttribute('data-icon'),
        viewBox: node.getAttribute('viewBox'),
        tabindex: node.getAttribute('tabindex'),
        disabled: node.hasAttribute('disabled'),
        path: node.getAttribute('d'),
        styles: styles(null),
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
    for (const [index, { name, spinners }] of examples.entries())
      for (const direction of ['ltr', 'rtl'])
        test(`Spin 文档 ${name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
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
            await reference.goto(
              `http://127.0.0.1:4173/docs.html?component=spin&locale=${locale}&theme=${theme}&example=${index + 1}`,
            );
            const expected = reference.locator('#root');
            // Establish the reference independently before loading the Vue page.
            await expect(expected.locator('.semi-spin')).toHaveCount(spinners);
            await vue.goto(`/${locale}/components/spin/`);
            const demo = vue.locator(`[data-demo-id="spin/${locale}/${name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual.locator('.semi-spin')).toHaveCount(spinners);
            await expect(actual).toBeVisible();
            const source = await readFile(
              new URL(`../../src/demos/spin/${locale}/${name}.vue`, import.meta.url),
              'utf8',
            );
            expect(await demo.locator('[data-demo-source] code').textContent()).toBe(source);
            await align(reference, expected, vue, actual, direction);
            const compareFor =
              (expectedRoot: Locator, actualRoot: Locator, prefix: string) =>
              async (prefixless: string, animationTime = 300) => {
                const state = `${prefix}${prefixless}`;
                await waitForVisualAssets([expectedRoot, actualRoot]);
                await Promise.all([reference, vue].map((page) => page.mouse.move(1400, 880)));
                await freezeAnimations([reference, vue], animationTime);
                const [referenceNodes, vueNodes] = await Promise.all([
                  measure(expectedRoot),
                  measure(actualRoot),
                ]);
                await info.attach(`${state}-styles`, {
                  body: JSON.stringify({ expected: referenceNodes, actual: vueNodes }),
                  contentType: 'application/json',
                });
                expect(vueNodes).toHaveLength(referenceNodes.length);
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
                const images = await Promise.all(
                  [expectedRoot, actualRoot].map((root) => root.screenshot()),
                );
                for (const [i, label] of ['reference', 'vue'].entries())
                  await info.attach(
                    !prefix && prefixless === 'default' ? label : `${state}-${label}`,
                    { body: images[i]!, contentType: 'image/png' },
                  );
                await expectScreenshotPixelsToMatch(vue, images[1]!, images[0]!, state);
                for (
                  let item = 0;
                  item < (await actualRoot.locator('.semi-spin').count());
                  item++
                ) {
                  const crops = await Promise.all(
                    [expectedRoot, actualRoot].map((root) =>
                      root.locator('.semi-spin').nth(item).screenshot(),
                    ),
                  );
                  for (const [i, label] of ['reference', 'vue'].entries())
                    await info.attach(`${state}-spin-${item}-${label}`, {
                      body: crops[i]!,
                      contentType: 'image/png',
                    });
                  await expectScreenshotPixelsToMatch(
                    vue,
                    crops[1]!,
                    crops[0]!,
                    `${state}-spin-${item}`,
                  );
                }
              };
            const comparePrimary = compareFor(expected, actual, '');
            await test.step('默认结构、样式、几何与截图', () => comparePrimary('default'));

            if (name === 'Delay')
              await test.step('延迟显示与立即隐藏', async () => {
                for (const root of [expected, actual]) {
                  await expect(root.locator('.semi-spin-wrapper')).toHaveCount(0);
                  // The documented 1000ms delay must actually elapse before the indicator shows.
                  const started = Date.now();
                  await root.locator('.semi-button').click();
                  await expect(root.locator('.semi-spin-wrapper')).toHaveCount(1, {
                    timeout: 5_000,
                  });
                  expect(Date.now() - started).toBeGreaterThanOrEqual(900);
                }
                await comparePrimary('loading');
                for (const root of [expected, actual]) {
                  await root.locator('.semi-button').click();
                  await expect(root.locator('.semi-spin-wrapper')).toHaveCount(0);
                }
                await comparePrimary('hidden-restored');
              });

            if (name === 'Delay' && locale === 'en-us')
              await test.step('英文独有 Controlled 示例', async () => {
                await reference.goto(
                  `http://127.0.0.1:4173/docs.html?component=spin&locale=${locale}&theme=${theme}&example=${controlledExample}`,
                );
                await vue.goto(`/${locale}/components/spin/`);
                const controlled = vue.locator('[data-demo-id="spin/en-us/Controlled"]');
                const controlledActual = controlled.locator('[data-demo-preview]');
                expect(await controlled.locator('[data-demo-source] code').textContent()).toBe(
                  await readFile(
                    new URL('../../src/demos/spin/en-us/Controlled.vue', import.meta.url),
                    'utf8',
                  ),
                );
                await expect(controlledActual.locator('.semi-spin')).toHaveCount(1);
                await expect(controlledActual.locator('.semi-spin-wrapper')).toHaveCount(0);
                await align(reference, expected, vue, controlledActual, direction);
                const compareControlled = compareFor(expected, controlledActual, 'controlled-');
                await compareControlled('default');
                for (const root of [expected, controlledActual]) {
                  await root.locator('.semi-button').click();
                  await expect(root.locator('.semi-spin-wrapper')).toHaveCount(1);
                }
                await compareControlled('loading');
              });

            if (theme === 'light' && direction === 'ltr') {
              await test.step('双语源码、重置和实际在线编辑', async () => {
                const block = vue.locator(`[data-demo-id="spin/${locale}/${name}"]`);
                const preview = block.locator('[data-demo-preview]');
                const action = (zh: string, en: string) =>
                  block.getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
                const assertInitial = async (root: Locator) => {
                  await expect(root.locator('.semi-spin')).toHaveCount(spinners);
                  await expect(root.locator('.semi-spin-wrapper')).toHaveCount(
                    name === 'Delay' ? 0 : spinners,
                  );
                };
                await action('查看源码', 'View source').click();
                await expect(block.locator('[data-demo-source]')).toBeVisible();
                expect(await block.locator('[data-demo-source] code').textContent()).toBe(source);
                await action('查看源码', 'View source').click();
                await expect(block.locator('[data-demo-source]')).toBeHidden();
                await action('重置', 'Reset').click();
                await assertInitial(preview);
                await action('在线编辑', 'Edit online').click();
                const editor = block.frameLocator('iframe').locator('#app');
                await expect(editor.locator('.semi-spin')).toHaveCount(spinners, {
                  timeout: 30_000,
                });
                await assertInitial(editor);
                await expect(block.locator('.msg.err')).toHaveCount(0);
                await action('退出编辑', 'Close editor').click();
                await expect(block.locator('iframe')).toHaveCount(0);
                await assertInitial(preview);
              });
            }
            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'feedback/spin',
                index: index + 1,
                name,
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
