import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';

/** 从界面应用同一个增量预设，保持品牌与填充独立。 */
async function applyTypography(page: Page): Promise<void> {
  await page.goto('/#/tokens');
  await page.getByRole('button', { name: '应用排版与前景', exact: true }).click();
}

/** 真实键盘返回目标，确保 :focus-visible 来自键盘输入模式。 */
async function keyboardFocus(page: Page, target: Locator): Promise<void> {
  await target.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(target).toBeFocused();
}

/** 独立于实现的来源角色预期：字号(px)、最终行高(px)、字重。 */
const roles: [string, number, number, number][] = [
  ['title', 24, 32, 600],
  ['section', 16, 24, 600],
  ['subsection', 14, 20, 600],
  ['label', 14, 20, 500],
  ['body', 14, 20, 400],
  ['body-small', 13, 20, 400],
  ['caption', 12, 16, 400],
  ['meta', 11, 16, 400],
  ['code', 13, 22, 400],
  ['reading', 16, 28.8, 400],
  ['document-title', 32, 44, 600],
  ['document-h1', 28, 39.2, 600],
  ['document-h2', 24, 33.6, 600],
  ['document-h3', 20, 28, 600],
];

/** 角色不是静态说明卡，必须由当前可编辑主题实际渲染；窄屏保留来源 640px 断点。 */
test('完整排版角色支持明暗、窄屏和变量编辑', async ({ page }) => {
  await applyTypography(page);
  await page.getByRole('button', { name: '字体排版', exact: true }).click();
  for (const [name, size, height, weight] of roles) {
    /** 样本使用来源角色类，读浏览器最终属性。 */
    const sample = page.getByTestId(`type-${name}`);
    await expect(sample).toHaveCSS('font-size', `${size}px`);
    await expect(sample).toHaveCSS('line-height', `${height}px`);
    await expect(sample).toHaveCSS('font-weight', `${weight}`);
    await expect(sample).toHaveCSS(
      'font-family',
      name === 'code' ? /JetBrains Mono/ : /Space Grotesk/,
    );
  }
  await page.getByRole('switch', { name: '全局深色模式', exact: true }).check();
  await expect(page.getByTestId('type-label')).toHaveCSS('font-weight', '500');
  await page.setViewportSize({ width: 640, height: 1000 });
  await expect(page.getByTestId('type-document-title')).toHaveCSS('font-size', '24px');
  await expect(page.getByTestId('type-document-title')).toHaveCSS('line-height', '32px');
  await page.setViewportSize({ width: 641, height: 1000 });
  await expect(page.getByTestId('type-document-title')).toHaveCSS('font-size', '32px');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page
    .getByRole('textbox', { name: '搜索设计变量', exact: true })
    .fill('--studio-dielu-type-caption');
  await page
    .getByRole('region', { name: '设计变量列表', exact: true })
    .getByRole('button', { name: '--studio-dielu-type-caption', exact: true })
    .click();
  await page
    .getByRole('textbox', { name: 'CSS 变量值', exact: true })
    .fill('500 15px/24px var(--semi-font-family-regular)');
  await page.getByRole('button', { name: '应用变量', exact: true }).click();
  await expect(page.getByTestId('type-caption')).toHaveCSS('font-size', '15px');
  await page.getByRole('button', { name: '撤销修改', exact: true }).click();
  await expect(page.getByTestId('type-caption')).toHaveCSS('font-size', '12px');
  await page.getByRole('button', { name: '主题预览', exact: true }).click();
  await page.getByRole('button', { name: '文字排版', exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByTestId('type-document-title')).toHaveCSS('font-size', '24px');
  expect(
    await page.evaluate(
      /** 长拉丁字词和标题不得引起手机页面横向溢出。 */
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

/** 组件保留原有几何与公开便捷设置，迁移只接管来源文字规则。 */
test('组件文字适配保留输入尺寸并响应按钮单项编辑', async ({ page }) => {
  await page.goto('/#/components');
  await page.getByRole('button', { name: 'Input 输入框', exact: true }).click();
  /** 三个真实公开尺寸在应用预设前后的高度应一致。 */
  const heights = await page
    .getByTestId('component-gallery')
    .locator('.semi-input-wrapper')
    .evaluateAll(
      /** 不把文字行高当作控件高度。 */
      (elements) =>
        elements.map(
          /** 只比较公开可观察的控件边界高度。 */
          (element) => element.getBoundingClientRect().height,
        ),
    );
  await page.getByRole('button', { name: '应用排版与前景', exact: true }).click();
  await expect(page.getByRole('textbox', { name: '预览小号输入', exact: true })).toHaveCSS(
    'line-height',
    '22px',
  );
  await expect(page.getByRole('textbox', { name: '预览主题名称', exact: true })).toHaveCSS(
    'line-height',
    '30px',
  );
  await expect(page.getByRole('textbox', { name: '预览大号输入', exact: true })).toHaveCSS(
    'line-height',
    '38px',
  );
  await expect(page.getByRole('textbox', { name: '预览大号输入', exact: true })).toHaveCSS(
    'font-size',
    '16px',
  );
  expect(
    await page
      .getByTestId('component-gallery')
      .locator('.semi-input-wrapper')
      .evaluateAll(
        /** 与迁移前同一组输入比较，避免检查替代场景。 */
        (elements) =>
          elements.map(
            /** 字体变化不能改变既有尺寸。 */
            (element) => element.getBoundingClientRect().height,
          ),
      ),
  ).toEqual(heights);
  await page.getByRole('button', { name: 'Button 按钮', exact: true }).click();
  /** 使用组件编辑器选择公开字号，检查迁移后仍可继续设计。 */
  const button = page
    .getByTestId('component-gallery')
    .getByRole('button', { name: '主要按钮', exact: true });
  await expect(button).toHaveCSS('font-size', '14px');
  await expect(button).toHaveCSS('font-weight', '600');
  await page.getByRole('button', { name: '编辑按钮字号', exact: true }).click();
  await page.getByRole('textbox', { name: 'CSS 变量值', exact: true }).fill('18px');
  await page.getByRole('button', { name: '应用变量', exact: true }).click();
  await expect(button).toHaveCSS('font-size', '18px');

  await page.getByRole('button', { name: 'Select 选择器', exact: true }).click();
  await page.getByRole('combobox', { name: '主题状态', exact: true }).click();
  await expect(page.locator('.semi-select-option-selected')).toHaveCSS('font-weight', '600');
});

/** 深浅模式轮廓跟随各自焦点色，原生 input 的焦点须绘制在可见容器上。 */
for (const dark of [false, true]) {
  /** 每种模式独立创建会话，既验证键盘模式也验证鼠标不触发轮廓。 */
  test(`${dark ? '深色' : '浅色'}键盘轮廓覆盖按钮、开关、复选与单选`, async ({ page }) => {
    await applyTypography(page);
    await page.getByRole('button', { name: '组件样式定制', exact: true }).click();
    await page.getByRole('switch', { name: '全局深色模式', exact: true }).setChecked(dark);
    /** 按钮在可访问原生节点上绘制轮廓。 */
    const button = page
      .getByTestId('component-gallery')
      .getByRole('button', { name: '主要按钮', exact: true });
    await button.click();
    await expect(button).not.toHaveCSS('outline-width', '2px');
    await keyboardFocus(page, button);
    await expect(button).toHaveCSS('outline-width', '2px');
    await expect(button).toHaveCSS('outline-offset', '2px');
    await expect(button).toHaveCSS(
      'outline-color',
      dark ? 'rgb(84, 169, 255)' : 'rgb(0, 100, 250)',
    );

    await page.getByRole('button', { name: 'Input 输入框', exact: true }).click();
    for (const [role, name, selector] of [
      ['checkbox', '保存当前模式', '.semi-checkbox'],
      ['switch', '预览启用主题', '.semi-switch'],
      ['radio', '使用当前主题', '.semi-radio'],
    ] as const) {
      /** 原生焦点节点与绘制节点分别定位，不能只检查 focus-visible 布尔值。 */
      const input = page.getByTestId('component-gallery').getByRole(role, { name, exact: true });
      /** 场景也包含禁用样本，用原生焦点节点确定对应可见外层。 */
      const wrapper = page
        .getByTestId('component-gallery')
        .locator(selector)
        .filter({ has: page.getByRole(role, { name, exact: true }) });
      await keyboardFocus(page, input);
      await expect(wrapper).toHaveCSS('outline-width', '2px');
      await expect(wrapper).toHaveCSS('outline-offset', '2px');
      await expect(wrapper).toHaveCSS('outline-style', 'solid');
    }
  });
}

/** CSS 的响应式角色必须在独立消费者中生效，不能只在工作台页面看起来正确。 */
test('导出 CSS 在独立页面保留角色、断点和局部隔离', async ({ page, context }) => {
  await applyTypography(page);
  await page.getByRole('button', { name: '导出', exact: true }).click();
  /** 先监听快速 Blob 下载，再触发界面动作。 */
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载 CSS', exact: true }).click();
  /** 测试读取真实下载产物，不调用应用内部方法。 */
  const download = await pending;
  /** Playwright 管理本次下载文件。 */
  const path = await download.path();
  expect(path).not.toBeNull();
  /** 独立消费者同时加载公开默认主题和工作台导出覆盖。 */
  const [css, base] = await Promise.all([
    readFile(path!, 'utf8'),
    readFile('packages/theme-default/dist/index.css', 'utf8'),
  ]);
  /** 新页面没有 Vue 状态或工作台样式，验证 CSS 交付件的真实能力。 */
  const consumer = await context.newPage();
  await consumer.setContent(
    `<style>${base}</style><style>${css}</style><section class="theme-studio-theme" theme-mode="light"><p class="dielu-type-document-title" id="title">Theme Studio</p><p class="dielu-type-caption" id="caption">主题说明</p><section data-semi-theme="studio-local"><p class="dielu-type-caption" id="local">局部说明</p></section></section>`,
  );
  await expect(consumer.locator('#title')).toHaveCSS('font-size', '32px');
  await expect(consumer.locator('#caption')).toHaveCSS('font-size', '12px');
  await expect(consumer.locator('#local')).not.toHaveCSS('font-size', '12px');
  await consumer.setViewportSize({ width: 390, height: 844 });
  await expect(consumer.locator('#title')).toHaveCSS('font-size', '24px');
  await expect(consumer.locator('#title')).toHaveCSS('line-height', '32px');
});
