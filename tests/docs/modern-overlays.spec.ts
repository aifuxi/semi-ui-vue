import { expect, test, type Locator } from '@playwright/test';
import { expectElevatedShadow } from './theme-assertions';

async function shadowOf(locator: Locator): Promise<string> {
  return locator.evaluate((element) => getComputedStyle(element).boxShadow);
}

test('modern theme 的 Dropdown 保留圆角及默认的全局与局部主题阴影', async ({ page }) => {
  await page.goto('/zh-CN/show/dropdown');
  await page.locator('[data-demo-id="zh-CN-show-dropdown-2"] .semi-button').hover();

  const dropdown = page.locator('.semi-dropdown-wrapper-show').filter({ hasText: 'Menu Item 1' });
  await expect(dropdown).toBeVisible();
  const lightShadow = await expectElevatedShadow(dropdown);
  await expect(dropdown).toHaveCSS('border-radius', '16px');

  const portal = dropdown.locator('..');
  await portal.evaluate((element) => element.classList.add('semi-always-dark'));
  const darkShadow = await expectElevatedShadow(dropdown);
  expect(darkShadow).not.toBe(lightShadow);
  expect(darkShadow.match(/0px 0px 0px 1px inset/g)).toHaveLength(1);

  await portal.evaluate((element) =>
    element.classList.replace('semi-always-dark', 'semi-always-light'),
  );
  expect(await shadowOf(dropdown)).toBe(lightShadow);
});

test('modern theme 的 Popover 与 Popconfirm 保留默认浮层阴影', async ({ page }) => {
  await page.goto('/zh-CN/show/popover');
  await page.locator('[data-demo-id="zh-CN-show-popover-2"] span:has-text("DOM")').hover();
  const popover = page
    .locator('.semi-popover-wrapper-show')
    .filter({ hasText: '先进的设计' })
    .first();
  await expect(popover).toBeVisible();
  await expectElevatedShadow(popover);
  await expect(popover).toHaveCSS('border-radius', '16px');

  const arrowPopover = page.locator(
    '[data-demo-id="zh-CN-show-popover-9"] .semi-popover-wrapper-show',
  );
  await expect(arrowPopover).toBeVisible();
  await expectElevatedShadow(arrowPopover);
  await expect(arrowPopover.locator('svg')).toBeVisible();
  await expect(arrowPopover.locator('svg')).toHaveCSS('box-shadow', 'none');

  await page.goto('/zh-CN/feedback/popconfirm');
  await page.locator('[data-demo-id="zh-CN-feedback-popconfirm-2"] .semi-button').click();
  const popconfirm = page
    .locator('.semi-popover-wrapper-show.semi-popconfirm-popover')
    .filter({ hasText: '确定是否要保存此修改？' })
    .first();
  await expect(popconfirm).toBeVisible();
  await expectElevatedShadow(popconfirm);
});

test('modern theme 的 Tooltip 在亮暗模式下只保留圆角覆盖', async ({ page }) => {
  await page.goto('/zh-CN/show/tooltip');
  await page.locator('[data-demo-id="zh-CN-show-tooltip-2"] span:has-text("DOM")').hover();
  const tooltip = page.locator('.semi-tooltip-wrapper-show').filter({ hasText: 'semi design' });
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toHaveCSS('border-radius', '16px');
  await expect(tooltip).toHaveCSS('box-shadow', 'none');

  await page.getByRole('button', { name: '切换到暗色模式' }).click();
  await expect(page.locator('body')).toHaveAttribute('theme-mode', 'dark');
  await page.goto('/zh-CN/show/tooltip');
  await expect(page.locator('body')).toHaveAttribute('theme-mode', 'dark');
  await page.locator('[data-demo-id="zh-CN-show-tooltip-2"] span:has-text("DOM")').hover();
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toHaveCSS('border-radius', '16px');
  await expect(tooltip).toHaveCSS('box-shadow', 'none');
});

