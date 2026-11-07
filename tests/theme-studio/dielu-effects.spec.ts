import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';

/** 使用已有预设作为当前主题，效果迁移不得重新调整其背景和填充。 */
async function prepare(page: Page, dark: boolean, effects: boolean): Promise<void> {
  await page.goto('/#/tokens');
  await page.getByRole('button', { name: '应用迭鹿预设', exact: true }).click();
  await page.getByRole('button', { name: '应用排版与前景', exact: true }).click();
  await page.getByRole('switch', { name: '工作区深色模式', exact: true }).setChecked(dark);
  if (effects) await page.getByRole('button', { name: '应用阴影与交互', exact: true }).click();
  await page.getByRole('button', { name: '主题预览', exact: true }).click();
  await page.getByRole('button', { name: '阴影与交互', exact: true }).click();
}

/** 读取控件全部后代及伪元素背景，同时确认外扩阴影没有改变控件高度。 */
async function surfaces(target: Locator) {
  return target.evaluate(
    /** 实际 CSS 属性包含库的 hover/focus/校验反馈，不能只检查变量键。 */
    (root) => ({
      height: root.getBoundingClientRect().height,
      backgrounds: [root, ...root.querySelectorAll('*')].map(
        /** 图标和伪元素也可能通过 currentColor 或共享变量形成填充。 */
        (element) =>
          ['', '::before', '::after'].map(
            /** 比较背景图和色值，允许本次授权的阴影变化。 */
            (pseudo) => {
              /** 使用浏览器最终合成前的样式，避免截图抗锯齿影响判断。 */
              const style = getComputedStyle(element, pseudo || null);
              return [style.backgroundColor, style.backgroundImage];
            },
          ),
      ),
    }),
  );
}

/** 收起弹层并把焦点和鼠标移出控件，真实触发 blur 而不是修改组件状态。 */
async function rest(page: Page): Promise<void> {
  await page.keyboard.press('Escape');
  await page.getByRole('heading', { name: '主题效果总览', exact: true }).click();
}

/** 校验多种控件的背景完全保留，正常、错误和警告光晕使用各自的当前语义色。 */
for (const dark of [false, true]) {
  /** 两页共享浏览器配置但拥有独立编辑会话，按相同真实状态逐项比较。 */
  test(`${dark ? '深色' : '浅色'}光晕适配保留输入与选择器各状态的背景填充`, async ({
    page,
    context,
  }) => {
    /** 原主题页面提供迁移前的实际对照。 */
    const before = await context.newPage();
    await prepare(before, dark, false);
    await prepare(page, dark, true);
    /** 控件来源：当前组件场景中的正常/错误/警告单行、多行与 Select。 */
    const cases = [
      ['预览主题名称', '.semi-input-wrapper', false],
      ['预览错误输入', '.semi-input-wrapper', false],
      ['交互警告输入', '.semi-input-wrapper', false],
      ['交互多行输入', '.semi-input-textarea-wrapper', false],
      ['交互多行错误', '.semi-input-textarea-wrapper', false],
      ['交互多行警告', '.semi-input-textarea-wrapper', false],
      ['主题状态', '.semi-select', true],
      ['错误选择', '.semi-select', true],
      ['警告选择', '.semi-select', true],
    ] as const;
    /** 记录三种语义的真实阴影，验证校验状态没有全部变成品牌光晕。 */
    const glows: string[] = [];
    for (const [name, selector, select] of cases) {
      /** 原生输入和绘制容器分别定位；Select 的 combobox 本身就是容器。 */
      const control = page.getByRole(select ? 'combobox' : 'textbox', { name, exact: true });
      /** 迁移前使用同名的独立控件。 */
      const original = before.getByRole(select ? 'combobox' : 'textbox', { name, exact: true });
      /** 不把带场景祖先的 locator 放进 has，避免相对匹配失去边界。 */
      const wrapper = select ? control : page.locator(selector).filter({ has: control });
      /** 同一公开绘制节点用于背景和高度对照。 */
      const originalWrapper = select
        ? original
        : before.locator(selector).filter({ has: original });
      await originalWrapper.hover();
      /** hover 背景应与迁移前的 hover 比较，不和默认态混用。 */
      const hoverBefore = await surfaces(originalWrapper);
      await wrapper.hover();
      await expect(wrapper).toHaveCSS('box-shadow', /2px/);
      expect(await surfaces(wrapper)).toEqual(hoverBefore);
      if (select) {
        await original.click();
        await control.click();
      } else {
        await original.focus();
        await control.focus();
      }
      await expect(wrapper).toHaveCSS('box-shadow', /4px/);
      expect(await surfaces(wrapper)).toEqual(await surfaces(originalWrapper));
      glows.push(
        await wrapper.evaluate(
          /** 不读预设内部状态，只比较浏览器绘制的语义结果。 */
          (element) => getComputedStyle(element).boxShadow,
        ),
      );
      await rest(before);
      await rest(page);
      await expect(wrapper).toHaveCSS('box-shadow', 'none');
    }
    expect(new Set(glows.slice(0, 3)).size).toBe(3);
    for (const name of ['交互禁用输入', '交互只读输入', '交互无边框输入']) {
      /** 这些控件不参与新增交互反馈，但仍保留库自身的背景状态。 */
      const input = page.getByRole('textbox', { name, exact: true });
      /** 每个输入具有独立 wrapper。 */
      const wrapper = page.locator('.semi-input-wrapper').filter({ has: input });
      await wrapper.hover();
      await expect(wrapper).toHaveCSS('box-shadow', 'none');
    }
    await expect(page.getByRole('textbox', { name: '交互只读输入', exact: true })).toHaveAttribute(
      'readonly',
      '',
    );
    await expect(page.getByTestId('local-primary')).not.toHaveCSS('transition-duration', '0.15s');
    await expect(page.getByTestId('baseline-primary')).not.toHaveCSS(
      'transition-duration',
      '0.15s',
    );
  });
}

