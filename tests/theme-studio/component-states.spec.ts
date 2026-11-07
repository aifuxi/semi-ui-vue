import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';

/** 只描述本次编辑字段，完整主题文档仍来自应用的真实 JSON 下载。 */
interface ThemeFile {
  global: { mode: 'light' | 'dark' };
  overrides: Record<'light' | 'dark', Record<string, string>>;
}
/** 两种模式刻意使用不同颜色，使停留在上一模式或上一变量值的状态可被识别。 */
const palette = {
  light: {
    primary: 'rgb(29, 78, 216)',
    hover: 'rgb(15, 118, 110)',
    active: 'rgb(21, 94, 117)',
    focus: 'rgb(190, 18, 60)',
    disabled: 'rgb(100, 116, 139)',
    fill: 'rgb(226, 232, 240)',
  },
  dark: {
    primary: 'rgb(165, 180, 252)',
    hover: 'rgb(45, 212, 191)',
    active: 'rgb(34, 211, 238)',
    focus: 'rgb(251, 113, 133)',
    disabled: 'rgb(148, 163, 184)',
    fill: 'rgb(51, 65, 85)',
  },
};

/** 创建默认或完整预设场景，再通过公开品牌输入验证预设没有锁死主色。 */
async function prepare(page: Page, preset: boolean): Promise<ThemeFile> {
  await page.goto('/#/tokens');
  if (preset) {
    await page.getByRole('button', { name: '应用迭鹿预设', exact: true }).click();
    await page.getByRole('button', { name: '应用排版与前景', exact: true }).click();
    await page.getByRole('button', { name: '应用阴影与交互', exact: true }).click();
  }
  await page.getByRole('textbox', { name: '全局品牌 HEX', exact: true }).fill('#e8590c');
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    'rgb(232, 89, 12)',
  );
  await page.getByRole('button', { name: '导出', exact: true }).click();
  /** 先监听下载，文件由当前会话的公开导出入口生成。 */
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载 JSON', exact: true }).click();
  /** 完整文档包含当前预设及排版，只修改下面明确指定的状态变量。 */
  const download = await pending;
  const theme = JSON.parse(await readFile((await download.path())!, 'utf8')) as ThemeFile;
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: '主题预览', exact: true }).click();
  await page.getByRole('button', { name: '阴影与交互', exact: true }).click();
  return theme;
}

/** 通过 JSON 导入原子更新全局变量，保持当前悬浮、焦点或选择所在组件实例不变。 */
async function apply(page: Page, source: ThemeFile, dark: boolean, preset: boolean): Promise<void> {
  /** 每次从同一基线建立文档，避免上一次更新污染本次预期。 */
  const theme = structuredClone(source);
  /** 同时选择模式及其独立覆盖，不把深色值写入浅色文档。 */
  const mode = dark ? 'dark' : 'light';
  /** 当前模式的预期值与导入值共用测试色板。 */
  const colors = palette[mode];
  theme.global.mode = mode;
  Object.assign(theme.overrides[mode], {
    '--semi-color-primary': colors.primary,
    '--semi-color-primary-hover': colors.hover,
    '--semi-color-primary-active': colors.active,
    '--semi-color-primary-disabled': colors.fill,
    '--semi-color-primary-light-active': colors.focus,
    '--semi-color-focus-border': colors.focus,
    '--semi-color-success': colors.primary,
    '--semi-color-success-hover': colors.hover,
    '--semi-color-success-disabled': colors.fill,
    '--semi-color-disabled-text': colors.disabled,
    '--semi-color-disabled-fill': colors.fill,
    '--semi-color-fill-0': colors.fill,
    '--semi-color-fill-1': colors.hover,
  });
  if (preset)
    Object.assign(theme.overrides[mode], {
      '--studio-dielu-text-disabled': colors.disabled,
      '--studio-dielu-hover-border-color': colors.focus,
      '--studio-dielu-focus-border-color': colors.focus,
    });
  await page.locator('input[type=file]').setInputFiles({
    name: 'state-theme.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(theme)),
  });
  await expect(page.getByRole('status')).toHaveText('已导入主题');
  await expect(page.locator('.studio-shell')).toHaveAttribute('theme-mode', mode);
}

