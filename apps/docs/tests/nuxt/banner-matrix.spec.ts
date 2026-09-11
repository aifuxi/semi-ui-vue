import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type TestInfo } from '@playwright/test';
import { visualContext, waitForVisualAssets } from './visual-context';
import { freezeAnimations } from './demo-parity';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

test.use({ actionTimeout: 10_000 });
const examples = ['Basic', 'Types', 'Container', 'Custom'];
const counts = [0, 4, 4, 1];

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
      'vertical-align',
      'box-sizing',
      'white-space',
      'word-break',
      'overflow-wrap',
      'overflow',
      'text-overflow',
      '-webkit-line-clamp',
      'text-decoration-line',
      'cursor',
      'user-select',
      'align-items',
      'justify-content',
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
      'border-radius',
      'outline-color',
      'outline-style',
      'outline-width',
      'outline-offset',
      'box-shadow',
      'fill',
      'stroke',
      'opacity',
    ];
    return [...element.querySelectorAll('*')]
      .filter((node) => node.tagName !== 'BR' && node.getBoundingClientRect().height > 0)
      .map((node) => {
        const rect = node.getBoundingClientRect(),
          styles = getComputedStyle(node);
        return {
          tag: node.tagName,
          classes: [...node.classList].filter((name) => name.startsWith('semi-')).sort(),
          // Compare each node's own text; container concatenation invents differences across <br>.
          text: [...node.childNodes]
            .filter((child) => child.nodeType === Node.TEXT_NODE)
            .map((child) => child.textContent)
            .join('')
            .replace(/\s+/g, ' ')
            .trim(),
          role: node.getAttribute('role'),
          tabindex: node.getAttribute('tabindex'),
          href: node.getAttribute('href'),
          target: node.getAttribute('target'),
          // The Vue paste area adds an accessible name; it does not alter the copied text.
          label: node.tagName === 'TEXTAREA' ? undefined : node.getAttribute('aria-label'),
          pseudo: node.classList.contains('components-layout-demo')
            ? Object.fromEntries(
                [
                  'content',
                  'position',
                  'top',
                  'left',
                  'width',
                  'height',
                  'background-color',
                  'border-radius',
                  'box-shadow',
                ].map((key) => [key, getComputedStyle(node, '::before').getPropertyValue(key)]),
              )
            : undefined,
          path: node.getAttribute('d')?.replace(/\s+/g, ' ').trim() ?? null,
          styles: Object.fromEntries(properties.map((key) => [key, styles.getPropertyValue(key)])),
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

async function compare(reference: Locator, vue: Locator, info: TestInfo, state: string) {
  await waitForVisualAssets([reference, vue]);
  const [expected, actual] = await Promise.all([measure(reference), measure(vue)]);
  await info.attach(`${state}-styles`, {
    body: JSON.stringify({ expected, actual }),
    contentType: 'application/json',
  });
  const shots = await Promise.all([reference, vue].map((root) => root.screenshot()));
  for (const [i, side] of ['reference', 'vue'].entries())
    await info.attach(state === 'default' ? side : `${state}-${side}`, {
      body: shots[i]!,
      contentType: 'image/png',
    });
  expect(actual.length, state).toBe(expected.length);
  for (const [i, node] of actual.entries()) {
    const { rect: a, ...actualNode } = node;
    const { rect: b, ...expectedNode } = expected[i]!;
    expect(actualNode, `${state} node ${i}`).toEqual(expectedNode);
    for (const axis of ['x', 'y', 'width', 'height'] as const)
      expect(Math.abs(a[axis] - b[axis]), `${state} node ${i} ${axis}`).toBeLessThanOrEqual(0.5);
  }
  await expectScreenshotPixelsToMatch(vue.page(), shots[1]!, shots[0]!, state);
}

async function alignRoot(reference: Locator, vue: Locator) {
  await vue.scrollIntoViewIfNeeded();
  const box = await vue.boundingBox();
  const scroll = await vue
    .page()
    .evaluate(() => ({ y: scrollY, height: document.documentElement.scrollHeight }));
  await reference.evaluate(
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
}

for (const locale of ['zh-cn', 'en-us'])
  for (const theme of ['light', 'dark'])
    for (const [index, name] of examples.entries())
      for (const direction of ['ltr', 'rtl'])
        test(`Banner 文档 ${name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
          browser,
        }, info) => {
          test.setTimeout(90_000);
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
            }
            await vue.addInitScript((value) => {
              if (window === window.top) localStorage.setItem('semi-docs-theme', value);
            }, theme);
            await reference.goto(
              `http://127.0.0.1:4173/docs.html?component=banner&locale=${locale}&theme=${theme}&example=${index + 1}`,
            );
            const expected = reference.locator('#root');
            const ready = (root: Locator) =>
              name === 'Basic'
                ? root.getByRole('button', { name: 'Show Banner', exact: true })
                : root.getByRole('alert').first();
            await expect(ready(expected)).toBeVisible();
            await vue.goto(`/${locale}/components/banner/`);
            const demo = vue.locator(`[data-demo-id="banner/${locale}/${name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            const roots = [expected, actual];
            await expect(ready(actual)).toBeVisible();
            const source = await readFile(
              new URL(`../../src/demos/banner/${locale}/${name}.vue`, import.meta.url),
              'utf8',
            );
            expect(await demo.locator('[data-demo-source] code').textContent()).toBe(source);
            for (const root of roots) {
              await expect(root.getByRole('alert')).toHaveCount(counts[index]!);
              await root.evaluate((element, dir) => {
                (element as HTMLElement).dir = dir;
                element.classList.toggle('semi-rtl', dir === 'rtl');
              }, direction);
            }
            await waitForVisualAssets(roots);
            await alignRoot(expected, actual);
            await Promise.all(pages.map((page) => page.mouse.move(1400, 880)));
            await freezeAnimations(pages, 300);
            const compareState = async (state: string) => {
              await alignRoot(expected, actual);
              // Closing changes layout under the stationary pointer; sample neutral hover equally.
              if (!state.endsWith('-hover'))
                await Promise.all(pages.map((page) => page.mouse.move(1400, 880)));
              await compare(expected, actual, info, state);
            };
            await test.step('默认内容、样式、几何、伪元素与完整截图', async () => {
              await compareState('default');
              for (let i = 0; i < counts[index]!; i++) {
                const shots = await Promise.all(
                  roots.map((root) => root.getByRole('alert').nth(i).screenshot()),
                );
                for (const [j, side] of ['reference', 'vue'].entries())
                  await info.attach(`banner-${i}-${side}`, {
                    body: shots[j]!,
                    contentType: 'image/png',
                  });
                await expectScreenshotPixelsToMatch(vue, shots[1]!, shots[0]!, `banner-${i}`);
              }
            });
            if (name === 'Basic')
              await test.step('显示隐藏、Tab 焦点、三种关闭与再次挂载', async () => {
                for (const root of roots)
                  await root.getByRole('button', { name: 'Show Banner', exact: true }).click();
                for (const root of roots) await expect(root.getByRole('alert')).toHaveCount(1);
                await compareState('shown');
                for (const root of roots) {
                  await root
                    .getByRole('button', { name: 'Hide Banner', exact: true })
                    .press('Shift+Tab');
                  await expect(
                    root.getByRole('button', { name: 'Close', exact: true }),
                  ).toBeFocused();
                }
                await compareState('close-focus');
                for (const method of ['Enter', 'Space', 'click']) {
                  for (const root of roots) {
                    const close = root.getByRole('button', { name: 'Close', exact: true });
                    if (method === 'click') await close.click();
                    else await close.press(method);
                    await expect(root.getByRole('alert')).toHaveCount(0);
                    await expect(
                      root.getByRole('button', { name: 'Show Banner', exact: true }),
                    ).toBeVisible();
                  }
                  await compareState(`closed-${method}`);
                  for (const root of roots)
                    await root.getByRole('button', { name: 'Show Banner', exact: true }).click();
                  for (const root of roots) await expect(root.getByRole('alert')).toHaveCount(1);
                }
                for (const root of roots)
                  await root.getByRole('button', { name: 'Hide Banner', exact: true }).click();
                for (const root of roots) await expect(root.getByRole('alert')).toHaveCount(0);
                await compareState('parent-hidden');
              });
            if (name === 'Types')
              await test.step('四种状态独立关闭，保留其余通知', async () => {
                for (const [i, type] of ['info', 'warning', 'danger', 'success'].entries()) {
                  for (const root of roots) {
                    const target = root.locator(`.semi-banner-${type}`);
                    await expect(target).toHaveAttribute('role', 'alert');
                    const close = target.getByRole('button', { name: 'Close', exact: true });
                    if (i === 0) await close.press('Enter');
                    else if (i === 1) await close.press('Space');
                    else await close.click();
                    await expect(target).toHaveCount(0);
                    await expect(root.getByRole('alert')).toHaveCount(3 - i);
                  }
                  await compareState(`closed-${type}`);
                }
              });
            if (name === 'Container')
              await test.step('无关闭和图标、链接目标及真实焦点与 hover', async () => {
                for (const root of roots) {
                  await expect(root.getByRole('button')).toHaveCount(0);
                  await expect(root.locator('.semi-banner-icon')).toHaveCount(0);
                  await expect(root.getByRole('link')).toHaveCount(4);
                  for (const link of await root.getByRole('link').all())
                    await expect(link).toHaveAttribute('href', 'https://semi.design/');
                  await root.getByRole('link').first().focus();
                  await root.getByRole('link').first().press('Tab');
                  await expect(root.getByRole('link').nth(1)).toBeFocused();
                }
                await compareState('link-focus');
                for (const root of roots) await root.getByRole('link').nth(1).hover();
                await compareState('link-hover');
              });
            if (name === 'Custom')
              await test.step('自定义按钮焦点、点击无副作用及关闭', async () => {
                for (const root of roots) {
                  await root.getByRole('button', { name: 'Close', exact: true }).focus();
                  await root.getByRole('button', { name: 'Close', exact: true }).press('Tab');
                  await expect(
                    root.getByRole('button', { name: 'No, thanks.', exact: true }),
                  ).toBeFocused();
                }
                await compareState('custom-focus');
                for (const root of roots) {
                  await root.getByRole('button', { name: 'No, thanks.', exact: true }).click();
                  await root
                    .getByRole('button', { name: 'Sounds great!', exact: true })
                    .press('Enter');
                  await expect(root.getByRole('alert')).toHaveCount(1);
                }
                await compareState('custom-actions');
                for (const root of roots)
                  await root.getByRole('button', { name: 'Close', exact: true }).click();
                for (const root of roots) await expect(root.getByRole('alert')).toHaveCount(0);
                await compareState('custom-closed');
              });
            if (theme === 'light' && direction === 'ltr')
              await test.step('源码、重置、真实编辑交互与退出清理', async () => {
                const button = (zh: string, en: string) =>
                  demo.getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
                await button('查看源码', 'View source').click();
                await expect(demo.locator('[data-demo-source]')).toBeVisible();
                await button('查看源码', 'View source').click();
                await button('重置', 'Reset').click();
                await expect(ready(actual)).toBeVisible();
                await expect(actual.getByRole('alert')).toHaveCount(counts[index]!);
                await button('在线编辑', 'Edit online').click();
                const preview = demo.frameLocator('iframe').locator('#app');
                await expect(ready(preview)).toBeVisible({ timeout: 30_000 });
                await expect(preview.getByRole('alert')).toHaveCount(counts[index]!);
                if (name === 'Basic') {
                  await preview.getByRole('button', { name: 'Show Banner', exact: true }).click();
                  await expect(preview.getByRole('alert')).toHaveCount(1);
                  await preview.getByRole('button', { name: 'Close', exact: true }).press('Enter');
                  await expect(
                    preview.getByRole('button', { name: 'Show Banner', exact: true }),
                  ).toBeVisible();
                } else if (name !== 'Container') {
                  await preview.getByRole('button', { name: 'Close', exact: true }).first().click();
                  await expect(preview.getByRole('alert')).toHaveCount(counts[index]! - 1);
                } else await expect(preview.getByRole('link')).toHaveCount(4);
                await expect(demo.locator('.msg.err')).toHaveCount(0);
                await button('退出编辑', 'Close editor').click();
                await expect(demo.locator('iframe')).toHaveCount(0);
                await expect(ready(actual)).toBeVisible();
                await expect(actual.getByRole('alert')).toHaveCount(counts[index]!);
              });
            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'feedback/banner',
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