/** 卡片和默认 Portal 使用分层阴影，表面背景、遮罩以及提示箭头继续由当前主题提供。 */
test('卡片、下拉、提示和弹窗只适配阴影且保留现有背景', async ({ page, context }) => {
  /** 对照页面不启用新效果。 */
  const before = await context.newPage();
  await prepare(before, true, false);
  await prepare(page, true, true);
  /** 悬浮卡片的 API 仍生效，默认态不提前绘制阴影。 */
  const card = page.locator('.semi-card-shadows-hover');
  await expect(card).toHaveCSS('box-shadow', 'none');
  await card.hover();
  await expect(card).not.toHaveCSS('box-shadow', 'none');
  for (const [trigger, target] of [
    ['global主题提示', '.semi-tooltip-wrapper'],
    ['global打开弹窗', '.semi-modal-content'],
  ] as const) {
    await before.getByRole('button', { name: trigger, exact: true }).click();
    await page.getByRole('button', { name: trigger, exact: true }).click();
    /** 排除关闭后的留存节点，比较当前可见的真实浮层。 */
    const current = page.locator(target!).filter({ visible: true });
    /** 相同模式的 Portal 对照。 */
    const original = before.locator(target!).filter({ visible: true });
    if (target === '.semi-modal-content') {
      // 默认 Portal 通过观察器同步主题，先确认内部开关已采用深色再比较全部背景。
      await expect(current.locator('.semi-switch')).toHaveCSS(
        'background-color',
        'rgb(93, 194, 100)',
      );
      await expect(original.locator('.semi-switch')).toHaveCSS(
        'background-color',
        'rgb(93, 194, 100)',
      );
    }
    expect(await surfaces(current)).toEqual(await surfaces(original));
    await expect(current).not.toHaveCSS(
      'box-shadow',
      await original.evaluate(
        /** 阴影必须实际变化，不能只有预设变量存在。 */
        (element) => getComputedStyle(element).boxShadow,
      ),
    );
    if (target === '.semi-modal-content') {
      await expect(page.locator('.semi-modal-mask')).toHaveCSS(
        'background-color',
        await before.locator('.semi-modal-mask').evaluate(
          /** 遮罩属于背景范围，必须保持原值。 */
          (element) => getComputedStyle(element).backgroundColor,
        ),
      );
      await page.keyboard.press('Escape');
      await before.keyboard.press('Escape');
    } else {
      await page.getByRole('button', { name: '关闭提示', exact: true }).click();
      await before.getByRole('button', { name: '关闭提示', exact: true }).click();
    }
  }
  await page.getByRole('combobox', { name: '主题状态', exact: true }).click();
  await before.getByRole('combobox', { name: '主题状态', exact: true }).click();
  expect(await surfaces(page.locator('.semi-popover-wrapper'))).toEqual(
    await surfaces(before.locator('.semi-popover-wrapper')),
  );
  await expect(page.locator('.semi-popover-wrapper')).toHaveCSS('box-shadow', /32px/);
});

