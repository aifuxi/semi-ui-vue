import type { Locator, Page } from '@playwright/test';

import { expect, test } from './fixtures';

/** 消费测试只读取生成器公开返回的色盘，算法本身由独立参考样本测试验收。 */
type Palette = Record<string, string[]>;

/** 将公开 HEX 输出转为浏览器 computed style 使用的 RGB 序列化形式。 */
function rgb(hex: string): string {
  // 六位输出是颜色生成器的公开契约，每个通道占两个十六进制字符。
  const channels = [1, 3, 5].map(
    // 转换仅用于格式匹配，不重新实现色阶推导或语义颜色算法。
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16),
  );
  return `rgb(${channels.join(', ')})`;
}

/** 从页面使用的真实安装包结果中读取指定模式色盘。 */
async function palette(page: Page, id = 'packed-color-expected'): Promise<Palette> {
  return JSON.parse((await page.getByTestId(id).textContent())!) as Palette;
}

/** 读取独立输出的品牌或基础色阶，避免把 CSS 自身当作期望值。 */
function level(colors: Palette, name: string, index: number): string {
  return rgb(colors[name]![index]!);
}

/** 通过公开页面控件切换模式，保持真实 Portal 和组件实例仍然存在。 */
async function setMode(page: Page, mode: 'light' | 'dark') {
  if (mode === 'dark') {
    await page.getByRole('button', { name: '切换颜色模式', exact: true }).click();
  }
  await expect(page.getByTestId('packed-color-root')).toHaveAttribute('theme-mode', mode);
}

/** 检查实心按钮最终背景，排除 CSS 变量存在却没有被组件消费的假通过。 */
async function expectPrimary(button: Locator, colors: Palette) {
  await expect(button).toHaveCSS('background-color', level(colors, 'brand', 5));
}

// 导入纯函数只增加可调用能力；没有显式加载生成 CSS 的区域仍保持固定 Semi 默认色。
test('真实 tarball 颜色生成入口保持默认基线并可显式启用全局主题', async ({
  page,
  packedConsumer,
}, testInfo) => {
  await testInfo.attach('color-theme-package-origin', {
    body: JSON.stringify(packedConsumer.provenance, null, 2),
    contentType: 'application/json',
  });
  await page.goto(packedConsumer.url + '?color-theme');
  // 固定 vendor 的蓝色第 5 级是 0,100,250，不能由算法重新生成成 0,119,250。
  const neighbor = page.getByTestId('packed-color-neighbor-button');
  await expect(neighbor).toHaveCSS('background-color', 'rgb(0, 100, 250)');
  await expect(page.getByTestId('packed-color-button')).toHaveCSS('font-size', '14px');
  await expect(page.getByTestId('packed-color-button')).toHaveCSS('height', '32px');
  await expect(page.getByTestId('packed-color-text')).toHaveCSS('line-height', '20px');
  await page.getByRole('button', { name: '启用全局颜色主题', exact: true }).click();
  await expectPrimary(neighbor, await palette(page, 'packed-color-global-expected'));
  await setMode(page, 'dark');
  await expectPrimary(neighbor, await palette(page, 'packed-color-global-expected'));
  await expect(page.getByTestId('packed-color-button')).toHaveCSS('font-size', '14px');
});

