import { expect, test, type Page } from '@playwright/test';
import { generateColorScale } from '../../packages/theme-default/colors/palette.mjs';

/** 专项验收实际文档路由，而非另建与读者页面不同的测试示例。 */
const themeRoute = '/zh-CN/advanced/customize-theme';
/** 本页固定展示的三个品牌；预期值来自公开算法，组件消费另行验证。 */
const brands = ['#7c3aed', '#e8590c', '#00a696'] as const;

/** 将公开 HEX 输出转换为浏览器 computed style 的 RGB 表达形式。 */
function rgb(hex: string): string {
  /** 输出中的三个连续字节依次为 R/G/B，不再推导色阶。 */
  const channels = [1, 3, 5].map(
    /** 一个颜色通道占两位十六进制字符。 */
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16),
  );
  return `rgb(${channels.join(', ')})`;
}

/** 获取指定品牌和模式的主色，避免从正在验收的 CSS 本身读取预期值。 */
function primary(brand: string, mode: 'light' | 'dark'): string {
  // brand 色阶直接以输入色生成；源码入口让工具类型检查不依赖已有 dist。
  return rgb(generateColorScale(brand, { mode })[5]);
}

/** 记录示例操作前后的站点根主题，防止局部演示改写全局模式或变量。 */
async function siteTheme(page: Page) {
  return page.locator('body').evaluate(
    /** 仅跟踪主题所有权；弹窗正常的滚动锁不属于主题污染。 */
    (body) => ({
      bodyMode: body.getAttribute('theme-mode'),
      bodyScope: body.getAttribute('data-semi-theme'),
      bodyStyle: body.style.getPropertyValue('--semi-color-primary'),
      htmlMode: document.documentElement.getAttribute('theme-mode'),
    }),
  );
}

/** 操作所有公开控制并核对默认基线，示例作用范围只能限于预览。 */
test('主题文档展示可运行源码，品牌和模式切换不污染站点主题', async ({ page }) => {
  /** 捕获真实页面错误，不能用静态构建成功代替客户端验证。 */
  const errors: string[] = [];
  page.on(
    'pageerror',
    /** 只收集未处理异常，不把历史构建提示当作运行时错误。 */
    (error) => errors.push(error.message),
  );
  await page.goto(themeRoute);
  /** 等待真实示例完成客户端挂载，再记录站点自己的初始主题。 */
  const playground = page.getByTestId('theme-playground');
  await expect(playground).toBeVisible();
  // 先把站点切到深色；预览仍保持自己的浅色与固定浅色对照。
  await page.getByRole('button', { name: '切换到暗色模式', exact: true }).click();
  /** 默认预览与站点根节点使用不同的主题作用域。 */
  const before = await siteTheme(page);
  /** 实心按钮用于检验 primary 语义实际被组件消费。 */
  const button = page.getByTestId('theme-primary');
  await expect(button).toHaveCSS('background-color', primary(brands[0], 'light'));
  await expect(page.getByTestId('theme-baseline-primary')).toHaveCSS(
    'background-color',
    'rgb(0, 100, 250)',
  );
  for (const brand of brands) {
    await playground.getByLabel('品牌颜色', { exact: true }).selectOption(brand);
    for (const mode of ['light', 'dark'] as const) {
      await playground.getByLabel('示例模式', { exact: true }).selectOption(mode);
      await expect(page.getByTestId('theme-preview')).toHaveAttribute('theme-mode', mode);
      await expect(button).toHaveCSS('background-color', primary(brand, mode));
    }
  }
  await playground.getByLabel('品牌颜色', { exact: true }).selectOption('baseline');
  await expect(button).toHaveCSS('background-color', 'rgb(84, 169, 255)');
  await playground.getByLabel('示例模式', { exact: true }).selectOption('light');
  await expect(button).toHaveCSS('background-color', 'rgb(0, 100, 250)');
  expect(await siteTheme(page)).toEqual(before);

  /** 复用 DemoBlock 的真实源码展示，公开 API 的用法应可阅读和复制。 */
  const block = page.locator('[data-demo-id="zh-CN-advanced-theme-playground"]');
  await block.locator('summary').click();
  await expect(block.locator('code')).toContainText('@aifuxi/semi-theme-default/colors');
  await expect(block.locator('code')).toContainText('createColorTheme');
  await expect(block.locator('code')).toContainText('colorThemeToCss');
  await expect(block.locator('code')).toContainText('--semi-font-size-regular');
  expect(errors).toEqual([]);
});

/** 局部开关和排版方案分别改变自己的作用域，不覆盖相邻固定对照。 */
test('主题文档演示局部隔离与排版覆盖', async ({ page }) => {
  await page.goto(themeRoute);
  /** 主控制区域保持普通原生表单语义，键盘和测试均可通过 label 操作。 */
  const playground = page.getByTestId('theme-playground');
  /** 局部区域固定青绿深色，与主品牌选择独立。 */
  const local = page.getByTestId('theme-local');
  /** 主题关闭时该按钮应继承外层，而非继续残留旧颜色。 */
  const localButton = page.getByTestId('theme-local-primary');
  await expect(local).toHaveAttribute('data-semi-theme', 'docs-local');
  await expect(local).toHaveAttribute('theme-mode', 'dark');
  await expect(localButton).toHaveCSS('background-color', primary('#00a696', 'dark'));
  await playground.getByLabel('品牌颜色', { exact: true }).selectOption('#e8590c');
  await expect(page.getByTestId('theme-primary')).toHaveCSS(
    'background-color',
    primary('#e8590c', 'light'),
  );
  await expect(localButton).toHaveCSS('background-color', primary('#00a696', 'dark'));
  await playground.getByLabel('启用局部主题', { exact: true }).uncheck();
  await expect(localButton).toHaveCSS('background-color', primary('#e8590c', 'light'));
  await playground.getByLabel('启用局部主题', { exact: true }).check();
  await expect(localButton).toHaveCSS('background-color', primary('#00a696', 'dark'));

  await expect(page.getByTestId('theme-text')).toHaveCSS('font-size', '14px');
  await expect(page.getByTestId('theme-text')).toHaveCSS('line-height', '20px');
  await playground.getByLabel('排版方案', { exact: true }).selectOption('comfortable');
  await expect(page.getByTestId('theme-text')).toHaveCSS('font-size', '16px');
  await expect(page.getByTestId('theme-text')).toHaveCSS('line-height', '26px');
  await expect(page.getByTestId('theme-title')).toHaveCSS('font-weight', '700');
  await expect(localButton).toHaveCSS('font-size', '14px');
  await expect(page.getByTestId('theme-baseline-primary')).toHaveCSS('font-size', '14px');
  await playground.getByLabel('排版方案', { exact: true }).selectOption('baseline');
  await expect(page.getByTestId('theme-text')).toHaveCSS('font-size', '14px');
  await expect(page.getByTestId('theme-text')).toHaveCSS('line-height', '20px');
});

