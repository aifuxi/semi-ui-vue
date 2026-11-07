import { expect, test, type Page } from '@playwright/test';
import { generateColorScale } from '../../packages/theme-default/colors/palette.mjs';

/** 固定 Semi v2.102.0 默认主色；绝不以生成器重算默认色盘。 */
const baselinePrimary = { light: 'rgb(0, 100, 250)', dark: 'rgb(84, 169, 255)' };
/** 每个页面独立记录异常，测试结束后检查整个交互周期。 */
const pageErrors = new WeakMap<Page, string[]>();

/** 生成器只为用户选择的自定义品牌提供颜色预期值。 */
function primary(brand: string, mode: 'light' | 'dark'): string {
  /** 第五级为默认 primary 语义，通道表达与浏览器 computed style 一致。 */
  const hex = generateColorScale(brand, { mode })[5];
  /** 每个通道在规范化 HEX 中占两位。 */
  const channels = [1, 3, 5].map(
    /** 按 RGB 顺序读取生成结果，不复制颜色生成算法。 */
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16),
  );
  return `rgb(${channels.join(', ')})`;
}

/** 通过库 Select 的公开组合框和选项语义选择方案，不操作私有组件状态。 */
async function choose(page: Page, label: string, option: string): Promise<void> {
  await page.getByRole('combobox', { name: label, exact: true }).click();
  // 选中图标也参与可访问名称，因此匹配公开选项中的精确文字内容。
  await page
    .getByRole('option')
    .filter({ has: page.getByText(option, { exact: true }) })
    .click();
}

/** 编辑库 InputNumber 的真实输入，并通过失焦提交数值。 */
async function number(page: Page, label: string, value: number): Promise<void> {
  /** 只使用公开的 spinbutton 可访问名称定位数值字段。 */
  const input = page.getByRole('spinbutton', { name: label, exact: true });
  await input.fill(String(value));
  await input.press('Tab');
}

/** 比较全局主题所有权，忽略 Modal 正常的滚动锁属性。 */
async function rootTheme(page: Page) {
  return page.locator('body').evaluate(
    /** 工作台只能更改预览边界，不能污染 body 或 html。 */
    (body) => ({
      mode: body.getAttribute('theme-mode'),
      scope: body.getAttribute('data-semi-theme'),
      primary: body.style.getPropertyValue('--semi-color-primary'),
      fontSize: body.style.getPropertyValue('--semi-font-size-regular'),
      htmlMode: document.documentElement.getAttribute('theme-mode'),
    }),
  );
}

/** 固定对照在品牌、模式、共享排版和组件覆盖变化后都保持默认值。 */
async function expectBaseline(page: Page): Promise<void> {
  await expect(page.getByTestId('baseline-primary')).toHaveCSS(
    'background-color',
    baselinePrimary.light,
  );
  await expect(page.getByTestId('baseline-primary')).toHaveCSS('font-size', '14px');
  await expect(page.getByTestId('baseline-text')).toHaveCSS('line-height', '20px');
  await expect(page.getByTestId('baseline-title')).toHaveCSS('font-size', '20px');
}

/** 桌面与移动端均以实际布局宽度验收，不能用隐藏整块预览制造通过。 */
async function expectNoOverflow(page: Page): Promise<void> {
  expect(
    await page.locator('html').evaluate(
      /** 页面允许纵向滚动，横向宽度必须保持在当前视口内。 */
      (element) => element.scrollWidth <= element.clientWidth,
    ),
  ).toBe(true);
  await expect(page.getByTestId('global-card')).toBeVisible();
  await expect(page.getByTestId('local-card')).toBeVisible();
  await expect(page.getByTestId('baseline-card')).toBeVisible();
}

/** 每例捕获客户端未处理异常，使页面错误不能被样式断言掩盖。 */
test.beforeEach(async ({ page }) => {
  /** 页面异常由测试断言同步报告。 */
  const errors: string[] = [];
  pageErrors.set(page, errors);
  page.on(
    'pageerror',
    /** 记录异常内容，不读取用户会话或浏览器存储。 */
    (error) => errors.push(error.message),
  );
  await page.goto('/#/tokens');
  await expect(page.getByTestId('global-primary')).toBeVisible();
  expect(errors).toEqual([]);
});

