import { expect, test } from '@playwright/test';

for (const [routeLocale, demoLocale] of [
  ['zh-cn', 'zh-CN'],
  ['en-us', 'en-US'],
] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Upload 文档：${routeLocale} ${theme} 手动上传与大小校验`, async ({ page }) => {
      await page.addInitScript((value) => localStorage.setItem('semi-docs-theme', value), theme);
      const errors: string[] = [];
      const uploads: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('request', (request) => {
        if (request.method() !== 'GET') uploads.push(request.url());
      });
      await page.goto(`/${routeLocale}/components/upload/`);
      await expect(page.locator('[data-demo-id]')).toHaveCount(42);
      await expect(page.locator('.demo-loading')).toHaveCount(0);
      await expect(page.locator('.demo-error')).toHaveCount(0);
      const png = await page.evaluate(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 80;
        canvas.getContext('2d')!.fillRect(0, 0, 100, 80);
        return canvas.toDataURL('image/png').split(',')[1]!;
      });
      const file = {
        name: 'local-demo.png',
        mimeType: 'image/png',
        buffer: Buffer.from(png, 'base64'),
      };
      const manual = page.locator(`[data-demo-id="upload/${demoLocale}/Manual"]`);
      await manual.locator('input.semi-upload-hidden-input').setInputFiles(file);
      await expect(manual.locator('.semi-upload-file-card')).toContainText('local-demo.png');
      await expect(manual.getByRole('status')).toBeEmpty();
      await manual
        .getByRole('button', {
          name: routeLocale === 'zh-cn' ? /开始上传$/ : /Start upload$/,
        })
        .click();
      await expect(manual.getByRole('status')).toHaveText(
        routeLocale === 'zh-cn' ? '上传成功' : 'Upload succeeded',
      );

      const size = page.locator(`[data-demo-id="upload/${demoLocale}/SizeLimit"]`);
      await size.locator('input.semi-upload-hidden-input').setInputFiles(file);
      await expect(size.getByRole('status')).toContainText('size invalid');
      const single = page.locator(`[data-demo-id="upload/${demoLocale}/SingleLimit"]`);
      await single.locator('input.semi-upload-hidden-input').setInputFiles(file);
      await single
        .locator('input.semi-upload-hidden-input')
        .setInputFiles({ ...file, name: 'second.png' });
      await expect(single.getByRole('status')).toContainText('1');
      await expect(single.locator('.semi-upload-file-card')).toHaveCount(1);
      expect(errors).toEqual([]);
      expect(uploads).toEqual([]);
    });
  }

  test(`Upload 文档：${routeLocale} 裁切确认、取消及错误恢复`, async ({ page }) => {
    await page.goto(`/${routeLocale}/components/upload/`);
    await expect(page.locator('.demo-loading')).toHaveCount(0);
    const png = await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 160;
      canvas.height = 100;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#1677ff';
      ctx.fillRect(0, 0, 160, 100);
      return canvas.toDataURL('image/png').split(',')[1]!;
    });
    const file = {
      name: 'crop-demo.png',
      mimeType: 'image/png',
      buffer: Buffer.from(png, 'base64'),
    };
    const crop = page.locator(`[data-demo-id="upload/${demoLocale}/CropBasic"]`);
    await crop.locator('input.semi-upload-hidden-input').setInputFiles(file);
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('.semi-cropper')).toBeVisible();
    await dialog.locator('.semi-modal-footer button').last().click();
    await expect(dialog).toBeHidden();
    await expect(crop.getByRole('status')).toHaveText(
      routeLocale === 'zh-cn' ? '上传成功' : 'Upload succeeded',
    );
    await crop
      .locator('input.semi-upload-hidden-input')
      .setInputFiles({ ...file, name: 'cancel-demo.png' });
    await expect(dialog).toBeVisible();
    await dialog.locator('.semi-modal-footer button').first().click();
    await expect(dialog).toBeHidden();
    await expect(crop.locator('.semi-upload-file-card')).toHaveCount(1);

    const validate = page.locator(`[data-demo-id="upload/${demoLocale}/AsyncBeforeUpload"]`);
    for (const i of [1, 2, 3]) {
      await validate
        .locator('input.semi-upload-hidden-input')
        .setInputFiles({ ...file, name: `validation-${i}.png` });
    }
    await expect(validate.locator('.semi-upload-file-card')).toHaveCount(3);
    await expect(validate).toContainText(
      routeLocale === 'zh-cn' ? '第 1 个注定失败' : 'File 1 is rejected',
    );
    await expect(validate).toContainText(
      routeLocale === 'zh-cn' ? '第 2 个注定失败' : 'File 2 is rejected',
    );
    await expect(validate.locator('.semi-upload-file-card').last()).toContainText(
      'validation-3.png',
    );
    await expect(
      validate.locator('.semi-upload-file-card').last().getByRole('progressbar'),
    ).toBeHidden();
    await expect(validate.locator('.semi-upload-file-card').last()).not.toHaveClass(
      /semi-upload-file-card-fail/,
    );
    await expect(page.locator('.demo-error')).toHaveCount(0);
  });
}
