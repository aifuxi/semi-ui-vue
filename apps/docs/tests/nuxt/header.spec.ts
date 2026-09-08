import { expect, test, type Locator, type Page } from '@playwright/test';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';
import { visualContext, waitForVisualAssets } from './visual-context';

const docsOrigin = process.env.DOCS_HEADER_ORIGIN ?? 'http://127.0.0.1:4321';
const styleKeys = [
  'color',
  'background-color',
  'font-family',
  'font-size',
  'font-weight',
  'line-height',
  'border-radius',
  'border-top-width',
  'border-top-color',
  'padding-left',
  'padding-right',
  'padding-top',
  'padding-bottom',
  'outline-color',
  'outline-width',
  'outline-style',
  'outline-offset',
];
async function controlScreenshot(root: Locator, state: string) {
  const box = await root.boundingBox();
  if (!box) throw new Error('页头控件不可见');
  // Include the entire 2px focus ring; hover tooltips are outside the control crop.
  if (state !== 'focus') return root.screenshot({ animations: 'disabled' });
  return root.page().screenshot({
    animations: 'disabled',
    clip: { x: box.x - 3, y: box.y - 3, width: box.width + 6, height: box.height + 6 },
  });
}
async function measure(root: Locator) {
  return root.evaluate((node, keys) => {
    const origin = node.getBoundingClientRect();
    return [node, ...node.querySelectorAll('.semi-icon, svg, .semi-button-content-right > *')].map(
      (element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          styles: Object.fromEntries(keys.map((key) => [key, style.getPropertyValue(key)])),
          rect: {
            x: rect.x - origin.x,
            y: rect.y - origin.y,
            width: rect.width,
            height: rect.height,
          },
        };
      },
    );
  }, styleKeys);
}
function errorsOn(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' || /hydration/i.test(message.text()))
      errors.push(message.text());
  });
  return errors;
}

