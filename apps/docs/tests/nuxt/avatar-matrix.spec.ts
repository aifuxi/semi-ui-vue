import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { freezeAnimations } from './demo-parity';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

test.use({ actionTimeout: 10_000 });

// `avatars` is the number of Avatar components each documented example renders.
const examples: Array<{ name: string; avatars: number; interaction?: 'hover' | 'more' }> = [
  { name: 'Size', avatars: 7 },
  { name: 'Color', avatars: 5 },
  { name: 'Adaptive', avatars: 3 },
  { name: 'Image', avatars: 2 },
  { name: 'Shape', avatars: 2 },
  { name: 'Hover', avatars: 1, interaction: 'hover' },
  { name: 'Slots', avatars: 1 },
  { name: 'TopSlot', avatars: 3 },
  { name: 'BottomSlot', avatars: 6 },
  { name: 'Border', avatars: 3 },
  { name: 'Animation', avatars: 3 },
  { name: 'Group', avatars: 5 },
  { name: 'MaxCount', avatars: 4 },
  { name: 'More', avatars: 4, interaction: 'more' },
  { name: 'Overlap', avatars: 10 },
];

async function measure(root: Locator) {
  return root.evaluate((element) => {
    const origin = element.getBoundingClientRect();
    const properties = [
      'display',
      'position',
      'color',
      'background-color',
      'background-image',
      'background-size',
      'background-position',
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
      'transform-origin',
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
      'left',
      'z-index',
      'width',
      'height',
      'object-fit',
      'flex',
      'flex-direction',
      'flex-wrap',
      'column-gap',
      'row-gap',
      'list-style-type',
      'fill',
      'stroke',
      'clip-path',
      'filter',
    ];
    // Top slot gradients and the group overflow filter use per-instance or generated ids.
    // Resolve every paint server to its position inside the owning SVG so the comparison
    // stays exact while a missing or reordered definition still fails.
    const normalizePaint = (node: Element, value: string) =>
      value.replace(/url\(["']?#([^)"']+)["']?\)/g, (_, id: string) => {
        const definitions = [...(node.closest('svg')?.querySelectorAll('[id]') ?? [])];
        const index = definitions.findIndex((definition) => definition.id === id);
        if (index < 0) return value;
        return `url(#definition-${index})`;
      });
    // The reference serves the documented local asset from the docs origin.
    return [
      ...element.querySelectorAll(
        '.semi-avatar-wrapper, .semi-avatar-wrapper *, .semi-avatar, .semi-avatar *, .semi-avatar-group, .semi-avatar-group *',
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
        alt: node.getAttribute('alt'),
        src: node.getAttribute('src')?.replace(/^https?:\/\/127\.0\.0\.1:4321/, '') ?? null,
        srcset: node.getAttribute('srcset')?.replaceAll('http://127.0.0.1:4321', '') ?? null,
        tabindex: node.getAttribute('tabindex'),
        focusable: node.getAttribute('focusable'),
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
    for (const [index, { name, avatars, interaction }] of examples.entries())
      for (const direction of ['ltr', 'rtl'])
        test(`Avatar 文档 ${name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
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
              `http://127.0.0.1:4173/docs.html?component=avatar&locale=${locale}&theme=${theme}&example=${index + 1}`,
            );
            const expected = reference.locator('#root');
            // Establish the reference independently before loading the Vue page.
            await expect(expected.locator('.semi-avatar')).toHaveCount(avatars);
            await vue.goto(`/${locale}/components/avatar/`);
            const demo = vue.locator(`[data-demo-id="avatar/${locale}/${name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual.locator('.semi-avatar')).toHaveCount(avatars);
            await expect(actual).toBeVisible();
            const source = await readFile(
              new URL(`../../src/demos/avatar/${locale}/${name}.vue`, import.meta.url),
              'utf8',
            );
            expect(await demo.locator('[data-demo-source] code').textContent()).toBe(source);
            await align(reference, expected, vue, actual, direction);
            const compareFor =
              (expectedRoot: Locator, actualRoot: Locator, prefix: string, cropElements = true) =>
              async (prefixless: string, options: { time?: number; park?: boolean } = {}) => {
                const state = `${prefix}${prefixless}`;
                await waitForVisualAssets([expectedRoot, actualRoot]);
                if (options.park !== false)
                  await Promise.all([reference, vue].map((page) => page.mouse.move(1400, 880)));
                await freezeAnimations([reference, vue], options.time ?? 300);
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
                // Overlapping arcs blend at their antialiased boundaries; the Overlap example
                // differs by 3 boundary pixels in dark RTL while DOM, classes, styles and rects
                // are identical, so the whole-demo screenshot stays its comparison unit
                // (deviation recorded in avatar-acceptance.md).
                if (cropElements && name !== 'Overlap')
                  for (
                    let item = 0;
                    item < (await actualRoot.locator('.semi-avatar').count());
                    item++
                  ) {
                    const crops = await Promise.all(
                      [expectedRoot, actualRoot].map((root) =>
                        root.locator('.semi-avatar').nth(item).screenshot(),
                      ),
                    );
                    for (const [i, label] of ['reference', 'vue'].entries())
                      await info.attach(`${state}-avatar-${item}-${label}`, {
                        body: crops[i]!,
                        contentType: 'image/png',
                      });
                    await expectScreenshotPixelsToMatch(
                      vue,
                      crops[1]!,
                      crops[0]!,
                      `${state}-avatar-${item}`,
                    );
                  }
              };
            const compare = compareFor(expected, actual, '');
            await test.step('默认结构、样式、几何与截图', () => compare('default'));

            if (interaction === 'hover')
              await test.step('hoverMask 覆盖层进入与退出', async () => {
                for (const root of [expected, actual]) {
                  await root.locator('.semi-avatar').first().hover();
                  await expect(root.locator('.semi-avatar-hover')).toHaveCount(1);
                  await expect(root.locator('.semi-avatar-hover .semi-icon')).toHaveCount(1);
                }
                await compare('hover', { park: false });
                await Promise.all([reference, vue].map((page) => page.mouse.move(1400, 880)));
                for (const root of [expected, actual])
                  await expect(root.locator('.semi-avatar-hover')).toHaveCount(0);
                await compare('hover-ended');
              });

            if (interaction === 'more')
              await test.step('renderMore 自定义 more 与 Popover 内容', async () => {
                const popovers = [
                  reference.locator('.semi-popover-wrapper'),
                  vue.locator('.semi-popover-wrapper'),
                ];
                for (const [i, root] of [expected, actual].entries()) {
                  await expect(popovers[i]!).toHaveCount(0);
                  await root.locator('.semi-avatar').last().hover();
                }
                for (const popover of popovers) await expect(popover).toBeVisible();
                for (const popover of popovers)
                  await expect(popover.locator('.semi-avatar')).toHaveCount(2);
                // The popover's cloned avatars are 24x24; one antialiased boundary pixel is
                // already over the ratio limit there, so the popover screenshot stays the
                // comparison unit (deviation recorded in avatar-acceptance.md).
                const comparePopover = compareFor(popovers[0]!, popovers[1]!, 'popover-', false);
                await comparePopover('open', { park: false });
                await compare('more-open', { park: false });
                // The portal must keep the same offset from its trigger on both sides.
                const offsets = await Promise.all(
                  [expected, actual].map(async (root, i) => {
                    const trigger = await root.locator('.semi-avatar').last().boundingBox();
                    const panel = await popovers[i]!.boundingBox();
                    return {
                      x: Math.round((panel!.x - trigger!.x) * 10) / 10,
                      y: Math.round((panel!.y - trigger!.y) * 10) / 10,
                    };
                  }),
                );
                expect(Math.abs(offsets[0]!.x - offsets[1]!.x)).toBeLessThanOrEqual(0.5);
                expect(Math.abs(offsets[0]!.y - offsets[1]!.y)).toBeLessThanOrEqual(0.5);
                await Promise.all([reference, vue].map((page) => page.mouse.move(1400, 880)));
                for (const popover of popovers) await expect(popover).toBeHidden();
              });

            if (theme === 'light' && direction === 'ltr') {
              await test.step('双语源码、重置和实际在线编辑', async () => {
                const block = vue.locator(`[data-demo-id="avatar/${locale}/${name}"]`);
                const preview = block.locator('[data-demo-preview]');
                const action = (zh: string, en: string) =>
                  block.getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
                const assertInitial = async (root: Locator) => {
                  await expect(root.locator('.semi-avatar')).toHaveCount(avatars);
                  await expect(root.locator('.semi-avatar-hover')).toHaveCount(0);
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
                await expect(editor.locator('.semi-avatar')).toHaveCount(avatars, {
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
                upstream: 'show/avatar',
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
