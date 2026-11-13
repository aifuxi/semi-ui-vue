import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

/** 页面错误单独记录，防止复原异常被最终样式断言掩盖。 */
const errorsByPage = new WeakMap<Page, string[]>();

/** 通过目录搜索选择公开变量，不访问应用内部会话。 */
async function selectToken(page: Page, category: string, name: string): Promise<void> {
  await page.getByRole('button', { name: '全局样式定制', exact: true }).click();
  await page
    .getByRole('navigation', { name: '设计变量分类', exact: true })
    .getByRole('button', { name: new RegExp(`^${category}`) })
    .click();
  await page.getByRole('textbox', { name: '搜索设计变量', exact: true }).fill(name);
  await page.getByRole('button', { name, exact: true }).click();
}

/** 检查器提交与用户点击应用变量相同，失败反馈在界面断言。 */
async function applyValue(page: Page, value: string): Promise<void> {
  await page.getByRole('textbox', { name: 'CSS 变量值', exact: true }).fill(value);
  await page.getByRole('button', { name: '应用变量', exact: true }).click();
}

/** 按组件与属性名称进入私有变量编辑器。 */
async function selectAttribute(page: Page, component: string, attribute: string): Promise<void> {
  await page.getByRole('button', { name: '组件样式定制', exact: true }).click();
  await page
    .getByRole('navigation', { name: '组件分类', exact: true })
    .getByRole('button', { name: component, exact: true })
    .click();
  await page.getByRole('button', { name: `编辑${attribute}`, exact: true }).click();
}

/** 文件内容来自真实浏览器下载，不直接调用内部序列化函数。 */
async function downloadText(page: Page, format: 'CSS' | 'JSON'): Promise<string> {
  await page.getByRole('button', { name: '导出', exact: true }).click();
  /** 下载监听先于点击，保留 Blob 下载完成的证据。 */
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: `下载 ${format}`, exact: true }).click();
  /** 此路径仅用于读取本次浏览器交付的本地文件。 */
  const download = await pending;
  /** 路径为空意味着下载失败，不能继续以空文本验收。 */
  const path = await download.path();
  expect(path).not.toBeNull();
  await page.keyboard.press('Escape');
  return readFile(path!, 'utf8');
}

/** 每例从生产页面创建独立上下文，避免草稿和模式串扰。 */
test.beforeEach(async ({ page }) => {
  /** 所有编辑与导入操作共享本页异常列表。 */
  const errors: string[] = [];
  errorsByPage.set(page, errors);
  page.on(
    'pageerror',
    /** 事件处理器或渲染抛错均视为用户操作失败。 */
    (error) => errors.push(error.message),
  );
  await page.goto('/#/tokens');
  await expect(page.getByTestId('global-primary')).toBeVisible();
});

/** 不能以 CSS 正确掩盖复原处理器中的未捕获异常。 */
test.afterEach(async ({ page }) => {
  expect(errorsByPage.get(page)).toEqual([]);
});

/** 未编辑的私有引用必须可消费；传递依赖声明随 CSS 交付，但不能激活目标属性绑定。 */
test('私有默认变量的直接和传递引用同时支持预览与独立 CSS 消费', async ({ page, context }) => {
  await selectToken(page, '色盘', '--semi-color-primary');
  await applyValue(page, 'var(--studio-color-input-default-text-default)');
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByTestId('global-primary')).toHaveCSS('background-color', 'rgb(28, 31, 35)');

  await selectAttribute(page, 'Input 输入框', '输入文字');
  await applyValue(page, 'var(--studio-color-tag-white-text-default)');
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByTestId('global-primary')).toHaveCSS('background-color', 'rgb(28, 31, 35)');
  /** 导出应声明传递目标，但该目标没有显式覆盖，所以不新增 Tag 的属性绑定。 */
  const css = await downloadText(page, 'CSS');
  expect(css).toContain('--studio-color-tag-white-text-default: var(--semi-color-text-0);');
  expect(css).not.toContain('color: var(--studio-color-tag-white-text-default)');
  /** 独立页面不包含工作台样式或隐藏的应用会话，变量解析只依赖下载文件。 */
  const consumer = await context.newPage();
  try {
    await consumer.setContent(`<!doctype html><html><head><style>${css}</style></head><body>
      <div class="theme-studio-theme" theme-mode="light"><div id="sample" style="background-color:var(--semi-color-primary)">主题色</div></div>
    </body></html>`);
    await expect(consumer.locator('#sample')).toHaveCSS('background-color', 'rgb(28, 31, 35)');
  } finally {
    await consumer.close();
  }
});

