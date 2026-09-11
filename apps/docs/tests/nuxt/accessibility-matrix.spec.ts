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
      'border-radius',
      'object-fit',
      'overflow',
      'flex',
      'fill',
    ];
    return [...element.querySelectorAll('div, span, img')].map((node) => {
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
        alt: node.getAttribute('alt'),
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
    for (const direction of ['ltr', 'rtl'])
      test(`Accessibility 文档 ImageAlt ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
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
            `http://127.0.0.1:4173/docs.html?component=accessibility&locale=${locale}&theme=${theme}&example=1`,
          );
          const expected = reference.locator('#root');
          await expect(
            expected.getByRole('img', { name: 'Person Name', exact: true }),
          ).toBeVisible();
          await vue.goto(`/${locale}/experience/accessibility/`);
          const demo = vue.locator(`[data-demo-id="guides/accessibility/${locale}/ImageAlt"]`);
          const actual = demo.locator('[data-demo-preview]');
          await expect(actual.getByRole('img', { name: 'Person Name', exact: true })).toBeVisible();
          const source = await readFile(
            new URL(`../../src/demos/guides/accessibility/${locale}/ImageAlt.vue`, import.meta.url),
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
          const scroll = await vue.evaluate(() => ({
            y: scrollY,
            height: document.documentElement.scrollHeight,
          }));
          await expected.evaluate(
            (element, { box, scroll }) => {
              Object.assign((element as HTMLElement).style, {
                boxSizing: 'border-box',
                padding: '24px',
                width: `${box!.width}px`,
                position: 'relative',
                left: `${box!.x}px`,
                top: `${box!.y + scroll.y}px`,
              });
              document.body.style.minHeight = `${scroll.height}px`;
              window.scrollTo(0, scroll.y);
            },
            { box, scroll },
          );
          await test.step('图片解码、可访问名称及非交互语义', async () => {
            for (const root of [expected, actual]) {
              const img = root.getByRole('img', { name: 'Person Name', exact: true });
              await expect(img).toHaveCount(1);
              const image = await img.evaluate((node) => ({
                complete: (node as HTMLImageElement).complete,
                width: (node as HTMLImageElement).naturalWidth,
                src: new URL((node as HTMLImageElement).src).pathname,
                tabIndex: (node as HTMLElement).tabIndex,
              }));
              expect(image.complete).toBe(true);
              expect(image.width).toBeGreaterThan(0);
              expect(image.src).toBe('/demos/photo.svg');
              expect(image.tabIndex).toBe(-1);
              await expect(root.getByRole('button')).toHaveCount(0);
            }
            expect(await actual.ariaSnapshot()).toBe(await expected.ariaSnapshot());
          });
          await test.step('样式、几何与完整头像局部截图', async () => {
            const [a, b] = await Promise.all([measure(expected), measure(actual)]);
            await info.attach('default-styles', {
              body: JSON.stringify({ expected: a, actual: b }),
              contentType: 'application/json',
            });
            expect(b).toHaveLength(a.length);
            for (const [i, node] of b.entries()) {
              const { rect: actualRect, ...actualNode } = node;
              const { rect: expectedRect, ...expectedNode } = a[i]!;
              expect(actualNode).toEqual(expectedNode);
              for (const axis of ['x', 'y', 'width', 'height'] as const)
                expect(Math.abs(actualRect[axis] - expectedRect[axis])).toBeLessThanOrEqual(0.5);
            }
            for (const target of [':scope > div', '.semi-avatar']) {
              const shots = await Promise.all(
                [expected, actual].map((root) => root.locator(target).screenshot()),
              );
              for (const [i, side] of ['reference', 'vue'].entries())
                await info.attach(target === '.semi-avatar' ? `avatar-${side}` : side, {
                  body: shots[i]!,
                  contentType: 'image/png',
                });
              await expectScreenshotPixelsToMatch(vue, shots[1]!, shots[0]!, target);
            }
          });
          await test.step('Tab 顺序不引入非交互头像焦点', async () => {
            for (const root of [expected, actual]) {
              await root.evaluate((element) => {
                for (const side of ['before', 'after']) {
                  const button = document.createElement('button');
                  button.textContent = side;
                  button.dataset.focusSentinel = side;
                  if (side === 'before') element.prepend(button);
                  else element.append(button);
                }
              });
              const before = root.locator('[data-focus-sentinel="before"]'),
                after = root.locator('[data-focus-sentinel="after"]');
              await before.focus();
              await before.press('Tab');
              await expect(after).toBeFocused();
              await after.press('Shift+Tab');
              await expect(before).toBeFocused();
              await root
                .locator('[data-focus-sentinel]')
                .evaluateAll((nodes) => nodes.forEach((node) => node.remove()));
            }
          });
          if (theme === 'light' && direction === 'ltr')
            await test.step('源码、重置及真实编辑器生命周期', async () => {
              const button = (zh: string, en: string) =>
                demo.getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
              await button('查看源码', 'View source').click();
              await expect(demo.locator('[data-demo-source]')).toBeVisible();
              await button('查看源码', 'View source').click();
              await expect(demo.locator('[data-demo-source]')).toBeHidden();
              await button('重置', 'Reset').click();
              await waitForVisualAssets([actual]);
              await expect(actual.getByRole('img', { name: 'Person Name' })).toBeVisible();
              await button('在线编辑', 'Edit online').click();
              const preview = demo.frameLocator('iframe').locator('#app');
              await expect(preview.getByRole('img', { name: 'Person Name' })).toBeVisible({
                timeout: 30_000,
              });
              const editorImage = preview.locator('img');
              await editorImage.evaluate((node) => (node as HTMLImageElement).decode());
              expect(
                await editorImage.evaluate((node) => (node as HTMLImageElement).naturalWidth),
              ).toBeGreaterThan(0);
              await expect(demo.locator('.msg.err')).toHaveCount(0);
              await button('退出编辑', 'Close editor').click();
              await expect(demo.locator('iframe')).toHaveCount(0);
              await expect(actual.getByRole('img', { name: 'Person Name' })).toBeVisible();
            });
          expect(errors).toEqual([]);
          await info.attach('acceptance', {
            body: JSON.stringify({
              upstream: 'experience/accessibility',
              index: 1,
              name: 'ImageAlt',
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
