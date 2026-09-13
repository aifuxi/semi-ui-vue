import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
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
  // Keep the complete preview below the real sticky documentation header. A tall
  // element screenshot would scroll it again and paint that header over its top.
  await actual.evaluate((element) => {
    window.scrollTo(0, element.getBoundingClientRect().top + scrollY - 80);
  });
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

/** Capture the full target; only use document clipping when it exceeds the viewport. */
async function capture(root: Locator) {
  const snapshot = () =>
    root.evaluate((element) => ({
      box: element.getBoundingClientRect().toJSON(),
      scroll: { x: scrollX, y: scrollY },
      viewport: { width: innerWidth, height: innerHeight },
      document: {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      },
    }));
  const before = await snapshot();
  expect(before.viewport).toEqual({ width: 1440, height: 900 });
  const x = before.box.x + before.scroll.x;
  const y = before.box.y + before.scroll.y;
  // Match the locked Playwright element screenshot's enclosing integer bounds.
  const clip = {
    x: Math.floor(x + 1e-3),
    y: Math.floor(y + 1e-3),
    width: Math.ceil(x + before.box.width - 1e-3) - Math.floor(x + 1e-3),
    height: Math.ceil(y + before.box.height - 1e-3) - Math.floor(y + 1e-3),
  };
  expect(clip.x).toBeGreaterThanOrEqual(0);
  expect(clip.y).toBeGreaterThanOrEqual(0);
  expect(clip.x + clip.width).toBeLessThanOrEqual(before.document.width);
  expect(clip.y + clip.height).toBeLessThanOrEqual(before.document.height);
  const fullyVisible =
    before.box.x >= 0 &&
    before.box.y >= 0 &&
    before.box.x + before.box.width <= before.viewport.width &&
    before.box.y + before.box.height <= before.viewport.height;
  const viewportClip = {
    x: Math.floor(before.box.x + 1e-3),
    y: Math.floor(before.box.y + 1e-3),
    width: Math.ceil(before.box.x + before.box.width - 1e-3) - Math.floor(before.box.x + 1e-3),
    height: Math.ceil(before.box.y + before.box.height - 1e-3) - Math.floor(before.box.y + 1e-3),
  };
  // The normal viewport capture preserves Portal compositing. Tall previews need
  // the document clip to avoid element screenshot's automatic second scroll.
  const screenshot = fullyVisible
    ? await root.page().screenshot({ clip: viewportClip })
    : await root.page().screenshot({ fullPage: true, clip });
  expect(await snapshot(), 'screenshot preserves scroll, box and layout viewport').toEqual(before);
  return screenshot;
}

// Pinned Chinese 16–28/30; English 16–22/23–26/28 plus two explicitly translated Chinese snippets.
const examples = [
  'RowExpandable',
  'Tree',
  'TreeReorder',
  'TreeSelection',
  'TreeRelation',
  'RowEvents',
  'Zebra',
  'HeaderStyle',
  'CellHover',
  'Ellipsis',
  'EllipsisTooltip',
  'Resizable',
  'ResizableStyle',
  'Grouping',
] as const;
const initialRows = [3, 7, 6, 2, 2, 10, 6, 3, 3, 4, 4, 10, 5, 0];
const rows = (root: Locator) =>
  root.locator(
    '.semi-table-tbody > .semi-table-row:not(.semi-table-row-expand):not(.semi-table-row-section)',
  );
