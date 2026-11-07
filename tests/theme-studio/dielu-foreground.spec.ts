import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

/** 从真实组件及其伪元素读取所有背景，覆盖间接变量和图标容器。 */
async function backgrounds(page: Page) {
  return page.getByTestId('global-scope').evaluate(
    /** 排版可能改变尺寸，因此只比较背景色和背景图的最终值。 */
    async (scope) => {
      // 新增状态样本也有原生颜色过渡；采样前等待实际过渡结束，不记录中间帧。
      await Promise.all(
        scope
          .getAnimations({ subtree: true })
          .filter(
            /** 只等待有限的 CSS transition，不等待无关的循环动画。 */
            (animation) => animation instanceof CSSTransition,
          )
          .map(
            /** finished 由浏览器完成事件驱动，无固定等待。 */
            (animation) => animation.finished,
          ),
      );
      return [...scope.querySelectorAll('*')].map(
        /** 伪元素也可能消费共享 text/border 变量，必须一起检查。 */
        (element) =>
          ['', '::before', '::after'].map(
            /** 不读取库内部状态，只读取浏览器可观察样式。 */
            (pseudo) => {
              /** 未使用的伪元素样式也有稳定的默认背景值。 */
              const style = getComputedStyle(element, pseudo || null);
              return [style.backgroundColor, style.backgroundImage, style.boxShadow];
            },
          ),
      );
    },
  );
}

/** 把指针停在固定页眉，避免字体加载或布局变化后落到场景控件上。 */
async function restPointer(page: Page): Promise<void> {
  await page.getByRole('link', { name: 'Theme Studio 首页', exact: true }).hover();
}

/** 页面使用真实字体文件，中文继续由来源字体栈的系统回退处理。 */
async function loadedFonts(page: Page): Promise<void> {
  await page.evaluate(
    /** fonts.ready 由浏览器实际字体加载完成事件决定，不增加固定延时。 */
    async () => {
      await document.fonts.ready;
    },
  );
  expect(
    await page.evaluate(
      /** 确认两个真实 variable 字体已经加载，避免仅验证 font-family 字符串。 */
      () =>
        [...document.fonts]
          .filter(
            /** 忽略其他未使用的字符子集，至少应有实际加载的 UI 与代码字体。 */
            (face) => face.status === 'loaded' && /Space Grotesk|JetBrains Mono/.test(face.family),
          )
          .map(
            /** 只返回用户可见字体名称。 */
            (face) => face.family,
          ),
    ),
  ).toEqual(
    expect.arrayContaining([
      expect.stringContaining('Space Grotesk'),
      expect.stringContaining('JetBrains Mono'),
    ]),
  );
}

/** 两种模式都保留之前的品牌/圆角，同时新增排版与前景不改变任何现有背景或光晕。 */
for (const dark of [false, true]) {
  /** 每例使用独立浏览器上下文，避免另一种模式的覆盖或字体状态影响断言。 */
  test(`${dark ? '深色' : '浅色'}迁移排版与前景，背景、填充和阴影保持原样`, async ({ page }) => {
    await page.goto('/#/tokens');
    await page.getByRole('button', { name: '应用迭鹿预设', exact: true }).click();
    await page.getByRole('button', { name: '主题预览', exact: true }).click();
    await page.getByRole('switch', { name: '全局深色模式', exact: true }).setChecked(dark);
    await restPointer(page);
    // 先确认真实开关外观已采用目标模式，再采样完整场景。
    await expect(page.getByTestId('global-card').locator('.semi-switch')).toHaveCSS(
      'background-color',
      dark ? 'rgb(93, 194, 100)' : 'rgb(59, 179, 70)',
    );
    /** 所有场景组件均来自当前主题的实际公开组件。 */
    const before = await backgrounds(page);
    // 预览页不展示编辑器，回到编辑页应用新迁移，再回同一场景比较。
    await page.getByRole('button', { name: '全局样式定制', exact: true }).click();
    await page.getByRole('button', { name: '应用排版与前景', exact: true }).click();
    await page.getByRole('button', { name: '主题预览', exact: true }).click();
    await restPointer(page);
    await loadedFonts(page);
    await expect(page.getByTestId('global-text')).toHaveCSS(
      'color',
      dark ? 'rgb(238, 240, 244)' : 'rgb(29, 33, 41)',
    );
    await expect(page.getByTestId('global-text')).toHaveCSS(
      'font-family',
      /Space Grotesk Variable/,
    );
    await expect(page.getByTestId('global-code').locator('code')).toHaveCSS(
      'font-family',
      /JetBrains Mono Variable/,
    );
    expect(await backgrounds(page)).toEqual(before);

    await expect(page.getByTestId('global-primary')).toHaveCSS(
      'background-color',
      'rgb(91, 90, 247)',
    );
  });
}

