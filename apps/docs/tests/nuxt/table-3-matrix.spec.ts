import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { freezeAnimations } from './demo-parity';
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

// Fixed live snippet indices: Chinese 31–37 and English 29–35 (zero-based).
const examples = [
  'Virtualized',
  'InfiniteScroll',
  'Dynamic',
  'FullRender',
  'GroupedColumns',
  'GroupedDeclarative',
  'Span',
] as const;
type Example = (typeof examples)[number];
const rows = (root: Locator) =>
  root.locator(
    '.semi-table-tbody > .semi-table-row:not(.semi-table-row-expand):not(.semi-table-row-section)',
  );
const isVirtual = (name: Example) => name === 'Virtualized' || name === 'InfiniteScroll';

async function expectIdle(root: Locator) {
  await expect(root.locator('.semi-spin-wrapper')).toHaveCount(0);
  // react-window exposes its actual scrolling state by temporarily disabling pointer events.
  // Observe that state settling; do not pause its timer or discard overscan/style differences.
  if (await root.locator('div.semi-table-tbody').count())
    await expect(root.locator('div.semi-table-tbody')).not.toHaveCSS('pointer-events', 'none');
}

async function expectInitial(root: Locator, name: Example) {
  await expect(root.locator('.semi-table-wrapper')).toHaveCount(1);
  await expect(rows(root).first()).toContainText('0.fig');
  await expectIdle(root);
  if (isVirtual(name)) {
    await expect
      .poll(() => rows(root).count(), {
        message: 'the viewport renders a bounded subset of records',
      })
      .toBeLessThan(20);
    await expectVirtualTotal(root, name === 'Virtualized' ? 1000 : 20);
    await expect(rows(root).first()).toHaveCSS('height', name === 'Virtualized' ? '53px' : '56px');
    await expect(root.locator('.semi-page')).toHaveCount(0);
  } else {
    await expect(rows(root)).toHaveCount(
      name === 'Dynamic' ? 8 : name === 'FullRender' ? 12 : name === 'Span' ? 5 : 10,
    );
  }
}

async function expectVirtualTotal(root: Locator, total: number) {
  // VariableSizeList measures the rendered prefix and estimates untouched rows at
  // its pinned default of 50px. These assertions run at mount or after small forward
  // scrolls, when overscan extends past the search probe and the prefix ends at the
  // final rendered row. A fully materialized list or a missing append both fail.
  await expect
    .poll(
      () =>
        root.locator('.semi-table-tbody').evaluate((element) => {
          const last = element.querySelector<HTMLElement>('.semi-table-row:last-child');
          if (!last) return null;
          const measured = Number(last.getAttribute('data-row-key')) + 1;
          const bottom = Number.parseFloat(last.style.top) + Number.parseFloat(last.style.height);
          return measured + (element.getBoundingClientRect().height - bottom) / 50;
        }),
      {
        message: 'the measured prefix and 50px estimated suffix contain the expected record count',
      },
    )
    .toBe(total);
}

async function expectSpan(root: Locator) {
  await expect(rows(root)).toHaveCount(5);
  await expect(rows(root).nth(0).locator(':scope > td')).toHaveCount(1);
  await expect(rows(root).nth(0).locator(':scope > td')).toHaveAttribute('colspan', '4');
  await expect(rows(root).nth(1).locator(':scope > td[rowspan="2"]')).toHaveCount(3);
  await expect(rows(root).nth(2).locator(':scope > td')).toHaveCount(1);
  await expect(
    root.locator('.semi-table-tbody [colspan="0"], .semi-table-tbody [rowspan="0"]'),
  ).toHaveCount(0);
}

async function scrollBody(root: Locator, top: number) {
  const body = root.locator('.semi-table-body');
  // Setting the native scroll position dispatches a real browser scroll event. Unlike
  // scrollToItem, react-window reports scrollUpdateWasRequested=false for this path.
  await body.evaluate((element, value) => {
    element.scrollTop = value;
  }, top);
  await expect.poll(() => body.evaluate((element) => element.scrollTop)).toBe(top);
  await expectIdle(root);
}

