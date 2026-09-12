import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { freezeAnimations } from './demo-parity';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

test.use({ actionTimeout: 10_000 });

// ScrollLoad (7), Virtualized (8) and DragSort (9) are excluded from this batch: their pinned
// snippets depend on third-party React libraries the reference harness cannot render comparable to
// the documented Vue implementations (see batches/list.json `excludedExamples`).
// `block` is the pinned live-block number in both locales; it no longer matches the array position
// because the three excluded examples (blocks 7-9) are not part of this batch.
const examples: Array<{
  name: string;
  block: number;
  interaction?: 'load-more' | 'pagination' | 'filter' | 'add-remove' | 'selection' | 'keyboard';
}> = [
  { name: 'Basic', block: 1 },
  { name: 'Template', block: 2 },
  { name: 'Layout', block: 3 },
  { name: 'Grid', block: 4 },
  { name: 'Responsive', block: 5 },
  { name: 'LoadMore', block: 6, interaction: 'load-more' },
  { name: 'Pagination', block: 10, interaction: 'pagination' },
  { name: 'Filter', block: 11, interaction: 'filter' },
  { name: 'AddRemove', block: 12, interaction: 'add-remove' },
  { name: 'Selection', block: 13, interaction: 'selection' },
  { name: 'Keyboard', block: 14, interaction: 'keyboard' },
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
    for (const example of examples)
      for (const direction of ['ltr', 'rtl'])
        test(`List 文档 ${example.name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
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
              `http://127.0.0.1:4173/docs.html?component=list&locale=${locale}&theme=${theme}&example=${example.block}`,
            );
            const expected = reference.locator('#root');
            // Establish the reference independently before loading the Vue page.
            await expect(expected.locator('.semi-list')).not.toHaveCount(0);
            await vue.goto(`/${locale}/components/list/`);
            const demo = vue.locator(`[data-demo-id="list/${locale}/${example.name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual.locator('.semi-list')).toHaveCount(
              await expected.locator('.semi-list').count(),
            );
            await expect(actual).toBeVisible();
            const source = await readFile(
              new URL(`../../src/demos/list/${locale}/${example.name}.vue`, import.meta.url),
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

            const items = (root: Locator) => root.locator('.semi-list-item');
            // The pinned AddRemove snippet renders its own `.list-item` markup instead of List.Item, so
            // on both sides the rows are the direct children of `ul.semi-list-items`.
            const rows = (root: Locator) => root.locator('.semi-list-items > *');
            if (example.interaction === 'load-more')
              await test.step('点击加载更多追加一批数据', async () => {
                for (const root of [expected, actual]) {
                  const before = await items(root).count();
                  await root.getByRole('button', { name: /显示更多|Load More/ }).click();
                  await expect(items(root)).toHaveCount(before + 3, { timeout: 5_000 });
                }
                await compare('loaded-more');
              });

            if (example.interaction === 'pagination')
              await test.step('切换到第二页', async () => {
                for (const root of [expected, actual]) {
                  const first = await items(root).first().textContent();
                  await root.locator('.semi-page-next').first().click();
                  await expect(items(root).first()).not.toHaveText(first!);
                }
                await compare('page-2');
              });

            if (example.interaction === 'filter')
              await test.step('输入关键字筛选列表', async () => {
                for (const root of [expected, actual]) {
                  const first = (await items(root).first().textContent())!.trim();
                  const input = root.locator('input').first();
                  // The pinned snippet filters on composition end (its onChange only clears the
                  // filter), so drive the same documented path through the real events.
                  await input.dispatchEvent('compositionstart');
                  await input.fill(first);
                  await input.dispatchEvent('compositionend');
                  await expect(items(root)).toHaveCount(1);
                }
                await compare('filtered');
              });

            if (example.interaction === 'add-remove')
              await test.step('删除并新增书籍', async () => {
                for (const root of [expected, actual]) {
                  const before = await rows(root).count();
                  await rows(root).first().locator('.semi-button').first().click();
                  await expect(rows(root)).toHaveCount(before - 1);
                  await root.getByText(/新增书籍|Add book/, { exact: true }).click();
                  await expect(rows(root)).toHaveCount(before);
                }
                await compare('add-remove');
              });

            if (example.interaction === 'selection')
              await test.step('勾选第二个多选项', async () => {
                for (const root of [expected, actual]) {
                  const input = root.locator('input[type="checkbox"]').nth(1);
                  await root.locator('.semi-checkbox').nth(1).click();
                  await expect(input).toBeChecked();
                }
                await compare('selected');
              });

            if (example.interaction === 'keyboard')
              await test.step('方向键移动高亮项', async () => {
                for (const [root, page] of [
                  [expected, reference],
                  [actual, vue],
                ] as const) {
                  // The pinned snippet listens on window and has no focusable container, so a plain
                  // key press is the documented path on both sides.
                  await page.keyboard.press('ArrowDown');
                  await expect(
                    root.locator('.component-list-demo-booklist-active-item'),
                  ).toHaveCount(1);
                }
                await compare('keyboard-moved');
              });

            if (theme === 'light' && direction === 'ltr') {
              await test.step('源码、重置与在线编辑生命周期', async () => {
                const block = vue.locator(`[data-demo-id="list/${locale}/${example.name}"]`);
                const preview = block.locator('[data-demo-preview]');
                const action = (zh: string, en: string) =>
                  block.getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
                const lists = await preview.locator('.semi-list').count();
                await action('查看源码', 'View source').click();
                await expect(block.locator('[data-demo-source]')).toBeVisible();
                expect(await block.locator('[data-demo-source] code').textContent()).toBe(source);
                await action('查看源码', 'View source').click();
                await expect(block.locator('[data-demo-source]')).toBeHidden();
                await action('重置', 'Reset').click();
                await expect(preview.locator('.semi-list')).toHaveCount(lists);
                await action('在线编辑', 'Edit online').click();
                const editor = block.frameLocator('iframe').locator('#app');
                await expect(editor.locator('.semi-list')).toHaveCount(lists, {
                  timeout: 30_000,
                });
                await expect(block.locator('.msg.err')).toHaveCount(0);
                await action('退出编辑', 'Close editor').click();
                await expect(block.locator('iframe')).toHaveCount(0);
                await expect(preview.locator('.semi-list')).toHaveCount(lists);
              });
            }
            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'show/list',
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
