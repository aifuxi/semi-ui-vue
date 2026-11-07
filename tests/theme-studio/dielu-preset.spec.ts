import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

/** 比较迁移范围外的真实主题值，避免预设整盘重算或夹带其他设计。 */
async function outsidePreset(page: Page) {
  return page.getByTestId('global-scope').evaluate(
    /** 取同一作用域最终解析后的非品牌变量和文字设置。 */
    (element) => {
      /** 浏览器负责解析原始 CSS 的变量引用。 */
      const style = getComputedStyle(element);
      return {
        danger: style.getPropertyValue('--semi-color-danger'),
        info: style.getPropertyValue('--semi-color-info'),
        background: style.backgroundColor,
        font: style.getPropertyValue('--semi-font-size-regular'),
        duration: style.getPropertyValue('--semi-transition_duration-normal'),
      };
    },
  );
}

/** 浅深语义和实心填充使用来源项目的独立定义，不能由一个 HEX 重新生成。 */
test('迭鹿预设保留品牌三态与圆角，并保持其他主题值', async ({ page }) => {
  await page.goto('/#/tokens');
  /** 迁移前的固定基线用于检查范围外设计保持不变。 */
  const before = await outsidePreset(page);
  await page.getByRole('button', { name: '应用迭鹿预设', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('已应用迭鹿品牌色与圆角');
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    'rgb(91, 90, 247)',
  );
  await expect(page.getByTestId('global-primary')).toHaveCSS('border-radius', '8px');
  await expect(page.getByTestId('baseline-primary')).toHaveCSS(
    'background-color',
    'rgb(0, 100, 250)',
  );
  await expect(page.getByTestId('baseline-primary')).toHaveCSS('border-radius', '3px');
  expect(await outsidePreset(page)).toEqual(before);
  await page.getByTestId('global-primary').hover();
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    'rgb(72, 70, 212)',
  );
  await page.mouse.down();
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    'rgb(55, 53, 173)',
  );
  await page.mouse.up();
  await page.getByRole('switch', { name: '工作区深色模式', exact: true }).check();
  // 源主题深色实心仍是品牌紫；文字前景使用单独设计的较亮紫色。
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    'rgb(91, 90, 247)',
  );
  await page.getByRole('button', { name: 'global主题提示', exact: true }).click();
  await expect(page.getByTestId('global-tooltip-link')).toHaveCSS('color', 'rgb(180, 177, 255)');
  await page.getByRole('button', { name: '关闭提示', exact: true }).click();
  await page.getByRole('button', { name: '组件样式定制', exact: true }).click();
  await expect(
    page.getByTestId('component-gallery').getByRole('button', { name: '次要按钮', exact: true }),
  ).toHaveCSS('background-color', 'rgb(8, 127, 112)');
});

/** 预设合并不清空已有排版；历史、导出和重新导入保留明暗与全部圆角。 */
test('迭鹿迁移可撤销并通过 JSON 恢复，保留原有编辑', async ({ page }) => {
  await page.goto('/#/tokens');
  await page.getByRole('button', { name: '字体排版', exact: true }).click();
  await page.getByRole('spinbutton', { name: '全局正文字号', exact: true }).fill('18');
  await page.getByRole('spinbutton', { name: '全局正文字号', exact: true }).press('Tab');
  await page.getByRole('button', { name: '应用迭鹿预设', exact: true }).click();
  await expect(page.getByTestId('global-text')).toHaveCSS('font-size', '18px');
  await page.getByRole('button', { name: '撤销修改', exact: true }).click();
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    'rgb(0, 100, 250)',
  );
  await expect(page.getByTestId('global-primary')).toHaveCSS('border-radius', '3px');
  await expect(page.getByTestId('global-text')).toHaveCSS('font-size', '18px');
  await page.getByRole('button', { name: '重做修改', exact: true }).click();
  await page.getByRole('button', { name: '导出', exact: true }).click();
  /** 先注册下载事件以捕获快速 Blob 文件。 */
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载 JSON', exact: true }).click();
  /** 下载来自真实界面操作，不直接访问工作台的内部状态。 */
  const download = await pending;
  /** Playwright 管理临时下载文件的生命周期。 */
  const path = await download.path();
  expect(path).not.toBeNull();
  /** 同一文件用于结构检查和真实往返导入。 */
  const json = await readFile(path!, 'utf8');
  /** 文件结构只声明本例所需的原始变量键。 */
  const document = JSON.parse(json) as {
    overrides: Record<'light' | 'dark', Record<string, string>>;
  };
  expect(document.overrides.light['--semi-border-radius-extra-small']).toBe('4px');
  expect(document.overrides.light['--semi-border-radius-medium']).toBe('16px');
  expect(document.overrides.dark['--semi-border-radius-large']).toBe('24px');
  expect(document.overrides.dark['--dielu-color-primary-5']).toBe('#9b98ff');
  expect(document.overrides.light['--dielu-brand-cyan']).toBe('#a7e9ff');
  expect(document.overrides.light).not.toHaveProperty('--semi-color-danger');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: '复原主题', exact: true }).click();
  await page
    .getByLabel('导入主题文件', { exact: true })
    .setInputFiles({ name: 'dielu.json', mimeType: 'application/json', buffer: Buffer.from(json) });
  await expect(page.getByRole('status')).toHaveText('已导入主题');
  await expect(page.getByTestId('global-primary')).toHaveCSS('border-radius', '8px');
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    'rgb(91, 90, 247)',
  );
  await expect(page.getByTestId('global-text')).toHaveCSS('font-size', '18px');
});