/** 保持 Tooltip 节点打开，只改变公开控制值，检验默认 body Portal 的实时主题继承。 */
test('主题文档中的提示弹层同步品牌、模式和排版', async ({ page }) => {
  await page.goto(themeRoute);
  /** 控件未处于预览主题内部，修改它们不能靠 DOM 继承碰巧改变弹层。 */
  const playground = page.getByTestId('theme-playground');
  await playground.getByRole('button', { name: '查看主题提示', exact: true }).click();
  /** Typography 链接的真实颜色来自 Tooltip 的物理 Portal 宿主。 */
  const link = page.getByTestId('theme-tooltip-link');
  await expect(link).toBeVisible();
  await expect(link).toHaveCSS('color', primary('#7c3aed', 'light'));
  await playground.getByLabel('品牌颜色', { exact: true }).selectOption('#e8590c');
  await expect(link).toBeVisible();
  await expect(link).toHaveCSS('color', primary('#e8590c', 'light'));
  await playground.getByLabel('示例模式', { exact: true }).selectOption('dark');
  await expect(link).toBeVisible();
  await expect(link).toHaveCSS('color', primary('#e8590c', 'dark'));
  await playground.getByLabel('排版方案', { exact: true }).selectOption('comfortable');
  await expect(link).toHaveCSS('font-size', '16px');
  await expect(link).toHaveCSS('line-height', '26px');
  await page.keyboard.press('Escape');
  await expect(link).not.toBeVisible();
});

/** 声明式 Modal 使用同一公开主题链，关闭后不遗留全局颜色或主题属性。 */
test('主题文档中的弹窗保持局部颜色并正确清理', async ({ page }) => {
  await page.goto(themeRoute);
  /** 示例初始化不接管站点全局主题。 */
  const playground = page.getByTestId('theme-playground');
  await expect(playground).toBeVisible();
  /** 弹窗产生的滚动锁不参与比较，只有主题属性需要对称清理。 */
  const before = await siteTheme(page);
  await playground.getByLabel('品牌颜色', { exact: true }).selectOption('#e8590c');
  await playground.getByLabel('示例模式', { exact: true }).selectOption('dark');
  await playground.getByRole('button', { name: '打开主题弹窗', exact: true }).click();
  /** Modal 通过默认 body Portal 消费声明位置的品牌主题。 */
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(page.getByTestId('theme-modal-primary')).toHaveCSS(
    'background-color',
    primary('#e8590c', 'dark'),
  );
  // 弹窗内部提供同一状态的公开控件，不借点击遮罩后面的页面修改主题。
  await dialog.getByLabel('弹窗品牌颜色', { exact: true }).selectOption('#00a696');
  await dialog.getByLabel('弹窗模式', { exact: true }).selectOption('light');
  await expect(page.getByTestId('theme-modal-primary')).toHaveCSS(
    'background-color',
    primary('#00a696', 'light'),
  );
  await expect(page.getByTestId('theme-primary')).toHaveCSS(
    'background-color',
    primary('#00a696', 'light'),
  );
  await dialog.getByRole('button', { name: 'cancel', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  expect(await siteTheme(page)).toEqual(before);
  await playground.getByRole('button', { name: '打开主题弹窗', exact: true }).click();
  await expect(page.getByTestId('theme-modal-primary')).toHaveCSS(
    'background-color',
    primary('#00a696', 'light'),
  );
});

/** 在窄屏中执行同一主题操作，防止演示卡片或控制面板撑开文档正文。 */
test('主题文档的移动布局可以操作且没有横向溢出', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(themeRoute);
  /** 390px 为常见手机宽度，不能借隐藏整个示例避免溢出。 */
  const playground = page.getByTestId('theme-playground');
  await expect(playground).toBeVisible();
  await playground.getByLabel('品牌颜色', { exact: true }).selectOption('#00a696');
  await playground.getByLabel('示例模式', { exact: true }).selectOption('dark');
  await playground.getByLabel('排版方案', { exact: true }).selectOption('comfortable');
  await expect(page.getByTestId('theme-primary')).toHaveCSS(
    'background-color',
    primary('#00a696', 'dark'),
  );
  expect(
    await page.locator('html').evaluate(
      /** 页面允许垂直滚动，但布局宽度不得超过可视区。 */
      (element) => element.scrollWidth <= element.clientWidth,
    ),
  ).toBe(true);
  expect(
    await playground.evaluate(
      /** 示例自身也不能把控制项和正文裁在横向滚动区域。 */
      (element) => element.scrollWidth <= element.clientWidth,
    ),
  ).toBe(true);
});
