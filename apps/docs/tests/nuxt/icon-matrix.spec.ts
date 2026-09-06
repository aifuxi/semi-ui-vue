import { readFile } from 'node:fs/promises';
import { expect, test, type Locator } from '@playwright/test';
import { compareStyles, freezeAnimations } from './demo-parity';
import { visualContext, waitForVisualAssets } from './visual-context';
import { expectScreenshotPixelsToMatch } from '../../../../tests/browser/parity-harness';

const examples = [
  'Basic',
  'RotateSpin',
  'Sizes',
  'Colors',
  'Bicolor',
  'Multicolor',
  'Custom',
  'Accessibility',
];
const counts = [1, 3, 35, 4, 2, 3, 2, 1];
// Include SVG paints and transforms omitted by the general button comparison.
async function iconContract(root: Locator) {
  return root.locator('.semi-icon, .semi-icon *').evaluateAll((nodes) =>
    nodes.map((node) => {
      const style = getComputedStyle(node);
      // Upstream getUuidShort generates random gradient IDs. Resolve each paint server
      // locally and compare its stable position; missing references must still fail.
      const normalizePaint = (value: string) =>
        value.replace(/url\(["']?#([^)"']+)["']?\)/g, (_, id: string) => {
          const definitions = [...(node.closest('svg')?.querySelectorAll('[id]') ?? [])];
          const index = definitions.findIndex((definition) => definition.id === id);
          if (index < 0) throw new Error(`Unresolved SVG paint ${id}`);
          return `url(#definition-${index})`;
        });
      return {
        tag: node.tagName,
        role: node.getAttribute('role'),
        label: node.getAttribute('aria-label'),
        hidden: node.getAttribute('aria-hidden'),
        focusable: node.getAttribute('focusable'),
        tabIndex: node.getAttribute('tabindex'),
        path: node.getAttribute('d'),
        styles: Object.fromEntries(
          [
            'fill',
            'stroke',
            'stop-color',
            'stop-opacity',
            'fill-rule',
            'clip-rule',
            'transform',
            'transform-origin',
            'animation-name',
            'animation-duration',
            'animation-timing-function',
            'animation-iteration-count',
          ].map((key) => [key, normalizePaint(style.getPropertyValue(key))]),
        ),
      };
    }),
  );
}
async function bounds(root: Locator) {
  return root.locator('.semi-icon').evaluateAll((nodes) => {
    const rects = nodes.map((node) => node.getBoundingClientRect());
    const x = Math.min(...rects.map((r) => r.x)),
      y = Math.min(...rects.map((r) => r.y));
    return {
      x,
      y,
      width: Math.max(...rects.map((r) => r.right)) - x,
      height: Math.max(...rects.map((r) => r.bottom)) - y,
    };
  });
}
for (const locale of ['zh-cn', 'en-us'])
  for (const theme of ['light', 'dark'])
    for (const [index, name] of examples.entries())
      for (const direction of ['RotateSpin', 'Colors', 'Multicolor', 'Custom'].includes(name)
        ? ['ltr', 'rtl']
        : ['ltr'])
        test(`Icon 文档 ${name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`, async ({
          browser,
        }, info) => {
          test.setTimeout(90_000);
          const context = await visualContext(browser, info, locale, theme, direction);
          try {
            const reference = await context.newPage(),
              vue = await context.newPage();
            const errors: string[] = [];
            const upstreamWarnings: string[] = [];
            for (const page of [reference, vue]) {
              page.on('pageerror', (error) => errors.push(error.message));
              page.on('console', (message) => {
                if (message.type() !== 'error') return;
                // The pinned Chinese custom SVG uses maskType, which React 16 warns about.
                // Preserve that source and record only this exact, reference-only warning.
                if (
                  page === reference &&
                  name === 'Custom' &&
                  locale === 'zh-cn' &&
                  message
                    .text()
                    .startsWith(
                      'Warning: React does not recognize the `%s` prop on a DOM element.',
                    ) &&
                  message.text().includes('%s maskType masktype ')
                ) {
                  upstreamWarnings.push(message.text());
                } else errors.push(message.text());
              });
              await page.clock.install({ time: new Date('2024-08-15T10:24:30+08:00') });
            }
            await vue.addInitScript((value) => {
              if (window === window.top) localStorage.setItem('semi-docs-theme', value);
            }, theme);
            await Promise.all([
              reference.goto(
                `http://127.0.0.1:4173/docs.html?component=icon&locale=${locale}&theme=${theme}&example=${index + 1}`,
              ),
              vue.goto(`/${locale}/components/icon/`),
            ]);
            const expected = reference.locator('#root');
            const demo = vue.locator(`[data-demo-id="icon/${locale}/${name}"]`);
            const actual = demo.locator('[data-demo-preview]');
            await expect(expected.locator('.semi-icon')).toHaveCount(counts[index]!);
            await expect(actual.locator('.semi-icon')).toHaveCount(counts[index]!);
            await expect(actual).toBeVisible();
            expect((await actual.textContent())?.trim()).toBe(
              (await expected.textContent())?.trim(),
            );
            const source = await readFile(
              new URL(`../../src/demos/icon/${locale}/${name}.vue`, import.meta.url),
              'utf8',
            );
            expect(await demo.locator('[data-demo-source] code').textContent()).toBe(source);
            await waitForVisualAssets([expected, actual]);
            for (const root of [expected, actual])
              await root.evaluate((element, dir) => {
                (element as HTMLElement).dir = dir;
                element.classList.toggle('semi-rtl', dir === 'rtl');
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
            // Match document coordinates and scrolling as well as viewport coordinates.
            // The 20px MinusCircle edge differs by 8 pixels when only the viewport origin
            // matches; identical scroll offsets remove that Chromium rasterization difference.
            const scroll = await vue.evaluate(() => ({
              y: scrollY,
              height: document.documentElement.scrollHeight,
            }));
            await reference.evaluate(({ y, height }) => {
              document.body.style.minHeight = `${height}px`;
              const root = document.getElementById('root')!;
              root.style.top = `${parseFloat(root.style.top) + y}px`;
              window.scrollTo(0, y);
            }, scroll);
            await Promise.all([reference, vue].map((page) => page.mouse.move(1400, 880)));
            for (const time of name === 'RotateSpin' ? [0, 150, 300] : [0]) {
              await freezeAnimations([reference, vue], time);
              const state = time === 0 ? 'default' : `spin-${time}`;
              await compareStyles(expected, actual, info, state);
              const contract = await iconContract(expected);
              await info.attach(`${state}-svg-contract`, {
                body: JSON.stringify({ reference: contract, vue: await iconContract(actual) }),
                contentType: 'application/json',
              });
              expect(await iconContract(actual)).toEqual(contract);
              if (time === 0) {
                const images = await Promise.all(
                  [expected, actual].map(async (root) =>
                    root.page().screenshot({ clip: await bounds(root) }),
                  ),
                );
                await info.attach('reference', { body: images[0]!, contentType: 'image/png' });
                await info.attach('vue', { body: images[1]!, contentType: 'image/png' });
                await expectScreenshotPixelsToMatch(vue, images[1]!, images[0]!, name);
              }
              // Each icon is a separate crop: empty space between rows cannot dilute a defect.
              for (let icon = 0; icon < counts[index]!; icon++) {
                const targets = [expected, actual].map((root) =>
                  root.locator('.semi-icon').nth(icon),
                );
                const rectangles = await Promise.all(targets.map((target) => target.boundingBox()));
                await info.attach(`${state}-${icon}-rectangles`, {
                  body: JSON.stringify(rectangles),
                  contentType: 'application/json',
                });
                const images = await Promise.all(
                  targets.map((target, i) => target.page().screenshot({ clip: rectangles[i]! })),
                );
                for (const [i, suffix] of ['reference', 'vue'].entries())
                  await info.attach(`${state}-${icon}-${suffix}`, {
                    body: images[i]!,
                    contentType: 'image/png',
                  });
                await expectScreenshotPixelsToMatch(
                  vue,
                  images[1]!,
                  images[0]!,
                  `${name}/${state}/${icon}`,
                );
              }
            }
            for (const root of [expected, actual]) {
              await expect(root.locator('.semi-icon[tabindex]')).toHaveCount(0);
              if (name !== 'Custom')
                await expect(root.locator('svg[aria-hidden="true"]')).toHaveCount(counts[index]!);
              if (name === 'Accessibility')
                await expect(root.getByRole('img', { name: 'back to homepage' })).toHaveCount(1);
              if (name === 'Basic')
                await expect(root.getByRole('img', { name: 'home', exact: true })).toHaveCount(1);
            }
            if (theme === 'light' && direction === 'ltr') {
              const editableContract = (root: Locator) =>
                root.locator('.semi-icon, svg, path, circle, stop').evaluateAll((nodes) =>
                  nodes.map((node) => ({
                    tag: node.tagName,
                    attributes: Object.fromEntries(
                      [
                        'class',
                        'role',
                        'aria-label',
                        'aria-hidden',
                        'd',
                        'fill',
                        'offset',
                        'stop-color',
                        'cx',
                        'cy',
                        'r',
                      ].map((key) => [
                        key,
                        key === 'fill'
                          ? (node
                              .getAttribute(key)
                              ?.replace(/url\(#semi-[^)]+\)/g, 'url(#gradient)') ?? null)
                          : node.getAttribute(key),
                      ]),
                    ),
                  })),
                );
              const initialContract = await editableContract(actual);
              await demo
                .getByRole('button', {
                  name: locale === 'zh-cn' ? '在线编辑' : 'Edit online',
                  exact: true,
                })
                .click();
              const preview = demo.frameLocator('iframe').locator('#app');
              await expect(preview.locator('.semi-icon')).toHaveCount(counts[index]!, {
                timeout: 30_000,
              });
              await expect(demo.locator('.msg.err')).toHaveCount(0);
              // Verify the editable initial SVGs, including CustomSvg.vue multi-file resolution.
              expect(await editableContract(preview)).toEqual(initialContract);
              await demo
                .getByRole('button', {
                  name: locale === 'zh-cn' ? '退出编辑' : 'Close editor',
                  exact: true,
                })
                .click();
              await expect(demo.locator('iframe')).toHaveCount(0);
            }
            expect(upstreamWarnings).toHaveLength(name === 'Custom' && locale === 'zh-cn' ? 1 : 0);
            await info.attach('upstream-warnings', {
              body: JSON.stringify(upstreamWarnings),
              contentType: 'application/json',
            });
            expect(errors).toEqual([]);
            await info.attach('acceptance', {
              body: JSON.stringify({
                upstream: 'basic/icon',
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
