import { expect, test } from '@playwright/test';
import {
  assertScenarioComparable,
  createParityScenarioUrl,
  PARITY_VIEWPORTS,
  REFERENCE_SOURCE_PATHS,
} from '../../../packages/test-infra/src';
import {
  createVueScenarioUrl,
  expectComparableTarget,
  expectScreenshotPixelsToMatch,
  openParityPages,
  PARITY_APPLICATIONS,
  referenceSourceWasRequested,
} from '../parity-harness';

test('Select 参考场景来自本地 v2.102.0 并保留 Option、分组与 Portal', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'select',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.selectPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'select')).toBe(true);
  const scenario = page.getByTestId('select-reference');
  await expect(scenario.locator('.semi-select')).toHaveCount(5);
  await expect(scenario.locator('[data-parity-target="select-disabled"]')).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await expect(scenario.locator('.semi-tag')).toHaveCount(3);
  await expect(scenario.locator('.semi-select-option-list-wrapper')).toBeVisible();
  await expect(scenario.locator('.semi-select-group')).toHaveCount(2);
  expect(runtimeErrors).toEqual([]);
});

test('Select React/Vue 基础状态、搜索、键盘与选择事件契约一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'select',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  for (const target of assertScenarioComparable('select').targets) {
    await test.step(target.id, async () => {
      await expectComparableTarget(pair, 'select', target.id);
    });
  }

  const reactInput = pair.react.page.locator('[data-parity-target="select-filter"] input');
  const vueInput = pair.vue.page.locator('[data-parity-target="select-filter"] input');
  await Promise.all([reactInput.fill('Kor'), vueInput.fill('Kor')]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-select-option-list [role="option"]')).toHaveCount(1),
    expect(pair.vue.page.locator('.semi-select-option-list [role="option"]')).toHaveCount(1),
  ]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-select-option-keyword')).toHaveText('Kor'),
    expect(pair.vue.page.locator('.semi-select-option-keyword')).toHaveText('Kor'),
  ]);
  await Promise.all([reactInput.press('ArrowDown'), vueInput.press('ArrowDown')]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-select-option-focused')).toHaveCount(1),
    expect(pair.vue.page.locator('.semi-select-option-focused')).toHaveCount(1),
  ]);
  await Promise.all([reactInput.press('Enter'), vueInput.press('Enter')]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('最近选择：korea'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近选择：korea'),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Select React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'select',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('select-reference');
      const vueTarget = pair.vue.page.getByTestId('select-vue');
      await expect(reactTarget).toHaveScreenshot(`select-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`select-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
    });
  }
}

test('Select React/Vue RTL 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'select',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  const reactTarget = pair.react.page.getByTestId('select-reference');
  const vueTarget = pair.vue.page.getByTestId('select-vue');
  await Promise.all([
    expect(reactTarget.locator('.semi-tag-group.semi-tag-group-max')).toHaveCount(1),
    expect(vueTarget.locator('.semi-tag-group.semi-tag-group-max')).toHaveCount(1),
  ]);
  await expect(reactTarget).toHaveScreenshot('select-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('select-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
});

for (const closeAction of ['escape', 'select'] as const) {
  test(`Select ${closeAction} 收起动画中的旧选项不拦截下一次点击`, async ({ page }) => {
    await page.goto(
      createVueScenarioUrl({
        scenarioId: 'select',
        theme: 'light',
        direction: 'ltr',
        locale: 'zh-CN',
      }),
    );
    // 延长退出动画以稳定观察关闭与移除 DOM 之间的窗口，不等待或跳过动画。
    await page.addStyleTag({
      content: '.semi-tooltip-animation-hide { animation-duration: 10s !important; }',
    });
    const trigger = page.locator('[data-parity-target="select-basic"]');
    await trigger.click();
    const listId = await trigger.getAttribute('aria-controls');
    expect(listId).toBeTruthy();
    const list = page.locator(`[id="${listId}"]`);
    const option = list.getByRole('option', { name: 'tick 轻颜相机', exact: true });
    const box = await option.boundingBox();
    expect(box).not.toBeNull();
    const point = { x: box!.x + box!.width / 2, y: box!.y + box!.height / 2 };
    if (closeAction === 'escape') await trigger.press('Escape');
    else await option.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    // 旧浮层仍可播放视觉动画，但命中测试必须穿过旧内容，不能选到已关闭的选项。
    const hit = await page.evaluate(
      ({ listId, point }) => {
        const popup = document.getElementById(listId!);
        const target = document.elementFromPoint(point.x, point.y);
        return { retained: !!popup, intercepts: !!popup && !!target && popup.contains(target) };
      },
      { listId, point },
    );
    expect(hit.retained).toBe(true);
    expect(hit.intercepts).toBe(false);
  });
}
