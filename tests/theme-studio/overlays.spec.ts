import { expect, test, type Locator, type Page } from '@playwright/test';

/** 固定 Semi v2.102.0 的浅色/深色表面与正文颜色，不从被测节点反推预期。 */
const colors = {
  light: { popup: 'rgb(255, 255, 255)', modal: 'rgb(255, 255, 255)', text: 'rgb(28, 31, 35)' },
  dark: { popup: 'rgb(67, 68, 74)', modal: 'rgb(53, 54, 60)', text: 'rgb(249, 249, 249)' },
};

/** 只触发顶部全局开关的真实 DOM click，使自动关闭下拉和遮罩内浮层保持打开以验证同步。 */
async function mode(page: Page, dark: boolean): Promise<void> {
  await page.getByRole('switch', { name: '全局深色模式', exact: true }).evaluate(
    /** 不发送外侧 pointerdown，避免 clickOutside 关闭正在检查的同一浮层。 */
    (button, checked) => {
      if (button.getAttribute('aria-checked') !== String(checked))
        (button as HTMLButtonElement).click();
    },
    dark,
  );
  await expect(page.locator('.studio-shell')).toHaveAttribute(
    'theme-mode',
    dark ? 'dark' : 'light',
  );
}

/** 同一个正向浮层经历浅→深→浅，检查真实文字并确认未被重建。 */
async function follows(page: Page, surface: Locator, text: Locator, modal = false): Promise<void> {
  await expect(surface).toBeVisible();
  /** 记录已打开节点，防止关闭后重新打开碰巧满足样式断言。 */
  const original = await surface.elementHandle();
  for (const dark of [false, true, false]) {
    /** 每个模式的期待来自固定主题，Modal 使用 bg-2，其余浮层使用 bg-3。 */
    const palette = dark ? colors.dark : colors.light;
    await mode(page, dark);
    await expect(surface).toBeVisible();
    await expect(surface).toHaveCSS('background-color', modal ? palette.modal : palette.popup);
    await expect(text).toHaveCSS('color', palette.text);
    expect(
      await surface.evaluate(
        /** 切换模式更新当前 Portal，不能靠卸载再挂载规避同步问题。 */
        (element, previous) => element === previous,
        original,
      ),
    ).toBe(true);
  }
}

/** 全部现有 Select 消费入口，包括编辑器、主题表单与预览组件。 */
const selectCases = [
  { name: '全局方案' },
  { name: '引用其他变量' },
  { name: '对比背景', region: '颜色对比度检查' },
  { name: '主题分类' },
  { name: '全局字体', category: '字体排版' },
  { name: '局部方案', category: '局部主题' },
  { name: '局部字体', category: '局部主题' },
  { name: '主题状态', route: 'components', component: 'Select 选择器' },
];

for (const entry of selectCases) {
  /** 每个入口保持面板打开验证三次模式变化，并选择真实选项确认交互可用。 */
  test(`${entry.name}下拉的背景与选项文字实时同步全局主题`, async ({ page }) => {
    await page.goto(`/#/${entry.route ?? 'tokens'}`);
    if (entry.category)
      await page.getByRole('button', { name: entry.category, exact: true }).click();
    if (entry.component)
      await page.getByRole('button', { name: entry.component, exact: true }).click();
    /** 对比度 Select 位于具名区域中，避免由选中图标组成的动态名称影响定位。 */
    const trigger = entry.region
      ? page.getByRole('region', { name: entry.region, exact: true }).getByRole('combobox')
      : page.getByRole('combobox', { name: entry.name, exact: true });
    await trigger.click();
    /** Select 的选项通过默认 Popover Portal 展示，无装饰箭头。 */
    const popup = page.locator('.semi-popover-wrapper').filter({ has: page.getByRole('option') });
    await follows(page, popup, popup.locator('.semi-select-option').first());
    await expect(popup.locator('.semi-popover-icon-arrow')).toHaveCount(0);
    await popup.getByRole('option').first().click();
    await expect(popup).toHaveCount(0);
  });
}

for (const label of ['全局颜色选择器', '当前变量颜色选择器']) {
  /** 两个 ColorPicker 的面板、输入文字及嵌套格式下拉都需独立检查。 */
  test(`${label}及其格式菜单实时同步全局主题`, async ({ page }) => {
    await page.goto('/#/tokens');
    await page.getByRole('button', { name: label, exact: true }).click();
    /** 面板由 ColorPicker 自身的 Popover 承载，而非手工移动回工作台 DOM。 */
    const popup = page.locator('.semi-colorPicker-popover');
    await follows(page, popup, popup.locator('input').first());
    await expect(popup.locator('.semi-popover-icon-arrow')).toHaveCount(0);
    await popup.getByRole('combobox').click();
    /** 格式选项又进入一层默认 Portal，必须继续继承全局模式。 */
    const menu = page.locator('.semi-popover-wrapper').filter({ has: page.getByRole('option') });
    await follows(page, menu, menu.locator('.semi-select-option').first());
    await menu.getByRole('option').first().click();
    await expect(menu).toHaveCount(0);
    // 格式选择可能结束 hover 面板；用已存在的外侧标题关闭仍打开的点击面板。
    await page.getByRole('heading', { name: '品牌颜色', exact: true }).click();
    await expect(popup).toHaveCount(0);
  });
}

