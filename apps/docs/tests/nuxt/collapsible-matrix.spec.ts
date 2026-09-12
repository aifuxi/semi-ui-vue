import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { freezeAnimations } from './demo-parity';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

test.use({ actionTimeout: 10_000 });

// `interaction` names the documented toggle path each example exists to demonstrate.
const examples: Array<{
  name: string;
  interaction: 'basic' | 'duration' | 'nested' | 'show-more';
}> = [
  { name: 'Basic', interaction: 'basic' },
  { name: 'Duration', interaction: 'duration' },
  { name: 'Nested', interaction: 'nested' },
  { name: 'CollapseHeight', interaction: 'show-more' },
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
      'background-size',
      'background-position',
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
      'box-shadow',
      'transform',
      'transform-origin',
      'transition-property',
      'transition-duration',
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
      'fill-opacity',
      'stroke',
      'stroke-width',
    ];
    // Component nodes carry a `semi-` class; native controls, list/paragraph structure, the
    // documented "+ Show More" anchor and icon paths are matched separately because their text,
    // attributes and geometry are part of the contract.
    return [...element.querySelectorAll('[class*="semi-"], input, svg path, br, p, ul, li, a')].map(
      (node) => {
        const rect = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return {
          tag: node.tagName,
          classes: [...node.classList].sort(),
          attributes: Object.fromEntries(
            [...node.attributes]
              .filter((attribute) => !['style', 'class'].includes(attribute.name))
              // `aria-disabled`/`aria-invalid`/`aria-required` default to false, so an explicit
              // "false" and an omitted attribute state the same thing (ARIA 1.2 defaults). The
              // embedded InputNumber still renders the explicit form; its own batch owns that choice.
              .filter(
                (attribute) =>
                  !(
                    ['aria-disabled', 'aria-invalid', 'aria-required'].includes(attribute.name) &&
                    attribute.value === 'false'
                  ),
              )
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

/** Wait for every expand/collapse transition to reach its terminal state before comparing. */
async function settle(root: Locator) {
  let previous = '';
  await expect
    .poll(
      async () => {
        const state = await root.evaluate((element) => ({
          heights: [...element.querySelectorAll('.semi-collapsible-wrapper')].map((wrapper) =>
            getComputedStyle(wrapper).height.trim(),
          ),
          transitioning: Boolean(element.querySelector('.semi-collapsible-transition')),
        }));
        const key = state.heights.join(',');
        const stable = !state.transitioning && key === previous;
        previous = key;
        return stable;
      },
      { timeout: 5_000, intervals: [50, 50, 100, 100, 200, 200] },
    )
    .toBe(true);
}

const wrapperHeights = (root: Locator) =>
  root
    .locator('.semi-collapsible-wrapper')
    .evaluateAll((wrappers) =>
      wrappers.map((wrapper) => parseFloat(getComputedStyle(wrapper).height)),
    );

for (const locale of ['zh-cn', 'en-us'])
  for (const theme of ['light', 'dark'])
    for (const [index, example] of examples.entries())
      for (const direction of ['ltr', 'rtl'])
        test(`Collapsible 文档 ${example.name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
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
              `http://127.0.0.1:4173/docs.html?component=collapsible&locale=${locale}&theme=${theme}&example=${index + 1}`,
            );
            const expected = reference.locator('#root');
            // Establish the reference independently before loading the Vue page.
            // A nested panel only mounts once its parent is open, so every example starts with one
            // wrapper.
            await expect(expected.locator('.semi-collapsible-wrapper')).toHaveCount(1);
            await vue.goto(`/${locale}/components/collapsible/`);
            const demo = vue.locator(`[data-demo-id="collapsible/${locale}/${example.name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual.locator('.semi-collapsible-wrapper')).toHaveCount(1);
            await expect(actual).toBeVisible();
            const source = await readFile(
              new URL(`../../src/demos/collapsible/${locale}/${example.name}.vue`, import.meta.url),
              'utf8',
            );
            expect(await demo.locator('[data-demo-source] code').textContent()).toBe(source);
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
              // The panel area is a separate crop so the toggle controls cannot dilute a defect; a
              // fully collapsed panel has no visible area to crop.
              const panelBox = await expected
                .locator('.semi-collapsible-wrapper')
                .first()
                .boundingBox();
              if (panelBox && panelBox.height > 0 && panelBox.width > 0) {
                const crops = await Promise.all(
                  [expected, actual].map((root) =>
                    root.locator('.semi-collapsible-wrapper').first().screenshot(),
                  ),
                );
                for (const [i, label] of ['reference', 'vue'].entries())
                  await info.attach(`${state}-panel-${label}`, {
                    body: crops[i]!,
                    contentType: 'image/png',
                  });
                await expectScreenshotPixelsToMatch(vue, crops[1]!, crops[0]!, `${state}-panel`);
              }
            };
            await align(reference, expected, vue, actual, direction);
            await test.step('默认结构、样式、几何与面板截图', () => compare('default'));

            if (example.interaction === 'basic')
              await test.step('展开后再次收起', async () => {
                for (const root of [expected, actual]) {
                  await root.getByRole('button', { name: 'Toggle', exact: true }).click();
                  await expect(root.locator('.semi-collapsible-wrapper')).not.toHaveCSS(
                    'height',
                    '0px',
                  );
                  await settle(root);
                }
                await compare('open');
                for (const root of [expected, actual]) {
                  await root.getByRole('button', { name: 'Toggle', exact: true }).click();
                  await expect(root.locator('.semi-collapsible-wrapper')).toHaveCSS(
                    'height',
                    '0px',
                  );
                  await settle(root);
                }
                await compare('closed-again');
              });

            if (example.interaction === 'duration')
              await test.step('修改动画时间后展开', async () => {
                for (const root of [expected, actual]) {
                  const input = root.locator('input').first();
                  expect(await input.inputValue()).toBe('250');
                  await input.fill('500');
                  await input.press('Enter');
                  expect(await input.inputValue()).toBe('500');
                  await root.getByRole('button', { name: 'Toggle', exact: true }).click();
                  await expect(root.locator('.semi-collapsible-wrapper')).not.toHaveCSS(
                    'height',
                    '0px',
                  );
                  await settle(root);
                }
                await compare('open');
              });

            if (example.interaction === 'nested')
              await test.step('父子面板依次展开', async () => {
                for (const root of [expected, actual]) {
                  await root.getByRole('button', { name: 'Toggle', exact: true }).click();
                  await expect(root.locator('.semi-collapsible-wrapper').first()).not.toHaveCSS(
                    'height',
                    '0px',
                  );
                  await settle(root);
                  await expect(root.locator('.semi-collapsible-wrapper')).toHaveCount(2);
                  await root.getByRole('button', { name: 'Toggle List', exact: true }).click();
                  await settle(root);
                  for (const height of await wrapperHeights(root))
                    expect(height).toBeGreaterThan(0);
                }
                await compare('nested-open');
              });

            if (example.interaction === 'show-more')
              await test.step('+ Show More 展开到完整高度', async () => {
                for (const root of [expected, actual]) {
                  const collapsed = await wrapperHeights(root);
                  expect(collapsed[0]).toBeGreaterThan(0);
                  expect(collapsed[0]).toBeLessThan(60.5);
                  await expect(root.getByText('+ Show More', { exact: true })).toBeVisible();
                  await root.getByText('+ Show More', { exact: true }).click();
                  await expect(root.getByText('+ Show More', { exact: true })).toBeHidden();
                  await settle(root);
                  const expanded = await wrapperHeights(root);
                  expect(expanded[0]).toBeGreaterThan(collapsed[0]!);
                }
                await compare('expanded');
              });

            if (theme === 'light' && direction === 'ltr') {
              await test.step('源码、重置与在线编辑生命周期', async () => {
                const block = vue.locator(`[data-demo-id="collapsible/${locale}/${example.name}"]`);
                const preview = block.locator('[data-demo-preview]');
                const action = (zh: string, en: string) =>
                  block.getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
                const assertInitial = async (root: Locator) => {
                  const heights = await wrapperHeights(root);
                  if (example.interaction === 'show-more') {
                    expect(heights[0]).toBeGreaterThan(0);
                    await expect(root.getByText('+ Show More', { exact: true })).toBeVisible();
                  } else {
                    for (const height of heights) expect(height).toBe(0);
                  }
                  if (example.interaction === 'duration')
                    expect(await root.locator('input').first().inputValue()).toBe('250');
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
                await expect(editor.locator('.semi-collapsible-wrapper')).toHaveCount(1, {
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
                upstream: 'show/collapsible',
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
