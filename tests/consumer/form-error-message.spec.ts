import { expect, test } from './fixtures';

for (const theme of ['light', 'dark'] as const) {
  // 使用真实 tarball 安装的生产包复验，避免源码测试通过但发布编译仍错误转换空串。
  test(`真实 tarball 的 Form.ErrorMessage 保留空错误和布尔错误契约：${theme}`, async ({
    page,
    packedConsumer,
  }, testInfo) => {
    // 保留安装目录、tarball 哈希与实际 bundle 模块来源，fixture 会拒绝混入 workspace 源码。
    await testInfo.attach('form-error-message-package-origin', {
      body: JSON.stringify(packedConsumer.provenance, null, 2),
      contentType: 'application/json',
    });
    await page.goto(packedConsumer.url);
    // 仅切换公开默认主题入口，不注入修正样式或改变传入的错误值。
    await page.evaluate((mode) => document.body.setAttribute('theme-mode', mode), theme);
    for (const id of ['undefined', 'false', 'empty', 'dynamic']) {
      // 宿主存在，而内部错误区域和图标都应完全不渲染。
      const target = page.locator(`[data-packed-error="${id}"]`);
      await expect(target).toBeAttached();
      await expect(target).toHaveText('');
      await expect(target.locator('.semi-form-field-error-message')).toHaveCount(0);
      await expect(target.locator('.semi-form-field-validate-status-icon')).toHaveCount(0);
    }
    // 布尔 true 保留原版空容器语义，不应被当成文本或图标。
    const booleanError = page.locator('[data-packed-error="true"]');
    await expect(booleanError.locator('.semi-form-field-error-message')).toHaveCount(1);
    await expect(booleanError).toHaveText('');
    await expect(booleanError.locator('.semi-form-field-validate-status-icon')).toHaveCount(0);
    // 再次出错与再次清除都通过实际按钮更新生产组件。
    const dynamic = page.locator('[data-packed-error="dynamic"]');
    for (const visible of [true, false, true, false]) {
      await page
        .getByRole('button', {
          name: visible ? 'Packed show error' : 'Packed clear error',
          exact: true,
        })
        .click();
      await expect(dynamic).toHaveText(visible ? '请填写名称。' : '');
      await expect(dynamic.locator('.semi-form-field-error-message')).toHaveCount(visible ? 1 : 0);
      await expect(dynamic.locator('.semi-form-field-validate-status-icon')).toHaveCount(
        visible ? 1 : 0,
      );
    }
  });
}