/** 通过真实键盘路径获得 focus-visible，不改 class 或模拟 CSS 伪状态。 */
async function focus(page: Page, target: Locator): Promise<void> {
  await target.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(target).toBeFocused();
}

/** 在可见禁用控件中心发送真实鼠标点击，不绕过 disabled 检查去调用组件事件。 */
async function clickDisabled(page: Page, target: Locator): Promise<void> {
  await expect(target).toBeVisible();
  /** 点击可见区域中心；原生 disabled 或组件禁用分支负责阻止修改。 */
  const box = (await target.boundingBox())!;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}

for (const preset of [false, true]) {
  /** 每种起点都经历浅→深→浅，不靠重新打开页面得到正确颜色。 */
  const prefix = preset ? '完整预设' : '默认主题';
  /** 悬浮状态跨更新保留，再用真实按下与键盘操作验证各自角色。 */
  test(`${prefix}按钮悬浮、按下、键盘焦点随全局状态变量更新`, async ({ page }) => {
    /** 公开下载的当前会话用于反复修改全局状态变量。 */
    const theme = await prepare(page, preset);
    /** 场景主按钮复用公开组件，三种鼠标状态应使用不同变量。 */
    const button = page.getByRole('button', { name: '主要按钮', exact: true });
    for (const dark of [false, true, false]) {
      const colors = palette[dark ? 'dark' : 'light'];
      await button.hover();
      await apply(page, theme, dark, preset);
      await expect(button).toHaveCSS('background-color', colors.hover);
      await page.mouse.down();
      await expect(button).toHaveCSS('background-color', colors.active);
      await page.mouse.up();
      await focus(page, button);
      await expect(button).toHaveCSS('outline-color', colors.focus);
      await expect(button).toHaveCSS('outline-width', '2px');
      // 工作台自身的键盘导航也使用全局焦点色。
      await focus(page, page.getByRole('link', { name: 'Theme Studio 首页', exact: true }));
      await expect(page.getByRole('link', { name: 'Theme Studio 首页', exact: true })).toHaveCSS(
        'outline-color',
        colors.focus,
      );
    }
  });

  /** 更新同一表单，不通过重建组件获得新样式。 */
  test(`${prefix}输入、选择、复选单选和开关保留状态并响应主题修改`, async ({ page }) => {
    /** 同一份公开文档用于反复更新，不重新挂载预览控件。 */
    const theme = await prepare(page, preset);
    /** 输入的焦点在原生 input，描边和填充在外层绘制。 */
    const input = page.getByRole('textbox', { name: '预览主题名称', exact: true });
    /** 对应当前输入框的可见容器。 */
    const wrapper = page.locator('.semi-input-wrapper').filter({ has: input });
    /** 已选中的三种原生控件用于检查选择状态及可见外层。 */
    const checkbox = page.getByRole('checkbox', { name: '保存当前模式', exact: true });
    /** 单选框保持当前主题的默认选择。 */
    const radio = page.getByRole('radio', { name: '使用当前主题', exact: true });
    /** 开关复用 success 语义色，与品牌角色分别更新。 */
    const toggle = page.getByRole('switch', { name: '预览启用主题', exact: true });
    for (const dark of [false, true, false]) {
      const colors = palette[dark ? 'dark' : 'light'];
      await input.hover();
      await apply(page, theme, dark, preset);
      // Semi 默认悬浮保持透明描边，前景预设才增加独立的悬浮描边。
      await expect(wrapper).toHaveCSS(
        'border-top-color',
        preset ? colors.focus : 'rgba(0, 0, 0, 0)',
      );
      await expect(wrapper).toHaveCSS('background-color', colors.hover);
      await input.click();
      await expect(wrapper).toHaveCSS('border-top-color', colors.focus);
      await input.fill('主题状态联动');
      await expect(input).toHaveValue('主题状态联动');
      await page.getByRole('heading', { name: '主题效果总览', exact: true }).click();
      await expect(checkbox).toBeChecked();
      await expect(radio).toBeChecked();
      await expect(toggle).toBeChecked();
      await expect(
        page
          .locator('.semi-checkbox')
          .filter({ has: checkbox })
          .locator('.semi-checkbox-inner-display'),
      ).toHaveCSS('background-color', colors.primary);
      await expect(
        page.locator('.semi-radio').filter({ has: radio }).locator('.semi-radio-inner-display'),
      ).toHaveCSS('border-top-color', colors.primary);
      await expect(page.locator('.semi-switch').filter({ has: toggle })).toHaveCSS(
        'background-color',
        colors.primary,
      );
      await checkbox.press('Space');
      await expect(checkbox).not.toBeChecked();
      await checkbox.press('Space');
      for (const target of [checkbox, radio, toggle]) {
        await focus(page, target);
        /** 焦点在原生 input，轮廓在可见 label 上绘制。 */
        const label = page
          .locator('.semi-checkbox, .semi-radio, .semi-switch')
          .filter({ has: target });
        /** Semi 默认在勾选图形上绘制轮廓，排版预设将其移到可见外层。 */
        const outline =
          !preset && target !== toggle
            ? label.locator('.semi-checkbox-inner-display, .semi-radio-inner-display')
            : label;
        await expect(outline).toHaveCSS('outline-color', colors.focus);
        await expect(outline).toHaveCSS('outline-width', '2px');
      }
      await page.getByRole('heading', { name: '主题效果总览', exact: true }).click();
    }
  });

  /** 禁用样式更新与阻止操作同时成立，不能只检查淡色外观。 */
  test(`${prefix}禁用控件和下拉选项保持禁用并同步对应样式`, async ({ page }) => {
    /** 当前主题快照保留预设，动态覆盖禁用角色。 */
    const theme = await prepare(page, preset);
    /** 禁用且选中，验证点击后不会被取消。 */
    const disabledCheckbox = page.getByRole('checkbox', { name: '禁用复选框', exact: true });
    /** 单选框的禁用前景与选择外观分开验证。 */
    const disabledRadio = page.getByRole('radio', { name: '禁用单选框', exact: true });
    /** 开关的禁用态仍保留选中值。 */
    const disabledSwitch = page.getByRole('switch', { name: '预览禁用开关', exact: true });
    for (const dark of [false, true, false]) {
      const colors = palette[dark ? 'dark' : 'light'];
      await apply(page, theme, dark, preset);
      for (const target of [disabledCheckbox, disabledRadio, disabledSwitch]) {
        await expect(target).toBeDisabled();
        await expect(target).toBeChecked();
        await clickDisabled(page, target);
        await expect(target).toBeChecked();
      }
      for (const selector of [
        '.semi-checkbox-disabled .semi-checkbox-addon',
        '.semi-radio-disabled .semi-radio-addon',
        '.semi-select-disabled .semi-select-selection-text',
      ])
        await expect(page.locator(selector).first()).toHaveCSS('color', colors.disabled);
      /** 禁用按钮允许悬浮，但不恢复普通文字颜色或点击能力。 */
      const button = page.getByRole('button', { name: '禁用按钮', exact: true });
      await button.hover();
      await expect(button).toBeDisabled();
      await expect(button).toHaveCSS('color', colors.disabled);
      await expect(page.getByRole('textbox', { name: '交互禁用输入', exact: true })).toBeDisabled();
      await expect(page.getByRole('textbox', { name: '交互禁用输入', exact: true })).toHaveCSS(
        'color',
        colors.disabled,
      );
      await page.getByRole('combobox', { name: '主题状态', exact: true }).click();
      /** 下拉项的 disabled 由 Select 自身处理，不能只检查原生 input。 */
      const option = page.getByRole('option').filter({ hasText: '已归档' });
      await expect(option).toHaveAttribute('aria-disabled', 'true');
      await option.hover();
      await expect(option).toHaveCSS('color', colors.disabled);
      await clickDisabled(page, option);
      await expect(page.getByRole('combobox', { name: '主题状态', exact: true })).toContainText(
        '草稿',
      );
      await page.getByRole('option').filter({ hasText: '已保存' }).click();
      await expect(page.getByRole('combobox', { name: '主题状态', exact: true })).toContainText(
        '已保存',
      );
      // 下一轮恢复同一公开选择状态，不重建预览。
      await page.getByRole('combobox', { name: '主题状态', exact: true }).click();
      await page.getByRole('option').filter({ hasText: '草稿' }).click();
    }
  });

  /** 行悬浮填充与复选框选择分开检查，禁用行不能参与选择。 */
  test(`${prefix}表格悬浮、选中和禁用行随全局主题同步`, async ({ page }) => {
    /** 表格选择状态不进入主题文件，导入后应保持原组件状态。 */
    const theme = await prepare(page, preset);
    /** 默认选中第一行，同时检查行悬浮填充。 */
    const row = page.locator('.semi-table-tbody .semi-table-row').filter({ hasText: '品牌颜色' });
    /** 第三行通过公开 rowSelection API 禁用选择。 */
    const disabledRow = page
      .locator('.semi-table-tbody .semi-table-row')
      .filter({ hasText: '组件圆角' });
    for (const dark of [false, true, false]) {
      const colors = palette[dark ? 'dark' : 'light'];
      await row.hover();
      await apply(page, theme, dark, preset);
      await expect(row.getByRole('checkbox')).toBeChecked();
      await expect(row.locator('.semi-checkbox-inner-display')).toHaveCSS(
        'background-color',
        colors.primary,
      );
      await expect(row.locator('.semi-table-row-cell').first()).toHaveCSS(
        'background-image',
        `linear-gradient(0deg, ${colors.fill}, ${colors.fill})`,
      );
      await expect(disabledRow.getByRole('checkbox')).toBeDisabled();
      await clickDisabled(page, disabledRow.getByRole('checkbox'));
      await expect(disabledRow.getByRole('checkbox')).not.toBeChecked();
      await row.getByRole('checkbox').press('Space');
      await expect(row.getByRole('checkbox')).not.toBeChecked();
      await row.getByRole('checkbox').press('Space');
    }
  });
}

