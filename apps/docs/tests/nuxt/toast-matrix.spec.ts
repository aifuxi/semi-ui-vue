import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page, type TestInfo } from '@playwright/test';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

test.use({ actionTimeout: 10_000 });
const referenceOrigin = 'http://127.0.0.1:4173';
const examples = [
  { name: 'Basic', zh: 1, en: 1 },
  { name: 'Types', zh: 2, en: 2 },
  { name: 'Colored', zh: 3, en: 3 },
  { name: 'Links', zh: 4, en: 5 },
  { name: 'Delay', zh: 5, en: 6 },
  { name: 'ManualClose', zh: 6, en: 7 },
  { name: 'Update', zh: 7, en: 8 },
  { name: 'Context', zh: 8, en: 9 },
  { name: 'Factory', zh: 9, en: 10 },
] as const;

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
      'border-radius',
      'outline-color',
      'outline-style',
      'outline-width',
      'outline-offset',
      'box-shadow',
      'fill',
      'opacity',
      'min-width',
      'width',
      'max-width',
      'height',
      'transform',
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
          text: [...node.childNodes]
            .filter((child) => child.nodeType === Node.TEXT_NODE)
            .map((child) => child.textContent)
            .join('')
            .replace(/\s+/g, ' ')
            .trim(),
          role: node.getAttribute('role'),
          label: node.getAttribute('aria-label'),
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

async function assertComparable(reference: Locator, vue: Locator, info: TestInfo, state: string) {
  await waitForVisualAssets([reference, vue]);
  const [expected, actual] = await Promise.all([measure(reference), measure(vue)]);
  await info.attach(`${state}-styles`, {
    body: JSON.stringify({ expected, actual }),
    contentType: 'application/json',
  });
  expect(actual.length, state).toBe(expected.length);
  for (const [i, node] of actual.entries()) {
    const { rect: a, ...actualNode } = node;
    const { rect: b, ...expectedNode } = expected[i]!;
    expect(actualNode, `${state} node ${i}`).toEqual(expectedNode);
    for (const axis of ['x', 'y', 'width', 'height'] as const)
      expect(Math.abs(a[axis] - b[axis]), `${state} node ${i} ${axis}`).toBeLessThanOrEqual(0.5);
  }
}

/** The demo root has no shared background, so compare it directly and keep the
 *  required `default-styles`/`reference`/`vue` attachments for the batch report. */
async function compareDemoRoot(reference: Locator, vue: Locator, info: TestInfo) {
  await assertComparable(reference, vue, info, 'default');
  const shots = await Promise.all([reference.screenshot(), vue.screenshot()]);
  await info.attach('reference', { body: shots[0]!, contentType: 'image/png' });
  await info.attach('vue', { body: shots[1]!, contentType: 'image/png' });
  await expectScreenshotPixelsToMatch(vue.page(), shots[1]!, shots[0]!, 'default');
}

/** `theme="light"` toasts paint a translucent fill, so the two hosts' chrome would show
 *  through. Keep only the toast's ancestor chain and normalize the base background. */
const toastCaptureStyle = `
  html, body { background: var(--semi-color-bg-0) !important; }
  body *:not(.semi-toast):not(.semi-toast *):not(:has(.semi-toast)) { visibility: hidden !important; }
`;

/** The toast card is the opaque target; the transparent `.semi-toast` root can expose
 *  unrelated host chrome behind it, and the hook holder renders it in place. */