/** 客户端挂载后的编辑、弹层与路由错误也必须使对应测试失败。 */
test.afterEach(async ({ page }) => {
  expect(pageErrors.get(page)).toEqual([]);
});

/** 固定默认、生成品牌、非法 HEX 与无色相错误都是公开可观察行为。 */
test('品牌预设、HEX 和模式实时生效且默认基线保持固定', async ({ page }) => {
  /** 全局主题不应被编辑面板接管。 */
  const before = await rootTheme(page);
  /** 实心按钮证明组件真正消费 primary 语义。 */
  const button = page.getByTestId('global-primary');
  await expect(button).toHaveCSS('background-color', baselinePrimary.light);
  await page.getByRole('switch', { name: '全局深色模式', exact: true }).check();
  await expect(button).toHaveCSS('background-color', baselinePrimary.dark);
  await choose(page, '全局方案', '算法蓝');
  await expect(button).toHaveCSS('background-color', primary('#0077fa', 'dark'));
  await page.getByRole('switch', { name: '全局深色模式', exact: true }).uncheck();
  await expect(button).toHaveCSS('background-color', 'rgb(0, 119, 250)');
  await choose(page, '全局方案', '橙色');
  await expect(button).toHaveCSS('background-color', primary('#e8590c', 'light'));
  await page.getByRole('textbox', { name: '全局品牌 HEX', exact: true }).fill('#D04E76');
  await expect(button).toHaveCSS('background-color', primary('#d04e76', 'light'));
  await expect(page.getByRole('textbox', { name: '全局品牌 HEX', exact: true })).toHaveValue(
    '#d04e76',
  );
  await page.getByRole('textbox', { name: '全局品牌 HEX', exact: true }).fill('red');
  await expect(page.getByRole('alert')).toHaveText('请输入不透明的 #RGB 或 #RRGGBB。');
  await expect(button).toHaveCSS('background-color', primary('#d04e76', 'light'));
  await page.getByRole('textbox', { name: '全局品牌 HEX', exact: true }).fill('#808080');
  await expect(page.getByRole('alert')).toHaveText('品牌色需要非零饱和度，请选择有色相的颜色。');
  await expect(button).toHaveCSS('background-color', primary('#d04e76', 'light'));
  await choose(page, '全局方案', '固定 Semi 基线');
  await expect(button).toHaveCSS('background-color', baselinePrimary.light);
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expectBaseline(page);
  expect(await rootTheme(page)).toEqual(before);
});

/** 颜色选择器使用当前库的公开面板和输入行为，不能只验证外侧 HEX 输入。 */
test('ColorPicker 面板编辑颜色并同步主题与 HEX 草稿', async ({ page }) => {
  await page.getByRole('button', { name: '全局颜色选择器', exact: true }).click();
  /** 关闭 alpha 后面板只有一个 HEX 文本字段，无需依赖组件内部 class。 */
  const picker = page.getByRole('dialog');
  await expect(picker).toBeVisible();
  await picker.getByRole('textbox').fill('#e8590c');
  await picker.getByRole('textbox').press('Tab');
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    primary('#e8590c', 'light'),
  );
  await expect(page.getByRole('textbox', { name: '全局品牌 HEX', exact: true })).toHaveValue(
    '#e8590c',
  );
  // 点击面板外侧关闭，保持默认 Popover 的触发行为和容器。
  await page.getByRole('heading', { name: '品牌颜色', exact: true }).click();
  await expect(picker).toHaveCount(0);
  await expectBaseline(page);
});

