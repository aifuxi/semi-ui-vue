import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type TestInfo } from '@playwright/test';
import { visualContext, waitForVisualAssets } from './visual-context';
import { freezeAnimations } from './demo-parity';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

test.use({ actionTimeout: 10_000 });
const examples = [
  'Title',
  'Text',
  'Link',
  'Paragraph',
  'Numeral',
  'Parser',
  'Size',
  'Copyable',
  'Ellipsis',
  'TooltipWrapping',
];
const counts = [6, 13, 3, 4, 6, 2, 6, 7, 9, 3];
const fixedTime = new Date('2024-08-15T10:24:30+08:00');

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
    return [element, ...element.querySelectorAll('*')]
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

async function alignTrigger(referenceRoot: Locator, reference: Locator, vue: Locator) {
  await vue.scrollIntoViewIfNeeded();
  const boxes = await Promise.all([reference, vue].map((target) => target.boundingBox()));
  await referenceRoot.evaluate((element, boxes) => {
    const root = element as HTMLElement;
    root.style.left = `${parseFloat(root.style.left) + boxes[1]!.x - boxes[0]!.x}px`;
    root.style.top = `${parseFloat(root.style.top) + boxes[1]!.y - boxes[0]!.y}px`;
  }, boxes);
}

for (const locale of ['zh-cn', 'en-us'])
  for (const theme of ['light', 'dark'])
    for (const [index, name] of examples.entries())
      for (const direction of ['ltr', 'rtl'])
        test(`Typography 文档 ${name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
          browser,
        }, info) => {
          test.setTimeout(120_000);
          const context = await visualContext(browser, info, locale, theme, direction);
          try {
            await context.grantPermissions(['clipboard-read', 'clipboard-write']);
            const reference = await context.newPage(),
              vue = await context.newPage();
            const pages = [reference, vue];
            const errors: string[] = [],
              expansions: boolean[][] = [[], []];
            for (const [i, page] of pages.entries()) {
              // Only Date is fixed; editor, timers, copy reset and portal lifecycle use real time.
              await page.clock.setFixedTime(fixedTime);
              page.on('pageerror', (error) => errors.push(error.message));
              page.on('console', (message) => {
                if (message.type() === 'error') errors.push(message.text());
                if (/^(true|false) /.test(message.text()))
                  expansions[i]!.push(message.text().startsWith('true'));
              });
            }
            await vue.addInitScript((value) => {
              if (window === window.top) localStorage.setItem('semi-docs-theme', value);
            }, theme);
            await reference.goto(
              `http://127.0.0.1:4173/docs.html?component=typography&locale=${locale}&theme=${theme}&example=${index + 1}`,
            );
            const expected = reference.locator('#root');
            const count = name === 'Ellipsis' && locale === 'en-us' ? 8 : counts[index]!;
            await expect(expected.locator('.semi-typography')).toHaveCount(count);
            await vue.goto(`/${locale}/components/typography/`);
            const demo = vue.locator(`[data-demo-id="typography/${locale}/${name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual.locator('.semi-typography')).toHaveCount(count);
            const source = await readFile(
              new URL(`../../src/demos/typography/${locale}/${name}.vue`, import.meta.url),
              'utf8',
            );
            expect(await demo.locator('[data-demo-source] code').textContent()).toBe(source);
            for (const root of [expected, actual])
              await root.evaluate((element, direction) => {
                (element as HTMLElement).dir = direction;
                element.classList.toggle('semi-rtl', direction === 'rtl');
              }, direction);
            await waitForVisualAssets([expected, actual]);
            // The earlier Ellipsis demo can move later previews while its action width is measured.
            await expect(
              vue.locator(`[data-demo-id="typography/${locale}/Ellipsis"] .semi-typography`).nth(6),
            ).toHaveCSS('height', '60px');
            await alignRoot(expected, actual);
            await Promise.all(pages.map((page) => page.mouse.move(1400, 880)));
            await freezeAnimations(pages, 300);
            if (name === 'Ellipsis') {
              // The action mounts before the asynchronous JS ellipsis measurement finishes.
              for (const root of [expected, actual]) {
                await expect(root.locator('.semi-typography-ellipsis-expand')).toBeVisible();
                await expect(root.locator('.semi-typography').nth(6)).toHaveCSS('height', '60px');
              }
              await expect(actual.locator('.semi-typography').nth(6)).toHaveText(
                (await expected.locator('.semi-typography').nth(6).textContent())!,
              );
            }
            const content = (root: Locator) => root.locator(':scope > div');
            await test.step('默认内容、样式、几何与局部截图', () =>
              compare(content(expected), content(actual), info, 'default'));

            const initialEllipsis =
              name === 'Ellipsis' && locale === 'en-us'
                ? {
                    styles: await measure(actual.locator('.semi-typography').nth(6)),
                    screenshot: await actual.locator('.semi-typography').nth(6).screenshot(),
                  }
                : undefined;

            if (name === 'Link') {
              await test.step('链接目标、键盘焦点、hover 与 active', async () => {
                for (const root of [expected, actual]) {
                  const links = root.locator('a');
                  await expect(links.nth(0)).toHaveAttribute('href', 'https://semi.design/');
                  await expect(links.nth(1)).toHaveAttribute('href', 'https://semi.design/');
                  await links.nth(0).focus();
                  await links.nth(0).press('Tab');
                  await expect(links.nth(1)).toBeFocused();
                }
                await compare(content(expected), content(actual), info, 'link-focus');
                for (let i = 0; i < 3; i++) {
                  const targets = [expected, actual].map((root) => root.locator('a').nth(i));
                  await alignTrigger(expected, targets[0]!, targets[1]!);
                  for (const target of targets) await target.hover();
                  await compare(content(expected), content(actual), info, `link-${i}-hover`);
                  for (const page of pages) await page.mouse.down();
                  try {
                    await compare(content(expected), content(actual), info, `link-${i}-active`);
                  } finally {
                    // Release away from the link, preserving the local test page.
                    for (const page of pages) {
                      await page.mouse.move(1400, 880);
                      await page.mouse.up();
                    }
                  }
                }
              });
            }
            if (name === 'Copyable') {
              await test.step('六组真实复制、回调、再次复制与三秒复位', async () => {
                for (let i = 0; i < 6; i++) {
                  const targets = [expected, actual].map((root) =>
                    root.locator('.semi-typography').nth(i),
                  );
                  await alignTrigger(expected, targets[0]!, targets[1]!);
                  const copies: string[] = [];
                  for (const target of targets) {
                    const action = target.getByRole('button');
                    if (i === 0) await action.press('Enter');
                    else await action.click();
                    copies.push(await target.page().evaluate(() => navigator.clipboard.readText()));
                    if (i < 5)
                      await expect(target.locator('.semi-typography-action-copied')).toBeVisible();
                    else
                      await expect(action).toHaveText(
                        locale === 'zh-cn' ? '复制成功' : 'Copy success',
                      );
                  }
                  expect(copies[0]).not.toBe('');
                  expect(copies[1]).toBe(copies[0]);
                  if (i === 1) expect(copies[0]).toBe('Hello, Semi Design!');
                  if (i === 5) expect(copies[0]).toBe('Custom render!');
                  await info.attach(`clipboard-${i}`, {
                    body: JSON.stringify(copies),
                    contentType: 'application/json',
                  });
                  await Promise.all(pages.map((page) => page.mouse.move(1400, 880)));
                  await freezeAnimations(pages, 300);
                  await compare(targets[0]!, targets[1]!, info, `copied-${i}`);
                  if (i === 2) {
                    for (const page of pages)
                      await expect(page.locator('.semi-toast-content')).toContainText(
                        locale === 'zh-cn' ? '复制文本成功' : 'Successfully copied.',
                      );
                    await compare(
                      reference.locator('.semi-toast'),
                      vue.locator('.semi-toast'),
                      info,
                      'copy-callback-toast',
                    );
                  }
                  if (i === 5) {
                    for (const target of targets) {
                      await target.getByRole('button').press('Enter');
                      expect(
                        await target.page().evaluate(() => navigator.clipboard.readText()),
                      ).toBe('Custom render!');
                    }
                  }
                  for (const target of targets) {
                    if (i < 5)
                      await expect(target.locator('.semi-typography-action-copy')).toBeVisible({
                        timeout: 5000,
                      });
                    else
                      await expect(target.getByRole('button')).toHaveText(
                        locale === 'zh-cn'
                          ? '点击复制:Custom render!'
                          : 'Click to copy: Custom render!',
                        { timeout: 5000 },
                      );
                  }
                }
                await expect(vue.locator('.semi-toast')).toHaveCount(0);
                await expect(reference.locator('.semi-toast')).toHaveCount(0);
              });
            }
            if (name === 'Ellipsis' || name === 'TooltipWrapping') {
              await test.step('真实 Tooltip/Popover、关闭重开与完整浮层截图', async () => {
                const items =
                  name === 'TooltipWrapping'
                    ? [0, 1, 2]
                    : locale === 'zh-cn'
                      ? [0, 1, 2, 5, 7, 8]
                      : [0, 1, 2, 5, 7];
                for (const i of items) {
                  const targets = [expected, actual].map((root) =>
                    root.locator('.semi-typography').nth(i),
                  );
                  await alignTrigger(expected, targets[0]!, targets[1]!);
                  for (const target of targets) await target.hover();
                  const selector =
                    name === 'Ellipsis' && i === 5
                      ? '.semi-popover-wrapper'
                      : '.semi-tooltip-wrapper';
                  const tips = pages.map((page) => page.locator(selector));
                  for (const tip of tips) await expect(tip).toBeVisible();
                  await freezeAnimations(pages, 300);
                  const rects = await Promise.all(tips.map((tip) => tip.boundingBox()));
                  for (const axis of ['x', 'y', 'width', 'height'] as const)
                    expect(
                      Math.abs(rects[0]![axis] - rects[1]![axis]),
                      `tooltip-${i} ${axis}`,
                    ).toBeLessThanOrEqual(0.5);
                  await compare(tips[0]!, tips[1]!, info, `tooltip-${i}`);
                  for (const page of pages) await page.mouse.move(1400, 880);
                  for (const tip of tips) await expect(tip).toHaveCount(0);
                  if (i === 0) {
                    for (const target of targets) await target.hover();
                    for (const tip of tips) await expect(tip).toBeVisible();
                    for (const page of pages) await page.mouse.move(1400, 880);
                    for (const tip of tips) await expect(tip).toHaveCount(0);
                  }
                }
              });
            }
            if (name === 'Ellipsis') {
              await test.step('展开折叠、Enter 回调与宽度变化重测', async () => {
                const targets = [expected, actual].map((root) =>
                  root.locator('.semi-typography').nth(6),
                );
                const collapsed = await targets[0]!.textContent();
                await alignTrigger(expected, targets[0]!, targets[1]!);
                for (const target of targets) {
                  await target.getByRole('button').click();
                  await expect(target.getByRole('button')).toHaveText(
                    locale === 'zh-cn' ? '折叠我吧' : 'Show Less',
                  );
                }
                await compare(targets[0]!, targets[1]!, info, 'expanded');
                for (const target of targets) {
                  await target.getByRole('button').press('Enter');
                  await expect(target).toHaveText(collapsed!);
                  await target.getByRole('button').press('Enter');
                  await target.getByRole('button').click();
                  await expect(target).toHaveText(collapsed!);
                }
                expect(expansions).toEqual([
                  [true, false, true, false],
                  [true, false, true, false],
                ]);
                for (const page of pages) {
                  await page.mouse.move(1400, 880);
                  await expect(
                    page.locator('.semi-tooltip-wrapper, .semi-popover-wrapper'),
                  ).toHaveCount(0);
                }
                // A stylesheet survives VDOM branch replacement when the wider text stops overflowing.
                const resizeStyles = await Promise.all(
                  pages.map((page) =>
                    page.addStyleTag({
                      content: `#root .semi-typography-paragraph:last-of-type,
                        [data-demo-id="typography/${locale}/Ellipsis"] [data-demo-preview] .semi-typography-paragraph:last-of-type {
                        width: 480px !important;
                      }`,
                    }),
                  ),
                );
                for (const target of targets) {
                  await expect(target).toHaveCSS('width', '480px');
                  await expect(target).not.toHaveText(collapsed!);
                }
                await compare(targets[0]!, targets[1]!, info, 'resized-480px');
                for (const style of resizeStyles)
                  await style.evaluate((node) => node.parentNode?.removeChild(node));
                for (const target of targets) {
                  await expect(target).toHaveCSS('width', '300px');
                  await expect(target.getByRole('button')).toHaveText(
                    locale === 'zh-cn' ? '展开' : 'Expand',
                  );
                }
                await expect(targets[1]!).toHaveCSS('height', '60px');
                if (locale === 'en-us') {
                  // Approved exception: retain Vue's three-line correction after the action remounts.
                  await expect(targets[0]!).toHaveCSS('height', '80px');
                  await expect(targets[0]!).toHaveText(
                    "Expandable and collapsible: Life's but a walking shadow, a poor player, that struts and frets his hour upon the stage, and then...Expand",
                  );
                  await expect(targets[1]!).toHaveText(collapsed!);
                  const restored = await Promise.all(targets.map((target) => measure(target)));
                  await info.attach('restored-300px-approved-difference', {
                    body: JSON.stringify({
                      reason:
                        'User approved preserving Vue three-line layout on width restoration.',
                      reference: restored[0],
                      vue: restored[1],
                    }),
                    contentType: 'application/json',
                  });
                  const shots = await Promise.all(targets.map((target) => target.screenshot()));
                  for (const [i, side] of ['reference', 'vue'].entries())
                    await info.attach(`restored-300px-${side}`, {
                      body: shots[i]!,
                      contentType: 'image/png',
                    });
                  expect(restored[1]).toEqual(initialEllipsis!.styles);
                  await expectScreenshotPixelsToMatch(
                    vue,
                    shots[1]!,
                    initialEllipsis!.screenshot,
                    'restored-300px-vue-initial',
                  );
                } else {
                  await compare(targets[0]!, targets[1]!, info, 'restored-300px');
                }
              });
            }
            if (theme === 'light' && direction === 'ltr') {
              await test.step('源码、重置与实际编辑器生命周期', async () => {
                const button = (zh: string, en: string) =>
                  demo.getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
                await button('查看源码', 'View source').click();
                await expect(demo.locator('[data-demo-source]')).toBeVisible();
                await button('查看源码', 'View source').click();
                await button('重置', 'Reset').click();
                await expect(actual.locator('.semi-typography')).toHaveCount(count);
                if (name === 'Copyable')
                  await expect(actual.locator('.semi-typography-action-copy')).toHaveCount(5);
                if (name === 'Ellipsis')
                  await expect(actual.locator('.semi-typography-ellipsis-expand')).toHaveText(
                    locale === 'zh-cn' ? '展开' : 'Expand',
                  );
                await button('在线编辑', 'Edit online').click();
                const preview = demo.frameLocator('iframe').locator('#app');
                await expect(preview.locator('.semi-typography')).toHaveCount(count, {
                  timeout: 30_000,
                });
                await expect(demo.locator('.msg.err')).toHaveCount(0);
                await button('退出编辑', 'Close editor').click();
                await expect(demo.locator('iframe')).toHaveCount(0);
                await expect(actual.locator('.semi-typography')).toHaveCount(count);
              });
            }
            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'basic/typography',
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
