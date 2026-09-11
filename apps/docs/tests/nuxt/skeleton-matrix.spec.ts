import { readFile } from 'node:fs/promises';
import { expect, test, type Locator } from '@playwright/test';
import { freezeAnimations } from './demo-parity';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

test.use({ actionTimeout: 10_000 });

// Placeholder roots rendered while loading; the Basic example switches them off.
// Table runs LTR only: the pinned site has no ConfigProvider, so its `direction` is
// undefined and an RTL container would compare two different configurations rather
// than the documented default (see skeleton-acceptance.md).
const examples: Array<{ name: string; skeletons: number; rtl?: false }> = [
  { name: 'Basic', skeletons: 5 },
  { name: 'ImageTitle', skeletons: 1 },
  { name: 'Statistics', skeletons: 1 },
  { name: 'AvatarTitle', skeletons: 1 },
  { name: 'ParagraphButton', skeletons: 1 },
  { name: 'AvatarParagraph', skeletons: 1 },
  { name: 'Table', skeletons: 1, rtl: false },
  { name: 'Animation', skeletons: 1 },
];

async function measure(root: Locator) {
  return root.evaluate((element) => {
    const origin = element.getBoundingClientRect();
    const properties = [
      'display',
      'color',
      'background-color',
      'background-image',
      'background-position',
      'background-size',
      'font-family',
      'font-size',
      'font-weight',
      'line-height',
      'text-align',
      'direction',
      'opacity',
      'visibility',
      'overflow',
      'align-items',
      'justify-content',
      'border-radius',
      'outline-color',
      'outline-style',
      'outline-width',
      'box-shadow',
      'transform',
      'vertical-align',
      'box-sizing',
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
      'border-left-width',
      'border-left-style',
      'border-left-color',
      'border-right-width',
      'border-right-style',
      'border-right-color',
      'border-bottom-width',
      'border-bottom-style',
      'border-bottom-color',
      'position',
      'top',
      'width',
      'height',
      'content',
      'flex',
      'flex-direction',
      'flex-wrap',
      'column-gap',
      'row-gap',
      'list-style-type',
      'fill',
      'stroke',
      'stroke-width',
    ];
    return [
      ...element.querySelectorAll(
        '.semi-skeleton, .semi-skeleton *, .semi-avatar, .semi-button, .semi-button-content, .semi-switch, .semi-descriptions, .semi-descriptions *, .semi-table, .semi-table *',
      ),
    ].map((node) => {
      const rect = node.getBoundingClientRect();
      const styles = (pseudo: string | null) => {
        const style = getComputedStyle(node, pseudo);
        return Object.fromEntries(properties.map((key) => [key, style.getPropertyValue(key)]));
      };
      return {
        tag: node.tagName,
        // The pinned site provides no ConfigProvider, so the React Table renders the
        // literal `semi-table-wrapper-undefined` while the documented Vue Table
        // normalizes a missing direction to `ltr` (`-wrapper-ltr`). Both are the same
        // effective direction in the authored LTR page, so map the React artifact to
        // the Vue class here; a real ltr/rtl class mismatch still fails.
        classes: [...node.classList]
          .filter((name) => name.startsWith('semi-'))
          .map((name) =>
            name === 'semi-table-wrapper-undefined' ? 'semi-table-wrapper-ltr' : name,
          )
          .sort(),
        // Flex child whitespace is collapsed independently; do not concatenate across boxes.
        text: (() => {
          const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
          const parts: string[] = [];
          while (walker.nextNode()) {
            const text = walker.currentNode.textContent?.replace(/\s+/g, ' ').trim();
            if (text) parts.push(text);
          }
          return parts;
        })(),
        role: node.getAttribute('role'),
        hidden: node.getAttribute('aria-hidden'),
        label: node.getAttribute('aria-label'),
        checked: node.getAttribute('aria-checked'),
        tabindex: node.getAttribute('tabindex'),
        disabled: node.hasAttribute('disabled'),
        colspan: node.getAttribute('colspan'),
        styles: styles(null),
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

for (const locale of ['zh-cn', 'en-us'])
  for (const theme of ['light', 'dark'])
    for (const [index, { name, skeletons, rtl }] of examples.entries())
      for (const direction of rtl === false ? ['ltr'] : ['ltr', 'rtl'])
        test(`Skeleton 文档 ${name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
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
              `http://127.0.0.1:4173/docs.html?component=skeleton&locale=${locale}&theme=${theme}&example=${index + 1}`,
            );
            const expected = reference.locator('#root');
            // Establish the reference independently before loading the Vue page.
            await expect(expected.locator('.semi-skeleton')).toHaveCount(skeletons);
            await vue.goto(`/${locale}/components/skeleton/`);
            const demo = vue.locator(`[data-demo-id="skeleton/${locale}/${name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual.locator('.semi-skeleton')).toHaveCount(skeletons);
            await expect(actual).toBeVisible();
            const source = await readFile(
              new URL(`../../src/demos/skeleton/${locale}/${name}.vue`, import.meta.url),
              'utf8',
            );
            expect(await demo.locator('[data-demo-source] code').textContent()).toBe(source);
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
            const scroll = await vue.evaluate(() => ({
              y: scrollY,
              height: document.documentElement.scrollHeight,
            }));
            await reference.evaluate(({ y, height }) => {
              document.body.style.minHeight = `${height}px`;
              const root = document.getElementById('root')!;
              root.style.top = `${parseFloat(root.style.top) + y}px`;
              window.scrollTo(0, y);
            }, scroll);
            await Promise.all([reference, vue].map((page) => page.mouse.move(1400, 880)));
            const animationPositions: Record<string, string[]> = {};
            const compare = async (state: string, animationTime = 300) => {
              await waitForVisualAssets([expected, actual]);
              await Promise.all([reference, vue].map((page) => page.mouse.move(1400, 880)));
              await freezeAnimations([reference, vue], animationTime);
              const [referenceNodes, vueNodes] = await Promise.all([
                measure(expected),
                measure(actual),
              ]);
              if (name === 'Animation')
                animationPositions[state] = await Promise.all(
                  [expected, actual].map((root) =>
                    root
                      .locator('.semi-skeleton-title')
                      .first()
                      .evaluate((node) => getComputedStyle(node).backgroundPosition),
                  ),
                );
              await info.attach(`${state}-styles`, {
                body: JSON.stringify({ expected: referenceNodes, actual: vueNodes }),
                contentType: 'application/json',
              });
              expect(vueNodes).toHaveLength(referenceNodes.length);
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
              const crops =
                name === 'Table' ? ['.semi-skeleton', '.semi-table'] : ['.semi-skeleton'];
              for (const selector of crops)
                for (let item = 0; item < (await actual.locator(selector).count()); item++) {
                  const captured = await Promise.all(
                    [expected, actual].map((root) => root.locator(selector).nth(item).screenshot()),
                  );
                  for (const [i, label] of ['reference', 'vue'].entries())
                    await info.attach(`${state}-${selector.slice(1)}-${item}-${label}`, {
                      body: captured[i]!,
                      contentType: 'image/png',
                    });
                  await expectScreenshotPixelsToMatch(
                    vue,
                    captured[1]!,
                    captured[0]!,
                    `${state}-${selector.slice(1)}-${item}`,
                  );
                }
            };
            await test.step('默认结构、样式、几何与截图', () => compare('default'));
            if (name === 'Basic')
              await test.step('开关切换占位与内容', async () => {
                const toggle = async () => {
                  for (const root of [expected, actual]) await root.getByRole('switch').click();
                };
                await toggle();
                for (const root of [expected, actual]) {
                  await expect(root.locator('.semi-skeleton')).toHaveCount(0);
                  await expect(root.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
                  await expect(root.locator('.semi-avatar')).toHaveCount(1);
                  await expect(root.locator('.semi-button')).toHaveCount(1);
                }
                await compare('content');
                await toggle();
                for (const root of [expected, actual]) {
                  await expect(root.locator('.semi-skeleton')).toHaveCount(skeletons);
                  await expect(root.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
                }
                await compare('loading-restored');
              });
            if (name === 'Animation')
              await test.step('高亮动画相位采样', async () => {
                await compare('animated', 1_000);
                const animated = animationPositions['animated']!;
                // The frozen phase must differ from 300ms and stay paired across runtimes.
                expect(animated[0]).not.toBe(animationPositions['default']![0]);
                expect(animated[1]).toBe(animated[0]);
              });
            if (theme === 'light' && direction === 'ltr') {
              await test.step('双语源码、重置和实际在线编辑', async () => {
                const block = vue.locator(`[data-demo-id="skeleton/${locale}/${name}"]`);
                const preview = block.locator('[data-demo-preview]');
                const action = (zh: string, en: string) =>
                  block.getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
                const assertInitial = async (root: Locator) => {
                  await expect(root.locator('.semi-skeleton')).toHaveCount(skeletons);
                  await expect(root.locator('.semi-switch')).toHaveCount(name === 'Basic' ? 1 : 0);
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
                await expect(editor.locator('.semi-skeleton')).toHaveCount(skeletons, {
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
                upstream: 'feedback/skeleton',
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
