import { expect, test } from '@playwright/test';
import { assertScenarioComparable, PARITY_VIEWPORTS } from '../../../packages/test-infra/src';
import { expectComparableTarget, openParityPages } from '../parity-harness';

test('ScrollList 固定源码场景保留 normal/wheel、循环、禁用、变换与选择契约', async ({
  context,
}) => {
  const pair = await openParityPages(context, {
    scenarioId: 'scroll-list',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('scroll-list').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'scroll-list', target.id));
  }

  for (const page of [pair.react.page, pair.vue.page]) {
    await expect(page.getByRole('listbox')).toHaveCount(5);
    await expect(
      page.getByRole('listbox', { name: 'Normal period' }).getByRole('option'),
    ).toHaveCount(3);
    await expect(page.getByRole('listbox', { name: 'Wheel hour' }).getByRole('option')).toHaveCount(
      32,
    );
    await expect(
      page.getByRole('listbox', { name: 'Wheel minute' }).getByText('20 min'),
    ).toHaveCount(1);
    await expect(
      page.getByRole('listbox', { name: 'Wheel minute' }).getByText('15'),
    ).toHaveAttribute('aria-disabled', 'true');
  }

  await Promise.all(
    [pair.react.page, pair.vue.page].map((page) =>
      page.getByRole('listbox', { name: 'Normal hour' }).getByText('5').click(),
    ),
  );
  await Promise.all(
    [pair.react.page, pair.vue.page].map((page) =>
      expect(page.getByRole('listbox', { name: 'Normal hour' }).getByText('5 h')).toHaveClass(
        /semi-scrolllist-item-sel/,
      ),
    ),
  );

  await Promise.all(
    [pair.react.page, pair.vue.page].map((page) =>
      page.getByRole('listbox', { name: 'Wheel minute' }).getByText('25').click(),
    ),
  );
  await Promise.all([pair.react.page.waitForTimeout(60), pair.vue.page.waitForTimeout(60)]);
  await Promise.all(
    [pair.react.page, pair.vue.page].map((page) =>
      expect(page.getByRole('listbox', { name: 'Wheel minute' }).getByText('25 min')).toHaveCount(
        1,
      ),
    ),
  );
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`ScrollList React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'scroll-list',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      for (const target of assertScenarioComparable('scroll-list').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'scroll-list', target.id));
      }
      const reactTarget = pair.react.page.getByTestId('scroll-list-reference');
      const vueTarget = pair.vue.page.getByTestId('scroll-list-vue');
      await expect(reactTarget).toHaveScreenshot(
        `scroll-list-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`scroll-list-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('ScrollList React/Vue RTL 几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'scroll-list',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('scroll-list').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'scroll-list', target.id));
  }
  const reactTarget = pair.react.page.getByTestId('scroll-list-reference');
  const vueTarget = pair.vue.page.getByTestId('scroll-list-vue');
  await expect(reactTarget).toHaveScreenshot('scroll-list-reference-rtl.png');
  await expect(vueTarget).toHaveScreenshot('scroll-list-vue-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