/** 主题表单、组件样例和导出对话框是不同的 Modal 消费入口。 */
const modalCases = [
  { name: 'global打开弹窗', text: '.quick-controls label' },
  { name: '预览模态框', text: '.semi-modal-body .semi-typography', component: true },
  { name: '导出', text: '.export-options h3' },
];
for (const entry of modalCases) {
  /** 检查遮罩内同一弹窗的背景、原生文字、标题及嵌套下拉。 */
  test(`${entry.name}弹窗及正文实时同步全局主题`, async ({ page }) => {
    await page.goto(`/#/${entry.component ? 'components' : 'tokens'}`);
    if (entry.component)
      await page.getByRole('button', { name: 'Modal 模态框', exact: true }).click();
    await page.getByRole('button', { name: entry.name, exact: true }).click();
    /** 标题/正文在 Modal 内容节点内，不能只检查继承到的 CSS 变量。 */
    const surface = page.locator('.semi-modal-content');
    await follows(page, surface, surface.locator(entry.text).first(), true);
    await expect(surface.locator('.semi-modal-title')).toHaveCSS('color', colors.light.text);
    if (entry.name === 'global打开弹窗') {
      await page.getByRole('combobox', { name: '弹窗品牌预设', exact: true }).click();
      /** Modal 中的 Select 仍通过默认 body Portal，而非直接继承对话框 DOM。 */
      const popup = page.locator('.semi-popover-wrapper').filter({ has: page.getByRole('option') });
      await follows(page, popup, popup.locator('.semi-select-option').first());
      await page.keyboard.press('Escape');
    }
    // 嵌套 Select 会消费 Escape，明确使用对话框自身关闭按钮。
    await surface.getByRole('button', { name: 'close', exact: true }).click();
    await expect(surface).toHaveCount(0);
  });
}

/** 普通 Tooltip 保留固定基线的反色设计，但背景、继承文字和箭头必须成对切换。 */
test('普通 Tooltip 在保持打开时同步明暗背景、文字和箭头', async ({ page }) => {
  await page.goto('/#/components');
  await page.getByRole('button', { name: 'Tooltip 提示', exact: true }).click();
  await page.getByRole('button', { name: '悬停查看提示', exact: true }).hover();
  /** Tooltip 直接文本继承 wrapper 颜色，没有普通 Typography 的正向前景。 */
  const tooltip = page.getByRole('tooltip');
  for (const dark of [false, true, false]) {
    /** Tooltip 使用 grey-7 背景和 bg-0 文字，这是固定 Semi 的反色配对。 */
    const background = dark ? 'rgb(198, 202, 205)' : 'rgb(65, 70, 76)';
    await mode(page, dark);
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveCSS('background-color', background);
    await expect(tooltip).toHaveCSS('color', dark ? 'rgb(22, 22, 26)' : 'rgb(255, 255, 255)');
    await expect(tooltip.locator('.semi-tooltip-icon-arrow')).toHaveCSS('color', background);
  }
});

/** 局部主题是用户显式配置的例外，不能被全局明暗开关意外覆盖。 */
test('独立局部气泡和弹窗保持自身模式，关闭边界后恢复全局继承', async ({ page }) => {
  await page.goto('/#/tokens');
  await page.getByRole('button', { name: '局部主题', exact: true }).click();
  await page.getByRole('button', { name: 'local主题提示', exact: true }).click();
  /** 局部主题默认深色，与全局初始浅色刻意不同。 */
  const popup = page
    .locator('.semi-popover-wrapper')
    .filter({ has: page.getByTestId('local-tooltip-text') });
  for (const dark of [false, true, false]) {
    await mode(page, dark);
    await expect(popup).toHaveCSS('background-color', colors.dark.popup);
    await expect(page.getByTestId('local-tooltip-text')).toHaveCSS('color', colors.dark.text);
    await expect(popup.locator('.semi-popover-icon-arrow path').nth(1)).toHaveCSS(
      'fill',
      colors.dark.popup,
    );
  }
  await page.getByRole('switch', { name: '启用独立局部边界', exact: true }).uncheck();
  await follows(page, popup, page.getByTestId('local-tooltip-text'));
  await page.getByRole('button', { name: '关闭提示', exact: true }).click();
  await page.getByRole('button', { name: 'local打开弹窗', exact: true }).click();
  /** 撤回局部边界后，局部表单弹窗也必须按全局明暗更新。 */
  const modal = page.locator('.semi-modal-content');
  await follows(
    page,
    modal,
    page.getByTestId('local-modal').locator('.semi-typography').first(),
    true,
  );
  await page.keyboard.press('Escape');
  await expect(modal).toHaveCount(0);
});