async function compareToasts(info: TestInfo, pages: Page[], state: string) {
  const lists = pages.map((page) => page.locator('.semi-toast'));
  const counts = await Promise.all(lists.map((list) => list.count()));
  expect(counts[0], `${state} 数量`).toBe(counts[1]);
  for (let i = 0; i < counts[0]!; i += 1) {
    const reference = lists[0]!.nth(i);
    const vue = lists[1]!.nth(i);
    const label = `${state}-${i}`;
    await assertComparable(reference, vue, info, label);
    const shots = await Promise.all([
      reference.locator('.semi-toast-content').screenshot({ style: toastCaptureStyle }),
      vue.locator('.semi-toast-content').screenshot({ style: toastCaptureStyle }),
    ]);
    await info.attach(`${label}-reference`, { body: shots[0]!, contentType: 'image/png' });
    await info.attach(`${label}-vue`, { body: shots[1]!, contentType: 'image/png' });
    await expectScreenshotPixelsToMatch(vue.page(), shots[1]!, shots[0]!, label);
  }
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

/** Wait for the enter animation to actually end so both sides sample the stable state. */
async function settleToasts(pages: Page[]) {
  for (const page of pages) await expect(page.locator('.semi-toast').first()).toBeVisible();
  await Promise.all(
    pages.map((page) =>
      page.evaluate(async () => {
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        );
        await Promise.all(
          document
            .getAnimations()
            .filter(
              (animation) =>
                'animationName' in animation && /semi-toast/.test(String(animation.animationName)),
            )
            .map((animation) => animation.finished.catch(() => undefined)),
        );
      }),
    ),
  );
}