/** 共享变量、标题变量与组件覆盖分别在真实组件计算样式中验收。 */
test('字体、字号、字重、行高与 Button 覆盖使用公开变量', async ({ page }) => {
  await page.getByRole('button', { name: '字体排版', exact: true }).click();
  await choose(page, '全局字体', '等宽 / Monospace');
  await number(page, '全局正文字号', 18);
  await number(page, '全局正文行高', 30);
  await number(page, '全局常规字重', 500);
  await number(page, '全局强调字重', 700);
  await number(page, '全局标题字号', 28);
  await number(page, '全局标题行高', 38);
  await expect(page.getByTestId('global-text')).toHaveCSS(
    'font-family',
    'Menlo, Consolas, monospace',
  );
  await expect(page.getByTestId('global-text')).toHaveCSS('font-size', '18px');
  await expect(page.getByTestId('global-text')).toHaveCSS('line-height', '30px');
  await expect(page.getByTestId('global-text')).toHaveCSS('font-weight', '500');
  await expect(page.getByTestId('global-title')).toHaveCSS('font-weight', '700');
  await expect(page.getByTestId('global-title')).toHaveCSS('font-size', '28px');
  await expect(page.getByTestId('global-title')).toHaveCSS('line-height', '38px');
  await expect(page.getByTestId('global-primary')).toHaveCSS('font-size', '18px');
  await page.getByRole('button', { name: '组件样式定制', exact: true }).click();
  await expect(page).toHaveURL(/#\/components$/);
  await expect(page.getByRole('spinbutton', { name: '按钮字号', exact: true })).toBeDisabled();
  await page.getByRole('switch', { name: '启用 Button 排版覆盖', exact: true }).check();
  await number(page, '按钮字号', 16);
  await number(page, '按钮字重', 800);
  await number(page, '按钮行高', 26);
  await expect(page.getByTestId('global-primary')).toHaveCSS('font-size', '16px');
  await expect(page.getByTestId('global-primary')).toHaveCSS('font-weight', '800');
  await expect(page.getByTestId('global-primary')).toHaveCSS('line-height', '26px');
  await expect(page.getByTestId('global-text')).toHaveCSS('font-size', '18px');
  await expectBaseline(page);
  await page.getByRole('switch', { name: '启用 Button 排版覆盖', exact: true }).uncheck();
  await expect(page.getByTestId('global-primary')).toHaveCSS('font-size', '18px');
});

/** 移除边界必须撤回颜色、排版和模式，已打开的默认弹层也恢复外层继承。 */
test('局部边界隔离主题并在关闭后恢复自然继承', async ({ page }) => {
  await choose(page, '全局方案', '橙色');
  await page.getByRole('button', { name: '字体排版', exact: true }).click();
  await number(page, '全局正文字号', 16);
  await page.getByRole('button', { name: '局部主题', exact: true }).click();
  await number(page, '局部正文字号', 18);
  /** 内层使用独立青绿深色，外层保持橙色浅色。 */
  const local = page.getByTestId('local-scope');
  await expect(local).toHaveAttribute('data-semi-theme', 'studio-local');
  await expect(local).toHaveAttribute('theme-mode', 'dark');
  await expect(page.getByTestId('local-primary')).toHaveCSS(
    'background-color',
    primary('#00a696', 'dark'),
  );
  await expect(page.getByTestId('local-text')).toHaveCSS('font-size', '18px');
  await page.getByRole('button', { name: 'local主题提示', exact: true }).click();
  /** 默认 body Portal 由库桥接，而非放回预览 DOM 规避继承。 */
  const link = page.getByTestId('local-tooltip-link');
  await expect(link).toHaveCSS('color', primary('#00a696', 'dark'));
  await expect(link).toHaveCSS('font-size', '18px');
  await page.getByRole('switch', { name: '启用独立局部边界', exact: true }).uncheck();
  await expect(local).not.toHaveAttribute('data-semi-theme');
  await expect(local).not.toHaveAttribute('theme-mode');
  await expect(local).not.toHaveClass(/semi-always-(?:light|dark)/);
  await expect(page.getByTestId('local-primary')).toHaveCSS(
    'background-color',
    primary('#e8590c', 'light'),
  );
  await expect(page.getByTestId('local-text')).toHaveCSS('font-size', '16px');
  await expect(link).toBeVisible();
  await expect(link).toHaveCSS('color', primary('#e8590c', 'light'));
  await expect(link).toHaveCSS('font-size', '16px');
  await page.getByRole('switch', { name: '启用独立局部边界', exact: true }).check();
  await expect(link).toHaveCSS('color', primary('#00a696', 'dark'));
  await expect(link).toHaveCSS('font-size', '18px');
  await expectBaseline(page);
  await page.getByRole('button', { name: '关闭提示', exact: true }).click();
  await expect(link).toHaveCount(0);
});

/** 提示始终保持打开，编辑面板位于预览边界外，防止 DOM 继承碰巧满足断言。 */
test('默认 Tooltip 打开时同步外侧品牌、模式与排版编辑', async ({ page }) => {
  /** 主题之外的页面属性必须在整个编辑周期保持原样。 */
  const before = await rootTheme(page);
  await page.getByRole('button', { name: 'global主题提示', exact: true }).click();
  /** 链接和普通文字分别证明颜色与排版进入真实浮层。 */
  const link = page.getByTestId('global-tooltip-link');
  await expect(link).toBeVisible();
  await expect(link).toHaveCSS('color', baselinePrimary.light);
  expect(
    await link.evaluate(
      /** 浮层节点必须位于当前预览边界之外。 */
      (element) => !document.querySelector('[data-testid="global-scope"]')?.contains(element),
    ),
  ).toBe(true);
  await choose(page, '全局方案', '紫罗兰');
  await expect(link).toBeVisible();
  await expect(link).toHaveCSS('color', primary('#7c3aed', 'light'));
  await page.getByRole('switch', { name: '全局深色模式', exact: true }).check();
  await expect(link).toHaveCSS('color', primary('#7c3aed', 'dark'));
  await page.getByRole('button', { name: '字体排版', exact: true }).click();
  await choose(page, '全局字体', '等宽 / Monospace');
  await number(page, '全局正文字号', 17);
  await number(page, '全局正文行高', 29);
  await expect(link).toBeVisible();
  await expect(link).toHaveCSS('font-family', 'Menlo, Consolas, monospace');
  await expect(link).toHaveCSS('font-size', '17px');
  await expect(link).toHaveCSS('line-height', '29px');
  await expectBaseline(page);
  await page.getByRole('button', { name: '关闭提示', exact: true }).click();
  await expect(link).toHaveCount(0);
  expect(await rootTheme(page)).toEqual(before);
});

/** Modal 内用公开 QuickControls 修改源状态，关闭后撤回所有默认 Portal 镜像。 */
test('默认 Modal 打开时同步内部编辑并在关闭后清理', async ({ page }) => {
  /** 滚动锁之外的全局主题不属于 Modal 所有。 */
  const before = await rootTheme(page);
  await choose(page, '全局方案', '橙色');
  await page.getByRole('switch', { name: '全局深色模式', exact: true }).check();
  await page.getByRole('button', { name: 'global打开弹窗', exact: true }).click();
  /** 默认声明式弹窗真实出现在 body，保留库的 Portal 行为。 */
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(page.getByTestId('global-modal-primary')).toHaveCSS(
    'background-color',
    primary('#e8590c', 'dark'),
  );
  await choose(page, '弹窗品牌预设', '青绿色');
  await page.getByRole('switch', { name: '弹窗深色模式', exact: true }).uncheck();
  await number(page, '弹窗正文字号', 18);
  await expect(page.getByTestId('global-modal-primary')).toHaveCSS(
    'background-color',
    primary('#00a696', 'light'),
  );
  await expect(page.getByTestId('global-modal-link')).toHaveCSS('font-size', '18px');
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    primary('#00a696', 'light'),
  );
  await expect(page.getByTestId('global-text')).toHaveCSS('font-size', '18px');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('body > [data-semi-theme]')).toHaveCount(0);
  expect(await rootTheme(page)).toEqual(before);
  await page.getByRole('button', { name: 'global打开弹窗', exact: true }).click();
  await expect(page.getByTestId('global-modal-primary')).toHaveCSS(
    'background-color',
    primary('#00a696', 'light'),
  );
  await expect(page.getByTestId('global-modal-link')).toHaveCSS('font-size', '18px');
  await page.keyboard.press('Escape');
  await expectBaseline(page);
});

