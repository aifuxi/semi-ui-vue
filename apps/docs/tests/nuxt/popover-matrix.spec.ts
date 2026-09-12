import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type TestInfo } from '@playwright/test';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

test.use({ actionTimeout: 10_000 });
const referenceOrigin = 'http://127.0.0.1:4173';
const triggerSelector = '[data-popupid]';
const examples = [
  { name: 'TriggerChildren', index: 1 },
  { name: 'Basic', index: 2 },
  { name: 'Position', index: 3 },
  { name: 'Controlled', index: 4 },
  { name: 'Condition', index: 5 },
  { name: 'Arrow', index: 6 },
  { name: 'ArrowCenter', index: 7 },
  { name: 'Color', index: 8 },
  { name: 'InitialFocus', index: 9 },
] as const;

// Sample the complete linked panel over the same flat backdrop. Trigger and panel
// absolute geometry are asserted separately before screenshot-only backdrop styling.
const backdropFor = (panelId: string) => `
  body { background: var(--semi-color-bg-0) !important; }
  body > :not(.semi-portal):not(.semi-portal-inner) { visibility: hidden !important; }
  body > .semi-portal:not(:has([id="${panelId}"])) { visibility: hidden !important; }
  body > .semi-portal-inner:not(:has([id="${panelId}"])) { visibility: hidden !important; }
  [id="${panelId}"] { visibility: visible !important; }
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
      'transform',
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
  panelIds?: readonly [string, string],
) {
  await waitForVisualAssets([reference, vue]);
  // The fixed demos have no infinite animations. Setting RTL after mounting
  // transitions Switch's checked knob; sample its real terminal transform.
  await Promise.all(
    [reference, vue].map((target) =>
      target.evaluate(async (element) => {
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        );
        await Promise.all(
          element
            .getAnimations({ subtree: true })
            .map((animation) => animation.finished.catch(() => undefined)),
        );
      }),
    ),
  );
  const [expected, actual] = await Promise.all([measure(reference), measure(vue)]);
  await info.attach(state === 'default' ? 'default-styles' : `${state}-styles`, {
    body: JSON.stringify({ expected, actual }),
    contentType: 'application/json',
  });
  // Playwright 1.62 screenshotPage uses viewport-relative clip without the
  // screenshotElement scrollIntoView step (coreBundle.js screenshotPage).
  const targets = [reference, vue];
  const before = await Promise.all(
    targets.map(async (target) => ({
      box: (await target.boundingBox())!,
      scroll: await target.page().evaluate(() => ({ x: scrollX, y: scrollY })),
    })),
  );
  for (const [i, target] of targets.entries()) {
    const box = before[i]!.box;
    const viewport = target.page().viewportSize()!;
    expect(box.x, `${state} viewport left`).toBeGreaterThanOrEqual(0);
    expect(box.y, `${state} viewport top`).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width, `${state} viewport right`).toBeLessThanOrEqual(viewport.width);
    expect(box.y + box.height, `${state} viewport bottom`).toBeLessThanOrEqual(viewport.height);
    if (panelIds)
      expect(
        await target.evaluate((element) => {
          const b = element.getBoundingClientRect();
          const inset = Math.min(8, b.width / 4, b.height / 4);
          return [
            [b.x + b.width / 2, b.y + b.height / 2],
            [b.x + inset, b.y + inset],
            [b.right - inset, b.y + inset],
            [b.x + inset, b.bottom - inset],
            [b.right - inset, b.bottom - inset],
          ].every(([x, y]) => element.contains(document.elementFromPoint(x!, y!)));
        }),
        `${state} full panel unobstructed`,
      ).toBe(true);
  }
  const shots = await Promise.all(
    targets.map((target, i) =>
      target.page().screenshot({
        clip: before[i]!.box,
        ...(panelIds ? { style: backdropFor(panelIds[i]!) } : {}),
      }),
    ),
  );
  for (const [i, target] of targets.entries()) {
    expect(
      await target.page().evaluate(() => ({ x: scrollX, y: scrollY })),
      `${state} screenshot preserves scroll`,
    ).toEqual(before[i]!.scroll);
    const after = (await target.boundingBox())!;
    for (const axis of ['x', 'y', 'width', 'height'] as const)
      expect(
        Math.abs(after[axis] - before[i]!.box[axis]),
        `${state} screenshot preserves ${axis}`,
      ).toBeLessThanOrEqual(0.5);
  }
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

const counts: Record<string, number> = {
  TriggerChildren: 3,
  Basic: 1,
  Position: 12,
  Controlled: 1,
  Condition: 2,
  Arrow: 12,
  ArrowCenter: 12,
  Color: 1,
  InitialFocus: 1,
};

for (const locale of ['zh-cn', 'en-us'])
  for (const theme of ['light', 'dark'])
    for (const example of examples)
      for (const direction of ['ltr', 'rtl'])
        test(`Popover 文档 ${example.name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
          browser,
        }, info) => {
          test.setTimeout(180_000);
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
              `${referenceOrigin}/docs.html?component=popover&locale=${locale}&theme=${theme}&example=${example.index}`,
            );
            const expected = reference.locator('#root');
            await expect(expected.locator(triggerSelector).first()).toBeVisible();
            await vue.goto(`/${locale}/components/popover/`);
            const demo = vue.locator(`[data-demo-id="popover/${locale}/${example.name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            const roots = [expected, actual];
            for (const root of roots)
              await expect(root.locator(triggerSelector)).toHaveCount(counts[example.name]!);
            const source = await readFile(
              new URL(`../../src/demos/popover/${locale}/${example.name}.vue`, import.meta.url),
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
            const triggers = roots.map((root) => root.locator(triggerSelector));
            const isDialog = (n: number) =>
              ['Controlled', 'Color', 'InitialFocus'].includes(example.name) ||
              (example.name === 'Condition' && n === 1);
            // Fixed RadioGroup deliberately only forwards its named ARIA props and
            // data-*; Tooltip still supplies data-popupid through getDataAttr(rest).
            const filtersDialogAria = example.name === 'Controlled' && locale === 'zh-cn';
            const association = (n: number) =>
              filtersDialogAria
                ? 'data-popupid'
                : isDialog(n)
                  ? 'aria-controls'
                  : 'aria-describedby';
            const assertTrigger = async (trigger: Locator, n: number, visible: boolean) => {
              await expect(trigger).toHaveAttribute('data-popupid', /.+/);
              if (filtersDialogAria) {
                for (const attribute of [
                  'aria-controls',
                  'aria-describedby',
                  'aria-expanded',
                  'aria-haspopup',
                ])
                  expect(
                    await trigger.getAttribute(attribute),
                    `fixed RadioGroup excludes ${attribute}`,
                  ).toBeNull();
                return;
              }
              await expect(trigger).toHaveAttribute(
                association(n),
                (await trigger.getAttribute('data-popupid'))!,
              );
              expect(
                await trigger.getAttribute(isDialog(n) ? 'aria-describedby' : 'aria-controls'),
              ).toBeNull();
              if (isDialog(n)) {
                await expect(trigger).toHaveAttribute('aria-expanded', String(visible));
                await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
              } else {
                expect(await trigger.getAttribute('aria-expanded')).toBeNull();
                expect(await trigger.getAttribute('aria-haspopup')).toBeNull();
              }
            };
            for (const trigger of triggers)
              for (let n = 0; n < counts[example.name]!; n++)
                await assertTrigger(trigger.nth(n), n, example.name === 'Color');
            let ids: [string, string] = ['', ''];
            let activeTrigger = 0;
            const panels = () => pages.map((page, i) => page.locator(`[id="${ids[i]}"]`));
            const settle = async () => {
              for (const panel of panels()) {
                await expect(panel).toBeVisible();
                await panel.evaluate(async (element) => {
                  await new Promise<void>((resolve) =>
                    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
                  );
                  await Promise.all(
                    (element.closest('.semi-popover-wrapper') ?? element)
                      .getAnimations({ subtree: true })
                      .map((animation) => animation.finished.catch(() => undefined)),
                  );
                });
              }
            };
            const identify = async (n: number) => {
              activeTrigger = n;
              ids = (await Promise.all(
                triggers.map((trigger) => trigger.nth(n).getAttribute(association(n))),
              )) as [string, string];
            };
            const sample = async (state: string) => {
              await settle();
              const triggerBoxes = await Promise.all(
                triggers.map((trigger) => trigger.nth(activeTrigger).boundingBox()),
              );
              for (const axis of ['x', 'y', 'width', 'height'] as const)
                expect(
                  Math.abs(triggerBoxes[0]![axis] - triggerBoxes[1]![axis]),
                  `${state} trigger ${axis}`,
                ).toBeLessThanOrEqual(0.5);
              const targets = panels();
              const boxes = await Promise.all(targets.map((target) => target.boundingBox()));
              for (const axis of ['x', 'y', 'width', 'height'] as const)
                expect(
                  Math.abs(boxes[0]![axis] - boxes[1]![axis]),
                  `${state} panel ${axis}`,
                ).toBeLessThanOrEqual(0.5);
              await compare(targets[0]!, targets[1]!, info, state, ids);
              const afterTriggers = await Promise.all(
                triggers.map((trigger) => trigger.nth(activeTrigger).boundingBox()),
              );
              const afterPanels = await Promise.all(targets.map((target) => target.boundingBox()));
              for (const axis of ['x', 'y', 'width', 'height'] as const) {
                expect(
                  Math.abs(afterTriggers[0]![axis] - afterTriggers[1]![axis]),
                  `${state} post screenshot trigger ${axis}`,
                ).toBeLessThanOrEqual(0.5);
                expect(
                  Math.abs(afterPanels[0]![axis] - afterPanels[1]![axis]),
                  `${state} post screenshot panel ${axis}`,
                ).toBeLessThanOrEqual(0.5);
              }
            };
            const controlled = example.name === 'Controlled';
            const click = example.name === 'InitialFocus' || controlled;
            const open = async (n: number) => {
              await identify(n);
              for (const [i, trigger] of triggers.entries()) {
                if (controlled && locale === 'zh-cn')
                  await roots[i]!.locator('.semi-radio').first().click();
                else if (click || (example.name === 'Condition' && n === 1))
                  await trigger.nth(n).click();
                else await trigger.nth(n).hover();
              }
              await settle();
              for (const trigger of triggers) await assertTrigger(trigger.nth(n), n, true);
            };
            const close = async (n: number) => {
              for (const [i, page] of pages.entries()) {
                if (controlled) {
                  if (locale === 'zh-cn') await roots[i]!.locator('.semi-radio').last().click();
                  else await triggers[i]!.nth(n).click();
                } else if (click || (example.name === 'Condition' && n === 1)) {
                  if (example.name === 'InitialFocus')
                    await expect(panels()[i]!.locator('input')).toBeFocused();
                  else await triggers[i]!.nth(n).focus();
                  await page.keyboard.press('Escape');
                } else await page.mouse.move(0, 0);
              }
              for (const panel of panels()) await expect(panel).toHaveCount(0);
              for (const trigger of triggers) await assertTrigger(trigger.nth(n), n, false);
            };
            await test.step('默认主体完整样式、几何及像素', async () => {
              for (const page of pages) await page.mouse.move(0, 0);
              if (example.name === 'Color') {
                await identify(0);
                for (const page of pages)
                  await page.evaluate(() => window.dispatchEvent(new Event('resize')));
                await settle();
              }
              await compare(expected, actual, info, 'default');
            });
            if (example.name === 'Color') {
              await test.step('固定默认展开、局部 Portal 与蓝色箭头', async () => {
                await identify(0);
                // Moving the reference root changes the containing block; resize is the
                // pinned positioning listener's public refresh event (10ms throttle).
                for (const page of pages)
                  await page.evaluate(() => window.dispatchEvent(new Event('resize')));
                await sample('opened');
                for (const [i, panel] of panels().entries()) {
                  expect(
                    await panel.evaluate(
                      (element) => !!element.closest('[data-demo-preview], #root'),
                    ),
                  ).toBe(true);
                  await expect(triggers[i]!.first()).toHaveAttribute('aria-expanded', 'true');
                }
              });
            } else {
              for (let n = 0; n < counts[example.name]!; n++)
                await test.step(`触发器 ${n + 1} 打开、几何、退出与重开`, async () => {
                  await open(n);
                  await sample(n === 0 ? 'opened' : `trigger-${n}`);
                  for (const panel of panels()) {
                    await expect(panel).toHaveAttribute(
                      'role',
                      click || (example.name === 'Condition' && n === 1) ? 'dialog' : 'tooltip',
                    );
                    expect(
                      await panel.evaluate(
                        (element) => !!element.closest('.semi-portal, .semi-portal-inner'),
                      ),
                    ).toBe(true);
                  }
                  if (example.name === 'InitialFocus') {
                    for (const page of pages)
                      await expect(
                        page.locator('input[placeholder="focus here"]:focus'),
                      ).toHaveCount(1);
                    for (const panel of panels())
                      await panel.locator('input').fill('focus contract');
                  }
                  if (controlled) {
                    for (const trigger of triggers) await trigger.first().press('Escape');
                    for (const panel of panels()) await expect(panel).toBeVisible();
                  }
                  await close(n);
                  if (example.name === 'InitialFocus')
                    for (const trigger of triggers) await expect(trigger.first()).toBeFocused();
                  await open(n);
                  if (example.name === 'InitialFocus')
                    for (const panel of panels())
                      await expect(panel.locator('input')).toHaveValue('');
                  await close(n);
                });
              if (example.name === 'Condition')
                await test.step('condition false 禁止 hover/click，恢复后重开', async () => {
                  for (const root of roots) await root.getByRole('switch').click();
                  for (const root of roots)
                    await expect(root.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
                  for (let n = 0; n < 2; n++) {
                    await identify(n);
                    for (const trigger of triggers) {
                      if (n === 0) await trigger.nth(n).hover();
                      else await trigger.nth(n).click();
                    }
                    // mouseEnterDelay is 50ms in the fixed baseline, with no observable
                    // timer terminal when condition suppresses opening.
                    await pages[0]!.waitForTimeout(100);
                    for (const panel of panels()) await expect(panel).toHaveCount(0);
                    for (const page of pages) await page.mouse.move(0, 0);
                  }
                  for (const root of roots) await root.getByRole('switch').click();
                  await open(0);
                  await close(0);
                  await open(1);
                  await close(1);
                });
            }
            if (theme === 'light' && direction === 'ltr')
              await test.step('源码与重置', async () => {
                const button = (zh: string, en: string) =>
                  demo.getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
                await button('查看源码', 'View source').click();
                await expect(demo.locator('[data-demo-source]')).toBeVisible();
                await button('查看源码', 'View source').click();
                await button('重置', 'Reset').click();
                await expect(actual.locator(triggerSelector)).toHaveCount(counts[example.name]!);
              });
            if (theme === 'light' && direction === 'ltr')
              await test.step('真实编辑器加载与交互', async () => {
                const button = (zh: string, en: string) =>
                  demo.getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
                await button('在线编辑', 'Edit online').click();
                const frame = demo.frameLocator('iframe');
                const preview = frame.locator('#app');
                await expect(preview.locator(triggerSelector)).toHaveCount(counts[example.name]!, {
                  timeout: 30_000,
                });
                await demo.locator('iframe').scrollIntoViewIfNeeded();
                const trigger = preview.locator(triggerSelector).first();
                await assertTrigger(trigger, 0, example.name === 'Color');
                const id = await trigger.getAttribute(association(0));
                const panel = frame.locator(`[id="${id}"]`);
                if (example.name !== 'Color') {
                  if (controlled && locale === 'zh-cn')
                    await preview.locator('.semi-radio').first().click();
                  else if (click) await trigger.click();
                  else await trigger.hover();
                }
                await expect(panel).toBeVisible();
                await expect(panel).toHaveAttribute('role', isDialog(0) ? 'dialog' : 'tooltip');
                await assertTrigger(trigger, 0, true);
                if (controlled) {
                  if (locale === 'zh-cn') await preview.locator('.semi-radio').last().click();
                  else await trigger.click();
                } else if (click) await trigger.press('Escape');
                else if (example.name !== 'Color') await vue.mouse.move(0, 0);
                if (example.name !== 'Color') {
                  await expect(panel).toHaveCount(0);
                  await assertTrigger(trigger, 0, false);
                }
                await expect(demo.locator('.msg.err')).toHaveCount(0);
                await button('退出编辑', 'Close editor').click();
                await expect(demo.locator('iframe')).toHaveCount(0);
              });
            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'show/popover',
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
