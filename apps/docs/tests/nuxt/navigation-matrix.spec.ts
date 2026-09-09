import { readFile } from 'node:fs/promises';
import { test, expect, type Locator, type TestInfo } from '@playwright/test';
import { visualContext, waitForVisualAssets } from './visual-context';
import { freezeAnimations } from './demo-parity';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

test.use({ actionTimeout: 10_000 });

async function measure(root: Locator) {
  return root.evaluate((element) => {
    const origin = element.getBoundingClientRect();
    return [element, ...element.querySelectorAll('*')]
      .filter(
        (node) =>
          // A direction-only test container is not a component DOM node.
          (node !== element ||
            [...node.classList].some((name) => name.startsWith('semi-') && name !== 'semi-rtl')) &&
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

const examples = [
  'Basic',
  'Scrollable',
  'Template',
  'Vertical',
  'Horizontal',
  'Combined',
  'TogglePosition',
  'Indentation',
  'Uncontrolled',
  'Controlled',
];
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
        // Explicit viewport alignment must not inherit RTL normal-flow anchoring.
        position: 'absolute',
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
async function hoverWithoutScroll(target: Locator) {
  await expect(target).toBeVisible();
  const box = await target.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(900);
  await target.page().mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
}

for (const [index, name] of examples.entries())
  for (const locale of ['zh-cn', 'en-us'])
    for (const theme of ['light', 'dark'])
      for (const direction of ['TogglePosition', 'Indentation', 'Horizontal'].includes(name)
        ? ['ltr', 'rtl']
        : ['ltr'])
        test(`Navigation 文档 ${name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
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
              await page.clock.install({ time: new Date('2024-08-15T10:24:30+08:00') });
            }
            await vue.addInitScript((value) => {
              if (window === window.top) localStorage.setItem('semi-docs-theme', value);
            }, theme);
            const demoLocale = locale === 'zh-cn' ? 'zh-CN' : 'en-US';
            const cases = [
              { name, number: locale === 'zh-cn' ? index + 1 : index === 0 ? 1 : index + 3 },
              ...(locale === 'en-us' && name === 'Basic'
                ? [
                    { name: 'Plain', number: 2 },
                    { name: 'HeaderFooter', number: 3 },
                  ]
                : []),
            ];
            for (const entry of cases)
              await test.step(entry.name, async () => {
                await Promise.all([
                  reference.goto(
                    `http://127.0.0.1:4173/docs.html?component=navigation&locale=${locale}&theme=${theme}&example=${entry.number}`,
                  ),
                  vue.goto(`/${locale}/components/navigation/`),
                ]);
                const expected = reference.locator('#root');
                const demo = vue.locator(`[data-demo-id="navigation/${demoLocale}/${entry.name}"]`);
                const actual = demo.locator('[data-demo-preview]');
                const roots = [expected, actual];
                for (const root of roots) {
                  await expect(root.locator('.semi-navigation').first()).toBeVisible({
                    timeout: 20_000,
                  });
                  await root.page().evaluate((dir) => {
                    document.body.dir = dir;
                    document.body.classList.toggle('semi-rtl', dir === 'rtl');
                  }, direction);
                  await root.evaluate((element, dir) => {
                    (element as HTMLElement).dir = dir;
                    element.classList.toggle('semi-rtl', dir === 'rtl');
                  }, direction);
                }
                await expect(demo.locator('[data-demo-source] code')).toHaveText(
                  await readFile(
                    new URL(
                      `../../src/demos/navigation/${demoLocale}/${entry.name}.vue`,
                      import.meta.url,
                    ),
                    'utf8',
                  ),
                );
                await waitForVisualAssets(roots);
                async function settle() {
                  await freezeAnimations(pages, 300);
                  for (const [i, page] of pages.entries()) {
                    await page.evaluate(() =>
                      document.getAnimations().forEach((animation) => animation.finish()),
                    );
                    await page.clock.runFor(32);
                    // aria-expanded changes before Collapsible removes closing content.
                    // Sample only after the real transitionend has cleared its public class.
                    await expect(roots[i]!.locator('.semi-collapsible-transition')).toHaveCount(0);
                  }
                }
                async function snapshot(state: string) {
                  await align(expected, actual);
                  await Promise.all(pages.map((page) => page.mouse.move(1400, 880)));
                  await settle();
                  const label = entry.name === name ? state : `${entry.name}-${state}`;
                  await compare(expected, actual, info, label);
                  // Crop individual complete navigation components, never the surrounding documentation page.
                  const count = await expected.locator('.semi-navigation').count();
                  for (let i = 0; i < count; i++)
                    await crop(
                      expected.locator('.semi-navigation').nth(i),
                      actual.locator('.semi-navigation').nth(i),
                      info,
                      i === 0 ? label : `${label}-${i}`,
                    );
                  if (entry.name === 'Combined' && locale === 'zh-cn')
                    for (const selector of [
                      '.semi-breadcrumb-wrapper',
                      '.semi-skeleton',
                      '.semi-layout-footer',
                    ])
                      await crop(
                        expected.locator(selector),
                        actual.locator(selector),
                        info,
                        `${label}-${selector}`,
                      );
                }
                await test.step('default structure, theme and geometry', () => snapshot('default'));
                const collapse = '.semi-navigation-collapse-btn button';
                const initiallyCollapsed = await expected
                  .locator('.semi-navigation-collapsed')
                  .count();
                if (initiallyCollapsed) {
                  await test.step('expand initial controlled/uncontrolled sidebar', async () => {
                    for (const root of roots) await root.locator(collapse).first().press('Enter');
                    for (const root of roots)
                      await expect(root.locator('.semi-navigation-collapsed')).toHaveCount(0);
                    await snapshot('expanded');
                  });
                }
                await test.step('keyboard selection and focus', async () => {
                  for (const root of roots) {
                    const item = root
                      .locator('.semi-navigation-item-normal[role="menuitem"]')
                      .first();
                    await item.press('Enter');
                    await expect(item).toHaveClass(/semi-navigation-item-selected/);
                    await expect(item).toBeFocused();
                  }
                  await snapshot('selected');
                });
                const verticalTitles = '.semi-navigation-vertical .semi-navigation-sub-title';
                if (await expected.locator(verticalTitles).count())
                  await test.step('inline submenu open and close', async () => {
                    const before = await expected
                      .locator(verticalTitles)
                      .first()
                      .getAttribute('aria-expanded');
                    for (const root of roots) {
                      await root.locator(verticalTitles).first().press('Enter');
                      await expect(root.locator(verticalTitles).first()).toHaveAttribute(
                        'aria-expanded',
                        before === 'true' ? 'false' : 'true',
                      );
                    }
                    await snapshot('submenu-toggle');
                  });
                if (await expected.locator(collapse).count())
                  await test.step('collapse and restore', async () => {
                    for (const root of roots) await root.locator(collapse).first().press('Enter');
                    for (const root of roots)
                      await expect(root.locator('.semi-navigation-collapsed')).toHaveCount(1);
                    await snapshot('collapsed');
                    for (const root of roots) await root.locator(collapse).first().press('Enter');
                    for (const root of roots)
                      await expect(root.locator('.semi-navigation-collapsed')).toHaveCount(0);
                    await snapshot('restored');
                  });
                if (entry.name === 'Scrollable')
                  await test.step('body scroll keeps header and footer fixed', async () => {
                    const before = await Promise.all(
                      roots.map((root) => root.locator('.semi-navigation-header').boundingBox()),
                    );
                    for (const root of roots)
                      await root.locator('.semi-navigation-list-wrapper').evaluate((element) => {
                        element.scrollTop = element.scrollHeight;
                      });
                    await snapshot('body-scrolled');
                    for (const [i, root] of roots.entries())
                      expect(await root.locator('.semi-navigation-header').boundingBox()).toEqual(
                        before[i],
                      );
                  });
                if (['Horizontal', 'Combined'].includes(entry.name))
                  await test.step('horizontal dropdown, keyboard entry and return', async () => {
                    await align(expected, actual);
                    const selector = '.semi-navigation-horizontal .semi-navigation-sub-title';
                    for (const root of roots) {
                      await hoverWithoutScroll(root.locator(selector).first());
                      await root.page().clock.runFor(300);
                      await expect(
                        root.page().locator('.semi-dropdown-menu').first(),
                      ).toBeVisible();
                    }
                    await settle();
                    const menus = pages.map((page) => page.locator('.semi-dropdown').first());
                    await compare(menus[0]!, menus[1]!, info, 'portal');
                    await crop(menus[0]!, menus[1]!, info, 'portal');
                    for (const root of roots) {
                      await root.locator(selector).first().focus();
                      await root.page().clock.runFor(300);
                      await expect(
                        root.page().locator('.semi-dropdown-menu').first(),
                      ).toBeVisible();
                      await root.locator(selector).first().press('ArrowDown');
                      await expect(
                        root.page().locator('.semi-dropdown-item').first(),
                      ).toBeFocused();
                      await root.page().clock.runFor(500);
                      await expect(
                        root.page().locator('.semi-dropdown-menu').first(),
                      ).toBeVisible();
                      await root.page().keyboard.press('Escape');
                      await expect(root.locator(selector).first()).toBeFocused();
                      await root.page().clock.runFor(300);
                      await expect(
                        root.page().locator('.semi-dropdown-menu').first(),
                      ).not.toBeVisible();
                      // Pinned Foundation.show closes focus-only hover popups after insertion.
                      await root.page().mouse.move(1400, 880);
                      await root
                        .locator(selector)
                        .first()
                        .evaluate((element) => (element as HTMLElement).blur());
                      await root.locator(selector).first().focus();
                      await root.page().clock.runFor(500);
                      await settle();
                      await expect(
                        root.page().locator('.semi-dropdown-menu').first(),
                      ).not.toBeVisible();
                    }
                  });
                if (['Horizontal', 'Combined'].includes(entry.name))
                  await test.step('nested submenu hover', async () => {
                    await align(expected, actual);
                    for (const root of roots) {
                      await hoverWithoutScroll(
                        root
                          .locator('.semi-navigation-horizontal .semi-navigation-sub-title')
                          .first(),
                      );
                      await root.page().clock.runFor(300);
                      await expect(
                        root.page().locator('.semi-dropdown-menu').first(),
                      ).toBeVisible();
                      // Position nested menus only after the parent's transform reaches its sampled end state.
                      await settle();
                      await hoverWithoutScroll(
                        root.page().locator('.semi-dropdown .semi-navigation-sub-title').first(),
                      );
                      await root.page().clock.runFor(300);
                      await expect(root.page().locator('.semi-dropdown-menu')).toHaveCount(2);
                    }
                    await settle();
                    await compare(
                      reference.locator('.semi-dropdown').nth(1),
                      vue.locator('.semi-dropdown').nth(1),
                      info,
                      'nested-portal',
                    );
                    await crop(
                      reference.locator('.semi-dropdown').nth(1),
                      vue.locator('.semi-dropdown').nth(1),
                      info,
                      'nested-portal',
                    );
                    for (const page of pages) await page.mouse.move(1400, 880);
                    await settle();
                  });
                if (entry.name === 'Combined' && theme === 'light' && direction === 'ltr')
                  await test.step('multi-file editor', async () => {
                    await demo
                      .getByRole('button', {
                        name: locale === 'zh-cn' ? '在线编辑' : 'Edit online',
                        exact: true,
                      })
                      .click();
                    const preview = demo.frameLocator('iframe').locator('#app');
                    await expect(preview.locator('.semi-navigation')).toHaveCount(2, {
                      timeout: 30_000,
                    });
                    await expect(demo.locator('.msg.err')).toHaveCount(0);
                    await preview.locator('.semi-navigation-collapse-btn button').click();
                    await expect(preview.locator('.semi-navigation-collapsed')).toHaveCount(1);
                    await demo
                      .getByRole('button', {
                        name: locale === 'zh-cn' ? '退出编辑' : 'Close editor',
                        exact: true,
                      })
                      .click();
                    await expect(demo.locator('iframe')).toHaveCount(0);
                  });
              });
            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'navigation/navigation',
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