test('modern theme 的 Modal 保留默认边框与阴影，普通和全屏圆角分别生效', async ({ page }) => {
  await page.goto('/zh-CN/show/modal');
  await page.locator('[data-demo-id="zh-CN-show-modal-2"] .semi-button').click();
  const modal = page.locator('.semi-modal-content:not(.semi-modal-content-fullScreen)');
  await expect(modal).toBeVisible();
  const lightShadow = await expectElevatedShadow(modal);
  await expect(modal).toHaveCSS('border-radius', '24px');
  await expect(modal).toHaveCSS('border-top-style', 'solid');

  await page.goto('/zh-CN/show/modal');
  await page.locator('[data-demo-id="zh-CN-show-modal-10"] .semi-button').click();
  const fullScreen = page.locator('.semi-modal-content-fullScreen');
  await expect(fullScreen).toBeVisible();
  await expectElevatedShadow(fullScreen);
  await expect(fullScreen).toHaveCSS('border-radius', '0px');

  await page.goto('/zh-CN/show/modal');
  await page.getByRole('button', { name: '切换到暗色模式' }).click();
  await page.locator('[data-demo-id="zh-CN-show-modal-2"] .semi-button').click();
  await expect(modal).toBeVisible();
  const darkShadow = await expectElevatedShadow(modal);
  expect(darkShadow).not.toBe(lightShadow);
  expect(darkShadow.match(/0px 0px 0px 1px inset/g)).toHaveLength(1);
});

// 选择面板沿用各组件的固定前缀，不能把专用 TimePicker 面板误判为未打开。
test('复用 Popover 的选择面板保留现代圆角与默认阴影', async ({ page }) => {
  /** 路由、示例与操作固定到现有页面；TimePicker 的菜单样式按基线由内层 ScrollList 承载。 */
  const panels = [
    [
      '/zh-CN/input/select',
      'zh-CN-input-select-2',
      '.semi-select:first-child',
      'keyboard',
      '.semi-popover-wrapper-show',
    ],
    [
      '/zh-CN/input/autocomplete',
      'zh-CN-input-autocomplete-2',
      'input',
      'fill',
      '.semi-popover-wrapper-show',
    ],
    [
      '/zh-CN/input/datepicker',
      'zh-CN-input-datepicker-2',
      'input',
      'click',
      '.semi-popover-wrapper-show',
    ],
    [
      '/zh-CN/input/timepicker',
      'zh-CN-input-timepicker-2',
      'input',
      'click',
      '.semi-timepicker-panel-default-wrapper-show .semi-scrolllist',
    ],
    [
      '/zh-CN/input/cascader',
      'zh-CN-input-cascader-2',
      '.semi-cascader',
      'click',
      '.semi-popover-wrapper-show',
    ],
  ] as const;

  for (const [route, demoId, triggerSelector, action, panelSelector] of panels) {
    await page.goto(route);
    /** 每个示例只操作第一个真实触发器，不触碰应用内部状态。 */
    const trigger = page.locator(`[data-demo-id="${demoId}"] ${triggerSelector}`).first();
    await expect(trigger).toBeVisible();
    if (action === 'fill') await trigger.fill('semi');
    else if (action === 'keyboard') {
      await trigger.focus();
      await trigger.press('ArrowDown');
    } else await trigger.click();

    /** 检查真正承载圆角与阴影的浮层；可见性和样式断言保持原有精度。 */
    const panel = page.locator(panelSelector).first();
    await expect(panel, `${demoId} 应显示 Popover 面板`).toBeVisible();
    if (demoId === 'zh-CN-input-timepicker-2') {
      // 固定基线的外层仅负责定位，保持无阴影，避免内外两层重复叠加。
      await expect(page.locator('.semi-timepicker-panel-default-wrapper-show')).toHaveCSS(
        'box-shadow',
        'none',
      );
    }
    await expectElevatedShadow(panel);
    await expect(panel).toHaveCSS('border-radius', '16px');
  }
});
