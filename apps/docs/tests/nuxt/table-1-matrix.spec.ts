import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';
test.use({ actionTimeout: 10_000 });
async function measure(root: Locator, owner: Locator) {
  const hostHandle = await owner.elementHandle();
  return root.evaluate((element, host) => {
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
    // A closed lazy Portal has no definition yet. Its trigger still owns its ID;
    // canonicalize by trigger order across the same demo root (also for Portal captures).
    // Reusing one ID on two triggers deliberately retains the first mapping and fails.
    const triggerRoot = host ?? element;
    const triggers = [
      ...(triggerRoot.hasAttribute('data-popupid') ? [triggerRoot] : []),
      ...triggerRoot.querySelectorAll('[data-popupid]'),
    ];
    triggers.forEach((node, index) => {
      const value = node.getAttribute('data-popupid');
      if (value && !idIndex.has(value)) idIndex.set(value, `popup-${index}`);
    });
    let definitionIndex = 0;
    for (const node of [
      ...(element === host ? [] : [element]),
      ...element.querySelectorAll('[id]'),
    ]) {
      const value = node.getAttribute('id');
      if (value && !idIndex.has(value)) idIndex.set(value, `id-${definitionIndex++}`);
    }
    const idReferences = [
      'for',
      'data-popupid',
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
      return mapUrl(value).replace(/^https?:\/\/127\.0\.0\.1:4321(?=\/demos\/table\/)/, '');
    };
    // Component nodes carry a `semi-` class; controls, list structure, icons and paragraphs are
    // matched separately because their attributes, text and geometry are part of the contract.
    return [
      ...(element.id === 'root' || element.hasAttribute('data-demo-preview') ? [] : [element]),
      ...element.querySelectorAll('*'),
    ].map((node) => {
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return {
        tag: node.tagName,
        // With no ConfigProvider the fixed React Table emits this literal missing-direction
        // class. Match only that artifact; computed direction and all other classes stay exact.
        classes: [...node.classList]
          .map((name) =>
            name === 'semi-table-wrapper-undefined' && document.body.dir !== 'rtl'
              ? 'semi-table-wrapper-ltr'
              : name,
          )
          .sort(),
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
                !attribute.name.startsWith('data-v-'),
            )
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
  }, hostHandle);
}

/** Measure actual final animation state, without pausing enter transitions mid-flight. */
async function settle(pages: Page[]) {
  await Promise.all(
    pages.map((page) =>
      page.evaluate(async () => {
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        );
        await Promise.all(
          document
            .getAnimations()
            .filter((animation) => {
              const timing = animation.effect?.getComputedTiming();
              return timing && Number.isFinite(timing.endTime);
            })
            .map((animation) => animation.finished.catch(() => undefined)),
        );
      }),
    ),
  );
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
  const scroll = await vuePage.evaluate(() => ({
    y: scrollY,
    height: document.documentElement.scrollHeight,
  }));
  await expected.evaluate(
    (element, { rect, scroll }) => {
      Object.assign((element as HTMLElement).style, {
        boxSizing: 'border-box',
        padding: '24px',
        width: `${rect!.width}px`,
        position: 'absolute',
        left: `${rect!.x}px`,
        top: `${rect!.y + scroll.y}px`,
      });
      document.body.style.minHeight = `${scroll.height}px`;
      window.scrollTo(0, scroll.y);
    },
    { rect: box, scroll },
  );
  await Promise.all([referencePage, vuePage].map((page) => page.mouse.move(1400, 880)));
}

// Counts and locale differences were read from all 30 pinned snippets before diagnosis.
const examples = [
  'Basic',
  'DeclarativeColumns',
  'Selection',
  'CustomRendering',
  'Pagination',
  'RemoteData',
  'Fixed',
  'SortFilter',
  'UndefinedSort',
  'HeaderFilter',
  'CustomFilter',
  'FilterConfirm',
  'FilterItem',
  'Expanded',
  'SeparateExpand',
] as const;
const initialRows = [3, 3, 3, 4, 10, 5, 10, 10, 6, 10, 10, 10, 10, 3, 3];
const rows = (root: Locator) =>
  root.locator('.semi-table-tbody > .semi-table-row:not(.semi-table-row-expand)');
for (const locale of ['zh-cn', 'en-us'])
  for (const theme of ['light', 'dark'])
    for (const [offset, name] of examples.entries())
      for (const direction of ['ltr', 'rtl'])
        test(`Table 文档 ${name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
          browser,
        }, info) => {
          test.setTimeout(150_000);
          const index = offset + 1;
          const context = await visualContext(browser, info, locale, theme, direction);
          try {
            const reference = await context.newPage(),
              vue = await context.newPage();
            const pages = [reference, vue];
            const errors: string[] = [];
            for (const page of pages) {
              page.on('pageerror', (error) => errors.push(error.message));
              page.on('console', (message) => {
                if (message.type() === 'error') errors.push(message.text());
              });
              // Freeze rendered current dates, while native Date.now keeps Vue event timestamps advancing.
              await page.addInitScript((timestamp) => {
                const NativeDate = Date;
                window.Date = new Proxy(NativeDate, {
                  construct(target, args, newTarget) {
                    return Reflect.construct(target, args.length ? args : [timestamp], newTarget);
                  },
                  apply() {
                    return new NativeDate(timestamp).toString();
                  },
                });
              }, new Date('2024-08-15T10:24:30+08:00').getTime());
              await page.addInitScript((dir) => {
                const apply = () => {
                  if (!document.body) return false;
                  document.body.dir = dir;
                  document.body.classList.toggle('semi-rtl', dir === 'rtl');
                  return true;
                };
                if (!apply()) {
                  const observer = new MutationObserver(() => {
                    if (apply()) observer.disconnect();
                  });
                  observer.observe(document, { childList: true, subtree: true });
                }
              }, direction);
            }
            await vue.addInitScript((value) => {
              if (window === window.top) localStorage.setItem('semi-docs-theme', value);
            }, theme);
            await vue.goto(
              `/${locale}/components/table/${direction === 'rtl' ? '?direction=rtl' : ''}`,
            );
            const demo = vue.locator(`[data-demo-id="table/${locale}/${name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual.locator('.semi-table-wrapper')).toHaveCount(1);
            await expect(rows(actual)).toHaveCount(initialRows[offset]!);
            await waitForVisualAssets([actual]);
            await actual.scrollIntoViewIfNeeded();
            const initialBox = await actual.boundingBox();
            if (!initialBox) throw new Error('Vue preview has no layout box');
            const initialScroll = await vue.evaluate(() => ({
              y: scrollY,
              height: document.documentElement.scrollHeight,
            }));
            await reference.addInitScript(
              ({ rect, scroll, dir }) => {
                const apply = () => {
                  const root = document.getElementById('root');
                  if (!root || !document.body) return false;
                  root.dir = dir;
                  root.classList.toggle('semi-rtl', dir === 'rtl');
                  Object.assign(root.style, {
                    boxSizing: 'border-box',
                    padding: '24px',
                    width: `${rect.width}px`,
                    position: 'absolute',
                    left: `${rect.x}px`,
                    top: `${rect.y + scroll.y}px`,
                  });
                  document.body.style.minHeight = `${scroll.height}px`;
                  window.scrollTo(0, scroll.y);
                  return true;
                };
                if (!apply()) {
                  const observer = new MutationObserver(() => {
                    if (apply()) observer.disconnect();
                  });
                  observer.observe(document, { childList: true, subtree: true });
                }
              },
              { rect: initialBox, scroll: initialScroll, dir: direction },
            );
            await reference.goto(
              `http://127.0.0.1:4173/docs.html?component=table-1&locale=${locale}&theme=${theme}&example=${index}${direction === 'rtl' ? '&direction=rtl' : ''}`,
            );
            const expected = reference.locator('#root');
            await expect(expected.locator('.semi-table-wrapper')).toHaveCount(1);
            await expect(rows(expected)).toHaveCount(initialRows[offset]!);
            const roots = [expected, actual];
            for (const page of pages)
              await page.evaluate((dir) => {
                document.body.dir = dir;
                document.body.classList.toggle('semi-rtl', dir === 'rtl');
              }, direction);
            const source = await readFile(
              new URL(`../../src/demos/table/${locale}/${name}.vue`, import.meta.url),
              'utf8',
            );
            expect(await demo.locator('[data-demo-source] code').textContent()).toBe(source);
            const compare = async (state: string, targets: Locator[] = roots) => {
              await waitForVisualAssets(targets);
              await settle(pages);
              if (targets === roots) {
                await align(reference, expected, vue, actual, direction);
                await settle(pages);
              } else {
                const bounds = await Promise.all(targets.map((target) => target.boundingBox()));
                await info.attach(`${state}-placement`, {
                  body: JSON.stringify({
                    panels: bounds,
                    contexts: await Promise.all(
                      roots.map((root) =>
                        root.evaluate((element) => ({
                          scrollY,
                          root: element.getBoundingClientRect().toJSON(),
                          triggers: [...element.querySelectorAll('.semi-table-column-filter')].map(
                            (trigger) => trigger.getBoundingClientRect().toJSON(),
                          ),
                        })),
                      ),
                    ),
                  }),
                  contentType: 'application/json',
                });
                expect(bounds[0]).not.toBeNull();
                expect(bounds[1]).not.toBeNull();
                for (const axis of ['x', 'y', 'width', 'height'] as const)
                  expect(
                    Math.abs(bounds[0]![axis] - bounds[1]![axis]),
                    `${state} Portal ${axis}`,
                  ).toBeLessThanOrEqual(0.5);
              }
              await waitForVisualAssets(targets);
              const [wanted, got] = await Promise.all(
                targets.map((target, index) => measure(target, roots[index]!)),
              );
              await info.attach(`${state}-styles`, {
                body: JSON.stringify({ expected: wanted, actual: got }),
                contentType: 'application/json',
              });
              expect(got, `${state} node count`).toHaveLength(wanted!.length);
              for (const [i, node] of got!.entries()) {
                const { rect: a, ...aNode } = node;
                const { rect: b, ...bNode } = wanted![i]!;
                expect(aNode, `${state} node ${i}`).toEqual(bNode);
                for (const axis of ['x', 'y', 'width', 'height'] as const)
                  expect(
                    Math.abs(a[axis] - b[axis]),
                    `${state} node ${i} ${axis}`,
                  ).toBeLessThanOrEqual(0.5);
              }
              const images = await Promise.all(targets.map((root) => root.screenshot()));
              for (const [i, label] of ['reference', 'vue'].entries())
                await info.attach(state === 'default' ? label : `${state}-${label}`, {
                  body: images[i]!,
                  contentType: 'image/png',
                });
              await expectScreenshotPixelsToMatch(vue, images[1]!, images[0]!, state);
            };
            await test.step('固定默认结构、全部属性、样式、几何和像素', () => compare('default'));
            if (index === 3)
              await test.step('选择、禁用项与跨页选择', async () => {
                for (const root of roots) {
                  await root.locator('.semi-checkbox').nth(1).click();
                  await expect(root.locator('input[type="checkbox"]').nth(1)).toBeChecked();
                  await expect(root.locator('input[type="checkbox"]').nth(3)).toBeDisabled();
                }
                await compare('selected');
                for (const root of roots) {
                  await root.locator('.semi-page-next').click();
                  await expect(rows(root).first()).toContainText('Semi D2C');
                }
                await compare('selection-page-2');
              });
            if (index === 4)
              await test.step('长标题Tooltip首次悬停、关闭与重开', async () => {
                const tips = pages.map((page) => page.locator('.semi-tooltip-wrapper:visible'));
                for (const root of roots)
                  await rows(root).first().locator('.semi-typography').hover();
                for (const tip of tips) await expect(tip).toBeVisible();
                await compare('title-tooltip', tips);
                for (const page of pages) await page.mouse.move(1400, 880);
                for (const tip of tips) await expect(tip).toHaveCount(0);
                for (const root of roots)
                  await rows(root).first().locator('.semi-typography').hover();
                for (const tip of tips) await expect(tip).toBeVisible();
                await compare('title-tooltip-reopened', tips);
                for (const page of pages) await page.mouse.move(1400, 880);
                for (const tip of tips) await expect(tip).toHaveCount(0);
              });
            if (index === 4)
              await test.step('删除全部、Empty明暗插画与重置', async () => {
                for (let remaining = 3; remaining >= 0; remaining--)
                  for (const root of roots) {
                    await rows(root).first().locator('button').click();
                    await expect(rows(root)).toHaveCount(remaining);
                  }
                await compare('empty');
                for (const root of roots) {
                  await root
                    .getByRole('button', {
                      name: locale === 'zh-cn' ? '重置' : 'Reset',
                      exact: true,
                    })
                    .click();
                  await expect(rows(root)).toHaveCount(4);
                }
                for (const root of roots) {
                  await rows(root).first().hover();
                  await expect(rows(root).first()).toHaveClass(/semi-table-row-hovered/);
                }
                await compare('reset-data-hovered');
                for (const page of pages) await page.mouse.move(1400, 880);
                for (const root of roots)
                  await expect(root.locator('.semi-table-row-hovered')).toHaveCount(0);
                await compare('reset-data');
              });
            if ([5, 6].includes(index))
              await test.step('真实分页后返回第一页', async () => {
                for (const root of roots) {
                  await root.locator('.semi-page-next').click();
                  await expect(rows(root).first()).toContainText(`${index === 6 ? 5 : 10}.fig`);
                  await expect(rows(root)).toHaveCount(index === 6 ? 5 : 10);
                }
                await compare('page-2');
                for (const root of roots) {
                  await root.locator('.semi-page-prev').click();
                  await expect(rows(root).first()).toContainText('0.fig');
                }
                await compare('page-1');
              });
            if (index === 7)
              await test.step('固定列水平与垂直滚动', async () => {
                for (const root of roots)
                  await root.locator('.semi-table-body').evaluate(
                    (element, offset) => {
                      element.scrollLeft = offset;
                      element.scrollTop = 120;
                    },
                    direction === 'rtl' ? -250 : 250,
                  );
                for (const root of roots)
                  await expect
                    .poll(() =>
                      root.locator('.semi-table-body').evaluate((element) => element.scrollTop),
                    )
                    .toBe(120);
                for (const root of roots)
                  await expect
                    .poll(() =>
                      root.locator('.semi-table-body').evaluate((element) => element.scrollLeft),
                    )
                    .toBe(direction === 'rtl' ? -250 : 250);
                await compare('scrolled');
              });
            if ([8, 9].includes(index))
              await test.step('升序、降序与取消排序', async () => {
                for (const state of ['ascending', 'descending', 'unsorted']) {
                  for (const root of roots)
                    await root
                      .locator('.semi-table-column-sorter')
                      .nth(index === 8 ? 1 : 0)
                      .click();
                  if (index === 9 && state !== 'unsorted')
                    for (const root of roots)
                      for (const row of [4, 5])
                        await expect(rows(root).nth(row).locator('td').nth(1)).toHaveText(
                          locale === 'zh-cn' ? '未知' : 'Unknown',
                        );
                  await compare(`sort-${state}`);
                }
              });
            if (index === 10)
              await test.step('组合输入筛选和清空', async () => {
                for (const root of roots) {
                  const input = root.locator('input');
                  await input.dispatchEvent('compositionstart');
                  await input.fill('Semi Design');
                  await input.dispatchEvent('compositionend');
                  await expect(rows(root).first()).toContainText('Semi Design');
                  await expect(rows(root).nth(1)).toContainText('2.fig');
                }
                await compare('header-filtered');
                for (const root of roots) {
                  await root.locator('input').fill('');
                  await expect(rows(root).nth(1)).toContainText('1.fig');
                }
                await compare('header-cleared');
              });
            if ([8, 11, 12, 13].includes(index))
              await test.step('筛选Portal、应用、关闭与重开', async () => {
                const panels = pages.map((page) =>
                  page.locator('.semi-table-column-filter-dropdown:visible'),
                );
                for (const root of roots)
                  await root.locator('.semi-table-column-filter').first().click();
                for (const panel of panels) await expect(panel).toBeVisible();
                await compare('filter-open', panels);
                for (const panel of panels) {
                  if (index === 11) {
                    await expect(panel.locator('input')).toBeFocused();
                    await panel.locator('input').fill('Semi Design');
                    await panel
                      .getByRole('button', {
                        name: locale === 'zh-cn' ? '筛选 + 关闭' : 'Filter+Close',
                        exact: true,
                      })
                      .click();
                  } else {
                    await panel
                      .getByText(
                        index === 12 && locale === 'en-us'
                          ? 'Semi Design'
                          : locale === 'zh-cn'
                            ? 'Semi Design 设计稿'
                            : 'Semi Design design draft',
                        { exact: true },
                      )
                      .click();
                    if (index === 12)
                      await panel
                        .getByRole('button', {
                          name: locale === 'zh-cn' ? '确定' : 'OK',
                          exact: true,
                        })
                        .click();
                  }
                }
                for (const root of roots) {
                  await expect(rows(root).first()).toContainText('Semi Design');
                  await expect(rows(root).nth(1)).toContainText('2.fig');
                }
                for (const page of pages) await page.mouse.click(1400, 880);
                for (const panel of panels) await expect(panel).toHaveCount(0);
                await compare('filter-applied');
                for (const root of roots)
                  await root.locator('.semi-table-column-filter').first().click();
                for (const panel of panels) await expect(panel).toBeVisible();
                await compare('filter-reopened', panels);
                for (const page of pages) await page.mouse.click(1400, 880);
                for (const panel of panels) await expect(panel).toHaveCount(0);
              });
            if (index === 11)
              await test.step('owner面板确认和清除均保持打开', async () => {
                const panels = pages.map((page) =>
                  page.locator('.semi-table-column-filter-dropdown:visible'),
                );
                for (const root of roots)
                  await root.locator('.semi-table-column-filter').nth(1).click();
                for (const panel of panels) await expect(panel).toBeVisible();
                await settle(pages);
                for (const panel of panels) {
                  await expect(panel).toBeVisible();
                  await expect(panel.locator('input')).toHaveValue(
                    locale === 'zh-cn' ? '姜鹏志' : 'Jiang Pengzhi',
                  );
                  await panel.locator('input').fill(locale === 'zh-cn' ? '郝宣' : 'Hao Xuan');
                  await panel
                    .getByRole('button', {
                      name: locale === 'zh-cn' ? '筛选后不关闭' : 'Filter+Close',
                      exact: true,
                    })
                    .click();
                  await expect(panel).toBeVisible();
                }
                // The earlier title filter restricts to Semi Design; the opposite owner produces no rows.
                for (const root of roots) await expect(rows(root)).toHaveCount(0);
                await compare('owner-filter-stays-open', panels);
                for (const panel of panels) {
                  await panel
                    .getByRole('button', {
                      name: locale === 'zh-cn' ? '清除后不关闭' : 'Clear+Close',
                      exact: true,
                    })
                    .click();
                  await expect(panel).toBeVisible();
                }
                for (const root of roots) await expect(rows(root)).toHaveCount(10);
                await compare('owner-clear-stays-open', panels);
                for (const panel of panels)
                  await panel
                    .getByRole('button', {
                      name: locale === 'zh-cn' ? '直接关闭' : 'Close',
                      exact: true,
                    })
                    .click();
                for (const panel of panels) await expect(panel).toHaveCount(0);
                await compare('owner-cleared');
              });
            if (index === 14 || index === 15)
              await test.step('展开Descriptions、折叠与重开', async () => {
                for (const root of roots) {
                  await root.locator('.semi-table-expand-icon').first().click();
                  await expect(root.locator('.semi-descriptions')).toHaveCount(1);
                  await expect(root.locator('.semi-descriptions')).toContainText('1,480,000');
                }
                await compare('expanded');
                for (const root of roots) {
                  await root.locator('.semi-table-expand-icon').first().click();
                  await expect(root.locator('.semi-descriptions')).toHaveCount(0);
                  await root.locator('.semi-table-expand-icon').first().click();
                  await expect(root.locator('.semi-descriptions')).toHaveCount(1);
                }
                await compare('reexpanded');
              });
            if (theme === 'light' && direction === 'ltr')
              await test.step('源码、重置、多文件编辑运行与退出恢复', async () => {
                const action = (zh: string, en: string) =>
                  demo
                    .locator('.demo-toolbar')
                    .getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
                await action('查看源码', 'View source').click();
                await expect(demo.locator('[data-demo-source]')).toBeVisible();
                expect(await demo.locator('[data-demo-source] code').textContent()).toBe(source);
                await action('查看源码', 'View source').click();
                await action('重置', 'Reset').click();
                await expect(rows(actual)).toHaveCount(initialRows[offset]!);
                await action('在线编辑', 'Edit online').click();
                const editor = demo.frameLocator('iframe').locator('#app');
                await expect(editor.locator('.semi-table-wrapper')).toHaveCount(1, {
                  timeout: 30_000,
                });
                await expect(rows(editor)).toHaveCount(initialRows[offset]!);
                if ([3, 5, 6].includes(index)) {
                  await editor.locator('.semi-page-next').click();
                  await expect(rows(editor).first()).toContainText(
                    index === 3 ? 'Semi D2C' : `${index === 6 ? 5 : 10}.fig`,
                  );
                } else if (index === 4) {
                  await rows(editor).first().locator('button').click();
                  await expect(rows(editor)).toHaveCount(3);
                } else if (index === 7) {
                  await editor.locator('.semi-table-body').evaluate((element) => {
                    element.scrollTop = 120;
                  });
                  await expect
                    .poll(() =>
                      editor.locator('.semi-table-body').evaluate((element) => element.scrollTop),
                    )
                    .toBe(120);
                } else if ([8, 9, 13].includes(index)) {
                  await editor.locator('.semi-table-column-sorter').first().click();
                  await expect(editor.locator('.semi-table-column-sorter-up.on')).toHaveCount(1);
                } else if (index === 10) {
                  await editor.locator('input').fill('Semi Design');
                  await expect(rows(editor).nth(1)).toContainText('2.fig');
                } else if (index === 11 || index === 12) {
                  await editor.locator('.semi-table-column-filter').first().click();
                  const panel = demo
                    .frameLocator('iframe')
                    .locator('.semi-table-column-filter-dropdown:visible');
                  await expect(panel).toBeVisible();
                  if (index === 11) {
                    const input = panel.locator('input');
                    await input.fill('Semi Design');
                    // The split REPL clips wide anchored panels; exercise its real keyboard path.
                    const confirm = panel.getByRole('button', {
                      name: locale === 'zh-cn' ? '筛选 + 关闭' : 'Filter+Close',
                      exact: true,
                    });
                    await input.press('Tab');
                    await expect(confirm).toBeFocused();
                    await confirm.press('Enter');
                  } else {
                    await panel
                      .getByText(locale === 'zh-cn' ? 'Semi Design 设计稿' : 'Semi Design', {
                        exact: true,
                      })
                      .click();
                    await panel
                      .getByRole('button', {
                        // The standalone REPL runs the source without the docs page's locale provider.
                        name: '确定',
                        exact: true,
                      })
                      .click();
                  }
                  await expect(rows(editor).nth(1)).toContainText('2.fig');
                } else if (index >= 14) {
                  await editor.locator('.semi-table-expand-icon').first().click();
                  await expect(editor.locator('.semi-descriptions')).toHaveCount(1);
                }
                await expect(demo.locator('.msg.err')).toHaveCount(0);
                await action('退出编辑', 'Close editor').click();
                await expect(demo.locator('iframe')).toHaveCount(0);
                await expect(rows(actual)).toHaveCount(initialRows[offset]!);
              });
            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'show/table',
                index,
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
