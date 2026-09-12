import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { freezeAnimations } from './demo-parity';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

test.use({ actionTimeout: 10_000 });

// Every documented example renders the same three panels; `interaction` names the documented
// toggle path the example exists to demonstrate.
const examples: Array<{
  name: string;
  interaction: 'single' | 'accordion' | 'disabled';
}> = [
  { name: 'Basic', interaction: 'single' },
  { name: 'Accordion', interaction: 'accordion' },
  { name: 'Disabled', interaction: 'disabled' },
  { name: 'HideIcon', interaction: 'single' },
  { name: 'CustomIcon', interaction: 'single' },
  { name: 'Extra', interaction: 'single' },
];

const panels = (root: Locator) => root.locator('.semi-collapse-item');
const header = (root: Locator, index: number) =>
  panels(root).nth(index).locator('.semi-collapse-header');

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
    const idReferences = [
      'for',
      'aria-labelledby',
      'aria-describedby',
      'aria-controls',
      'aria-owns',
      'aria-activedescendant',
    ];
    // Generated ids (React getUuidShort, Vue useId) differ per instance. Resolve each id and every
    // id reference to the order of its first appearance inside this root, so a missing, duplicated
    // or reordered definition still fails while identical trees compare exactly. Collapsed panels
    // reference a content id whose element is not mounted (the fixed Adapter assigns the id after
    // mount and the Collapsible drops the closed DOM), so references register ids too.
    const idIndex = new Map<string, string>();
    const registerId = (value: string | null) => {
      if (value && !idIndex.has(value)) idIndex.set(value, `id-${idIndex.size}`);
    };
    for (const node of element.querySelectorAll('[id]')) registerId(node.getAttribute('id'));
    for (const node of element.querySelectorAll('*'))
      for (const attribute of node.attributes)
        if (idReferences.includes(attribute.name))
          for (const token of attribute.value.split(/\s+/)) registerId(token);
    const resolveId = (name: string, value: string) => {
      if (name === 'id') return idIndex.get(value) ?? value;
      if (!idReferences.includes(name)) return value;
      return value
        .split(/\s+/)
        .map((token) => idIndex.get(token) ?? token)
        .join(' ');
    };
    // Every component node carries a `semi-` class; the documented body paragraphs and icon paths
    // are matched separately because their text, geometry and path data are part of the contract.
    return [...element.querySelectorAll('[class*="semi-"], input, svg path, br, p')].map((node) => {
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return {
        tag: node.tagName,
        classes: [...node.classList].sort(),
        attributes: Object.fromEntries(
          [...node.attributes]
            .filter((attribute) => !['style', 'class'].includes(attribute.name))
            .map((attribute) => [attribute.name, resolveId(attribute.name, attribute.value)])
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

/** Wait for the expand/collapse transition to reach its terminal state before comparing. */
async function settle(root: Locator) {
  let previous: number | undefined;
  await expect
    .poll(
      async () => {
        const state = await root.evaluate((element) => {
          const wrapper = element.querySelector(
            '.semi-collapse-item-active .semi-collapsible-wrapper',
          );
          return {
            height: wrapper ? parseFloat(getComputedStyle(wrapper).height) : 0,
            transitioning: Boolean(element.querySelector('.semi-collapsible-transition')),
          };
        });
        const stable = !state.transitioning && state.height === previous;
        previous = state.height;
        return stable;
      },
      { timeout: 5_000, intervals: [50, 50, 100, 100, 200, 200] },
    )
    .toBe(true);
}

for (const locale of ['zh-cn', 'en-us'])
  for (const theme of ['light', 'dark'])
    for (const [index, example] of examples.entries())
      for (const direction of ['ltr', 'rtl'])
        test(`Collapse 文档 ${example.name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
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
              `http://127.0.0.1:4173/docs.html?component=collapse&locale=${locale}&theme=${theme}&example=${index + 1}`,
            );
            const expected = reference.locator('#root');
            // Establish the reference independently before loading the Vue page.
            await expect(expected.locator('.semi-collapse-item')).toHaveCount(3);
            await vue.goto(`/${locale}/components/collapse/`);
            const demo = vue.locator(`[data-demo-id="collapse/${locale}/${example.name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(panels(actual)).toHaveCount(3);
            await expect(actual).toBeVisible();
            const source = await readFile(
              new URL(`../../src/demos/collapse/${locale}/${example.name}.vue`, import.meta.url),
              'utf8',
            );
            expect(await demo.locator('[data-demo-source] code').textContent()).toBe(source);
            await expect(actual.locator('.semi-collapse-item-active')).toHaveCount(0);
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
              // Each panel is a separate crop: neighbouring panels cannot dilute a defect.
              for (let item = 0; item < 3; item++) {
                const crops = await Promise.all(
                  [expected, actual].map((root) => panels(root).nth(item).screenshot()),
                );
                for (const [i, label] of ['reference', 'vue'].entries())
                  await info.attach(`${state}-panel-${item}-${label}`, {
                    body: crops[i]!,
                    contentType: 'image/png',
                  });
                await expectScreenshotPixelsToMatch(
                  vue,
                  crops[1]!,
                  crops[0]!,
                  `${state}-panel-${item}`,
                );
              }
            };
            await test.step('默认结构、样式、几何与逐面板截图', () => compare('default'));

            if (example.name === 'HideIcon')
              await test.step('首面板不渲染箭头图标', async () => {
                for (const root of [expected, actual])
                  await expect(
                    panels(root).first().locator('.semi-collapse-header-icon'),
                  ).toHaveCount(0);
              });

            if (example.interaction === 'single')
              await test.step('展开首个面板', async () => {
                for (const root of [expected, actual]) {
                  await header(root, 0).click();
                  await expect(panels(root).nth(0)).toHaveClass(/semi-collapse-item-active/);
                  await expect(header(root, 0)).toHaveAttribute('aria-expanded', 'true');
                }
                for (const [root, page] of [
                  [expected, reference],
                  [actual, vue],
                ] as const) {
                  await settle(root);
                  await page.waitForFunction(() =>
                    document.getAnimations().every((item) => item.playState !== 'running'),
                  );
                }
                await compare('panel-1-open');
              });

            if (example.interaction === 'accordion')
              await test.step('手风琴只保留一个展开面板', async () => {
                for (const root of [expected, actual]) {
                  await header(root, 0).click();
                  await expect(root.locator('.semi-collapse-item-active')).toHaveCount(1);
                  await header(root, 1).click();
                  await expect(root.locator('.semi-collapse-item-active')).toHaveCount(1);
                  await expect(panels(root).nth(0)).not.toHaveClass(/semi-collapse-item-active/);
                  await expect(panels(root).nth(1)).toHaveClass(/semi-collapse-item-active/);
                }
                for (const [root, page] of [
                  [expected, reference],
                  [actual, vue],
                ] as const) {
                  await settle(root);
                  await page.waitForFunction(() =>
                    document.getAnimations().every((item) => item.playState !== 'running'),
                  );
                }
                await compare('panel-2-open');
              });

            if (example.interaction === 'disabled')
              await test.step('禁用面板不响应点击', async () => {
                for (const root of [expected, actual]) {
                  await expect(header(root, 0)).toHaveAttribute('aria-disabled', 'true');
                  // Playwright refuses to click an aria-disabled control; dispatch the real click
                  // event so the example still proves the disabled panel ignores it.
                  await header(root, 0).dispatchEvent('click');
                  await expect(root.locator('.semi-collapse-item-active')).toHaveCount(0);
                  await header(root, 1).click();
                  await expect(root.locator('.semi-collapse-item-active')).toHaveCount(1);
                  await expect(panels(root).nth(1)).toHaveClass(/semi-collapse-item-active/);
                }
                for (const [root, page] of [
                  [expected, reference],
                  [actual, vue],
                ] as const) {
                  await settle(root);
                  await page.waitForFunction(() =>
                    document.getAnimations().every((item) => item.playState !== 'running'),
                  );
                }
                await compare('panel-2-open');
              });

            if (example.name === 'Extra')
              await test.step('辅助区域内容可见', async () => {
                for (const root of [expected, actual]) {
                  await expect(root.getByText('1234', { exact: true })).toBeVisible();
                  await expect(root.getByText('Recommended', { exact: true })).toBeVisible();
                }
              });

            if (theme === 'light' && direction === 'ltr') {
              await test.step('源码、重置与在线编辑生命周期', async () => {
                const block = vue.locator(`[data-demo-id="collapse/${locale}/${example.name}"]`);
                const preview = block.locator('[data-demo-preview]');
                const action = (zh: string, en: string) =>
                  block.getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
                const assertInitial = async (root: Locator) => {
                  await expect(root.locator('.semi-collapse-item')).toHaveCount(3);
                  await expect(root.locator('.semi-collapse-item-active')).toHaveCount(0);
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
                await expect(editor.locator('.semi-collapse-item')).toHaveCount(3, {
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
                upstream: 'show/collapse',
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
