import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { freezeAnimations } from './demo-parity';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

test.use({ actionTimeout: 10_000 });

const examples = [{ name: 'Example1', block: 1 }];

// The demos live in `zh-CN` / `en-US` directories while the batch (and the site routes) use the
// lower-case locale codes.
const demoDirectory = { 'zh-cn': 'zh-CN', 'en-us': 'en-US' } as const;

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
    ];
    // Generated ids (React getUuidShort / Spin gradients, Vue useId) differ per instance. Resolve
    // every id and id reference — including `url(#…)` in attributes and computed styles — to the
    // position of its definition inside this root, so a missing, duplicated or reordered definition
    // still fails while identical trees compare exactly.
    const idIndex = new Map<string, string>();
    for (const node of element.querySelectorAll('[id]')) {
      const value = node.getAttribute('id');
      if (value && !idIndex.has(value)) idIndex.set(value, `id-${idIndex.size}`);
    }
    const idReferences = [
      'for',
      'aria-labelledby',
      'aria-describedby',
      'aria-controls',
      'aria-owns',
      'aria-activedescendant',
    ];
    // Computed styles may quote the fragment (`url("#id")`), so accept both forms.
    const mapUrl = (value: string) =>
      value.replace(
        /url\(["']?#([^)"']+)["']?\)/g,
        (_, id: string) => `url(#${idIndex.get(id) ?? id})`,
      );
    const resolveId = (name: string, value: string) => {
      if (name === 'id') return idIndex.get(value) ?? value;
      if (idReferences.includes(name))
        return value
          .split(/\s+/)
          .map((token) => idIndex.get(token) ?? token)
          .join(' ');
      return mapUrl(value);
    };
    // Component nodes carry a `semi-` class; all options, listboxes and button content are
    // matched separately because their attributes, text and geometry are part of the contract.
    return [...element.querySelectorAll('[class*="semi-"], ul, li, button, svg path, span')].map(
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
                  !['style', 'class'].includes(attribute.name) &&
                  !attribute.name.startsWith('data-v-'),
              )
              // Keep attribute order deterministic across renderers.
              .sort((left, right) => (left.name < right.name ? -1 : 1))
              .map((attribute) => [attribute.name, resolveId(attribute.name, attribute.value)]),
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
          styles: Object.fromEntries(
            properties.map((key) => [key, mapUrl(style.getPropertyValue(key))]),
          ),
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

// Scroll selection is debounced and animated by the fixed Foundation. Wait for the actual
// selected class and centered geometry, preserving real time for editor and wheel behavior.
async function selected(root: Locator, column: number, text: string) {
  const wheel = root.locator('.semi-scrolllist-item-wheel').nth(column);
  const option = wheel.locator('.semi-scrolllist-item-selected');
  await expect(option).toHaveText(text);
  await expect
    .poll(async () => {
      const [item, line] = await Promise.all([
        option.boundingBox(),
        wheel.locator('.semi-scrolllist-selector').boundingBox(),
      ]);
      // Pinned SCSS gives the selector a 36px content height plus top/bottom borders,
      // while options are 36px border-boxes. Their centers coincide; their top edges do not.
      return item && line
        ? Math.abs(item.y + item.height / 2 - (line.y + line.height / 2))
        : Number.POSITIVE_INFINITY;
    })
    .toBeLessThanOrEqual(0.5);
}

async function clickOption(root: Locator, column: number, text: string, disabled = false) {
  const wheel = root.locator('.semi-scrolllist-item-wheel').nth(column);
  // Cyclic lists contain copies. Click the matching item nearest the visible selector.
  const options = wheel.getByRole('option', { name: text, exact: true });
  const line = await wheel.locator('.semi-scrolllist-selector').boundingBox();
  const candidates = await options.evaluateAll((nodes) =>
    nodes.map((node, index) => ({
      index,
      y: node.getBoundingClientRect().y,
    })),
  );
  candidates.sort((a, b) => Math.abs(a.y - line!.y) - Math.abs(b.y - line!.y));
  const target = options.nth(candidates[0]!.index);
  if (disabled) {
    // Locator.click correctly refuses aria-disabled controls. A real pointer can still hit
    // this visible option, which exercises the component's disabled selection guard.
    await expect(target).toHaveAttribute('aria-disabled', 'true');
    await expect(target).toBeVisible();
    const box = await target.boundingBox();
    expect(box).not.toBeNull();
    await root.page().mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);
  } else {
    await target.click();
  }
}

