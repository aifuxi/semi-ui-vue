import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page, type TestInfo } from '@playwright/test';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';
test.use({ actionTimeout: 10_000 });
const examples = [
  'Basic',
  'FooterFill',
  'MaskClosable',
  'ButtonText',
  'ButtonProps',
  'HeaderFooter',
  'Style',
  'Custom',
  'Fullscreen',
  'Imperative',
  'Context',
  'Draggable',
] as const;
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
  for (const page of pages) await expect(page.locator('.semi-modal-content')).toBeVisible();
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
                Boolean(target.closest('.semi-modal, .semi-modal-mask'))
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
const modalCaptureStyle = `
  html, body { background: var(--semi-color-bg-0) !important; }
  body *:not(.semi-modal):not(.semi-modal *):not(.semi-modal-mask):not(:has(.semi-modal)):not(:has(.semi-modal-mask)) { visibility: hidden !important; }
`;

async function compareModal(pages: Page[], info: TestInfo, state: string) {
  await settle(pages);
  const roots = pages.map((page) => page.locator('.semi-modal'));
  await assertComparable(roots[0]!, roots[1]!, info, state);
  // Portal placement is viewport-relative; do not normalize away offsets.
  const bounds = await Promise.all(roots.map((root) => root.boundingBox()));
  for (const axis of ['x', 'y', 'width', 'height'] as const)
    expect(
      Math.abs(bounds[0]![axis] - bounds[1]![axis]),
      `${state} portal ${axis}`,
    ).toBeLessThanOrEqual(0.5);
  const masks = pages.map((page) => page.locator('.semi-modal-mask'));
  await assertComparable(masks[0]!, masks[1]!, info, `${state}-mask`);
  const shots = await Promise.all(
    roots.map((root) => root.screenshot({ style: modalCaptureStyle })),
  );
  await info.attach(`${state}-reference`, { body: shots[0]!, contentType: 'image/png' });
  await info.attach(`${state}-vue`, { body: shots[1]!, contentType: 'image/png' });
  await expectScreenshotPixelsToMatch(pages[1]!, shots[1]!, shots[0]!, state);
  for (const page of pages) {
    const dialog = page.getByRole('dialog');
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(dialog).toHaveAttribute('aria-labelledby', 'semi-modal-title');
    await expect(dialog).toHaveAttribute('aria-describedby', 'semi-modal-body');
  }
}

