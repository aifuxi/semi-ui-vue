import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page, type TestInfo } from '@playwright/test';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

test.use({ actionTimeout: 10_000 });
const referenceOrigin = 'http://127.0.0.1:4173';
const examples = [
  { name: 'Basic', index: 1 },
  { name: 'Types', index: 2 },
  { name: 'Async', index: 3 },
  { name: 'InitialFocus', index: 4 },
] as const;

// The card floats over page chrome through a translucent, blurred wrapper. Keep only the
// portal that owns the sampled panel plus a flat surface, so both sides sample the same
// backdrop; the pinned `Types` demo also leaves an unrelated panel open on the Vue page.
const backdropFor = (panelId: string) => `
  body { background: var(--semi-color-bg-0) !important; }
  body > :not(.semi-portal):not(.semi-portal-inner) { visibility: hidden !important; }
  body > .semi-portal:not(:has([id="${panelId}"])) { visibility: hidden !important; }
  body > .semi-portal-inner:not(:has([id="${panelId}"])) { visibility: hidden !important; }
`;

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
      'border-top-left-radius',
      'border-top-right-radius',
      'border-bottom-left-radius',
      'border-bottom-right-radius',
      'outline-color',
      'outline-style',
      'outline-width',
      'outline-offset',
      'box-shadow',
      'fill',
      'opacity',
      'min-width',
      'max-width',
      'width',
      'animation-name',
      'animation-duration',
      'column-gap',
      'row-gap',
    ];
    return [
      ...(element.id === 'root' || element.hasAttribute('data-demo-preview') ? [] : [element]),
      ...element.querySelectorAll('*'),
    ]
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
          label: node.getAttribute('aria-label'),
          disabled: node.getAttribute('disabled') !== null,
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

/** Each case's first sample keeps the `default-styles`/`reference`/`vue` attachments
 *  the batch report requires; later samples carry their own state-prefixed names. */
