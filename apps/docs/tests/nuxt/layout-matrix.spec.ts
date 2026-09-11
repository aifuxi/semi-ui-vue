import { readFile } from 'node:fs/promises';
import { expect, test, type Locator } from '@playwright/test';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

test.use({ actionTimeout: 10_000 });

const names = [
  'ThreeSections',
  'LeftSidebar',
  'RightSidebar',
  'Sidebar',
  'Responsive',
  'TopNavigation',
  'TopSidebar',
  'SideNavigation',
];

async function measure(root: Locator, includeRoot = false) {
  return root.evaluate((element, includeRoot) => {
    const origin = element.getBoundingClientRect();
    const properties = [
      'display',
      'position',
      'float',
      'clear',
      'direction',
      'box-sizing',
      'width',
      'height',
      'min-height',
      'color',
      'background-color',
      'font-family',
      'font-size',
      'font-weight',
      'line-height',
      'text-align',
      'flex',
      'flex-direction',
      'flex-wrap',
      'justify-content',
      'align-items',
      'order',
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
      'box-shadow',
      'opacity',
      'overflow',
      'text-overflow',
      'white-space',
      'gap',
      'fill',
      'stroke',
      'outline-width',
      'outline-style',
      'outline-color',
      'content',
    ];
    return [
      ...(includeRoot ? [element] : []),
      ...element.querySelectorAll(
        '[class*="semi-"], svg, .semi-layout-content > div, .semi-layout-footer span, .semi-navigation-list > span, .semi-navigation-list > span > span',
      ),
    ].map((node) => {
      const rect = node.getBoundingClientRect();
      const styles = (pseudo: string | null) => {
        const style = getComputedStyle(node, pseudo);
        return Object.fromEntries(properties.map((key) => [key, style.getPropertyValue(key)]));
      };
      return {
        tag: node.tagName,
        classes: [...node.classList].filter((name) => name.startsWith('semi-')).sort(),
        text: node.children.length ? null : node.textContent?.trim(),
        role: node.getAttribute('role'),
        label: node.tagName === 'BUTTON' ? null : node.getAttribute('aria-label'),
        tabindex: node.getAttribute('tabindex'),
        value: node.getAttribute('value'),
        styles: styles(null),
        before: node.matches('.components-layout-demo') ? styles('::before') : null,
        after: node.matches('.components-layout-demo') ? styles('::after') : null,
        rect: {
          x: rect.x - origin.x,
          y: rect.y - origin.y,
          width: rect.width,
          height: rect.height,
        },
      };
    });
  }, includeRoot);
}

