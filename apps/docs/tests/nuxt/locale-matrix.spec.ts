import { readFile } from 'node:fs/promises';
import { test, expect, type Locator, type TestInfo } from '@playwright/test';
import { visualContext, waitForVisualAssets } from './visual-context';
import { freezeAnimations } from './demo-parity';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

async function waitForCollapsedTypography(reference: Locator, vue: Locator) {
  // Locale changes remount the paragraph and measure the expand label on a later frame.
  // Match stable text/geometry to the pinned reference; RTL can wrap its label to a fourth row.
  const roots = [reference, vue];
  for (const root of roots)
    await expect(root.locator('.semi-typography-ellipsis-expand')).toBeVisible();
  let previous: string | undefined;
  await expect
    .poll(
      async () => {
        const states = await Promise.all(
          roots.map((root) =>
            root.locator('.semi-typography-ellipsis').evaluate((element) => ({
              text: element.textContent,
              height: element.getBoundingClientRect().height,
              hasExpand: Boolean(element.querySelector('.semi-typography-ellipsis-expand')),
            })),
          ),
        );
        const snapshot = JSON.stringify(states);
        const settled =
          states.every((state) => state.hasExpand) &&
          JSON.stringify(states[0]) === JSON.stringify(states[1]) &&
          snapshot === previous;
        previous = snapshot;
        return settled;
      },
      { message: 'Typography must finish locale-dependent ellipsis measurement on both sides' },
    )
    .toBe(true);
}

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