/** 复原默认值会重新接回引用；检测出循环时必须保留合法覆盖及之后的编辑能力。 */
test('拒绝会形成循环的单项复原并保留后续正常编辑', async ({ page }) => {
  await selectAttribute(page, 'Button 按钮', '按钮圆角');
  await applyValue(page, '6px');
  await selectToken(page, '圆角', '--semi-border-radius-small');
  await applyValue(page, 'var(--studio-radius-button)');
  await selectAttribute(page, 'Button 按钮', '按钮圆角');
  await page.getByRole('button', { name: '恢复当前变量默认值', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('循环');
  await expect(page.getByRole('textbox', { name: 'CSS 变量值', exact: true })).toHaveValue('6px');
  await expect(page.getByTestId('global-primary')).toHaveCSS('border-radius', '6px');

  await selectToken(page, '色盘', '--semi-color-primary');
  await applyValue(page, '#e8590c');
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    'rgb(232, 89, 12)',
  );
});

/** 字重使用无单位数值；拒绝非法长度后界面继续保留上次合法字重。 */
test('无单位字重拒绝 px 并保持上次有效样式', async ({ page }) => {
  await selectAttribute(page, 'Select 选择器', '选择器字重');
  await applyValue(page, '600');
  /** 真实选择器直接消费无单位公开字重变量。 */
  const select = page
    .getByTestId('component-gallery')
    .locator('.semi-select:not(.semi-select-disabled)');
  await expect(select).toHaveCSS('font-weight', '600');
  await applyValue(page, '600px');
  await expect(page.getByRole('alert')).toContainText('不带单位');
  await expect(select).toHaveCSS('font-weight', '600');
  /** 无效输入不得污染保存文件。 */
  const css = await downloadText(page, 'CSS');
  expect(css).toContain('--semi-select-font-weight: 600;');
  expect(css).not.toContain('--semi-select-font-weight: 600px;');
});

/** 清空数值字段是临时输入状态；主题保持有效，真实 JSON 下载再导入应成功。 */
test('按钮排版字段清空后仍可完整往返保存文件', async ({ page }) => {
  await page.getByRole('button', { name: '组件样式定制', exact: true }).click();
  await page.getByRole('switch', { name: '启用 Button 排版覆盖', exact: true }).check();
  /** 三项分别采用可观察的合法值，避免清空后隐式回退默认值也算通过。 */
  const fields = [
    ['按钮字号', '18'],
    ['按钮字重', '700'],
    ['按钮行高', '28'],
  ] as const;
  for (const [label, value] of fields) {
    /** 通过真实 InputNumber 原生输入与失焦触发值提交。 */
    const field = page.getByRole('spinbutton', { name: label, exact: true });
    await field.fill(value);
    await field.press('Tab');
    await field.fill('');
    await field.press('Tab');
  }
  await expect(page.getByTestId('global-primary')).toHaveCSS('font-size', '18px');
  await expect(page.getByTestId('global-primary')).toHaveCSS('font-weight', '700');
  await expect(page.getByTestId('global-primary')).toHaveCSS('line-height', '28px');
  /** JSON 来自浏览器交付，而非测试拼装文档结构。 */
  const json = await downloadText(page, 'JSON');
  await page.getByRole('button', { name: '复原主题', exact: true }).click();
  await page.getByLabel('导入主题文件', { exact: true }).setInputFiles({
    name: 'theme-studio.json',
    mimeType: 'application/json',
    buffer: Buffer.from(json),
  });
  await expect(page.getByRole('status')).toContainText('已导入主题');
  await expect(page.getByTestId('global-primary')).toHaveCSS('font-size', '18px');
  await expect(page.getByTestId('global-primary')).toHaveCSS('font-weight', '700');
  await expect(page.getByTestId('global-primary')).toHaveCSS('line-height', '28px');
});
