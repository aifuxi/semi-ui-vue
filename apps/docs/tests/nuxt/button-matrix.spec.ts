import { compareStyles, compareTarget, freezeAnimations } from './demo-parity';
import { readFile } from 'node:fs/promises';
import { visualContext } from './visual-context';
import { expect, test, type Locator } from '@playwright/test';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

const examples = [
  'Types',
  'TypeColors',
  'Themelight',
  'Themesolid',
  'Themeborderless',
  'Themeoutline',
  'Sizes',
  'Block',
  'Icons',
  'Links',
  'Disabled',
  'Loading',
  'Colorful',
  'GroupSizes',
  'GroupDisabled',
  'GroupTypes',
  'Split',
];
async function contentBounds(root: Locator) {
  return root.evaluate((element) => {
    const rectangles = [...element.querySelectorAll('.semi-button,hr')].map((node) =>
      node.getBoundingClientRect(),
    );
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      if (!walker.currentNode.textContent?.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(walker.currentNode);
      rectangles.push(...range.getClientRects());
    }
    const visible = rectangles.filter((rect) => rect.width && rect.height);
    const x = Math.min(...visible.map((rect) => rect.left)),
      y = Math.min(...visible.map((rect) => rect.top));
    return {
      x,
      y,
      width: Math.max(...visible.map((rect) => rect.right)) - x,
      height: Math.max(...visible.map((rect) => rect.bottom)) - y,
    };
  });
}
for (const locale of ['zh-cn', 'en-us'])
  for (const theme of ['light', 'dark'])
    for (const [index, name] of examples.entries()) {
      for (const direction of ['Icons', 'GroupSizes', 'GroupDisabled', 'GroupTypes'].includes(name)
        ? ['ltr', 'rtl']
        : ['ltr'])
        test(`Button 文档 ${name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
          browser,
        }, info) => {
          test.setTimeout(90_000);
          const context = await visualContext(browser, info, locale, theme, direction);
          const reference = await context.newPage();
          const vue = await context.newPage();
          await Promise.all([
            reference.clock.install({ time: new Date('2024-08-15T10:24:30+08:00') }),
            vue.clock.install({ time: new Date('2024-08-15T10:24:30+08:00') }),
          ]);
          const errors: string[] = [];
          reference.on('pageerror', (error) => errors.push(error.message));
          vue.on('pageerror', (error) => errors.push(error.message));
          vue.on('console', (message) => {
            if (message.type() === 'error') errors.push(message.text());
          });
          await vue.addInitScript((value) => {
            // REPL frames are deliberately opaque; initialize preferences only in the page.
            if (window === window.top) localStorage.setItem('semi-docs-theme', value);
          }, theme);
          await Promise.all([
            reference.goto(
              `http://127.0.0.1:4173/docs.html?locale=${locale}&theme=${theme}&example=${index + 1}`,
            ),
            vue.goto(`/${locale}/components/button/`),
          ]);
          const expected = reference.locator('#root');
          const demo = vue.locator(`[data-demo-id="button/${locale}/${name}"]`);
          const actual = vue.locator(
            `[data-demo-id="button/${locale}/${name}"] [data-demo-preview]`,
          );
          await expect(expected).not.toHaveText('Loading fixed reference');
          await expect(actual).toBeVisible();
          await expect(actual.locator('.demo-loading')).toHaveCount(0);
          const source = await readFile(
            new URL(`../../src/demos/button/${locale}/${name}.vue`, import.meta.url),
            'utf8',
          );
          expect(await demo.locator('[data-demo-source] code').textContent()).toBe(source);
          await Promise.all([
            reference.evaluate(() => document.fonts.ready),
            vue.evaluate(() => document.fonts.ready),
          ]);
          for (const root of [expected, actual])
            await root.evaluate((element, direction) => {
              (element as HTMLElement).dir = direction;
              element.classList.toggle('semi-rtl', direction === 'rtl');
            }, direction);
          await actual.scrollIntoViewIfNeeded();
          const box = await actual.boundingBox();
          await expected.evaluate((element, rect) => {
            Object.assign((element as HTMLElement).style, {
              boxSizing: 'border-box',
              padding: '24px',
              width: `${rect!.width}px`,
              position: 'relative',
              left: `${rect!.x}px`,
              top: `${rect!.y}px`,
            });
          }, box);
          await Promise.all([reference.mouse.move(1400, 880), vue.mouse.move(1400, 880)]);
          const normalize = (value: string | null) => value?.replace(/\s+/g, ' ').trim();
          const [sourceText, vueText] = await Promise.all([
            expected.textContent(),
            actual.textContent(),
          ]);
          await info.attach('text', {
            body: JSON.stringify({ reference: sourceText, vue: vueText }, null, 2),
            contentType: 'application/json',
          });
          expect(normalize(vueText)).toBe(normalize(sourceText));
          await Promise.all(
            [reference, vue].map((page) =>
              page.evaluate(() =>
                document.getAnimations().forEach((animation) => {
                  animation.pause();
                  animation.currentTime = 0;
                }),
              ),
            ),
          );
          await compareStyles(expected, actual, info, 'default');
          const [sourceBounds, vueBounds] = await Promise.all([
            contentBounds(expected),
            contentBounds(actual),
          ]);
          expect(Math.abs(sourceBounds.width - vueBounds.width)).toBeLessThanOrEqual(0.5);
          expect(Math.abs(sourceBounds.height - vueBounds.height)).toBeLessThanOrEqual(0.5);
          // The DemoBlock frame is outside this component-level comparison.
          const [sourceImage, vueImage] = await Promise.all([
            reference.screenshot({
              clip: sourceBounds,
              path: info.outputPath('reference.png'),
            }),
            vue.screenshot({ clip: vueBounds, path: info.outputPath('vue.png') }),
          ]);
          await info.attach('reference', {
            body: sourceImage,
            contentType: 'image/png',
          });
          await info.attach('vue', { body: vueImage, contentType: 'image/png' });
          await expectScreenshotPixelsToMatch(
            vue,
            vueImage,
            sourceImage,
            `${locale}/${name}/${theme}`,
          );
          const controls = expected.locator('button');
          for (let control = 0; control < (await controls.count()); control++) {
            const pair = [controls.nth(control), actual.locator('button').nth(control)];
            const disabled = await pair[0]!.isDisabled();
            if (disabled) await expect(pair[1]!).toBeDisabled();
            else await expect(pair[1]!).toBeEnabled();
            if (disabled) {
              await Promise.all(
                pair.map((button) =>
                  button.evaluate((element) => {
                    element.setAttribute('data-clicks', '0');
                    element.addEventListener(
                      'click',
                      () => element.setAttribute('data-clicks', '1'),
                      { once: true },
                    );
                    (element as HTMLButtonElement).click();
                  }),
                ),
              );
              for (const button of pair) await expect(button).toHaveAttribute('data-clicks', '0');
              continue;
            }
            const acceptsPointer = await pair[0]!.evaluate(
              (element) => getComputedStyle(element).pointerEvents !== 'none',
            );
            if (acceptsPointer) {
              for (const button of pair) await button.hover();
              await compareTarget(pair[0]!, pair[1]!, info, `button-${control}-hover`);
              await Promise.all([reference.mouse.down(), vue.mouse.down()]);
              await compareTarget(pair[0]!, pair[1]!, info, `button-${control}-active`);
              // Release away from the button so the style probe does not activate the example.
              await Promise.all(
                [reference, vue].map(async (page) => {
                  await page.mouse.move(1400, 880);
                  await page.mouse.up();
                }),
              );
            } else {
              for (const button of pair) await expect(button).toHaveCSS('pointer-events', 'none');
            }
            for (const button of pair) {
              await button.focus();
              await button.page().keyboard.press('Tab');
              await button.page().keyboard.press('Shift+Tab');
              await expect(button).toBeFocused();
            }
            await compareTarget(pair[0]!, pair[1]!, info, `button-${control}-focus`);
            await Promise.all(
              pair.map((button) => button.evaluate((element) => (element as HTMLElement).blur())),
            );
          }
          if (name === 'Loading') {
            for (const [button, count] of [
              [0, 0],
              [1, 3],
              [0, 0],
              [2, 1],
            ] as const) {
              await Promise.all(
                [expected, actual].map((root) => root.locator('button').nth(button).click()),
              );
              for (const root of [expected, actual])
                await expect(root.locator('.semi-button-loading')).toHaveCount(count);
              await freezeAnimations([reference, vue], 150);
              await compareTarget(
                expected.locator('button').nth(2),
                actual.locator('button').nth(2),
                info,
                `loading-${button}-${count}`,
              );
            }
            // Keyboard activation changes the public loading output.
            for (const key of ['Enter', 'Space']) {
              await Promise.all(
                [expected, actual].map((root) => root.locator('button').first().click()),
              );
              await Promise.all(
                [expected, actual].map((root) => root.locator('button').nth(2).press(key)),
              );
              for (const root of [expected, actual])
                await expect(root.locator('.semi-button-loading')).toHaveCount(1);
            }
          }
          if (name === 'Split') {
            for (let group = 0; group < 3; group++) {
              // Keyboard probes may scroll the long documentation page. Match the reference
              // scene's current screen origin before measuring its viewport-dependent Portal.
              await actual.scrollIntoViewIfNeeded();
              const origin = await actual.boundingBox();
              await expected.evaluate((element, origin) => {
                const rect = element.getBoundingClientRect();
                const style = (element as HTMLElement).style;
                style.left = `${parseFloat(style.left) + origin!.x - rect.x}px`;
                style.top = `${parseFloat(style.top) + origin!.y - rect.y}px`;
              }, origin);
              await Promise.all(
                [expected, actual].map((root) =>
                  root
                    .locator('button')
                    .nth(group * 2 + 1)
                    .click(),
                ),
              );
              const menus = [reference, vue].map((page) => page.locator('.semi-dropdown-menu'));
              for (const menu of menus) await expect(menu).toBeVisible();
              // Let the finite opening transition finish; pausing it at 0 captures scale(0.8).
              await Promise.all(
                [reference, vue].map((page) =>
                  page.evaluate(() =>
                    Promise.all(
                      document
                        .getAnimations()
                        .filter((animation) =>
                          Number.isFinite(animation.effect?.getComputedTiming().iterations),
                        )
                        .map((animation) => animation.finished),
                    ),
                  ),
                ),
              );
              // Rounded Portal corners expose the page below. Use the same inert backdrop in
              // both scenes so unrelated documentation text is not part of the menu comparison.
              for (const page of [reference, vue])
                await page.evaluate(() => {
                  const backdrop = document.createElement('div');
                  backdrop.dataset.parityBackdrop = '';
                  Object.assign(backdrop.style, {
                    position: 'fixed',
                    inset: '0',
                    zIndex: '1059',
                    background: 'var(--semi-color-bg-0)',
                    pointerEvents: 'none',
                  });
                  document.body.append(backdrop);
                });
              await compareTarget(menus[0]!, menus[1]!, info, `menu-${group}`);
              for (const page of [reference, vue])
                await page
                  .locator('[data-parity-backdrop]')
                  .evaluate((element) => element.remove());
              await Promise.all([reference, vue].map((page) => page.mouse.click(1400, 880)));
              for (const menu of menus) await expect(menu, menu.page().url()).toBeHidden();
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
            await expect(preview).toHaveText(normalize(vueText) ?? '', { timeout: 30_000 });
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
              upstream: 'basic/button',
              index: index + 1,
              name,
              locale,
              theme,
              direction,
              checks: ['text', 'styles', 'geometry', 'screenshots', 'interaction'],
            }),
            contentType: 'application/json',
          });
          await reference.close();
          await vue.close();
          await context.close();
        });
    }
