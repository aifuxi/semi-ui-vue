import { readFile } from 'node:fs/promises';
import { test, expect, type Locator, type TestInfo } from '@playwright/test';
import { visualContext } from './visual-context';
import { freezeAnimations } from './demo-parity';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

const examples = ['TimeZone', 'Consumer', 'Direction'];
// Steps contains its own grid rows; crop only the ten upstream showcase rows.
const showcaseRows = '.semi-row:not(.semi-steps .semi-row)';
async function measure(root: Locator) {
  return root.evaluate((element) => {
    const origin = element.getBoundingClientRect();
    return [element, ...element.querySelectorAll('*')]
      .filter((node) => node.matches('[class*="semi-"], input, textarea, h3, h5, strong'))
      .map((node) => {
        const style = getComputedStyle(node),
          rect = node.getBoundingClientRect();
        return {
          tag: node.tagName,
          classes: [...node.classList].filter((c) => c.startsWith('semi-')).sort(),
          text: node.children.length ? null : node.textContent,
          value:
            node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement
              ? node.value
              : null,
          role: node.getAttribute('role'),
          ariaLabel: node.getAttribute('aria-label'),
          ariaHidden: node.getAttribute('aria-hidden'),
          readonly: node.getAttribute('readonly') !== null,
          disabled: node.getAttribute('disabled'),
          ariaChecked: node.getAttribute('aria-checked'),
          ariaExpanded: node.getAttribute('aria-expanded'),
          styles: Object.fromEntries(
            [
              'color',
              'background-color',
              'background-image',
              'font-family',
              'font-size',
              'font-weight',
              'line-height',
              'display',
              'direction',
              'text-align',
              'overflow-wrap',
              'word-break',
              'white-space',
              'align-items',
              'justify-content',
              'padding-top',
              'padding-right',
              'padding-bottom',
              'padding-left',
              'margin-top',
              'margin-right',
              'margin-bottom',
              'margin-left',
              'border-top-width',
              'border-right-width',
              'border-bottom-width',
              'border-left-width',
              'box-sizing',
              'min-width',
              'flex-shrink',
              'border-top-color',
              'border-radius',
              'box-shadow',
              'opacity',
              'transform',
              'fill',
              'stroke',
            ].map((key) => [key, style.getPropertyValue(key)]),
          ),
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
  const [expected, actual] = await Promise.all([measure(reference), measure(vue)]);
  await info.attach(`${state}-styles`, {
    body: JSON.stringify({ expected, actual }),
    contentType: 'application/json',
  });
  expect(actual.length, state).toBe(expected.length);
  for (const [index, a] of actual.entries()) {
    const { rect: ar, ...av } = a,
      { rect: er, ...ev } = expected[index]!;
    expect(av, `${state} node ${index}`).toEqual(ev);
    for (const axis of ['x', 'y', 'width', 'height'] as const)
      expect(Math.abs(ar[axis] - er[axis]), `${state} node ${index} ${axis}`).toBeLessThanOrEqual(
        0.5,
      );
  }
}
async function pixels(reference: Locator, vue: Locator, info: TestInfo, state: string) {
  const images = await Promise.all(
    [reference, vue].map(async (root) => {
      // Keep fractional element edges away from viewport clipping during locator capture.
      await root.evaluate((element) =>
        element.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' }),
      );
      if (
        !(await root.evaluate((element) =>
          element.matches('.semi-badge, .semi-tooltip-wrapper, .semi-popover-wrapper'),
        ))
      )
        return root.screenshot();
      // Badge counters and popup arrows extend outside the host box; include their painted bounds.
      const clip = await root.evaluate((element) => {
        const rects = [element, ...element.querySelectorAll('*')]
          .map((node) => node.getBoundingClientRect())
          .filter((rect) => rect.width && rect.height);
        const x = Math.floor(Math.min(...rects.map((rect) => rect.left))) - 1;
        const y = Math.floor(Math.min(...rects.map((rect) => rect.top))) - 1;
        return {
          x,
          y,
          width: Math.ceil(Math.max(...rects.map((rect) => rect.right))) + 1 - x,
          height: Math.ceil(Math.max(...rects.map((rect) => rect.bottom))) + 1 - y,
        };
      });
      return root.page().screenshot({ clip });
    }),
  );
  await info.attach(state === 'default' ? 'reference' : `${state}-reference`, {
    body: images[0]!,
    contentType: 'image/png',
  });
  await info.attach(state === 'default' ? 'vue' : `${state}-vue`, {
    body: images[1]!,
    contentType: 'image/png',
  });
  await expectScreenshotPixelsToMatch(vue.page(), images[1]!, images[0]!, state);
}
for (const locale of ['zh-cn', 'en-us'])
  for (const theme of ['light', 'dark'])
    for (const [index, name] of examples.entries())
      for (const direction of name === 'Direction' ? ['ltr', 'rtl'] : ['ltr'])
        test(`ConfigProvider 文档 ${name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
          browser,
        }, info) => {
          test.setTimeout(120_000);
          const context = await visualContext(browser, info, locale, theme, direction);
          try {
            const reference = await context.newPage(),
              vue = await context.newPage();
            const errors: string[] = [];
            const upstreamWarnings: string[] = [];
            for (const page of [reference, vue]) {
              page.on('pageerror', (error) => errors.push(error.message));
              page.on('console', (message) => {
                if (message.type() !== 'error') return;
                // The pinned RTL example passes ghost=false, an unsupported DOM attribute.
                if (
                  page === reference &&
                  name === 'Direction' &&
                  message
                    .text()
                    .startsWith('Warning: Received `%s` for a non-boolean attribute `%s`.') &&
                  message.text().includes('false ghost')
                )
                  upstreamWarnings.push(message.text());
                else errors.push(message.text());
              });
              await page.clock.install({ time: new Date('2024-08-15T10:24:30+08:00') });
            }
            await vue.addInitScript((value) => {
              if (window === window.top) localStorage.setItem('semi-docs-theme', value);
            }, theme);
            await Promise.all([
              reference.goto(
                `http://127.0.0.1:4173/docs.html?component=config-provider&locale=${locale}&theme=${theme}&example=${index + 1}`,
              ),
              vue.goto(`/${locale}/components/config-provider/`),
            ]);
            const expected = reference.locator('#root');
            const demo = vue.locator(`[data-demo-id="config-provider/${locale}/${name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual).toBeVisible();
            for (const root of [expected, actual])
              await expect(
                root.locator('.semi-select, .semi-typography, .semi-button').first(),
              ).toBeVisible();
            const source = await readFile(
              new URL(`../../src/demos/config-provider/${locale}/${name}.vue`, import.meta.url),
              'utf8',
            );
            await expect(demo.locator('[data-demo-source] code')).toHaveText(source, {
              useInnerText: false,
            });
            await Promise.all(
              [reference, vue].map((page) =>
                page.evaluate(async () => {
                  await Promise.all([
                    document.fonts.load('12px Inter'),
                    document.fonts.load('600 14px Inter'),
                  ]);
                  await document.fonts.ready;
                }),
              ),
            );
            if (name === 'Direction')
              for (const root of [expected, actual])
                await root
                  .getByRole('button', { name: direction.toUpperCase(), exact: true })
                  .click();
            await actual.scrollIntoViewIfNeeded();
            const box = await actual.boundingBox();
            await expected.evaluate(
              (element, rect) =>
                Object.assign((element as HTMLElement).style, {
                  boxSizing: 'border-box',
                  padding: '24px',
                  width: `${rect!.width}px`,
                  position: 'relative',
                  left: `${rect!.x}px`,
                  top: `${rect!.y}px`,
                }),
              box,
            );
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
            await freezeAnimations([reference, vue], 300);
            // Retain tight diagnostic crops even when a style/DOM assertion rejects the batch.
            const crops =
              name === 'Direction'
                ? showcaseRows
                : name === 'TimeZone'
                  ? '.semi-select, .semi-datepicker, .semi-timepicker'
                  : '.semi-typography';
            for (const [engine, root] of [
              ['reference', expected],
              ['vue', actual],
            ] as const)
              for (let crop = 0; crop < (await root.locator(crops).count()); crop++)
                await info.attach(`default-crop-${crop}-${engine}`, {
                  body: await root.locator(crops).nth(crop).screenshot(),
                  contentType: 'image/png',
                });
            await freezeAnimations([reference, vue], 300);
            await compare(expected, actual, info, 'default');
            expect((await actual.textContent())?.replace(/\s+/g, ' ').trim()).toBe(
              (await expected.textContent())?.replace(/\s+/g, ' ').trim(),
            );
            if (name === 'Direction') {
              const controls =
                '.semi-button, .semi-input-wrapper, .semi-input-textarea-wrapper, .semi-select, .semi-cascader, .semi-switch, .semi-checkbox, .semi-radio, .semi-breadcrumb, .semi-navigation, .semi-pagination, .semi-steps, .semi-tag, .semi-badge, .semi-rating, .semi-timeline, .semi-spin';
              const count = await expected.locator(controls).count();
              await expect(actual.locator(controls)).toHaveCount(count);
              for (let item = 0; item < count; item++)
                await pixels(
                  expected.locator(controls).nth(item),
                  actual.locator(controls).nth(item),
                  info,
                  `control-${item}`,
                );
              // Crop each full component row; never dilute the showcase in a page-size image.
              for (let row = 0; row < 10; row++) {
                await pixels(
                  expected.locator(showcaseRows).nth(row),
                  actual.locator(showcaseRows).nth(row),
                  info,
                  row === 0 ? 'default' : `row-${row}`,
                );
              }
              for (const root of [expected, actual]) {
                await expect(root.locator('.semi-rtl').first()).toHaveCount(
                  direction === 'rtl' ? 1 : 0,
                );
                const input = root.locator('.semi-input-wrapper input').first();
                await input.fill('ConfigProvider');
                await expect(input).toHaveValue('ConfigProvider');
                await root.getByRole('switch').nth(1).click();
                await expect(root.getByRole('switch').nth(1)).toHaveAttribute(
                  'aria-checked',
                  'true',
                );
              }
              await freezeAnimations([reference, vue], 300);
              await compare(expected, actual, info, 'input-changed');
              for (const [label, englishLabel, popup, close] of [
                [
                  '成功信息的通知',
                  'Notification of success information',
                  '.semi-notification-notice',
                  '.semi-notification-notice-icon-close',
                ],
                [
                  '成功信息的弹窗',
                  'Modal of success information',
                  '.semi-modal-content',
                  '.semi-modal-footer .semi-button',
                ],
                [
                  '成功信息的提示',
                  'Toast of success information',
                  '.semi-toast',
                  '.semi-toast-close-button button',
                ],
              ] as const) {
                for (const root of [expected, actual]) {
                  await root
                    .getByRole('button', {
                      name: locale === 'zh-cn' ? label : englishLabel,
                      exact: true,
                    })
                    .click();
                  await root.page().clock.runFor(300);
                  await expect(root.page().locator(popup)).toBeVisible();
                }
                await freezeAnimations([reference, vue], 300);
                const [referenceBox, vueBox] = await Promise.all([
                  reference.locator(popup).boundingBox(),
                  vue.locator(popup).boundingBox(),
                ]);
                expect(referenceBox).not.toBeNull();
                expect(vueBox).not.toBeNull();
                await info.attach(`${label}-position`, {
                  body: JSON.stringify({ expected: referenceBox, actual: vueBox }),
                  contentType: 'application/json',
                });
                for (const axis of ['x', 'y', 'width', 'height'] as const)
                  expect(
                    Math.abs(vueBox![axis] - referenceBox![axis]),
                    `${label} ${axis}`,
                  ).toBeLessThanOrEqual(0.5);
                await compare(reference.locator(popup), vue.locator(popup), info, label);
                // Rounded transparent corners sample the host page. Keep the two host backdrops identical,
                // without changing the popup, its real mask, or any screenshot pixels.
                const backdrops = await Promise.all(
                  [reference, vue].map((page) =>
                    page.evaluate(() => {
                      const app =
                        document.getElementById('root') ?? document.getElementById('__nuxt')!;
                      const previous = {
                        opacity: app.style.opacity,
                        background: document.body.style.backgroundColor,
                      };
                      app.style.opacity = '0';
                      document.body.style.backgroundColor = 'var(--semi-color-bg-0)';
                      return previous;
                    }),
                  ),
                );
                try {
                  await pixels(reference.locator(popup), vue.locator(popup), info, label);
                } finally {
                  await Promise.all(
                    [reference, vue].map((page, index) =>
                      page.evaluate((previous) => {
                        const app =
                          document.getElementById('root') ?? document.getElementById('__nuxt')!;
                        app.style.opacity = previous!.opacity;
                        document.body.style.backgroundColor = previous!.background;
                      }, backdrops[index]),
                    ),
                  );
                }
                for (const page of [reference, vue]) {
                  await page.locator(popup).locator(close).first().press('Enter');
                  await page.clock.runFor(1000);
                  await expect(page.locator(popup)).toHaveCount(0);
                }
              }
            } else {
              const selector =
                name === 'TimeZone'
                  ? '.semi-select, .semi-datepicker, .semi-timepicker'
                  : '.semi-typography';
              const targets = expected.locator(selector);
              for (let item = 0; item < (await targets.count()); item++)
                await pixels(
                  targets.nth(item),
                  actual.locator(selector).nth(item),
                  info,
                  item === 0 ? 'default' : `input-${item}`,
                );
              if (name === 'TimeZone') {
                for (const root of [expected, actual]) {
                  await root.locator('.semi-select').click();
                  await expect(root.page().getByRole('option')).toHaveCount(26);
                  await root
                    .page()
                    .getByRole('option')
                    .filter({ hasText: /^GMT\+00:00$/ })
                    .click();
                  await expect(root.locator('.semi-select')).toContainText('GMT+00:00');
                }
                await freezeAnimations([reference, vue], 300);
                await compare(expected, actual, info, 'timezone-changed');
                for (let item = 0; item < (await targets.count()); item++)
                  await pixels(
                    targets.nth(item),
                    actual.locator(selector).nth(item),
                    info,
                    `changed-${item}`,
                  );
                for (const root of [expected, actual]) {
                  for (const picker of ['.semi-datepicker', '.semi-timepicker']) {
                    const input = root.locator(`${picker} input`);
                    await input.hover();
                    await root.locator(`${picker} .semi-input-clearbtn`).click();
                    await expect(input).toHaveValue('');
                  }
                  // Commit a new time through the public keyboard/blur path in the active timezone.
                  const timeInput = root.locator('.semi-timepicker input');
                  await timeInput.fill('14:30:00');
                  await timeInput.press('Tab');
                  await expect(timeInput).toHaveValue('14:30:00');
                  await root.page().mouse.move(1400, 880);
                }
                await freezeAnimations([reference, vue], 300);
                await compare(expected, actual, info, 'cleared-and-keyboard-input');
              } else {
                // Diagnostic crops scroll each host independently. Restore identical trigger coordinates
                // before comparing absolute popup placement.
                const triggerRects = await Promise.all(
                  [expected, actual].map((root) =>
                    root.locator('.semi-typography').first().boundingBox(),
                  ),
                );
                await info.attach('tooltip-trigger-position', {
                  body: JSON.stringify(triggerRects),
                  contentType: 'application/json',
                });
                await expected.evaluate((element, rects) => {
                  const root = element as HTMLElement;
                  root.style.left = `${parseFloat(root.style.left) + rects[1]!.x - rects[0]!.x}px`;
                  root.style.top = `${parseFloat(root.style.top) + rects[1]!.y - rects[0]!.y}px`;
                }, triggerRects);
                for (const root of [expected, actual])
                  await root.locator('.semi-typography').first().hover();
                for (const page of [reference, vue]) await page.clock.runFor(1000);
                // Fake timers do not advance CSS animations; settle both browser timelines.
                await freezeAnimations([reference, vue], 1000);
                const tooltip = '.semi-tooltip-wrapper';
                await expect(vue.locator(tooltip)).toBeVisible();
                const popupRects = await Promise.all(
                  [reference, vue].map((page) => page.locator(tooltip).boundingBox()),
                );
                for (const axis of ['x', 'y', 'width', 'height'] as const)
                  expect(
                    Math.abs(popupRects[0]![axis] - popupRects[1]![axis]),
                    `tooltip ${axis}`,
                  ).toBeLessThanOrEqual(0.5);
                await compare(reference.locator(tooltip), vue.locator(tooltip), info, 'tooltip');
                await pixels(reference.locator(tooltip), vue.locator(tooltip), info, 'tooltip');
              }
            }
            if (theme === 'light' && direction === 'ltr') {
              await demo
                .getByRole('button', {
                  name: locale === 'zh-cn' ? '在线编辑' : 'Edit online',
                  exact: true,
                })
                .click();
              const preview = demo.frameLocator('iframe').locator('#app');
              await expect(
                preview.locator(name === 'Consumer' ? '.semi-typography' : '.semi-select').first(),
              ).toBeVisible({ timeout: 30_000 });
              await expect(demo.locator('.msg.err')).toHaveCount(0);
              if (name === 'TimeZone')
                await expect(preview.locator('.semi-select')).toContainText('GMT+08:00');
              if (name === 'Direction') {
                await expect(preview.locator(showcaseRows)).toHaveCount(10);
                await preview.getByRole('button', { name: 'RTL', exact: true }).click();
                await expect(preview.locator('.semi-rtl')).toHaveCount(1);
              }
              if (name === 'Consumer')
                await expect(preview.locator('.semi-typography')).toContainText('dateFnsLocale');
              await demo
                .getByRole('button', {
                  name: locale === 'zh-cn' ? '退出编辑' : 'Close editor',
                  exact: true,
                })
                .click();
              await expect(demo.locator('iframe')).toHaveCount(0);
            }
            await info.attach('upstream-warnings', {
              body: JSON.stringify(upstreamWarnings),
              contentType: 'application/json',
            });
            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'other/configprovider',
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
