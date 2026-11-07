import type { Page } from '@playwright/test';
import { expect, test as packedTest } from './fixtures';

// 滚动条模式按测试隔离，不修改项目全局 Chromium 配置。
const test = packedTest.extend<{ zeroGutter: boolean }>({
  zeroGutter: [false, { option: true }],
  // 使用完整 Chromium；启动参数只控制滚动条实现，结束后释放本例浏览器。
  page: async ({ playwright, zeroGutter }, use) => {
    // 测试只切换 headless 隐藏滚动条参数，保留同一个完整 Chromium。
    const browser = await playwright.chromium.launch({
      channel: 'chromium',
      headless: true,
      // 经典模式禁用 Playwright 的隐藏滚动条参数；零占位对照保留默认 headless 行为。
      ignoreDefaultArgs: zeroGutter ? [] : ['--hide-scrollbars'],
    });
    try {
      // 与项目浏览器环境保持同一语言和时区。
      const page = await browser.newPage({ locale: 'zh-CN', timezoneId: 'Asia/Shanghai' });
      await use(page);
    } finally {
      await browser.close();
    }
  },
});

/** 读取根滚动区，避免把菜单内部或表格滚动误判为页面溢出。 */
async function rootGeometry(page: Page) {
  // 在浏览器中测量实际 CSS 像素，不由截图推测滚动条尺寸。
  return page.evaluate(() => ({
    width: innerWidth,
    height: innerHeight,
    clientWidth: document.documentElement.clientWidth,
    clientHeight: document.documentElement.clientHeight,
    scrollWidth: document.documentElement.scrollWidth,
    scrollHeight: document.documentElement.scrollHeight,
    x: scrollX,
    y: scrollY,
  }));
}

/** 用真实滚动容器校验占位尺寸，防止隐藏滚动条误充经典模式。 */
async function verifyScrollbarMode(page: Page, zeroGutter: boolean) {
  if (!zeroGutter) {
    // 自定义原生滚动条尺寸强制占位，仅改变滚动条实现，不限制宿主溢出。
    await page.addStyleTag({ content: '::-webkit-scrollbar { width: 15px; height: 15px; }' });
  }
  // 临时校准容器不参与菜单布局，测量结束立即移除。
  const gutter = await page.evaluate(() => {
    // 100px 校准盒只用于测量 scrollbar，不贡献持续的根页面溢出。
    const probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;left:0;top:0;width:100px;height:100px;overflow:scroll';
    document.body.append(probe);
    // offsetWidth 含滚动条，clientWidth 不含滚动条；差值单位为 CSS px。
    const width = probe.offsetWidth - probe.clientWidth;
    probe.remove();
    return width;
  });
  expect(gutter).toBe(zeroGutter ? 0 : 15);
}

/** 等待真实定位终态，并断言整个菜单与菜单项都在视口内。 */
async function expectContained(page: Page) {
  // Tooltip 在 Portal 插入后才显示，先排除尚未完成定位的状态。
  const popup = page.locator('.semi-dropdown-wrapper-show');
  await expect(popup).toBeVisible();
  // 每次采样均读取最新 DOM，允许定位事件正常完成，不使用固定延时。
  await expect
    .poll(async () =>
      popup.evaluate((element) => {
        // 菜单外框与各项均须完整可见；0.5px 仅容纳 CSS 子像素舍入。
        const elements = [element, ...element.querySelectorAll('.semi-dropdown-item')];
        // 检查四条边，避免只修正右侧却遗漏底部。
        return elements.every((item) => {
          // 每项的真实边界必须与外框一样完整位于视口中。
          const box = item.getBoundingClientRect();
          return (
            box.left >= -0.5 &&
            box.top >= -0.5 &&
            box.right <= innerWidth + 0.5 &&
            box.bottom <= innerHeight + 0.5
          );
        });
      }),
    )
    .toBe(true);
}

