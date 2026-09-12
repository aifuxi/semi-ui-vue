import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { freezeAnimations } from './demo-parity';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

test.use({ actionTimeout: 10_000 });

const examples = [
  'Basic',
  'Theme',
  'Indicators',
  'Arrows',
  'CustomArrows',
  'AutoPlay',
  'Animation',
  'Controlled',
].map((name, index) => ({ name, block: index + 1 }));

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
      'flex-basis',
      'flex-grow',
      'flex-shrink',
      'column-gap',
      'row-gap',
      'border-radius',
      'box-shadow',
      'transform',
      'vertical-align',
      'box-sizing',
      'cursor',
      'pointer-events',
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
      'fill',
      'stroke',
      'animation-duration',
      'animation-timing-function',
      'transition-duration',
      'transition-timing-function',
    ];
    // Preserve generated id/ARIA relationships; explicit per-demo radio names compare exactly.
    const ids = new Map(
      [...element.querySelectorAll('[id]')].map((node, index) => [node.id, `id-${index}`]),
    );
    const attributeValue = (key: string, value: string) => {
      if (key === 'id') return ids.get(value) ?? value;
      if (
        [
          'for',
          'aria-labelledby',
          'aria-describedby',
          'aria-controls',
          'aria-owns',
          'aria-activedescendant',
        ].includes(key)
      )
        return value
          .split(/\s+/)
          .map((token) => ids.get(token) ?? token)
          .join(' ');
      return value;
    };
    return [...element.querySelectorAll('[class*="semi-"], svg, svg path, span, h2, p, input')].map(
      (node) => {
        const rect = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return {
          tag: node.tagName,
          classes: [...node.classList].sort(),
          attributes: Object.fromEntries(
            [...node.attributes]
              .filter(
                (attribute) =>
                  !['style', 'class', 'checked'].includes(attribute.name) &&
                  !(
                    ['aria-disabled', 'aria-invalid', 'aria-required'].includes(attribute.name) &&
                    attribute.value === 'false'
                  ),
              )
              .sort((left, right) => left.name.localeCompare(right.name))
              .map((attribute) => [
                attribute.name,
                attributeValue(attribute.name, attribute.value),
              ]),
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
          checked: (node as HTMLInputElement).checked ?? null,
          value: (node as HTMLInputElement).value ?? null,
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
    await root.evaluate(async (element) => {
      const urls = [...element.querySelectorAll('.semi-carousel-content-item')]
        .map((node) => getComputedStyle(node).backgroundImage.match(/url\(["']?(.*?)["']?\)/)?.[1])
        .filter(Boolean);
      await Promise.all(
        urls.map(
          (src) =>
            new Promise<void>((resolve, reject) => {
              const image = new Image();
              image.onload = () => resolve();
              image.onerror = () => reject(new Error(`Carousel background failed: ${src}`));
              image.src = src!;
            }),
        ),
      );
    });
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

for (const locale of ['zh-cn', 'en-us'] as const)
  for (const theme of ['light', 'dark'] as const)
    for (const example of examples)
      for (const direction of ['ltr', 'rtl'] as const)
        test(`Carousel 文档 ${example.name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
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
            // Playwright's page.clock is shared by every page in this BrowserContext.
            await context.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
            await context.clock.pauseAt(new Date('2026-01-01T00:00:01Z'));
            await reference.goto(
              `http://127.0.0.1:4173/docs.html?component=carousel&locale=${locale}&theme=${theme}&example=${example.block}`,
            );
            const expected = reference.locator('#root');
            // Establish the reference independently before loading the Vue page.
            await expect(expected.locator('.semi-carousel')).not.toHaveCount(0);
            await vue.goto(`/${locale}/components/carousel/`);
            const demo = vue.locator(`[data-demo-id="carousel/${locale}/${example.name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual.locator('.semi-carousel')).toHaveCount(
              await expected.locator('.semi-carousel').count(),
            );
            await expect(actual).toBeVisible();
            const source = await readFile(
              new URL(`../../src/demos/carousel/${locale}/${example.name}.vue`, import.meta.url),
              'utf8',
            );
            expect(await demo.locator('[data-demo-source] code').textContent()).toBe(source);
            await align(reference, expected, vue, actual, direction);
            const compare = async (
              state: string,
              hover = false,
              sample = example.name === 'Animation' ? 1000 : 300,
            ) => {
              await waitForVisualAssets([expected, actual]);
              if (!hover)
                await Promise.all([reference, vue].map((page) => page.mouse.move(1400, 880)));
              await freezeAnimations([reference, vue], sample);
              const expectedTarget = expected;
              const actualTarget = actual;
              const [referenceNodes, vueNodes] = await Promise.all([
                measure(expectedTarget),
                measure(actualTarget),
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
              const images = await Promise.all([
                expectedTarget.screenshot(),
                actualTarget.screenshot(),
              ]);
              for (const [i, label] of ['reference', 'vue'].entries())
                await info.attach(state === 'default' ? label : `${state}-${label}`, {
                  body: images[i]!,
                  contentType: 'image/png',
                });
              await expectScreenshotPixelsToMatch(vue, images[1]!, images[0]!, state);
            };
            const roots = [expected, actual];
            const active = (root: Locator) => root.locator('.semi-carousel-indicator-item-active');
            const assertIndex = async (index: number) => {
              for (const root of roots) {
                await expect(active(root)).toHaveAttribute('data-index', String(index));
                await expect(root.locator('.semi-carousel-content-item-active')).toHaveCount(1);
                await expect(root.locator('.semi-carousel-content-item').nth(index)).toHaveClass(
                  /semi-carousel-content-item-active/,
                );
              }
            };
            const advance = async (ms: number) => {
              await context.clock.runFor(ms);
            };
            const select = async (value: string) => {
              const name = value === 'true' ? 'show' : value === 'false' ? 'hide' : value;
              for (const root of roots) {
                // Radio's public value is not a native input[value] attribute. Its addon names it.
                await root.getByText(name, { exact: true }).click();
                // Same-name native radios can be restored by another controlled group in this
                // pinned example. The component selection and demonstrated result are the intent;
                // measure() still compares every native checked property between frameworks.
                await expect(
                  root
                    .locator('.semi-radio')
                    .filter({ has: root.page().getByRole('radio', { name, exact: true }) }),
                ).toHaveClass(/semi-radio-checked/);
              }
            };
            await test.step('初始三张内容、指示器与完整视觉', async () => {
              for (const root of roots) {
                await expect(root.locator('.semi-carousel-content-item')).toHaveCount(3);
                await expect(root.locator('.semi-carousel-indicator-item')).toHaveCount(3);
                await expect(root.locator('.semi-carousel-arrow-prev')).toHaveCount(1);
                await expect(root.locator('.semi-carousel-arrow-next')).toHaveCount(1);
              }
              await assertIndex(0);
              await compare('default');
            });
            await test.step('下一张、上一张循环、指示器直达与动画终态', async () => {
              for (const root of roots) await root.locator('.semi-carousel-arrow-next').click();
              await assertIndex(1);
              if (example.name === 'Animation') await compare('next-midpoint', false, 500);
              await compare('next');
              for (const root of roots) await root.locator('.semi-carousel-arrow-prev').click();
              await assertIndex(0);
              for (const root of roots) await root.locator('.semi-carousel-arrow-prev').click();
              await assertIndex(2);
              await compare('previous-wrap');
              for (const root of roots)
                await root.locator('.semi-carousel-indicator-item[data-index="0"]').click();
              await assertIndex(0);
              await compare('indicator');
            });
            if (example.name === 'Theme') {
              await test.step('三种主题', async () => {
                for (const value of ['light', 'dark', 'primary']) {
                  await select(value);
                  for (const root of roots)
                    await expect(root.locator('.semi-carousel-arrow').first()).toHaveClass(
                      new RegExp(`semi-carousel-arrow-${value}`),
                    );
                  await compare(`theme-${value}`);
                }
              });
            }
            if (example.name === 'Indicators') {
              await test.step('全部指示器类型、位置与尺寸', async () => {
                for (const value of [
                  'line',
                  'columnar',
                  'dot',
                  'center',
                  'right',
                  'left',
                  'medium',
                  'small',
                ]) {
                  await select(value);
                  for (const root of roots) {
                    if (['small', 'medium'].includes(value))
                      await expect(
                        root.locator('.semi-carousel-indicator-item').first(),
                      ).toHaveClass(new RegExp(`semi-carousel-indicator-item-${value}`));
                    else
                      await expect(root.locator(`.semi-carousel-indicator-${value}`)).toHaveCount(
                        1,
                      );
                  }
                  await compare(`indicator-${value}`);
                }
              });
            }
            if (example.name === 'Arrows') {
              await test.step('隐藏、恢复与 hover 箭头', async () => {
                await select('false');
                for (const root of roots)
                  await expect(root.locator('.semi-carousel-arrow')).toHaveCount(0);
                await compare('arrows-hidden');
                await select('true');
                await select('hover');
                for (const root of roots)
                  await expect(root.locator('.semi-carousel-arrow')).toHaveClass(
                    /semi-carousel-arrow-hover/,
                  );
                await compare('arrows-hover-away');
                for (const root of roots) await root.locator('.semi-carousel').hover();
                await compare('arrows-hover', true);
                await select('always');
                for (const root of roots)
                  await expect(root.locator('.semi-carousel-arrow')).not.toHaveClass(
                    /semi-carousel-arrow-hover/,
                  );
                await compare('arrows-restored');
              });
            }
            if (example.name === 'Basic' || example.name === 'AutoPlay') {
              await test.step('自动播放、悬停暂停与离开恢复', async () => {
                // Fixed Foundation uses interval + speed (2000/1500 + 300), and 400ms hover debounce.
                for (const root of roots) await root.locator('.semi-carousel').hover();
                await advance(400);
                const pausedIndex = Number(await active(actual).getAttribute('data-index'));
                await advance(5000);
                await assertIndex(pausedIndex);
                await compare('autoplay-paused', true);
                for (const page of [reference, vue]) await page.mouse.move(1400, 880);
                await advance(400);
                const interval = example.name === 'AutoPlay' ? 1800 : 2300;
                await advance(interval - 1);
                await assertIndex(pausedIndex);
                await advance(1);
                await assertIndex((pausedIndex + 1) % 3);
                await compare('autoplay-resumed');
              });
            }
            if (theme === 'light' && direction === 'ltr') {
              await test.step('真实时钟下源码、重置与在线编辑生命周期', async () => {
                // A separate context keeps Monaco outside the shared controlled clock.
                const editorContext = await visualContext(browser, info, locale, theme, direction);
                try {
                  const docs = await editorContext.newPage();
                  observe(docs);
                  await docs.goto(`/${locale}/components/carousel/`);
                  const block = docs.locator(`[data-demo-id="carousel/${locale}/${example.name}"]`);
                  const preview = block.locator('[data-demo-preview]');
                  // Toolbar buttons exist in SSR HTML before their click handlers are hydrated.
                  // The preview is ClientOnly, so its mounted component proves this block is ready.
                  await expect(preview.locator('.semi-carousel')).toHaveCount(1);
                  await expect(preview.locator('.demo-loading')).toHaveCount(0);
                  const action = (zh: string, en: string) =>
                    block.getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
                  await action('查看源码', 'View source').click();
                  await expect(block.locator('[data-demo-source]')).toBeVisible();
                  expect(await block.locator('[data-demo-source] code').textContent()).toBe(source);
                  await action('查看源码', 'View source').click();
                  await expect(block.locator('[data-demo-source]')).toBeHidden();
                  await action('重置', 'Reset').click();
                  await expect(preview.locator('.semi-carousel-content-item')).toHaveCount(3);
                  await action('在线编辑', 'Edit online').click();
                  const editor = block.frameLocator('iframe').locator('#app');
                  await expect(editor.locator('.semi-carousel-content-item')).toHaveCount(3, {
                    timeout: 30_000,
                  });
                  await expect(block.locator('.msg.err')).toHaveCount(0);
                  await action('退出编辑', 'Close editor').click();
                  await expect(block.locator('iframe')).toHaveCount(0);
                  await expect(preview.locator('.semi-carousel-content-item')).toHaveCount(3);
                  await preview.locator('.semi-carousel-arrow-next').click();
                  await expect(
                    preview.locator('.semi-carousel-indicator-item-active'),
                  ).not.toHaveAttribute('data-index', '0');
                } finally {
                  await editorContext.close();
                }
              });
            }
            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'show/carousel',
                index: example.block,
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
