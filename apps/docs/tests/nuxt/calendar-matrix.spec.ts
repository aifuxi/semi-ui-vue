import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

test.use({ actionTimeout: 10_000 });

// Calendar renders the default `displayValue` and the current-time line from the real clock.
// Both hosts run under the same fixed Date so the documented defaults stay deterministic.
const fixedTime = new Date('2024-08-15T10:24:30+08:00');
const views = '.semi-calendar-day, .semi-calendar-week, .semi-calendar-month';

// `radios`/`datePickers`/`avatars` count the sibling controls each example renders next to the view.
const examples: Array<{
  name: string;
  view: 'day' | 'week' | 'month';
  radios?: number;
  datePickers?: number;
  avatars?: number;
}> = [
  { name: 'Day', view: 'day' },
  { name: 'Week', view: 'week' },
  { name: 'Month', view: 'month' },
  { name: 'WeekStart', view: 'month', radios: 7 },
  { name: 'Range', view: 'week' },
  { name: 'Events', view: 'week', radios: 4, datePickers: 1 },
  { name: 'CustomEvents', view: 'week' },
  { name: 'CellStyle', view: 'month' },
  { name: 'DateDisplay', view: 'week', avatars: 7 },
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
      'grid-auto-flow',
      'column-gap',
      'row-gap',
      'border-radius',
      'border-collapse',
      'box-shadow',
      'transform',
      'transform-origin',
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
    // Generated ids (React getUuidShort, Vue useId) differ per instance. Resolve each id and
    // every id reference to the position of its definition inside this root, so a missing,
    // duplicated or reordered definition still fails while identical trees compare exactly.
    // `data-popupid` names a popup that is not mounted until it opens, and the trigger's
    // `aria-controls` points at it, so both carriers feed the same map.
    const idIndex = new Map<string, string>();
    for (const node of element.querySelectorAll('[id], [data-popupid]')) {
      for (const value of [node.getAttribute('id'), node.getAttribute('data-popupid')])
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
    const resolveId = (name: string, value: string) => {
      if (name === 'id' || name === 'data-popupid') return idIndex.get(value) ?? value;
      if (!idReferences.includes(name)) return value;
      return value
        .split(/\s+/)
        .map((token) => idIndex.get(token) ?? token)
        .join(' ');
    };
    // Every component node carries a `semi-` class; native controls and icon paths are matched
    // separately because their attributes (checked, name, path data) are part of the contract.
    return [...element.querySelectorAll('[class*="semi-"], input, svg path, br')].map((node) => {
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
            // embedded DatePicker still renders these explicitly; its own batch owns that form.
            .filter(
              (attribute) =>
                !(
                  ['aria-disabled', 'aria-invalid', 'aria-required'].includes(attribute.name) &&
                  attribute.value === 'false'
                ),
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

for (const locale of ['zh-cn', 'en-us'])
  for (const theme of ['light', 'dark'])
    for (const [index, example] of examples.entries())
      for (const direction of ['ltr', 'rtl'])
        test(`Calendar 文档 ${example.name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
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
            await Promise.all([reference, vue].map((page) => page.clock.setFixedTime(fixedTime)));
            await vue.addInitScript((value) => {
              if (window === window.top) localStorage.setItem('semi-docs-theme', value);
            }, theme);
            await reference.goto(
              `http://127.0.0.1:4173/docs.html?component=calendar&locale=${locale}&theme=${theme}&example=${index + 1}`,
            );
            const expected = reference.locator('#root');
            // Establish the reference independently before loading the Vue page.
            await expect(expected.locator(views)).toHaveCount(1);
            await expect(expected.locator(`.semi-calendar-${example.view}`)).toHaveCount(1);
            await vue.goto(`/${locale}/components/calendar/`);
            const demo = vue.locator(`[data-demo-id="calendar/${locale}/${example.name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual.locator(views)).toHaveCount(1);
            await expect(actual.locator(`.semi-calendar-${example.view}`)).toHaveCount(1);
            if (example.radios)
              await expect(actual.locator('.semi-radio')).toHaveCount(example.radios);
            if (example.datePickers)
              await expect(actual.locator('.semi-datepicker')).toHaveCount(example.datePickers);
            if (example.avatars)
              await expect(actual.locator('.semi-avatar')).toHaveCount(example.avatars);
            await expect(actual).toBeVisible();
            const source = await readFile(
              new URL(`../../src/demos/calendar/${locale}/${example.name}.vue`, import.meta.url),
              'utf8',
            );
            expect(await demo.locator('[data-demo-source] code').textContent()).toBe(source);
            await align(reference, expected, vue, actual, direction);
            const compare = async (prefixless: string) => {
              await waitForVisualAssets([expected, actual]);
              await Promise.all([reference, vue].map((page) => page.mouse.move(1400, 880)));
              const [referenceNodes, vueNodes] = await Promise.all([
                measure(expected),
                measure(actual),
              ]);
              await info.attach(`${prefixless}-styles`, {
                body: JSON.stringify({ expected: referenceNodes, actual: vueNodes }),
                contentType: 'application/json',
              });
              expect(vueNodes, `${prefixless} 节点数量`).toHaveLength(referenceNodes.length);
              for (const [i, node] of vueNodes.entries()) {
                const { rect: a, ...actualNode } = node;
                const { rect: b, ...expectedNode } = referenceNodes[i]!;
                expect(actualNode, `${prefixless} node ${i}`).toEqual(expectedNode);
                for (const axis of ['x', 'y', 'width', 'height'] as const)
                  expect(
                    Math.abs(a[axis] - b[axis]),
                    `${prefixless} node ${i} ${axis}`,
                  ).toBeLessThanOrEqual(0.5);
              }
              const images = await Promise.all([expected, actual].map((root) => root.screenshot()));
              for (const [i, label] of ['reference', 'vue'].entries())
                await info.attach(prefixless === 'default' ? label : `${prefixless}-${label}`, {
                  body: images[i]!,
                  contentType: 'image/png',
                });
              await expectScreenshotPixelsToMatch(vue, images[1]!, images[0]!, prefixless);
              // Tight crops keep the view and the sibling controls accountable on their own.
              const crops = [
                views,
                ...(example.datePickers ? ['.semi-datepicker'] : []),
                ...(example.radios ? ['.semi-radioGroup'] : []),
              ];
              for (const selector of crops)
                for (let item = 0; item < (await actual.locator(selector).count()); item++) {
                  const shots = await Promise.all(
                    [expected, actual].map((root) => root.locator(selector).nth(item).screenshot()),
                  );
                  for (const [i, label] of ['reference', 'vue'].entries())
                    await info.attach(`${prefixless}-${selector}-${item}-${label}`, {
                      body: shots[i]!,
                      contentType: 'image/png',
                    });
                  await expectScreenshotPixelsToMatch(
                    vue,
                    shots[1]!,
                    shots[0]!,
                    `${prefixless}-${selector}-${item}`,
                  );
                }
            };
            await test.step('默认结构、样式、几何与截图', () => compare('default'));

            if (example.name === 'WeekStart')
              await test.step('切换周起始日', async () => {
                const headers = (root: Locator) =>
                  root
                    .locator('.semi-calendar-month-grid-row')
                    .first()
                    .locator('[role="columnheader"]')
                    .first();
                const before = await headers(expected).textContent();
                for (const root of [expected, actual])
                  await root
                    .locator('.semi-radioGroup')
                    .getByText(locale === 'zh-cn' ? '周一' : 'Mon', { exact: true })
                    .click();
                for (const root of [expected, actual]) {
                  await expect(root.locator('.semi-radio').nth(1)).toHaveClass(
                    /semi-radio-checked/,
                  );
                  await expect(headers(root)).not.toHaveText(before!);
                }
                await compare('week-start-monday');
              });

            if (example.name === 'Events')
              await test.step('切换月视图与多日视图', async () => {
                const columnHeaders = (root: Locator) =>
                  root.locator('.semi-calendar-week-grid-row').first().locator('li');
                await expect(columnHeaders(expected)).toHaveCount(7);
                await expect(columnHeaders(actual)).toHaveCount(7);
                for (const root of [expected, actual])
                  await root
                    .locator('.semi-radioGroup')
                    .getByText(locale === 'zh-cn' ? '月视图' : 'Month view', { exact: true })
                    .click();
                for (const root of [expected, actual])
                  await expect(root.locator('.semi-calendar-month')).toHaveCount(1);
                await compare('month-mode');
                for (const root of [expected, actual])
                  await root
                    .locator('.semi-radioGroup')
                    .getByText(locale === 'zh-cn' ? '多日视图' : 'Multi-day view', { exact: true })
                    .click();
                for (const root of [expected, actual]) {
                  await expect(root.locator('.semi-calendar-month')).toHaveCount(0);
                  await expect(columnHeaders(root)).toHaveCount(3);
                }
                await compare('range-mode');
              });

            if (theme === 'light' && direction === 'ltr') {
              await test.step('源码、重置与在线编辑生命周期', async () => {
                const block = vue.locator(`[data-demo-id="calendar/${locale}/${example.name}"]`);
                const preview = block.locator('[data-demo-preview]');
                const action = (zh: string, en: string) =>
                  block.getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
                const assertInitial = async (root: Locator) => {
                  await expect(root.locator(views)).toHaveCount(1);
                  await expect(root.locator(`.semi-calendar-${example.view}`)).toHaveCount(1);
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
                await expect(editor.locator(views)).toHaveCount(1, { timeout: 30_000 });
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
                upstream: 'show/calendar',
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
