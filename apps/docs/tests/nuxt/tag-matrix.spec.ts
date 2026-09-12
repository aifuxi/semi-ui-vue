import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { freezeAnimations } from './demo-parity';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

test.use({ actionTimeout: 10_000 });

const examples = [
  { name: 'Basic', block: 1 },
  { name: 'Size', block: 2 },
  { name: 'Shape', block: 3 },
  { name: 'Icons', block: 4 },
  { name: 'Color', block: 5 },
  { name: 'Colorful', block: 6 },
  { name: 'Type', block: 7 },
  { name: 'Avatar', block: 8 },
  { name: 'Visible', block: 9 },
  { name: 'Group', block: 10 },
  { name: 'GroupClose', block: 11 },
  { name: 'SplitGroup', block: 12 },
];
const demoDirectory = { 'zh-cn': 'zh-cn', 'en-us': 'en-us' } as const;

async function measure(root: Locator, includeRoot = false) {
  return root.evaluate((element, includeRoot) => {
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
    for (const node of [...(includeRoot ? [element] : []), ...element.querySelectorAll('[id]')]) {
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
    // Popover ids live outside this root, so they are not part of `idIndex`; assign stable
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
      if (name === 'src') return new URL(value, location.href).pathname;
      return mapUrl(value);
    };
    // Component nodes carry a `semi-` class; controls, list structure, icons and paragraphs are
    // matched separately because their attributes, text and geometry are part of the contract.
    return [
      ...(includeRoot ? [element] : []),
      ...element.querySelectorAll('[class*="semi-"], input, button, svg path, br, p, span, img'),
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
                ),
            )
            // Sort first so external-id tokens are assigned in the same order on both sides.
            .sort((left, right) => (left.name < right.name ? -1 : 1))
            .map((attribute) => [
              attribute.name,
              // The pinned arrow path has one doubled separator before 6; SVG whitespace is
              // insignificant between these same commands/numbers. Keep this limited to its paths.
              resolveId(
                attribute.name,
                attribute.name === 'd' && node.matches('svg.semi-popover-icon-arrow > path')
                  ? attribute.value.replace(/\s+/g, ' ')
                  : attribute.value,
              ),
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
  }, includeRoot);
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

for (const locale of ['zh-cn', 'en-us'] as const)
  for (const theme of ['light', 'dark'] as const)
    for (const example of examples)
      for (const direction of ['ltr', 'rtl'] as const)
        test(`Tag 文档 ${example.name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
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
            const referenceLocale = locale === 'en-us' && example.block === 4 ? 'zh-cn' : locale;
            const referenceBlock =
              locale === 'en-us' && example.block > 4 ? example.block - 1 : example.block;
            await reference.goto(
              `http://127.0.0.1:4173/docs.html?component=tag&locale=${referenceLocale}&theme=${theme}&example=${referenceBlock}`,
            );
            const expected = reference.locator('#root');
            // Establish the reference independently before loading the Vue page.
            await expect(expected.locator('.semi-tag')).not.toHaveCount(0);
            const initialTagCount = await expected.locator('.semi-tag').count();
            await vue.goto(`/${locale}/components/tag/`);
            const demo = vue.locator(
              `[data-demo-id="tag/${demoDirectory[locale]}/${example.name}"]`,
            );
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual.locator('.semi-tag')).toHaveCount(
              await expected.locator('.semi-tag').count(),
            );
            await expect(actual).toBeVisible();
            const source = await readFile(
              new URL(
                `../../src/demos/tag/${demoDirectory[locale]}/${example.name}.vue`,
                import.meta.url,
              ),
              'utf8',
            );
            expect(await demo.locator('[data-demo-source] code').textContent()).toBe(source);
            await align(reference, expected, vue, actual, direction);
            const compare = async (
              state: string,
              expectedTarget = expected,
              actualTarget = actual,
              preservePointer = false,
              popupTriggers?: [Locator, Locator],
            ) => {
              await waitForVisualAssets([expectedTarget, actualTarget]);
              if (!preservePointer)
                await Promise.all([reference, vue].map((page) => page.mouse.move(1400, 880)));
              await freezeAnimations([reference, vue], 300);
              const [referenceNodes, vueNodes] = await Promise.all([
                measure(expectedTarget, Boolean(popupTriggers)),
                measure(actualTarget, Boolean(popupTriggers)),
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
              if (popupTriggers) {
                const geometry = [];
                for (const [pageRoot, trigger, popup] of [
                  [expected, popupTriggers[0], expectedTarget],
                  [actual, popupTriggers[1], actualTarget],
                ] as const) {
                  const [origin, anchor, box] = await Promise.all([
                    pageRoot.boundingBox(),
                    trigger.boundingBox(),
                    popup.boundingBox(),
                  ]);
                  if (!origin || !anchor || !box)
                    throw new Error('Missing popup, trigger or preview geometry');
                  geometry.push({
                    // Verify the paired triggers still occupy the same place in their aligned
                    // previews after hover scrolling, without assuming equal document coordinates.
                    trigger: {
                      x: anchor.x - origin.x,
                      y: anchor.y - origin.y,
                      width: anchor.width,
                      height: anchor.height,
                    },
                    popup: {
                      x: box.x - anchor.x,
                      y: box.y - anchor.y,
                      width: box.width,
                      height: box.height,
                    },
                  });
                }
                await info.attach(`${state}-anchored-geometry`, {
                  body: JSON.stringify({ expected: geometry[0], actual: geometry[1] }),
                  contentType: 'application/json',
                });
                for (const target of ['trigger', 'popup'] as const)
                  for (const axis of ['x', 'y', 'width', 'height'] as const)
                    expect(
                      Math.abs(geometry[1]![target][axis] - geometry[0]![target][axis]),
                      `${state} ${target} relative ${axis}`,
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

            if (example.name === 'Basic' || example.name === 'Avatar') {
              await test.step('关闭按钮、阻止关闭与键盘焦点', async () => {
                for (const root of [expected, actual]) {
                  const closable = root.locator('.semi-tag-closable');
                  const target = closable.first();
                  await target.focus();
                  await expect(target).toBeFocused();
                  await target.press('Escape');
                  await expect(target).not.toBeFocused();
                  await target.focus();
                  await target.press('Delete');
                  await expect(target).toHaveClass(/semi-tag-invisible/);
                  if (example.name === 'Basic') {
                    const prevented = closable.last();
                    await prevented.locator('.semi-tag-close').click();
                    await expect(prevented).not.toHaveClass(/semi-tag-invisible/);
                    await prevented.focus();
                    await prevented.press('Backspace');
                    await expect(prevented).not.toHaveClass(/semi-tag-invisible/);
                  } else {
                    await closable.last().locator('.semi-tag-close').click();
                    await expect(closable.last()).toHaveClass(/semi-tag-invisible/);
                  }
                }
                await compare('closed');
              });
            }
            if (example.name === 'Visible') {
              await test.step('受控显示、隐藏与再次显示', async () => {
                for (const label of ['Show', 'Hide', 'Show']) {
                  for (const root of [expected, actual]) {
                    await root.getByText(label, { exact: true }).click();
                    if (label === 'Hide')
                      await expect(root.locator('.semi-tag')).toHaveClass(/semi-tag-invisible/);
                    else
                      await expect(root.locator('.semi-tag')).not.toHaveClass(/semi-tag-invisible/);
                  }
                  await compare(`visibility-${label}`);
                }
              });
            }
            if (example.name === 'Group' || (example.name === 'GroupClose' && locale === 'zh-cn')) {
              await test.step('悬停折叠计数、浮层内容及关闭重开', async () => {
                const popups = [reference, vue].map((page) =>
                  page.locator('.semi-tag-rest-group-popover').filter({ visible: true }),
                );
                const triggers: [Locator, Locator] = [expected, actual].map((root) =>
                  root
                    .locator('.semi-tag')
                    .filter({ hasText: /^\+\d+$/ })
                    .last(),
                ) as [Locator, Locator];
                for (let turn = 0; turn < 2; turn++) {
                  for (const [i, trigger] of triggers.entries()) {
                    await trigger.hover();
                    await expect(popups[i]!).toBeVisible();
                    await expect(popups[i]!.locator('.semi-tag')).not.toHaveCount(0);
                  }
                  await compare(`popover-${turn}`, popups[0]!, popups[1]!, true, triggers);
                  for (const page of [reference, vue]) await page.mouse.move(1400, 880);
                  for (const popup of popups) await expect(popup).toBeHidden();
                }
              });
            }
            if (example.name === 'GroupClose') {
              await test.step('父层按唯一标识删除并更新折叠计数', async () => {
                for (let turn = 0; turn < 2; turn++) {
                  for (const root of [expected, actual]) {
                    const target = root.locator('.semi-tag-closable').first();
                    const label = await target.textContent();
                    await target.locator('.semi-tag-close').click();
                    await expect(
                      root.locator('.semi-tag-closable').filter({ hasText: label! }),
                    ).toHaveCount(0);
                  }
                  await compare(`group-close-${turn}`);
                }
              });
            }

            if (theme === 'light' && direction === 'ltr') {
              await test.step('源码、重置与在线编辑生命周期', async () => {
                const block = vue.locator(
                  `[data-demo-id="tag/${demoDirectory[locale]}/${example.name}"]`,
                );
                const preview = block.locator('[data-demo-preview]');
                const action = (zh: string, en: string) =>
                  block.getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
                const lists = initialTagCount;
                await action('查看源码', 'View source').click();
                await expect(block.locator('[data-demo-source]')).toBeVisible();
                expect(await block.locator('[data-demo-source] code').textContent()).toBe(source);
                await action('查看源码', 'View source').click();
                await expect(block.locator('[data-demo-source]')).toBeHidden();
                await action('重置', 'Reset').click();
                await expect(preview.locator('.semi-tag')).toHaveCount(lists);
                await action('在线编辑', 'Edit online').click();
                const editor = block.frameLocator('iframe').locator('#app');
                await expect(editor.locator('.semi-tag')).toHaveCount(lists, {
                  timeout: 30_000,
                });
                await expect(block.locator('.msg.err')).toHaveCount(0);
                await action('退出编辑', 'Close editor').click();
                await expect(block.locator('iframe')).toHaveCount(0);
                await expect(preview.locator('.semi-tag')).toHaveCount(lists);
              });
            }
            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'show/tag',
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
