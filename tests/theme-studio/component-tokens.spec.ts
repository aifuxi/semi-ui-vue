import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

/** 默认颜色取自固定 Semi 2.102.0 编译 CSS，供模式恢复与独立导出验收。 */
const defaultPrimary = 'rgb(0, 100, 250)';
/** 每页独立记录错误，跨组件和默认 Portal 的整个周期都参与验收。 */
const errorsByPage = new WeakMap<Page, string[]>();

/** 使用组件目录的可访问名称切换目标，不依赖内部组件状态。 */
async function selectComponent(page: Page, label: string): Promise<void> {
  await page
    .getByRole('navigation', { name: '组件分类', exact: true })
    .getByRole('button', { name: label, exact: true })
    .click();
}

/** 使用界面中的属性按钮选择目录项；预期样式由测试独立提供。 */
async function editAttribute(page: Page, label: string, value: string): Promise<void> {
  await page.getByRole('button', { name: `编辑${label}`, exact: true }).click();
  await page.getByRole('textbox', { name: 'CSS 变量值', exact: true }).fill(value);
  await page.getByRole('button', { name: '应用变量', exact: true }).click();
}

/** 为导出验收设置公开语义色，同时覆盖分类检索和变量选择。 */
async function editPrimary(page: Page, value: string): Promise<void> {
  await page.getByRole('button', { name: '全局样式定制', exact: true }).click();
  await page
    .getByRole('navigation', { name: '设计变量分类', exact: true })
    .getByRole('button', { name: /^色盘/ })
    .click();
  await page
    .getByRole('textbox', { name: '搜索设计变量', exact: true })
    .fill('--semi-color-primary');
  await page.getByRole('button', { name: '--semi-color-primary', exact: true }).click();
  await page.getByRole('textbox', { name: 'CSS 变量值', exact: true }).fill(value);
  await page.getByRole('button', { name: '应用变量', exact: true }).click();
}

/** 下载导出 CSS，交付内容必须来自真实浏览器下载而不是应用私有方法。 */
async function downloadCss(page: Page): Promise<string> {
  await page.getByRole('button', { name: '导出', exact: true }).click();
  /** 先监听快速下载，避免错过 Blob 文件事件。 */
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载 CSS', exact: true }).click();
  /** 文件路径只供读取本次测试的下载内容。 */
  const download = await pending;
  expect(download.suggestedFilename()).toBe('theme-studio.css');
  /** 浏览器下载失败时不得继续用空文本验收。 */
  const path = await download.path();
  expect(path).not.toBeNull();
  return readFile(path!, 'utf8');
}

/** 每例用真实生产入口创建独立编辑会话。 */
test.beforeEach(async ({ page }) => {
  /** 此数组只属于当前测试页面，不收集其他浏览器页面的信息。 */
  const errors: string[] = [];
  errorsByPage.set(page, errors);
  page.on(
    'pageerror',
    /** 文件下载、弹层和组件切换期间的异常同样不能被忽略。 */
    (error) => errors.push(error.message),
  );
  await page.goto('/#/components');
  await expect(page.getByTestId('component-gallery')).toBeVisible();
});

/** 组件样式编辑不得触发客户端异常或污染固定默认主色。 */
test.afterEach(async ({ page }) => {
  expect(errorsByPage.get(page)).toEqual([]);
});

/** 输入框覆盖同时作用于编辑器和预览，真实输入交互继续可用。 */
test('Input 背景、圆角和高度映射作用于真实输入框', async ({ page }) => {
  await selectComponent(page, 'Input 输入框');
  await editAttribute(page, '输入框背景', '#fef3c7');
  await editAttribute(page, '输入框圆角', '11px');
  await editAttribute(page, '默认输入框高度', '44px');
  /** 选择包含指定公开输入的 wrapper，避免将错误状态样例当作普通输入。 */
  const wrapper = page
    .getByTestId('component-gallery')
    .locator('.semi-input-wrapper')
    .filter({
      has: page.getByRole('textbox', { name: '预览主题名称', exact: true }),
    });
  await expect(wrapper).toHaveCSS('background-color', 'rgb(254, 243, 199)');
  await expect(wrapper).toHaveCSS('border-radius', '11px');
  await expect(wrapper).toHaveCSS('height', '44px');
  await page.getByRole('textbox', { name: '预览主题名称', exact: true }).fill('主题输入验收');
  await expect(page.getByRole('textbox', { name: '预览主题名称', exact: true })).toHaveValue(
    '主题输入验收',
  );
  await expect(
    page.getByRole('textbox', { name: 'CSS 变量值', exact: true }).locator('..'),
  ).toHaveCSS('height', '44px');
});