for (const locale of ['zh-cn', 'en-us'] as const)
  for (const theme of ['light', 'dark'] as const)
    for (const example of examples)
      for (const direction of ['ltr', 'rtl'] as const)
        test(`ScrollList 文档 ${example.name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
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
              `http://127.0.0.1:4173/docs.html?component=scroll-list&locale=${locale}&theme=${theme}&example=${example.block}`,
            );
            const expected = reference.locator('#root');
            // Establish the reference independently before loading the Vue page.
            await expect(expected.locator('.semi-scrolllist')).not.toHaveCount(0);
            await selected(expected, 0, locale === 'zh-cn' ? '下午' : 'PM');
            await selected(expected, 1, '2');
            await selected(expected, 2, '1');
            await vue.goto(`/${locale}/components/scroll-list/`);
            const demo = vue.locator(
              `[data-demo-id="scroll-list/${demoDirectory[locale]}/${example.name}"]`,
            );
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual.locator('.semi-scrolllist')).toHaveCount(
              await expected.locator('.semi-scrolllist').count(),
            );
            await expect(actual).toBeVisible();
            const source = await readFile(
              new URL(
                `../../src/demos/scroll-list/${demoDirectory[locale]}/${example.name}.vue`,
                import.meta.url,
              ),
              'utf8',
            );
            expect(await demo.locator('[data-demo-source] code').textContent()).toBe(source);
            await selected(actual, 0, locale === 'zh-cn' ? '下午' : 'PM');
            await selected(actual, 1, '2');
            await selected(actual, 2, '1');
            await align(reference, expected, vue, actual, direction);
            const compare = async (state: string) => {
              await waitForVisualAssets([expected, actual]);
              await Promise.all([reference, vue].map((page) => page.mouse.move(1400, 880)));
              await freezeAnimations([reference, vue], 300);
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
            await test.step('默认结构、样式、几何与截图', () => compare('default'));

            await test.step('三列点击选择与禁用项', async () => {
              for (const root of [expected, actual]) {
                await clickOption(root, 0, locale === 'zh-cn' ? '上午' : 'AM');
                await selected(root, 0, locale === 'zh-cn' ? '上午' : 'AM');
                await clickOption(root, 1, '3');
                await selected(root, 1, '3');
                await clickOption(root, 2, '3');
                await selected(root, 2, '3');
                await clickOption(root, 2, '4', true);
                await selected(root, 2, '3');
              }
              await compare('click-and-disabled');
            });
            await test.step('真实滚轮更新受控小时', async () => {
              for (const [root, page] of [
                [expected, reference],
                [actual, vue],
              ] as const) {
                await root.locator('.semi-scrolllist-list-outer').nth(1).hover();
                await page.mouse.wheel(0, 72);
                await selected(root, 1, '5');
              }
              await compare('wheel');
            });
            await test.step('Ok 保留列表并输出 close', async () => {
              for (const [root, page] of [
                [expected, reference],
                [actual, vue],
              ] as const) {
                const close = page.waitForEvent('console', (message) => message.text() === 'close');
                await root.getByRole('button', { name: 'Ok', exact: true }).click();
                await close;
                await expect(root.locator('.semi-scrolllist')).toBeVisible();
              }
            });

            if (theme === 'light' && direction === 'ltr') {
              await test.step('源码、重置与在线编辑生命周期', async () => {
                const block = vue.locator(
                  `[data-demo-id="scroll-list/${demoDirectory[locale]}/${example.name}"]`,
                );
                const preview = block.locator('[data-demo-preview]');
                const action = (zh: string, en: string) =>
                  block.getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
                const lists = await preview.locator('.semi-scrolllist').count();
                await action('查看源码', 'View source').click();
                await expect(block.locator('[data-demo-source]')).toBeVisible();
                expect(await block.locator('[data-demo-source] code').textContent()).toBe(source);
                await action('查看源码', 'View source').click();
                await expect(block.locator('[data-demo-source]')).toBeHidden();
                await action('重置', 'Reset').click();
                await expect(preview.locator('.semi-scrolllist')).toHaveCount(lists);
                await selected(preview, 0, locale === 'zh-cn' ? '下午' : 'PM');
                await selected(preview, 1, '2');
                await selected(preview, 2, '1');
                await action('在线编辑', 'Edit online').click();
                const editor = block.frameLocator('iframe').locator('#app');
                await expect(editor.locator('.semi-scrolllist')).toHaveCount(lists, {
                  timeout: 30_000,
                });
                await expect(block.locator('.msg.err')).toHaveCount(0);
                await action('退出编辑', 'Close editor').click();
                await expect(block.locator('iframe')).toHaveCount(0);
                await expect(preview.locator('.semi-scrolllist')).toHaveCount(lists);
              });
            }
            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'show/scrolllist',
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
