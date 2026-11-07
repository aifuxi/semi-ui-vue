import type { Locator, Page } from '@playwright/test';

import { expect, test } from './fixtures';

/** 读取公开组件最终的排版样式，不由 CSS 文本或内部状态推断是否生效。 */
async function expectTypography(target: Locator, fontSize: string, lineHeight: string) {
  await expect(target).toHaveCSS('font-size', fontSize);
  await expect(target).toHaveCSS('line-height', lineHeight);
}

/** 通过用户控件启用普通 CSS 主题，让实现自行发现主题变化。 */
async function enableTheme(page: Page) {
  await page.getByRole('button', { name: '切换排版主题', exact: true }).click();
  await expect(page.getByTestId('packed-theme-root')).toHaveClass('packed-theme-on');
}

// 亮暗模式共用排版主题；固定模式容器也不能把外层排版恢复为默认值。
for (const mode of ['light', 'dark'] as const) {
  // 每个独立浏览器页面从 tarball 中读取默认样式，避免预先注入主题掩盖基线漂移。
  test(`真实 tarball 排版默认值与 CSS 覆盖契约：${mode}`, async ({
    page,
    packedConsumer,
  }, testInfo) => {
    await testInfo.attach('typography-theme-package-origin', {
      body: JSON.stringify(packedConsumer.provenance, null, 2),
      contentType: 'application/json',
    });
    await page.goto(packedConsumer.url + '?typography-theme');
    // 只设置现有公开模式属性，测试不重写组件样式。
    await page.evaluate((themeMode) => document.body.setAttribute('theme-mode', themeMode), mode);
    await expectTypography(page.getByTestId('packed-theme-text'), '14px', '20px');
    await expectTypography(page.getByTestId('packed-theme-small'), '12px', '16px');
    // 固定基线的标题并非等比缩放，逐级记录原始字号和行高。
    const headings = [
      ['32px', '44px'],
      ['28px', '40px'],
      ['24px', '32px'],
      ['20px', '28px'],
      ['18px', '24px'],
      ['16px', '22px'],
    ];
    for (const [index, [fontSize, lineHeight]] of headings.entries()) {
      await expectTypography(
        page.getByTestId(`packed-theme-h${index + 1}`),
        fontSize!,
        lineHeight!,
      );
      await expect(page.getByTestId(`packed-theme-h${index + 1}`)).toHaveCSS('font-weight', '600');
    }
    await expect(page.getByTestId('packed-theme-extended')).toHaveCSS('line-height', '24px');
    await expect(page.getByTestId('packed-theme-button')).toHaveCSS('font-weight', '600');
    await enableTheme(page);
    await expectTypography(page.getByTestId('packed-theme-text'), '18px', '30px');
    await expect(page.getByTestId('packed-theme-text')).toHaveCSS('font-family', 'monospace');
    await expectTypography(page.getByTestId('packed-theme-small'), '13px', '18px');
    await expectTypography(page.getByTestId('packed-theme-h1'), '36px', '50px');
    await expectTypography(page.getByTestId('packed-theme-h5'), '25px', '34px');
    await expect(page.getByTestId('packed-theme-h1')).toHaveCSS('font-weight', '800');
    await expect(page.getByTestId('packed-theme-strong').locator('strong')).toHaveCSS(
      'font-weight',
      '800',
    );
    // 显式公开 props、内联样式和组件变量覆盖各自保留原有优先级。
    await expect(page.getByTestId('packed-theme-weight')).toHaveCSS('font-weight', '500');
    await expect(page.getByTestId('packed-theme-bold')).toHaveCSS('font-weight', '700');
    await expectTypography(page.getByTestId('packed-theme-inline'), '21px', '33px');
    await expect(page.getByTestId('packed-theme-button')).toHaveCSS('font-size', '19px');
    await expect(page.getByText('主题单元格', { exact: true })).toHaveCSS('font-size', '18px');
    await expect(page.locator('.semi-codeHighlight pre')).toHaveCSS(
      'font-family',
      '"Courier New", monospace',
    );
    // 行高仍按输入控件尺寸对齐，正文行高覆盖不得改变输入框垂直居中。
    await expect(page.getByRole('textbox', { name: '主题默认输入框', exact: true })).toHaveCSS(
      'line-height',
      '30px',
    );
    await expect(page.getByRole('textbox', { name: '主题小输入框', exact: true })).toHaveCSS(
      'line-height',
      '22px',
    );
    await expect(page.getByRole('textbox', { name: '主题大输入框', exact: true })).toHaveCSS(
      'line-height',
      '38px',
    );
    await expectTypography(page.getByTestId('packed-theme-inner-text'), '16px', '26px');
    await expect(page.getByTestId('packed-theme-inner-text')).toHaveCSS('font-family', 'monospace');
    await expectTypography(page.getByTestId('packed-theme-neighbor'), '14px', '20px');
    for (const appearance of ['light', 'dark']) {
      await expectTypography(page.getByTestId(`packed-theme-always-${appearance}`), '18px', '30px');
    }
  });

  // 默认 body Portal 需同步触发源主题，自定义容器则使用其自身的主题。
  test(`真实 tarball 弹层继承局部排版并跟随更新：${mode}`, async ({ page, packedConsumer }) => {
    await page.goto(packedConsumer.url + '?typography-theme');
    // 模式和排版独立变化，覆盖深浅模式下相同的 Portal 主题契约。
    await page.evaluate((themeMode) => document.body.setAttribute('theme-mode', themeMode), mode);
    await enableTheme(page);
    await page.getByRole('button', { name: '打开主题提示', exact: true }).click();
    // 内容使用普通 span，真实继承 Tooltip 计算样式，不单独声明主题值。
    const popup = page.getByTestId('packed-theme-tooltip');
    await expect(popup).toBeVisible();
    await expectTypography(popup, '18px', '30px');
    await expect(popup).toHaveCSS('font-family', 'monospace');
    // 修改公开 CSS 变量而不触发鼠标关闭，检查已打开 Portal 的实时继承。
    await page.getByTestId('packed-theme-root').evaluate((element) => {
      element.style.setProperty('--semi-font-size-regular', '20px');
      element.style.setProperty('--semi-line-height-regular', '32px');
    });
    await expectTypography(popup, '20px', '32px');
    await page.getByRole('button', { name: '打开独立容器提示', exact: true }).click();
    // 自定义容器在触发器主题外，必须保持 22px/34px，而非复制触发器的 20px/32px。
    const customPopup = page.getByTestId('packed-theme-custom-tooltip');
    await expect(customPopup).toBeVisible();
    await expectTypography(customPopup, '22px', '34px');
    await expect(customPopup).toHaveCSS('font-family', 'serif');
    await expect(page.locator('#packed-theme-popup-container')).toContainText('显式容器提示');
    // 专项页面只有一个 Select；其实际 combobox 名称由已选标签决定。
    await page.getByRole('combobox').click();
    // Select 经同一个 Tooltip/Popover 边界挂载，选项必须消费触发源主题。
    // 固定 Select 的勾选图标带有 tick 名称，选项名称以实际标签结尾。
    const option = page.getByRole('option', { name: /主题选项 Second$/ });
    await expect(option).toBeVisible();
    await expect(option).toHaveCSS('font-size', '20px');
    // 保持下拉框打开，仅更新主题变量，排除重新打开恰好带入新主题的路径。
    await page.getByTestId('packed-theme-root').evaluate((element) => {
      element.style.setProperty('--semi-font-size-regular', '21px');
    });
    await expect(option).toHaveCSS('font-size', '21px');
  });
}