// 两种模式分别检查基础色盘、语义颜色、局部边界及强制模式的最终组件样式。
for (const mode of ['light', 'dark'] as const) {
  // 同一纯 CSS 产物同时支持普通组件、嵌套品牌和原有 always-light/dark 容器。
  test(`真实 tarball 颜色主题的组件消费与作用域：${mode}`, async ({ page, packedConsumer }) => {
    await page.goto(packedConsumer.url + '?color-theme');
    await setMode(page, mode);
    // 色盘来自公开生成器，以下断言验证库内语义映射和基础色盘直接消费两条路径。
    const colors = await palette(page);
    await expectPrimary(page.getByTestId('packed-color-button'), colors);
    await expect(page.getByTestId('packed-color-link')).toHaveCSS(
      'color',
      level(colors, 'brand', 5),
    );
    await expect(page.getByTestId('packed-color-text')).toHaveCSS(
      'color',
      level(colors, 'grey', 9),
    );
    await expect(page.getByTestId('packed-color-tag')).toHaveCSS(
      'background-color',
      level(colors, 'blue', 5),
    );
    expect(level(colors, 'blue', 5)).not.toBe(level(colors, 'brand', 5));
    await expectPrimary(
      page.getByTestId('packed-color-nested'),
      await palette(page, 'packed-color-independent-expected'),
    );
    await expectPrimary(
      page.getByTestId('packed-color-always-light'),
      await palette(page, 'packed-color-expected-light'),
    );
    await expectPrimary(
      page.getByTestId('packed-color-always-dark'),
      await palette(page, 'packed-color-expected-dark'),
    );
    // Input 焦点描边绑定 brand，不能只覆盖主按钮而遗漏表单高亮。
    const input = page.getByRole('textbox', { name: '颜色输入框', exact: true });
    await input.focus();
    await expect(input.locator('..')).toHaveCSS('border-top-color', level(colors, 'brand', 5));
    await expect(input).toHaveCSS('font-size', '14px');
    await expect(input).toHaveCSS('line-height', '30px');
    // 鼠标留在页面外部控件上，避免按钮 hover 颜色被错误当作 default 背景。
    await page.getByRole('button', { name: '切换品牌颜色', exact: true }).click();
    await expectPrimary(page.getByTestId('packed-color-button'), await palette(page));
    await expectPrimary(
      page.getByTestId('packed-color-nested'),
      await palette(page, 'packed-color-independent-expected'),
    );
  });

  // 已打开的 Tooltip 和 Select 必须实时更新；显式容器不接受触发源的颜色覆盖。
  test(`真实 tarball 局部颜色跨默认 Portal 且动态更新：${mode}`, async ({
    page,
    packedConsumer,
  }) => {
    await page.goto(packedConsumer.url + '?color-theme');
    await setMode(page, mode);
    await page.getByRole('button', { name: '打开颜色提示', exact: true }).click();
    // 真实 Typography 链接位于 Tooltip 的 body Portal 中，不能继承 DOM 原祖先。
    const link = page.getByTestId('packed-color-tooltip-link');
    await expect(link).toBeVisible();
    await expect(link).toHaveCSS('color', level(await palette(page), 'brand', 5));
    // 直接改变公开 class 保持弹层打开，排除外部点击自动关闭后重开的偶然路径。
    await page.getByTestId('packed-color-root').evaluate(
      // 该 class 选择另一份预先生成的普通 CSS，不触发任何库私有刷新入口。
      (element) => element.classList.add('packed-color-alternate'),
    );
    // 另一品牌的模式色盘独立输出，断言期间不关闭或重新打开已有 Tooltip。
    await expect(link).toHaveCSS(
      'color',
      level(await palette(page, 'packed-color-alternate-expected'), 'brand', 5),
    );
    // 在弹层保持打开的情况下移除边界，必须撤销旧镜像并回到默认全局语义。
    await page.getByTestId('packed-color-root').evaluate(
      // 移除公开标记模拟应用撤销局部主题，观察器需要自行发现并清理旧值。
      (element) => {
        element.classList.remove('packed-color-alternate');
        element.removeAttribute('data-semi-theme');
      },
    );
    await expect(link).toHaveCSS(
      'color',
      mode === 'dark' ? 'rgb(84, 169, 255)' : 'rgb(0, 100, 250)',
    );
    // click Tooltip 通过外部点击关闭，先移开弹层以免遮挡下一触发器。
    await page.getByTestId('packed-color-neighbor-button').click();
    await expect(link).not.toBeVisible();
    await page.getByRole('button', { name: '打开独立颜色提示', exact: true }).click();
    // 显式深色橙色容器即使源边界已撤销，也继续使用自己的主题。
    const customLink = page.getByTestId('packed-color-custom-link');
    await expect(customLink).toBeVisible();
    await expect(customLink).toHaveCSS(
      'color',
      level(await palette(page, 'packed-color-independent-expected'), 'brand', 5),
    );
    await expect(page.locator('#packed-color-popup-container')).toContainText('独立容器提示链接');
    // 显式容器提示同样使用公开的外部点击关闭行为。
    await page.getByTestId('packed-color-neighbor-button').click();
    await expect(customLink).not.toBeVisible();
    // 恢复页面状态控制的边界后打开 Select，核对共享 Popover 路径同样消费局部灰阶。
    await page.getByRole('button', { name: '切换局部颜色边界', exact: true }).click();
    await page.getByRole('button', { name: '切换局部颜色边界', exact: true }).click();
    await page.getByRole('combobox').click();
    const option = page.getByRole('option', { name: /颜色选项 Second$/ });
    await expect(option).toBeVisible();
    await expect(option).toHaveCSS('color', level(await palette(page), 'grey', 9));
    await page.getByTestId('packed-color-root').evaluate(
      // 保持下拉框打开，仅覆盖公开正文语义变量，验证 Popover 实时同步。
      (element) => element.style.setProperty('--semi-color-text-0', 'rgb(27, 47, 67)'),
    );
    await expect(option).toHaveCSS('color', 'rgb(27, 47, 67)');
  });
}

