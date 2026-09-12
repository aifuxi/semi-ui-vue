import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { freezeAnimations } from './demo-parity';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

test.use({ actionTimeout: 10_000 });

// `cards` counts the `.semi-card` roots each documented example renders; `interaction` names the
// documented control that example drives.
const examples: Array<{
  name: string;
  cards: number;
  interaction?: 'loading' | 'tabs' | 'spacing' | 'shadows';
}> = [
  { name: 'Basic', cards: 1 },
  { name: 'Simple', cards: 2 },
  { name: 'Cover', cards: 1 },
  { name: 'Border', cards: 1 },
  { name: 'Shadows', cards: 2, interaction: 'shadows' },
  { name: 'Flexible', cards: 1 },
  { name: 'Inner', cards: 3 },
  { name: 'Grid', cards: 5 },
  { name: 'Loading', cards: 1, interaction: 'loading' },
  { name: 'Skeleton', cards: 1, interaction: 'loading' },
  { name: 'Tabs', cards: 1, interaction: 'tabs' },
  { name: 'Actions', cards: 1 },
  { name: 'Group', cards: 8, interaction: 'spacing' },
  { name: 'GridGroup', cards: 7 },
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
      'flex-basis',
      'flex-grow',
      'flex-shrink',
      'grid-template-columns',
      'grid-template-rows',
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
    // Generated ids (React getUuidShort, Vue useId) differ per instance. Resolve each id and every
    // id reference to the position of its definition inside this root, so a missing, duplicated or
    // reordered definition still fails while identical trees compare exactly.
    const idIndex = new Map<string, string>();
    for (const node of element.querySelectorAll('[id], [data-popupid]'))
      for (const value of [node.getAttribute('id'), node.getAttribute('data-popupid')])
        if (value && !idIndex.has(value)) idIndex.set(value, `id-${idIndex.size}`);
    // Tabs stamps its bar with a random `data-uuid`; it carries no cross references, so the same
    // definition-order normalization keeps count and order accountable without comparing entropy.
    const uuidIndex = new Map<string, string>();
    for (const node of element.querySelectorAll('[data-uuid]')) {
      const value = node.getAttribute('data-uuid');
      if (value && !uuidIndex.has(value)) uuidIndex.set(value, `uuid-${uuidIndex.size}`);
    }
    const idReferences = [
      'for',
      'aria-labelledby',
      'aria-describedby',
      'aria-controls',
      'aria-owns',
      'aria-activedescendant',
    ];
    const resolveId = (name: string, value: string) => {
      if (name === 'id' || name === 'data-popupid') return idIndex.get(value) ?? value;
      if (!idReferences.includes(name)) return value;
      return value
        .split(/\s+/)
        .map((token) => idIndex.get(token) ?? token)
        .join(' ');
    };
    const localPath = (value: string | null) =>
      value?.replace(/^https?:\/\/127\.0\.0\.1:4321/, '') ?? null;
    // Every component node carries a `semi-` class; native controls, image assets and icon paths
    // are matched separately because their attributes are part of the contract.
    return [...element.querySelectorAll('[class*="semi-"], input, img, svg path, br')].map(
      (node) => {
        const rect = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return {
          tag: node.tagName,
          classes: [...node.classList].sort(),
          attributes: Object.fromEntries(
            [...node.attributes]
              // Vue reflects template `:checked` bindings to the attribute as well as the property
              // (@vue/runtime-dom patchProp), while React sets the property only. The compared
              // `checked` field below carries that contract, so the reflected attribute is dropped.
              .filter((attribute) => !['style', 'class', 'checked'].includes(attribute.name))
              // `aria-disabled`/`aria-invalid`/`aria-required` default to false, so an explicit
              // "false" and an omitted attribute state the same thing (ARIA 1.2 defaults). The
              // embedded Rating still renders the explicit form; its own batch owns that choice.
              .filter(
                (attribute) =>
                  !(
                    ['aria-disabled', 'aria-invalid', 'aria-required'].includes(attribute.name) &&
                    attribute.value === 'false'
                  ),
              )
              .map((attribute) => [
                attribute.name,
                attribute.name === 'data-uuid'
                  ? (uuidIndex.get(attribute.value) ?? attribute.value)
                  : attribute.name === 'src' || attribute.name === 'srcset'
                    ? (localPath(attribute.value) ?? attribute.value)
                    : resolveId(attribute.name, attribute.value),
              ])
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
          checked: (node as HTMLInputElement).checked ?? null,
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

/** Wait for CSS transitions (e.g. the hover shadow) instead of guessing a delay. */
const animationsSettled = (page: Page) =>
  page.waitForFunction(
    () => document.getAnimations().every((animation) => animation.playState !== 'running'),
    undefined,
    { timeout: 5_000 },
  );

/** Horizontal gap between the first two cards, used to prove the spacing control moved. */
async function firstCardGap(root: Locator) {
  const [first, second] = await Promise.all([
    root.locator('.semi-card').nth(0).boundingBox(),
    root.locator('.semi-card').nth(1).boundingBox(),
  ]);
  return Math.round((second!.x - (first!.x + first!.width)) * 10) / 10;
}

for (const locale of ['zh-cn', 'en-us'])
  for (const theme of ['light', 'dark'])
    for (const [index, example] of examples.entries())
      for (const direction of ['ltr', 'rtl'])
        test(`Card 文档 ${example.name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
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
              `http://127.0.0.1:4173/docs.html?component=card&locale=${locale}&theme=${theme}&example=${index + 1}`,
            );
            const expected = reference.locator('#root');
            // Establish the reference independently before loading the Vue page.
            await expect(expected.locator('.semi-card')).toHaveCount(example.cards);
            await vue.goto(`/${locale}/components/card/`);
            const demo = vue.locator(`[data-demo-id="card/${locale}/${example.name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual.locator('.semi-card')).toHaveCount(example.cards);
            await expect(actual).toBeVisible();
            const source = await readFile(
              new URL(`../../src/demos/card/${locale}/${example.name}.vue`, import.meta.url),
              'utf8',
            );
            expect(await demo.locator('[data-demo-source] code').textContent()).toBe(source);
            await align(reference, expected, vue, actual, direction);
            const compare = async (
              state: string,
              options: { park?: boolean; freeze?: boolean } = {},
            ) => {
              await waitForVisualAssets([expected, actual]);
              if (options.park !== false)
                await Promise.all([reference, vue].map((page) => page.mouse.move(1400, 880)));
              if (options.freeze !== false) await freezeAnimations([reference, vue], 300);
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
              // Each card is a separate crop: spacing between cards cannot dilute a defect.
              for (let item = 0; item < example.cards; item++) {
                const crops = await Promise.all(
                  [expected, actual].map((root) =>
                    root.locator('.semi-card').nth(item).screenshot(),
                  ),
                );
                for (const [i, label] of ['reference', 'vue'].entries())
                  await info.attach(`${state}-card-${item}-${label}`, {
                    body: crops[i]!,
                    contentType: 'image/png',
                  });
                await expectScreenshotPixelsToMatch(
                  vue,
                  crops[1]!,
                  crops[0]!,
                  `${state}-card-${item}`,
                );
              }
            };
            await test.step('默认结构、样式、几何与逐卡截图', () => compare('default'));

            if (example.interaction === 'loading')
              await test.step('切换 Switch 关闭 loading 占位', async () => {
                for (const root of [expected, actual]) {
                  await expect(root.locator('.semi-card .semi-skeleton').first()).toBeVisible();
                  await root.locator('.semi-switch').click();
                  await expect(root.locator('input.semi-switch-native-control')).toBeChecked();
                  await expect(root.locator('.semi-card .semi-skeleton')).toHaveCount(0);
                }
                if (example.name === 'Skeleton')
                  for (const root of [expected, actual])
                    await expect(root.locator('.semi-card .semi-avatar')).toHaveCount(1);
                await compare('loading-off');
              });

            if (example.interaction === 'tabs')
              await test.step('切换到第二个页签', async () => {
                for (const root of [expected, actual]) {
                  await expect(root.locator('.semi-tabs-pane-active')).toContainText('content1');
                  await root.getByRole('tab', { name: 'Tab 2', exact: true }).click();
                  await expect(root.locator('.semi-tabs-pane-active')).toContainText('content2');
                  // The entering pane carries a start class until its motion finishes; compare the
                  // settled end state instead of sampling a mid-animation frame.
                  await expect(
                    root.locator('.semi-tabs-pane-active .semi-tabs-pane-motion-overlay'),
                  ).not.toHaveClass(/semi-tabs-pane-animate-/);
                }
                await compare('tab-2');
              });

            if (example.interaction === 'spacing')
              await test.step('键盘调节 CardGroup 间距', async () => {
                const before = await Promise.all([firstCardGap(expected), firstCardGap(actual)]);
                for (const root of [expected, actual]) {
                  await root.locator('.semi-slider-handle').focus();
                  await root.page().keyboard.press('ArrowRight');
                  await expect(root.locator('.semi-slider-handle')).toHaveAttribute(
                    'aria-valuenow',
                    '13',
                  );
                }
                // A focused handle shows its value in a portal tooltip whose sub-pixel offset is
                // page-specific; blur it so the comparison covers the settled slider state.
                for (const page of [reference, vue])
                  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
                const after = await Promise.all([firstCardGap(expected), firstCardGap(actual)]);
                for (const [i, gap] of after.entries())
                  // RTL lays the row out right-to-left, so compare the gap magnitude.
                  expect(
                    Math.abs(gap) - Math.abs(before[i]!),
                    `间距在调节后应增大（${i}）`,
                  ).toBeGreaterThan(0.5);
                await compare('spacing-13');
              });

            if (example.interaction === 'shadows')
              await test.step('hover 阴影终态', async () => {
                for (const root of [expected, actual])
                  await root.locator('.semi-card').first().hover();
                await Promise.all([animationsSettled(reference), animationsSettled(vue)]);
                await compare('shadow-hover', { park: false, freeze: false });
              });

            if (theme === 'light' && direction === 'ltr') {
              await test.step('源码、重置与在线编辑生命周期', async () => {
                const block = vue.locator(`[data-demo-id="card/${locale}/${example.name}"]`);
                const preview = block.locator('[data-demo-preview]');
                const action = (zh: string, en: string) =>
                  block.getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
                const assertInitial = async (root: Locator) => {
                  await expect(root.locator('.semi-card')).toHaveCount(example.cards);
                  if (example.interaction === 'loading') {
                    await expect(
                      root.locator('input.semi-switch-native-control'),
                    ).not.toBeChecked();
                    await expect(root.locator('.semi-card .semi-skeleton').first()).toBeVisible();
                  }
                  if (example.interaction === 'tabs')
                    await expect(root.locator('.semi-tabs-pane-active')).toContainText('content1');
                  if (example.interaction === 'spacing')
                    await expect(root.locator('.semi-slider-handle')).toHaveAttribute(
                      'aria-valuenow',
                      '12',
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
                await expect(editor.locator('.semi-card')).toHaveCount(example.cards, {
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
                upstream: 'show/card',
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
