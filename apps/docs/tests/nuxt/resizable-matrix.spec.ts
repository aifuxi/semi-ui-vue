import { readFile } from 'node:fs/promises';
import { expect, test, type Locator } from '@playwright/test';
import { freezeAnimations } from './demo-parity';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

test.use({ actionTimeout: 10_000 });

const names = [
  'Basic',
  'Direction',
  'Ratio',
  'AspectRatio',
  'Limits',
  'Controlled',
  'Scale',
  'Bounds',
  'Handle',
  'Grid',
  'Group',
  'Nested',
  'ComplexNested',
  'DynamicDirection',
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
      'min-width',
      'max-width',
      'max-height',
      'cursor',
      'transform',
      'transform-origin',
      'rotate',
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
      ...element.querySelectorAll('div, button, input, h6, span, svg'),
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
        test(`Resizable 文档 ${name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
          browser,
        }, info) => {
          test.setTimeout(90_000);
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
            }
            await vue.addInitScript((value) => {
              if (window === window.top) localStorage.setItem('semi-docs-theme', value);
            }, theme);
            await reference.goto(
              `http://127.0.0.1:4173/docs.html?component=resizable&locale=${locale}&theme=${theme}&example=${index + 1}`,
            );
            const expected = reference.locator('#root');
            const component = index < 10 ? '.semi-resizable-resizable' : '.semi-resizable-group';
            await expect(expected.locator(component).first()).toBeVisible();
            await vue.goto(`/${locale}/components/resizable/`);
            const demo = vue.locator(`[data-demo-id="resizable/${locale}/${name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual.locator(component).first()).toBeVisible();
            const source = await readFile(
              new URL(`../../src/demos/resizable/${locale}/${name}.vue`, import.meta.url),
              'utf8',
            );
            expect(await demo.locator('[data-demo-source] code').textContent()).toBe(source);
            await waitForVisualAssets([expected, actual]);
            for (const root of [expected, actual])
              await root.evaluate((element, dir) => {
                (element as HTMLElement).dir = dir;
                element.classList.toggle('semi-rtl', dir === 'rtl');
              }, direction);

            async function align(move = true) {
              // Wait for the site's real mobile sidebar transition before sampling.
              await vue.locator('#side-nav').evaluate(async (sidebar) => {
                await Promise.all(sidebar.getAnimations().map((animation) => animation.finished));
              });
              await actual.scrollIntoViewIfNeeded();
              const box = await actual.boundingBox();
              if (!box) throw new Error('Missing Resizable preview');
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
              if (move) await Promise.all([reference, vue].map((page) => page.mouse.move(0, 0)));
            }

            async function compare(label: string, dragging = false) {
              // Moving off Switch starts its hover-exit transition; wait after moving the pointer.
              if (!dragging) await align();
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
            }

            async function drag(
              selector: string,
              nth: number,
              dx: number,
              dy: number,
              label: string,
            ) {
              await align();
              // Resolve the visible handle after alignment; never dispatch a synthetic start event.
              for (const root of [expected, actual]) {
                const sizing = root.locator(index < 10 ? component : '.semi-resizable-item');
                const sizes = () =>
                  sizing.evaluateAll((nodes) =>
                    nodes.map((node) => {
                      const r = node.getBoundingClientRect();
                      return [r.width, r.height];
                    }),
                  );
                const before = await sizes();
                const handle = root.locator(selector).nth(nth);
                const box = await handle.boundingBox();
                if (!box) throw new Error(`Missing ${label} handle`);
                const x = box.x + box.width / 2,
                  y = box.y + box.height / 2;
                await root.page().mouse.move(x, y);
                await root.page().mouse.down();
                await root.page().mouse.move(x + dx, y + dy, { steps: 4 });
                await expect(root.locator('.semi-resizable-background')).toHaveCount(1);
                expect(await sizes(), `${label} changes dimensions`).not.toEqual(before);
                if (
                  name === 'Basic' ||
                  name === 'Nested' ||
                  name === 'Group' ||
                  name === 'DynamicDirection' ||
                  label === 'deep-vertical'
                )
                  await expect(root).toContainText('resizing');
                if (name === 'Basic' || name === 'Nested')
                  await expect(
                    root.page().locator('.semi-toast-content').filter({ hasText: 'resize start' }),
                  ).toBeVisible();
              }
              await compare(`${label}-dragging`, true);
              for (const root of [expected, actual]) {
                await root.page().mouse.up();
                await expect(root.locator('.semi-resizable-background')).toHaveCount(0);
                if (name === 'Basic' || name === 'Nested') {
                  await expect(
                    root.page().locator('.semi-toast-content').filter({ hasText: 'resize end' }),
                  ).toBeVisible();
                  await expect(root.page().locator('.semi-toast')).toHaveCount(0);
                }
              }
              await compare(`${label}-released`);
            }

            await test.step('默认结构、样式、几何与局部像素', () => compare('default'));
            await test.step('真实拖拽、回调与约束', async () => {
              const right = '.semi-resizable-resizableHandler-right';
              const corner = '.semi-resizable-resizableHandler-bottomRight';
              const group = '.semi-resizable-handler';
              if (index < 10) {
                // Scale's 10px visible height makes the corner overlap the side handle.
                const handle = name === 'Scale' ? corner : right;
                await drag(handle, 0, 40, 0, 'grow');
                await drag(handle, 0, -20, 0, 'shrink');
                if (name === 'AspectRatio') await drag(right, 1, 32, 0, 'numeric-aspect');
                if (name === 'Limits' || name === 'Bounds') {
                  await drag(corner, 0, 220, 220, 'maximum');
                  await drag(corner, 0, -260, -300, 'minimum');
                }
                if (name === 'Grid') await drag(right, 0, 90, 0, 'grid-step');
                if (name === 'Direction') {
                  for (const [step, enabled] of [true, false, true].entries()) {
                    for (const root of [expected, actual]) {
                      if (step === 1) {
                        await root.getByRole('switch').press('Space');
                        await expect(root.getByRole('switch')).toBeFocused();
                      } else await root.getByRole('switch').click();
                      await expect(
                        root.locator('.semi-resizable-resizableHandler-left'),
                      ).toHaveCount(enabled ? 1 : 0);
                    }
                    await compare(`left-enabled-${enabled}`);
                    if (enabled)
                      await drag('.semi-resizable-resizableHandler-left', 0, -20, 0, 'left-grow');
                  }
                }
                if (name === 'Controlled') {
                  for (const root of [expected, actual])
                    await root.getByRole('button', { name: 'set += 10' }).press('Enter');
                  await compare('controlled-button-after-drag');
                  await drag(corner, 0, 20, 20, 'controlled-corner');
                }
              } else if (name === 'Group') {
                await drag(group, 0, 40, 0, 'group-first');
                await drag(group, 0, -360, 0, 'group-constraint');
                await drag(group, 1, -20, 0, 'group-middle');
                await drag(group, 2, -20, 0, 'group-weighted');
              } else if (name === 'Nested') {
                await drag(group, 0, 0, 30, 'outer-vertical');
                await drag(group, 1, 30, 0, 'inner-horizontal');
              } else if (name === 'ComplexNested') {
                await drag(group, 0, 30, 0, 'upper-horizontal');
                await drag(group, 1, 0, 25, 'deep-vertical');
                await drag(group, 2, 0, -80, 'deep-maximum');
                await drag(group, 3, -30, 0, 'upper-right-constraint');
                await drag(group, 4, 0, -30, 'outer-vertical');
                await drag(group, 5, 30, 0, 'lower-horizontal');
              } else {
                await drag(group, 0, 20, 0, 'inner-horizontal');
                await drag(group, 1, 20, 0, 'outer-horizontal');
                for (const value of ['vertical', 'horizontal']) {
                  for (const root of [expected, actual]) {
                    await root.getByRole('button').click();
                    await expect(root.getByRole('button')).toHaveText(value);
                    await expect(root.locator(group).nth(1)).toHaveClass(
                      new RegExp(`handler-${value}`),
                    );
                  }
                  await compare(`direction-${value}`);
                  await drag(
                    group,
                    1,
                    value === 'horizontal' ? -20 : 0,
                    value === 'vertical' ? -20 : 0,
                    `switched-${value}`,
                  );
                }
              }
            });

            if (name === 'Basic' || name === 'Nested')
              await test.step('隔离页面的短时 Toast 视觉、消失与重开', async () => {
                // These pages never load Monaco. Business timers are sampled without extending them.
                const timedContext = await visualContext(browser, info, locale, theme, direction);
                const pages = [await timedContext.newPage(), await timedContext.newPage()];
                try {
                  for (const page of pages) {
                    page.on('pageerror', (error) => errors.push(error.message));
                    page.on('console', (message) => {
                      if (message.type() === 'error') errors.push(message.text());
                    });
                  }
                  await pages[0]!.goto(
                    `http://127.0.0.1:4173/docs.html?component=resizable&locale=${locale}&theme=${theme}&example=${index + 1}`,
                  );
                  await pages[1]!.addInitScript(
                    (value) => localStorage.setItem('semi-docs-theme', value),
                    theme,
                  );
                  await pages[1]!.goto(`/${locale}/components/resizable/`);
                  const roots = [
                    pages[0]!.locator('#root'),
                    pages[1]!.locator(
                      `[data-demo-id="resizable/${locale}/${name}"] [data-demo-preview]`,
                    ),
                  ];
                  for (const root of roots) {
                    await expect(root.locator(component).first()).toBeVisible();
                    await root.evaluate((el, dir) => {
                      (el as HTMLElement).dir = dir;
                      el.classList.toggle('semi-rtl', dir === 'rtl');
                    }, direction);
                  }
                  await waitForVisualAssets(roots);
                  await roots[1]!.scrollIntoViewIfNeeded();
                  const box = await roots[1]!.boundingBox();
                  if (!box) throw new Error('Missing toast trigger preview');
                  const frame = await roots[1]!.evaluate((el) => ({
                    padding: getComputedStyle(el).padding,
                    overflow: getComputedStyle(el).overflow,
                    scroll: scrollY,
                    height: document.documentElement.scrollHeight,
                  }));
                  await roots[0]!.evaluate(
                    (el, { box, frame }) => {
                      Object.assign((el as HTMLElement).style, {
                        boxSizing: 'border-box',
                        padding: frame.padding,
                        overflow: frame.overflow,
                        width: `${box.width}px`,
                        position: 'relative',
                        left: `${box.x}px`,
                        top: `${box.y + frame.scroll}px`,
                      });
                      document.body.style.minHeight = `${frame.height}px`;
                      window.scrollTo(0, frame.scroll);
                    },
                    { box, frame },
                  );
                  // Playwright's clock is shared by every page in a context. Advance it once per paired step.
                  const time = new Date('2024-08-15T02:24:30Z');
                  await pages[0]!.clock.install({ time });
                  await pages[0]!.clock.pauseAt(time);
                  async function toastCompare(label: string, count: number) {
                    await freezeAnimations(pages, 300);
                    for (const page of pages)
                      await expect(page.locator('.semi-toast')).toHaveCount(count);
                    for (let i = 0; i < count; i++) {
                      const targets = pages.map((page) => page.locator('.semi-toast').nth(i));
                      const nodes = await Promise.all(
                        targets.map((target) => measure(target, true)),
                      );
                      await info.attach(`${label}-${i}-styles`, {
                        body: JSON.stringify({ expected: nodes[0], actual: nodes[1] }),
                        contentType: 'application/json',
                      });
                      expect(nodes[1]).toHaveLength(nodes[0]!.length);
                      for (const [n, node] of nodes[1]!.entries()) {
                        const { rect: a, ...value } = node,
                          { rect: b, ...baseline } = nodes[0]![n]!;
                        expect(value, `${label} toast ${i} node ${n}`).toEqual(baseline);
                        for (const axis of ['x', 'y', 'width', 'height'] as const)
                          expect(Math.abs(a[axis] - b[axis])).toBeLessThanOrEqual(0.5);
                      }
                      const boxes = await Promise.all(
                        targets.map((target) => target.boundingBox()),
                      );
                      for (const axis of ['x', 'y', 'width', 'height'] as const)
                        expect(Math.abs(boxes[0]![axis] - boxes[1]![axis])).toBeLessThanOrEqual(
                          0.5,
                        );
                      const shots = await Promise.all(targets.map((target) => target.screenshot()));
                      for (const [side, shot] of shots.entries())
                        await info.attach(`${label}-${i}-${side === 0 ? 'reference' : 'vue'}`, {
                          body: shot,
                          contentType: 'image/png',
                        });
                      await expectScreenshotPixelsToMatch(pages[1]!, shots[1]!, shots[0]!, label);
                    }
                  }
                  for (let round = 0; round < 2; round++) {
                    for (const root of roots) {
                      const handle = root
                        .locator(
                          name === 'Basic'
                            ? '.semi-resizable-resizableHandler-right'
                            : '.semi-resizable-handler',
                        )
                        .first();
                      const rect = await handle.boundingBox();
                      if (!rect) throw new Error('Missing Toast resize handle');
                      await root
                        .page()
                        .mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
                      await root.page().mouse.down();

                      await expect(root.page().locator('.semi-toast-content')).toHaveText(
                        'resize start',
                      );
                    }
                    await pages[0]!.clock.runFor(300);
                    await toastCompare(`toast-start-${round}`, 1);
                    for (const page of pages) {
                      await page.mouse.up();

                      await expect(page.locator('.semi-toast-content')).toHaveText([
                        'resize start',
                        'resize end',
                      ]);
                    }
                    await pages[0]!.clock.runFor(300);
                    await toastCompare(`toast-end-${round}`, 2);
                    await pages[0]!.clock.runFor(1500);
                    for (const page of pages) {
                      await expect(page.locator('.semi-toast')).toHaveCount(0);
                    }
                  }
                } finally {
                  await timedContext.close();
                }
              });

            if (theme === 'light' && direction === 'ltr')
              await test.step('源码、重置、编辑运行与关闭重开', async () => {
                const button = (zh: string, en: string) =>
                  demo.getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
                await button('查看源码', 'View source').click();
                await expect(demo.locator('[data-demo-source]')).toBeVisible();
                await button('查看源码', 'View source').click();
                await expect(demo.locator('[data-demo-source]')).toBeHidden();
                await button('重置', 'Reset').click();
                await expect(actual.locator(component).first()).toBeVisible();
                const original = await actual.locator(component).first().textContent();
                await button('在线编辑', 'Edit online').click();
                const preview = demo.frameLocator('iframe').locator('#app');
                async function originalPreview() {
                  await expect(preview.locator(component).first()).toBeVisible({ timeout: 30_000 });
                  await expect(preview.locator(component).first()).toHaveText(original ?? '');
                }
                await originalPreview();
                if (name === 'Basic' || name === 'DynamicDirection') {
                  const edited = source.replace(
                    name === 'Basic' ? 'Drag edge to resize' : 'drag to resize',
                    'Edited resize',
                  );
                  expect(edited).not.toBe(source);
                  const editor = demo.locator('.monaco-editor textarea.inputarea');
                  await editor.focus();
                  await editor.press('ControlOrMeta+A');
                  await vue.keyboard.insertText(edited);
                  await button('运行', 'Run').click();
                  await expect(preview.locator(component).first()).toContainText('Edited resize');
                  await button('重置', 'Reset').click();
                  await originalPreview();
                }
                await expect(demo.locator('.msg.err')).toHaveCount(0);
                await button('退出编辑', 'Close editor').click();
                await expect(demo.locator('iframe')).toHaveCount(0);
                await expect(actual.locator(component).first()).toBeVisible();
                await button('在线编辑', 'Edit online').click();
                await originalPreview();
                await button('退出编辑', 'Close editor').click();
                await expect(demo.locator('iframe')).toHaveCount(0);
              });
            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'basic/resizable',
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
