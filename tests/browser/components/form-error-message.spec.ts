import { expect, test } from '@playwright/test';

import { expectScreenshotPixelsToMatch, openParityPages } from '../parity-harness';

for (const theme of ['light', 'dark'] as const) {
  // 公开 props、DOM 和真实像素同时对照固定 React，避免只在 jsdom 内验证隐藏条件。
  test(`Form.ErrorMessage React/Vue 空错误、布尔错误和更新行为一致：${theme}`, async ({
    context,
  }, testInfo) => {
    // 来源由现有 harness 验证，示例直接调用两端真实公开 Form.ErrorMessage。
    const pair = await openParityPages(context, {
      scenarioId: 'form',
      theme,
      direction: 'ltr',
      locale: 'zh-CN',
    });
    for (const page of [pair.react.page, pair.vue.page]) {
      // 空字符串与带帮助文案的隐藏错误都不产生错误区域或图标。
      for (const id of ['undefined', 'false', 'empty', 'empty-help', 'empty-array', 'dynamic']) {
        // 容器本身必须存在，防止场景未加载时得到错误的零元素通过。
        const target = page.locator(`[data-error-case="${id}"]`);
        await expect(target).toBeAttached();
        await expect(target.locator('.semi-form-field-error-message')).toHaveCount(0);
        await expect(target.locator('.semi-form-field-validate-status-icon')).toHaveCount(0);
        await expect(target).toHaveText('');
      }
      // 显式 true 保留 React 的空错误容器，但不能显示无文字的错误图标。
      const booleanError = page.locator('[data-error-case="true"]');
      await expect(booleanError.locator('.semi-form-field-error-message')).toHaveCount(1);
      await expect(booleanError).toHaveText('');
      await expect(booleanError.locator('.semi-form-field-validate-status-icon')).toHaveCount(0);
      await expect(page.locator('[data-error-case="text"]')).toHaveText('请填写名称。');
      await expect(
        page.locator('[data-error-case="text"] .semi-form-field-validate-status-icon'),
      ).toHaveCount(1);
      await expect(page.locator('[data-error-case="array"]')).toHaveText('错误一, 错误二');
      await expect(page.locator('[data-error-case="help"]')).toHaveText('辅助说明');
      // 在原示例上重复错误→清除→错误→清除，检查实际 DOM 随状态变化而销毁。
      const dynamicError = page.locator('[data-error-case="dynamic"]');
      for (const action of ['显示错误', '清除错误', '显示错误', '清除错误']) {
        await page.getByRole('button', { name: action, exact: true }).click();
        await expect(dynamicError).toHaveText(action === '显示错误' ? '请填写名称。' : '');
        await expect(dynamicError.locator('.semi-form-field-error-message')).toHaveCount(
          action === '显示错误' ? 1 : 0,
        );
        await expect(dynamicError.locator('.semi-form-field-validate-status-icon')).toHaveCount(
          action === '显示错误' ? 1 : 0,
        );
      }
    }
    // 将图标与空区域一并纳入实时截图，旧 Form 基线保持不变。
    const reactScreenshot = await pair.react.page
      .getByTestId('form-error-message-cases')
      .screenshot({ animations: 'disabled' });
    const vueScreenshot = await pair.vue.page
      .getByTestId('form-error-message-cases')
      .screenshot({ animations: 'disabled' });
    await testInfo.attach(`error-message-reference-${theme}`, {
      body: reactScreenshot,
      contentType: 'image/png',
    });
    await testInfo.attach(`error-message-vue-${theme}`, {
      body: vueScreenshot,
      contentType: 'image/png',
    });
    await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
    expect(pair.react.runtimeErrors).toEqual([]);
    expect(pair.vue.runtimeErrors).toEqual([]);
  });
}
