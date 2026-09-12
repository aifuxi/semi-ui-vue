import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { freezeAnimations } from './demo-parity';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

test.use({ actionTimeout: 10_000 });

const examples = [
  { name: 'Basic', block: 1 },
  { name: 'Nested', block: 2 },
  { name: 'Position', block: 3 },
  { name: 'Trigger', block: 4 },
  { name: 'Events', block: 5 },
  { name: 'Menu', block: 6 },
];
const demoDirectory = { 'zh-cn': 'zh-cn', 'en-us': 'en-us' } as const;
// Pinned English omits the contextMenu trigger example; do not infer scope from rendered DOM.
const triggerKindsByLocale = {
  'zh-cn': ['hover', 'focus', 'click', 'contextMenu'],
  'en-us': ['hover', 'focus', 'click'],
} as const;
const menuItemCounts: Record<string, number> = {
  Basic: 6,
  Nested: 3,
  Position: 3,
  Trigger: 3,
  Events: 4,
  Menu: 5,
};

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
        test(`Dropdown 文档 ${example.name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
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
              `http://127.0.0.1:4173/docs.html?component=dropdown&locale=${locale}&theme=${theme}&example=${example.block}`,
            );
            const expected = reference.locator('#root');
            // Establish the reference independently before loading the Vue page.
            await expect(expected.locator('[data-popupid]')).not.toHaveCount(0);
            const initialTriggerCount = await expected.locator('[data-popupid]').count();
            await vue.goto(`/${locale}/components/dropdown/`);
            const demo = vue.locator(
              `[data-demo-id="dropdown/${demoDirectory[locale]}/${example.name}"]`,
            );
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual.locator('[data-popupid]')).toHaveCount(
              await expected.locator('[data-popupid]').count(),
            );
            await expect(actual).toBeVisible();
            const source = await readFile(
              new URL(
                `../../src/demos/dropdown/${demoDirectory[locale]}/${example.name}.vue`,
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
              if (popupTriggers) {
                // Sampling beyond the entry duration does not flush animationend or the
                // renderer's class update. Observe the real completed entry phase first.
                for (const popup of [expectedTarget, actualTarget]) {
                  await expect(popup).not.toHaveClass(/semi-tooltip-animation-show/);
                  await expect(popup).toBeVisible();
                }
              }
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
                  const popupId = await popup.getAttribute('id');
                  expect(popupId, `${state} popup has a real id`).toBeTruthy();
                  await expect(trigger).toHaveAttribute('data-popupid', popupId!);
                  const references = await trigger.evaluate((element, targetId) => {
                    const target = document.getElementById(targetId!);
                    return ['aria-controls', 'aria-describedby', 'aria-owns'].flatMap((name) =>
                      (element.getAttribute(name)?.split(/\s+/).filter(Boolean) ?? []).map((id) => {
                        const referred = document.getElementById(id);
                        return {
                          name,
                          matchesPopup: Boolean(
                            referred &&
                            target &&
                            (referred === target || target.contains(referred)),
                          ),
                        };
                      }),
                    );
                  }, popupId);
                  for (const reference of references)
                    expect(
                      reference.matchesPopup,
                      `${state} ${reference.name} targets the actual popup`,
                    ).toBe(true);
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

            await test.step('打开、浮层几何、交互与关闭重开', async () => {
              const roots = [expected, actual];
              const pages = [reference, vue];
              const triggerKinds = triggerKindsByLocale[locale];
              const count =
                example.name === 'Position'
                  ? 3
                  : example.name === 'Trigger'
                    ? triggerKinds.length
                    : 1;
              for (const root of roots)
                await expect(root.locator('[data-popupid]')).toHaveCount(count);
              for (let index = 0; index < count; index++) {
                const triggers = roots.map((root) => root.locator('[data-popupid]').nth(index)) as [
                  Locator,
                  Locator,
                ];
                const popups = pages.map((page) =>
                  page.locator('.semi-dropdown-wrapper').filter({ visible: true }).first(),
                );
                const kind =
                  example.name === 'Trigger'
                    ? triggerKinds[index]!
                    : ['Events', 'Menu'].includes(example.name)
                      ? 'click'
                      : 'hover';
                for (let turn = 0; turn < 2; turn++) {
                  for (const [i, trigger] of triggers.entries()) {
                    if (kind === 'focus') {
                      await trigger.focus();
                      await expect(trigger).toBeFocused();
                    } else if (kind === 'click') await trigger.click();
                    else if (kind === 'contextMenu') await trigger.click({ button: 'right' });
                    else await trigger.hover();
                    await expect(popups[i]!).toBeVisible();
                    await expect(popups[i]!.locator('[role="menuitem"]')).toHaveCount(
                      menuItemCounts[example.name]!,
                    );
                  }
                  await compare(`popup-${index}-${turn}`, popups[0]!, popups[1]!, true, triggers);
                  if (example.name === 'Nested') {
                    for (let nested = 0; nested < 2; nested++) {
                      const anchors = popups.map((p) =>
                        p.locator('[role="menuitem"]').nth(nested),
                      ) as [Locator, Locator];
                      const submenus = pages.map((page) =>
                        page.locator('.semi-dropdown-wrapper').filter({ visible: true }).last(),
                      );
                      for (const [i, anchor] of anchors.entries()) {
                        await anchor.hover();
                        await expect(
                          pages[i]!.locator('.semi-dropdown-wrapper').filter({ visible: true }),
                        ).toHaveCount(2);
                        await expect(submenus[i]!.locator('[role="menuitem"]')).toHaveCount(3);
                        await expect(
                          submenus[i]!.getByText(
                            locale === 'zh-cn' ? 'Nested Menu Item 1' : 'Menu Item 1',
                            { exact: true },
                          ),
                        ).toBeVisible();
                      }
                      await compare(
                        `nested-${nested}-${turn}`,
                        submenus[0]!,
                        submenus[1]!,
                        true,
                        anchors,
                      );
                      for (const popup of popups)
                        await popup.locator('[role="menuitem"]').nth(2).hover();
                      for (const page of pages)
                        await expect(page.locator('.semi-dropdown-wrapper')).toHaveCount(1);
                    }
                  }
                  if (example.name === 'Basic') {
                    for (const [i, trigger] of triggers.entries()) {
                      await trigger.focus();
                      await trigger.press('ArrowDown');
                      const items = popups[i]!.locator('[role="menuitem"]');
                      await expect(items.nth(2)).toHaveAttribute('aria-disabled', 'true');
                      await expect(items.nth(0)).toBeFocused();
                      await items.nth(0).press('ArrowDown');
                      await expect(items.nth(1)).toBeFocused();
                      await items.nth(1).press('ArrowDown');
                      await expect(items.nth(3)).toBeFocused();
                    }
                    await compare(`keyboard-${turn}`, popups[0]!, popups[1]!, true, triggers);
                  }
                  for (const [i, page] of pages.entries()) {
                    await page.mouse.move(1400, 880);
                    if (
                      ['click', 'contextMenu', 'focus'].includes(kind) ||
                      example.name === 'Basic'
                    ) {
                      await triggers[i]!.press('Escape');
                      await expect(triggers[i]!).toBeFocused();
                      await triggers[i]!.evaluate((element) => (element as HTMLElement).blur());
                    }
                    // keepDOM is false: detachment proves the exit lifecycle has finished.
                    await expect(page.locator('.semi-dropdown-wrapper')).toHaveCount(0);
                  }
                }
              }
            });
            if (example.name === 'Menu') {
              await test.step('JSON 菜单 primary1 触发公开回调', async () => {
                for (const [i, page] of [reference, vue].entries()) {
                  const root = [expected, actual][i]!;
                  await root.locator('[data-popupid]').first().click();
                  // showTick contributes an image named "tick" to the item's accessible name.
                  // Locate the exact visible menu text while retaining its menuitem role.
                  const item = page
                    .locator('.semi-dropdown-wrapper')
                    .getByRole('menuitem')
                    .filter({ hasText: /^primary1$/ });
                  await expect(item).toBeVisible();
                  const [message] = await Promise.all([
                    page.waitForEvent('console', {
                      predicate: (event) =>
                        event.type() === 'log' && event.text() === 'click primary',
                      timeout: 10_000,
                    }),
                    item.click(),
                  ]);
                  expect(message.text()).toBe('click primary');
                  await root.locator('[data-popupid]').first().press('Escape');
                  await page.mouse.move(1400, 880);
                  await expect(page.locator('.semi-dropdown-wrapper')).toHaveCount(0);
                }
              });
            }
            if (example.name === 'Events') {
              await test.step('四种菜单事件产生固定 Toast 文案', async () => {
                for (const [i, page] of [reference, vue].entries()) {
                  const root = [expected, actual][i]!;
                  const trigger = root.locator('[data-popupid]').first();
                  await trigger.click();
                  const items = page.locator('.semi-dropdown-wrapper [role="menuitem"]');
                  await items.nth(1).hover();
                  await expect(page.getByText('Nice to meet you!', { exact: true })).toBeVisible();
                  await items.nth(2).hover();
                  await items.nth(3).hover();
                  await expect(page.getByText('See ya!', { exact: true })).toBeVisible();
                  await items.nth(3).click({ button: 'right' });
                  await expect(page.getByText('Right clicked!', { exact: true })).toBeVisible();
                  await items.nth(0).click();
                  await expect(page.getByText('You clicked me!', { exact: true })).toBeVisible();
                  await page.mouse.move(1400, 880);
                  await expect(page.locator('.semi-toast')).toHaveCount(0);
                }
              });
            }
            if (theme === 'light' && direction === 'ltr') {
              await test.step('源码、重置与在线编辑生命周期', async () => {
                const block = vue.locator(
                  `[data-demo-id="dropdown/${demoDirectory[locale]}/${example.name}"]`,
                );
                const preview = block.locator('[data-demo-preview]');
                const action = (zh: string, en: string) =>
                  block.getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
                const lists = initialTriggerCount;
                await action('查看源码', 'View source').click();
                await expect(block.locator('[data-demo-source]')).toBeVisible();
                expect(await block.locator('[data-demo-source] code').textContent()).toBe(source);
                await action('查看源码', 'View source').click();
                await expect(block.locator('[data-demo-source]')).toBeHidden();
                await action('重置', 'Reset').click();
                await expect(preview.locator('[data-popupid]')).toHaveCount(lists);
                await action('在线编辑', 'Edit online').click();
                const editor = block.frameLocator('iframe').locator('#app');
                await expect(editor.locator('[data-popupid]')).toHaveCount(lists, {
                  timeout: 30_000,
                });
                await expect(block.locator('.msg.err')).toHaveCount(0);
                await action('退出编辑', 'Close editor').click();
                await expect(block.locator('iframe')).toHaveCount(0);
                await expect(preview.locator('[data-popupid]')).toHaveCount(lists);
              });
            }
            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'show/dropdown',
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