for (const locale of ['zh-cn', 'en-us'])
  for (const theme of ['light', 'dark'])
    for (const [index, name] of names.entries())
      for (const direction of ['ltr', 'rtl'])
        test(`Layout 文档 ${name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
          browser,
        }, info) => {
          test.setTimeout(90_000);
          const context = await visualContext(browser, info, locale, theme, direction);
          try {
            const reference = await context.newPage(),
              vue = await context.newPage();
            const errors: string[] = [];
            const breakpoints = new Map([
              [reference, [] as string[]],
              [vue, [] as string[]],
            ]);
            for (const page of [reference, vue]) {
              page.on('pageerror', (error) => errors.push(error.message));
              page.on('console', (message) => {
                if (message.type() === 'error') errors.push(message.text());
                if (message.type() === 'log' && /^md (true|false)$/.test(message.text()))
                  breakpoints.get(page)!.push(message.text());
              });
            }
            await vue.addInitScript((value) => {
              if (window === window.top) localStorage.setItem('semi-docs-theme', value);
            }, theme);
            await reference.goto(
              `http://127.0.0.1:4173/docs.html?component=layout&locale=${locale}&theme=${theme}&example=${index + 1}`,
            );
            const expected = reference.locator('#root');
            await expect(expected.locator('.semi-layout-content')).toHaveCount(1);
            await vue.goto(`/${locale}/components/layout/`);
            const demo = vue.locator(`[data-demo-id="layout/${locale}/${name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual.locator('.semi-layout-content')).toHaveCount(1);
            const source = await readFile(
              new URL(`../../src/demos/layout/${locale}/${name}.vue`, import.meta.url),
              'utf8',
            );
            expect(await demo.locator('[data-demo-source] code').textContent()).toBe(source);
            await waitForVisualAssets([expected, actual]);
            for (const root of [expected, actual])
              await root.evaluate((element, dir) => {
                (element as HTMLElement).dir = dir;
                element.classList.toggle('semi-rtl', dir === 'rtl');
              }, direction);

            async function align() {
              // Wait for the site's real mobile sidebar transition before sampling.
              await vue.locator('#side-nav').evaluate(async (sidebar) => {
                await Promise.all(sidebar.getAnimations().map((animation) => animation.finished));
              });
              await actual.scrollIntoViewIfNeeded();
              const box = await actual.boundingBox();
              if (!box) throw new Error('Missing Layout preview');
              const { padding, overflow } = await actual.evaluate((element) => {
                const style = getComputedStyle(element);
                return { padding: style.padding, overflow: style.overflow };
              });
              const scroll = await vue.evaluate(() => ({
                y: scrollY,
                height: document.documentElement.scrollHeight,
              }));
              await expected.evaluate(
                (element, { box, scroll, padding, overflow }) => {
                  Object.assign((element as HTMLElement).style, {
                    boxSizing: 'border-box',
                    padding,
                    overflow,
                    width: `${box.width}px`,
                    position: 'relative',
                    left: `${box.x}px`,
                    top: `${box.y + scroll.y}px`,
                  });
                  document.body.style.minHeight = `${scroll.height}px`;
                  window.scrollTo(0, scroll.y);
                },
                { box, scroll, padding, overflow },
              );
              await Promise.all([reference, vue].map((page) => page.mouse.move(0, 0)));
            }

            async function compare(label: string) {
              await Promise.all(
                [expected, actual].map((root) =>
                  root.evaluate(async (element) => {
                    await Promise.all(
                      element
                        .getAnimations({ subtree: true })
                        .filter(
                          (animation) =>
                            animation.effect?.getComputedTiming().iterations !== Infinity,
                        )
                        .map((animation) => animation.finished),
                    );
                  }),
                ),
              );
              await align();
              const [referenceNodes, vueNodes] = await Promise.all([
                measure(expected),
                measure(actual),
              ]);
              await info.attach(label === 'default' ? 'default-styles' : `${label}-styles`, {
                body: JSON.stringify({ expected: referenceNodes, actual: vueNodes }),
                contentType: 'application/json',
              });
              expect(vueNodes).toHaveLength(referenceNodes.length);
              for (const [i, node] of vueNodes.entries()) {
                const { rect: a, ...actualNode } = node;
                const { rect: b, ...expectedNode } = referenceNodes[i]!;
                expect(actualNode, `${label} node ${i}`).toEqual(expectedNode);
                for (const axis of ['x', 'y', 'width', 'height'] as const)
                  expect(
                    Math.abs(a[axis] - b[axis]),
                    `${label} node ${i} ${axis}`,
                  ).toBeLessThanOrEqual(0.5);
              }
              const images = await Promise.all([expected, actual].map((root) => root.screenshot()));
              for (const [i, side] of ['reference', 'vue'].entries())
                await info.attach(label === 'default' ? side : `${label}-${side}`, {
                  body: images[i]!,
                  contentType: 'image/png',
                });
              await expectScreenshotPixelsToMatch(vue, images[1]!, images[0]!, `${name}/${label}`);
              // Tight region crops prevent blank content from diluting navigation/footer differences.
              if (index >= 5 && (vue.viewportSize()?.width ?? 0) >= 768) {
                for (const selector of [
                  '.semi-navigation',
                  '.semi-breadcrumb-wrapper',
                  '.semi-skeleton',
                  '.semi-layout-footer',
                ]) {
                  for (let i = 0; i < (await actual.locator(selector).count()); i++) {
                    await align();
                    const a = actual.locator(selector).nth(i),
                      b = expected.locator(selector).nth(i);
                    const boxes = await Promise.all([b.boundingBox(), a.boundingBox()]);
                    if (!boxes[0] || !boxes[1]) throw new Error('Missing region');
                    for (const axis of ['x', 'y', 'width', 'height'] as const)
                      expect(
                        Math.abs(boxes[0][axis] - boxes[1][axis]),
                        `${selector} ${axis}`,
                      ).toBeLessThanOrEqual(0.5);
                    const rect = boxes[1];
                    const clip = {
                      x: Math.floor(rect.x),
                      y: Math.floor(rect.y),
                      width: Math.ceil(rect.x + rect.width) - Math.floor(rect.x),
                      height: Math.ceil(rect.y + rect.height) - Math.floor(rect.y),
                    };
                    const shots = await Promise.all(
                      [reference, vue].map((page) => page.screenshot({ clip })),
                    );
                    await expectScreenshotPixelsToMatch(
                      vue,
                      shots[1]!,
                      shots[0]!,
                      `${name}/${label}/${selector}-${i}`,
                    );
                  }
                }
              }
            }

            async function hoverTip(selector: string, text: string, label: string) {
              for (let round = 0; round < 2; round++) {
                await align();
                for (const root of [expected, actual]) {
                  await root.locator(selector).first().hover();
                  await expect(root.page().locator('.semi-tooltip-wrapper')).toHaveCount(1);
                  await expect(root.page().locator('.semi-tooltip-content')).toHaveText(text);
                }
                const tips = [reference, vue].map((page) => page.locator('.semi-tooltip-wrapper'));
                await Promise.all(
                  tips.map((tip) =>
                    tip.evaluate(async (el) => {
                      await Promise.all(el.getAnimations({ subtree: true }).map((a) => a.finished));
                    }),
                  ),
                );
                const nodes = await Promise.all(tips.map((tip) => measure(tip, true)));
                expect(nodes[1]).toHaveLength(nodes[0]!.length);
                for (const [i, node] of nodes[1]!.entries()) {
                  const { rect: a, ...value } = node,
                    { rect: b, ...expectedValue } = nodes[0]![i]!;
                  expect(value).toEqual(expectedValue);
                  for (const axis of ['x', 'y', 'width', 'height'] as const)
                    expect(Math.abs(a[axis] - b[axis])).toBeLessThanOrEqual(0.5);
                }
                const boxes = await Promise.all(tips.map((tip) => tip.boundingBox()));
                for (const axis of ['x', 'y', 'width', 'height'] as const)
                  expect(Math.abs(boxes[0]![axis] - boxes[1]![axis])).toBeLessThanOrEqual(0.5);
                const clip = await tips[1]!.evaluate((el) => {
                  const rects = [el, ...el.querySelectorAll('*')].map((n) =>
                    n.getBoundingClientRect(),
                  );
                  const x = Math.floor(Math.min(...rects.map((r) => r.left))),
                    y = Math.floor(Math.min(...rects.map((r) => r.top)));
                  return {
                    x,
                    y,
                    width: Math.ceil(Math.max(...rects.map((r) => r.right))) - x,
                    height: Math.ceil(Math.max(...rects.map((r) => r.bottom))) - y,
                  };
                });
                const shots = await Promise.all(
                  [reference, vue].map((page) => page.screenshot({ clip })),
                );
                for (const [i, side] of ['reference', 'vue'].entries())
                  await info.attach(`${label}-${round}-${side}`, {
                    body: shots[i]!,
                    contentType: 'image/png',
                  });
                await expectScreenshotPixelsToMatch(vue, shots[1]!, shots[0]!, `${label}-${round}`);
                for (const page of [reference, vue]) {
                  await page.mouse.move(0, 0);
                  await expect(page.locator('.semi-tooltip-wrapper')).toHaveCount(0);
                }
              }
            }

            await test.step('默认结构、样式、几何与局部像素', async () => {
              if (name === 'Responsive')
                for (const page of [reference, vue])
                  await expect.poll(() => breakpoints.get(page)).toEqual(['md true']);
              await compare('default');
            });
            const widths = name === 'Responsive' ? [767, 768, 390, 1440] : [390, 1440];
            for (const [step, width] of widths.entries())
              await test.step(`真实视口 ${step}: ${width}`, async () => {
                await Promise.all(
                  [reference, vue].map((page) => page.setViewportSize({ width, height: 900 })),
                );
                if (name === 'Responsive')
                  for (const page of [reference, vue]) {
                    await expect
                      .poll(() => breakpoints.get(page))
                      .toEqual(
                        ['md true', 'md false', 'md true', 'md false', 'md true'].slice(
                          0,
                          step + 2,
                        ),
                      );
                  }
                await compare(`resize-${step}-${width}`);
              });

            if (index >= 5) {
              await test.step('菜单鼠标选择与键盘焦点', async () => {
                for (const root of [expected, actual]) {
                  const items = root.locator('.semi-navigation-item-normal[role="menuitem"]');
                  await expect(items).toHaveCount(index === 5 ? 3 : 4);
                  await items.nth(1).click();
                  await expect(items.nth(1)).toHaveClass(/semi-navigation-item-selected/);
                  await items.last().press('Enter');
                  await expect(items.last()).toHaveClass(/semi-navigation-item-selected/);
                  await expect(items.last()).toBeFocused();
                }
                await compare('keyboard-selected');
              });
              if (index >= 6)
                await test.step('侧栏折叠、恢复与再次折叠', async () => {
                  for (const [step, collapsed] of [true, false, true, false].entries()) {
                    for (const root of [expected, actual]) {
                      await root.locator('.semi-navigation-collapse-btn button').press('Enter');
                      await expect(root.locator('.semi-navigation-collapsed')).toHaveCount(
                        collapsed ? 1 : 0,
                      );
                      if (name === 'SideNavigation')
                        await expect(root.locator('.semi-navigation-header-text')).toHaveCount(
                          collapsed ? 0 : 1,
                        );
                    }
                    await compare(`collapse-${step}`);
                    if (step === 0) {
                      // Below the original 1400px TOC breakpoint, both tooltip crops have the
                      // same real background. At 1440px the Vue-only TOC shows through corners.
                      await Promise.all(
                        [reference, vue].map((page) =>
                          page.setViewportSize({ width: 1399, height: 900 }),
                        ),
                      );
                      await expect(vue.locator('.category-anchor')).toBeHidden();
                      await compare('collapsed-at-toc-breakpoint');
                      await hoverTip(
                        '.semi-navigation-vertical .semi-navigation-item-normal',
                        locale === 'zh-cn' ? '首页' : 'Home',
                        'collapsed-item-tip',
                      );
                      await hoverTip(
                        '.semi-navigation-collapse-btn button',
                        locale === 'zh-cn' ? '展开侧边栏' : 'Expand Sidebar',
                        'expand-tip',
                      );
                      await Promise.all(
                        [reference, vue].map((page) =>
                          page.setViewportSize({ width: 1440, height: 900 }),
                        ),
                      );
                      await compare('collapsed-return-from-toc-breakpoint');
                    }
                  }
                });
              for (const label of locale === 'zh-cn' ? ['通知', '帮助'] : ['Notifications', 'Help'])
                await expect(
                  actual.getByRole('button', { name: label, exact: true }),
                ).toBeVisible();
            }

            if (theme === 'light' && direction === 'ltr')
              await test.step('源码、重置、实际编辑运行与关闭重开', async () => {
                const content = (root: Locator) =>
                  root.locator('.semi-layout-content').textContent();
                const initial = await content(actual);
                const button = (zh: string, en: string) =>
                  demo.getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
                await button('查看源码', 'View source').click();
                await expect(demo.locator('[data-demo-source]')).toBeVisible();
                await button('查看源码', 'View source').click();
                await expect(demo.locator('[data-demo-source]')).toBeHidden();
                await button('重置', 'Reset').click();
                await expect(actual.locator('.semi-layout-content')).toHaveCount(1);
                expect(await content(actual)).toEqual(initial);
                await button('在线编辑', 'Edit online').click();
                const preview = demo.frameLocator('iframe').locator('#app');
                async function originalPreview() {
                  await expect(preview.locator('.semi-layout-content')).toHaveCount(1, {
                    timeout: 30_000,
                  });
                  expect(await content(preview)).toEqual(initial);
                  if (index >= 5) {
                    await expect(preview.locator('.semi-avatar')).toHaveText('YJ');
                    await expect(preview.locator('.semi-navigation-item-normal')).toHaveCount(
                      index === 5 ? 3 : 4,
                    );
                  } else
                    await expect(preview.locator('.semi-layout-content')).toHaveCSS(
                      'height',
                      '300px',
                    );
                }
                await originalPreview();
                if (name === 'ThreeSections' || name === 'SideNavigation') {
                  const edited =
                    name === 'ThreeSections'
                      ? source.replace('>Content</LayoutContent>', '>Edited Layout</LayoutContent>')
                      : source.replace('YJ</Avatar>', 'QA</Avatar>');
                  expect(edited).not.toBe(source);
                  const editor = demo.locator('.monaco-editor textarea.inputarea');
                  await editor.focus();
                  await editor.press('ControlOrMeta+A');
                  await vue.keyboard.insertText(edited);
                  await button('运行', 'Run').click();
                  await expect(
                    preview.locator(
                      name === 'ThreeSections' ? '.semi-layout-content' : '.semi-avatar',
                    ),
                  ).toHaveText(name === 'ThreeSections' ? 'Edited Layout' : 'QA');
                  await button('重置', 'Reset').click();
                  await originalPreview();
                }
                await expect(demo.locator('.msg.err')).toHaveCount(0);
                await button('退出编辑', 'Close editor').click();
                await expect(demo.locator('iframe')).toHaveCount(0);
                await expect(actual.locator('.semi-layout-content')).toHaveCount(1);
                expect(await content(actual)).toEqual(initial);
                await button('在线编辑', 'Edit online').click();
                await originalPreview();
                await button('退出编辑', 'Close editor').click();
                await expect(demo.locator('iframe')).toHaveCount(0);
              });
            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'basic/layout',
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