/** 保持键盘焦点时修改当前主题，避免只验证重新聚焦后的样式。 */
test('已聚焦控件保持焦点并即时更新明暗模式的轮廓', async ({ page }) => {
  /** 完整预设曾固定焦点描边，作为更严格的动态更新起点。 */
  const theme = await prepare(page, true);
  /** 原生控件与工作台入口共同覆盖两种轮廓绘制位置。 */
  const targets = [
    page.getByRole('button', { name: '主要按钮', exact: true }),
    page.getByRole('checkbox', { name: '保存当前模式', exact: true }),
    page.getByRole('radio', { name: '使用当前主题', exact: true }),
    page.getByRole('switch', { name: '预览启用主题', exact: true }),
    page.getByRole('link', { name: 'Theme Studio 首页', exact: true }),
  ];
  for (const target of targets) {
    await focus(page, target);
    /** input 的轮廓在外层，按钮和链接在自身绘制。 */
    const outline = page
      .locator('.semi-checkbox, .semi-radio, .semi-switch')
      .filter({ has: target });
    /** 按实际 DOM 判断绘制位置，不改动控件实例或伪造焦点。 */
    const visible = (await outline.count()) ? outline : target;
    for (const dark of [false, true, false]) {
      await apply(page, theme, dark, true);
      await expect(target).toBeFocused();
      await expect(visible).toHaveCSS('outline-width', '2px');
      await expect(visible).toHaveCSS('outline-color', palette[dark ? 'dark' : 'light'].focus);
    }
  }
});
