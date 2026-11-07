import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

/** 固定默认颜色取自 Semi 2.102.0 编译产物，不调用颜色生成器计算默认值。 */
const baselinePrimary = { light: 'rgb(0, 100, 250)', dark: 'rgb(84, 169, 255)' };
/** 文件断言只访问本用例通过下载获得的主题结构。 */
interface ExportedTheme {
  version: number;
  global: { mode: string };
  overrides: { light: Record<string, string>; dark: Record<string, string> };
}
/** 页面异常跨步骤收集，防止 CSS 断言掩盖运行时错误。 */
const errorsByPage = new WeakMap<Page, string[]>();

/** 分类按钮包含变量数量，所以按稳定的中文名称前缀选择。 */
async function category(page: Page, label: string): Promise<void> {
  await page
    .getByRole('navigation', { name: '设计变量分类', exact: true })
    .getByRole('button', { name: new RegExp(`^${label}`) })
    .click();
}

/** 搜索完整名称后选择结果，覆盖真实搜索与选择行为。 */
async function selectToken(page: Page, label: string, name: string): Promise<void> {
  await category(page, label);
  await page.getByRole('textbox', { name: '搜索设计变量', exact: true }).fill(name);
  await page.getByRole('button', { name, exact: true }).click();
}

/** 提交检查器中的 CSS 值，不直接操作应用状态或样式。 */
async function applyValue(page: Page, value: string): Promise<void> {
  await page.getByRole('textbox', { name: 'CSS 变量值', exact: true }).fill(value);
  await page.getByRole('button', { name: '应用变量', exact: true }).click();
}

/** 从真实下载事件读取文件内容，监听先于点击以避免漏掉快速下载。 */
async function downloadText(page: Page, format: 'CSS' | 'JSON'): Promise<string> {
  /** 下载事件证明浏览器完成了文件交付，不读取内部序列化函数。 */
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: `下载 ${format}`, exact: true }).click();
  /** 本地下载文件由 Playwright 在用例结束时清理。 */
  const download = await pending;
  expect(download.suggestedFilename()).toBe(`theme-studio.${format.toLowerCase()}`);
  /** 下载失败不应被当作空文件继续验收。 */
  const path = await download.path();
  expect(path).not.toBeNull();
  return readFile(path!, 'utf8');
}

/** 通过文件输入的公开用户操作路径导入内容，包括不合法的 JSON。 */
async function importText(page: Page, text: string): Promise<void> {
  await page.getByLabel('导入主题文件', { exact: true }).setInputFiles({
    name: 'theme-studio.json',
    mimeType: 'application/json',
    buffer: Buffer.from(text),
  });
}

/** 每例从独立浏览器上下文打开全局编辑器，避免本地草稿跨用例传播。 */
test.beforeEach(async ({ page }) => {
  /** 只记录此测试页面的未处理客户端异常。 */
  const errors: string[] = [];
  errorsByPage.set(page, errors);
  page.on(
    'pageerror',
    /** 挂载后的文件、模式与历史操作同样不能触发未处理错误。 */
    (error) => errors.push(error.message),
  );
  await page.goto('/#/tokens');
  await expect(page.getByTestId('global-primary')).toBeVisible();
});

/** 全交互周期没有客户端未处理异常才算通过。 */
test.afterEach(async ({ page }) => {
  expect(errorsByPage.get(page)).toEqual([]);
});

/** 语义色必须作用到实际组件，错误输入保持上一次有效主题。 */
test('搜索并编辑公开语义颜色，界面与预览同步', async ({ page }) => {
  await expect(page).toHaveTitle('Theme Studio');
  await expect(page.locator('body')).not.toContainText(/AIFUXI|@aifuxi/);
  await selectToken(page, '色盘', '--semi-color-primary');
  await applyValue(page, '#e8590c');
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    'rgb(232, 89, 12)',
  );

  await expect(page.locator('.variable-row[aria-label="--semi-color-primary"]')).toContainText(
    '#e8590c',
  );
  await page.getByRole('switch', { name: '仅显示已修改变量', exact: true }).check();
  await expect(page.locator('.variable-row')).toHaveCount(1);
  await applyValue(page, 'this-is-not-a-color');
  await expect(page.getByRole('alert')).toContainText('请输入 CSS 颜色或变量引用');
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    'rgb(232, 89, 12)',
  );
});

