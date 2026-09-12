import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { freezeAnimations } from './demo-parity';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

test.use({ actionTimeout: 10_000 });

const examples = [
  'Basic',
  'Fallback',
  'Progressive',
  'PreviewSource',
  'Group',
  'Standalone',
  'Container',
  'CustomMenu',
  'ExtendMenu',
  'Header',
].map((name, index) => ({ name, block: index + 1 }));
const imageCounts = [1, 2, 1, 1, 4, 0, 3, 3, 3, 2];
// The viewer's translucent background must composite over identical outside content.
// Restore only the root: descendants keep their own visibility/display state.
const viewerBackdrop = `
  body { background: var(--semi-color-bg-0) !important; }
  body > * { visibility: hidden !important; }
  .semi-image-preview { visibility: visible !important; }
`;
async function imageAssets(roots: Locator[]) {
  for (const root of roots) {
    if (await root.locator('img[src="data:image/png;base64,broken"]').count()) {
      await root.page().evaluate(async () => {
        for (const font of ['12px Inter', '600 14px Inter'])
          if (!(await document.fonts.load(font)).length) throw new Error('Missing Inter');
        await document.fonts.ready;
      });
      for (const image of await root.locator('img').all()) {
        if ((await image.getAttribute('src')) === 'data:image/png;base64,broken')
          await expect
            .poll(() =>
              image.evaluate(
                (node) =>
                  (node as HTMLImageElement).complete && !(node as HTMLImageElement).naturalWidth,
              ),
            )
            .toBe(true);
        else await image.evaluate((node) => (node as HTMLImageElement).decode());
      }
    } else {
      await waitForVisualAssets([root]);
      for (const image of await root.locator('img[src*="/demos/image-"]').all())
        expect(
          await image.evaluate((node) => ({
            width: (node as HTMLImageElement).naturalWidth,
            height: (node as HTMLImageElement).naturalHeight,
          })),
        ).toEqual({ width: 1440, height: 800 });
    }
  }
}
async function measure(root: Locator) {
  return root.evaluate((element) => {
    const origin = element.getBoundingClientRect();
    const properties = [
      'display',
      'position',
      'visibility',
      'color',
      'background-color',
      'background-image',
      'font-family',
      'font-size',
      'font-weight',
      'font-style',
      'line-height',
      'letter-spacing',
      'text-align',
      'text-decoration-line',
      'text-overflow',
      'text-transform',
      'white-space',
      'word-break',
      'direction',
      'opacity',
      'overflow-x',
      'overflow-y',
      'align-items',
      'justify-content',
      'flex',
      'flex-direction',
      'flex-wrap',
      'flex-basis',
      'flex-grow',
      'flex-shrink',
      'column-gap',
      'row-gap',
      'border-radius',
      'box-shadow',
      'transform',
      'vertical-align',
      'box-sizing',
      'cursor',
      'pointer-events',
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
      'top',
      'right',
      'bottom',
      'left',
      'z-index',
      'width',
      'min-width',
      'max-width',
      'height',
      'min-height',
      'max-height',
      'fill',
      'stroke',
      'animation-duration',
      'animation-timing-function',
      'transition-duration',
      'transition-timing-function',
    ];
    // Preserve generated id/ARIA relationships; normalize only the independent reload timestamp.
    const ids = new Map(
      [...element.querySelectorAll('[id]')].map((node, index) => [node.id, `id-${index}`]),
    );
    // Slider keeps a generated tooltip relation while showTooltip=false leaves
    // its panel unmounted. Canonicalize the declaration and every reference together.
    const popupIds = new Map<string, string>();
    for (const node of element.querySelectorAll('[data-popupid]')) {
      const id = node.getAttribute('data-popupid')!;
      if (!id) throw new Error('Empty generated popup id');
      if (!popupIds.has(id)) popupIds.set(id, `popup-${popupIds.size}`);
      const describedBy = node.getAttribute('aria-describedby');
      if (describedBy !== null && !describedBy.split(/\s+/).includes(id))
        throw new Error('Popup declaration does not match its aria-describedby');
    }
    const canonicalId = (value: string) => popupIds.get(value) ?? ids.get(value) ?? value;
    const attributeValue = (key: string, value: string) => {
      if (key === 'src' || key === 'data-src')
        return value
          .replace(/^http:\/\/127\.0\.0\.1:4321/, '')
          .replace(/([?]reload=)\d+$/, '$1timestamp');
      if (key === 'id' || key === 'data-popupid') return canonicalId(value);
      if (
        [
          'for',
          'aria-labelledby',
          'aria-describedby',
          'aria-controls',
          'aria-owns',
          'aria-activedescendant',
        ].includes(key)
      )
        return value
          .split(/\s+/)
          .map((token) => canonicalId(token))
          .join(' ');
      return value;
    };
    const nodes = [
      ...element.querySelectorAll('[class*="semi-"], svg, svg path, span, img, input'),
    ];
    // The viewer root carries the positioning, dimensions, z-index and backdrop itself.
    if (element.classList.contains('semi-image-preview')) nodes.unshift(element);
    return nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return {
        tag: node.tagName,
        classes: [...node.classList].sort(),
        attributes: Object.fromEntries(
          [...node.attributes]
            .filter(
              (attribute) =>
                !['style', 'class', 'checked'].includes(attribute.name) &&
                !attribute.name.startsWith('data-v-') &&
                !(
                  ['aria-disabled', 'aria-invalid', 'aria-required'].includes(attribute.name) &&
                  attribute.value === 'false'
                ),
            )
            .sort((left, right) => left.name.localeCompare(right.name))
            .map((attribute) => [attribute.name, attributeValue(attribute.name, attribute.value)]),
        ),
        // Frameworks split interpolation text differently (React: 1, /, 1; Vue: 1/1).
        // Collapse CSS whitespace once over the complete text so real spaces between
        // neighbouring inline elements remain, and preformatted text stays exact.
        text: ['normal', 'nowrap'].includes(style.whiteSpace)
          ? (node.textContent ?? '').replace(/[\t\n\r\f ]+/g, ' ').trim()
          : (node.textContent ?? ''),
        checked: (node as HTMLInputElement).checked ?? null,
        value: (node as HTMLInputElement).value ?? null,
        styles: Object.fromEntries(properties.map((key) => [key, style.getPropertyValue(key)])),
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

/** Give both roots the same box, page scroll and writing direction before comparing. */
async function align(
  referencePage: Page,
  expected: Locator,
  vuePage: Page,
  actual: Locator,
  direction: string,
) {
  for (const page of [referencePage, vuePage])
    await page.evaluate((dir) => {
      document.body.dir = dir;
      document.body.classList.toggle('semi-rtl', dir === 'rtl');
    }, direction);
  await actual.scrollIntoViewIfNeeded();
  await imageAssets([expected, actual]);
  for (const root of [expected, actual])
    await root.evaluate((element, dir) => {
      (element as HTMLElement).dir = dir;
      element.classList.toggle('semi-rtl', dir === 'rtl');
    }, direction);
  await actual.scrollIntoViewIfNeeded();
  const box = await actual.boundingBox();
  const scroll = await vuePage.evaluate(() => ({
    y: scrollY,
    height: document.documentElement.scrollHeight,
  }));
  await expected.evaluate(
    (element, { box, scroll }) => {
      // Calculate document coordinates from the original numbers once. Reading
      // style.top back serializes subpixels (e.g. .90625 -> .906), shifting raster bounds.
      Object.assign((element as HTMLElement).style, {
        boxSizing: 'border-box',
        padding: '24px',
        width: `${box!.width}px`,
        // Absolute positioning avoids RTL normal-flow right alignment being added to left.
        position: 'absolute',
        left: `${box!.x}px`,
        top: `${box!.y + scroll.y}px`,
      });
      document.body.style.minHeight = `${scroll.height}px`;
      window.scrollTo(0, scroll.y);
    },
    { box, scroll },
  );
  await Promise.all([referencePage, vuePage].map((page) => page.mouse.move(1400, 880)));
}

for (const locale of ['zh-cn', 'en-us'] as const)
  for (const theme of ['light', 'dark'] as const)
    for (const example of examples)
      for (const direction of ['ltr', 'rtl'] as const)
        test(`Image 文档 ${example.name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
          browser,
        }, info) => {
          test.setTimeout(120_000);
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
              `http://127.0.0.1:4173/docs.html?component=image&locale=${locale}&theme=${theme}&example=${example.block}`,
            );
            const expected = reference.locator('#root');
            await expect(
              expected
                .locator(example.name === 'Standalone' ? '.semi-button' : '.semi-image')
                .first(),
            ).toBeVisible();
            await vue.goto(`/${locale}/components/image/`);
            const demo = vue.locator(`[data-demo-id="image/${locale}/${example.name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(
              actual
                .locator(example.name === 'Standalone' ? '.semi-button' : '.semi-image')
                .first(),
            ).toBeVisible();
            for (const root of [expected, actual])
              await expect(root.locator('.semi-image')).toHaveCount(
                imageCounts[example.block - 1]!,
              );
            const source = await readFile(
              new URL(`../../src/demos/image/${locale}/${example.name}.vue`, import.meta.url),
              'utf8',
            );
            expect(await demo.locator('[data-demo-source] code').textContent()).toBe(source);
            await align(reference, expected, vue, actual, direction);
            const compare = async (state: string, roots = [expected, actual]) => {
              await imageAssets(roots);
              await Promise.all([reference, vue].map((page) => page.mouse.move(1400, 880)));
              await freezeAnimations([reference, vue], 300);
              const [referenceNodes, vueNodes] = await Promise.all(
                roots.map((root) => measure(root)),
              );
              await info.attach(`${state}-styles`, {
                body: JSON.stringify({ expected: referenceNodes, actual: vueNodes }),
                contentType: 'application/json',
              });
              expect(vueNodes, `${state} node count`).toHaveLength(referenceNodes!.length);
              for (const [i, node] of vueNodes!.entries()) {
                const { rect: a, ...actualNode } = node;
                const { rect: b, ...expectedNode } = referenceNodes![i]!;
                expect(actualNode, `${state} node ${i}`).toEqual(expectedNode);
                for (const axis of ['x', 'y', 'width', 'height'] as const)
                  expect(Math.abs(a[axis] - b[axis]), `${state} ${i} ${axis}`).toBeLessThanOrEqual(
                    0.5,
                  );
              }
              const boxes = await Promise.all(roots.map((root) => root.boundingBox()));
              const scrolls = await Promise.all(
                roots.map((root) => root.page().evaluate(() => ({ x: scrollX, y: scrollY }))),
              );
              await info.attach(`${state}-root-geometry`, {
                body: JSON.stringify({
                  expected: { box: boxes[0], scroll: scrolls[0] },
                  actual: { box: boxes[1], scroll: scrolls[1] },
                }),
                contentType: 'application/json',
              });
              for (const axis of ['x', 'y', 'width', 'height'] as const)
                expect(
                  Math.abs(boxes[0]![axis] - boxes[1]![axis]),
                  `${state} absolute ${axis}`,
                ).toBeLessThanOrEqual(0.5);
              const isViewer = await roots[0]!.evaluate((element) =>
                element.classList.contains('semi-image-preview'),
              );
              const images = await Promise.all(
                roots.map((root) => root.screenshot(isViewer ? { style: viewerBackdrop } : {})),
              );
              for (const [i, label] of ['reference', 'vue'].entries())
                await info.attach(state === 'default' ? label : `${state}-${label}`, {
                  body: images[i]!,
                  contentType: 'image/png',
                });
              await expectScreenshotPixelsToMatch(vue, images[1]!, images[0]!, state);
            };
            await test.step('固定数量与默认视觉', async () => {
              await compare('default');
            });
            if (example.name === 'Progressive') {
              await test.step('Reload 更新源并完成真实加载', async () => {
                for (const root of [expected, actual]) {
                  const previous = await root
                    .locator('.semi-image-img')
                    .first()
                    .getAttribute('src');
                  await root.getByRole('button', { name: 'Reload', exact: true }).click();
                  await expect(root.locator('.semi-image-img').first()).not.toHaveAttribute(
                    'src',
                    previous!,
                  );
                }
                await compare('reloaded');
              });
            }
            if (example.name !== 'Fallback') {
              const viewers = [reference, vue].map((page) => page.locator('.semi-image-preview'));
              const open = async (multiple = false) => {
                for (const root of [expected, actual]) {
                  if (example.name === 'Standalone')
                    await root
                      .getByRole('button', {
                        name: multiple ? 'Preview multiple Images' : 'Preview single Image',
                        exact: true,
                      })
                      .click();
                  else await root.locator('.semi-image').first().click();
                }
                for (const viewer of viewers) await expect(viewer).toBeVisible();
                await imageAssets(viewers);
              };
              const close = async (escape = false) => {
                for (const viewer of viewers) {
                  if (escape) await viewer.page().keyboard.press('Escape');
                  else await viewer.locator('.semi-image-preview-header-close').click();
                }
                for (const viewer of viewers) await expect(viewer).toHaveCount(0);
              };
              await test.step('打开、预览资源与 Portal 完整视觉', async () => {
                await open();
                if (example.name === 'Container') {
                  for (const root of [expected, actual])
                    await expect(root.locator('.semi-image-preview')).toHaveCount(1);
                } else {
                  for (const root of [expected, actual])
                    await expect(root.locator('.semi-image-preview')).toHaveCount(0);
                }
                if (example.name === 'PreviewSource')
                  for (const viewer of viewers)
                    await expect(viewer.locator('.semi-image-preview-image-img')).toHaveAttribute(
                      'src',
                      /image-abstract-big.svg$/,
                    );
                await compare('preview', viewers);
              });
              await test.step('关闭、重开与 Escape', async () => {
                await close();
                await open(example.name === 'Standalone');
                await compare('reopened', viewers);
              });
              if (
                ['Group', 'Standalone', 'Container', 'CustomMenu', 'ExtendMenu', 'Header'].includes(
                  example.name,
                )
              ) {
                await test.step('下一张、上一张与首尾边界', async () => {
                  const total =
                    example.name === 'Header'
                      ? 2
                      : ['Group', 'Standalone'].includes(example.name)
                        ? 4
                        : 3;
                  const custom = example.name === 'CustomMenu';
                  if (custom)
                    for (const viewer of viewers) {
                      await expect(viewer.locator('.semi-image-preview-footer button')).toHaveCount(
                        7,
                      );
                      await expect(
                        viewer.locator('.semi-image-preview-footer button').nth(0),
                      ).toBeDisabled();
                    }
                  for (let index = 1; index < total; index++) {
                    for (const viewer of viewers)
                      await (
                        custom
                          ? viewer.locator('.semi-image-preview-footer button').nth(1)
                          : viewer.locator('.semi-image-preview-next')
                      ).click();
                    for (const viewer of viewers)
                      await expect(viewer.locator('.semi-image-preview-image-img')).toHaveAttribute(
                        'src',
                        new RegExp(
                          `image-${['abstract', 'sky', 'greenleaf', 'colorful'][index]}.svg$`,
                        ),
                      );
                    await compare(`next-${index}`, viewers);
                  }
                  for (const viewer of viewers)
                    await expect(viewer.locator('.semi-image-preview-next')).toHaveCount(0);
                  if (custom)
                    for (const viewer of viewers)
                      await expect(
                        viewer.locator('.semi-image-preview-footer button').nth(1),
                      ).toBeDisabled();
                  for (let index = total - 2; index >= 0; index--)
                    for (const viewer of viewers)
                      await (
                        custom
                          ? viewer.locator('.semi-image-preview-footer button').nth(0)
                          : viewer.locator('.semi-image-preview-prev')
                      ).click();
                  if (custom)
                    for (const viewer of viewers)
                      await expect(
                        viewer.locator('.semi-image-preview-footer button').nth(0),
                      ).toBeDisabled();
                  for (const viewer of viewers)
                    await expect(viewer.locator('.semi-image-preview-prev')).toHaveCount(0);
                  await compare('first-restored', viewers);
                });
              }
              await test.step('缩放、尺寸、旋转与下载', async () => {
                const custom = example.name === 'CustomMenu';
                for (const [label, icon] of [
                  ['ZoomIn', 'plus'],
                  ['ZoomOut', 'minus'],
                  ['RatioClick', 'real_size_stroked'],
                  ['RotateLeft', 'rotate'],
                ] as const) {
                  for (const viewer of viewers) {
                    const control = custom
                      ? viewer
                          .locator('.semi-image-preview-footer button')
                          .nth(
                            [
                              'Prev',
                              'Next',
                              'ZoomOut',
                              'ZoomIn',
                              'RatioClick',
                              'RotateLeft',
                              'Download',
                            ].indexOf(label),
                          )
                      : label === 'RatioClick'
                        ? viewer
                            .locator('.semi-image-preview-footer')
                            .locator(
                              '.semi-icon-real_size_stroked, .semi-icon-window_adaption_stroked',
                            )
                        : viewer.locator(`.semi-image-preview-footer .semi-icon-${icon}`);
                    const image = viewer.locator('.semi-image-preview-image-img');
                    const before = await image.getAttribute('style');
                    const beforeWidth = await image.evaluate((node) =>
                      parseFloat((node as HTMLElement).style.width),
                    );
                    const ratioIcon = viewer
                      .locator('.semi-image-preview-footer')
                      .locator('.semi-icon-real_size_stroked, .semi-icon-window_adaption_stroked');
                    let wasAdaptation = false;
                    if (label === 'RatioClick') {
                      await expect(ratioIcon).toHaveCount(1);
                      wasAdaptation = (await ratioIcon.getAttribute('class'))!.includes(
                        'semi-icon-real_size_stroked',
                      );
                    }
                    await control.click();
                    await expect(image).not.toHaveAttribute('style', before!);
                    if (label === 'ZoomIn')
                      await expect
                        .poll(() =>
                          image.evaluate((node) => parseFloat((node as HTMLElement).style.width)),
                        )
                        .toBeGreaterThan(beforeWidth);
                    if (label === 'ZoomOut')
                      await expect
                        .poll(() =>
                          image.evaluate((node) => parseFloat((node as HTMLElement).style.width)),
                        )
                        .toBeLessThan(beforeWidth);
                    if (label === 'RatioClick') {
                      await expect(ratioIcon).toHaveClass(
                        new RegExp(
                          wasAdaptation
                            ? 'semi-icon-window_adaption_stroked'
                            : 'semi-icon-real_size_stroked',
                        ),
                      );
                      if (wasAdaptation) await expect(image).toHaveCSS('width', '1440px');
                    }
                  }
                  await compare(label, viewers);
                  if (label === 'RatioClick') {
                    for (const viewer of viewers) {
                      const ratioIcon = viewer
                        .locator('.semi-image-preview-footer')
                        .locator(
                          '.semi-icon-real_size_stroked, .semi-icon-window_adaption_stroked',
                        );
                      await expect(ratioIcon).toHaveCount(1);
                      const previousClass = await ratioIcon.getAttribute('class');
                      await (
                        custom
                          ? viewer.locator('.semi-image-preview-footer button').nth(4)
                          : ratioIcon
                      ).click();
                      await expect(ratioIcon).not.toHaveAttribute('class', previousClass!);
                      await expect(ratioIcon).toHaveClass(/semi-icon-real_size_stroked/);
                    }
                    await compare('RatioClick-restored', viewers);
                  }
                }
                for (const viewer of viewers) {
                  const pending = viewer.page().waitForEvent('download');
                  await (
                    custom
                      ? viewer.locator('.semi-image-preview-footer button').nth(6)
                      : viewer.locator('.semi-image-preview-footer .semi-icon-download')
                  ).click();
                  const download = await pending;
                  expect(await download.failure()).toBeNull();
                }
                await close(true);
              });
              await test.step('改变缩放和旋转后退出重开仍可操作', async () => {
                await open(example.name === 'Standalone');
                await compare('reopened-after-transform', viewers);
                for (const viewer of viewers) {
                  const image = viewer.locator('.semi-image-preview-image-img');
                  const before = await image.getAttribute('style');
                  await (
                    example.name === 'CustomMenu'
                      ? viewer.locator('.semi-image-preview-footer button').nth(5)
                      : viewer.locator('.semi-image-preview-footer .semi-icon-rotate')
                  ).click();
                  await expect(image).not.toHaveAttribute('style', before!);
                }
                await compare('rotate-after-reopen', viewers);
                await close();
              });
            }
            if (theme === 'light' && direction === 'ltr') {
              await test.step('源码、重置、在线编辑与退出恢复', async () => {
                const action = (zh: string, en: string) =>
                  demo.getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
                await action('查看源码', 'View source').click();
                await expect(demo.locator('[data-demo-source]')).toBeVisible();
                await action('查看源码', 'View source').click();
                await expect(demo.locator('[data-demo-source]')).toBeHidden();
                await action('重置', 'Reset').click();
                const selector = example.name === 'Standalone' ? '.semi-button' : '.semi-image';
                const count = example.name === 'Standalone' ? 2 : imageCounts[example.block - 1]!;
                await expect(actual.locator(selector)).toHaveCount(count);
                await action('在线编辑', 'Edit online').click();
                await expect(
                  demo.frameLocator('iframe').locator('#app').locator(selector),
                ).toHaveCount(count, { timeout: 30_000 });
                await demo.locator('iframe').scrollIntoViewIfNeeded();
                const frame = demo.frameLocator('iframe');
                const editor = frame.locator('#app');
                await editor.scrollIntoViewIfNeeded();
                if (example.name === 'Fallback') {
                  await expect(editor.locator('.semi-image-img-error')).toHaveCount(2);
                  await imageAssets([editor]);
                } else {
                  if (example.name === 'Progressive') {
                    const image = editor.locator('.semi-image-img').first();
                    const before = await image.getAttribute('src');
                    await editor.getByRole('button', { name: 'Reload', exact: true }).click();
                    await expect(image).not.toHaveAttribute('src', before!);
                  }
                  await imageAssets([editor]);
                  for (const multiple of example.name === 'Standalone' ? [false, true] : [false]) {
                    if (example.name === 'Standalone')
                      await editor
                        .getByRole('button', {
                          name: multiple ? 'Preview multiple Images' : 'Preview single Image',
                          exact: true,
                        })
                        .click();
                    else await editor.locator('.semi-image').first().click();
                    const viewer = frame.locator('.semi-image-preview');
                    await expect(viewer).toBeVisible();
                    await imageAssets([viewer]);
                    if (example.name === 'Container')
                      await expect(editor.locator('.semi-image-preview')).toHaveCount(1);
                    if (example.name === 'CustomMenu') {
                      await viewer.locator('.semi-image-preview-footer button').nth(1).click();
                      await expect(viewer.locator('.semi-image-preview-image-img')).toHaveAttribute(
                        'src',
                        /image-sky.svg$/,
                      );
                      await viewer.locator('.semi-image-preview-footer button').nth(0).click();
                      await expect(viewer.locator('.semi-image-preview-image-img')).toHaveAttribute(
                        'src',
                        /image-abstract.svg$/,
                      );
                    }
                    await viewer.locator('.semi-image-preview-header-close').click();
                    await expect(frame.locator('.semi-image-preview')).toHaveCount(0);
                  }
                }
                await expect(demo.locator('.msg.err')).toHaveCount(0);
                await action('退出编辑', 'Close editor').click();
                await expect(demo.locator('iframe')).toHaveCount(0);
                await expect(actual.locator(selector)).toHaveCount(count);
              });
            }
            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'show/image',
                index: example.block,
                name: example.name,
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