for (const locale of ['zh-cn', 'en-us'])
  for (const theme of ['light', 'dark'])
    for (const [offset, name] of examples.entries())
      for (const direction of ['ltr', 'rtl'])
        test(`Table 文档 ${name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
          browser,
        }, info) => {
          test.setTimeout(150_000);
          const index = offset === 13 ? 30 : offset + 16;
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
              `http://127.0.0.1:4173/docs.html?component=table-2&locale=${locale}&theme=${theme}&example=${offset + 1}${direction === 'rtl' ? '&direction=rtl' : ''}`,
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
              const styles = Buffer.from(JSON.stringify({ expected: wanted, actual: got }));
              // Keep the required default proof readable; preserve every interaction
              // measurement losslessly without exceeding Node's JSON string limit.
              await info.attach(
                state === 'default' ? 'default-styles' : `${state}-styles.json.gz`,
                {
                  body: state === 'default' ? styles : gzipSync(styles),
                  contentType: state === 'default' ? 'application/json' : 'application/gzip',
                },
              );
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
              const images = await Promise.all(targets.map(capture));
              for (const [i, label] of ['reference', 'vue'].entries())
                await info.attach(state === 'default' ? label : `${state}-${label}`, {
                  body: images[i]!,
                  contentType: 'image/png',
                });
              await expectScreenshotPixelsToMatch(vue, images[1]!, images[0]!, state);
            };
            await test.step('固定默认结构、全部属性、样式、几何和像素', () => compare('default'));
            if (index === 16)
              await test.step('禁选记录、展开折叠重开', async () => {
                for (const root of roots) {
                  await expect(root.locator('input[type="checkbox"]').nth(3)).toBeDisabled();
                  await expect(rows(root).nth(2).locator('.semi-table-expand-icon')).toHaveCount(0);
                  await root.locator('.semi-table-expand-icon').first().click();
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
            if ([17, 18, 19, 20].includes(index))
              await test.step('树展开折叠与身份', async () => {
                for (const root of roots) {
                  await root.locator('.semi-table-expand-icon').first().click();
                  await expect(rows(root)).toHaveCount(index === 17 ? 4 : index === 18 ? 4 : 4);
                }
                await compare('tree-toggled');
                for (const root of roots) {
                  await root.locator('.semi-table-expand-icon').first().click();
                  await expect(rows(root)).toHaveCount(initialRows[offset]!);
                }
                await compare('tree-restored');
              });
            if (index === 18)
              await test.step('同级换序与边界按钮', async () => {
                for (const root of roots) {
                  await expect(rows(root).first().locator('button').nth(0)).toBeDisabled();
                  await rows(root).first().locator('button').nth(1).click();
                  await expect(rows(root).first()).toContainText('text_info');
                  await expect(rows(root)).toHaveCount(6);
                }
                await compare('tree-reordered');
              });
            if ([19, 20].includes(index))
              await test.step('父选、展开后子选与取消', async () => {
                for (const root of roots) {
                  await root.locator('.semi-checkbox').nth(1).click();
                  await expect(root.locator('input[type="checkbox"]').nth(1)).toBeChecked();
                  await root.locator('.semi-table-expand-icon').first().click();
                  await expect(rows(root)).toHaveCount(4);
                  await expect(rows(root).nth(1).locator('input')).toBeChecked();
                }
                await compare('parent-selected');
                for (const root of roots) {
                  await rows(root).nth(1).locator('.semi-checkbox').click();
                  await expect(rows(root).nth(1).locator('input')).not.toBeChecked();
                  if (index === 19) await expect(rows(root).first().locator('input')).toBeChecked();
                  else
                    await expect(rows(root).first().locator('.semi-checkbox')).toHaveClass(
                      /indeterminate/,
                    );
                }
                await compare('child-deselected');
              });
            if (index === 21)
              await test.step('真实行点击及表头进入离开回调', async () => {
                const logs: string[][] = [[], []];
                pages.forEach((page, i) =>
                  page.on('console', (message) => {
                    if (message.type() === 'log') logs[i]!.push(message.text().split(' ')[0]!);
                  }),
                );
                for (const root of roots) {
                  await rows(root).nth(2).click();
                  await root.locator('.semi-table-thead').hover();
                }
                for (const page of pages) await page.mouse.move(1400, 880);
                expect(logs[0]!.length).toBeGreaterThanOrEqual(3);
                expect(logs[1]).toEqual(logs[0]);
                await compare('row-events');
              });
            if ([21, 27, 28].includes(index))
              await test.step('分页往返', async () => {
                for (const root of roots) {
                  await root.locator('.semi-page-next').click();
                  await expect(rows(root).first()).toContainText(index === 28 ? '5.fig' : '10.fig');
                }
                await compare('next-page');
                for (const root of roots) {
                  await root.locator('.semi-page-prev').click();
                  await expect(rows(root).first()).toContainText('0.fig');
                }
                await compare('first-page');
              });
            if ([22, 24].includes(index))
              await test.step('行与单元格真实悬停', async () => {
                for (const root of roots) await rows(root).first().locator('td').nth(1).hover();
                await compare(
                  'cell-hover',
                  roots.map((root) => root.locator('.semi-table-wrapper')),
                );
                for (const page of pages) await page.mouse.move(1400, 880);
                await compare('hover-cleared');
              });
            if ([25, 26].includes(index))
              await test.step('固定列水平滚动', async () => {
                for (const root of roots) {
                  const body = root.locator('.semi-table-body');
                  await body.evaluate(
                    (element, value) => {
                      element.scrollLeft = value;
                    },
                    direction === 'rtl' ? -200 : 200,
                  );
                  await expect
                    .poll(() => body.evaluate((element) => Math.abs(element.scrollLeft)))
                    .toBe(200);
                }
                await compare('horizontal-scroll');
                for (const root of roots)
                  await root.locator('.semi-table-body').evaluate((element) => {
                    element.scrollLeft = 0;
                  });
                await compare('horizontal-restored');
              });
            if (index === 26)
              await test.step('Typography Portal悬停关闭重开', async () => {
                const tips = pages.map((page) => page.locator('.semi-tooltip-wrapper:visible'));
                for (const state of ['open', 'reopened']) {
                  for (const root of roots)
                    await rows(root).first().locator('.semi-typography').first().hover();
                  for (const tip of tips) await expect(tip).toBeVisible();
                  await compare(`tooltip-${state}`, tips);
                  for (const page of pages) await page.mouse.move(1400, 880);
                  for (const tip of tips) await expect(tip).toHaveCount(0);
                }
              });
            if ([21, 25, 26, 27, 28].includes(index))
              await test.step('排序三态', async () => {
                for (const state of ['ascending', 'descending', 'unsorted']) {
                  for (const root of roots)
                    await root.locator('.semi-table-column-sorter').first().click();
                  await compare(`sort-${state}`);
                }
              });
            if ([21, 25, 26, 27, 28].includes(index))
              await test.step('筛选Portal打开应用关闭重开', async () => {
                const panels = pages.map((page) =>
                  page.locator('.semi-table-column-filter-dropdown:visible'),
                );
                for (const root of roots)
                  await root.locator('.semi-table-column-filter').first().click();
                for (const panel of panels) await expect(panel).toBeVisible();
                await compare('filter-open', panels);
                for (const panel of panels) await panel.locator('.semi-checkbox').first().click();
                for (const root of roots)
                  await expect(rows(root)).toHaveCount(
                    [25, 26].includes(index) ? 0 : index === 28 ? 5 : 10,
                  );
                for (const page of pages) await page.mouse.click(1400, 880);
                for (const panel of panels) await expect(panel).toHaveCount(0);
                await compare('filter-applied');
                for (const root of roots)
                  await root.locator('.semi-table-column-filter').first().click();
                for (const panel of panels) await expect(panel).toBeVisible();
                await compare('filter-reopened', panels);
                for (const panel of panels) await panel.locator('.semi-checkbox').first().click();
                for (const page of pages) await page.mouse.click(1400, 880);
                for (const panel of panels) await expect(panel).toHaveCount(0);
                for (const root of roots)
                  await expect(rows(root)).toHaveCount(initialRows[offset]!);
                await compare('filter-cleared');
              });
            if ([27, 28].includes(index))
              await test.step('真实拖动调整列宽与结束反馈', async () => {
                const waitForFixedEdges = async (state: string) => {
                  if (index !== 27) return;
                  const samples: unknown[] = [];
                  try {
                    await expect
                      .poll(
                        async () => {
                          const states = await Promise.all(
                            roots.map((root, side) =>
                              root.evaluate((element, side) => {
                                const body = element.querySelector<HTMLElement>('.semi-table-body');
                                const table = body?.firstElementChild;
                                const wrap =
                                  element.querySelector('.semi-table-container')?.parentElement;
                                if (!body || !table || !wrap)
                                  throw new Error('fixed table structure missing');
                                const bodyBox = body.getBoundingClientRect();
                                const tableBox = table.getBoundingClientRect();
                                // Pinned Table.setScrollPositionClassName, including its 1px edge tolerance.
                                const left = body.scrollLeft === 0;
                                const right =
                                  Math.abs(body.scrollLeft) + 1 >= tableBox.width - bodyBox.width;
                                const expected = [
                                  ...(left ? ['semi-table-scroll-position-left'] : []),
                                  ...(right ? ['semi-table-scroll-position-right'] : []),
                                  ...(!left && !right ? ['semi-table-scroll-position-middle'] : []),
                                ].sort();
                                const actual = [...wrap.classList]
                                  .filter((name) => name.startsWith('semi-table-scroll-position-'))
                                  .sort();
                                return {
                                  side: side === 0 ? 'reference' : 'vue',
                                  timestamp: performance.now(),
                                  root: element.getBoundingClientRect().toJSON(),
                                  body: bodyBox.toJSON(),
                                  table: tableBox.toJSON(),
                                  scrollLeft: body.scrollLeft,
                                  expected,
                                  actual,
                                  settled: JSON.stringify(actual) === JSON.stringify(expected),
                                };
                              }, side),
                            ),
                          );
                          samples.push(states);
                          return states.every((sample) => sample.settled);
                        },
                        {
                          timeout: 5000,
                          message: 'fixed-column edges settle to the pinned scroll geometry',
                        },
                      )
                      .toBe(true);
                  } finally {
                    await test.info().attach(`${state}-fixed-edge-settlement`, {
                      body: Buffer.from(JSON.stringify(samples)),
                      contentType: 'application/json',
                    });
                  }
                };
                const drag = async (delta: number) => {
                  for (const [i, root] of roots.entries()) {
                    const handles = root.locator('.react-resizable-handle');
                    await expect(handles).toHaveCount(index === 27 ? 2 : 3);
                    const handle = handles.first();
                    const box = await handle.boundingBox();
                    if (!box) throw new Error('resize handle missing');
                    const th = handle.locator('..');
                    const before = (await th.boundingBox())!.width;
                    await pages[i]!.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
                    await pages[i]!.mouse.down();
                    await pages[i]!.mouse.move(
                      box.x + box.width / 2 + delta,
                      box.y + box.height / 2,
                      {
                        steps: 5,
                      },
                    );
                    if (index === 28)
                      await expect(root.locator('.semi-table-thead th.my-resizing')).toHaveCount(1);
                    await expect
                      .poll(async () => Math.abs((await th.boundingBox())!.width - before))
                      .toBeGreaterThan(30);
                  }
                };
                const release = async () => {
                  const snapshot = (root: Locator) =>
                    root.evaluate((element) => ({
                      widths: [...element.querySelectorAll('col, thead th')].map(
                        (cell) => cell.getBoundingClientRect().width,
                      ),
                      sort: [
                        ...element.querySelectorAll('thead [class*="sorter"], thead [aria-sort]'),
                      ].map((node) => [node.className, node.getAttribute('aria-sort')]),
                    }));
                  const before = index === 27 ? await Promise.all(roots.map(snapshot)) : [];
                  for (const page of pages) await page.mouse.up();
                  for (const root of roots)
                    await expect(root.locator('.my-resizing')).toHaveCount(0);
                  if (index === 27) {
                    await settle(pages);
                    for (const [i, root] of roots.entries()) {
                      const after = await snapshot(root);
                      expect(after.sort, 'mouseup does not sort columns').toEqual(before[i]!.sort);
                      expect(after.widths).toHaveLength(before[i]!.widths.length);
                      for (const [column, width] of after.widths.entries())
                        expect(
                          Math.abs(width - before[i]!.widths[column]!),
                          'mouseup preserves column widths',
                        ).toBeLessThanOrEqual(0.5);
                    }
                  }
                };
                const wrappers = roots.map((root) => root.locator('.semi-table-wrapper'));
                if (index === 27 && direction === 'rtl') {
                  const initialWidths = await Promise.all(
                    roots.map(
                      async (root) =>
                        (await root
                          .locator('.react-resizable-handle')
                          .first()
                          .locator('..')
                          .boundingBox())!.width,
                    ),
                  );
                  await drag(-40);
                  await compare('resize-narrowing', wrappers);
                  await release();
                  await compare('resize-narrowed');
                  await drag(40);
                  for (const [i, root] of roots.entries())
                    await expect
                      .poll(async () =>
                        Math.abs(
                          (await root
                            .locator('.react-resizable-handle')
                            .first()
                            .locator('..')
                            .boundingBox())!.width - initialWidths[i]!,
                        ),
                      )
                      .toBeLessThanOrEqual(0.5);
                  await compare('resize-restoring', wrappers);
                  await release();
                  await compare('resize-restored');
                  await drag(40);
                  // Crossing overflow after the last root-height notification has no
                  // guaranteed edge class in the pinned source. Preserve raw evidence;
                  // certify its full final visuals after native horizontal scrolling.
                  await info.attach('resize-overflow-dragging-observation.json.gz', {
                    body: gzipSync(
                      Buffer.from(
                        JSON.stringify({
                          expected: await measure(wrappers[0]!, roots[0]!),
                          actual: await measure(wrappers[1]!, roots[1]!),
                        }),
                      ),
                    ),
                    contentType: 'application/gzip',
                  });
                  await release();
                  for (const [state, delta] of [
                    ['resized-scroll-end', -600],
                    ['resized-scroll-return', 600],
                  ] as const) {
                    for (const [i, root] of roots.entries()) {
                      const body = root.locator('.semi-table-body');
                      const before = await body.evaluate((element) => element.scrollLeft);
                      const max = await body.evaluate(
                        (element) => element.scrollWidth - element.clientWidth,
                      );
                      expect(max, 'resized body has real horizontal overflow').toBeGreaterThan(1);
                      const box = await body.boundingBox();
                      if (!box) throw new Error('resize scroll body missing');
                      const viewport = pages[i]!.viewportSize()!;
                      const top = Math.max(box.y, 0),
                        bottom = Math.min(box.y + box.height, viewport.height);
                      expect(bottom).toBeGreaterThan(top);
                      await pages[i]!.mouse.move(box.x + box.width / 2, (top + bottom) / 2);
                      await pages[i]!.mouse.wheel(delta, 0);
                      await expect
                        .poll(() => body.evaluate((element) => element.scrollLeft))
                        .not.toBe(before);
                      await expect
                        .poll(() =>
                          body.evaluate(
                            (element, delta) =>
                              delta < 0
                                ? Math.abs(element.scrollLeft) + 1 >=
                                  element.scrollWidth - element.clientWidth
                                : element.scrollLeft === 0,
                            delta,
                          ),
                        )
                        .toBe(true);
                    }
                    await waitForFixedEdges(state);
                    await compare(state);
                  }
                  return;
                }
                await drag(40);
                await waitForFixedEdges('resize-dragging');
                await compare(
                  'resize-dragging',
                  roots.map((root) => root.locator('.semi-table-wrapper')),
                );
                await release();
                await waitForFixedEdges('resized');
                await compare('resized');
              });
            if (index === 30)
              await test.step('固定分组顺序、整行展开折叠及分页', async () => {
                for (const root of roots) {
                  await expect(root.locator('.semi-table-row-section')).toHaveCount(4);
                  await expect(root.locator('.semi-table-row-section').first()).toContainText(
                    '100 KB',
                  );
                  await root.locator('.semi-table-row-section').first().click();
                  await expect(rows(root)).toHaveCount(3);
                }
                await compare('group-expanded');
                for (const root of roots) {
                  await root.locator('.semi-table-row-section').first().click();
                  await expect(rows(root)).toHaveCount(0);
                }
                await compare('group-collapsed');
                for (const root of roots) {
                  await root.locator('.semi-page-next').click();
                  await expect(root.locator('.semi-table-row-section').first()).toContainText(
                    '117 KB',
                  );
                }
                await compare('group-next-page');
              });
            if (theme === 'light' && direction === 'ltr')
              await test.step('源码重置、在线编辑运行与退出', async () => {
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
                  timeout: 30000,
                });
                await expect(rows(editor)).toHaveCount(initialRows[offset]!);
                if (index === 16) {
                  await editor.locator('.semi-table-expand-icon').first().click();
                  await expect(editor.locator('.semi-descriptions')).toHaveCount(1);
                } else if ([17, 18, 19, 20].includes(index)) {
                  await editor.locator('.semi-table-expand-icon').first().click();
                  await expect(rows(editor)).toHaveCount(4);
                } else if ([21, 27, 28].includes(index)) {
                  await editor.locator('.semi-page-next').click();
                  await expect(rows(editor).first()).toContainText(
                    index === 28 ? '5.fig' : '10.fig',
                  );
                } else if ([25, 26].includes(index)) {
                  await editor.locator('.semi-table-column-sorter').first().click();
                  await expect(editor.locator('.semi-table-column-sorter-up.on')).toHaveCount(1);
                } else if (index === 30) {
                  await editor.locator('.semi-table-row-section').first().click();
                  await expect(rows(editor)).toHaveCount(3);
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
