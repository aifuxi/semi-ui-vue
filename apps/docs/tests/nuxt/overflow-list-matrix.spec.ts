import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { freezeAnimations } from './demo-parity';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

test.use({ actionTimeout: 10_000 });

// All four pinned OverflowList snippets are the same list behind a width slider, so every case
// drives that slider to a documented narrow width and compares the collapsed/scroll state as well.
const examples: Array<{ name: string; block: number; narrow: number }> = [
  { name: 'Collapse', block: 1, narrow: 50 },
  { name: 'CollapseFromStart', block: 2, narrow: 30 },
  { name: 'MinVisibleItems', block: 3, narrow: 20 },
  { name: 'Scroll', block: 4, narrow: 60 },
];

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
    // Slider popup ids live outside this root, so they are not part of `idIndex`; assign stable
    // tokens by order of appearance instead of comparing the generated values across pages.
    const externalIdIndex = new Map<string, string>();
    const externalId = (id: string) => {
      if (!externalIdIndex.has(id)) externalIdIndex.set(id, `external-id-${externalIdIndex.size}`);
      return externalIdIndex.get(id)!;
    };
    const resolveId = (name: string, value: string) => {
      if (name === 'id') return idIndex.get(value) ?? value;
      if (idReferences.includes(name))
        return value
          .split(/\s+/)
          .map((token) => idIndex.get(token) ?? externalId(token))
          .join(' ');
      if (name === 'data-popupid') return idIndex.get(value) ?? externalId(value);
      return mapUrl(value);
    };
    // Component nodes carry a `semi-` class; controls, list structure, icons and paragraphs are
    // matched separately because their attributes, text and geometry are part of the contract.
    return [
      ...element.querySelectorAll('[class*="semi-"], input, button, svg path, br, p, span'),
    ].map((node) => {
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return {
        tag: node.tagName,
        classes: [...node.classList].sort(),
        attributes: Object.fromEntries(
          [...node.attributes]
            .filter(
              (attribute) =>
                // Vue reflects template `:checked` bindings to the attribute as well as the property
                // (@vue/runtime-dom patchProp) while React sets the property only; the measured
                // `checked` property below carries that contract.
                !['style', 'class', 'checked'].includes(attribute.name) &&
                // Vue SFC scoped styles stamp `data-v-*` on the template elements; the styling they
                // enable is still compared through computed styles.
                !attribute.name.startsWith('data-v-') &&
                // `aria-disabled`/`aria-invalid`/`aria-required` default to false, so an explicit
                // "false" and an omitted attribute state the same thing (ARIA 1.2 defaults).
                !(
                  ['aria-disabled', 'aria-invalid', 'aria-required'].includes(attribute.name) &&
                  attribute.value === 'false'
                ) &&
                // CheckboxGroup/RadioGroup clone their child with `role="listitem"`; the fixed React
                // List drops that unknown prop while the Vue List forwards native attrs to its root.
                !(attribute.name === 'role' && attribute.value === 'listitem'),
            )
            // Sort first so external-id tokens are assigned in the same order on both sides.
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

/**
 * Drive the demo slider to an exact percentage. Both Semi sliders map the arrow keys by writing
 * direction, so the mapping is probed once from the page instead of assumed to be LTR.
 */
async function driveSlider(page: Page, handle: Locator, target: number): Promise<void> {
  const value = async () => Number(await handle.getAttribute('aria-valuenow'));
  await handle.focus();
  const start = await value();
  if (start === target) return;
  await page.keyboard.press('ArrowLeft');
  const probed = await value();
  if (probed === start) throw new Error('滑块未响应键盘方向键。');
  const decrease = probed < start ? 'ArrowLeft' : 'ArrowRight';
  const increase = decrease === 'ArrowLeft' ? 'ArrowRight' : 'ArrowLeft';
  for (let i = 0; i < 400; i++) {
    const current = await value();
    if (current === target) return;
    await page.keyboard.press(current > target ? decrease : increase);
  }
  throw new Error(`滑块未能到达 ${target}%（当前 ${await value()}%）。`);
}

/**
 * Scroll mode derives its edge counts from IntersectionObserver callbacks, which settle a frame
 * after the container changes. Wait until both sides stop changing instead of guessing a delay.
 */
async function settleScrollEdges(roots: Locator[]): Promise<void> {
  for (const root of roots) {
    const edges = root.locator('.semi-overflow-list > .semi-tag');
    // Collapse mode renders its overflow inside `.semi-overflow-list-overflow` and has nothing to wait for.
    if ((await edges.count()) === 0) continue;
    let previous = '';
    let stable = false;
    for (let attempt = 0; attempt < 60 && !stable; attempt++) {
      const current = (await edges.allTextContents()).join('|');
      stable = current !== '' && current === previous;
      previous = current;
      if (!stable) await root.page().waitForTimeout(50);
    }
    if (!stable) throw new Error('滚动模式的边缘计数未稳定。');
  }
}

for (const locale of ['zh-cn', 'en-us'] as const)
  for (const theme of ['light', 'dark'] as const)
    for (const example of examples)
      for (const direction of ['ltr', 'rtl'] as const)
        test(`OverflowList 文档 ${example.name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
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
              `http://127.0.0.1:4173/docs.html?component=overflow-list&locale=${locale}&theme=${theme}&example=${example.block}`,
            );
            const expected = reference.locator('#root');
            // Establish the reference independently before loading the Vue page.
            await expect(expected.locator('.semi-overflow-list')).not.toHaveCount(0);
            await vue.goto(`/${locale}/components/overflow-list/`);
            const demo = vue.locator(
              `[data-demo-id="overflow-list/${demoDirectory[locale]}/${example.name}"]`,
            );
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual.locator('.semi-overflow-list')).toHaveCount(
              await expected.locator('.semi-overflow-list').count(),
            );
            await expect(actual).toBeVisible();
            const source = await readFile(
              new URL(
                `../../src/demos/overflow-list/${demoDirectory[locale]}/${example.name}.vue`,
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

            await test.step(`容器收窄到 ${example.narrow}% 后比较`, async () => {
              for (const [root, page] of [
                [expected, reference],
                [actual, vue],
              ] as const)
                await driveSlider(
                  page,
                  root.locator('.semi-slider-handle').first(),
                  example.narrow,
                );
              await settleScrollEdges([expected, actual]);
              await compare('narrow');
            });

            if (theme === 'light' && direction === 'ltr') {
              await test.step('源码、重置与在线编辑生命周期', async () => {
                const block = vue.locator(
                  `[data-demo-id="overflow-list/${demoDirectory[locale]}/${example.name}"]`,
                );
                const preview = block.locator('[data-demo-preview]');
                const action = (zh: string, en: string) =>
                  block.getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
                const lists = await preview.locator('.semi-overflow-list').count();
                await action('查看源码', 'View source').click();
                await expect(block.locator('[data-demo-source]')).toBeVisible();
                expect(await block.locator('[data-demo-source] code').textContent()).toBe(source);
                await action('查看源码', 'View source').click();
                await expect(block.locator('[data-demo-source]')).toBeHidden();
                await action('重置', 'Reset').click();
                await expect(preview.locator('.semi-overflow-list')).toHaveCount(lists);
                await action('在线编辑', 'Edit online').click();
                const editor = block.frameLocator('iframe').locator('#app');
                await expect(editor.locator('.semi-overflow-list')).toHaveCount(lists, {
                  timeout: 30_000,
                });
                await expect(block.locator('.msg.err')).toHaveCount(0);
                await action('退出编辑', 'Close editor').click();
                await expect(block.locator('iframe')).toHaveCount(0);
                await expect(preview.locator('.semi-overflow-list')).toHaveCount(lists);
              });
            }
            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'show/overflowlist',
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
