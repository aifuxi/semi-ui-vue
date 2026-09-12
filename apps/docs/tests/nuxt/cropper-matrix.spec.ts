import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { freezeAnimations } from './demo-parity';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

test.use({ actionTimeout: 10_000 });

const examples = [
  { name: 'Basic', block: 1 },
  { name: 'AspectRatio', block: 2 },
  { name: 'Controlled', block: 3 },
  { name: 'CropBox', block: 4 },
  { name: 'Preview', block: 5 },
];

async function measure(root: Locator, includeRoot = false) {
  return root.evaluate((element, includeRoot) => {
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
    ];
    // Generated ids (React getUuidShort / Spin gradients, Vue useId) differ per instance. Resolve
    // every id and id reference — including `url(#…)` in attributes and computed styles — to the
    // position of its definition inside this root, so a missing, duplicated or reordered definition
    // still fails while identical trees compare exactly.
    const idIndex = new Map<string, string>();
    for (const node of [...(includeRoot ? [element] : []), ...element.querySelectorAll('[id]')]) {
      const value = node.getAttribute('id');
      if (value && !idIndex.has(value)) idIndex.set(value, `id-${idIndex.size}`);
    }
    const idReferences = [
      'for',
      'aria-labelledby',
      'aria-describedby',
      'aria-controls',
      'aria-owns',
      'aria-activedescendant',
    ];
    // Computed styles may quote the fragment (`url("#id")`), so accept both forms.
    const mapUrl = (value: string) =>
      value.replace(
        /url\(["']?#([^)"']+)["']?\)/g,
        (_, id: string) => `url(#${idIndex.get(id) ?? id})`,
      );
    // Popover ids live outside this root, so they are not part of `idIndex`; assign stable
    // tokens by order of appearance instead of comparing the generated values across pages.
    const externalIdIndex = new Map<string, string>();
    const externalId = (id: string) => {
      if (!externalIdIndex.has(id)) externalIdIndex.set(id, `external-id-${externalIdIndex.size}`);
      return externalIdIndex.get(id)!;
    };
    const resolveId = (name: string, value: string) => {
      if (name === 'id') return idIndex.get(value) ?? value;
      if (idReferences.includes(name))
        return value
          .split(/\s+/)
          .map((token) => idIndex.get(token) ?? externalId(token))
          .join(' ');
      if (name === 'data-popupid') return idIndex.get(value) ?? externalId(value);
      if (name === 'src') return value ? new URL(value, location.href).pathname : '';
      return mapUrl(value);
    };
    // Component nodes carry a `semi-` class; controls, list structure, icons and paragraphs are
    // matched separately because their attributes, text and geometry are part of the contract.
    return [
      ...(includeRoot ? [element] : []),
      ...element.querySelectorAll(
        '[class*="semi-"], input, button, svg path, br, p, span, strong, img',
      ),
    ].map((node) => {
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return {
        tag: node.tagName,
        classes: [...node.classList].sort(),
        attributes: Object.fromEntries(
          [...node.attributes]
            .filter(
              (attribute) =>
                // Vue reflects template `:checked` bindings to the attribute as well as the property
                // (@vue/runtime-dom patchProp) while React sets the property only; the measured
                // `checked` property below carries that contract.
                !['style', 'class', 'checked'].includes(attribute.name) &&
                // Vue SFC scoped styles stamp `data-v-*` on the template elements; the styling they
                // enable is still compared through computed styles.
                !attribute.name.startsWith('data-v-') &&
                // `aria-disabled`/`aria-invalid`/`aria-required` default to false, so an explicit
                // "false" and an omitted attribute state the same thing (ARIA 1.2 defaults).
                !(
                  ['aria-disabled', 'aria-invalid', 'aria-required'].includes(attribute.name) &&
                  attribute.value === 'false'
                ),
            )
            // Sort first so external-id tokens are assigned in the same order on both sides.
            .sort((left, right) => (left.name < right.name ? -1 : 1))
            .map((attribute) => [
              attribute.name,
              // The pinned arrow path has one doubled separator before 6; SVG whitespace is
              // insignificant between these same commands/numbers. Keep this limited to its paths.
              resolveId(
                attribute.name,
                attribute.name === 'd' && node.matches('svg.semi-popover-icon-arrow > path')
                  ? attribute.value.replace(/\s+/g, ' ')
                  : attribute.value,
              ),
            ]),
        ),
        text: (() => {
          const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
          const parts: string[] = [];
          while (walker.nextNode()) {
            const text = walker.currentNode.textContent?.replace(/\s+/g, ' ').trim();
            if (text) parts.push(text);
          }
          return parts;
        })(),
        checked: (node as HTMLInputElement).checked ?? null,
        value: (node as HTMLInputElement).value ?? null,
        styles: Object.fromEntries(
          properties.map((key) => [key, mapUrl(style.getPropertyValue(key))]),
        ),
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

// The pinned Preview always renders an empty output img before export. Keep that node in
// geometry/style/pixel comparisons, but only decode actual image resources.
async function waitCropperAssets(root: Locator) {
  await waitForVisualAssets([root.locator('.semi-cropper')]);
  await root
    .locator('img')
    .evaluateAll((images) =>
      Promise.all(
        images
          .filter((image) => image.getAttribute('src'))
          .map((image) => (image as HTMLImageElement).decode()),
      ),
    );
}

/** Give both roots the same box, page scroll and writing direction before comparing. */
async function align(
  referencePage: Page,
  expected: Locator,
  vuePage: Page,
  actual: Locator,
  direction: string,
) {
  await Promise.all([expected, actual].map(waitCropperAssets));
  for (const root of [expected, actual])
    await root.evaluate((element, dir) => {
      (element as HTMLElement).dir = dir;
      element.classList.toggle('semi-rtl', dir === 'rtl');
    }, direction);
  await actual.scrollIntoViewIfNeeded();
  // Keep the complete export inside the viewport and below the fixed documentation header.
  // scrollIntoViewIfNeeded alone can leave a tall preview partly below the viewport.
  await actual.evaluate((element) => {
    const headerBottom =
      document.querySelector('.site-header')?.getBoundingClientRect().bottom ?? 0;
    window.scrollTo({
      top: scrollY + element.getBoundingClientRect().top - headerBottom - 16,
      behavior: 'instant',
    });
  });
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
  const scroll = await vuePage.evaluate(() => ({
    y: scrollY,
    height: document.documentElement.scrollHeight,
  }));
  await referencePage.evaluate(({ y, height }) => {
    document.body.style.minHeight = `${height}px`;
    const root = document.getElementById('root')!;
    root.style.top = `${parseFloat(root.style.top) + y}px`;
    window.scrollTo(0, y);
  }, scroll);
  await Promise.all([referencePage, vuePage].map((page) => page.mouse.move(1400, 880)));
}

async function drag(page: Page, target: Locator, dx: number, dy: number, x?: number, y?: number) {
  await target.scrollIntoViewIfNeeded();
  const box = await target.boundingBox();
  expect(box).not.toBeNull();
  const startX = box!.x + (x ?? box!.width / 2);
  const startY = box!.y + (y ?? box!.height / 2);
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + dx, startY + dy, { steps: 5 });
  await page.mouse.up();
}

for (const locale of ['zh-cn', 'en-us'] as const)
  for (const theme of ['light', 'dark'] as const)
    for (const example of examples)
      for (const direction of ['ltr', 'rtl'] as const)
        test(`Cropper 文档 ${example.name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
          browser,
        }, info) => {
          test.setTimeout(120_000);
          const context = await visualContext(browser, info, locale, theme, direction);
          try {
            const reference = await context.newPage(),
              vue = await context.newPage();
            // The 900px default leaves the complete crop export below the viewport; the paired
            // 1200px probe preserves its geometry and removes only that capture clipping.
            const viewport = { width: 1440, height: 1200 };
            await Promise.all([reference, vue].map((page) => page.setViewportSize(viewport)));
            await info.attach('cropper-actual-viewport', {
              body: JSON.stringify({
                viewport,
                reference: reference.viewportSize(),
                vue: vue.viewportSize(),
                reason: 'complete crop output inside viewport; original full-root capture retained',
              }),
              contentType: 'application/json',
            });
            const errors: string[] = [];
            const observe = (page: Page) => {
              page.on('pageerror', (error) => errors.push(error.message));
              page.on('console', (message) => {
                if (message.type() === 'error') errors.push(message.text());
              });
            };
            for (const page of [reference, vue]) observe(page);
            await vue.addInitScript((value) => {
              if (window === window.top) localStorage.setItem('semi-docs-theme', value);
            }, theme);
            await reference.goto(
              `http://127.0.0.1:4173/docs.html?component=cropper&locale=${locale}&theme=${theme}&example=${example.block}`,
            );
            const expected = reference.locator('#root');
            // Establish the reference independently before loading the Vue page.
            await expect(expected.locator('.semi-cropper')).not.toHaveCount(0);
            await vue.goto(`/${locale}/components/cropper/`);
            const demo = vue.locator(`[data-demo-id="cropper/${locale}/${example.name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(actual.locator('.semi-cropper')).toHaveCount(
              await expected.locator('.semi-cropper').count(),
            );
            await expect(actual).toBeVisible();
            const source = await readFile(
              new URL(`../../src/demos/cropper/${locale}/${example.name}.vue`, import.meta.url),
              'utf8',
            );
            expect(await demo.locator('[data-demo-source] code').textContent()).toBe(source);
            await align(reference, expected, vue, actual, direction);
            const compare = async (state: string) => {
              await align(reference, expected, vue, actual, direction);
              await Promise.all([expected, actual].map(waitCropperAssets));
              await Promise.all([reference, vue].map((page) => page.mouse.move(1400, 880)));
              await freezeAnimations([reference, vue], 300);
              const expectedTarget = expected;
              const actualTarget = actual;
              const [referenceNodes, vueNodes] = await Promise.all([
                measure(expectedTarget),
                measure(actualTarget),
              ]);
              await info.attach(`${state}-styles`, {
                body: JSON.stringify({ expected: referenceNodes, actual: vueNodes }),
                contentType: 'application/json',
              });
              expect(vueNodes, `${state} 节点数量`).toHaveLength(referenceNodes.length);
              for (const [i, node] of vueNodes.entries()) {
                const { rect: a, ...actualNode } = node;
                const { rect: b, ...expectedNode } = referenceNodes[i]!;
                expect(actualNode, `${state} node ${i}`).toEqual(expectedNode);
                for (const axis of ['x', 'y', 'width', 'height'] as const)
                  expect(
                    Math.abs(a[axis] - b[axis]),
                    `${state} node ${i} ${axis}`,
                  ).toBeLessThanOrEqual(0.5);
              }
              for (const root of [expectedTarget, actualTarget]) {
                const visibility = await root.evaluate((element) => {
                  const rect = element.getBoundingClientRect();
                  const headerBottom =
                    document.querySelector('.site-header')?.getBoundingClientRect().bottom ?? 0;
                  const points = [
                    [rect.left + 4, rect.top + 4],
                    [rect.right - 4, rect.top + 4],
                    [rect.left + 4, rect.bottom - 4],
                    [rect.right - 4, rect.bottom - 4],
                    [rect.left + rect.width / 2, rect.top + rect.height / 2],
                  ];
                  return {
                    top: rect.top,
                    bottom: rect.bottom,
                    left: rect.left,
                    right: rect.right,
                    headerBottom,
                    width: innerWidth,
                    height: innerHeight,
                    unobstructed: points.every(([x, y]) => {
                      const hit = document.elementFromPoint(x!, y!);
                      return hit === element || (hit !== null && element.contains(hit));
                    }),
                  };
                });
                expect(visibility.top, `${state} above fixed header`).toBeGreaterThanOrEqual(
                  visibility.headerBottom,
                );
                expect(
                  visibility.bottom,
                  `${state} complete root below viewport`,
                ).toBeLessThanOrEqual(visibility.height);
                expect(visibility.left).toBeGreaterThanOrEqual(0);
                expect(visibility.right).toBeLessThanOrEqual(visibility.width);
                expect(visibility.unobstructed, `${state} complete preview unobstructed`).toBe(
                  true,
                );
              }
              const images = await Promise.all([
                expectedTarget.screenshot(),
                actualTarget.screenshot(),
              ]);
              for (const [i, label] of ['reference', 'vue'].entries())
                await info.attach(state === 'default' ? label : `${state}-${label}`, {
                  body: images[i]!,
                  contentType: 'image/png',
                });
              await expectScreenshotPixelsToMatch(vue, images[1]!, images[0]!, state);
            };
            await test.step('默认结构、样式、几何与截图', () => compare('default'));
            await test.step('真实拖动裁切框与图像、调整框大小', async () => {
              for (const root of [expected, actual]) {
                const cropBox = root.locator('.semi-cropper-box');
                const before = await cropBox.getAttribute('style');
                await drag(root.page(), cropBox, 18, 12);
                await expect(cropBox).not.toHaveAttribute('style', before!);
              }
              await compare('crop-box-dragged');
              for (const root of [expected, actual]) {
                const image = root.locator('.semi-cropper-img');
                const before = await image.getAttribute('style');
                // The mask's upper left lies outside the initial centered crop box.
                await drag(root.page(), root.locator('.semi-cropper-mask'), 14, 9, 12, 12);
                await expect(image).not.toHaveAttribute('style', before!);
              }
              await compare('image-dragged');
              for (const root of [expected, actual]) {
                const corners = root.locator('.semi-cropper-box-corner');
                await expect(corners).toHaveCount(example.name === 'CropBox' ? 0 : 8);
                if (example.name !== 'CropBox') {
                  const before = await root.locator('.semi-cropper-box').boundingBox();
                  // A 3:4 box initially occupies all 300px of container height; growing its
                  // bottom edge is correctly clamped by the pinned Foundation. Shrink first.
                  await drag(
                    root.page(),
                    root.locator('[data-dir="br"]'),
                    example.name === 'AspectRatio' ? -24 : 20,
                    example.name === 'AspectRatio' ? -32 : 14,
                  );
                  await expect
                    .poll(
                      async () => (await root.locator('.semi-cropper-box').boundingBox())!.width,
                    )
                    .not.toBe(before!.width);
                  if (example.name === 'AspectRatio') {
                    const after = await root.locator('.semi-cropper-box').boundingBox();
                    expect(after!.width).toBeLessThan(before!.width);
                    expect(after!.height).toBeLessThan(before!.height);
                    expect(Math.abs(after!.width / after!.height - 3 / 4)).toBeLessThan(0.005);
                  }
                }
              }
              await compare('crop-box-resized');
              if (example.name === 'AspectRatio') {
                for (const root of [expected, actual]) {
                  const cropBox = root.locator('.semi-cropper-box');
                  const before = await cropBox.boundingBox();
                  await drag(root.page(), root.locator('[data-dir="br"]'), 12, 16);
                  await expect
                    .poll(async () => (await cropBox.boundingBox())!.width)
                    .toBeGreaterThan(before!.width);
                  const after = await cropBox.boundingBox();
                  expect(after!.height).toBeGreaterThan(before!.height);
                  expect(after!.height).toBeLessThanOrEqual(300);
                  expect(Math.abs(after!.width / after!.height - 3 / 4)).toBeLessThan(0.005);
                }
                await compare('aspect-box-expanded-after-shrink');
              }
            });
            if (example.name === 'Basic') {
              await test.step('形状切换和四角调整块', async () => {
                for (const shape of ['round', 'roundRect', 'rect']) {
                  for (const root of [expected, actual]) {
                    await root.getByText(shape, { exact: true }).click();
                    await expect(root.locator('.semi-cropper-box-corner')).toHaveCount(
                      shape === 'round' ? 4 : 8,
                    );
                  }
                  await compare(`shape-${shape}`);
                }
              });
            }
            if (example.name === 'Controlled' || example.name === 'Preview') {
              await test.step('受控旋转缩放的真实键盘操作与预览更新', async () => {
                for (const root of [expected, actual]) {
                  const sliders = root.getByRole('slider');
                  await sliders.first().focus();
                  await expect(sliders.first()).toBeFocused();
                  await sliders.first().press('ArrowRight');
                  await expect(sliders.first()).not.toHaveAttribute('aria-valuenow', '0');
                  await sliders.nth(1).focus();
                  await sliders.nth(1).press('ArrowRight');
                  await expect(sliders.nth(1)).not.toHaveAttribute('aria-valuenow', '1');
                }
                await compare('controlled-rotation-zoom');
              });
            }
            await test.step('导出可解码裁切图像与像素', async () => {
              for (const root of [expected, actual]) {
                await root
                  .getByRole('button', {
                    name:
                      locale === 'en-us' && example.name !== 'Preview'
                        ? 'Get Cropped Image'
                        : '裁切',
                    exact: true,
                  })
                  .click();
                const output = root.locator('img[src^="data:image/"]');
                await expect(output).toHaveCount(1);
                await expect
                  .poll(() => output.evaluate((image) => (image as HTMLImageElement).naturalWidth))
                  .toBeGreaterThan(0);
              }
              await align(reference, expected, vue, actual, direction);
              await compare('exported');
            });

            if (theme === 'light' && direction === 'ltr') {
              await test.step('源码、重置与在线编辑生命周期', async () => {
                const block = vue.locator(`[data-demo-id="cropper/${locale}/${example.name}"]`);
                const preview = block.locator('[data-demo-preview]');
                const action = (zh: string, en: string) =>
                  block.getByRole('button', { name: locale === 'zh-cn' ? zh : en, exact: true });
                const lists = await preview.locator('.semi-cropper').count();
                await action('查看源码', 'View source').click();
                await expect(block.locator('[data-demo-source]')).toBeVisible();
                expect(await block.locator('[data-demo-source] code').textContent()).toBe(source);
                await action('查看源码', 'View source').click();
                await expect(block.locator('[data-demo-source]')).toBeHidden();
                await action('重置', 'Reset').click();
                await expect(preview.locator('.semi-cropper')).toHaveCount(lists);
                await action('在线编辑', 'Edit online').click();
                const editor = block.frameLocator('iframe').locator('#app');
                await expect(editor.locator('.semi-cropper')).toHaveCount(lists, {
                  timeout: 30_000,
                });
                await expect(block.locator('.msg.err')).toHaveCount(0);
                await action('退出编辑', 'Close editor').click();
                await expect(block.locator('iframe')).toHaveCount(0);
                await expect(preview.locator('.semi-cropper')).toHaveCount(lists);
              });
            }
            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'show/cropper',
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