const examples = ['Internationalization', 'Custom', 'Components'];
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
  const images = await Promise.all(
    [reference, vue].map(async (target) => {
      if (!(await target.evaluate((element) => element.matches('.semi-tooltip-wrapper'))))
        return target.screenshot();
      // Include the arrow, which extends beyond the popup's own bounding box.
      const clip = await target.evaluate((element) => {
        const rects = [element, ...element.querySelectorAll('*')].map((node) =>
          node.getBoundingClientRect(),
        );
        const x = Math.floor(Math.min(...rects.map((rect) => rect.left))) - 1;
        const y = Math.floor(Math.min(...rects.map((rect) => rect.top))) - 1;
        return {
          x,
          y,
          width: Math.ceil(Math.max(...rects.map((rect) => rect.right))) - x + 1,
          height: Math.ceil(Math.max(...rects.map((rect) => rect.bottom))) - y + 1,
        };
      });
      return target.page().screenshot({ clip });
    }),
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
      for (const direction of name === 'Components' ? ['ltr', 'rtl'] : ['ltr'])
        test(`Locale 文档 ${name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
          browser,
        }, info) => {
          test.setTimeout(180_000);
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
              await page.clock.install({ time: new Date('2024-08-15T10:24:30+08:00') });
            }
            await vue.addInitScript((value) => {
              if (window === window.top) localStorage.setItem('semi-docs-theme', value);
            }, theme);
            await Promise.all([
              reference.goto(
                `http://127.0.0.1:4173/docs.html?component=locale&locale=${locale}&theme=${theme}&example=${index + 1}`,
              ),
              vue.goto(`/${locale}/components/locale/`),
            ]);
            const expected = reference.locator('#root');
            const demo = vue.locator(`[data-demo-id="locale/${locale}/${name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual).toBeVisible();
            await expect(
              expected.locator(name === 'Custom' ? 'div' : '.semi-page').first(),
            ).toBeVisible({ timeout: 30_000 });
            await expect(demo.locator('[data-demo-source] code')).toHaveText(
              await readFile(
                new URL(`../../src/demos/locale/${locale}/${name}.vue`, import.meta.url),
                'utf8',
              ),
            );
            await waitForVisualAssets([expected, actual]);
            if (name === 'Components' && direction === 'rtl') {
              for (const root of [expected, actual]) {
                await root.locator('.semi-select').first().click();
                await root
                  .page()
                  .locator('.semi-select-option')
                  .filter({ hasText: locale === 'zh-cn' ? '阿拉伯语' : 'Arabic' })
                  .click();
                await expect(root.locator('.semi-select').first()).toContainText(
                  locale === 'zh-cn' ? '阿拉伯语' : 'Arabic',
                );
              }
            }
            await align(expected, actual);
            await Promise.all([reference, vue].map((page) => page.mouse.move(1400, 880)));
            await freezeAnimations([reference, vue], 300);
            // Language changes remount consumers; scrolling may schedule another resize measurement.
            // Wait for the public collapsed state after alignment, rather than sampling a transient full text.
            if (name === 'Components') await waitForCollapsedTypography(expected, actual);
            const editorSelector =
              name === 'Custom' ? ':scope > div' : '.semi-page, .semi-list, h5, .semi-navigation';
            const initialTexts = await actual.locator(editorSelector).allTextContents();
            try {
              await compare(expected, actual, info, 'default');
            } catch (error) {
              // Preserve tight diagnostic evidence even when DOM or style gates fail first.
              for (const [side, root] of [
                ['reference', expected],
                ['vue', actual],
              ] as const) {
                const targets = root.locator(
                  '.semi-page, .semi-table-pagination-outer, .semi-typography',
                );
                for (let i = 0; i < (await targets.count()); i++)
                  await info.attach(`diagnostic-${side}-${i}`, {
                    body: await targets.nth(i).screenshot(),
                    contentType: 'image/png',
                  });
              }
              throw error;
            }
            if (name === 'Custom') {
              expect((await actual.innerText()).split('\n')).toEqual(
                (await expected.innerText()).split('\n'),
              );
              await crop(expected, actual, info, 'default');
            } else {
              const selector =
                name === 'Internationalization'
                  ? '.semi-page'
                  : '.semi-page, .semi-datepicker, .semi-timepicker, .semi-table-wrapper, .semi-list, .semi-calendar, .semi-typography, .semi-transfer, .semi-image, .semi-form, .semi-navigation';
              const count = await expected.locator(selector).count();
              expect(count).toBeGreaterThan(0);
              await expect(actual.locator(selector)).toHaveCount(count);
              for (let i = 0; i < count; i++)
                await crop(
                  expected.locator(selector).nth(i),
                  actual.locator(selector).nth(i),
                  info,
                  i ? `component-${i}` : 'default',
                );
              // Public pagination behavior, including isolation of the neighboring locale provider.
              for (const root of [expected, actual])
                await root.locator('.semi-page-item').filter({ hasText: /^2$/ }).first().click();
              await compare(
                expected.locator('.semi-page').first(),
                actual.locator('.semi-page').first(),
                info,
                'page-two',
              );
              await crop(
                expected.locator('.semi-page').first(),
                actual.locator('.semi-page').first(),
                info,
                'page-two',
              );
              if (name === 'Internationalization') {
                for (const root of [expected, actual]) {
                  await expect(
                    root.locator('.semi-page').nth(1).locator('.semi-page-item-active'),
                  ).toHaveText('1');
                  await root.locator('.semi-page .semi-select').first().click();
                }
                await freezeAnimations([reference, vue], 300);
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
                for (const page of [reference, vue])
                  await page.locator('.semi-select-option').filter({ hasText: /20/ }).click();
                await compare(expected, actual, info, 'size-twenty');
              }
            }
            if (name === 'Components') {
              // Provider changes must reach every consumer, including portalled content.
              await alignTrigger(expected, actual, '.semi-select');
              for (const root of [expected, actual]) {
                await root.locator('.semi-select').first().click();
                await expect(root.page().locator('.semi-select-option')).toHaveCount(
                  locale === 'zh-cn' ? 57 : 54,
                );
              }
              await Promise.all([reference, vue].map((page) => page.mouse.move(1400, 880)));
              await freezeAnimations([reference, vue], 300);
              // Closing the previous menu can move another row under the pointer.
              // Establish the same public hover state before comparing retained focus.
              for (const page of [reference, vue]) {
                const selected = page.locator('.semi-select-option-selected');
                await selected.hover();
                await expect(selected).toHaveClass(/semi-select-option-focused/);
                await page.mouse.move(1400, 880);
              }
              await compare(
                reference.locator('.semi-select-option-list'),
                vue.locator('.semi-select-option-list'),
                info,
                'language-options',
              );
              for (const root of [expected, actual]) {
                await root
                  .page()
                  .locator('.semi-select-option')
                  .filter({
                    hasText: locale === 'zh-cn' ? /^日语$/ : /^Japanese$/,
                  })
                  .click();
                await expect(root.locator('.semi-select').first()).toContainText(
                  locale === 'zh-cn' ? '日语' : 'Japanese',
                );
                await expect(
                  root.locator('.semi-page').first().locator('.semi-page-item-active'),
                ).toHaveText('1');
              }
              await align(expected, actual);
              await Promise.all([reference, vue].map((page) => page.mouse.move(1400, 880)));
              await freezeAnimations([reference, vue], 300);
              await waitForCollapsedTypography(expected, actual);
              await compare(expected, actual, info, 'japanese-consumers');
              for (const selector of [
                '.semi-page',
                '.semi-table-wrapper',
                '.semi-list',
                '.semi-typography',
                '.semi-transfer',
              ]) {
                const count = await expected.locator(selector).count();
                for (let i = 0; i < count; i++)
                  await crop(
                    expected.locator(selector).nth(i),
                    actual.locator(selector).nth(i),
                    info,
                    `japanese-${selector}-${i}`,
                  );
              }
              for (const root of [expected, actual]) {
                await root.locator('.semi-typography-ellipsis-expand').click();
                await expect(root.locator('.semi-typography').last()).toContainText(
                  locale === 'zh-cn' ? 'Web 应用。' : 'signifying nothing.',
                );
              }
              await compare(
                expected.locator('.semi-typography').last(),
                actual.locator('.semi-typography').last(),
                info,
                'expanded',
              );
              await crop(
                expected.locator('.semi-typography').last(),
                actual.locator('.semi-typography').last(),
                info,
                'expanded',
              );
              for (const root of [expected, actual]) {
                await root.locator('.semi-typography-ellipsis-expand').click();
                await root.getByRole('button', { name: 'Show Modal', exact: true }).click();
              }
              await freezeAnimations([reference, vue], 300);
              const popup = '.semi-modal-content';
              for (const page of [reference, vue]) await expect(page.locator(popup)).toBeVisible();
              const [rb, vb] = await Promise.all([
                reference.locator(popup).boundingBox(),
                vue.locator(popup).boundingBox(),
              ]);
              for (const axis of ['x', 'y', 'width', 'height'] as const)
                expect(Math.abs(vb![axis] - rb![axis]), `modal ${axis}`).toBeLessThanOrEqual(0.5);
              await compare(reference.locator(popup), vue.locator(popup), info, 'japanese-modal');
              // Rounded transparent corners need identical host backdrops. The real Portal and mask remain visible.
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
                await crop(reference.locator(popup), vue.locator(popup), info, 'japanese-modal');
              } finally {
                await Promise.all(
                  [reference, vue].map((page, i) =>
                    page.evaluate((previous) => {
                      const app =
                        document.getElementById('root') ?? document.getElementById('__nuxt')!;
                      app.style.opacity = previous!.opacity;
                      document.body.style.backgroundColor = previous!.background;
                    }, backdrops[i]),
                  ),
                );
              }
              for (const page of [reference, vue]) {
                await page.locator('.semi-modal-footer .semi-button').first().press('Enter');
                await page.clock.runFor(1000);
                await expect(page.locator(popup)).toHaveCount(0);
              }
              const copySelector = '.semi-typography-action-copy';
              await actual.locator(copySelector).scrollIntoViewIfNeeded();
              const positions = await Promise.all(
                [expected, actual].map((root) => root.locator(copySelector).boundingBox()),
              );
              await expected.evaluate((element, boxes) => {
                const root = element as HTMLElement;
                root.style.left = `${parseFloat(root.style.left) + boxes[1]!.x - boxes[0]!.x}px`;
                root.style.top = `${parseFloat(root.style.top) + boxes[1]!.y - boxes[0]!.y}px`;
              }, positions);
              for (const root of [expected, actual]) {
                await root.locator(`${copySelector} a`).hover();
                await root.page().clock.runFor(1000);
              }
              await freezeAnimations([reference, vue], 1000);
              for (const page of [reference, vue])
                await expect(page.locator('.semi-tooltip-wrapper')).toBeVisible();
              const tooltipBoxes = await Promise.all(
                [reference, vue].map((page) => page.locator('.semi-tooltip-wrapper').boundingBox()),
              );
              for (const axis of ['x', 'y', 'width', 'height'] as const)
                expect(
                  Math.abs(tooltipBoxes[0]![axis] - tooltipBoxes[1]![axis]),
                  `copy-tooltip ${axis}`,
                ).toBeLessThanOrEqual(0.5);
              await compare(
                reference.locator('.semi-tooltip-wrapper'),
                vue.locator('.semi-tooltip-wrapper'),
                info,
                'copy-tooltip',
              );
              await crop(
                reference.locator('.semi-tooltip-wrapper'),
                vue.locator('.semi-tooltip-wrapper'),
                info,
                'copy-tooltip',
              );
              for (const page of [reference, vue]) {
                await page.mouse.move(1400, 880);
                await page.clock.runFor(1000);
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
              await expect(preview).toContainText(
                name === 'Custom'
                  ? 'semi'
                  : name === 'Components'
                    ? 'Show Modal'
                    : 'Total pages: 10',
                { timeout: 30_000 },
              );
              await expect(preview.locator(editorSelector)).toHaveText(initialTexts);
              await expect(demo.locator('.msg.err')).toHaveCount(0);
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
                upstream: 'other/locale',
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
