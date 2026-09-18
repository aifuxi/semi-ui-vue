import { test, expect, type Locator } from '@playwright/test';
import { openParityPages, expectScreenshotPixelsToMatch } from '../parity-harness';

async function measure(popup: Locator) {
  return popup.evaluate((element) => {
    const trigger = document
      .querySelector('[data-parity-target="typography-css-ellipsis"]')!
      .getBoundingClientRect();
    return [element, ...element.querySelectorAll('*')].map((node) => {
      const rect = node.getBoundingClientRect(),
        style = getComputedStyle(node);
      return {
        tag: node.tagName,
        classes: [...node.classList].sort(),
        role: node.getAttribute('role'),
        placement: node.getAttribute('x-placement'),
        text: node.children.length ? null : node.textContent,
        styles: Object.fromEntries(
          [
            'color',
            'background-color',
            'font-family',
            'font-size',
            'font-weight',
            'line-height',
            'padding',
            'margin',
            'border-radius',
            'box-shadow',
            'opacity',
            'transform',
            'fill',
            'stroke',
          ].map((key) => [key, style.getPropertyValue(key)]),
        ),
        rect: {
          x: rect.x - trigger.x,
          y: rect.y - trigger.y,
          width: rect.width,
          height: rect.height,
        },
      };
    });
  });
}
for (const theme of ['light', 'dark'] as const)
  for (const [mode, arrow] of [
    ['tooltip', undefined],
    ['popover', undefined],
    ['popover', 'false'],
    ['popover', 'true'],
  ] as const)
    test(`Typography 完整浮层、容器、滚动、恢复与卸载 ${theme} ${mode} arrow=${arrow}`, async ({
      context,
    }, info) => {
      const pair = await openParityPages(context, {
        scenarioId: 'typography',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      const pages = [pair.react.page, pair.vue.page];
      for (const page of pages) {
        const url = new URL(page.url());
        url.searchParams.set('typographyTip', mode);
        if (arrow !== undefined) url.searchParams.set('arrow', arrow);
        await page.goto(url.toString());
        await page.locator('[data-parity-target="typography-css-ellipsis"]').hover();
        await expect(page.locator(`.semi-${mode}-wrapper`)).toBeVisible();
        await expect(page.locator(`.semi-${mode}-wrapper`)).toHaveCSS('transform', 'none');
        await expect(page.locator(`#typography-tip-container .semi-${mode}-wrapper`)).toHaveCount(
          1,
        );
        await expect(page.locator(`.semi-${mode}-icon-arrow`)).toHaveCount(
          arrow === 'false' ? 0 : 1,
        );
      }
      async function compare(state: string) {
        const targets = pages.map((page) => page.locator(`.semi-${mode}-wrapper`));
        const [expected, actual] = await Promise.all(targets.map(measure));
        await info.attach(`${state}-styles`, {
          body: JSON.stringify({ expected, actual }),
          contentType: 'application/json',
        });
        expect(actual).toHaveLength(expected!.length);
        for (const [index, item] of actual!.entries()) {
          const { rect: a, ...av } = item,
            { rect: e, ...ev } = expected![index]!;
          expect(av).toEqual(ev);
          for (const key of ['x', 'y', 'width', 'height'] as const)
            expect(Math.abs(a[key] - e[key]), `${state} node ${index} ${key}`).toBeLessThanOrEqual(
              0.5,
            );
        }
        const [reference, vue] = await Promise.all(
          targets.map(async (target) => {
            const clip = await target.evaluate((element) => {
              const rects = [element, ...element.querySelectorAll('svg')].map((node) =>
                node.getBoundingClientRect(),
              );
              const x = Math.floor(Math.min(...rects.map((rect) => rect.left))) - 1;
              const y = Math.floor(Math.min(...rects.map((rect) => rect.top))) - 1;
              return {
                x,
                y,
                width: Math.ceil(Math.max(...rects.map((rect) => rect.right))) + 1 - x,
                height: Math.ceil(Math.max(...rects.map((rect) => rect.bottom))) + 1 - y,
              };
            });
            return target.page().screenshot({ clip });
          }),
        );
        await info.attach(`${state}-reference`, { body: reference!, contentType: 'image/png' });
        await info.attach(`${state}-vue`, { body: vue!, contentType: 'image/png' });
        await expectScreenshotPixelsToMatch(pages[1]!, vue!, reference!);
      }
      await compare('open');
      for (const page of pages) {
        await page.evaluate(() => {
          document.body.style.minHeight = '1800px';
          window.scrollTo(0, 70);
        });
        // Scrolling moves the trigger out from under the mouse; keep the requested open state.
        await page.locator('[data-parity-target="typography-css-ellipsis"]').hover();
        await expect(page.locator(`.semi-${mode}-wrapper`)).toBeVisible();
        await expect(page.locator(`.semi-${mode}-wrapper`)).toHaveCSS('transform', 'none');
        await expect(page.locator(`.semi-${mode}-wrapper`)).not.toHaveClass(
          /semi-tooltip-animation-/,
        );
      }
      await compare('document-scroll');
      for (const page of pages) {
        await page.getByRole('button', { name: 'Toggle width' }).click();
        await expect(page.locator(`.semi-${mode}-wrapper`)).toHaveCount(0);
        await page.getByRole('button', { name: 'Toggle width' }).click();
        await page.locator('[data-parity-target="typography-css-ellipsis"]').hover();
        await expect(page.locator(`.semi-${mode}-wrapper`)).toBeVisible();
        await page.getByRole('button', { name: 'Toggle text' }).click();
        await expect(page.locator(`.semi-${mode}-wrapper`)).toHaveCount(0);
        await page.evaluate(() => window.scrollTo(0, 100));
        await expect(page.locator(`.semi-${mode}-wrapper`)).toHaveCount(0);
      }
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