const dynamicLabels = [
  ['固定表头：', 'Fixed Header:'],
  ['隐藏表头：', 'Hidden Header:'],
  ['显示标题：', 'Show Header:'],
  ['显示底部：', 'Show Footer:'],
  ['固定列：', 'Fixed Column:'],
  ['显示选择列：', 'Show Selection Column:'],
  ['显示加载状态：', 'Show Loading:'],
  ['无数据：', 'Empty Content:'],
  ['开启排序功能：', 'Column Sorter:'],
  ['开启过滤功能：', 'Column Filter:'],
  ['开启行展开功能：', 'Row Expandable:'],
  ['展开当前所有行：', 'Expand All Rows:'],
  ['显示边框：', 'Show Border:'],
  ['开启列伸缩功能：', 'Column Resizable:'],
] as const;
function dynamicSwitch(root: Locator, locale: string, index: number) {
  const label = dynamicLabels[index]![locale === 'zh-cn' ? 0 : 1];
  return root.getByText(label, { exact: true }).locator('..').getByRole('switch');
}

for (const locale of ['zh-cn', 'en-us'])
  for (const theme of ['light', 'dark'])
    for (const [offset, name] of examples.entries())
      for (const direction of ['ltr', 'rtl'])
        test(`Table 文档 ${name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
          browser,
        }, info) => {
          test.setTimeout(240_000);
          const index = offset + 31;
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
            // Dynamic mounts on this same page and completes its initial async fetch.
            // Its empty-to-eight-row transition changes document height even when
            // another example is the target, so observe it before measuring either root.
            const dynamic = vue.locator(
              `[data-demo-id="table/${locale}/Dynamic"] [data-demo-preview]`,
            );
            await expectInitial(dynamic, 'Dynamic');
            const demo = vue.locator(`[data-demo-id="table/${locale}/${name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual.locator('.semi-table-wrapper')).toHaveCount(1);
            await expectInitial(actual, name);
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
              `http://127.0.0.1:4173/docs.html?component=table-3&locale=${locale}&theme=${theme}&example=${offset + 1}${direction === 'rtl' ? '&direction=rtl' : ''}`,
            );
            const expected = reference.locator('#root');
            await expect(expected.locator('.semi-table-wrapper')).toHaveCount(1);
            await expectInitial(expected, name);
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
              if (state === 'loading-on') await freezeAnimations(pages, 300);
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
              if (state === 'loading-on')
                await Promise.all(
                  pages.map((page) =>
                    page.evaluate(() =>
                      document.getAnimations().forEach((animation) => animation.play()),
                    ),
                  ),
                );
            };
            await test.step('固定默认结构、全部属性、样式、几何和像素', () => compare('default'));

            const both = async (action: (root: Locator) => Promise<void>) => {
              for (const root of roots) await action(root);
            };
            const toggle = async (index: number, checked: boolean) => {
              await both(async (root) => {
                const control = dynamicSwitch(root, locale, index);
                await control.click();
                await expect(control).toHaveJSProperty('checked', checked);
                // The pinned fixed-header callback clears scroll.y and TableSwitch
                // omits checked again, preserving the controlled-to-omitted transition.
                if (index === 0 && !checked)
                  await expect(control).not.toHaveAttribute('aria-checked');
                else await expect(control).toHaveAttribute('aria-checked', String(checked));
              });
            };
            const sort = async (prefix = 'sort') => {
              for (let column = 0; column < (name === 'Span' ? 1 : 2); column++)
                for (const [state, active] of [
                  ['ascending', '.semi-table-column-sorter-up.on'],
                  ['descending', '.semi-table-column-sorter-down.on'],
                  ['unsorted', null],
                ] as const) {
                  await both(async (root) => {
                    await root.locator('.semi-table-column-sorter').nth(column).click();
                    if (active) await expect(root.locator(active)).toHaveCount(1);
                    else await expect(root.locator('.semi-table-column-sorter .on')).toHaveCount(0);
                    await expectIdle(root);
                  });
                  if (name === 'Span') await both(expectSpan);
                  await compare(prefix + '-' + column + '-' + state);
                }
            };
            const filter = async (prefix = 'filter', contains = 'Semi Design') => {
              const panels = pages.map((page) =>
                page.locator('.semi-table-column-filter-dropdown:visible'),
              );
              await both(async (root) => {
                await root.locator('.semi-table-column-filter').first().click();
              });
              for (const panel of panels) await expect(panel).toBeVisible();
              await compare(prefix + '-open', panels);
              for (const panel of panels) await panel.locator('.semi-checkbox').first().click();
              await both(async (root) => {
                await expectIdle(root);
                await expect
                  .poll(async () =>
                    (await rows(root).allTextContents()).every((text) =>
                      contains === '1'
                        ? /1[.]fig/.test(text) || /\d*1\d*[.]fig/.test(text)
                        : text.includes(contains),
                    ),
                  )
                  .toBe(true);
                await expect(rows(root).first()).toBeVisible();
              });
              for (const page of pages) await page.mouse.click(1400, 880);
              for (const panel of panels) await expect(panel).toHaveCount(0);
              await compare(prefix + '-applied');
              await both(async (root) => {
                await root.locator('.semi-table-column-filter').first().click();
              });
              for (const panel of panels) await expect(panel).toBeVisible();
              await compare(prefix + '-reopened', panels);
              for (const panel of panels) await panel.locator('.semi-checkbox').first().click();
              for (const page of pages) await page.mouse.click(1400, 880);
              for (const panel of panels) await expect(panel).toHaveCount(0);
              await both(expectIdle);
              await compare(prefix + '-cleared');
            };
            if (name === 'Virtualized')
              await test.step('真实虚拟列表定位100、返回顶部及固定列滚动', async () => {
                await both(async (root) => {
                  await root.getByRole('button', { name: 'Scroll to 100', exact: true }).click();
                  const target = rows(root).filter({ hasText: /100[.]fig/ });
                  await expect(target).toHaveCount(1);
                  await expect(rows(root).filter({ hasText: /(?:稿|draft)0[.]fig/ })).toHaveCount(
                    0,
                  );
                  await expect
                    .poll(() =>
                      root.locator('.semi-table-body').evaluate((element) => element.scrollTop),
                    )
                    .toBeGreaterThanOrEqual(100 * 53 - 400);
                  await expectIdle(root);
                  const body = await root.locator('.semi-table-body').boundingBox();
                  const row = await target.boundingBox();
                  expect(row).not.toBeNull();
                  expect(body).not.toBeNull();
                  expect(row!.y).toBeGreaterThanOrEqual(body!.y - 0.5);
                  expect(row!.y + row!.height).toBeLessThanOrEqual(body!.y + body!.height + 0.5);
                });
                await compare('virtual-scroll-to-100');
                await both(async (root) => {
                  const cachedHeight = await root
                    .locator('.semi-table-tbody')
                    .evaluate((element) => getComputedStyle(element).height);
                  await scrollBody(root, 0);
                  await expect(rows(root).first()).toContainText('0.fig');
                  await expect.poll(() => rows(root).count()).toBeLessThan(20);
                  // Scrolling back does not discard the larger measured prefix from the jump.
                  await expect(root.locator('.semi-table-tbody')).toHaveCSS('height', cachedHeight);
                });
                await compare('virtual-scroll-restored');
              });
            if (name === 'InfiniteScroll')
              await test.step('原生滚动连续加载20条并保持滚动窗口', async () => {
                for (const [top, total] of [
                  [400, 40],
                  // The 40-row estimated height is 2162px here: 1400 is reachable
                  // inside its 600px viewport and crosses the pinned 1316px trigger.
                  [1400, 60],
                ] as const) {
                  await both(async (root) => {
                    await scrollBody(root, top);
                    await expectVirtualTotal(root, total);
                    await scrollBody(root, total === 40 ? 800 : 1920);
                    await expectVirtualTotal(root, total);
                    await expect.poll(() => rows(root).count()).toBeLessThan(20);
                    await expect(
                      rows(root).filter({
                        hasText: total === 40 ? /(?:稿|draft)20[.]fig/ : /(?:稿|draft)40[.]fig/,
                      }),
                    ).toHaveCount(1);
                    await expectIdle(root);
                  });
                  await compare('infinite-loaded-' + total);
                }
                await both(async (root) => {
                  await scrollBody(root, 0);
                  await expect(rows(root).first()).toContainText('0.fig');
                });
                await compare('infinite-scroll-restored');
              });
            if (isVirtual(name))
              await test.step('虚拟固定列水平滚动', async () => {
                await both(async (root) => {
                  const body = root.locator('.semi-table-body');
                  await body.evaluate(
                    (element, value) => {
                      element.scrollLeft = value;
                    },
                    direction === 'rtl' ? -150 : 150,
                  );
                  await expect
                    .poll(() => body.evaluate((element) => Math.abs(element.scrollLeft)))
                    .toBe(150);
                  await expectIdle(root);
                });
                await compare('virtual-horizontal-scroll');
                await both(async (root) => {
                  const body = root.locator('.semi-table-body');
                  await body.evaluate((element) => {
                    element.scrollLeft = 0;
                  });
                  await expect.poll(() => body.evaluate((element) => element.scrollLeft)).toBe(0);
                  await expectIdle(root);
                });
                await compare('virtual-horizontal-restored');
              });
            if (['FullRender', 'GroupedColumns', 'GroupedDeclarative'].includes(name))
              await test.step('选择、全选及展开折叠重开', async () => {
                if (name === 'FullRender') {
                  await both(async (root) => {
                    await expect(root.locator('.semi-table-thead th')).toHaveCount(4);
                    await expect(rows(root).first().locator(':scope > td')).toHaveCount(4);
                    await expect(
                      rows(root)
                        .first()
                        .locator(':scope > td')
                        .first()
                        .locator('.semi-table-expand-icon'),
                    ).toHaveCount(1);
                    await expect(
                      rows(root)
                        .first()
                        .locator(':scope > td')
                        .first()
                        .locator('input[type="checkbox"]'),
                    ).toHaveCount(1);
                  });
                } else {
                  await both(async (root) => {
                    await expect(root.locator('.semi-table-thead > tr')).toHaveCount(2);
                    await expect(
                      root.locator('.semi-table-thead > tr').first().locator('th[colspan="2"]'),
                    ).toHaveCount(2);
                    await expect(
                      root.locator('.semi-table-thead > tr').first().locator('th[rowspan="2"]'),
                    ).toHaveCount(2);
                  });
                }
                await both(async (root) => {
                  await rows(root).first().locator('.semi-checkbox').click();
                  await expect(rows(root).first().locator('input[type="checkbox"]')).toBeChecked();
                });
                await compare('row-selected');
                await both(async (root) => {
                  await root.locator('.semi-table-thead .semi-checkbox').click();
                  await expect(
                    root.locator('.semi-table-tbody input[type="checkbox"]:checked'),
                  ).toHaveCount(name === 'FullRender' ? 12 : 10);
                });
                await compare('all-selected');
                await both(async (root) => {
                  await root.locator('.semi-table-thead .semi-checkbox').click();
                  await expect(root.locator('input[type="checkbox"]:checked')).toHaveCount(0);
                });
                await compare('selection-cleared');
                for (const state of ['expanded', 'reopened']) {
                  await both(async (root) => {
                    const firstName = await rows(root)
                      .first()
                      .locator(':scope > td')
                      .filter({ hasText: '0.fig' })
                      .textContent();
                    await rows(root).first().locator('.semi-table-expand-icon').click();
                    await expect(root.locator('.semi-table-row-expand article')).toContainText(
                      '0.fig',
                    );
                    expect(firstName).toContain('0.fig');
                  });
                  await compare(state);
                  await both(async (root) => {
                    await rows(root).first().locator('.semi-table-expand-icon').click();
                    await expect(root.locator('.semi-table-row-expand')).toHaveCount(0);
                  });
                  await compare(state + '-closed');
                }
              });
            if (name === 'Span')
              await test.step('colSpan与rowSpan省略单元格', async () => {
                await both(expectSpan);
                await compare('merged-cells');
              });
            if (name === 'GroupedColumns' || name === 'GroupedDeclarative')
              await test.step('分层固定表头纵向滚动与还原', async () => {
                await both(async (root) => {
                  const header = root.locator('.semi-table-header');
                  const before = await header.boundingBox();
                  await scrollBody(root, 100);
                  expect(await header.boundingBox()).toEqual(before);
                });
                await compare('grouped-vertical-scroll');
                await both(async (root) => {
                  await scrollBody(root, 0);
                });
                await compare('grouped-vertical-restored');
              });
            if (name !== 'Dynamic') {
              await test.step('排序三态及适用合并结构', () => sort());
              if (name !== 'Span') await test.step('筛选Portal打开应用关闭重开', () => filter());
            }
            if (['FullRender', 'GroupedColumns', 'GroupedDeclarative'].includes(name))
              await test.step('下一页、上一页与记录顺序', async () => {
                await both(async (root) => {
                  await root.locator('.semi-page-next').click();
                  await expect(rows(root).first()).toContainText(
                    name === 'FullRender' ? '12.fig' : '10.fig',
                  );
                });
                await compare('next-page');
                await both(async (root) => {
                  await root.locator('.semi-page-prev').click();
                  await expect(rows(root).first()).toContainText('0.fig');
                });
                await compare('previous-page');
              });
            if (name === 'Dynamic') {
              await test.step('异步受控排序筛选及8条分页', async () => {
                await both(async (root) => {
                  await expect(root.getByRole('switch')).toHaveCount(14);
                  for (const [index] of dynamicLabels.entries()) {
                    const control = dynamicSwitch(root, locale, index);
                    await expect(control).toHaveJSProperty('checked', false);
                    // Loading, empty-content and expandable alone receive explicit
                    // false initially; all other controls retain omitted checked.
                    if ([6, 7, 10].includes(index))
                      await expect(control).toHaveAttribute('aria-checked', 'false');
                    else await expect(control).not.toHaveAttribute('aria-checked');
                  }
                  // Both tools are initially present despite their unchecked demonstration switches.
                  await expect(root.locator('.semi-table-column-sorter')).toHaveCount(2);
                  await expect(root.locator('.semi-table-column-filter')).toHaveCount(1);
                });
                // The pinned Dynamic snippet merges the requested sorter first,
                // then entire filter queries. A sorter query's empty filteredValue
                // makes that column controlled for filtering after its first click;
                // subsequent stale filter queries restore its ascending sortOrder.
                // Check both the emitted request and the settled result of all six
                // clicks, including repeated descending requests, without treating
                // this snippet's merge behavior as the table's normal sort cycle.
                for (const [column, dataIndex] of ['size', 'updateTime'].entries())
                  for (const [click, requestedOrder] of [
                    'ascend',
                    'descend',
                    'descend',
                  ].entries()) {
                    const filterColumns =
                      column === 0
                        ? click === 0
                          ? []
                          : ['size']
                        : click === 0
                          ? ['size']
                          : ['size', 'updateTime'];
                    const expectedKeys =
                      click === 0
                        ? ['0', '40', '1', '41', '2', '42', '3', '43']
                        : ['32', '33', '34', '35', '36', '37', '38', '39'];
                    await both(async (root) => {
                      const change = root.page().waitForEvent('console', {
                        predicate: (message) => message.text().startsWith('Table changed:'),
                      });
                      await root.locator('.semi-table-column-sorter').nth(column).click();
                      await expect(root.locator('.semi-spin-wrapper')).toHaveCount(1);
                      const message = await change;
                      const request = await message.args()[1]!.evaluate((value) => ({
                        sorter: {
                          dataIndex: value.sorter.dataIndex,
                          sortOrder: value.sorter.sortOrder,
                          filteredValue: value.sorter.filteredValue,
                        },
                        filters: value.filters.map(
                          (filter: {
                            dataIndex: string;
                            sortOrder: string;
                            filteredValue: unknown[];
                          }) => ({
                            dataIndex: filter.dataIndex,
                            sortOrder: filter.sortOrder,
                            filteredValue: filter.filteredValue,
                          }),
                        ),
                        changeType: value.extra.changeType,
                      }));
                      expect(request).toEqual({
                        sorter: { dataIndex, sortOrder: requestedOrder, filteredValue: [] },
                        filters: filterColumns.map((filterIndex) => ({
                          dataIndex: filterIndex,
                          sortOrder: 'ascend',
                          filteredValue: [],
                        })),
                        changeType: 'sorter',
                      });
                      await expectIdle(root);
                      for (const [sorterIndex, order] of [
                        'ascending',
                        column === 0 ? 'none' : 'ascending',
                      ].entries()) {
                        const sorter = root
                          .locator('.semi-table-column-sorter-wrapper')
                          .nth(sorterIndex);
                        await expect(sorter).toHaveAttribute(
                          'aria-label',
                          `Current sort order is ${order}`,
                        );
                        await expect(sorter.locator('.semi-table-column-sorter-up.on')).toHaveCount(
                          order === 'ascending' ? 1 : 0,
                        );
                        await expect(
                          sorter.locator('.semi-table-column-sorter-down.on'),
                        ).toHaveCount(0);
                      }
                      await expect
                        .poll(() =>
                          rows(root).evaluateAll((elements) =>
                            elements.map((element) => element.getAttribute('data-row-key')),
                          ),
                        )
                        .toEqual(expectedKeys);
                    });
                    await compare(
                      `controlled-sort-${dataIndex}-click-${click + 1}-request-${requestedOrder}-settled-ascending`,
                    );
                  }
                await filter('controlled-filter');
                await both(async (root) => {
                  await root.locator('.semi-page-next').click();
                  await expect(rows(root).first()).toContainText('4.fig');
                  await expectIdle(root);
                });
                await compare('controlled-next-page');
                await both(async (root) => {
                  await root.locator('.semi-page-prev').click();
                  await expect(rows(root).first()).toContainText('0.fig');
                  await expectIdle(root);
                });
                await compare('controlled-previous-page');
              });
              await test.step('标题、底部、表头显隐与固定行列', async () => {
                await toggle(2, true);
                await both(async (root) => {
                  await expect(root.locator('.semi-table-title')).toHaveText('This is title.');
                });
                await compare('title-on');
                await toggle(3, true);
                await both(async (root) => {
                  await expect(root.locator('.semi-table-footer')).toHaveText('This is footer.');
                });
                await compare('footer-on');
                await toggle(1, true);
                await both(async (root) => {
                  await expect(root.locator('.semi-table-thead')).toHaveCount(0);
                });
                await compare('header-hidden');
                await toggle(1, false);
                await toggle(0, true);
                await both(async (root) => {
                  await expect(root.locator('.semi-table-header')).toHaveCount(1);
                  await expect(root.locator('.semi-table-body')).toHaveCSS('max-height', '300px');
                });
                await compare('fixed-header');
                await toggle(4, true);
                await both(async (root) => {
                  await expect(root.locator('.semi-table-wrapper')).toHaveAttribute(
                    'data-column-fixed',
                    'true',
                  );
                });
                await compare('fixed-columns');
                await toggle(4, false);
                await toggle(0, false);
                await toggle(3, false);
                await toggle(2, false);
                await compare('layout-restored');
              });
              await test.step('选择列、受控展开与当前页全部展开', async () => {
                await toggle(5, true);
                await both(async (root) => {
                  await rows(root).first().locator('.semi-checkbox').click();
                  await expect(rows(root).first().locator('input[type="checkbox"]')).toBeChecked();
                });
                await compare('dynamic-row-selected');
                await toggle(10, true);
                await both(async (root) => {
                  await rows(root).first().locator('.semi-table-expand-icon').click();
                  await expect(root.locator('.semi-table-row-expand')).toHaveCount(1);
                  await expect(root.locator('.semi-table-row-expand p')).toHaveText('');
                });
                await compare('dynamic-row-expanded');
                await toggle(11, true);
                await both(async (root) => {
                  await expect(root.locator('.semi-table-row-expand')).toHaveCount(8);
                });
                await compare('dynamic-all-expanded');
                await toggle(11, false);
                await both(async (root) => {
                  await expect(root.locator('.semi-table-row-expand')).toHaveCount(0);
                });
                await compare('dynamic-all-collapsed');
                await toggle(10, false);
                await toggle(5, false);
                await compare('dynamic-selection-expansion-off');
              });
              await test.step('加载与空数据受控状态', async () => {
                await toggle(6, true);
                await both(async (root) => {
                  await expect(root.locator('.semi-spin-wrapper')).toBeVisible();
                });
                await compare('loading-on');
                await toggle(6, false);
                await both(expectIdle);
                await compare('loading-off');
                await toggle(7, true);
                await both(async (root) => {
                  await expect(rows(root)).toHaveCount(0);
                });
                await compare('empty-on');
                await toggle(7, false);
                await both(async (root) => {
                  await expect(rows(root)).toHaveCount(8);
                  await expectIdle(root);
                });
                await compare('empty-off');
              });
              await test.step('分页位置及None保留当前页数据', async () => {
                for (const [position, count] of [
                  ['Top', 1],
                  ['Both', 2],
                  ['None', 0],
                  ['Bottom', 1],
                ] as const) {
                  await both(async (root) => {
                    await root.getByRole('button', { name: position, exact: true }).click();
                    await expect(root.locator('.semi-page')).toHaveCount(count);
                    await expect(rows(root)).toHaveCount(8);
                    const positions = await root.evaluate((element) => {
                      const table = element.querySelector('.semi-table-container')!;
                      return [...element.querySelectorAll('.semi-table-pagination-outer')].map(
                        (pagination) =>
                          table.compareDocumentPosition(pagination) &
                          Node.DOCUMENT_POSITION_PRECEDING
                            ? 'top'
                            : 'bottom',
                      );
                    });
                    expect(positions).toEqual(
                      position === 'Both'
                        ? ['top', 'bottom']
                        : position === 'None'
                          ? []
                          : [position.toLowerCase()],
                    );
                  });
                  await compare('pagination-' + position.toLowerCase());
                }
              });
              await test.step('边框和列伸缩受控开关', async () => {
                const expectControlledAscending = async (root: Locator) => {
                  const sorters = root.locator('.semi-table-column-sorter-wrapper');
                  await expect(sorters).toHaveCount(2);
                  for (const column of [0, 1]) {
                    const sorter = sorters.nth(column);
                    await expect(sorter).toHaveAttribute(
                      'aria-label',
                      'Current sort order is ascending',
                    );
                    await expect(sorter.locator('.semi-table-column-sorter-up.on')).toHaveCount(1);
                    await expect(sorter.locator('.semi-table-column-sorter-down.on')).toHaveCount(
                      0,
                    );
                  }
                };
                await toggle(12, true);
                await both(async (root) => {
                  await expect(root.locator('.semi-table-bordered')).toHaveCount(1);
                });
                await compare('border-on');
                await toggle(12, false);
                await toggle(13, true);
                await both(async (root) => {
                  await expect(dynamicSwitch(root, locale, 12)).toHaveAttribute(
                    'aria-checked',
                    'true',
                  );
                  await expect(root.locator('.react-resizable-handle').first()).toBeVisible();
                  // Both controlled ascending queries survive the six requests above;
                  // dragging a resize handle must preserve each column's actual order.
                  await expectControlledAscending(root);
                });
                await compare('resize-on');
                const resizedWidths: number[] = [];
                for (const [side, root] of roots.entries()) {
                  const handle = root.locator('.react-resizable-handle').first();
                  const cell = handle.locator('..');
                  const before = (await cell.boundingBox())!.width;
                  const box = await handle.boundingBox();
                  if (!box) throw new Error('dynamic resize handle has no layout box');
                  await pages[side]!.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
                  await pages[side]!.mouse.down();
                  await pages[side]!.mouse.move(
                    box.x + box.width / 2 + 40,
                    box.y + box.height / 2,
                    { steps: 5 },
                  );
                  await expect
                    .poll(async () => Math.abs((await cell.boundingBox())!.width - before))
                    .toBeGreaterThan(30);
                  resizedWidths.push((await cell.boundingBox())!.width);
                }
                await compare(
                  'dynamic-resize-dragging',
                  roots.map((root) => root.locator('.semi-table-wrapper')),
                );
                for (const page of pages) await page.mouse.up();
                await settle(pages);
                for (const [side, root] of roots.entries()) {
                  const width = (await root
                    .locator('.react-resizable-handle')
                    .first()
                    .locator('..')
                    .boundingBox())!.width;
                  expect(Math.abs(width - resizedWidths[side]!)).toBeLessThanOrEqual(0.5);
                  await expectControlledAscending(root);
                }
                await compare('dynamic-resized');
                await toggle(13, false);
                await both(async (root) => {
                  await expect(dynamicSwitch(root, locale, 12)).toHaveAttribute(
                    'aria-checked',
                    'false',
                  );
                  await expect(root.locator('.react-resizable-handle')).toHaveCount(0);
                });
                await compare('resize-off');
              });
              await test.step('固定基线筛选与排序开关语义', async () => {
                await toggle(9, true);
                await filter('dynamic-name-filter', '1');
                await toggle(9, false);
                await both(async (root) => {
                  await expect(root.locator('.semi-table-column-filter')).toHaveCount(0);
                  await expectIdle(root);
                });
                await compare('filter-disabled');
                await toggle(8, true);
                await both(async (root) => {
                  await expect(root.locator('.semi-table-column-sorter')).toHaveCount(2);
                });
                await compare('sort-switch-on-existing-columns');
                await toggle(8, false);
                await both(async (root) => {
                  await expect(root.locator('.semi-table-column-sorter')).toHaveCount(0);
                });
                await compare('sort-switch-off');
                await toggle(8, true);
                await both(async (root) => {
                  // Pinned callback only enables a missing "age" column; it cannot restore these sorters.
                  await expect(root.locator('.semi-table-column-sorter')).toHaveCount(0);
                });
                await compare('sort-switch-on-without-age-column');
              });
            }
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
                await expectInitial(actual, name);
                await action('在线编辑', 'Edit online').click();
                const editor = demo.frameLocator('iframe').locator('#app');
                await expect(editor.locator('.semi-table-wrapper')).toHaveCount(1, {
                  timeout: 30000,
                });
                await expectInitial(editor, name);
                const fixture =
                  isVirtual(name) || name === 'Dynamic'
                    ? 'third-batch-virtual-fixture.ts'
                    : 'third-batch-render-fixture.ts';
                await expect(demo.getByText(fixture, { exact: true })).toHaveCount(1);
                const edited = source.replace(
                  /<\/template>\s*$/,
                  '<p data-table-editor-proof>Edited table</p>\n</template>',
                );
                expect(edited).not.toBe(source);
                const code = demo.locator('.monaco-editor textarea.inputarea');
                await code.focus();
                await code.press('ControlOrMeta+A');
                await vue.keyboard.insertText(edited);
                await demo
                  .locator('.editor-actions')
                  .getByRole('button', {
                    name: locale === 'zh-cn' ? '运行' : 'Run',
                    exact: true,
                  })
                  .click();
                await expect(editor.locator('[data-table-editor-proof]')).toHaveText(
                  'Edited table',
                );
                await expectInitial(editor, name);
                if (name === 'Virtualized') {
                  await editor.getByRole('button', { name: 'Scroll to 100', exact: true }).click();
                  await expect(rows(editor).filter({ hasText: /100[.]fig/ })).toHaveCount(1);
                  await expectIdle(editor);
                } else if (name === 'InfiniteScroll') {
                  await scrollBody(editor, 400);
                  await expectVirtualTotal(editor, 40);
                } else if (name === 'Dynamic') {
                  await dynamicSwitch(editor, locale, 2).click();
                  await expect(editor.locator('.semi-table-title')).toHaveText('This is title.');
                  await editor.locator('.semi-page-next').click();
                  await expect(rows(editor).first()).toContainText('4.fig');
                  await expectIdle(editor);
                } else if (name === 'Span') {
                  await expectSpan(editor);
                  await editor.locator('.semi-table-column-sorter').click();
                  await expect(editor.locator('.semi-table-column-sorter-up.on')).toHaveCount(1);
                  await expectSpan(editor);
                } else {
                  await rows(editor).first().locator('.semi-checkbox').click();
                  await expect(
                    rows(editor).first().locator('input[type="checkbox"]'),
                  ).toBeChecked();
                  await rows(editor).first().locator('.semi-table-expand-icon').click();
                  await expect(editor.locator('.semi-table-row-expand article')).toContainText(
                    '0.fig',
                  );
                }
                await expect(demo.locator('.msg.err')).toHaveCount(0);
                await action('退出编辑', 'Close editor').click();
                await expect(demo.locator('iframe')).toHaveCount(0);
                await expectInitial(actual, name);
              });
            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'show/table',
                index,
                upstreamLocaleIndex: locale === 'zh-cn' ? index : index - 2,
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