for (const locale of ['zh-cn', 'en-us'])
  for (const theme of ['light', 'dark'])
    for (const [index, definition] of examples.entries())
      for (const direction of ['ltr', 'rtl'])
        test(`Toast 文档 ${definition.name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
          browser,
        }, info) => {
          test.setTimeout(150_000);
          const context = await visualContext(browser, info, locale, theme, direction);
          const sourceLocale = locale === 'zh-cn' ? 'zh-CN' : 'en-US';
          const exampleIndex = definition[locale === 'zh-cn' ? 'zh' : 'en'];
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
                  toastMotion: { phase: string; name: string }[];
                };
                win.toastMotion = [];
                for (const phase of ['animationstart', 'animationend'])
                  document.addEventListener(
                    phase,
                    (event) => {
                      const name = (event as AnimationEvent).animationName;
                      if (/semi-toast/.test(name)) win.toastMotion.push({ phase, name });
                    },
                    true,
                  );
              });
            }
            await vue.addInitScript((value) => {
              if (window === window.top) localStorage.setItem('semi-docs-theme', value);
            }, theme);
            await reference.goto(
              `${referenceOrigin}/docs.html?component=toast&locale=${locale}&theme=${theme}&example=${exampleIndex}`,
            );
            const expected = reference.locator('#root');
            await expect(expected.getByRole('button').first()).toBeVisible();
            await vue.goto(`/${locale}/components/toast/`);
            const demo = vue.locator(`[data-demo-id="toast/${sourceLocale}/${definition.name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual.getByRole('button').first()).toBeVisible();
            const roots = [expected, actual];
            const source = await readFile(
              new URL(
                `../../src/demos/toast/${sourceLocale}/${definition.name}.vue`,
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
            await compareDemoRoot(expected, actual, info);

            const click = async (nth: number) => {
              for (const root of roots) await root.getByRole('button').nth(nth).click();
            };
            const clickFirst = async () => {
              for (const root of roots) await root.getByRole('button').first().click();
            };
            const hoverFirstToast = async (page: Page) => {
              // Stacked toasts overlap, so the pointer must be moved by coordinate instead
              // of `hover()`, whose hit-target check lands on a later toast.
              const box = await page.locator('.semi-toast').first().boundingBox();
              if (!box) throw new Error('Missing toast bounding box');
              await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            };
            const pauseTimers = async () => {
              for (const page of pages) await hoverFirstToast(page);
            };
            const parkPointer = async () => {
              // Hovering a stacked toast unsets the wrapper perspective, which would make
              // one side skip the 3D scale for the next sample.
              for (const page of pages) await page.mouse.move(1435, 895);
            };
            const closeAll = async () => {
              for (const page of pages) {
                const buttons = page.locator('.semi-toast-close-button button');
                for (let i = (await buttons.count()) - 1; i >= 0; i -= 1)
                  await buttons.nth(i).click();
                await expect(page.locator('.semi-toast')).toHaveCount(0);
              }
              await parkPointer();
            };
            if (definition.name === 'Basic') {
              await test.step('3 秒堆叠提示、10 秒节流与 hover 展开', async () => {
                await click(0);
                await settleToasts(pages);
                // A single stacked toast expands to the same box, so hovering only pauses
                // its close timer before the comparison.
                await pauseTimers();
                await compareToasts(info, pages, 'single');
                await closeAll();

                await click(1);
                await settleToasts(pages);
                await pauseTimers();
                await compareToasts(info, pages, 'throttled');
                // A second call inside the 10s window is throttled away.
                await click(1);
                for (const page of pages) await expect(page.locator('.semi-toast')).toHaveCount(1);
                // Closing the toast cancels the throttle, so the next call shows again.
                for (const page of pages) {
                  await page.locator('.semi-toast-close-button button').first().click();
                  await expect(page.locator('.semi-toast')).toHaveCount(0);
                }
                await click(1);
                for (const page of pages) await expect(page.locator('.semi-toast')).toHaveCount(1);
                await closeAll();

                await click(0);
                await click(0);
                await settleToasts(pages);
                for (const page of pages) await expect(page.locator('.semi-toast')).toHaveCount(2);
                // The wrapper reset only happens on mouseleave while it still has height, so
                // enter the group first and then leave to sample the true collapsed state.
                await pauseTimers();
                await parkPointer();
                await reference.waitForTimeout(450);
                await compareToasts(info, pages, 'stacked-collapsed');
                // Hovering a stacked toast enters its innerWrapper too, which expands the
                // whole group and pauses that toast's close timer.
                await pauseTimers();
                await reference.waitForTimeout(400);
                await compareToasts(info, pages, 'stacked-expanded');
                await closeAll();
              });
            }

            if (definition.name === 'Types' || definition.name === 'Colored') {
              const total = definition.name === 'Types' ? 3 : 4;
              await test.step('每种 type/theme 的状态图标、颜色与退出', async () => {
                for (let i = 0; i < total; i += 1) {
                  await click(i);
                  await settleToasts(pages);
                  await pauseTimers();
                  await compareToasts(info, pages, `state-${i}`);
                  await closeAll();
                }
              });
            }

            if (definition.name === 'Links') {
              await test.step('单行与多行 Typography 链接内容', async () => {
                await click(0);
                await settleToasts(pages);
                await pauseTimers();
                await compareToasts(info, pages, 'single-line');
                for (const page of pages) await expect(page.locator('.semi-toast')).toHaveCount(1);
                await closeAll();
                await click(1);
                await settleToasts(pages);
                await pauseTimers();
                await compareToasts(info, pages, 'multi-line');
                for (const page of pages) {
                  const content = page.locator('.semi-toast-content');
                  await expect(content.locator('.semi-typography-link')).toHaveCount(2);
                  expect(
                    await content
                      .locator('.semi-typography-link')
                      .nth(1)
                      .evaluate((node) => getComputedStyle(node).marginLeft),
                  ).toBe('20px');
                }
                await closeAll();
              });
            }

            if (definition.name === 'Delay') {
              await test.step('10 秒延时的稳定提示', async () => {
                await click(0);
                await settleToasts(pages);
                await pauseTimers();
                await compareToasts(info, pages, 'opened');
                await closeAll();
              });
            }

            if (definition.name === 'ManualClose') {
              await test.step('duration 0 重复展示去重与手动关闭', async () => {
                await click(0);
                await settleToasts(pages);
                await pauseTimers();
                await compareToasts(info, pages, 'shown');
                await clickFirst();
                for (const page of pages) await expect(page.locator('.semi-toast')).toHaveCount(1);
                await click(1);
                for (const page of pages) await expect(page.locator('.semi-toast')).toHaveCount(0);
                // Hiding while already closed stays a no-op.
                await click(1);
                for (const page of pages) await expect(page.locator('.semi-toast')).toHaveCount(0);
              });
            }

            if (definition.name === 'Update') {
              await test.step('同 id 原位更新类型与内容', async () => {
                await click(0);
                await settleToasts(pages);
                // The pinned example updates after 1s; compare the settled updated state so
                // the sample is not racing the timer.
                for (const page of pages)
                  await expect(page.locator('.semi-toast-content-text')).toHaveText(
                    'Id By Content Update',
                    { timeout: 5_000 },
                  );
                await pauseTimers();
                for (const page of pages) await expect(page.locator('.semi-toast')).toHaveCount(1);
                await compareToasts(info, pages, 'updated');
                await closeAll();
              });
            }

            if (definition.name === 'Context') {
              await test.step('hook holder 就地渲染并消费 provide/inject 上下文', async () => {
                await clickFirst();
                await settleToasts(pages);
                await pauseTimers();
                await compareToasts(info, pages, 'hook');
                for (const page of pages) {
                  await expect(page.locator('.semi-toast-content-text')).toHaveText(
                    'ReachableContext: Light',
                  );
                  // The pinned HookToast renders a bare Toast: no innerWrapper ancestor.
                  await expect(page.locator('.semi-toast-innerWrapper')).toHaveCount(0);
                }
                await closeAll();
              });
            }

            if (definition.name === 'Factory') {
              await test.step('自定义容器实例隔离与 fixed 定位', async () => {
                await click(1);
                await settleToasts(pages);
                await pauseTimers();
                await compareToasts(info, pages, 'custom-container');
                await expect(
                  reference
                    .locator('#custom-toast-container')
                    .locator(':scope > .semi-toast-wrapper'),
                ).toHaveCount(1);
                await expect(
                  actual.locator('[data-toast-container]').locator(':scope > .semi-toast-wrapper'),
                ).toHaveCount(1);
                await closeAll();
              });
            }

            if (definition.name === 'Basic' && locale === 'en-us')
              await test.step('英文独有 Stacking 示例的堆叠与 hover 展开', async () => {
                await reference.goto(
                  `${referenceOrigin}/docs.html?component=toast&locale=${locale}&theme=${theme}&example=4`,
                );
                // The Vue page shares one imperative instance across every demo, so reload it
                // to start from the same fresh hover state as the navigated reference; both
                // navigations reset the body direction, so re-apply it on each side.
                await vue.goto(`/${locale}/components/toast/`);
                for (const page of pages)
                  await page.evaluate((dir) => {
                    document.body.dir = dir;
                    document.body.classList.toggle('semi-rtl', dir === 'rtl');
                  }, direction);
                const stackingRef = reference.locator('#root');
                const stackingDemo = vue.locator('[data-demo-id="toast/en-US/Stacking"]');
                const stackingVue = stackingDemo.locator('[data-demo-preview]');
                await expect(stackingRef.getByRole('button').first()).toBeVisible();
                await expect(stackingVue.getByRole('button').first()).toBeVisible();
                await waitForVisualAssets([stackingRef, stackingVue]);
                await alignRoot(stackingRef, stackingVue);
                await parkPointer();
                for (let i = 0; i < 3; i += 1) {
                  await stackingRef.getByRole('button').first().click();
                  await stackingVue.getByRole('button').first().click();
                }
                await settleToasts([reference, vue]);
                for (const page of pages) await expect(page.locator('.semi-toast')).toHaveCount(3);
                await pauseTimers();
                await parkPointer();
                await reference.waitForTimeout(450);
                await compareToasts(info, pages, 'stacking-collapsed');
                await pauseTimers();
                await reference.waitForTimeout(400);
                await compareToasts(info, pages, 'stacking-expanded');
                await closeAll();
              });

            if (definition.name !== 'Context')
              await test.step('进入与退出动效真实发生', async () => {
                for (const [i, page] of pages.entries()) {
                  const motion = await page.evaluate(
                    () =>
                      (window as unknown as { toastMotion: { phase: string; name: string }[] })
                        .toastMotion,
                  );
                  await info.attach(`motion-${i}`, {
                    body: JSON.stringify(motion),
                    contentType: 'application/json',
                  });
                  expect(
                    motion.some(
                      (item) =>
                        item.phase === 'animationstart' && /keyframe-toast-show/.test(item.name),
                    ),
                  ).toBe(true);
                  expect(
                    motion.some(
                      (item) =>
                        item.phase === 'animationend' && /keyframe-toast-hide/.test(item.name),
                    ),
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
                await preview.getByRole('button').first().click();
                const editorToast = demo.frameLocator('iframe').locator('.semi-toast');
                await expect(editorToast).toBeVisible();
                if (definition.name === 'Update')
                  await expect(
                    demo.frameLocator('iframe').locator('.semi-toast-content-text'),
                  ).toHaveText('Id By Content Update', { timeout: 5_000 });
                await editorToast.locator('.semi-toast-close-button button').click();
                await expect(editorToast).toHaveCount(0);
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

            if (definition.name === 'Basic' && theme === 'light' && direction === 'ltr')
              await test.step('独立时钟下的 3s / 10s / 同 id 更新重启 / duration 0', async () => {
                // Clock control is isolated from every page that has loaded the real editor.
                const timingContext = await visualContext(browser, info, locale, theme, direction);
                const notice = (page: Page) => page.locator('.semi-toast');
                const hiding = (page: Page) => page.locator('.semi-toast-animation-hide');
                try {
                  const scenarios = [
                    { name: 'Basic', index: 1 },
                    { name: 'Delay', index: locale === 'zh-cn' ? 5 : 6 },
                    { name: 'Update', index: locale === 'zh-cn' ? 7 : 8 },
                    { name: 'ManualClose', index: locale === 'zh-cn' ? 6 : 7 },
                  ] as const;
                  for (const side of ['reference', 'vue'] as const)
                    for (const scenario of scenarios) {
                      const page = await timingContext.newPage();
                      page.on('pageerror', (error) => errors.push(error.message));
                      let root: Locator;
                      if (side === 'reference') {
                        await page.goto(
                          `${referenceOrigin}/docs.html?component=toast&locale=${locale}&theme=${theme}&example=${scenario.index}`,
                        );
                        root = page.locator('#root');
                      } else {
                        await page.goto(`/${locale}/components/toast/`);
                        root = page.locator(
                          `[data-demo-id="toast/${sourceLocale}/${scenario.name}"] [data-demo-preview]`,
                        );
                      }
                      await expect(root.getByRole('button').first()).toBeVisible();
                      await waitForVisualAssets([root]);
                      await page.clock.install();
                      await page.clock.pauseAt((await page.evaluate(() => Date.now())) + 1000);
                      await root.getByRole('button').first().click();
                      await expect(notice(page)).toHaveCount(1);
                      if (scenario.name === 'Basic' || scenario.name === 'Delay') {
                        const deadline = scenario.name === 'Basic' ? 2999 : 9999;
                        await page.clock.runFor(deadline);
                        await expect(notice(page)).toHaveCount(1);
                        await expect(hiding(page)).toHaveCount(0);
                        await page.clock.runFor(1);
                        await expect(hiding(page)).toHaveCount(1);
                      } else if (scenario.name === 'Update') {
                        await expect(page.locator('.semi-toast-content-text')).toHaveText(
                          'Update Content By Id',
                        );
                        await page.clock.runFor(1000);
                        await expect(page.locator('.semi-toast-content-text')).toHaveText(
                          'Id By Content Update',
                        );
                        // The reused id restarts the default 3s timer at the update instant.
                        await page.clock.runFor(2999);
                        await expect(notice(page)).toHaveCount(1);
                        await expect(hiding(page)).toHaveCount(0);
                        await page.clock.runFor(1);
                        await expect(hiding(page)).toHaveCount(1);
                      } else {
                        // duration 0 never auto-closes.
                        await page.clock.runFor(60_000);
                        await expect(notice(page)).toHaveCount(1);
                        await expect(hiding(page)).toHaveCount(0);
                      }
                      await page.clock.resume();
                      if (scenario.name === 'ManualClose') {
                        await page.locator('.semi-toast-close-button button').click();
                        await expect(notice(page)).toHaveCount(0);
                      } else {
                        await expect(notice(page)).toHaveCount(0);
                      }
                      await info.attach(`timing-${scenario.name}-${side}`, {
                        body: JSON.stringify({ scenario: scenario.name, locale }),
                        contentType: 'application/json',
                      });
                      await page.close();
                    }
                } finally {
                  await timingContext.close();
                }
              });

            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'feedback/toast',
                index: index + 1,
                name: definition.name,
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
