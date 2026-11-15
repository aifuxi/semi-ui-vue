import { expect, test } from './fixtures';

// 直接接续鼠标或键盘选择，不先等待模型，检查业务快速提交是否捕获旧值。
for (const input of ['mouse', 'keyboard'] as const) {
  // 默认动效继续播放，测试通过公开提交按钮读取模型。
  test(`Select ${input} 默认动效选择后立即提交仍使用所选角色`, async ({
    page,
    packedConsumer,
  }, testInfo) => {
    await page.goto(`${packedConsumer.url}?select-model`);
    /** 鼠标和键盘共享公开可访问名称，触发同一个 Select 实例。 */
    const trigger = page.getByRole('combobox', { name: '申请角色' });
    await trigger.click();
    if (input === 'mouse') {
      await page.getByRole('option', { name: '编辑', exact: false }).click();
    } else {
      await trigger.press('ArrowDown');
      await trigger.press('Enter');
    }
    await page.getByRole('button', { name: '提交申请' }).click();
    await expect(page.getByTestId('select-submitted')).toHaveText('EDITOR');
    await page.screenshot({ path: testInfo.outputPath('select-editor-immediate-submitted.png') });
  });
}

// 两种实际表单写法均覆盖默认动效与显式关闭动效，避免替身掩盖模型断链。
for (const wrap of ['label', 'aria'] as const) {
  for (const motion of ['default', 'none'] as const) {
    // 用真实 Chromium 点击选项，再用业务提交读取公开模型。
    test(`Select ${wrap}/${motion} 真实包 v-model 与提交角色一致`, async ({
      page,
      packedConsumer,
    }, testInfo) => {
      await page.goto(
        `${packedConsumer.url}?select-model${wrap === 'label' ? '&label-wrap' : ''}${motion === 'none' ? '&no-motion' : ''}`,
      );
      await testInfo.attach('packed-consumer-provenance', {
        body: JSON.stringify(packedConsumer.provenance, null, 2),
        contentType: 'application/json',
      });
      /** 公开可访问名称定位真实触发器，不依赖内部选择状态。 */
      const trigger = page.getByRole('combobox', { name: '申请角色' });
      await expect(page.getByTestId('select-model')).toHaveText('READER');
      await trigger.click();
      await page.getByRole('option', { name: '编辑', exact: false }).click();
      await expect(page.getByTestId('select-model')).toHaveText('EDITOR');
      await expect(trigger).toContainText('编辑');
      await page.getByRole('button', { name: '提交申请' }).click();
      await expect(page.getByTestId('select-submitted')).toHaveText('EDITOR');
      await page.screenshot({ path: testInfo.outputPath('select-editor-submitted.png') });
      // 连续选择包含退场尚未结束时的重开，不等待旧菜单移除。
      await trigger.click();
      await page.getByRole('option', { name: '阅读', exact: false }).click();
      await expect(page.getByTestId('select-model')).toHaveText('READER');
      await page.getByRole('button', { name: '提交申请' }).click();
      await expect(page.getByTestId('select-submitted')).toHaveText('READER');
      // Foundation 每次打开从首项开始，ArrowDown 后 Enter 应选择第二项。
      await trigger.click();
      await trigger.press('ArrowDown');
      await trigger.press('Enter');
      await expect(page.getByTestId('select-model')).toHaveText('EDITOR');
    });
  }
}
