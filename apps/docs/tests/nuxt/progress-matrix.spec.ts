import { readFile } from 'node:fs/promises';
import { expect, test, type Locator } from '@playwright/test';
import { freezeAnimations } from './demo-parity';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

test.use({ actionTimeout: 10_000 });

async function measure(root: Locator) {
  return root.evaluate((element) => {
    const origin = element.getBoundingClientRect();
    const properties = [
      'display',
      'color',
      'background-color',
      'font-family',
      'font-size',
      'font-weight',
      'line-height',
      'direction',
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
      'fill',
      'stroke',
      'stroke-width',
      'stroke-linecap',
      'stroke-dasharray',
      'stroke-dashoffset',
    ];
    return [
      ...element.querySelectorAll(
        '.semi-progress, .semi-progress-circle, .semi-progress > *, .semi-progress-track, .semi-progress-track-inner, .semi-progress-line-text, .semi-progress-circle-text, .semi-progress-circle svg, .semi-progress-circle circle, .semi-progress-circle path, .semi-button, .semi-button-content, .semi-icon, .semi-icon svg, .semi-icon path',
      ),
    ].map((node) => {
      const rect = node.getBoundingClientRect();
      const styles = (pseudo: string | null) => {
        const style = getComputedStyle(node, pseudo);
        return Object.fromEntries(properties.map((key) => [key, style.getPropertyValue(key)]));
      };
      return {
        tag: node.tagName,
        classes: [...node.classList].filter((name) => name.startsWith('semi-')).sort(),
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
        tabindex: node.getAttribute('tabindex'),
        value: node.getAttribute('aria-valuenow'),
        min: node.getAttribute('aria-valuemin'),
        max: node.getAttribute('aria-valuemax'),
        disabled: node.hasAttribute('disabled'),
        path: node.getAttribute('d'),
        selected: node.getAttribute('aria-selected'),
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
    for (const [index, name] of [
      'Basic',
      'Percentage',
      'Vertical',
      'Circle',
      'CircleWidth',
      'SmallCircle',
      'DynamicLine',
      'DynamicCircle',
      'Format',
      'Linecap',
      'Stroke',
      'Gradient',
    ].entries())
      for (const direction of ['ltr', 'rtl'])
        test(`Progress 文档 ${name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
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
            if (name === 'Gradient') {
              for (const page of [reference, vue]) {
                await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
                await page.clock.pauseAt(new Date('2026-01-01T00:00:01Z'));
              }
            }
            await reference.goto(
              `http://127.0.0.1:4173/docs.html?component=progress&locale=${locale}&theme=${theme}&example=${index + 1}`,
            );
            const expected = reference.locator('#root');
            // Establish the reference independently before loading the Vue page.
            await expect(expected.getByRole('progressbar')).toHaveCount(
              [6, 4, 5, 4, 2, 4, 1, 1, 3, 2, 2, 3][index]!,
            );
            await vue.goto(`/${locale}/components/progress/`);
            if (name === 'Basic')
              await expect(
                vue.locator('table').filter({ hasText: 'useState + setPercent' }),
              ).toContainText(':percent');
            const demo = vue.locator(`[data-demo-id="progress/${locale}/${name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual.getByRole('progressbar')).toHaveCount(
              [6, 4, 5, 4, 2, 4, 1, 1, 3, 2, 2, 3][index]!,
            );
            await expect(actual).toBeVisible();
            const source = await readFile(
              new URL(`../../src/demos/progress/${locale}/${name}.vue`, import.meta.url),
              'utf8',
            );
            expect(await demo.locator('[data-demo-source] code').textContent()).toBe(source);
            const initialValues = await actual
              .getByRole('progressbar')
              .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('aria-valuenow')));
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
            const automaticSamples: number[] = [];
            const compare = async (state: string) => {
              await waitForVisualAssets([expected, actual]);
              await Promise.all([reference, vue].map((page) => page.mouse.move(1400, 880)));
              await freezeAnimations([reference, vue], 300);
              const [referenceNodes, vueNodes] = await Promise.all([
                measure(expected),
                measure(actual),
              ]);
              if (name === 'Gradient')
                automaticSamples.push(
                  Number(referenceNodes.find((node) => node.role === 'progressbar')!.value),
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
              for (let item = 0; item < (await actual.getByRole('progressbar').count()); item++) {
                const crops = await Promise.all(
                  [expected, actual].map((root) =>
                    root.getByRole('progressbar').nth(item).screenshot(),
                  ),
                );
                for (const [i, label] of ['reference', 'vue'].entries())
                  await info.attach(`${state}-progress-${item}-${label}`, {
                    body: crops[i]!,
                    contentType: 'image/png',
                  });
                await expectScreenshotPixelsToMatch(
                  vue,
                  crops[1]!,
                  crops[0]!,
                  `${state}-progress-${item}`,
                );
              }
            };
            await test.step('默认结构、样式、几何与截图', () => compare('default'));
            const dynamic = ['DynamicLine', 'DynamicCircle', 'Stroke', 'Gradient'].includes(name);
            if (dynamic) {
              await test.step('增减、边界禁用和键盘操作', async () => {
                const step = name === 'Gradient' ? 5 : 10;
                const initial = name === 'Gradient' ? 65 : name === 'Stroke' ? 10 : 40;
                const bar = (root: Locator) => root.getByRole('progressbar').last();
                const change = async (value: number, increase: boolean) => {
                  for (const root of [expected, actual]) {
                    await root
                      .getByRole('button')
                      .nth(increase ? 1 : 0)
                      .click();
                    if (name !== 'Gradient') {
                      await expect(bar(root)).toHaveAttribute('aria-valuenow', String(value));
                      const text = root.locator(
                        '.semi-progress-line-text, .semi-progress-circle-text',
                      );
                      if (await text.count())
                        await expect(text).toHaveText(Array(await text.count()).fill(`${value}%`));
                    }
                  }
                  if (name === 'Gradient') {
                    for (const page of [reference, vue]) await page.clock.runFor(600);
                    for (const root of [expected, actual])
                      await expect(root.locator('.semi-progress-line-text')).toHaveText(
                        `${value}%`,
                      );
                  }
                };
                await change(initial + step, true);
                await compare('increased');
                for (let value = initial; value >= 0; value -= step) await change(value, false);
                for (const root of [expected, actual])
                  await expect(root.getByRole('button').first()).toBeDisabled();
                await compare('minimum');
                for (let value = step; value <= 100; value += step) {
                  await change(value, true);
                  if (name === 'Stroke' && [20, 40, 60, 80].includes(value))
                    await compare(`color-stop-${value}`);
                  if (name === 'Gradient' && [25, 50, 75].includes(value))
                    await compare(`gradient-${value}`);
                }
                for (const root of [expected, actual])
                  await expect(root.getByRole('button').last()).toBeDisabled();
                await compare('maximum');
                for (const root of [expected, actual]) {
                  await root.getByRole('button').first().focus();
                  await root.getByRole('button').first().press('Enter');
                  if (name !== 'Gradient') {
                    await expect(bar(root)).toHaveAttribute('aria-valuenow', String(100 - step));
                    const text = root.locator(
                      '.semi-progress-line-text, .semi-progress-circle-text',
                    );
                    if (await text.count())
                      await expect(text).toHaveText(
                        Array(await text.count()).fill(`${100 - step}%`),
                      );
                  }
                }
                if (name === 'Gradient')
                  for (const page of [reference, vue]) await page.clock.runFor(600);
                await compare('keyboard-decreased');
              });
            }

            if (name === 'Gradient') {
              expect(Math.max(...automaticSamples)).toBe(100);
              expect(
                automaticSamples.some((value, i) => i > 0 && value < automaticSamples[i - 1]!),
              ).toBe(true);
            }
            if (theme === 'light' && direction === 'ltr') {
              await test.step('双语源码、重置和实际在线编辑', async () => {
                // The automatic example uses a separate real-clock page for Monaco.
                const editorPage = name === 'Gradient' ? await context.newPage() : vue;
                if (editorPage !== vue) {
                  editorPage.on('pageerror', (error) => errors.push(error.message));
                  editorPage.on('console', (message) => {
                    if (message.type() === 'error') errors.push(message.text());
                  });
                  await editorPage.goto(`/${locale}/components/progress/`);
                }
                const block = editorPage.locator(`[data-demo-id="progress/${locale}/${name}"]`);
                const preview = block.locator('[data-demo-preview]');
                const action = (zh: string, en: string) =>
                  block.getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
                const assertInitial = async (root: Locator) => {
                  await expect(root.getByRole('progressbar')).toHaveCount(initialValues.length);
                  if (name === 'Gradient') {
                    await expect(root.getByRole('progressbar').last()).toHaveAttribute(
                      'aria-valuenow',
                      '65',
                    );
                    await expect(root.locator('.semi-progress-circle')).toHaveCount(2);
                  } else {
                    await expect
                      .poll(() =>
                        root
                          .getByRole('progressbar')
                          .evaluateAll((nodes) =>
                            nodes.map((node) => node.getAttribute('aria-valuenow')),
                          ),
                      )
                      .toEqual(initialValues);
                  }
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
                await expect(editor.getByRole('progressbar')).toHaveCount(initialValues.length, {
                  timeout: 30_000,
                });
                await assertInitial(editor);
                await expect(block.locator('.msg.err')).toHaveCount(0);
                await action('退出编辑', 'Close editor').click();
                await expect(block.locator('iframe')).toHaveCount(0);
                await assertInitial(preview);
                if (editorPage !== vue) await editorPage.close();
              });
            }
            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'feedback/progress',
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