/** 新效果跟随当前品牌且尊重系统减少动态效果偏好，不改变背景状态切换。 */
test('光晕跟随当前焦点色并支持减少动态效果', async ({ page }) => {
  await page.goto('/#/tokens');
  await page.getByRole('button', { name: '应用阴影与交互', exact: true }).click();
  await page.getByRole('textbox', { name: '全局品牌 HEX', exact: true }).fill('#b43868');
  await page.getByRole('textbox', { name: '全局品牌 HEX', exact: true }).press('Enter');
  /** 正常输入实际使用工作台当前主题焦点色。 */
  const input = page.getByRole('textbox', { name: 'global主题名称', exact: true });
  /** 预览表单中的正常输入。 */
  const wrapper = page.locator('.semi-input-wrapper').filter({ has: input });
  await input.focus();
  await expect(wrapper).toHaveCSS('transition-duration', '0.15s');
  await expect(wrapper).toHaveCSS('box-shadow', /4px/);
  /** 同一控件改变当前焦点色后必须重新解析光晕，不能固定为来源紫色。 */
  const first = await wrapper.evaluate(
    /** 保存实际绘制值供后续比较。 */
    (element) => getComputedStyle(element).boxShadow,
  );
  await page.getByRole('textbox', { name: '全局品牌 HEX', exact: true }).fill('#00886c');
  await page.getByRole('textbox', { name: '全局品牌 HEX', exact: true }).press('Enter');
  await input.focus();
  await expect(wrapper).not.toHaveCSS('box-shadow', first);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(wrapper).toHaveCSS('transition-duration', '0s');
  await expect(wrapper).toHaveCSS('box-shadow', /4px/);
});

/** 效果可撤销和导入，导出的覆盖只包含阴影/过渡，不夹带背景变量。 */
test('效果迁移保留自定义填充并通过 JSON 与 CSS 交付', async ({ page, context }) => {
  await page.goto('/#/components');
  await page.getByRole('button', { name: 'Input 输入框', exact: true }).click();
  await page.getByRole('button', { name: '编辑输入框背景', exact: true }).click();
  await page.getByRole('textbox', { name: 'CSS 变量值', exact: true }).fill('#e9edf7');
  await page.getByRole('button', { name: '应用变量', exact: true }).click();
  await page.getByRole('button', { name: '应用阴影与交互', exact: true }).click();
  /** 用户已有的显式填充覆盖继续生效。 */
  const input = page.getByRole('textbox', { name: '预览主题名称', exact: true });
  /** 与编辑器中的真实公开组件对应。 */
  const wrapper = page.locator('.semi-input-wrapper').filter({ has: input });
  await input.focus();
  await expect(wrapper).toHaveCSS('background-color', 'rgb(233, 237, 247)');
  await expect(wrapper).toHaveCSS('box-shadow', /4px/);
  await page.getByRole('button', { name: '撤销修改', exact: true }).click();
  await input.focus();
  await expect(wrapper).toHaveCSS('box-shadow', 'none');
  await page.getByRole('button', { name: '重做修改', exact: true }).click();
  await page.getByRole('button', { name: '导出', exact: true }).click();
  /** 同一导出界面读取两种实际下载文件。 */
  const files: Record<string, string> = {};
  for (const kind of ['JSON', 'CSS']) {
    /** 监听必须先于快速 Blob 下载。 */
    const pending = page.waitForEvent('download');
    await page.getByRole('button', { name: `下载 ${kind}`, exact: true }).click();
    /** Playwright 管理临时下载文件。 */
    const download = await pending;
    /** 路径用于读取本次实际交付件。 */
    const path = await download.path();
    expect(path).not.toBeNull();
    files[kind] = await readFile(path!, 'utf8');
  }
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: '复原主题', exact: true }).click();
  await page.getByLabel('导入主题文件', { exact: true }).setInputFiles({
    name: 'effects.json',
    mimeType: 'application/json',
    buffer: Buffer.from(files.JSON!),
  });
  await expect(page.getByRole('status')).toHaveText('已导入主题');
  await input.focus();
  await expect(wrapper).toHaveCSS('background-color', 'rgb(233, 237, 247)');
  await expect(wrapper).toHaveCSS('box-shadow', /4px/);
  /** 独立页面只消费默认 CSS 与导出的样式，不包含工作台 Vue 状态。 */
  const consumer = await context.newPage();
  /** 公开主题结构样式供消费者使用。 */
  const base = await readFile('packages/theme-default/dist/index.css', 'utf8');
  await consumer.setContent(
    `<style>${base}</style><style>${files.CSS}</style><div class="theme-studio-theme" theme-mode="light"><div class="semi-input-wrapper"><input aria-label="consumer" class="semi-input"></div><div data-semi-theme="studio-local"><div class="semi-input-wrapper"><input aria-label="local" class="semi-input"></div></div></div>`,
  );
  await consumer.getByRole('textbox', { name: 'consumer', exact: true }).focus();
  await expect(consumer.locator('.semi-input-wrapper').first()).toHaveCSS('box-shadow', /4px/);
  await consumer.getByRole('textbox', { name: 'local', exact: true }).focus();
  await expect(consumer.locator('[data-semi-theme=studio-local] .semi-input-wrapper')).toHaveCSS(
    'box-shadow',
    'none',
  );
  await consumer.emulateMedia({ reducedMotion: 'reduce' });
  await expect(consumer.locator('.semi-input-wrapper').first()).toHaveCSS(
    'transition-duration',
    '0s',
  );
});