for (const locale of ['zh-cn', 'en-us']) {
  for (const theme of ['light', 'dark']) {
    test(`页头固定基线 ${locale} ${theme}`, async ({ browser }, info) => {
      const context = await visualContext(browser, info, locale, theme);
      const vue = await context.newPage();
      const reference = await context.newPage();
      const vueErrors = errorsOn(vue);
      const referenceErrors = errorsOn(reference);
      // Upstream SiteNav fetches this config during construction. Isolate only this remote data.
      await reference.route('https://lf3-config.bytetcc.com/**', (route) =>
        route.fulfill({
          json: {
            data: { 'semi-opensource-header-nav': JSON.stringify({ 'zh-CN': [], 'en-US': [] }) },
          },
        }),
      );
      await vue.addInitScript((value) => localStorage.setItem('semi-docs-theme', value), theme);
      await Promise.all([
        reference.goto(
          `http://127.0.0.1:4173/docs.html?region=header&locale=${locale}&theme=${theme}`,
        ),
        vue.goto(`${docsOrigin}/${locale}/start/introduction/`),
      ]);
      const controls = [
        [
          reference
            .locator('.semi-button')
            .filter({ has: reference.locator(`.semi-icon-${theme === 'dark' ? 'sun' : 'moon'}`) }),
          vue.locator('.theme-action'),
        ],
        [
          reference.getByRole('button', { name: /查看Github|View Github/ }),
          vue.locator('.github-action'),
        ],
        [
          reference.getByRole('button', { name: /Switch to English|切换到中文/ }),
          vue.locator('.locale-action'),
        ],
      ] as const;
      await expect(controls[0][0]).toBeVisible();
      await expect(vue.locator('.theme-action .semi-icon')).toHaveClass(
        new RegExp(`semi-icon-${theme === 'dark' ? 'sun' : 'moon'}`),
      );
      await waitForVisualAssets([controls[0][0], controls[0][1]]);
      for (const [index, [expected, actual]] of controls.entries()) {
        for (const state of ['default', 'hover', 'focus'] as const) {
          await Promise.all([reference.mouse.move(0, 300), vue.mouse.move(0, 300)]);
          await Promise.all([
            expect(reference.locator('[role=tooltip]')).toHaveCount(0),
            expect(vue.locator('[role=tooltip]')).toHaveCount(0),
          ]);
          if (state === 'hover') await Promise.all([expected.hover(), actual.hover()]);
          if (state === 'focus') {
            // Keyboard modality is required for :focus-visible; focus() alone is insufficient.
            await Promise.all([reference.keyboard.press('Tab'), vue.keyboard.press('Tab')]);
            await Promise.all([expected.focus(), actual.focus()]);
          }
          const expectedData = await measure(expected);
          await expect
            .poll(async () => (await measure(actual)).map((entry) => entry.styles))
            .toEqual(expectedData.map((entry) => entry.styles));
          const actualData = await measure(actual);
          await info.attach(`control-${index}-${state}-measurements`, {
            body: JSON.stringify({ expectedData, actualData }),
            contentType: 'application/json',
          });
          expect(actualData).toHaveLength(expectedData.length);
          for (let n = 0; n < actualData.length; n++)
            for (const axis of ['x', 'y', 'width', 'height'] as const) {
              expect(
                Math.abs(actualData[n]!.rect[axis] - expectedData[n]!.rect[axis]),
              ).toBeLessThanOrEqual(0.5);
            }
          const [expectedImage, actualImage] = await Promise.all([
            controlScreenshot(expected, state),
            controlScreenshot(actual, state),
          ]);
          await info.attach(`control-${index}-${state}-reference`, {
            body: expectedImage,
            contentType: 'image/png',
          });
          await info.attach(`control-${index}-${state}-vue`, {
            body: actualImage,
            contentType: 'image/png',
          });
          await expectScreenshotPixelsToMatch(
            vue,
            actualImage,
            expectedImage,
            `页头-${index}-${state}`,
          );
          await Promise.all([expected.blur(), actual.blur()]);
        }
      }
      await expect(vue.locator('.site-header')).toHaveCSS('height', '60px');
      await expect(vue.locator('.header-actions')).toHaveCSS('column-gap', '10px');
      await expect(vue.locator('.site-header')).toHaveCSS('padding-right', '24px');
      await expect(vue.locator('.site-brand')).toHaveText('Semi UI Vue');
      await expect(vue.locator('.site-brand .semi-icon-semi_logo')).toBeVisible();
      await expect(vue.locator('.search-trigger')).toHaveCSS('height', '32px');
      await expect(vue.locator('.search-trigger .semi-icon-search')).toBeVisible();
      await info.attach('header-site-adaptations', {
        body: await vue.locator('.site-header').screenshot(),
        contentType: 'image/png',
      });
      expect(vueErrors).toEqual([]);
      expect(referenceErrors).toEqual([]);
      await context.close();
    });
  }
  test(`页头交互与 hydration ${locale}`, async ({ page }) => {
    const errors = errorsOn(page);
    await page.goto(`${docsOrigin}/${locale}/start/introduction/`);
    // SSR markup is visible before Vue has attached its event listeners.
    await page.waitForFunction(() => {
      const root = document.getElementById('__nuxt');
      return root && '__vue_app__' in root;
    });
    await expect(page.locator('.theme-action .semi-icon-moon')).toBeVisible();
    await page.locator('.theme-action').click();
    await expect(page.locator('body')).toHaveAttribute('theme-mode', 'dark');
    await expect(page.locator('.theme-action .semi-icon-sun')).toBeVisible();
    await page.reload();
    await page.waitForFunction(() => {
      const root = document.getElementById('__nuxt');
      return root && '__vue_app__' in root;
    });
    await expect(page.locator('.theme-action .semi-icon-sun')).toBeVisible();
    await page.locator('.theme-action').click();
    await expect(page.locator('body')).toHaveAttribute('theme-mode', 'light');
    await expect(page.locator('.github-action')).toHaveAttribute(
      'href',
      'https://github.com/aifuxi/semi-ui-vue',
    );
    await page.locator('.locale-action').click();
    await expect(page).toHaveURL(
      new RegExp(`/${locale === 'zh-cn' ? 'en-us' : 'zh-cn'}/start/introduction/`),
    );
    await expect(page.locator('.locale-action')).toHaveAttribute(
      'href',
      `/${locale}/start/introduction/`,
    );
    await page.locator('.locale-action').click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/start/introduction/`));
    await expect(page.locator('.search-trigger')).toHaveAttribute(
      'aria-label',
      locale === 'zh-cn' ? '搜索' : 'Search',
    );
    const search = page.locator('.search-trigger');
    for (const action of ['click', 'Control+k', 'Meta+k']) {
      await search.focus();
      if (action === 'click') await search.click();
      else await page.keyboard.press(action);
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByRole('combobox')).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).toBeHidden();
      await expect(search).toBeFocused();
    }
    expect(errors).toEqual([]);
  });
}