/** 深浅模式各有一套覆盖，切换时不能覆盖另一模式的用户设计。 */
test('深浅模式的颜色覆盖独立保存并跟随切换', async ({ page }) => {
  await selectToken(page, '色盘', '--semi-color-primary');
  await applyValue(page, '#e8590c');
  await page.getByRole('switch', { name: '全局深色模式', exact: true }).check();
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    baselinePrimary.dark,
  );
  await applyValue(page, '#00a696');
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    'rgb(0, 166, 150)',
  );
  await page.getByRole('switch', { name: '全局深色模式', exact: true }).uncheck();
  await expect(page.getByRole('textbox', { name: 'CSS 变量值', exact: true })).toHaveValue(
    '#e8590c',
  );
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    'rgb(232, 89, 12)',
  );
  await page.getByRole('switch', { name: '全局深色模式', exact: true }).check();
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    'rgb(0, 166, 150)',
  );
});

/** 单项复原也属于历史操作，撤销与重做应恢复样式及检查器输入。 */
test('单项恢复、撤销与重做还原同一变量的真实样式', async ({ page }) => {
  await selectToken(page, '色盘', '--semi-color-primary');
  await applyValue(page, '#e8590c');
  await applyValue(page, '#00a696');
  await page.getByRole('button', { name: '撤销修改', exact: true }).click();
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    'rgb(232, 89, 12)',
  );
  await expect(page.getByRole('textbox', { name: 'CSS 变量值', exact: true })).toHaveValue(
    '#e8590c',
  );
  await page.getByRole('button', { name: '重做修改', exact: true }).click();
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    'rgb(0, 166, 150)',
  );
  await page.getByRole('button', { name: '恢复当前变量默认值', exact: true }).click();
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    baselinePrimary.light,
  );
  await page.getByRole('button', { name: '撤销修改', exact: true }).click();
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    'rgb(0, 166, 150)',
  );
  await page.getByRole('button', { name: '重做修改', exact: true }).click();
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    baselinePrimary.light,
  );
});

/** 基础 RGB 通道修改应沿语义引用联动，超出通道范围则保留上一次合法主题。 */
test('基础色阶通道沿引用更新主色且拒绝超范围 RGB', async ({ page }) => {
  await selectToken(page, '基础色阶', '--semi-blue-5');
  await applyValue(page, '10, 120, 130');
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    'rgb(10, 120, 130)',
  );
  await expect(page.getByRole('button', { name: '--semi-blue-5', exact: true })).toHaveCSS(
    'background-color',
    'rgb(10, 120, 130)',
  );

  await applyValue(page, '999, 0, 0');
  await expect(page.getByRole('alert')).toContainText('0–255');
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    'rgb(10, 120, 130)',
  );
});

/** 公共圆角和工作台私有组件适配必须改变真实组件，而非仅更新色样或变量表。 */
test('公共圆角与组件私有尺寸覆盖作用于真实按钮', async ({ page }) => {
  await selectToken(page, '圆角', '--semi-border-radius-small');
  await applyValue(page, '15px');
  await expect(page.getByTestId('global-primary')).toHaveCSS('border-radius', '15px');

  await page.getByRole('button', { name: '组件样式定制', exact: true }).click();
  await page.getByRole('button', { name: '编辑默认按钮高度', exact: true }).click();
  await expect(page.locator('.token-inspector')).toContainText('--studio-height-button-default');
  await applyValue(page, '48px');
  await expect(page.getByTestId('global-primary')).toHaveCSS('height', '48px');
  await expect(
    page.getByTestId('component-gallery').getByRole('button', { name: '默认尺寸', exact: true }),
  ).toHaveCSS('height', '48px');
  await expect(
    page.getByTestId('component-gallery').getByRole('button', { name: '小尺寸', exact: true }),
  ).toHaveCSS('height', '24px');
});

/** 导出与导入走真实文件操作，草稿恢复走本地持久化；二者都应恢复主题效果。 */
test('CSS 与 JSON 下载、JSON 往返和已保存草稿恢复保持设计值', async ({ page }) => {
  await selectToken(page, '色盘', '--semi-color-primary');
  await applyValue(page, '#e8590c');
  await page.getByRole('button', { name: '保存草稿', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('草稿已保存');
  await page.getByRole('button', { name: '导出', exact: true }).click();
  /** CSS 必须同时携带通用消费边界与本次修改，而不是工作台私有 DOM 选择器。 */
  const css = await downloadText(page, 'CSS');
  expect(css).toContain('.theme-studio-theme[theme-mode="light"]');
  expect(css).toContain('--semi-color-primary: #e8590c;');
  expect(css).not.toContain('studio-global');
  /** JSON 文件保留两套模式配置，用于之后真实导入。 */
  const json = await downloadText(page, 'JSON');
  /** 下载内容来自本应用，可以在断言结构后作为往返样本。 */
  const document = JSON.parse(json) as ExportedTheme;
  expect(document.version).toBe(1);
  expect(document.overrides.light['--semi-color-primary']).toBe('#e8590c');
  expect(document.overrides.dark).toEqual({});
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: '复原主题', exact: true }).click();
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    baselinePrimary.light,
  );
  await importText(page, json);
  await expect(page.getByRole('status')).toContainText('已导入主题');
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    'rgb(232, 89, 12)',
  );
  await page.getByRole('button', { name: '复原主题', exact: true }).click();
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    baselinePrimary.light,
  );
  await page.reload();
  await page.getByRole('button', { name: '恢复已保存草稿', exact: true }).click();
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    'rgb(232, 89, 12)',
  );
});