/** 悬浮和聚焦只改描边；来源的背景切换与 4px 光晕不在本次迁移范围。 */
test('输入框悬浮和焦点迁移描边但不迁移背景与光晕', async ({ page }) => {
  await page.goto('/#/components');
  await page.getByRole('button', { name: 'Input 输入框', exact: true }).click();
  /** 明确选择正常输入，排除错误状态示例。 */
  const input = page.getByRole('textbox', { name: '预览主题名称', exact: true });
  /** 通过包含公开输入的 wrapper 读取真实边框。 */
  const wrapper = page
    .getByTestId('component-gallery')
    .locator('.semi-input-wrapper')
    .filter({ has: input });
  await input.hover();
  /** 悬浮背景单独保存，不能用默认态作为悬浮预期。 */
  const hoverBefore = await wrapper.evaluate(
    /** 仅记录此状态允许保留的背景与光晕。 */
    (element) => ({
      bg: getComputedStyle(element).backgroundColor,
      shadow: getComputedStyle(element).boxShadow,
    }),
  );
  await input.focus();
  /** 聚焦样式由浏览器真实焦点触发。 */
  const focusBefore = await wrapper.evaluate(
    /** 同一状态在迁移前后应保持背景与阴影完全一致。 */
    (element) => ({
      bg: getComputedStyle(element).backgroundColor,
      shadow: getComputedStyle(element).boxShadow,
    }),
  );
  await page.getByRole('button', { name: '应用排版与前景', exact: true }).click();
  await input.hover();
  await expect(wrapper).toHaveCSS('border-top-color', 'rgb(201, 205, 212)');
  await expect(wrapper).toHaveCSS('background-color', hoverBefore.bg);
  await expect(wrapper).toHaveCSS('box-shadow', hoverBefore.shadow);
  await input.focus();
  await expect(wrapper).toHaveCSS('border-top-color', 'rgb(91, 90, 247)');
  await expect(wrapper).toHaveCSS('background-color', focusBefore.bg);
  await expect(wrapper).toHaveCSS('box-shadow', focusBefore.shadow);
});

/** 新迁移和历史/文件共用同一文档模型，不允许导出时夹带背景覆盖。 */
test('前景迁移可撤销并通过 JSON 恢复，文件不包含背景相关覆盖', async ({ page }) => {
  await page.goto('/#/tokens');
  await page.getByRole('button', { name: '应用排版与前景', exact: true }).click();
  await expect(page.getByTestId('global-text')).toHaveCSS('color', 'rgb(29, 33, 41)');
  await page.getByRole('button', { name: '撤销修改', exact: true }).click();
  await expect(page.getByTestId('global-text')).not.toHaveCSS('font-family', /Space Grotesk/);
  await page.getByRole('button', { name: '重做修改', exact: true }).click();
  await expect(page.getByTestId('global-text')).toHaveCSS('font-family', /Space Grotesk/);
  await page.getByRole('button', { name: '导出', exact: true }).click();
  /** 通过真实下载验证序列化内容。 */
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载 JSON', exact: true }).click();
  /** 下载内容在测试结束后由 Playwright 清理。 */
  const download = await pending;
  /** 文件存在才继续验证导入。 */
  const path = await download.path();
  expect(path).not.toBeNull();
  /** 原始 JSON 用于结构审查及同一文件往返。 */
  const json = await readFile(path!, 'utf8');
  /** 此处仅约束测试关心的文件字段。 */
  const document = JSON.parse(json) as {
    overrides: Record<'light' | 'dark', Record<string, string>>;
  };
  for (const mode of ['light', 'dark'] as const) {
    expect(
      Object.keys(document.overrides[mode]).every(
        /** 禁止通用 text/border 等会间接用于背景的变量，迁移只使用专用前景变量。 */
        (name) => name.startsWith('--studio-dielu-'),
      ),
    ).toBe(true);
    expect(JSON.stringify(document.overrides[mode])).not.toMatch(
      /background|fill|shadow|overlay|gradient|ring/,
    );
  }
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: '复原主题', exact: true }).click();
  await page.getByLabel('导入主题文件', { exact: true }).setInputFiles({
    name: 'foreground.json',
    mimeType: 'application/json',
    buffer: Buffer.from(json),
  });
  await expect(page.getByRole('status')).toHaveText('已导入主题');
  await expect(page.getByTestId('global-text')).toHaveCSS('color', 'rgb(29, 33, 41)');
  await expect(page.getByTestId('global-text')).toHaveCSS('font-family', /Space Grotesk/);
  await expect(page.getByTestId('global-primary')).toHaveCSS(
    'background-color',
    'rgb(0, 100, 250)',
  );
});
