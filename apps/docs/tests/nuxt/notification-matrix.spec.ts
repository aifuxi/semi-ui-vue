import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page, type TestInfo } from '@playwright/test';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

test.use({ actionTimeout: 10_000 });
const examples = [
  'Basic',
  'Position',
  'Icons',
  'Colored',
  'Links',
  'Delay',
  'ManualClose',
  'Update',
];
const placements = ['top', 'topLeft', 'topRight', 'bottom', 'bottomRight', 'bottomLeft'] as const;
const placementSelector = (placement: string) =>
  `.semi-notification-list[placement="${placement}"]`;

async function measure(root: Locator) {
  return root.evaluate((element) => {
    const origin = element.getBoundingClientRect();
    const properties = [
      'display',
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'color',
      'background-color',
      'background-image',
      'font-family',
      'font-size',
      'font-weight',
      'line-height',
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

async function compare(reference: Locator, vue: Locator, info: TestInfo, state: string) {
  await waitForVisualAssets([reference, vue]);
  const [expected, actual] = await Promise.all([measure(reference), measure(vue)]);
  await info.attach(`${state}-styles`, {
    body: JSON.stringify({ expected, actual }),
    contentType: 'application/json',
  });
  // The imperative wrapper is a body-level fixed layer; the two hosts paint different
  // chrome behind the notice's rounded corners. Normalize only that backdrop.
  const style =
    state === 'default'
      ? undefined
      : `
    body { background: var(--semi-color-bg-0) !important; }
    body > :not(.semi-notification-wrapper) { visibility: hidden !important; }
  `;
  const shots = await Promise.all([reference, vue].map((root) => root.screenshot({ style })));
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

/** Wait for the placement list and for its enter animation to actually finish. */
async function settleLists(lists: Locator[]) {
  for (const list of lists) await expect(list).toBeVisible();
  await Promise.all(
    lists.map((list) =>
      list.evaluate(async () => {
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        );
        await Promise.all(
          document
            .getAnimations()
            .filter(
              (animation) =>
                'animationName' in animation &&
                /semi-notification/.test(String(animation.animationName)),
            )
            .map((animation) => animation.finished.catch(() => undefined)),
        );
      }),
    ),
  );
}

for (const locale of ['zh-cn', 'en-us'])
  for (const theme of ['light', 'dark'])
    for (const [index, name] of examples.entries())
      for (const direction of ['ltr', 'rtl'])
        test(`Notification 文档 ${name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
          browser,
        }, info) => {
          test.setTimeout(150_000);
          const context = await visualContext(browser, info, locale, theme, direction);
          const sourceLocale = locale === 'zh-cn' ? 'zh-CN' : 'en-US';
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
                  notificationMotion: { phase: string; name: string }[];
                };
                win.notificationMotion = [];
                for (const phase of ['animationstart', 'animationend'])
                  document.addEventListener(
                    phase,
                    (event) => {
                      const name = (event as AnimationEvent).animationName;
                      if (/semi-notification/.test(name))
                        win.notificationMotion.push({ phase, name });
                    },
                    true,
                  );
              });
            }
            await vue.addInitScript((value) => {
              if (window === window.top) localStorage.setItem('semi-docs-theme', value);
            }, theme);
            await reference.goto(
              `http://127.0.0.1:4173/docs.html?component=notification&locale=${locale}&theme=${theme}&example=${index + 1}`,
            );
            const expected = reference.locator('#root');
            await expect(expected.getByRole('button').first()).toBeVisible();
            await vue.goto(`/${locale}/components/notification/`);
            const demo = vue.locator(`[data-demo-id="notification/${sourceLocale}/${name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual.getByRole('button').first()).toBeVisible();
            const roots = [expected, actual];
            const source = await readFile(
              new URL(`../../src/demos/notification/${sourceLocale}/${name}.vue`, import.meta.url),
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
            await compare(expected, actual, info, 'default');

            const lists = (placement: string) =>
              pages.map((page) => page.locator(placementSelector(placement)));
            const notices = (page: Page) => page.locator('.semi-notification-notice');
            const clickTrigger = async (nth: number) => {
              for (const root of roots) await root.getByRole('button').nth(nth).click();
            };
            // Notification clears its close timer on hover; pause the examples with a 3s
            // duration while styles, geometry and pixels are sampled.
            const pauseTimers = async () => {
              for (const page of pages) await notices(page).first().hover();
            };
            const closeAll = async () => {
              for (const page of pages) {
                const buttons = page.locator('.semi-notification-notice-icon-close');
                for (let i = (await buttons.count()) - 1; i >= 0; i -= 1)
                  await buttons.nth(i).click();
                await expect(notices(page)).toHaveCount(0);
              }
            };
            const absoluteBoxes = async (targets: Locator[]) => {
              const boxes = await Promise.all(targets.map((target) => target.boundingBox()));
              for (const axis of ['x', 'y', 'width', 'height'] as const)
                expect(
                  Math.abs(boxes[0]![axis] - boxes[1]![axis]),
                  `placement ${axis}`,
                ).toBeLessThanOrEqual(0.5);
              return boxes as { x: number; y: number; width: number; height: number }[];
            };

            if (name === 'Basic') {
              await test.step('默认右上通知、标题内容、退出与重开', async () => {
                await clickTrigger(0);
                const target = lists('topRight');
                await settleLists(target);
                await pauseTimers();
                await compare(target[0]!, target[1]!, info, 'opened');
                for (const page of pages) {
                  await expect(notices(page)).toHaveCount(1);
                  await expect(page.locator('.semi-notification-notice-title')).toHaveText(
                    'Hi, AIFUXI',
                  );
                  await expect(page.locator('.semi-notification-notice-content')).toHaveText(
                    'AIFUXI design notification',
                  );
                }
                await closeAll();
                await clickTrigger(0);
                await settleLists(target);
                await pauseTimers();
                await compare(target[0]!, target[1]!, info, 'reopened');
                for (const page of pages)
                  await page.locator('.semi-notification-notice-icon-close').press('Enter');
                for (const page of pages) await expect(notices(page)).toHaveCount(0);
              });
            }

            if (name === 'Position') {
              await test.step('六种位置的贴边方向与完整退出', async () => {
                for (const [i, placement] of placements.entries()) {
                  await clickTrigger(i);
                  const target = lists(placement);
                  await settleLists(target);
                  await pauseTimers();
                  await expect(target[0]!.locator('.semi-notification-notice')).toHaveCount(1);
                  await expect(target[1]!.locator('.semi-notification-notice')).toHaveCount(1);
                  await compare(target[0]!, target[1]!, info, `placement-${placement}`);
                  const [box] = await absoluteBoxes(target);
                  const viewport = reference.viewportSize()!;
                  if (placement.startsWith('top'))
                    expect(Math.abs(box!.y), placement).toBeLessThanOrEqual(0.5);
                  if (placement.startsWith('bottom'))
                    expect(
                      Math.abs(box!.y + box!.height - viewport.height),
                      placement,
                    ).toBeLessThanOrEqual(0.5);
                  if (placement === 'top' || placement === 'bottom')
                    expect(
                      Math.abs(box!.x + box!.width / 2 - viewport.width / 2),
                      placement,
                    ).toBeLessThanOrEqual(0.5);
                  if (placement.endsWith('Left'))
                    expect(Math.abs(box!.x), placement).toBeLessThanOrEqual(0.5);
                  if (placement.endsWith('Right'))
                    expect(
                      Math.abs(box!.x + box!.width - viewport.width),
                      placement,
                    ).toBeLessThanOrEqual(0.5);
                  await closeAll();
                }
              });
            }

            if (name === 'Icons') {
              await test.step('四种默认状态图标与三个自定义图标/颜色', async () => {
                const types = ['success', 'info', 'warning', 'error'];
                for (const [i, type] of types.entries()) {
                  await clickTrigger(i);
                  const target = lists('topRight');
                  await settleLists(target);
                  await pauseTimers();
                  await compare(target[0]!, target[1]!, info, `icon-${type}`);
                  for (const page of pages) {
                    const notice = notices(page);
                    await expect(notice).toHaveClass(
                      new RegExp(`semi-notification-notice-${type}`),
                    );
                    await expect(
                      notice.locator('.semi-notification-notice-icon .semi-icon-large'),
                    ).toHaveCount(1);
                  }
                  await closeAll();
                }
                for (const [i, color] of ['red', 'inherit', 'pink'].entries()) {
                  await clickTrigger(types.length + i);
                  const target = lists('topRight');
                  await settleLists(target);
                  await pauseTimers();
                  await compare(target[0]!, target[1]!, info, `custom-${color}`);
                  const iconColor = async (page: Page) =>
                    notices(page)
                      .locator('.semi-notification-notice-icon .semi-icon')
                      .evaluate((node) => getComputedStyle(node).color);
                  for (const page of pages)
                    await expect(
                      notices(page).locator('.semi-notification-notice-icon .semi-icon'),
                    ).toHaveClass(/semi-icon-large/);
                  const [referenceColor, vueColor] = await Promise.all(
                    pages.map((page) => iconColor(page)),
                  );
                  expect(vueColor, color).toBe(referenceColor);
                  if (color === 'red') expect(vueColor).toBe('rgb(255, 0, 0)');
                  if (color === 'pink') expect(vueColor).toBe('rgb(255, 192, 203)');
                  await closeAll();
                }
              });
            }

            if (name === 'Colored') {
              await test.step('light 主题四种状态的浅色填充与描边', async () => {
                for (const [i, type] of ['info', 'success', 'warning', 'error'].entries()) {
                  await clickTrigger(i);
                  const target = lists('topRight');
                  await settleLists(target);
                  await pauseTimers();
                  await compare(target[0]!, target[1]!, info, `colored-${type}`);
                  for (const page of pages) {
                    const notice = notices(page);
                    await expect(notice).toHaveClass(/semi-notification-notice-light/);
                    await expect(notice).toHaveClass(
                      new RegExp(`semi-notification-notice-${type}`),
                    );
                  }
                  await closeAll();
                }
              });
            }

            if (name === 'Links') {
              await test.step('Typography 链接节点、间距与退出', async () => {
                await clickTrigger(0);
                const target = lists('topRight');
                await settleLists(target);
                await pauseTimers();
                await compare(target[0]!, target[1]!, info, 'opened');
                for (const page of pages) {
                  const content = page.locator('.semi-notification-notice-content');
                  // The pinned example renders a fragment: exactly two direct blocks.
                  await expect(content.locator(':scope > div')).toHaveCount(2);
                  const links = content.locator('.semi-typography-link');
                  await expect(links).toHaveCount(2);
                  await expect(links.nth(0)).toHaveText(
                    locale === 'zh-cn' ? '查看详情' : 'More Info',
                  );
                  await expect(links.nth(1)).toHaveText(
                    locale === 'zh-cn' ? '一会再看' : 'Show Later',
                  );
                  expect(
                    await links.nth(1).evaluate((node) => getComputedStyle(node).marginLeft),
                  ).toBe('20px');
                }
                await closeAll();
              });
            }

            if (name === 'Delay') {
              await test.step('无标题正文与 10 秒延时保持', async () => {
                await clickTrigger(0);
                const target = lists('topRight');
                await settleLists(target);
                await pauseTimers();
                await compare(target[0]!, target[1]!, info, 'opened');
                for (const page of pages) {
                  await expect(page.locator('.semi-notification-notice-title')).toHaveCount(0);
                  await expect(page.locator('.semi-notification-notice-content')).toHaveText(
                    'AIFUXI design notification',
                  );
                }
                await closeAll();
              });
            }

            if (name === 'ManualClose') {
              await test.step('duration 0 不自动关闭、按创建顺序关闭与空队列安全', async () => {
                await clickTrigger(0);
                await clickTrigger(0);
                const target = lists('topRight');
                await settleLists(target);
                await pauseTimers();
                for (const page of pages) await expect(notices(page)).toHaveCount(2);
                await compare(target[0]!, target[1]!, info, 'two-notices');
                await clickTrigger(1);
                for (const page of pages) await expect(notices(page)).toHaveCount(1);
                await compare(target[0]!, target[1]!, info, 'one-notice');
                await clickTrigger(1);
                for (const page of pages) await expect(notices(page)).toHaveCount(0);
                // Closing an empty queue is a safe no-op on both implementations.
                await clickTrigger(1);
                for (const page of pages) await expect(notices(page)).toHaveCount(0);
              });
            }

            if (name === 'Update') {
              await test.step('同 id 更新内容且不新增 DOM', async () => {
                await clickTrigger(0);
                const target = lists('topRight');
                await settleLists(target);
                await pauseTimers();
                // The reused id updates in place; the initial state is sampled on the
                // isolated clock below so this comparison is not racing the 1s update.
                for (const page of pages)
                  await expect(page.locator('.semi-notification-notice-content')).toHaveText(
                    'updated',
                    { timeout: 5_000 },
                  );
                for (const page of pages) await expect(notices(page)).toHaveCount(1);
                await pauseTimers();
                await compare(target[0]!, target[1]!, info, 'updated');
                await closeAll();
              });
            }

            await test.step('进入与退出动效真实发生', async () => {
              for (const [i, page] of pages.entries()) {
                const motion = await page.evaluate(
                  () =>
                    (
                      window as unknown as {
                        notificationMotion: { phase: string; name: string }[];
                      }
                    ).notificationMotion,
                );
                await info.attach(`motion-${i}`, {
                  body: JSON.stringify(motion),
                  contentType: 'application/json',
                });
                expect(
                  motion.some(
                    (item) => item.phase === 'animationstart' && /slideShow_/.test(item.name),
                  ),
                ).toBe(true);
                expect(
                  motion.some(
                    (item) => item.phase === 'animationend' && /slideHide_/.test(item.name),
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
                const editorNotice = demo
                  .frameLocator('iframe')
                  .locator('.semi-notification-notice');
                await expect(editorNotice).toBeVisible();
                // The pinned Update example re-opens the same id one second later; closing
                // before that would create a fresh notice, so wait for the reused-id update.
                if (name === 'Update')
                  await expect(
                    demo.frameLocator('iframe').locator('.semi-notification-notice-content'),
                  ).toHaveText('updated', { timeout: 5_000 });
                await editorNotice.locator('.semi-notification-notice-icon-close').click();
                await expect(editorNotice).toHaveCount(0);
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

            if (name === 'Basic' && theme === 'light' && direction === 'ltr')
              await test.step('独立时钟下的 3s / 10s / 更新重启 / 手动关闭计时', async () => {
                // Clock control is isolated from every page that has loaded the real editor.
                const timingContext = await visualContext(browser, info, locale, theme, direction);
                const notice = (page: Page) => page.locator('.semi-notification-notice');
                const hiding = (page: Page) =>
                  page.locator('.semi-notification-notice-animation-hide_topRight');
                try {
                  const load = async (page: Page, example: number, vueName?: string) => {
                    page.on('pageerror', (error) => errors.push(error.message));
                    if (vueName) {
                      await page.goto(`/${locale}/components/notification/`);
                      const root = page.locator(
                        `[data-demo-id="notification/${sourceLocale}/${vueName}"] [data-demo-preview]`,
                      );
                      await expect(root.getByRole('button').first()).toBeVisible();
                      await waitForVisualAssets([root]);
                      return root;
                    }
                    await page.goto(
                      `http://127.0.0.1:4173/docs.html?component=notification&locale=${locale}&theme=${theme}&example=${example}`,
                    );
                    const root = page.locator('#root');
                    await expect(root.getByRole('button').first()).toBeVisible();
                    await waitForVisualAssets([root]);
                    return root;
                  };
                  for (const side of ['reference', 'vue'] as const)
                    for (const scenarioName of [
                      'Basic',
                      'Delay',
                      'Update',
                      'ManualClose',
                    ] as const) {
                      const page = await timingContext.newPage();
                      const root = await load(
                        page,
                        examples.indexOf(scenarioName) + 1,
                        side === 'vue' ? scenarioName : undefined,
                      );
                      await page.clock.install();
                      await page.clock.pauseAt((await page.evaluate(() => Date.now())) + 1000);
                      await root.getByRole('button').first().click();
                      await expect(notice(page)).toHaveCount(1);
                      if (scenarioName === 'Basic' || scenarioName === 'Delay') {
                        // Basic closes at 3s, Delay at 10s; neither may close one millisecond early.
                        const deadline = scenarioName === 'Basic' ? 2999 : 9999;
                        await page.clock.runFor(deadline);
                        await expect(notice(page)).toHaveCount(1);
                        await expect(hiding(page)).toHaveCount(0);
                        await page.clock.runFor(1);
                        await expect(hiding(page)).toHaveCount(1);
                      } else if (scenarioName === 'Update') {
                        // The first second still shows the original content.
                        await expect(page.locator('.semi-notification-notice-content')).toHaveText(
                          'AIFUXI design notification',
                        );
                        await page.clock.runFor(1000);
                        await expect(page.locator('.semi-notification-notice-content')).toHaveText(
                          'updated',
                        );
                        // The reused id restarts the timer; the first 3s deadline must not close it.
                        await page.clock.runFor(2001);
                        await expect(notice(page)).toHaveCount(1);
                        await expect(hiding(page)).toHaveCount(0);
                        // The restarted deadline is the update instant plus the new 10s.
                        await page.clock.runFor(7999);
                        await expect(hiding(page)).toHaveCount(1);
                      } else {
                        // duration 0 never auto-closes.
                        await page.clock.runFor(60_000);
                        await expect(notice(page)).toHaveCount(1);
                        await expect(hiding(page)).toHaveCount(0);
                        await page.clock.resume();
                        await page.locator('.semi-notification-notice-icon-close').click();
                        await expect(notice(page)).toHaveCount(0);
                      }
                      await page.clock.resume();
                      if (scenarioName !== 'ManualClose') await expect(notice(page)).toHaveCount(0);
                      await info.attach(`timing-${scenarioName}-${side}`, {
                        body: JSON.stringify({ scenario: scenarioName, locale }),
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
                upstream: 'feedback/notification',
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
