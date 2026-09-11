import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type TestInfo } from '@playwright/test';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

test.use({ actionTimeout: 10_000 });
const examples = ['Basic', 'Text', 'Radio', 'Checkbox', 'Custom', 'Modal', 'Completion'];
async function measure(root: Locator) {
  return root.evaluate((element) => {
    const origin = element.getBoundingClientRect();
    const properties = [
      'display',
      'color',
      'background-color',
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
      '-webkit-line-clamp',
      'text-decoration-line',
      'cursor',
      'user-select',
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
      'stroke',
      'opacity',
      'filter',
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
          text:
            node instanceof HTMLTextAreaElement
              ? node.value
              : [...node.childNodes]
                  .filter((child) => child.nodeType === Node.TEXT_NODE)
                  .map((child) => child.textContent)
                  .join('')
                  .replace(/\s+/g, ' ')
                  .trim(),
          role: node.getAttribute('role'),
          tabindex: node.getAttribute('tabindex'),
          href: node.getAttribute('href'),
          target: node.getAttribute('target'),
          label: node.getAttribute('aria-label'),
          disabled:
            node instanceof HTMLButtonElement || node instanceof HTMLInputElement
              ? node.disabled
              : undefined,
          checked: node instanceof HTMLInputElement ? node.checked : undefined,
          value:
            node instanceof HTMLTextAreaElement || node instanceof HTMLInputElement
              ? node.value
              : undefined,
          placeholder: node.getAttribute('placeholder'),
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
  // Rounded portal edges expose the host page, whose documentation layout differs.
  // Normalize only the host backdrop during capture; retain the real portal and mask.
  const style =
    state === 'default'
      ? undefined
      : `
    body { background: var(--semi-color-bg-0) !important; }
    body > :not(.semi-feedback):not(:has(.semi-feedback)) { visibility: hidden !important; }
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
    // Native radio/checkbox inputs are transparent; their host-page outline is not painted.
    // Preserve raw computed styles in the attachment and compare the visible Semi focus ring.
    if (actualNode.styles.opacity === '0' && expectedNode.styles.opacity === '0') {
      for (const property of [
        'outline-color',
        'outline-style',
        'outline-width',
        'outline-offset',
      ]) {
        delete actualNode.styles[property];
        delete expectedNode.styles[property];
      }
    }
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

async function settle(root: Locator) {
  await expect(root).toBeVisible();
  await root.evaluate(async () => {
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
    await Promise.all(
      document
        .getAnimations()
        .filter(
          (animation) =>
            'animationName' in animation &&
            /semi-(modal|sidesheet)/.test(String(animation.animationName)),
        )
        .map((animation) => animation.finished.catch(() => undefined)),
    );
  });
}

for (const locale of ['zh-cn', 'en-us'])
  for (const theme of ['light', 'dark'])
    for (const [index, name] of examples.entries())
      for (const direction of ['ltr', 'rtl'])
        test(`Feedback 文档 ${name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
          browser,
        }, info) => {
          test.setTimeout(120_000);
          const context = await visualContext(browser, info, locale, theme, direction);
          const sourceLocale = locale === 'zh-cn' ? 'zh-CN' : 'en-US';
          try {
            const reference = await context.newPage(),
              vue = await context.newPage();
            const pages = [reference, vue];
            const errors: string[] = [];
            const editorNotices: string[] = [];
            let editorActive = false;
            const values: unknown[][] = [[], []];
            for (const [i, page] of pages.entries()) {
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
              await page.exposeFunction('recordFeedbackValue', (value: unknown) =>
                values[i]!.push(value),
              );
              await page.addInitScript(() => {
                const win = window as unknown as {
                  feedbackMotion: { phase: string; name: string }[];
                  recordFeedbackValue: (value: unknown) => void;
                };
                win.feedbackMotion = [];
                for (const phase of ['animationstart', 'animationend'])
                  document.addEventListener(
                    phase,
                    (event) => {
                      const name = (event as AnimationEvent).animationName;
                      if (/semi-(modal|sidesheet)/.test(name))
                        win.feedbackMotion.push({ phase, name });
                    },
                    true,
                  );
                const log = console.log;
                console.log = (...args: unknown[]) => {
                  if (args[0] === 'emoji value') win.recordFeedbackValue(args[1]);
                  log(...args);
                };
              });
            }
            await vue.addInitScript((value) => {
              if (window === window.top) localStorage.setItem('semi-docs-theme', value);
            }, theme);
            await reference.goto(
              `http://127.0.0.1:4173/docs.html?component=feedback&locale=${locale}&theme=${theme}&example=${index + 1}`,
            );
            const expected = reference.locator('#root');
            await expect(expected.getByRole('button').first()).toBeVisible();
            await vue.goto(`/${locale}/components/feedback/`);
            const demo = vue.locator(`[data-demo-id="feedback/${sourceLocale}/${name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual.getByRole('button').first()).toBeVisible();
            const roots = [expected, actual];
            const source = await readFile(
              new URL(`../../src/demos/feedback/${sourceLocale}/${name}.vue`, import.meta.url),
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

            const modes =
              name === 'Completion' ? ['popup', 'modal'] : [name === 'Modal' ? 'modal' : 'popup'];
            for (const [modeIndex, mode] of modes.entries()) {
              const selector =
                mode === 'modal'
                  ? '.semi-feedback .semi-modal-content'
                  : '.semi-feedback .semi-sidesheet-inner';
              const panels = pages.map((page) => page.locator(selector));
              const ok = (panel: Locator) =>
                mode === 'modal'
                  ? panel.getByRole('button', { name: 'confirm', exact: true })
                  : panel.getByRole('button', {
                      name: locale === 'zh-cn' ? '提交' : 'Submit',
                      exact: true,
                    });
              const cancel = (panel: Locator) =>
                mode === 'modal'
                  ? panel.getByRole('button', { name: 'cancel', exact: true })
                  : panel.getByRole('button', {
                      name: locale === 'zh-cn' ? '取消' : 'Cancel',
                      exact: true,
                    });
              const open = async () => {
                for (const root of roots) await root.getByRole('button').nth(modeIndex).click();
                for (const panel of panels) await settle(panel);
              };
              const closed = async () => {
                for (const page of pages)
                  await expect(page.locator('.semi-feedback')).toHaveCount(0);
              };
              const comparePanel = async (state: string) => {
                for (const page of pages) await page.mouse.move(700, 20);
                await Promise.all(panels.map(settle));
                const boxes = await Promise.all(panels.map((panel) => panel.boundingBox()));
                for (const axis of ['x', 'y', 'width', 'height'] as const)
                  expect(
                    Math.abs(boxes[0]![axis] - boxes[1]![axis]),
                    `${mode}-${state} ${axis}`,
                  ).toBeLessThanOrEqual(0.5);
                await compare(panels[0]!, panels[1]!, info, `${mode}-${state}`);
              };
              await test.step(`${mode} 默认弹层、真实进入动效与提交门禁`, async () => {
                await open();
                for (const panel of panels) await expect(ok(panel)).toBeDisabled();
                await comparePanel('opened');
                if (mode === 'modal') {
                  const masks = await Promise.all(
                    pages.map((page) =>
                      page.locator('.semi-modal-mask').evaluate((node) => {
                        const style = getComputedStyle(node),
                          rect = node.getBoundingClientRect();
                        return {
                          background: style.backgroundColor,
                          opacity: style.opacity,
                          position: style.position,
                          width: rect.width,
                          height: rect.height,
                          x: rect.x,
                          y: rect.y,
                        };
                      }),
                    ),
                  );
                  expect(masks[1]).toEqual(masks[0]);
                  await info.attach(`${mode}-mask`, {
                    body: JSON.stringify(masks),
                    contentType: 'application/json',
                  });
                } else
                  for (const page of pages)
                    await expect(page.locator('.semi-sidesheet-mask')).toHaveCount(0);
              });
              if (name === 'Basic' || name === 'Modal')
                await test.step('表情、差评原因、状态切换与回调值', async () => {
                  for (const panel of panels) {
                    await expect(panel.locator('.semi-feedback-emoji-item')).toHaveCount(3);
                    await panel.locator('.semi-feedback-emoji-item').first().click();
                    await expect(ok(panel)).toBeEnabled();
                    await panel.locator('textarea').fill('Improve navigation');
                  }
                  await comparePanel('bad-reason');
                  for (const panel of panels) {
                    await panel.locator('.semi-feedback-emoji-item').nth(1).click();
                    await expect(panel.locator('textarea')).toHaveCount(0);
                    await panel.locator('.semi-feedback-emoji-item').nth(2).click();
                  }
                  await comparePanel('good');
                  await expect.poll(() => values[0]!.length).toBe(4);
                  await expect.poll(() => values[1]!.length).toBe(4);
                  expect(values[1]).toEqual(values[0]);
                  expect(values[0]).toEqual([
                    { emoji: '😞' },
                    { emoji: '😞', text: 'Improve navigation' },
                    { emoji: '😐' },
                    { emoji: '😃' },
                  ]);
                });
              if (['Text', 'Custom', 'Completion'].includes(name))
                await test.step('文本输入、清空禁用与自定义受控值', async () => {
                  for (const panel of panels) {
                    await panel.locator('textarea').fill('Useful feedback');
                    await expect(panel.locator('textarea')).toHaveValue('Useful feedback');
                    await expect(ok(panel)).toBeEnabled();
                  }
                  await comparePanel('filled');
                  for (const panel of panels) {
                    await panel.locator('textarea').fill('');
                    await expect(ok(panel)).toBeDisabled();
                    await panel.locator('textarea').fill('Final feedback');
                  }
                  if (name === 'Text')
                    for (const panel of panels)
                      await expect(panel.locator('.semi-input-textarea-counter')).toContainText(
                        '200',
                      );
                });
              if (name === 'Radio')
                await test.step('单选互斥与键盘切换', async () => {
                  for (const panel of panels) {
                    const radios = panel.getByRole('radio');
                    await expect(radios).toHaveCount(3);
                    await panel.locator('.semi-radio').nth(0).click();
                    await expect(radios.nth(0)).toBeChecked();
                    await radios.nth(0).press('ArrowDown');
                    await expect(radios.nth(1)).toBeChecked();
                    await expect(radios.nth(0)).not.toBeChecked();
                    await expect(ok(panel)).toBeEnabled();
                  }
                  await comparePanel('radio-selected');
                });
              if (name === 'Checkbox')
                await test.step('多选、清空禁用和键盘选择', async () => {
                  for (const panel of panels) {
                    const checks = panel.getByRole('checkbox');
                    await expect(checks).toHaveCount(3);
                    await panel.locator('.semi-checkbox').nth(0).click();
                    await panel.locator('.semi-checkbox').nth(1).click();
                    await expect(checks.nth(0)).toBeChecked();
                    await expect(checks.nth(1)).toBeChecked();
                  }
                  await comparePanel('checkbox-multiple');
                  for (const panel of panels) {
                    await panel.locator('.semi-checkbox').nth(0).click();
                    await panel.locator('.semi-checkbox').nth(1).click();
                    await expect(ok(panel)).toBeDisabled();
                    await panel.getByRole('checkbox').nth(2).press('Space');
                    await expect(panel.getByRole('checkbox').nth(2)).toBeChecked();
                  }
                });
              await test.step(`${mode} 提交、完整退出动效与重开`, async () => {
                if (name === 'Completion') {
                  await Promise.all(panels.map((panel) => ok(panel).click()));
                  for (const panel of panels) {
                    await expect(panel.locator('.semi-empty-description')).toHaveText(
                      locale === 'zh-cn' ? '感谢您的反馈' : 'Thanks for your feedback',
                    );
                    await expect(ok(panel)).toHaveCount(0);
                    await expect(cancel(panel)).toHaveCount(0);
                  }
                  await comparePanel('thanks');
                  await closed();
                } else {
                  for (const panel of panels) await ok(panel).press('Enter');
                  await closed();
                }
                await open();
                for (const panel of panels) {
                  await expect(ok(panel)).toBeVisible();
                  if (name === 'Completion')
                    await expect(panel.locator('.semi-empty')).toHaveCount(0);
                  if (name !== 'Custom' && name !== 'Completion')
                    await expect(ok(panel)).toBeDisabled();
                }
                await comparePanel('reopened');
                for (const panel of panels) await cancel(panel).press('Enter');
                await closed();
                await open();
                for (const panel of panels)
                  await panel.getByRole('button', { name: 'close', exact: true }).click();
                await closed();
              });
            }
            for (const [i, page] of pages.entries()) {
              const motion = await page.evaluate(
                () =>
                  (window as unknown as { feedbackMotion: { phase: string; name: string }[] })
                    .feedbackMotion,
              );
              await info.attach(`motion-${i}`, {
                body: JSON.stringify(motion),
                contentType: 'application/json',
              });
              expect(motion.some((item) => item.phase === 'animationstart')).toBe(true);
              expect(
                motion.some((item) => item.phase === 'animationend' && /[Hh]ide/.test(item.name)),
              ).toBe(true);
            }
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
                const editorPanel = demo
                  .frameLocator('iframe')
                  .locator(name === 'Modal' ? '.semi-modal-content' : '.semi-sidesheet-inner');
                await expect(editorPanel).toBeVisible();
                await editorPanel.getByRole('button', { name: 'close', exact: true }).click();
                await expect(editorPanel).toHaveCount(0);
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
            if (name === 'Completion' && theme === 'light' && direction === 'ltr')
              await test.step('独立页面的 1499/1500ms 关闭边界与 200ms 提示复原', async () => {
                // Clock control is isolated from every page that has loaded the real editor.
                const timingContext = await visualContext(browser, info, locale, theme, direction);
                try {
                  for (const [side, url] of [
                    `http://127.0.0.1:4173/docs.html?component=feedback&locale=${locale}&theme=${theme}&example=7`,
                    `http://127.0.0.1:4321/${locale}/components/feedback/`,
                  ].entries()) {
                    const page = await timingContext.newPage();
                    page.on('pageerror', (error) => errors.push(error.message));
                    page.on('console', (message) => {
                      if (message.type() === 'error') errors.push(message.text());
                    });
                    await page.goto(url);
                    const root = page.locator(
                      side === 0
                        ? '#root'
                        : `[data-demo-id="feedback/${sourceLocale}/Completion"] [data-demo-preview]`,
                    );
                    await expect(root.getByRole('button').first()).toBeVisible();
                    await waitForVisualAssets([root]);
                    await page.clock.install();
                    for (const [i, mode] of ['popup', 'modal'].entries()) {
                      await root.getByRole('button').nth(i).click();
                      const panel = page.locator(
                        mode === 'popup' ? '.semi-sidesheet-inner' : '.semi-modal-content',
                      );
                      await settle(panel);
                      await panel.locator('textarea').fill('Timing feedback');
                      await page.clock.pauseAt((await page.evaluate(() => Date.now())) + 1000);
                      await panel
                        .getByRole('button', {
                          name:
                            mode === 'modal' ? 'confirm' : locale === 'zh-cn' ? '提交' : 'Submit',
                          exact: true,
                        })
                        .click();
                      await expect(panel.locator('.semi-empty')).toBeVisible();
                      await page.clock.runFor(1499);
                      await expect(panel.locator('.semi-empty')).toBeVisible();
                      const leaving = page.locator(
                        mode === 'popup'
                          ? '.semi-sidesheet-animation-content_hide_bottom'
                          : '.semi-modal-content-animate-hide',
                      );
                      await expect(leaving).toHaveCount(0);
                      await page.clock.runFor(1);
                      await expect(leaving).toHaveCount(1);
                      await page.clock.runFor(200);
                      await page.clock.resume();
                      await expect(page.locator('.semi-feedback')).toHaveCount(0);
                      await root.getByRole('button').nth(i).click();
                      await settle(panel);
                      await expect(panel.locator('textarea')).toBeVisible();
                      await expect(panel.locator('.semi-empty')).toHaveCount(0);
                      await panel.getByRole('button', { name: 'close', exact: true }).click();
                      await expect(page.locator('.semi-feedback')).toHaveCount(0);
                      await info.attach(`timing-${side}-${mode}`, {
                        body: JSON.stringify({
                          visibleAt: 1499,
                          closingAt: 1500,
                          resetDelay: 200,
                          reopened: true,
                        }),
                        contentType: 'application/json',
                      });
                    }
                    await page.close();
                  }
                } finally {
                  await timingContext.close();
                }
              });
            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'feedback/feedback',
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