// 原问题尺寸、小窗口和更大内容区；不把宿主 overflow:hidden 当作修复。
const viewports = [
  { width: 1100, height: 728 },
  { width: 760, height: 528 },
  { width: 1440, height: 900 },
];
// 分别验证真实占位滚动条和默认 headless 零占位几何；后者不等同原生浮动滚动条。
for (const zeroGutter of [false, true]) {
  // 每组使用独立浏览器启动参数；菜单测试本身不注入修正样式。
  test.describe(`Dropdown 滚动区 zeroGutter=${zeroGutter}`, () => {
    test.use({ zeroGutter: zeroGutter });
    for (const viewport of viewports) {
      // 每个视口复验公开参数优先级，而不是只检查内部绑定值。
      test(`真实 tarball 防溢出与参数优先级 ${viewport.width}×${viewport.height}`, async ({
        page,
        packedConsumer,
      }, testInfo) => {
        await page.setViewportSize(viewport);
        await testInfo.attach('package-origin', {
          body: JSON.stringify(packedConsumer.provenance),
          contentType: 'application/json',
        });
        // false 对照必须确实越界，证明样例能捕捉原缺陷。
        const cases = [
          { query: 'dropdown=omitted', adjusts: true },
          { query: 'dropdown=undefined', adjusts: true },
          { query: 'dropdown=true', adjusts: true },
          { query: 'dropdown=false', adjusts: false },
          { query: 'dropdown=omitted&global=true', adjusts: true },
          { query: 'dropdown=omitted&global=false', adjusts: false },
          { query: 'dropdown=undefined&global=false', adjusts: false },
          { query: 'dropdown=true&global=false', adjusts: true },
          { query: 'dropdown=false&global=true', adjusts: false },
          { query: 'dropdown=omitted&tooltip=false', adjusts: false },
          { query: 'dropdown=omitted&global=true&tooltip=false', adjusts: true },
        ];
        for (const entry of cases) {
          await page.goto(packedConsumer.url + '?' + entry.query);
          await verifyScrollbarMode(page, zeroGutter);
          // 先确认真实触发器已经挂载，避免加载前的空文档采样。
          const trigger = page.getByRole('button', { name: '导出', exact: true });
          await expect(trigger).toBeVisible();
          const before = await rootGeometry(page);
          expect(before.scrollWidth).toBe(before.width);
          expect(before.scrollHeight).toBe(before.height);
          await trigger.click();
          const popup = page.locator('.semi-dropdown-wrapper-show');
          await expect(popup).toBeVisible();
          if (entry.adjusts) {
            await expectContained(page);
            expect(await rootGeometry(page)).toEqual(before);
            await expect(popup).toHaveAttribute('x-placement', 'bottomRight');
          } else {
            await expect(popup).toHaveAttribute('x-placement', 'bottom');
            // 显式关闭调整时，右侧场景必须仍能展示越界。
            await expect
              .poll(async () => (await rootGeometry(page)).scrollWidth)
              .toBeGreaterThan(before.width);
          }
          await page.keyboard.press('Escape');
          await expect(popup).toHaveCount(0);
          await expect(trigger).toBeFocused();
          // 退出动效卸载后，浏览器可能到下一次布局才回收显式 false 对照撑大的滚动区。
          await expect.poll(() => rootGeometry(page)).toEqual(before);
        }
      });
    }

    // 多次打开、内容更新、窗口缩放和四角定位均使用未传参数的默认路径。
    test('四角、内容变化、缩放与键盘/外部关闭保持默认契约', async ({
      page,
      packedConsumer,
    }, testInfo) => {
      for (const corner of ['top-right', 'top-left', 'bottom-right', 'bottom-left']) {
        await page.setViewportSize(viewports[0]!);
        await page.goto(packedConsumer.url + '?dropdown=omitted&corner=' + corner);
        await verifyScrollbarMode(page, zeroGutter);
        const trigger = page.getByRole('button', { name: '导出', exact: true });
        const items = page.getByRole('menuitem');
        await trigger.click();
        await expectContained(page);
        await expect(items.nth(0)).toBeFocused();
        await page.keyboard.press('ArrowDown');
        await expect(items.nth(1)).toBeFocused();
        await page.keyboard.press('Enter');
        await expect(page.getByRole('status')).toHaveText('已选择 Excel');
        await page.keyboard.press('Escape');
        await expect(items).toHaveCount(0);
        await expect(trigger).toBeFocused();
        await trigger.click();
        await expectContained(page);
        // 按钮是菜单外部目标：点击应关闭菜单，同时改变下一次的内容。
        await page.getByRole('button', { name: '切换菜单内容' }).click();
        await expect(items).toHaveCount(0);
        await trigger.click();
        await expect(items.nth(1)).toContainText('更多导出选项');
        await expectContained(page);
        for (const viewport of [viewports[1]!, viewports[2]!, viewports[0]!]) {
          await page.setViewportSize(viewport);
          await expectContained(page);
          const root = await rootGeometry(page);
          expect(root.scrollWidth).toBe(root.width);
          expect(root.scrollHeight).toBe(root.height);
          expect(root.clientWidth).toBe(root.width);
          expect(root.clientHeight).toBe(root.height);
          expect(root.x).toBe(0);
          expect(root.y).toBe(0);
        }
        if (corner === 'top-right') {
          await testInfo.attach('default-dropdown', {
            body: await page.screenshot(),
            contentType: 'image/png',
          });
        }
        // 用鼠标选择检查菜单事件，不由键盘路径代替真实点击。
        await items.nth(0).click();
        await expect(page.getByRole('status')).toHaveText('已选择文本');
        await page.keyboard.press('Escape');
        await expect(items).toHaveCount(0);
      }
    });
  });
}