for (const locale of ['zh-cn', 'en-us'])
  for (const theme of ['light', 'dark'])
    for (const [index, name] of examples.entries())
      for (const direction of ['ltr', 'rtl'])
        test(`Modal 文档 ${name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
          browser,
        }, info) => {
          test.setTimeout(150_000);
          const context = await visualContext(browser, info, locale, theme, direction);
          try {
            const reference = await context.newPage(),
              vue = await context.newPage();
            const pages = [reference, vue];
            const errors: string[] = [];
            let editorActive = false;
            const editorNotices: string[] = [];
            const logs = [[], []] as string[][];
            for (const [side, page] of pages.entries()) {
              page.on('pageerror', (error) => errors.push(error.message));
              page.on('console', (message) => {
                if (message.type() === 'error') {
                  if (
                    editorActive &&
                    message.text() ===
                      'Blocked autofocusing on a <button> element in a cross-origin subframe.'
                  )
                    editorNotices.push(message.text());
                  else errors.push(message.text());
                } else if (message.type() === 'log') logs[side]!.push(message.text());
              });
            }
            await vue.addInitScript((value) => {
              if (window === window.top) localStorage.setItem('semi-docs-theme', value);
            }, theme);
            await reference.goto(
              `http://127.0.0.1:4173/docs.html?component=modal&locale=${locale}&theme=${theme}&example=${index + 1}`,
            );
            await vue.goto(`/${locale}/components/modal/`);
            for (const page of pages)
              await page.evaluate((dir) => {
                document.body.dir = dir;
                document.body.classList.toggle('semi-rtl', dir === 'rtl');
              }, direction);
            const demo = vue.locator(`[data-demo-id="modal/${locale}/${name}"]`);
            const expected = reference.locator('#root'),
              actual = demo.locator('[data-demo-preview]');
            const roots = [expected, actual];
            await expect(expected.getByRole('button').first()).toBeVisible();
            await expect(actual.getByRole('button').first()).toBeVisible();
            const triggerCount = name === 'Imperative' ? 6 : 1;
            for (const root of roots)
              await expect(root.getByRole('button')).toHaveCount(triggerCount);
            await alignRoot(expected, actual);
            const source = await readFile(
              new URL(`../../src/demos/modal/${locale}/${name}.vue`, import.meta.url),
              'utf8',
            );
            expect(await demo.locator('[data-demo-source] code').textContent()).toBe(source);
            await compareDemoRoot(expected, actual, info);
            const open = async (button = 0) => {
              for (const root of roots) await root.getByRole('button').nth(button).click();
              for (const page of pages) await page.mouse.move(1435, 895);
              await settle(pages);
            };
            const close = async (label = name === 'Custom' ? 'Learn more features' : 'close') => {
              for (const page of pages) {
                await page
                  .getByRole('dialog')
                  .getByRole('button', { name: label, exact: true })
                  .click();
                await expect(page.locator('.semi-modal')).toHaveCount(0);
              }
            };
            await test.step('首次 Portal、所有命令式类型、样式几何像素', async () => {
              for (let button = 0; button < triggerCount; button++) {
                await open(button);
                await compareModal(pages, info, `opened-${button}`);
                if (name === 'Context')
                  for (const page of pages) {
                    await expect(
                      page.getByRole('button', { name: 'confirm', exact: true }),
                    ).toHaveText('Confirm');
                    await expect(
                      page.getByRole('button', { name: 'cancel', exact: true }),
                    ).toHaveText('Cancel');
                  }
                if (name === 'Imperative')
                  for (const page of pages)
                    await expect(
                      page.getByRole('button', { name: 'confirm', exact: true }),
                    ).toHaveText('确定');
                if (name === 'ButtonProps')
                  for (const page of pages)
                    await expect(
                      page.getByRole('button', { name: 'cancel', exact: true }),
                    ).toBeDisabled();
                if (name === 'MaskClosable')
                  for (const page of pages) {
                    await page.locator('.semi-modal-wrap').click({ position: { x: 4, y: 4 } });
                    await expect(page.getByRole('dialog')).toBeVisible();
                  }
                if (name === 'Style')
                  for (const page of pages) {
                    await expect(page.locator('.semi-modal-body')).toHaveCSS('height', '200px');
                    await expect(page.locator('.semi-modal-body li')).toHaveCount(4);
                  }
                if (name === 'Custom')
                  for (const page of pages)
                    await expect(page.locator('.semi-list-item')).toHaveCount(3);
                if (name === 'Custom')
                  for (const page of pages) {
                    await expect(page.getByRole('dialog').getByRole('button')).toHaveCount(2);
                    await expect(
                      page.getByRole('dialog').getByRole('button', { name: 'close', exact: true }),
                    ).toHaveCount(0);
                  }
                await close();
              }
            });
            await test.step('退出完成后重开、真实键盘焦点与确认/取消', async () => {
              await open();
              if (name === 'Basic' || name === 'FooterFill') {
                for (const page of pages) {
                  const cancel = page.getByRole('button', { name: 'cancel', exact: true });
                  await expect(cancel).toBeFocused();
                  await page.keyboard.press('Tab');
                  await expect(
                    page.getByRole('button', { name: 'confirm', exact: true }),
                  ).toBeFocused();
                  await page.keyboard.press('Escape');
                  await expect(page.locator('.semi-modal')).toHaveCount(0);
                }
                for (const root of roots)
                  await expect(root.getByRole('button').first()).toBeFocused();
                await open();
                await close('confirm');
                for (const side of logs) {
                  expect(side).toContain('Cancel button clicked');
                  expect(side).toContain('Ok button clicked');
                  expect(side).toContain('After Close callback executed');
                }
              } else if (name === 'Draggable') {
                const before = await Promise.all(
                  pages.map((page) => page.locator('.semi-modal-content').boundingBox()),
                );
                for (const page of pages) {
                  const box = await page.locator('.semi-modal-title').boundingBox();
                  await page.mouse.move(box!.x + 30, box!.y + 12);
                  await page.mouse.down();
                  await page.mouse.move(box!.x + 100, box!.y + 52, { steps: 6 });
                  await page.mouse.up();
                  await page.mouse.move(1435, 895);
                }
                for (const [i, page] of pages.entries()) {
                  const after = await page.locator('.semi-modal-content').boundingBox();
                  expect(Math.abs(after!.x - before[i]!.x - 70)).toBeLessThanOrEqual(0.5);
                  expect(Math.abs(after!.y - before[i]!.y - 40)).toBeLessThanOrEqual(0.5);
                }
                await compareModal(pages, info, 'dragged');
                // Fixed Draggable only handles onCancel: confirmation does not close.
                for (const page of pages) {
                  await page.getByRole('button', { name: 'confirm', exact: true }).click();
                  await expect(page.getByRole('dialog')).toBeVisible();
                }
                await close('cancel');
              } else if (name === 'HeaderFooter' || name === 'Custom') {
                for (const page of pages) {
                  await page
                    .getByRole('dialog')
                    .getByRole('button', {
                      name: name === 'Custom' ? 'Continue' : 'Yes, I Understand',
                      exact: true,
                    })
                    .click();
                  await expect(page.locator('.semi-modal')).toHaveCount(0);
                }
              } else await close('confirm');
            });
            if (theme === 'light' && direction === 'ltr')
              await test.step('源码和重置', async () => {
                const button = (zh: string, en: string) =>
                  demo.getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
                await button('查看源码', 'View source').click();
                await expect(demo.locator('[data-demo-source]')).toBeVisible();
                await button('查看源码', 'View source').click();
                await button('重置', 'Reset').click();
                await expect(actual.getByRole('button').first()).toBeVisible();
                await actual.getByRole('button').first().click();
                await expect(vue.getByRole('dialog')).toBeVisible();
                await vue
                  .getByRole('dialog')
                  .getByRole('button', {
                    name: name === 'Custom' ? 'Learn more features' : 'close',
                    exact: true,
                  })
                  .click();
                await expect(vue.locator('.semi-modal')).toHaveCount(0);
                editorActive = true;
                await button('在线编辑', 'Edit online').click();
                const preview = demo.frameLocator('iframe').locator('#app');
                await expect(preview.getByRole('button').first()).toBeVisible({ timeout: 30_000 });
                await demo.locator('iframe').scrollIntoViewIfNeeded();
                await preview.getByRole('button').first().click();
                const editorDialog = demo.frameLocator('iframe').getByRole('dialog');
                await expect(editorDialog).toBeVisible();
                await editorDialog
                  .getByRole('button', {
                    name: name === 'Custom' ? 'Learn more features' : 'close',
                    exact: true,
                  })
                  .click();
                await expect(editorDialog).toHaveCount(0);
                await expect(demo.locator('.msg.err')).toHaveCount(0);
                await button('退出编辑', 'Close editor').click();
                await expect(demo.locator('iframe')).toHaveCount(0);
                editorActive = false;
                await info.attach('editor-browser-notices', {
                  body: JSON.stringify(editorNotices),
                  contentType: 'application/json',
                });
              });
            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'show/modal',
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
