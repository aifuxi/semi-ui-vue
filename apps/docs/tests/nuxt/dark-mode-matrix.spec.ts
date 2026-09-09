import { readFile } from 'node:fs/promises';
import { test, expect, type Locator, type TestInfo } from '@playwright/test';
import { visualContext, waitForVisualAssets } from './visual-context';
import { freezeAnimations } from './demo-parity';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

async function measure(root: Locator) {
  return root.evaluate((element) => {
    const origin = element.getBoundingClientRect();
    return [element, ...element.querySelectorAll('*')]
      .filter(
        (node) =>
          (node !== element || node.matches('[class*="semi-"]')) &&
          node.matches('[class*="semi-"], input, textarea, h3, h5, strong, div'),
      )
      .map((node) => {
        const style = getComputedStyle(node),
          rect = node.getBoundingClientRect();
        return {
          tag: node.tagName,
          classes: [...node.classList].filter((c) => c.startsWith('semi-')).sort(),
          text: node.textContent?.replace(/\s+/g, ' ').trim(),
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
          placement: node.getAttribute('x-placement'),
          tabindex: node.getAttribute('tabindex'),
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
              'outline-color',
              'outline-style',
              'outline-width',
              'outline-offset',
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

const examples = ['Global', 'Local'];
async function align(reference: Locator, vue: Locator) {
  await vue.scrollIntoViewIfNeeded();
  const box = await vue.boundingBox();
  const scroll = await vue
    .page()
    .evaluate(() => ({ y: scrollY, height: document.documentElement.scrollHeight }));
  await reference.evaluate(
    (element, { box, scroll }) => {
      document.body.style.minHeight = `${scroll.height}px`;
      Object.assign((element as HTMLElement).style, {
        boxSizing: 'border-box',
        padding: '24px',
        backgroundColor: 'var(--semi-color-bg-0)',
        color: 'var(--semi-color-text-0)',
        width: `${box!.width}px`,
        position: 'relative',
        left: `${box!.x}px`,
        top: `${box!.y + scroll.y}px`,
      });
      window.scrollTo(0, scroll.y);
    },
    { box, scroll },
  );
}
async function crop(reference: Locator, vue: Locator, info: TestInfo, name: string) {
  // Each tight crop can scroll independently. Match fractional viewport coordinates again
  // before rasterization; otherwise equal geometry can land on different physical pixels.
  if (
    await reference.evaluate(
      (element) => Boolean(element.closest('#root')) && !element.closest('.semi-portal-inner'),
    )
  ) {
    await vue.scrollIntoViewIfNeeded();
    await reference.scrollIntoViewIfNeeded();
    const boxes = await Promise.all([reference.boundingBox(), vue.boundingBox()]);
    await reference
      .page()
      .locator('#root')
      .evaluate((element, boxes) => {
        const root = element as HTMLElement;
        root.style.left = `${parseFloat(root.style.left) + boxes[1]!.x - boxes[0]!.x}px`;
        root.style.top = `${parseFloat(root.style.top) + boxes[1]!.y - boxes[0]!.y}px`;
      }, boxes);
  }
  const boxes = await Promise.all([reference.boundingBox(), vue.boundingBox()]);
  await info.attach(`${name}-crop-position`, {
    body: JSON.stringify(boxes),
    contentType: 'application/json',
  });
  for (const axis of ['x', 'y', 'width', 'height'] as const)
    expect(Math.abs(boxes[0]![axis] - boxes[1]![axis]), `${name} ${axis}`).toBeLessThanOrEqual(0.5);
  // Capture both at the same physical pixel origin. Locator screenshots can re-scroll
  // a fractional-height sidebar and round the two clips differently.
  const clip = await vue.evaluate((element) => {
    const nodes = element.matches('.semi-tooltip-wrapper')
      ? [element, ...element.querySelectorAll('*')]
      : [element];
    const rects = nodes.map((node) => node.getBoundingClientRect());
    const ring = element.matches(':focus-visible') ? 4 : 0;
    const x = Math.floor(Math.min(...rects.map((rect) => rect.left))) - ring;
    const y = Math.floor(Math.min(...rects.map((rect) => rect.top))) - ring;
    return {
      x,
      y,
      width: Math.ceil(Math.max(...rects.map((rect) => rect.right))) - x + ring,
      height: Math.ceil(Math.max(...rects.map((rect) => rect.bottom))) - y + ring,
    };
  });
  const images = await Promise.all(
    [reference.page(), vue.page()].map((page) => page.screenshot({ clip })),
  );
  await info.attach(name === 'default' ? 'reference' : `${name}-reference`, {
    body: images[0]!,
    contentType: 'image/png',
  });
  await info.attach(name === 'default' ? 'vue' : `${name}-vue`, {
    body: images[1]!,
    contentType: 'image/png',
  });
  await expectScreenshotPixelsToMatch(vue.page(), images[1]!, images[0]!, name);
}
async function alignTrigger(reference: Locator, vue: Locator, selector: string) {
  await vue.locator(selector).first().scrollIntoViewIfNeeded();
  const boxes = await Promise.all(
    [reference, vue].map((root) => root.locator(selector).first().boundingBox()),
  );
  await reference.evaluate((element, positions) => {
    const root = element as HTMLElement;
    root.style.left = `${parseFloat(root.style.left) + positions[1]!.x - positions[0]!.x}px`;
    root.style.top = `${parseFloat(root.style.top) + positions[1]!.y - positions[0]!.y}px`;
  }, boxes);
}
for (const [index, name] of examples.entries())
  for (const locale of ['zh-cn', 'en-us'])
    for (const theme of ['light', 'dark'])
      test(`Dark Mode 文档 ${name} ${locale} ${theme}`, async ({ browser }, info) => {
        test.setTimeout(180_000);
        const context = await visualContext(browser, info, locale, theme);
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
            await page.clock.install({ time: new Date('2024-08-15T10:24:30+08:00') });
          }
          await vue.addInitScript((value) => {
            if (window === window.top) localStorage.setItem('semi-docs-theme', value);
          }, theme);
          await Promise.all([
            reference.goto(
              `http://127.0.0.1:4173/docs.html?component=dark-mode&locale=${locale}&theme=${theme}&example=${index + 1}`,
            ),
            vue.goto(`/${locale}/advanced/dark-mode/`),
          ]);
          const expected = reference.locator('#root');
          const demo = vue.locator(`[data-demo-id="dark-mode/${locale}/${name}"]`);
          const actual = demo.locator('[data-demo-preview]');
          const roots = [expected, actual];
          async function settlePopups() {
            // These states sample fully open overlays after the 1000ms hover delay.
            // Finish through the browser so both adapters receive the real animationend.
            await freezeAnimations(pages, 1000);
            for (const page of pages) {
              await page.evaluate(() =>
                document.getAnimations().forEach((animation) => animation.finish()),
              );
              await page.clock.runFor(32);
              await expect(page.locator('.semi-tooltip-animation-show')).toHaveCount(0);
            }
          }

          for (const root of roots)
            await expect(root.locator('.semi-button').first()).toBeVisible();
          await expect(demo.locator('[data-demo-source] code')).toHaveText(
            await readFile(
              new URL(`../../src/demos/dark-mode/${locale}/${name}.vue`, import.meta.url),
              'utf8',
            ),
          );
          await waitForVisualAssets(roots);
          // Split the tall sidebar into its complete menu and collapse control; omit the empty fill area.
          const controls =
            '.semi-button, .semi-navigation-horizontal, .semi-navigation-vertical .semi-navigation-list, .semi-navigation-collapse-btn, .semi-breadcrumb, .semi-page, .semi-steps, .semi-badge, .semi-tag, .semi-rating, .semi-timeline';
          async function snapshot(state: string) {
            await align(expected, actual);
            await Promise.all(pages.map((page) => page.mouse.move(1400, 880)));
            await freezeAnimations(pages, 300);
            try {
              await compare(expected, actual, info, state);
            } catch (error) {
              for (const [i, root] of roots.entries())
                await info.attach(`${state}-diagnostic-${i}`, {
                  body: await root.locator('.semi-button').first().screenshot(),
                  contentType: 'image/png',
                });
              throw error;
            }
            const selector = name === 'Global' ? '.semi-button' : controls;
            const count = await expected.locator(selector).count();
            await expect(actual.locator(selector)).toHaveCount(count);
            for (let i = 0; i < count; i++)
              await crop(
                expected.locator(selector).nth(i),
                actual.locator(selector).nth(i),
                info,
                i === 0 ? state : `${state}-control-${i}`,
              );
          }
          await snapshot('default');
          if (name === 'Global') {
            for (const targetTheme of [theme === 'light' ? 'dark' : 'light', theme]) {
              for (const root of roots) {
                await root.getByRole('button', { name: 'Switch Mode', exact: true }).press('Enter');
                await expect
                  .poll(() => root.page().locator('body').getAttribute('theme-mode'))
                  .toBe(targetTheme === 'dark' ? 'dark' : root === actual ? 'light' : null);
              }
              await expect(vue.locator('html')).toHaveAttribute('data-theme', targetTheme);
              expect(await vue.evaluate(() => localStorage.getItem('semi-docs-theme'))).toBe(
                targetTheme,
              );
              await snapshot(`global-${targetTheme}`);
            }
          } else {
            for (const localTheme of ['dark', 'light', 'dark']) {
              if (localTheme !== 'dark' || (await actual.locator('.semi-always-light').count())) {
                for (const root of roots)
                  await root
                    .getByRole('button', { name: 'Switch Content Mode', exact: true })
                    .click();
              }
              for (const root of roots) {
                await expect(
                  root.locator(`.semi-layout-content.semi-always-${localTheme}`),
                ).toHaveCount(1);
                await expect(root.page().locator('body')).toHaveAttribute('theme-mode', theme);
              }
              await snapshot(`local-${localTheme}`);
              // The explicitly mounted Nav menu must inherit the local palette.
              await alignTrigger(
                expected,
                actual,
                '.semi-layout-content .semi-navigation-sub-title',
              );
              for (const root of roots) {
                await root.locator('.semi-layout-content .semi-navigation-sub-title').hover();
                await root.page().clock.runFor(1000);
                await expect(root.locator('#popup-layer .semi-dropdown-menu')).toBeVisible();
                expect(
                  await root
                    .locator('#popup-layer .semi-dropdown-menu')
                    .evaluate((element) =>
                      getComputedStyle(element).getPropertyValue('--semi-color-bg-0'),
                    ),
                ).toBe(
                  await root
                    .locator('.semi-layout-content')
                    .evaluate((element) =>
                      getComputedStyle(element).getPropertyValue('--semi-color-bg-0'),
                    ),
                );
              }
              await settlePopups();
              await compare(
                reference.locator('.semi-dropdown-menu'),
                vue.locator('.semi-dropdown-menu'),
                info,
                `nav-${localTheme}`,
              );
              await crop(
                reference.locator('.semi-dropdown-menu'),
                vue.locator('.semi-dropdown-menu'),
                info,
                `nav-${localTheme}`,
              );
              for (const page of pages) {
                await page.mouse.move(1400, 880);
                await page.clock.runFor(1000);
              }
              for (const page of pages)
                await expect(page.locator('.semi-dropdown-menu')).toHaveCount(0);
              // Default body portals deliberately follow the global theme, not the local class.
              for (const [text, selector] of [
                ['I am Popover', '.semi-popover-wrapper'],
                ['I am Tooltip', '.semi-tooltip-wrapper'],
              ] as const) {
                await alignTrigger(expected, actual, `.semi-tag:has-text("${text}")`);
                for (const root of roots) {
                  await root.getByText(text, { exact: true }).hover();
                  await root.page().clock.runFor(1000);
                }
                for (const page of pages) {
                  await expect(page.locator(selector)).toBeVisible();
                  expect(
                    await page
                      .locator(selector)
                      .evaluate((element) =>
                        getComputedStyle(element).getPropertyValue('--semi-color-bg-0'),
                      ),
                  ).toBe(
                    await page
                      .locator('body')
                      .evaluate((element) =>
                        getComputedStyle(element).getPropertyValue('--semi-color-bg-0'),
                      ),
                  );

                  expect(
                    await page
                      .locator(selector)
                      .evaluate((el) => Boolean(el.closest('.semi-layout-content'))),
                  ).toBe(false);
                }
                await settlePopups();
                await compare(
                  reference.locator(selector),
                  vue.locator(selector),
                  info,
                  `${text}-${localTheme}`,
                );
                await crop(
                  reference.locator(selector),
                  vue.locator(selector),
                  info,
                  `${text}-${localTheme}`,
                );
                for (const page of pages) {
                  await page.mouse.move(1400, 880);
                  await page.clock.runFor(1000);
                }
                for (const page of pages) await expect(page.locator(selector)).toHaveCount(0);
              }
            }
            await alignTrigger(expected, actual, '.semi-tag:has-text("I am Tooltip")');
            for (const root of roots) {
              const popoverTag = root.locator('.semi-tag').filter({ hasText: /^I am Popover$/ });
              await popoverTag.focus();
              await popoverTag.press('Tab');
              await expect(
                root.locator('.semi-tag').filter({ hasText: /^I am Tooltip$/ }),
              ).toBeFocused();
              await root.page().clock.runFor(1000);
            }
            // Pinned Foundation.show checks :hover on portalInserted even when focus opened
            // a hover trigger (foundation.ts:348-356). With the pointer away, it closes again.
            await settlePopups();
            for (const page of pages)
              await expect(page.locator('.semi-tooltip-wrapper')).toHaveCount(0);
            const keyboardTrigger = '.semi-tag:has-text("I am Tooltip")';
            await compare(
              expected.locator(keyboardTrigger),
              actual.locator(keyboardTrigger),
              info,
              'keyboard-trigger',
            );
            await crop(
              expected.locator(keyboardTrigger),
              actual.locator(keyboardTrigger),
              info,
              'keyboard-trigger',
            );
            for (const root of roots) {
              await root
                .locator('.semi-tag')
                .filter({ hasText: /^I am Tooltip$/ })
                .press('Tab');
              await root.page().clock.runFor(1000);
              await expect(root.page().locator('.semi-tooltip-wrapper')).toHaveCount(0);
            }
            for (const root of roots) {
              await root.locator('.semi-page-item').filter({ hasText: /^2$/ }).click();
              await expect(root.locator('.semi-page-item-active')).toHaveText('2');
            }
            await snapshot('page-2');
            await alignTrigger(expected, actual, '.semi-page .semi-select');
            for (const root of roots) await root.locator('.semi-page .semi-select').click();
            await settlePopups();
            for (const page of pages) {
              await expect(page.locator('.semi-select-option-list')).toBeVisible();
              expect(
                await page
                  .locator('.semi-select-option-list')
                  .evaluate((element) => Boolean(element.closest('.semi-layout-content'))),
              ).toBe(false);
            }
            await compare(
              reference.locator('.semi-select-option-list'),
              vue.locator('.semi-select-option-list'),
              info,
              'sizes',
            );
            await crop(
              reference.locator('.semi-select-option-list'),
              vue.locator('.semi-select-option-list'),
              info,
              'sizes',
            );
            for (const root of roots) {
              await root.page().locator('.semi-select-option').filter({ hasText: /20/ }).click();
              await expect(root.locator('.semi-page .semi-select')).toContainText('20');
              await expect(root.page().locator('.semi-select-option-list')).toHaveCount(0);
            }
            await snapshot('size-20');
          }
          if (theme === 'light') {
            await demo
              .getByRole('button', {
                name: locale === 'zh-cn' ? '在线编辑' : 'Edit online',
                exact: true,
              })
              .click();
            const preview = demo.frameLocator('iframe').locator('#app');
            const button = preview.getByRole('button', {
              name: name === 'Global' ? 'Switch Mode' : 'Switch Content Mode',
              exact: true,
            });
            await expect(button).toBeVisible({ timeout: 30_000 });
            await expect(demo.locator('.msg.err')).toHaveCount(0);
            await button.click();
            if (name === 'Local')
              await expect(preview.locator('.semi-always-light')).toHaveCount(1);
            else
              await expect(demo.frameLocator('iframe').locator('body')).toHaveAttribute(
                'theme-mode',
                'dark',
              );
            await demo
              .getByRole('button', {
                name: locale === 'zh-cn' ? '退出编辑' : 'Close editor',
                exact: true,
              })
              .click();
            await expect(demo.locator('iframe')).toHaveCount(0);
          }
          expect(errors).toEqual([]);
          await info.attach('acceptance', {
            body: JSON.stringify({
              upstream: 'advanced/dark-mode',
              index: index + 1,
              name,
              locale,
              theme,
              direction: 'ltr',
              checks: ['text', 'styles', 'geometry', 'screenshots', 'interaction'],
            }),
            contentType: 'application/json',
          });
        } finally {
          await context.close();
        }
      });