// 声明式 Modal 从其声明位置获取默认主题，显式容器保持自己的级联。
for (const customContainer of [false, true]) {
  // 两条路径分别覆盖关闭 Portal 和在可见状态卸载整个组件。
  test(`真实 tarball 声明式 Modal 排版与清理：customContainer=${customContainer}`, async ({
    page,
    packedConsumer,
  }) => {
    await page.goto(packedConsumer.url + '?typography-theme');
    await enableTheme(page);
    // 原页面属性作为清理对照，不能把 body 当作局部主题镜像宿主。
    const bodyBefore = await page.locator('body').evaluate((element) => ({
      theme: element.getAttribute('data-semi-theme'),
      typography: element.style.getPropertyValue('--semi-font-size-regular'),
    }));
    const open = page.getByRole('button', {
      name: customContainer ? '打开显式容器弹窗' : '打开默认主题弹窗',
      exact: true,
    });
    await open.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    const content = page.getByTestId('packed-theme-modal-text');
    await expectTypography(
      content,
      customContainer ? '22px' : '18px',
      customContainer ? '34px' : '30px',
    );
    await expect(content).toHaveCSS('font-family', customContainer ? 'serif' : 'monospace');
    // 固定 ModalContent.tsx 使用 heading=5，header 容器的正文尺寸不会覆盖标题。
    await expectTypography(
      dialog.locator('.semi-modal-title'),
      customContainer ? '27px' : '25px',
      customContainer ? '38px' : '34px',
    );
    await expect(dialog.locator('.semi-modal-title')).toHaveCSS(
      'font-weight',
      customContainer ? '600' : '800',
    );
    if (customContainer) {
      await expect(page.locator('#packed-theme-popup-container')).toContainText('声明式弹窗正文');
    }
    // 仅修改实际生效的主题容器，已打开的 Modal 必须同步而不依赖重开。
    const theme = customContainer
      ? page.locator('#packed-theme-popup-container')
      : page.getByTestId('packed-theme-root');
    await theme.evaluate((element) => {
      element.style.setProperty('--semi-font-size-regular', '23px');
      element.style.setProperty('--semi-line-height-regular', '35px');
    });
    await expectTypography(content, '23px', '35px');
    // 固定 Semi 的取消按钮保留 aria-label=cancel，中文是可见文案。
    await dialog.getByRole('button', { name: 'cancel', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    // 正常关闭后再次打开，观察订阅和容器绑定仍须正常工作。
    await open.click();
    await expect(dialog).toBeVisible();
    await expectTypography(page.getByTestId('packed-theme-modal-text'), '23px', '35px');
    await dialog.getByRole('button', { name: '卸载声明式弹窗', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.getByTestId('packed-theme-modal-text')).toHaveCount(0);
    await expect(page.locator('.semi-portal[data-semi-theme="consumer"]')).toHaveCount(0);
    // 所有本地镜像只属于 Portal；卸载后 body 的主题声明必须和打开前完全一致。
    expect(
      await page.locator('body').evaluate((element) => ({
        theme: element.getAttribute('data-semi-theme'),
        typography: element.style.getPropertyValue('--semi-font-size-regular'),
      })),
    ).toEqual(bodyBefore);
    // 再次从卸载状态打开，验证新实例不会复用上一次已释放的 Portal。
    await open.click();
    await expect(dialog).toBeVisible();
    await expectTypography(page.getByTestId('packed-theme-modal-text'), '23px', '35px');
  });
}

// 固定外框下的排版变更必须主动触发测量；新挂载实例提供独立公开行为对照。
test('真实 tarball 的省略文本随字体、字重与行高更新', async ({ page, packedConsumer }) => {
  await page.goto(packedConsumer.url + '?typography-theme');
  await enableTheme(page);
  // 等待初始 JavaScript 省略完成，避免把加载阶段的全文当作旧结果。
  const live = page.getByTestId('packed-ellipsis-live');
  await expect(live.getByRole('button', { name: '展开', exact: true })).toBeVisible();
  await expect(live.locator('strong')).toHaveCSS('font-weight', '400');
  // 固定尺寸与旧内容一起记录，之后验证更新并非由外框缩放引起。
  const before = await live.textContent();
  const beforeBox = await live.boundingBox();
  await page.getByTestId('packed-theme-root').evaluate((element) => {
    element.classList.add('packed-theme-roomy');
  });
  await expectTypography(live, '24px', '36px');
  await expect(live.locator('strong')).toHaveCSS('font-weight', '900');
  await page.getByRole('button', { name: '挂载排版对照', exact: true }).click();
  // 对照实例也必须先完成测量，不能用未省略的完整正文弱化比较。
  const reference = page.getByTestId('packed-ellipsis-reference');
  await expect(reference.getByRole('button', { name: '展开', exact: true })).toBeVisible();
  await expect
    // 对照也会响应字体与布局事件，每次轮询读取双方，避免冻结过渡帧的旧期望。
    .poll(async () => (await live.textContent()) === (await reference.textContent()))
    .toBe(true);
  expect(await live.textContent()).not.toBe(before);
  // 仅比较宽高，页面中新挂载的对照可能正常改变后续布局位置。
  const afterBox = await live.boundingBox();
  expect({ width: afterBox?.width, height: afterBox?.height }).toEqual({
    width: beforeBox?.width,
    height: beforeBox?.height,
  });
  // 读取实际 strong 文本的行框，而不是用测量算法再算一次期望长度。
  await expect
    .poll(() =>
      live.locator('strong > span').evaluate((element) => {
        // getClientRects 返回行内文本实际占用的行框，相同 top 的碎片归为同一行。
        const tops = [...element.getClientRects()].map((rectangle) => Math.round(rectangle.top));
        return new Set(tops).size;
      }),
    )
    .toBeLessThanOrEqual(2);
  await live.getByRole('button', { name: '展开', exact: true }).click();
  await expect(live).toContainText('切换字体、字重和行高后应重新计算省略内容。');
  // 纯主题变化不能撤销用户已展开的全文，收起时再使用当前排版重新测量。
  const expandedText = await live.textContent();
  await page.getByTestId('packed-theme-root').evaluate((element) => {
    element.classList.remove('packed-theme-roomy');
  });
  await expectTypography(live, '18px', '30px');
  await expect(live).toHaveText(expandedText!);
  await live.getByRole('button', { name: '收起全文', exact: true }).click();
  await expect(live.getByRole('button', { name: '展开', exact: true })).toBeVisible();
  await expect
    .poll(async () => (await live.textContent()) === (await reference.textContent()))
    .toBe(true);
});
