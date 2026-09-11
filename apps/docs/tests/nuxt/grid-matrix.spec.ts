import { readFile } from 'node:fs/promises';
import { expect, test, type Locator } from '@playwright/test';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

test.use({ actionTimeout: 10_000 });

const names = ['Basic', 'Gutter', 'Offset', 'Flex', 'VerticalAlign', 'Order', 'Responsive'];
const columnCounts = [10, 16, 5, 20, 12, 4, 6];
const rowSelector = '.semi-row, .semi-row-flex';

async function measure(root: Locator) {
  return root.evaluate((element) => {
    const origin = element.getBoundingClientRect();
    const properties = [
      'display',
      'position',
      'float',
      'clear',
      'direction',
      'box-sizing',
      'width',
      'height',
      'min-height',
      'color',
      'background-color',
      'font-family',
      'font-size',
      'font-weight',
      'line-height',
      'text-align',
      'flex',
      'flex-direction',
      'flex-wrap',
      'justify-content',
      'align-items',
      'order',
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
      'outline-width',
      'outline-style',
      'outline-color',
      'content',
    ];
    return [...element.querySelectorAll('div, p, hr, br')].map((node) => {
      const rect = node.getBoundingClientRect();
      const styles = (pseudo: string | null) => {
        const style = getComputedStyle(node, pseudo);
        return Object.fromEntries(properties.map((key) => [key, style.getPropertyValue(key)]));
      };
      return {
        tag: node.tagName,
        classes: [...node.classList].sort(),
        text: node.textContent?.replace(/\s+/g, ' ').trim(),
        role: node.getAttribute('role'),
        label: node.getAttribute('aria-label'),
        tabindex: node.getAttribute('tabindex'),
        value: node.getAttribute('value'),
        styles: styles(null),
        before: node.matches('.semi-row, .semi-row-flex') ? styles('::before') : null,
        after: node.matches('.semi-row, .semi-row-flex') ? styles('::after') : null,
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

async function assertResponsive(root: Locator, width: number) {
  const rows = root.locator(rowSelector);
  const gutter = width >= 992 ? 24 : 16;
  await expect(rows.first()).toHaveCSS('margin-left', `${-gutter / 2}px`);
  await expect(rows.first().locator('.semi-col').first()).toHaveCSS(
    'padding-left',
    `${gutter / 2}px`,
  );
  const spans =
    width >= 1200
      ? [10, 4, 10]
      : width >= 992
        ? [8, 8, 8]
        : width >= 768
          ? [6, 12, 6]
          : width >= 576
            ? [4, 16, 4]
            : [2, 20, 2];
  for (const [index, row] of [rows.first(), rows.nth(1)].entries()) {
    const expectedSpans = index === 0 ? spans : width >= 992 ? [6, 6, 6] : [5, 11, 5];
    const layout = await row.evaluate((element) => ({
      width: element.getBoundingClientRect().width,
      columns: [...element.children].map((col) => ({
        width: col.getBoundingClientRect().width,
        offset: parseFloat(
          getComputedStyle(col).getPropertyValue(
            getComputedStyle(element).direction === 'rtl' ? 'margin-right' : 'margin-left',
          ),
        ),
      })),
    }));
    for (const [i, column] of layout.columns.entries()) {
      expect(
        Math.abs(column.width - (layout.width * expectedSpans[i]!) / 24),
        `row ${index} col ${i} width at ${width}`,
      ).toBeLessThanOrEqual(0.5);
      if (index === 1)
        expect(
          Math.abs(column.offset - (layout.width * (width >= 992 ? 2 : 1)) / 24),
          `col ${i} offset at ${width}`,
        ).toBeLessThanOrEqual(0.5);
    }
  }
}

for (const locale of ['zh-cn', 'en-us'])
  for (const theme of ['light', 'dark'])
    for (const [index, name] of names.entries())
      for (const direction of ['ltr', 'rtl'])
        test(`Grid 文档 ${name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
          browser,
        }, info) => {
          test.setTimeout(90_000);
          const context = await visualContext(browser, info, locale, theme, direction);
          try {
            const reference = await context.newPage(),
              vue = await context.newPage();
            const errors: string[] = [];
            for (const page of [reference, vue]) {
              page.on('pageerror', (error) => errors.push(error.message));
              page.on('console', (message) => {
                if (message.type() === 'error') errors.push(message.text());
              });
            }
            await vue.addInitScript((value) => {
              if (window === window.top) localStorage.setItem('semi-docs-theme', value);
            }, theme);
            await reference.goto(
              `http://127.0.0.1:4173/docs.html?component=grid&locale=${locale}&theme=${theme}&example=${index + 1}`,
            );
            const expected = reference.locator('#root');
            await expect(expected.locator('.semi-col')).toHaveCount(columnCounts[index]!);
            await vue.goto(`/${locale}/components/grid/`);
            const demo = vue.locator(`[data-demo-id="grid/${locale}/${name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual.locator('.semi-col')).toHaveCount(columnCounts[index]!);
            const source = await readFile(
              new URL(`../../src/demos/grid/${locale}/${name}.vue`, import.meta.url),
              'utf8',
            );
            expect(await demo.locator('[data-demo-source] code').textContent()).toBe(source);
            await waitForVisualAssets([expected, actual]);
            for (const root of [expected, actual])
              await root.evaluate((element, dir) => {
                (element as HTMLElement).dir = dir;
                element.classList.toggle('semi-rtl', dir === 'rtl');
              }, direction);

            async function align() {
              // The site's mobile sidebar slides out after a viewport change.
              // Let that real transition finish before sampling the unobscured grid.
              await vue.locator('#side-nav').evaluate(async (sidebar) => {
                await Promise.all(sidebar.getAnimations().map((animation) => animation.finished));
              });
              await actual.scrollIntoViewIfNeeded();
              const box = await actual.boundingBox();
              if (!box) throw new Error('Missing Grid preview');
              const { padding, overflow } = await actual.evaluate((element) => {
                const style = getComputedStyle(element);
                return { padding: style.padding, overflow: style.overflow };
              });
              const scroll = await vue.evaluate(() => ({
                y: scrollY,
                height: document.documentElement.scrollHeight,
              }));
              await expected.evaluate(
                (element, { box, scroll, padding, overflow }) => {
                  Object.assign((element as HTMLElement).style, {
                    boxSizing: 'border-box',
                    padding,
                    overflow,
                    width: `${box.width}px`,
                    position: 'relative',
                    left: `${box.x}px`,
                    top: `${box.y + scroll.y}px`,
                  });
                  document.body.style.minHeight = `${scroll.height}px`;
                  window.scrollTo(0, scroll.y);
                },
                { box, scroll, padding, overflow },
              );
              await Promise.all([reference, vue].map((page) => page.mouse.move(0, 0)));
            }

            async function compare(label: string) {
              await align();
              const [referenceNodes, vueNodes] = await Promise.all([
                measure(expected),
                measure(actual),
              ]);
              await info.attach(label === 'default' ? 'default-styles' : `${label}-styles`, {
                body: JSON.stringify({ expected: referenceNodes, actual: vueNodes }),
                contentType: 'application/json',
              });
              expect(vueNodes).toHaveLength(referenceNodes.length);
              for (const [i, node] of vueNodes.entries()) {
                const { rect: a, ...actualNode } = node;
                const { rect: b, ...expectedNode } = referenceNodes[i]!;
                expect(actualNode, `${label} node ${i}`).toEqual(expectedNode);
                for (const axis of ['x', 'y', 'width', 'height'] as const)
                  expect(
                    Math.abs(a[axis] - b[axis]),
                    `${label} node ${i} ${axis}`,
                  ).toBeLessThanOrEqual(0.5);
              }
              const images = await Promise.all([expected, actual].map((root) => root.screenshot()));
              for (const [i, side] of ['reference', 'vue'].entries())
                await info.attach(label === 'default' ? side : `${label}-${side}`, {
                  body: images[i]!,
                  contentType: 'image/png',
                });
              await expectScreenshotPixelsToMatch(vue, images[1]!, images[0]!, `${name}/${label}`);
              // Row crops include the one-pixel column outline and keep gaps/offsets accountable.
              for (let i = 0; i < (await expected.locator(rowSelector).count()); i++) {
                const shots = await Promise.all(
                  [expected, actual].map(async (root) => {
                    const rect = await root.locator(rowSelector).nth(i).boundingBox();
                    if (!rect) throw new Error('Missing Grid row');
                    return root.page().screenshot({
                      clip: {
                        x: rect.x - 1,
                        y: rect.y - 1,
                        width: rect.width + 2,
                        height: rect.height + 2,
                      },
                    });
                  }),
                );
                for (const [j, side] of ['reference', 'vue'].entries())
                  await info.attach(`${label}-row-${i}-${side}`, {
                    body: shots[j]!,
                    contentType: 'image/png',
                  });
                await expectScreenshotPixelsToMatch(
                  vue,
                  shots[1]!,
                  shots[0]!,
                  `${name}/${label}/row-${i}`,
                );
              }
            }

            await test.step('默认结构、样式、几何与局部像素', async () => {
              if (name === 'Responsive')
                for (const root of [expected, actual]) await assertResponsive(root, 1440);
              await compare('default');
            });
            for (const root of [expected, actual]) {
              await expect(
                root.locator(
                  '.semi-col[role], .semi-col[tabindex], .semi-row[role], .semi-row[tabindex], .semi-row-flex[role], .semi-row-flex[tabindex]',
                ),
              ).toHaveCount(0);
              if (name === 'Order') {
                await expect(root.locator('.col-content')).toHaveText([
                  'col-4',
                  'col-3',
                  'col-2',
                  'col-1',
                ]);
                const order = await root.locator('.semi-col').evaluateAll((cols) =>
                  cols
                    .map((col) => ({ text: col.textContent, x: col.getBoundingClientRect().x }))
                    .sort((a, b) => a.x - b.x)
                    .map((col) => col.text),
                );
                expect(order).toEqual(
                  direction === 'ltr'
                    ? ['col-1', 'col-2', 'col-3', 'col-4']
                    : ['col-4', 'col-3', 'col-2', 'col-1'],
                );
              }
              if (name === 'VerticalAlign')
                for (let i = 0; i < 3; i++) {
                  const row = root.locator(rowSelector).nth(i);
                  await expect(row).toHaveCSS('height', '50px');
                  const position = await row.evaluate(
                    (el) =>
                      el.firstElementChild!.getBoundingClientRect().top -
                      el.getBoundingClientRect().top,
                  );
                  expect(position).toBe([0, 10, 20][i]);
                }
              if (name === 'Gutter')
                for (let i = 0; i < 2; i++) {
                  const row = root.locator(rowSelector).nth(i);
                  await expect(row).toHaveCSS('margin-left', '-8px');
                  await expect(row.locator('.semi-col').first()).toHaveCSS(
                    'padding-top',
                    `${i === 0 ? 0 : 12}px`,
                  );
                  const lineGap = await row.evaluate(
                    (el) =>
                      el.children[4]!.getBoundingClientRect().top -
                      el.children[0]!.getBoundingClientRect().top,
                  );
                  expect(lineGap).toBe(i === 0 ? 30 : 54);
                }
            }

            const widths =
              name === 'Responsive'
                ? [390, 575, 576, 767, 768, 991, 992, 1199, 1200, 1599, 1600, 390, 1440]
                : [390, 1440];
            for (const [step, width] of widths.entries())
              await test.step(`真实视口变化 ${step}: ${width}px`, async () => {
                await Promise.all(
                  [reference, vue].map((page) => page.setViewportSize({ width, height: 900 })),
                );
                if (name === 'Responsive')
                  for (const root of [expected, actual]) await assertResponsive(root, width);
                await compare(`resize-${step}-${width}`);
              });

            if (theme === 'light' && direction === 'ltr')
              await test.step('源码、重置、实际编辑运行与关闭重开', async () => {
                const content = (root: Locator) =>
                  root.locator(`${rowSelector}, .semi-col, .col-content`).evaluateAll((nodes) =>
                    nodes.map((node) => ({
                      classes: [...node.classList].sort(),
                      text: node.textContent,
                      value: node.getAttribute('value'),
                    })),
                  );
                const initial = await content(actual);
                const button = (zh: string, en: string) =>
                  demo.getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
                await button('查看源码', 'View source').click();
                await expect(demo.locator('[data-demo-source]')).toBeVisible();
                await button('查看源码', 'View source').click();
                await expect(demo.locator('[data-demo-source]')).toBeHidden();
                await button('重置', 'Reset').click();
                await expect(actual.locator('.semi-col')).toHaveCount(columnCounts[index]!);
                expect(await content(actual)).toEqual(initial);
                await button('在线编辑', 'Edit online').click();
                const preview = demo.frameLocator('iframe').locator('#app');
                async function originalPreview() {
                  await expect(preview.locator('.semi-col')).toHaveCount(columnCounts[index]!, {
                    timeout: 30_000,
                  });
                  expect(await content(preview)).toEqual(initial);
                  await expect(preview.locator('.semi-col').first()).toHaveCSS(
                    'line-height',
                    '30px',
                  );
                  if (name === 'Responsive')
                    await assertResponsive(
                      preview,
                      await preview.evaluate((el) => el.ownerDocument.defaultView!.innerWidth),
                    );
                }
                await originalPreview();
                if (name === 'Basic' || name === 'Responsive') {
                  const edited =
                    name === 'Basic'
                      ? source.replace(':span="24"', ':span="12"')
                      : source.replace(
                          'xs: 16, sm: 16, md: 16, lg: 24, xl: 24, xxl: 24',
                          'xs: 32, sm: 32, md: 32, lg: 32, xl: 32, xxl: 32',
                        );
                  expect(edited).not.toBe(source);
                  const editor = demo.locator('.monaco-editor textarea.inputarea');
                  await editor.focus();
                  await editor.press('ControlOrMeta+A');
                  await vue.keyboard.insertText(edited);
                  await button('运行', 'Run').click();
                  if (name === 'Basic') {
                    await expect(preview.locator('.semi-col').first()).toHaveClass(
                      'semi-col semi-col-12',
                    );
                    const ratio = await preview
                      .locator(rowSelector)
                      .first()
                      .evaluate(
                        (el) =>
                          el.firstElementChild!.getBoundingClientRect().width /
                          el.getBoundingClientRect().width,
                      );
                    expect(ratio).toBeCloseTo(0.5, 2);
                  } else {
                    await expect(preview.locator(rowSelector).first()).toHaveCSS(
                      'margin-left',
                      '-16px',
                    );
                    await expect(preview.locator('.semi-col').first()).toHaveCSS(
                      'padding-left',
                      '16px',
                    );
                  }
                  await button('重置', 'Reset').click();
                  await originalPreview();
                }
                await expect(demo.locator('.msg.err')).toHaveCount(0);
                await button('退出编辑', 'Close editor').click();
                await expect(demo.locator('iframe')).toHaveCount(0);
                await expect(actual.locator('.semi-col')).toHaveCount(columnCounts[index]!);
                expect(await content(actual)).toEqual(initial);
                await button('在线编辑', 'Edit online').click();
                await originalPreview();
                await button('退出编辑', 'Close editor').click();
                await expect(demo.locator('iframe')).toHaveCount(0);
              });
            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'basic/grid',
                index: index + 1,
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
