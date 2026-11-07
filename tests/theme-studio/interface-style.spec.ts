import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

/** 按界面分类编辑真实全局变量，不直接修改组件或 DOM 样式。 */
async function edit(page: Page, category: string, name: string, value: string): Promise<void> {
  await page.getByRole('button', { name: '全局样式定制', exact: true }).click();
  await page
    .getByRole('navigation', { name: '设计变量分类', exact: true })
    .getByRole('button', { name: new RegExp(`^${category}`) })
    .click();
  await page.getByRole('textbox', { name: '搜索设计变量', exact: true }).fill(name);
  await page.getByRole('button', { name, exact: true }).click();
  await page.getByRole('textbox', { name: 'CSS 变量值', exact: true }).fill(value);
  await page.getByRole('button', { name: '应用变量', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
}

/** 统一打开包含所有已展示组件的总览，编辑器和其他路由继续共享同一会话。 */
async function overview(page: Page): Promise<void> {
  await page.getByRole('button', { name: '主题预览', exact: true }).click();
  await page.getByRole('button', { name: '组件总览', exact: true }).click();
}

for (const preset of [false, true]) {
  /** 两种起点均验证全局排版，避免预设重新锁死输入、选择、表格等组件。 */
  test(`${preset ? '应用排版预设后' : '默认主题下'}全局排版覆盖整个界面`, async ({ page }) => {
    await page.goto('/#/tokens');
    if (preset) await page.getByRole('button', { name: '应用排版与前景', exact: true }).click();
    await edit(page, '字体排版', '--semi-font-family-regular', 'Menlo, Consolas, monospace');
    await edit(page, '字体排版', '--semi-font-size-regular', '16px');
    await edit(page, '字体排版', '--semi-line-height-regular', '24px');
    await edit(page, '字体排版', '--semi-font-size-small', '14px');
    await edit(page, '字体排版', '--semi-font-weight-strong', '700');
    await expect(page.locator('.studio-wordmark')).toHaveCSS(
      'font-family',
      'Menlo, Consolas, monospace',
    );
    await expect(page.locator('.panel-heading h2').first()).toHaveCSS('font-size', '16px');
    await expect(page.locator('.rail-label')).toHaveCSS('font-size', '14px');
    await overview(page);
    for (const selector of [
      '.gallery-section h3',
      '.semi-input-default',
      '.semi-select-selection',
      '.semi-checkbox',
      '.semi-radio',
      '.semi-table-row-cell',
      '.semi-button',
      '.semi-card-body',
    ]) {
      /** 同一全局正文角色应在不同实际组件上渲染为 16px。 */
      const element = page.getByTestId('component-gallery').locator(selector).first();
      await expect(element).toHaveCSS('font-size', '16px');
      await expect(element).toHaveCSS('font-family', 'Menlo, Consolas, monospace');
    }
    await expect(page.locator('.semi-checkbox-addon').first()).toHaveCSS('line-height', '24px');
    await expect(page.locator('.semi-table-row-head').first()).toHaveCSS('font-weight', '700');
    await expect(page.getByTestId('component-gallery').locator('.semi-tag').first()).toHaveCSS(
      'font-size',
      '14px',
    );
    await expect(
      page.getByRole('textbox', { name: '预览主题名称', exact: true }).locator('..'),
    ).toHaveCSS('height', '32px');
    // 组件覆盖是显式优先级，不能被后续全局编辑抹掉。
    await page.getByRole('button', { name: '组件样式定制', exact: true }).click();
    await page.getByRole('button', { name: 'Button 按钮', exact: true }).click();
    await page.getByRole('button', { name: '编辑按钮字号', exact: true }).click();
    await page.getByRole('textbox', { name: 'CSS 变量值', exact: true }).fill('19px');
    await page.getByRole('button', { name: '应用变量', exact: true }).click();
    await edit(page, '字体排版', '--semi-font-size-regular', '17px');
    await expect(page.getByTestId('global-primary')).toHaveCSS('font-size', '19px');
    await expect(page.getByTestId('global-text')).toHaveCSS('font-size', '17px');
  });
}

/** 公共语义色影响对应角色，选中、禁用与校验状态保持各自规则。 */
test('颜色与状态变量同步导航、表单、选择控件、卡片、表格和进度', async ({ page }) => {
  await page.goto('/#/tokens');
  for (const [name, value] of [
    ['--semi-color-primary', '#e8590c'],
    ['--semi-color-text-0', '#334155'],
    ['--semi-color-bg-0', '#fef3c7'],
    ['--semi-color-fill-0', '#dbeafe'],
    ['--semi-color-border', '#d97706'],
    ['--semi-color-success', '#0f766e'],
    ['--semi-color-disabled-text', '#6b7280'],
  ])
    await edit(page, '色盘', name!, value!);
  await expect(page.locator('.studio-wordmark > .semi-icon')).toHaveCSS(
    'color',
    'rgb(232, 89, 12)',
  );
  await expect(page.locator('.studio-editor')).toHaveCSS('color', 'rgb(51, 65, 85)');
  await overview(page);
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    'rgb(232, 89, 12)',
  );
  await expect(
    page.locator('.semi-checkbox-inner-checked .semi-checkbox-inner-display').first(),
  ).toHaveCSS('background-color', 'rgb(232, 89, 12)');
  await expect(
    page.locator('.semi-radio-inner-checked .semi-radio-inner-display').first(),
  ).toHaveCSS('border-top-color', 'rgb(232, 89, 12)');
  for (const selector of [
    '.semi-input',
    '.semi-select-selection-text',
    '.semi-checkbox-addon',
    '.semi-radio-addon',
    '.semi-table-row-cell',
    '.semi-card-header',
  ])
    await expect(page.getByTestId('component-gallery').locator(selector).first()).toHaveCSS(
      'color',
      'rgb(51, 65, 85)',
    );
  await expect(page.locator('.semi-card').first()).toHaveCSS(
    'background-color',
    'rgb(254, 243, 199)',
  );
  await expect(page.locator('.semi-card').first()).toHaveCSS(
    'border-top-color',
    'rgb(217, 119, 6)',
  );
  await expect(page.locator('.semi-progress-track').first()).toHaveCSS(
    'background-color',
    'rgb(219, 234, 254)',
  );
  await expect(page.locator('.semi-progress-track-inner').first()).toHaveCSS(
    'background-color',
    'rgb(15, 118, 110)',
  );
  await expect(page.getByTestId('global-card').locator('.semi-switch')).toHaveCSS(
    'background-color',
    'rgb(15, 118, 110)',
  );
  await expect(
    page.getByTestId('global-card').getByRole('button', { name: '已归档', exact: true }),
  ).toHaveCSS('color', 'rgb(107, 114, 128)');
});

/** 迁移前景角色必须同时覆盖自有界面与组件中的真实文字节点。 */
test('预设前景编辑同步外壳、复选单选、选择器和表格', async ({ page }) => {
  await page.goto('/#/tokens');
  await page.getByRole('button', { name: '应用排版与前景', exact: true }).click();
  await edit(page, '色盘', '--studio-dielu-text-primary', '#334155');
  await expect(page.locator('.studio-editor')).toHaveCSS('color', 'rgb(51, 65, 85)');
  await overview(page);
  for (const selector of [
    '.semi-input',
    '.semi-checkbox-addon',
    '.semi-radio-addon',
    '.semi-table-row-cell',
    '.semi-select-selection-text',
    '.semi-card-header',
  ])
    await expect(page.getByTestId('component-gallery').locator(selector).first()).toHaveCSS(
      'color',
      'rgb(51, 65, 85)',
    );
});

/** 共享尺寸角色控制编辑器和预览的对应位置，组件固定高度继续独立。 */
test('圆角、间距与阴影同步工作台及对应组件', async ({ page }) => {
  await page.goto('/#/tokens');
  await edit(page, '圆角', '--semi-border-radius-medium', '13px');
  await edit(page, '圆角', '--semi-border-radius-small', '7px');
  await edit(page, '间距', '--studio-spacing-loose', '30px');
  await edit(page, '间距', '--studio-spacing-tight', '10px');
  await expect(page.locator('.studio-editor')).toHaveCSS('padding-top', '30px');
  await expect(page.getByTestId('global-scope')).toHaveCSS('border-top-left-radius', '13px');
  await expect(page.locator('.header-actions')).toHaveCSS('column-gap', '10px');
  await expect(page.locator('.workspace-toolbar')).toHaveCSS('padding-left', '34px');
  await expect(page.getByTestId('global-primary')).toHaveCSS('border-top-left-radius', '7px');
  await overview(page);
  await expect(page.locator('.semi-card').first()).toHaveCSS('border-top-left-radius', '13px');
  await expect(page.locator('.semi-tag').first()).toHaveCSS('border-top-left-radius', '7px');
  await expect(page.locator('.semi-checkbox').first()).toHaveCSS('column-gap', '10px');
  await expect(page.locator('.semi-radio').first()).toHaveCSS('column-gap', '10px');
  await expect(page.getByTestId('global-scope')).toHaveCSS('padding-top', '30px');
  await edit(page, '阴影', '--semi-shadow-elevated', '0 2px 8px rgba(0, 0, 0, 0.2)');
  await page.getByRole('button', { name: '保存草稿', exact: true }).click();
  await expect(page.getByRole('status')).toHaveCSS(
    'box-shadow',
    'rgba(0, 0, 0, 0.2) 0px 2px 8px 0px',
  );
});

/** 旧文件只升级与生成预设完全一致的默认字符串，自定义组件排版必须原样保留。 */
test('旧版预设文件导入后可继续全局编辑且保留手工排版', async ({ page }) => {
  await page.goto('/#/tokens');
  await page.getByRole('button', { name: '应用排版与前景', exact: true }).click();
  await page.getByRole('button', { name: '导出', exact: true }).click();
  /** 只读取当前应用通过公开下载入口生成的文档。 */
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载 JSON', exact: true }).click();
  /** 下载结果是当前已支持的版本 1 结构，仅改本测试涉及的两个覆盖值。 */
  const file = await pending;
  const document = JSON.parse(await readFile((await file.path())!, 'utf8'));
  document.overrides.light['--studio-dielu-checkbox-font'] =
    '14px/20px var(--semi-font-family-regular)';
  document.overrides.light['--studio-dielu-table-font'] = '500 19px/27px monospace';
  await page.keyboard.press('Escape');
  await page.locator('input[type=file]').setInputFiles({
    name: 'legacy-theme.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(document)),
  });
  await expect(page.getByRole('status')).toHaveText('已导入主题');
  await edit(page, '字体排版', '--semi-font-size-regular', '16px');
  await overview(page);
  await expect(page.locator('.semi-checkbox').first()).toHaveCSS('font-size', '16px');
  await expect(page.locator('.semi-table-wrapper')).toHaveCSS('font-size', '19px');
  await expect(page.locator('.semi-table-wrapper')).toHaveCSS('line-height', '27px');
});
