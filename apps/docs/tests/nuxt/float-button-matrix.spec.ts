import { readFile } from 'node:fs/promises';
import { expect, test, type Locator } from '@playwright/test';
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
      'fill',
      'background-image',
      'box-shadow',
      'border-radius',
      'cursor',
      'bottom',
      'inset-inline-end',
      'opacity',
      'gap',
    ];
    return [...element.querySelectorAll('div, span, svg, path')].map((node) => {
      const rect = node.getBoundingClientRect();
      const styles = (pseudo: string | null) => {
        const style = getComputedStyle(node, pseudo);
        return Object.fromEntries(
          properties.map((key) => {
            const value = style.getPropertyValue(key);
            const match = key === 'fill' ? /^url\("?#([^")]+)"?\)$/.exec(value) : null;
            if (!match) return [key, value];
            const definition = node.ownerDocument.getElementById(match[1]!);
            if (!definition) throw new Error(`Unresolved SVG paint: ${value}`);
            // Generated IDs differ across frameworks; compare the resolved paint definition.
            return [key, definition.outerHTML.replace(/ id="[^"]*"/g, '')];
          }),
        );
      };
      return {
        tag: node.tagName,
        classes: [...node.classList].filter((name) => name.startsWith('semi-')).sort(),
        text: node.textContent?.replace(/\s+/g, ' ').trim(),
        role: node.getAttribute('role'),
        hidden: node.getAttribute('aria-hidden'),
        label: node.getAttribute('aria-label'),
        tabindex: node.getAttribute('tabindex'),
        path: node.getAttribute('d'),
        styles: styles(null),
        before: null,
        after: null,
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
      'Size',
      'Shape',
      'Link',
      'Colorful',
      'Badge',
      'Group',
    ].entries())
      for (const direction of ['ltr', 'rtl'])
        test(`FloatButton 文档 ${name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
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
              `http://127.0.0.1:4173/docs.html?component=float-button&locale=${locale}&theme=${theme}&example=${index + 1}`,
            );
            const expected = reference.locator('#root');
            // Establish the reference independently before loading the Vue page.
            await expect(
              expected.locator(
                name === 'Group' ? '.semi-floatButtonGroup-item' : '.semi-floatButton',
              ),
            ).toHaveCount(name === 'Badge' ? 4 : name === 'Group' ? 3 : 1);
            await vue.goto(`/${locale}/components/float-button/`);
            const demo = vue.locator(`[data-demo-id="float-button/${locale}/${name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(
              actual.locator(
                name === 'Group' ? '.semi-floatButtonGroup-item' : '.semi-floatButton',
              ),
            ).toHaveCount(name === 'Badge' ? 4 : name === 'Group' ? 3 : 1);
            await expect(actual).toBeVisible();
            const source = await readFile(
              new URL(`../../src/demos/float-button/${locale}/${name}.vue`, import.meta.url),
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
            await test.step('结构、样式与几何', async () => {
              const [referenceNodes, vueNodes] = await Promise.all([
                measure(expected),
                measure(actual),
              ]);
              await info.attach('default-styles', {
                body: JSON.stringify({ expected: referenceNodes, actual: vueNodes }),
                contentType: 'application/json',
              });
              expect(vueNodes).toHaveLength(referenceNodes.length);
              for (const [i, node] of vueNodes.entries()) {
                const { rect: a, ...actualNode } = node;
                const { rect: b, ...expectedNode } = referenceNodes[i]!;
                expect(actualNode, `node ${i}`).toEqual(expectedNode);
                for (const axis of ['x', 'y', 'width', 'height'] as const)
                  expect(Math.abs(a[axis] - b[axis]), `node ${i} ${axis}`).toBeLessThanOrEqual(0.5);
              }
            });
            const targets = name === 'Group' ? '.semi-floatButtonGroup' : '.semi-floatButton';
            const controls = name === 'Group' ? '.semi-floatButtonGroup-item' : '.semi-floatButton';
            async function compareShots(label: string) {
              for (let i = 0; i < (await expected.locator(targets).count()); i++) {
                const shots = await Promise.all(
                  [expected, actual].map(async (root) => {
                    const rect = await root.locator(targets).nth(i).boundingBox();
                    if (!rect) throw new Error('Missing FloatButton');
                    return root.page().screenshot({
                      clip: {
                        x: rect.x - 16,
                        y: rect.y - 16,
                        width: rect.width + 32,
                        height: rect.height + 32,
                      },
                    });
                  }),
                );
                for (const [j, side] of ['reference', 'vue'].entries())
                  await info.attach(
                    label === 'default' && i === 0 ? side : `${label}-${i}-${side}`,
                    { body: shots[j]!, contentType: 'image/png' },
                  );
                await expectScreenshotPixelsToMatch(
                  vue,
                  shots[1]!,
                  shots[0]!,
                  `${name}/${label}/${i}`,
                );
              }
            }
            await compareShots('default');
            const logs: unknown[][][] = [[], []];
            for (const [i, page] of [reference, vue].entries())
              page.on('console', async (message) => {
                if (
                  message.text().includes('float button clicked') ||
                  message.text().includes('Clicked') ||
                  message.text().includes('点击了')
                )
                  logs[i]!.push(await Promise.all(message.args().map((arg) => arg.jsonValue())));
              });
            await context.route('https://semi.design/**', (route) =>
              route.fulfill({ contentType: 'text/html', body: '<title>navigation target</title>' }),
            );
            for (let i = 0; i < (await expected.locator(controls).count()); i++) {
              for (const root of [expected, actual]) await root.locator(controls).nth(i).hover();
              await compareShots(`hover-${i}`);
              for (const root of [expected, actual]) await root.page().mouse.down();
              await compareShots(`active-${i}`);
              for (const root of [expected, actual]) {
                if (name === 'Link' || name === 'Colorful') {
                  const popupPromise = root.page().waitForEvent('popup');
                  await root.page().mouse.up();
                  const popup = await popupPromise;
                  await popup.waitForLoadState();
                  expect(popup.url()).toBe('https://semi.design/');
                  await popup.close();
                } else await root.page().mouse.up();
              }
            }
            if (['Basic', 'Size', 'Shape'].includes(name)) {
              await expect.poll(() => logs.map((items) => items.length)).toEqual([1, 1]);
              expect(logs).toEqual([[['float button clicked']], [['float button clicked']]]);
            }
            if (name === 'Group') {
              for (const root of [expected, actual]) {
                for (let i = 0; i < 3; i++) {
                  await root
                    .locator(controls)
                    .nth(i)
                    .click({ position: { x: 3, y: 3 } });
                  await root.locator(controls).nth(i).locator('svg').click();
                }
              }
              await expect.poll(() => logs.map((items) => items.length)).toEqual([9, 9]);
              expect(logs[1]).toEqual(logs[0]);
              expect(logs[0]!.slice(3).map((args) => args[1])).toEqual([
                'editor',
                undefined,
                'search',
                undefined,
                'help',
                undefined,
              ]);
            }
            if (name === 'Badge') {
              expect(logs).toEqual([[], []]);
              for (const root of [expected, actual]) {
                await expect(root.locator('.semi-badge-count')).toHaveText(['999+', 'VIP']);
                await expect(root.locator('.semi-floatButton-disabled')).toHaveCount(1);
              }
            }
            for (const root of [expected, actual]) {
              await expect(root.locator(`${controls}[tabindex], ${controls}[role]`)).toHaveCount(0);
              await root.page().keyboard.press('Enter');
              await root.page().keyboard.press('Space');
              await root.page().mouse.move(1400, 880);
            }
            if (['Basic', 'Size', 'Shape'].includes(name))
              expect(logs.map((items) => items.length)).toEqual([1, 1]);
            if (theme === 'light' && direction === 'ltr') {
              await test.step('源码、重置与在线编辑生命周期', async () => {
                const content = (root: Locator) =>
                  root.locator(controls).evaluateAll((nodes) =>
                    nodes.map((node) => ({
                      class: node.className,
                      text: node.textContent,
                      style: node.getAttribute('style'),
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
                await expect(
                  actual.locator(
                    name === 'Group' ? '.semi-floatButtonGroup-item' : '.semi-floatButton',
                  ),
                ).toHaveCount(name === 'Badge' ? 4 : name === 'Group' ? 3 : 1);
                expect(await content(actual)).toEqual(initialContent);
                await demo
                  .getByRole('button', {
                    name: locale === 'zh-cn' ? '在线编辑' : 'Edit online',
                    exact: true,
                  })
                  .click();
                const preview = demo.frameLocator('iframe').locator('#app');
                await expect(preview.locator(controls)).toHaveCount(
                  name === 'Badge' ? 4 : name === 'Group' ? 3 : 1,
                  {
                    timeout: 30_000,
                  },
                );
                expect(await content(preview)).toEqual(initialContent);
                if (name === 'Basic') {
                  const editor = demo.locator('.monaco-editor textarea.inputarea');
                  await editor.focus();
                  await editor.press('ControlOrMeta+A');
                  await vue.keyboard.insertText(
                    source.replace('<FloatButton ', '<FloatButton size="large" '),
                  );
                  await demo
                    .getByRole('button', { name: locale === 'zh-cn' ? '运行' : 'Run', exact: true })
                    .click();
                  await expect(
                    preview.locator('.semi-floatButton.semi-floatButton-large'),
                  ).toHaveCount(1);
                  await expect(preview.locator('.semi-floatButton')).toHaveCSS('width', '40px');
                }
                await expect(demo.locator('.msg.err')).toHaveCount(0);
                await demo
                  .getByRole('button', {
                    name: locale === 'zh-cn' ? '退出编辑' : 'Close editor',
                    exact: true,
                  })
                  .click();
                await expect(demo.locator('iframe')).toHaveCount(0);
                await expect(
                  actual.locator(
                    name === 'Group' ? '.semi-floatButtonGroup-item' : '.semi-floatButton',
                  ),
                ).toHaveCount(name === 'Badge' ? 4 : name === 'Group' ? 3 : 1);
              });
            }
            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'basic/floatbutton',
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
