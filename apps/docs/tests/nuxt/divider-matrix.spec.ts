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
    ];
    return [...element.querySelectorAll('div, h3, span, svg, path')].map((node) => {
      const rect = node.getBoundingClientRect();
      const styles = (pseudo: string | null) => {
        const style = getComputedStyle(node, pseudo);
        return Object.fromEntries(properties.map((key) => [key, style.getPropertyValue(key)]));
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
        before: node.matches('.semi-divider') ? styles('::before') : null,
        after: node.matches('.semi-divider') ? styles('::after') : null,
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
    for (const [index, name] of ['Basic', 'WithContent'].entries())
      for (const direction of ['ltr', 'rtl'])
        test(`Divider 文档 ${name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
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
              `http://127.0.0.1:4173/docs.html?component=divider&locale=${locale}&theme=${theme}&example=${index + 1}`,
            );
            const expected = reference.locator('#root');
            // Establish the reference independently before loading the Vue page.
            await expect(expected.locator('.semi-divider')).toHaveCount(index === 0 ? 6 : 4);
            await vue.goto(`/${locale}/components/divider/`);
            const demo = vue.locator(`[data-demo-id="divider/${locale}/${name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual.locator('.semi-divider')).toHaveCount(index === 0 ? 6 : 4);
            await expect(actual).toBeVisible();
            const source = await readFile(
              new URL(`../../src/demos/divider/${locale}/${name}.vue`, import.meta.url),
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
            await test.step('结构、伪元素样式与几何', async () => {
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
            await test.step('示例与逐条分割线截图', async () => {
              const images = await Promise.all(
                [expected, actual].map((root) => root.locator(':scope > div').screenshot()),
              );
              for (const [i, label] of ['reference', 'vue'].entries())
                await info.attach(label, { body: images[i]!, contentType: 'image/png' });
              await expectScreenshotPixelsToMatch(vue, images[1]!, images[0]!, name);
              // Tight crops keep the thin line itself accountable instead of diluting it in whitespace.
              for (let i = 0; i < (index === 0 ? 6 : 4); i++) {
                const shots = await Promise.all(
                  [expected, actual].map(async (root) => {
                    const rect = await root.locator('.semi-divider').nth(i).boundingBox();
                    if (!rect) throw new Error('Missing divider');
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
                for (const [j, label] of ['reference', 'vue'].entries())
                  await info.attach(`divider-${i}-${label}`, {
                    body: shots[j]!,
                    contentType: 'image/png',
                  });
                await expectScreenshotPixelsToMatch(
                  vue,
                  shots[1]!,
                  shots[0]!,
                  `${name}/divider-${i}`,
                );
              }
            });
            for (const root of [expected, actual]) {
              await expect(
                root.locator('.semi-divider[tabindex], .semi-divider[role]'),
              ).toHaveCount(0);
              if (index === 0) {
                await expect(root.locator('.semi-divider-vertical')).toHaveCount(4);
                await expect(root.locator('.semi-divider-dashed')).toHaveCount(3);
              } else {
                await expect(root.locator('.semi-divider_inner-text')).toHaveCount(3);
                await expect(root.locator('.semi-icon-info_circle')).toHaveCount(1);
              }
            }
            if (theme === 'light' && direction === 'ltr') {
              await test.step('源码、重置与在线编辑生命周期', async () => {
                const content = (root: Locator) =>
                  root.locator('.semi-divider').evaluateAll((nodes) =>
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
                await expect(actual.locator('.semi-divider')).toHaveCount(index === 0 ? 6 : 4);
                expect(await content(actual)).toEqual(initialContent);
                await demo
                  .getByRole('button', {
                    name: locale === 'zh-cn' ? '在线编辑' : 'Edit online',
                    exact: true,
                  })
                  .click();
                const preview = demo.frameLocator('iframe').locator('#app');
                await expect(preview.locator('.semi-divider')).toHaveCount(index === 0 ? 6 : 4, {
                  timeout: 30_000,
                });
                expect(await content(preview)).toEqual(initialContent);
                await expect(demo.locator('.msg.err')).toHaveCount(0);
                await demo
                  .getByRole('button', {
                    name: locale === 'zh-cn' ? '退出编辑' : 'Close editor',
                    exact: true,
                  })
                  .click();
                await expect(demo.locator('iframe')).toHaveCount(0);
                await expect(actual.locator('.semi-divider')).toHaveCount(index === 0 ? 6 : 4);
              });
            }
            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'basic/divider',
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