// 默认 body 和显式局部容器分别覆盖 Modal 主题来源及完整销毁/重开生命周期。
for (const custom of [false, true]) {
  // 同一声明式 Modal 的容器由公开 getPopupContainer 决定。
  test(`真实 tarball Modal 颜色主题及卸载清理：custom=${custom}`, async ({
    page,
    packedConsumer,
  }) => {
    await page.goto(packedConsumer.url + '?color-theme');
    // body 上的原值用于检查局部桥接绝不修改全局默认颜色或模式。
    const before = await page.locator('body').evaluate(
      // 只比较主题所有权，Modal 本身的滚动锁不属于本功能。
      (element) => ({
        theme: element.getAttribute('data-semi-theme'),
        mode: element.getAttribute('theme-mode'),
        primary: element.style.getPropertyValue('--semi-color-primary'),
      }),
    );
    const open = page.getByRole('button', {
      name: custom ? '打开独立颜色弹窗' : '打开默认颜色弹窗',
      exact: true,
    });
    await open.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    const expectedId = custom ? 'packed-color-independent-expected' : 'packed-color-expected';
    await expectPrimary(
      page.getByTestId('packed-color-modal-button'),
      await palette(page, expectedId),
    );
    // 不点击模态框外部：修改真实主题容器变量，验证已打开实例自动消费新颜色。
    const scope = custom
      ? page.locator('#packed-color-popup-container')
      : page.getByTestId('packed-color-root');
    await scope.evaluate(
      // 对语义变量做业务局部覆盖，不引入组件专用 CSS 或测试刷新方法。
      (element) => element.style.setProperty('--semi-color-primary', 'rgb(17, 37, 57)'),
    );
    await expect(page.getByTestId('packed-color-modal-button')).toHaveCSS(
      'background-color',
      'rgb(17, 37, 57)',
    );
    await dialog.getByRole('button', { name: 'cancel', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await open.click();
    await expect(dialog).toBeVisible();
    await expect(page.getByTestId('packed-color-modal-button')).toHaveCSS(
      'background-color',
      'rgb(17, 37, 57)',
    );
    await dialog.getByRole('button', { name: '卸载颜色弹窗', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.locator('.semi-portal[data-semi-theme="color-main"]')).toHaveCount(0);
    expect(
      await page.locator('body').evaluate(
        // 所有镜像只写 Portal，不得写入 body 的主题边界或颜色变量。
        (element) => ({
          theme: element.getAttribute('data-semi-theme'),
          mode: element.getAttribute('theme-mode'),
          primary: element.style.getPropertyValue('--semi-color-primary'),
        }),
      ),
    ).toEqual(before);
    // 已释放的主题不能残留到新实例；撤销业务覆盖后重新打开读取当前生成主题。
    await scope.evaluate(
      // 只有本测试写入的变量被撤销，业务容器的其他样式保持原样。
      (element) => element.style.removeProperty('--semi-color-primary'),
    );
    await open.click();
    await expectPrimary(
      page.getByTestId('packed-color-modal-button'),
      await palette(page, expectedId),
    );
  });
}

// 强制模式跨 Portal 时需使用触发源的实际计算值，同时保留再次切换模式的能力。
for (const mode of ['light', 'dark'] as const) {
  // 外层局部模式改变不能抹去源节点上的 always-dark，也不能丢失弹层内部的 always-light。
  test(`真实 tarball 强制颜色模式跨默认 Portal：${mode}`, async ({ page, packedConsumer }) => {
    await page.goto(packedConsumer.url + '?color-theme');
    await setMode(page, mode);
    await page.getByRole('button', { name: '打开固定深色颜色提示', exact: true }).click();
    // 两套期望来自公开色盘，而不是读取目标自身的 CSS 变量作为循环论证。
    const darkColors = await palette(page, 'packed-color-expected-dark');
    const lightColors = await palette(page, 'packed-color-expected-light');
    await expectPrimary(page.getByTestId('packed-color-force-popup-dark'), darkColors);
    await expectPrimary(page.getByTestId('packed-color-force-popup-light'), lightColors);
    // 内容确实脱离原局部 DOM 容器，排除未发生 Teleport 导致自然继承的假通过。
    await expect(
      page.getByTestId('packed-color-root').getByTestId('packed-color-force-popup-dark'),
    ).toHaveCount(0);
  });
}
