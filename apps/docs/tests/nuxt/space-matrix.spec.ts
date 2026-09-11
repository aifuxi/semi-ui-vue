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
    ];
    return [
      ...element.querySelectorAll(
        '.semi-space, .semi-space > *, .semi-button-content, .semi-tag-content, .semi-switch-knob, .semi-switch-native-control, .semi-tabs-tab',
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
        checked: node.getAttribute('aria-checked'),
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
    for (const [index, name] of ['Basic', 'Alignment', 'Spacing', 'Vertical', 'Wrap'].entries())
      for (const direction of ['ltr', 'rtl'])
        test(`Space 文档 ${name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
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
              `http://127.0.0.1:4173/docs.html?component=space&locale=${locale}&theme=${theme}&example=${index + 1}`,
            );
            const expected = reference.locator('#root');
            // Establish the reference independently before loading the Vue page.
            await expect(expected.locator('.semi-space')).toHaveCount(
              index === 1 ? 5 : index === 2 ? 4 : 1,
            );
            await vue.goto(`/${locale}/components/space/`);
            const demo = vue.locator(`[data-demo-id="space/${locale}/${name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual.locator('.semi-space')).toHaveCount(
              index === 1 ? 5 : index === 2 ? 4 : 1,
            );
            await expect(actual).toBeVisible();
            const source = await readFile(
              new URL(`../../src/demos/space/${locale}/${name}.vue`, import.meta.url),
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
            const compare = async (state: string) => {
              await waitForVisualAssets([expected, actual]);
              await Promise.all([reference, vue].map((page) => page.mouse.move(1400, 880)));
              await freezeAnimations([reference, vue], 300);
              const [referenceNodes, vueNodes] = await Promise.all([
                measure(expected),
                measure(actual),
              ]);
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
              const images = await Promise.all(
                [expected, actual].map((root) => root.locator(':scope > div').screenshot()),
              );
              for (const [i, label] of ['reference', 'vue'].entries())
                await info.attach(state === 'default' ? label : `${state}-${label}`, {
                  body: images[i]!,
                  contentType: 'image/png',
                });
              await expectScreenshotPixelsToMatch(vue, images[1]!, images[0]!, state);
              if (name === 'Spacing') {
                const spaces = await Promise.all(
                  [expected, actual].map((root) =>
                    root.locator('.semi-space:visible').screenshot(),
                  ),
                );
                for (const [i, label] of ['reference', 'vue'].entries())
                  await info.attach(`${state}-space-${label}`, {
                    body: spaces[i]!,
                    contentType: 'image/png',
                  });
                await expectScreenshotPixelsToMatch(vue, spaces[1]!, spaces[0]!, `${state}-space`);
              }
            };
            await test.step('默认结构、样式、几何与截图', () => compare('default'));
            if (name === 'Basic') {
              await test.step('开关点击、键盘与阅读顺序', async () => {
                for (const root of [expected, actual]) {
                  const toggle = root.getByRole('switch');
                  await expect(toggle).toBeChecked();
                  await toggle.click();
                  await expect(toggle).not.toBeChecked();
                }
                await compare('unchecked');
                for (const root of [expected, actual]) {
                  const toggle = root.getByRole('switch');
                  await toggle.focus();
                  await toggle.press('Space');
                  await expect(toggle).toBeChecked();
                  await toggle.press('Tab');
                  await expect(root.locator('button').first()).toBeFocused();
                }
                await compare('keyboard-restored');
              });
            }
            if (name === 'Spacing') {
              await test.step('四档间距与切换返回', async () => {
                for (const [tab, gap] of [
                  ['medium', '16px'],
                  ['loose', '24px'],
                  ['array', '8px'],
                  ['tight', '8px'],
                ]) {
                  for (const root of [expected, actual]) {
                    await root.getByRole('tab', { name: tab, exact: true }).click();
                    await expect(root.getByRole('tab', { name: tab, exact: true })).toHaveAttribute(
                      'aria-selected',
                      'true',
                    );
                    await expect(root.locator('.semi-space:visible')).toHaveCSS('column-gap', gap!);
                    await expect(root.locator('.semi-space:visible')).toHaveCSS(
                      'row-gap',
                      tab === 'array' ? '16px' : gap!,
                    );
                  }
                  await compare(`spacing-${tab}`);
                }
              });
            }
            if (name === 'Wrap' || name === 'Spacing') {
              await test.step('受限宽度下真实换行', async () => {
                for (const root of [expected, actual]) {
                  if (name === 'Spacing')
                    await root.getByRole('tab', { name: 'array', exact: true }).click();
                  await root.locator('.semi-space:visible').evaluate((element) => {
                    (element as HTMLElement).style.width = '240px';
                  });
                  const rows = await root
                    .locator('.semi-space:visible > button')
                    .evaluateAll(
                      (nodes) => new Set(nodes.map((node) => node.getBoundingClientRect().y)).size,
                    );
                  expect(rows).toBeGreaterThan(1);
                }
                await compare('wrapped-240px');
                for (const root of [expected, actual]) {
                  await root.locator('.semi-space:visible').evaluate((element) => {
                    (element as HTMLElement).style.removeProperty('width');
                  });
                  if (name === 'Spacing')
                    await root.getByRole('tab', { name: 'tight', exact: true }).click();
                }
              });
            }
            if (theme === 'light' && direction === 'ltr') {
              await test.step('源码、重置与在线编辑生命周期', async () => {
                const content = (root: Locator) =>
                  root.locator('.semi-space').evaluateAll((nodes) =>
                    nodes.map((node) => ({
                      class: node.className,
                      text: node.textContent,
                      style: (node as HTMLElement).style.cssText,
                    })),
                  );
                const initialContent = await content(actual);
                await demo
                  .getByRole('button', {
                    name: locale === 'zh-cn' ? '查看源码' : 'View source',
                    exact: true,
                  })
                  .click();
                await expect(demo.locator('[data-demo-source]')).toBeVisible();
                await demo
                  .getByRole('button', {
                    name: locale === 'zh-cn' ? '查看源码' : 'View source',
                    exact: true,
                  })
                  .click();
                await expect(demo.locator('[data-demo-source]')).toBeHidden();
                await demo
                  .getByRole('button', {
                    name: locale === 'zh-cn' ? '重置' : 'Reset',
                    exact: true,
                  })
                  .click();
                await expect(actual.locator('.semi-space')).toHaveCount(
                  index === 1 ? 5 : index === 2 ? 4 : 1,
                );
                expect(await content(actual)).toEqual(initialContent);
                await demo
                  .getByRole('button', {
                    name: locale === 'zh-cn' ? '在线编辑' : 'Edit online',
                    exact: true,
                  })
                  .click();
                const preview = demo.frameLocator('iframe').locator('#app');
                await expect(preview.locator('.semi-space')).toHaveCount(
                  index === 1 ? 5 : index === 2 ? 4 : 1,
                  {
                    timeout: 30_000,
                  },
                );
                expect(await content(preview)).toEqual(initialContent);
                await expect(demo.locator('.msg.err')).toHaveCount(0);
                await demo
                  .getByRole('button', {
                    name: locale === 'zh-cn' ? '退出编辑' : 'Close editor',
                    exact: true,
                  })
                  .click();
                await expect(demo.locator('iframe')).toHaveCount(0);
                await expect(actual.locator('.semi-space')).toHaveCount(
                  index === 1 ? 5 : index === 2 ? 4 : 1,
                );
              });
            }
            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'basic/space',
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