/** 选择器背景与公开字重覆盖要保留真实下拉选择和禁用状态。 */
test('Select 背景与字重覆盖保持选项交互和禁用隔离', async ({ page }) => {
  await selectComponent(page, 'Select 选择器');
  await editAttribute(page, '选择器背景', '#fef3c7');
  await editAttribute(page, '选择器字重', '700');
  /** 普通选择器和禁用选择器都在场景内，按实际状态类明确区分。 */
  const select = page
    .getByTestId('component-gallery')
    .locator('.semi-select:not(.semi-select-disabled)');
  await expect(select).toHaveCSS('background-color', 'rgb(254, 243, 199)');
  await expect(select).toHaveCSS('font-weight', '700');
  await page.getByRole('combobox', { name: '主题状态', exact: true }).click();
  await page
    .getByRole('option')
    .filter({ has: page.getByText('已保存', { exact: true }) })
    .click();
  await expect(page.getByRole('combobox', { name: '主题状态', exact: true })).toContainText(
    '已保存',
  );
  await expect(
    page.getByTestId('component-gallery').locator('.semi-select-disabled'),
  ).not.toHaveCSS('background-color', 'rgb(254, 243, 199)');
});

/** 白色标签专属颜色覆盖不能把其他语义标签改成同一背景。 */
test('Tag 颜色和尺寸映射只修改对应标签样例', async ({ page }) => {
  await selectComponent(page, 'Tag 标签');
  await editAttribute(page, '白色标签背景', '#fef3c7');
  await editAttribute(page, '小标签高度', '30px');
  await editAttribute(page, '标签水平内边距', '14px');
  /** 白色小标签是明确的组件目录消费对象。 */
  const tag = page.getByTestId('component-gallery').locator('.semi-tag-white-light');
  await expect(tag).toHaveCSS('background-color', 'rgb(254, 243, 199)');
  await expect(tag).toHaveCSS('height', '30px');
  await expect(tag).toHaveCSS('padding-left', '14px');
  await expect(tag).toHaveCSS('padding-right', '14px');
  await expect(page.getByTestId('component-gallery').locator('.semi-tag-blue-light')).not.toHaveCSS(
    'background-color',
    'rgb(254, 243, 199)',
  );
});

/** 卡片的复合阴影和布局属性应使用真实规则消费私有变量。 */
test('Card 背景、内边距与复合阴影作用于卡片结构', async ({ page }) => {
  await selectComponent(page, 'Card 卡片');
  await editAttribute(page, '卡片背景', '#fef3c7');
  await editAttribute(page, '卡片标题字号', '22px');
  await editAttribute(page, '卡片标题字重', '400');
  await editAttribute(page, '卡片内边距', '28px');
  await editAttribute(page, '卡片阴影', '0 3px 9px rgba(12, 34, 56, 0.5)');
  /** 场景中的真实 Card 包含独立 body 与阴影类。 */
  const card = page.getByTestId('component-gallery').locator('.semi-card');
  await expect(card).toHaveCSS('background-color', 'rgb(254, 243, 199)');
  await expect(card.getByRole('heading', { name: '当前主题', exact: true })).toHaveCSS(
    'font-size',
    '22px',
  );
  await expect(card.getByRole('heading', { name: '当前主题', exact: true })).toHaveCSS(
    'font-weight',
    '400',
  );
  await expect(card.locator('.semi-card-body')).toHaveCSS('padding', '28px');
  await expect(card).toHaveCSS('box-shadow', 'rgba(12, 34, 56, 0.5) 0px 3px 9px 0px');
});

/** 逗号分隔选择器映射必须同时覆盖表头和正文，且保持每个分支的主题作用域。 */
test('Table 表头颜色与单元格边距映射作用于所有目标单元格', async ({ page }) => {
  await selectComponent(page, 'Table 表格');
  await editAttribute(page, '表头背景', '#fef3c7');
  await editAttribute(page, '表格字号', '19px');
  await editAttribute(page, '单元格左内边距', '26px');
  /** 表头和正文分别断言，不能只看表格根上的变量值。 */
  const gallery = page.getByTestId('component-gallery');
  await expect(gallery.locator('.semi-table-row-head').first()).toHaveCSS('font-size', '19px');
  await expect(gallery.locator('.semi-table-row-cell').first()).toHaveCSS('font-size', '19px');
  await expect(gallery.locator('.semi-table-row-head').first()).toHaveCSS(
    'background-color',
    'rgb(254, 243, 199)',
  );
  await expect(gallery.locator('.semi-table-row-head').first()).toHaveCSS('padding-left', '26px');
  await expect(gallery.locator('.semi-table-row-cell').first()).toHaveCSS('padding-left', '26px');
  await expect(gallery.locator('.semi-table-row-cell').first()).not.toHaveCSS(
    'background-color',
    'rgb(254, 243, 199)',
  );
});