async function compare(
  reference: Locator,
  vue: Locator,
  info: TestInfo,
  state: string,
  panelIds: readonly [string, string],
) {
  await waitForVisualAssets([reference, vue]);
  const [expected, actual] = await Promise.all([measure(reference), measure(vue)]);
  await info.attach(state === 'default' ? 'default-styles' : `${state}-styles`, {
    body: JSON.stringify({ expected, actual }),
    contentType: 'application/json',
  });
  const shots = await Promise.all([
    reference.screenshot({ style: backdropFor(panelIds[0]) }),
    vue.screenshot({ style: backdropFor(panelIds[1]) }),
  ]);
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

/** The pinned panes listen to window resize with a 10ms throttle. */
async function nudgeResize(pages: Page[]) {
  await Promise.all(
    pages.map((page) => page.evaluate(() => window.dispatchEvent(new Event('resize')))),
  );
  await pages[0]!.waitForTimeout(80);
}

async function freezeAnimations(pages: Page[], time: number) {
  await Promise.all(
    pages.map((page) =>
      page.evaluate((value) => {
        document.getAnimations().forEach((animation) => {
          animation.pause();
          animation.currentTime = value;
        });
      }, time),
    ),
  );
}

async function resumeAnimations(pages: Page[]) {
  await Promise.all(
    pages.map((page) =>
      page.evaluate(() => {
        document.getAnimations().forEach((animation) => animation.play());
      }),
    ),
  );
}

for (const locale of ['zh-cn', 'en-us'])
  for (const theme of ['light', 'dark'])
    for (const example of examples)
      for (const direction of ['ltr', 'rtl'])
        test(`Popconfirm 文档 ${example.name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
          browser,
        }, info) => {
          test.setTimeout(150_000);
          const context = await visualContext(browser, info, locale, theme, direction);
          const sourceLocale = locale === 'zh-cn' ? 'zh-cn' : 'en-us';
          try {
            const reference = await context.newPage(),
              vue = await context.newPage();
            const pages = [reference, vue];
            const errors: string[] = [];
            const editorNotices: string[] = [];
            let editorActive = false;
            for (const page of pages) {
              page.on('pageerror', (error) => errors.push(error.message));
              page.on('console', (message) => {
                if (message.type() !== 'error') return;
                const text = message.text();
                if (
                  editorActive &&
                  text === 'Blocked autofocusing on a <button> element in a cross-origin subframe.'
                )
                  editorNotices.push(text);
                else errors.push(text);
              });
              await page.addInitScript(() => {
                const win = window as unknown as {
                  popconfirmMotion: { phase: string; name: string }[];
                };
                win.popconfirmMotion = [];
                for (const phase of ['animationstart', 'animationend'])
                  document.addEventListener(
                    phase,
                    (event) => {
                      const name = (event as AnimationEvent).animationName;
                      if (/semi-tooltip-zoom/.test(name))
                        win.popconfirmMotion.push({ phase, name });
                    },
                    true,
                  );
              });
            }
            await vue.addInitScript((value) => {
              if (window === window.top) localStorage.setItem('semi-docs-theme', value);
            }, theme);
            await reference.goto(
              `${referenceOrigin}/docs.html?component=popconfirm&locale=${locale}&theme=${theme}&example=${example.index}`,
            );
            const expected = reference.locator('#root');
            await expect(expected.getByRole('button').first()).toBeVisible();
            await vue.goto(`/${locale}/components/popconfirm/`);
            const demo = vue.locator(`[data-demo-id="popconfirm/${sourceLocale}/${example.name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual.getByRole('button').first()).toBeVisible();
            const roots = [expected, actual];
            const source = await readFile(
              new URL(
                `../../src/demos/popconfirm/${sourceLocale}/${example.name}.vue`,
                import.meta.url,
              ),
              'utf8',
            );
            expect(await demo.locator('[data-demo-source] code').textContent()).toBe(source);
            for (const page of pages)
              await page.evaluate((dir) => {
                document.body.dir = dir;
                document.body.classList.toggle('semi-rtl', dir === 'rtl');
              }, direction);
            await waitForVisualAssets(roots);
            await alignRoot(expected, actual);

            // The docs page publishes every demo, and the pinned Types example opens its
            // panel on mount. Resolve the panel of the sampled trigger through the same
            // `aria-controls` wiring both implementations expose, instead of page order.
            const trigger = (page: Page, nth: number) =>
              roots[pages.indexOf(page)]!.getByRole('button').nth(nth);
            const resolvePanelIds = async (nth: number): Promise<[string, string]> => {
              const ids: string[] = [];
              for (const page of pages) {
                const element = trigger(page, nth);
                await expect(element).toHaveAttribute('aria-controls', /.+/);
                ids.push((await element.getAttribute('aria-controls'))!);
              }
              return ids as [string, string];
            };
            let panelIds: [string, string] = ['', ''];
            const panel = (page: Page) => page.locator(`[id="${panelIds[pages.indexOf(page)]}"]`);
            const card = (page: Page) => panel(page).locator('.semi-popconfirm');
            const cards = () => pages.map(card);
            const okButton = (page: Page) =>
              card(page).locator('.semi-popconfirm-footer [data-type=ok]');
            const cancelButton = (page: Page) =>
              card(page).locator('.semi-popconfirm-footer [data-type=cancel]');
            const clickAll = async (target: (page: Page) => Locator) => {
              for (const page of pages) await target(page).click();
            };
            // Wait for the panel's enter animation to actually finish before sampling.
            const settlePanel = (page: Page) =>
              panel(page).evaluate(async () => {
                await new Promise<void>((resolve) =>
                  requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
                );
                await Promise.all(
                  document
                    .getAnimations()
                    .filter(
                      (animation) =>
                        'animationName' in animation &&
                        /semi-tooltip-zoom/.test(String(animation.animationName)),
                    )
                    .map((animation) => animation.finished.catch(() => undefined)),
                );
              });
            const open = async (nth = 0) => {
              panelIds = await resolvePanelIds(nth);
              for (const page of pages) await trigger(page, nth).click();
              for (const page of pages) await expect(card(page)).toBeVisible();
              for (const page of pages) await settlePanel(page);
            };
            const closeWithEscape = async () => {
              // A loading button drops focus to the body, so re-enter the panel first;
              // Escape must reach the popup to exercise the documented close path.
              for (const page of pages) {
                await card(page).locator('.semi-popconfirm-btn-close').focus();
                await page.keyboard.press('Escape');
              }
              for (const page of pages) await expect(card(page)).toHaveCount(0);
            };
            const expectAligned = async (targets: Locator[], label: string) => {
              const boxes = await Promise.all(targets.map((target) => target.boundingBox()));
              for (const [i, box] of boxes.entries()) expect(box, `${label} ${i}`).not.toBeNull();
              for (const axis of ['x', 'y', 'width', 'height'] as const)
                expect(
                  Math.abs(boxes[0]![axis] - boxes[1]![axis]),
                  `${label} ${axis}`,
                ).toBeLessThanOrEqual(0.5);
            };
            const expectedTitle =
              locale === 'zh-cn'
                ? '确定是否要保存此修改？'
                : {
                    Basic: 'Are you sure you want to save this modification?',
                    Types: 'Are you sure to save this modification?',
                    Async: 'Are you sure to save this modification?',
                    InitialFocus: 'Are you sure you want to save this edit?',
                  }[example.name];
            const waitForToastsToClear = async () => {
              for (const page of pages)
                await expect(page.locator('.semi-toast-content')).toHaveCount(0, {
                  timeout: 8_000,
                });
            };

            if (example.name === 'Basic') {
              await test.step('默认点击打开、确认与取消提示', async () => {
                await open();
                await compare(card(reference), card(vue), info, 'default', panelIds);
                await expectAligned(cards(), 'default');
                for (const page of pages) {
                  await expect(card(page).locator('.semi-popconfirm-header-title')).toHaveText(
                    expectedTitle,
                  );
                  await expect(card(page).locator('.semi-popconfirm-body')).toHaveText(
                    locale === 'zh-cn'
                      ? '此修改将不可逆'
                      : 'This modification will be irreversible',
                  );
                  await expect(okButton(page)).toHaveText(locale === 'zh-cn' ? '确定' : 'Confirm');
                  await expect(cancelButton(page)).toHaveText(
                    locale === 'zh-cn' ? '取消' : 'Cancel',
                  );
                  expect(await panel(page).getAttribute('role')).toBe('dialog');
                }
                await clickAll(okButton);
                for (const page of pages) {
                  await expect(page.locator('.semi-toast-content')).toHaveText(
                    locale === 'zh-cn' ? '确认保存！' : 'Confirm save!',
                  );
                  await expect(card(page)).toHaveCount(0);
                }
                await waitForToastsToClear();
                await open();
                await compare(card(reference), card(vue), info, 'reopened', panelIds);
                await clickAll(cancelButton);
                for (const page of pages) {
                  await expect(page.locator('.semi-toast-content')).toHaveText(
                    locale === 'zh-cn' ? '取消保存！' : 'Cancel save!',
                  );
                  await expect(card(page)).toHaveCount(0);
                }
                await waitForToastsToClear();
              });
            }

            if (example.name === 'Types') {
              await test.step('默认打开、四种类型与局部容器对齐', async () => {
                panelIds = await resolvePanelIds(0);
                for (const page of pages) await expect(card(page)).toBeVisible();
                await nudgeResize(pages);
                for (const page of pages) await settlePanel(page);
                await compare(card(reference), card(vue), info, 'default', panelIds);
                await expectAligned(cards(), 'default');
                for (const page of pages)
                  expect(
                    await card(page).evaluate(
                      (element) =>
                        element.closest('.semi-popover-wrapper')?.parentElement?.className ?? '',
                    ),
                  ).toContain('semi-portal');
                for (const [index, type] of ['warning', 'danger', 'tertiary'].entries()) {
                  // The styled wrapper is the hit target; the native input stays visually hidden.
                  for (const root of roots)
                    await root
                      .locator('.semi-radio')
                      .nth(index + 1)
                      .click();
                  await compare(card(reference), card(vue), info, `type-${type}`, panelIds);
                  await expectAligned(cards(), `type-${type}`);
                  const [referenceColor, vueColor] = await Promise.all(
                    pages.map((page) =>
                      card(page)
                        .locator('.semi-popconfirm-header-icon .semi-icon')
                        .evaluate((node) => getComputedStyle(node).color),
                    ),
                  );
                  expect(vueColor, type).toBe(referenceColor);
                  expect(vueColor, type).not.toBe('rgba(0, 0, 0, 0)');
                  const [referenceOk, vueOk] = await Promise.all(
                    pages.map((page) => okButton(page).getAttribute('class')),
                  );
                  expect(vueOk, type).toBe(referenceOk);
                  if (type === 'danger') expect(vueOk, type).toContain('semi-button-danger');
                }
                // This example is controlled, so Escape is a documented no-op; the
                // trigger toggle drives the real exit instead.
                for (const page of pages) await trigger(page, 0).click();
                for (const page of pages) await expect(card(page)).toHaveCount(0);
              });
            }

            if (example.name === 'Async') {
              await test.step('确认 promise 延时关闭与 loading 态', async () => {
                await open();
                await compare(card(reference), card(vue), info, 'default', panelIds);
                await clickAll(okButton);
                for (const page of pages)
                  await expect(
                    card(page).locator(
                      '.semi-popconfirm-footer [data-type=ok].semi-button-loading',
                    ),
                  ).toHaveCount(1);
                // Sample the spinner at one explicit time instead of racing the rotation.
                await freezeAnimations(pages, 300);
                await compare(card(reference), card(vue), info, 'confirm-loading', panelIds);
                await resumeAnimations(pages);
                for (const page of pages)
                  await expect(card(page)).toHaveCount(0, { timeout: 6_000 });
              });
              await test.step('取消 promise reject 保持打开并清除 loading', async () => {
                await open();
                await clickAll(cancelButton);
                for (const page of pages)
                  await expect(
                    card(page).locator(
                      '.semi-popconfirm-footer [data-type=cancel].semi-button-loading',
                    ),
                  ).toHaveCount(1);
                for (const page of pages) {
                  await expect(
                    card(page).locator(
                      '.semi-popconfirm-footer [data-type=cancel].semi-button-loading',
                    ),
                  ).toHaveCount(0, { timeout: 6_000 });
                  await expect(card(page)).toBeVisible();
                }
                await compare(card(reference), card(vue), info, 'cancel-rejected', panelIds);
                // The click trigger re-opens rather than toggles; the close icon path
                // is the documented non-destructive way out after a rejected promise.
                await closeWithEscape();
              });
            }

            if (example.name === 'InitialFocus') {
              const focused = (page: Page) =>
                page.evaluate(() => {
                  const element = document.activeElement as HTMLElement | null;
                  return {
                    tag: element?.tagName ?? null,
                    dataType: element?.getAttribute('data-type') ?? null,
                    placeholder: element?.getAttribute('placeholder') ?? null,
                  };
                });
              const expectations = [
                { dataType: 'ok', placeholder: null },
                { dataType: 'cancel', placeholder: null },
                { dataType: null, placeholder: 'focus here' },
              ] as const;
              for (const [i, want] of expectations.entries())
                await test.step(`初始焦点位置 ${i}`, async () => {
                  await open(i);
                  await compare(
                    card(reference),
                    card(vue),
                    info,
                    i === 0 ? 'default' : `focus-${i}`,
                    panelIds,
                  );
                  const [referenceFocus, vueFocus] = await Promise.all(pages.map(focused));
                  expect(vueFocus).toEqual(referenceFocus);
                  if (want.dataType) expect(vueFocus!.dataType, `focus-${i}`).toBe(want.dataType);
                  if (want.placeholder)
                    expect(vueFocus!.placeholder, `focus-${i}`).toBe(want.placeholder);
                  await closeWithEscape();
                });
            }

            await test.step('进入与退出动效真实发生', async () => {
              for (const [i, page] of pages.entries()) {
                const motion = await page.evaluate(
                  () =>
                    (
                      window as unknown as {
                        popconfirmMotion: { phase: string; name: string }[];
                      }
                    ).popconfirmMotion,
                );
                await info.attach(`motion-${i}`, {
                  body: JSON.stringify(motion),
                  contentType: 'application/json',
                });
                expect(
                  motion.some(
                    (item) => item.phase === 'animationstart' && /zoomIn/.test(item.name),
                  ),
                ).toBe(true);
                expect(
                  motion.some((item) => item.phase === 'animationend' && /zoomOut/.test(item.name)),
                ).toBe(true);
              }
            });

            if (theme === 'light' && direction === 'ltr')
              await test.step('源码、重置、真实编辑器交互及退出', async () => {
                const button = (zh: string, en: string) =>
                  demo.getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
                await button('查看源码', 'View source').click();
                await expect(demo.locator('[data-demo-source]')).toBeVisible();
                await button('查看源码', 'View source').click();
                await button('重置', 'Reset').click();
                await expect(actual.getByRole('button').first()).toBeVisible();
                editorActive = true;
                await button('在线编辑', 'Edit online').click();
                const preview = demo.frameLocator('iframe').locator('#app');
                await expect(preview.getByRole('button').first()).toBeVisible({ timeout: 30_000 });
                await demo.locator('iframe').scrollIntoViewIfNeeded();
                const editorCard = demo.frameLocator('iframe').locator('.semi-popconfirm');
                // Types is controlled and already open; the other examples open on click.
                if (example.name !== 'Types') {
                  await preview.getByRole('button').first().click();
                }
                await expect(editorCard).toBeVisible();
                await expect(editorCard.locator('.semi-popconfirm-header-title')).toHaveText(
                  expectedTitle,
                );
                if (example.name === 'Types') await preview.getByRole('button').first().click();
                else await demo.frameLocator('iframe').locator('body').press('Escape');
                await expect(editorCard).toHaveCount(0);
                await expect(demo.locator('.msg.err')).toHaveCount(0);
                await button('退出编辑', 'Close editor').click();
                await expect(demo.locator('iframe')).toHaveCount(0);
                editorActive = false;
                await info.attach('editor-browser-notices', {
                  body: JSON.stringify(editorNotices),
                  contentType: 'application/json',
                });
                await expect(actual.getByRole('button').first()).toBeVisible();
              });

            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'feedback/popconfirm',
                index: example.index,
                name: example.name,
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