/** 文件必须完整校验后原子应用，后面一项错误不能让前面的合法值部分生效。 */
test('无效 JSON、未知变量和无效颜色导入均不污染当前主题', async ({ page }) => {
  await selectToken(page, '色盘', '--semi-color-primary');
  await applyValue(page, '#e8590c');
  await page.getByRole('button', { name: '导出', exact: true }).click();
  /** 使用真实导出结果构造错误文件，不复制应用的完整文档默认值。 */
  const json = await downloadText(page, 'JSON');
  /** 每个修改样本从合法文档深拷贝，互不复用已破坏的输入。 */
  const unknown = JSON.parse(json) as ExportedTheme;
  unknown.overrides.light['--semi-color-primary'] = '#00a696';
  unknown.overrides.light['--semi-unknown-token'] = '#ffffff';
  /** 颜色字符串具有合法 JSON 结构，但应被 CSS 校验拒绝。 */
  const invalid = JSON.parse(json) as ExportedTheme;
  invalid.overrides.light['--semi-color-primary'] = 'not-a-color';
  await page.keyboard.press('Escape');
  await importText(page, '{invalid JSON');
  await expect(page.getByRole('status')).not.toHaveText('已导出 JSON');
  await expect(page.getByRole('status')).not.toHaveText('已导入主题');
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    'rgb(232, 89, 12)',
  );
  await importText(page, JSON.stringify(unknown));
  await expect(page.getByRole('status')).toContainText('不支持的变量 --semi-unknown-token');
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    'rgb(232, 89, 12)',
  );
  await importText(page, JSON.stringify(invalid));
  await expect(page.getByRole('status')).toContainText('请输入 CSS 颜色或变量引用');
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    'rgb(232, 89, 12)',
  );
});

/** 变量引用应保持真实依赖，循环和跨类型引用都应在影响预览之前被拒绝。 */
test('引用颜色实时联动，循环与错误类型保留上次合法设计', async ({ page }) => {
  await selectToken(page, '色盘', '--semi-color-primary');
  await applyValue(page, 'var(--semi-color-danger)');
  /** 固定 Semi 2.102.0 的危险色来自原始 red-5，而不是主色本身。 */
  const danger = 'rgb(249, 57, 32)';
  await expect(page.getByTestId('global-primary')).toHaveCSS('background-color', danger);
  await selectToken(page, '色盘', '--semi-color-danger');
  await applyValue(page, 'var(--semi-color-primary)');
  await expect(page.getByRole('alert')).toContainText('循环');
  await selectToken(page, '字体排版', '--semi-font-size-regular');
  await applyValue(page, 'var(--semi-color-primary)');
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.getByTestId('global-text')).toHaveCSS('font-size', '14px');
});

/** 透明度属于完整语义颜色；固定 AI 色阶仍遵循实际三通道 RGB 格式。 */
test('透明语义色与基础 RGB 通道各自保持正确格式', async ({ page }) => {
  await selectToken(page, '色盘', '--semi-color-primary');
  await applyValue(page, 'rgba(30, 80, 120, 0.5)');
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    'rgba(30, 80, 120, 0.5)',
  );
  await selectToken(page, '基础色阶', '--semi-ai-purple-5');
  await applyValue(page, '30, 80, 120');
  await expect(page.getByRole('button', { name: '--semi-ai-purple-5', exact: true })).toHaveCSS(
    'background-color',
    'rgb(30, 80, 120)',
  );
  await applyValue(page, '30, 80, 120, 2');
  await expect(page.getByRole('alert')).toContainText('RGB 通道');
  await expect(page.getByRole('button', { name: '--semi-ai-purple-5', exact: true })).toHaveCSS(
    'background-color',
    'rgb(30, 80, 120)',
  );
});