/** 模态框使用默认 body Portal；作用域桥接后仍须消费编辑的组件属性。 */
test('Modal 默认浮层消费背景与圆角覆盖并正常关闭', async ({ page }) => {
  await selectComponent(page, 'Modal 模态框');
  await editAttribute(page, '弹窗背景', '#fef3c7');
  await editAttribute(page, '弹窗圆角', '19px');
  await page.getByRole('button', { name: '预览模态框', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('.semi-modal-content')).toHaveCSS(
    'background-color',
    'rgb(254, 243, 199)',
  );
  await expect(page.locator('.semi-modal-content')).toHaveCSS('border-radius', '19px');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

/** Tooltip 字号在基线 CSS 中有后续覆盖，工作台适配必须改变最终计算样式。 */
test('Tooltip 默认浮层的字号和背景消费私有适配变量', async ({ page }) => {
  await selectComponent(page, 'Tooltip 提示');
  await editAttribute(page, '提示文字字号', '21px');
  await editAttribute(page, '提示背景', '#164e63');
  await page.getByRole('button', { name: '悬停查看提示', exact: true }).hover();
  await expect(page.getByRole('tooltip')).toBeVisible();
  await expect(page.locator('.semi-tooltip-wrapper')).toHaveCSS('font-size', '21px');
  await expect(page.locator('.semi-tooltip-wrapper')).toHaveCSS(
    'background-color',
    'rgb(22, 78, 99)',
  );
});

/** 将下载 CSS 放入没有工作台 DOM 的页面，证明主题交付边界可独立消费。 */
test('导出 CSS 在独立容器中支持双模式与组件绑定且不污染外层', async ({ page, context }) => {
  await editPrimary(page, '#e8590c');
  await page.getByRole('button', { name: '组件样式定制', exact: true }).click();
  await selectComponent(page, 'Button 按钮');
  await editAttribute(page, '默认按钮高度', '44px');
  await page.getByRole('switch', { name: '全局深色模式', exact: true }).check();
  await editPrimary(page, '#00a696');
  await page.getByRole('button', { name: '组件样式定制', exact: true }).click();
  await selectComponent(page, 'Button 按钮');
  await editAttribute(page, '默认按钮高度', '52px');
  /** 这里只读取当前应用已经加载的 stylesheet 地址，不假定构建产物文件名。 */
  const hrefs = await page.locator('link[rel="stylesheet"]').evaluateAll(
    /** 生产构建由 Vite 输出真实 CSS 链接，保持其加载顺序。 */
    (links) =>
      links.map(
        /** DOM 类型收窄仅用于读取已存在的链接地址。 */
        (link) => (link as HTMLLinkElement).href,
      ),
  );
  expect(hrefs.length).toBeGreaterThan(0);
  /** 每个文件都必须成功取得，不能用空 CSS 或测试自造样式代替默认主题。 */
  const styles = await Promise.all(
    hrefs.map(
      /** 公开页面同源样式可以通过当前测试的 HTTP 客户端读取。 */
      async (href) => {
        /** HTTP 响应真实来自正在测试的生产预览服务。 */
        const response = await page.request.get(href);
        expect(response.ok()).toBe(true);
        return response.text();
      },
    ),
  );
  /** 合并顺序与页面 link 顺序相同，保留默认主题层叠。 */
  const baseCss = styles.join('\n');
  expect(baseCss).toContain('--semi-blue-5:');
  /** 导出结果在默认编译 CSS 后加载，符合交付说明。 */
  const exported = await downloadCss(page);
  expect(exported).not.toContain('studio-global');
  /** 独立新页不挂载 Vue 工作台，也不添加任何 data-semi-theme 属性。 */
  const consumer = await context.newPage();
  try {
    await consumer.setContent(`<!doctype html><html lang="zh-CN"><head><style>${baseCss}</style><style>${exported}</style></head><body>
      <!-- 消费者只使用导出约定的 class 和模式属性，外侧按钮保持默认主题。 -->
      <label>主题模式<select aria-label="主题模式" onchange="document.getElementById('consumer').setAttribute('theme-mode', this.value)"><option value="light">浅色</option><option value="dark">深色</option></select></label>
      <section id="consumer" class="theme-studio-theme" theme-mode="light"><button id="themed" class="semi-button semi-button-primary">应用主题</button></section>
      <button id="default" class="semi-button semi-button-primary">默认主题</button>
    </body></html>`);
    await expect(consumer.locator('#themed')).toHaveCSS('background-color', 'rgb(232, 89, 12)');
    await expect(consumer.locator('#themed')).toHaveCSS('height', '44px');
    await expect(consumer.locator('#default')).toHaveCSS('background-color', defaultPrimary);
    await expect(consumer.locator('#default')).toHaveCSS('height', '32px');
    await consumer.getByRole('combobox', { name: '主题模式', exact: true }).selectOption('dark');
    await expect(consumer.locator('#themed')).toHaveCSS('background-color', 'rgb(0, 166, 150)');
    await expect(consumer.locator('#themed')).toHaveCSS('height', '52px');
    await expect(consumer.locator('#default')).toHaveCSS('background-color', defaultPrimary);
    await expect(consumer.locator('[data-semi-theme]')).toHaveCount(0);
    await consumer.getByRole('combobox', { name: '主题模式', exact: true }).selectOption('light');
    await expect(consumer.locator('#themed')).toHaveCSS('background-color', 'rgb(232, 89, 12)');
    await expect(consumer.locator('#themed')).toHaveCSS('height', '44px');
  } finally {
    await consumer.close();
  }
});