/** 路由卸载预览释放 Tooltip 与 Modal，同时编辑会话继续保留。 */
test('独立路由切换保留主题并释放已打开弹层', async ({ page }) => {
  await choose(page, '全局方案', '橙色');
  await page.getByRole('button', { name: 'global主题提示', exact: true }).click();
  await expect(page.getByTestId('global-tooltip-link')).toBeVisible();
  await page.getByRole('button', { name: '组件样式定制', exact: true }).click();
  await expect(page.getByTestId('global-tooltip-link')).toHaveCount(0);
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    primary('#e8590c', 'light'),
  );
  await page.getByRole('button', { name: 'global打开弹窗', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  // 浏览器地址栏的同文档 hash 导航可以在遮罩打开时切换路由。
  await page.goto('/#/preview');
  await expect(page.getByRole('heading', { name: '主题效果总览', exact: true })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByTestId('global-modal')).toHaveCount(0);
  await expect(page.locator('body > [data-semi-theme]')).toHaveCount(0);
  await expect(page.getByRole('complementary', { name: '主题编辑面板', exact: true })).toHaveCount(
    0,
  );
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    primary('#e8590c', 'light'),
  );
  await page.getByRole('button', { name: '全局样式定制', exact: true }).click();
  await page.getByRole('button', { name: '复原主题', exact: true }).click();
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    baselinePrimary.light,
  );
  await expectBaseline(page);
});

