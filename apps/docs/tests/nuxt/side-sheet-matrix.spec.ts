import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page, type TestInfo } from '@playwright/test';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';
test.use({ actionTimeout: 10_000 });
const examples = ['Basic', 'Placement', 'Size', 'Outside', 'Container', 'Custom'] as const;
async function measure(root: Locator) {
  return root.evaluate((element) => {
    const origin = element.getBoundingClientRect();
    const properties = [
      'display',
      'position',
      'color',
      'background-color',
      'background-image',
      'font-family',
      'font-size',
      'font-weight',
      'line-height',
      'text-align',
      'direction',
      'vertical-align',
      'box-sizing',
      'white-space',
      'word-break',
      'overflow-wrap',
      'overflow',
      'text-overflow',
      'text-decoration-line',
      'cursor',
      'pointer-events',
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
      'opacity',
      'min-width',
      'width',
      'max-width',
      'height',
      'transform',
      'animation-name',
      'animation-duration',
      'column-gap',
      'row-gap',
    ];
    return [
      ...(element.id === 'root' || element.hasAttribute('data-demo-preview') ? [] : [element]),
      ...element.querySelectorAll('*'),
    ]
      .filter(
        (node) =>
          node.tagName !== 'BR' &&
          (!(element.id === 'root' || element.hasAttribute('data-demo-preview')) ||
            node.classList.length > 0 ||
            node.tagName !== 'DIV') &&
          node.getBoundingClientRect().height > 0,
      )
      .map((node) => {
        const rect = node.getBoundingClientRect(),
          styles = getComputedStyle(node);
        return {
          tag: node.tagName,
          classes: [...node.classList].filter((name) => name.startsWith('semi-')).sort(),
          text: (() => {
            // A BR is a visible line boundary, not an empty node to concatenate
            // across. Vue may retain source whitespace adjacent to it while React
            // drops it; normal CSS whitespace collapses at that line boundary.
            const lines = [''];
            for (const child of node.childNodes) {
              if (child.nodeType === Node.TEXT_NODE)
                lines[lines.length - 1] += child.textContent ?? '';
              else if (child instanceof Element && child.tagName === 'BR') lines.push('');
            }
            return lines.map((line) =>
              ['normal', 'nowrap'].includes(styles.whiteSpace)
                ? line.replace(/[ \t\r\n\f]+/g, ' ').replace(/^ +| +$/g, '')
                : line,
            );
          })(),
          role: node.getAttribute('role'),
          label: node.getAttribute('aria-label'),
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

async function assertComparable(reference: Locator, vue: Locator, info: TestInfo, state: string) {
  await waitForVisualAssets([reference, vue]);
  const [expected, actual] = await Promise.all([measure(reference), measure(vue)]);
  await info.attach(`${state}-styles`, {
    body: JSON.stringify({ expected, actual }),
    contentType: 'application/json',
  });
  expect(actual.length, state).toBe(expected.length);
  for (const [i, node] of actual.entries()) {
    const { rect: a, ...actualNode } = node;
    const { rect: b, ...expectedNode } = expected[i]!;
    expect(actualNode, `${state} node ${i}`).toEqual(expectedNode);
    for (const axis of ['x', 'y', 'width', 'height'] as const)
      expect(Math.abs(a[axis] - b[axis]), `${state} node ${i} ${axis}`).toBeLessThanOrEqual(0.5);
  }
}

/** The demo root has no shared background, so compare it directly and keep the
 *  required `default-styles`/`reference`/`vue` attachments for the batch report. */
async function compareDemoRoot(reference: Locator, vue: Locator, info: TestInfo) {
  await assertComparable(reference, vue, info, 'default');
  const shots = await Promise.all([reference.screenshot(), vue.screenshot()]);
  await info.attach('reference', { body: shots[0]!, contentType: 'image/png' });
  await info.attach('vue', { body: shots[1]!, contentType: 'image/png' });
  await expectScreenshotPixelsToMatch(vue.page(), shots[1]!, shots[0]!, 'default');
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
        position: 'absolute',
        left: `${box!.x}px`,
        top: `${box!.y + scroll.y}px`,
      });
      document.body.style.minHeight = `${scroll.height}px`;
      window.scrollTo(0, scroll.y);
    },
    { box, scroll },
  );
}

async function settle(pages: Page[]) {
  for (const page of pages) await expect(page.locator('.semi-sidesheet-content')).toBeVisible();
  await Promise.all(
    pages.map((page) =>
      page.evaluate(async () => {
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        );
        await Promise.all(
          document
            .getAnimations()
            .filter((animation) => {
              const target = (animation.effect as KeyframeEffect | null)?.target;
              return (
                target instanceof Element &&
                Boolean(target.closest('.semi-sidesheet, .semi-sidesheet-mask'))
              );
            })
            .map((animation) => animation.finished.catch(() => undefined)),
        );
      }),
    ),
  );
}

// Preserve the translucent mask and modal itself; normalize only unrelated host
// chrome beneath the Portal, which otherwise shows through rounded corners.
const sheetCaptureStyle = `
  html, body { background: var(--semi-color-bg-0) !important; }
  body *:not(.semi-sidesheet):not(.semi-sidesheet *):not(.semi-sidesheet-mask):not(:has(.semi-sidesheet)):not(:has(.semi-sidesheet-mask)) { visibility: hidden !important; }
`;

async function compareSheet(pages: Page[], info: TestInfo, state: string, mask = true) {
  await settle(pages);
  const roots = pages.map((page) => page.locator('.semi-sidesheet'));
  await assertComparable(roots[0]!, roots[1]!, info, state);
  // Portal placement is viewport-relative; do not normalize away offsets.
  const bounds = await Promise.all(roots.map((root) => root.boundingBox()));
  for (const axis of ['x', 'y', 'width', 'height'] as const)
    expect(
      Math.abs(bounds[0]![axis] - bounds[1]![axis]),
      `${state} portal ${axis}`,
    ).toBeLessThanOrEqual(0.5);
  const masks = pages.map((page) => page.locator('.semi-sidesheet-mask'));
  if (mask) await assertComparable(masks[0]!, masks[1]!, info, `${state}-mask`);
  else for (const overlay of masks) await expect(overlay).toHaveCount(0);
  const shots = await Promise.all(
    roots.map((root) => root.screenshot({ style: sheetCaptureStyle })),
  );
  await info.attach(`${state}-reference`, { body: shots[0]!, contentType: 'image/png' });
  await info.attach(`${state}-vue`, { body: shots[1]!, contentType: 'image/png' });
  await expectScreenshotPixelsToMatch(pages[1]!, shots[1]!, shots[0]!, state);
}

for (const locale of ['zh-cn', 'en-us'])
  for (const theme of ['light', 'dark'])
    for (const [index, name] of examples.entries())
      for (const direction of ['ltr', 'rtl'])
        test(`SideSheet 文档 ${name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
          browser,
        }, info) => {
          test.setTimeout(150_000);
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
              // Only Date changes: animations, editor and real interactions retain running clocks.
              await page.clock.setFixedTime(new Date('2024-08-15T10:24:30+08:00'));
            }
            await vue.addInitScript((value) => {
              if (window === window.top) localStorage.setItem('semi-docs-theme', value);
            }, theme);
            await reference.goto(
              `http://127.0.0.1:4173/docs.html?component=side-sheet&locale=${locale}&theme=${theme}&example=${index + 1}`,
            );
            await vue.goto(`/${locale}/components/side-sheet/`);
            for (const page of pages)
              await page.evaluate((dir) => {
                document.body.dir = dir;
                document.body.classList.toggle('semi-rtl', dir === 'rtl');
              }, direction);
            const demo = vue.locator(`[data-demo-id="side-sheet/${locale}/${name}"]`);
            const expected = reference.locator('#root'),
              actual = demo.locator('[data-demo-preview]');
            const roots = [expected, actual];
            for (const root of roots) {
              await expect(root.getByRole('button')).toHaveCount(1);
              await expect(root.getByRole('button')).toHaveText(
                name === 'Custom' ? 'More Information' : 'Open SideSheet',
              );
              await expect(root.getByRole('radio')).toHaveCount(
                name === 'Placement' ? 4 : name === 'Size' ? 3 : 0,
              );
            }
            await alignRoot(expected, actual);
            const source = await readFile(
              new URL(`../../src/demos/side-sheet/${locale}/${name}.vue`, import.meta.url),
              'utf8',
            );
            expect(await demo.locator('[data-demo-source] code').textContent()).toBe(source);
            await compareDemoRoot(expected, actual, info);
            const open = async () => {
              for (const root of roots) await root.getByRole('button').click();
              await expect(demo.locator('.demo-error')).toHaveCount(0);
              for (const page of pages) await page.mouse.move(1435, 895);
              await settle(pages);
            };
            const close = async () => {
              for (const page of pages) {
                await page.locator('.semi-sidesheet-close').click();
                await expect(page.locator('.semi-sidesheet')).toHaveCount(0);
              }
            };
            const compare = async (state: string) => {
              for (const page of pages) {
                await expect(page.getByRole('dialog')).toBeVisible();
                await expect(page.locator('.semi-sidesheet-header')).toHaveAttribute(
                  'role',
                  'heading',
                );
                await expect(page.locator('.semi-sidesheet-header')).toHaveAttribute(
                  'aria-level',
                  '1',
                );
              }
              await compareSheet(pages, info, state, name !== 'Outside');
            };
            await test.step('全部位置/尺寸及首次 Portal 样式几何像素', async () => {
              const variants =
                name === 'Placement'
                  ? ['right', 'left', 'top', 'bottom']
                  : name === 'Size'
                    ? ['small', 'medium', 'large']
                    : ['default'];
              for (const variant of variants) {
                if (variant !== 'default')
                  for (const root of roots)
                    await root.getByRole('radio', { name: variant, exact: true }).check();
                await open();
                if (name === 'Container')
                  for (const root of roots) {
                    await expect(root.locator('.sidesheet-container .semi-portal')).toHaveCount(1);
                    await expect(root.locator('.sidesheet-container')).toHaveCSS(
                      'overflow',
                      'hidden',
                    );
                    await expect(root.getByRole('dialog')).toHaveCSS('width', '220px');
                  }
                if (name === 'Size')
                  for (const page of pages)
                    await expect(page.getByRole('dialog')).toHaveCSS(
                      'width',
                      `${({ small: 448, medium: 684, large: 920 } as Record<string, number>)[variant]}px`,
                    );
                if (name === 'Placement' && ['top', 'bottom'].includes(variant))
                  for (const page of pages)
                    await expect(page.getByRole('dialog')).toHaveCSS('height', '448px');
                await compare(`opened-${variant}`);
                await close();
              }
            });
            await test.step('退出重开、键盘与示例状态', async () => {
              await open();
              // Every fixed snippet retains closeOnEsc=false.
              for (const page of pages) {
                await page.locator('.semi-sidesheet-close').focus();
                await expect(page.locator('.semi-sidesheet-close')).toBeFocused();
                await page.keyboard.press('Escape');
                await expect(page.getByRole('dialog')).toBeVisible();
              }
              if (name === 'Outside') {
                for (const [i, page] of pages.entries()) {
                  await roots[i]!.getByRole('textbox').fill('Edited outside SideSheet');
                  await expect(page.locator('.semi-sidesheet-body p').nth(1)).toHaveText(
                    'Edited outside SideSheet',
                  );
                  expect(
                    await page.locator('body').evaluate((node) => node.style.overflow),
                  ).not.toBe('hidden');
                }
                await compare('outside-edited');
              }
              if (name === 'Custom') {
                for (const page of pages) {
                  const sheet = page.getByRole('dialog');
                  await expect(sheet.getByRole('radio')).toHaveCount(6);
                  await expect(sheet.locator('.semi-tag')).toHaveCount(4);
                  const ios = sheet.getByRole('radio', { name: 'iOS', exact: true });
                  const iosLabel = ios.locator('xpath=ancestor::label[1]');
                  const allLabel = sheet
                    .getByRole('radio', {
                      name: locale === 'zh-cn' ? '全平台' : 'All',
                      exact: true,
                    })
                    .locator('xpath=ancestor::label[1]');
                  await ios.click();
                  await expect(iosLabel).toHaveClass(/\bsemi-radio-checked\b/);
                  await expect(allLabel).not.toHaveClass(/\bsemi-radio-checked\b/);
                  await sheet.locator('.semi-sidesheet-footer').getByRole('button').nth(0).click();
                  await expect(iosLabel).toHaveClass(/\bsemi-radio-checked\b/);
                  await expect(allLabel).not.toHaveClass(/\bsemi-radio-checked\b/);
                  await sheet.locator('.semi-sidesheet-footer').getByRole('button').nth(1).click();
                  await expect(sheet).toBeVisible();
                }
                for (const page of pages) await page.mouse.move(1435, 895);
                const nativeRadioStates = await Promise.all(
                  pages.map((page) =>
                    page
                      .getByRole('dialog')
                      .getByRole('radio')
                      .evaluateAll((nodes) =>
                        nodes.map((node) => ({
                          checked: (node as HTMLInputElement).checked,
                          name: (node as HTMLInputElement).name,
                        })),
                      ),
                  ),
                );
                expect(nativeRadioStates[1]).toEqual(nativeRadioStates[0]);
                await compare('custom-radio-and-inert-footer');
              }
              await close();
              if (name !== 'Outside') {
                await open();
                for (const page of pages) {
                  await page.locator('.semi-sidesheet-mask').click({ position: { x: 4, y: 4 } });
                  await expect(page.locator('.semi-sidesheet')).toHaveCount(0);
                }
              }
            });
            if (theme === 'light' && direction === 'ltr')
              await test.step('双语源码、重置和编辑运行', async () => {
                const button = (zh: string, en: string) =>
                  demo.getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
                await button('查看源码', 'View source').click();
                await expect(demo.locator('[data-demo-source]')).toBeVisible();
                await button('查看源码', 'View source').click();
                await button('重置', 'Reset').click();
                await actual.getByRole('button').click();
                await expect(vue.getByRole('dialog')).toBeVisible();
                await vue.locator('.semi-sidesheet-close').click();
                await expect(vue.locator('.semi-sidesheet')).toHaveCount(0);
                await button('在线编辑', 'Edit online').click();
                const frame = demo.frameLocator('iframe');
                await expect(frame.locator('#app').getByRole('button').first()).toBeVisible({
                  timeout: 30_000,
                });
                await demo.locator('iframe').scrollIntoViewIfNeeded();
                await frame.locator('#app').getByRole('button').first().click();
                await expect(frame.getByRole('dialog')).toBeVisible();
                await frame.locator('.semi-sidesheet-close').click();
                await expect(frame.locator('.semi-sidesheet')).toHaveCount(0);
                await expect(demo.locator('.msg.err')).toHaveCount(0);
                await button('退出编辑', 'Close editor').click();
                await expect(demo.locator('iframe')).toHaveCount(0);
              });
            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'show/sidesheet',
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