/** 四个代表宽度覆盖手机、平板、紧凑桌面和完整桌面断点。 */
for (const width of [390, 768, 1024, 1440]) {
  /** 每个视口独立浏览器上下文，避免一个宽度的滚动或弹层状态污染另一个。 */
  test(`${width}px 下可编辑主题且三个入口与弹窗均无横向溢出`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.getByRole('textbox', { name: '全局品牌 HEX', exact: true }).fill('#7c3aed');
    await page.getByRole('switch', { name: '全局深色模式', exact: true }).check();
    await expect(page.getByTestId('global-primary')).toHaveCSS(
      'background-color',
      primary('#7c3aed', 'dark'),
    );
    await expectNoOverflow(page);
    await page.getByRole('button', { name: '字体排版', exact: true }).click();
    await number(page, '全局正文字号', 16);
    await expect(page.getByTestId('global-text')).toHaveCSS('font-size', '16px');
    await page.getByRole('button', { name: '局部主题', exact: true }).click();
    await page.getByRole('switch', { name: '启用独立局部边界', exact: true }).uncheck();
    await expect(page.getByTestId('local-text')).toHaveCSS('font-size', '16px');
    await expectNoOverflow(page);
    await page.getByRole('button', { name: '组件样式定制', exact: true }).click();
    await expectNoOverflow(page);
    await page.getByRole('button', { name: '主题预览', exact: true }).click();
    await expectNoOverflow(page);
    await page.getByRole('button', { name: 'global打开弹窗', exact: true }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    expect(
      await page.getByRole('dialog').evaluate(
        /** 默认 Modal 必须收敛到当前视口，而不是靠页面横向滚动露出控件。 */
        (element) => {
          /** 包围盒同时检查左右边界，防止只裁掉溢出内容。 */
          const box = element.getBoundingClientRect();
          return box.left >= 0 && box.right <= document.documentElement.clientWidth;
        },
      ),
    ).toBe(true);
    await number(page, '弹窗正文字号', 17);
    await expect(page.getByTestId('global-modal-link')).toHaveCSS('font-size', '17px');
    await page.keyboard.press('Escape');
    await expectNoOverflow(page);
    await expectBaseline(page);
  });
}
