import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildColors, readColorBaseline } from '../packages/theme-default/build-colors.mjs';

/** 独立构建可发布工具，验收生成后的真实入口而非测试专用适配器。 */
let root;
/** 构建后的纯 ESM API。 */
let api;
/** 固定 vendor 编译得到的颜色数据，验证语义不凭手工副本推测。 */
const baseline = readColorBaseline();

/** 所有测试共用一次构建；未修改主题包的默认 CSS。 */
beforeAll(async () => {
  root = await mkdtemp(path.join(tmpdir(), 'semi-color-tools-'));
  await buildColors(root);
  api = await import(pathToFileURL(path.join(root, 'index.mjs')).href);
});

/** 清理只属于此测试的临时包。 */
afterAll(async () => {
  await rm(root, { recursive: true, force: true });
});

/** 验证算法之上的固定基线映射、序列化和独立包入口。 */
describe('公开颜色主题工具', () => {
  /** 结构可保存为 JSON，主色与 info 保持独立。 */
  it('输出双模式完整色盘及固定语义映射', () => {
    /** 短 HEX 也必须规范化为完整小写颜色。 */
    const theme = api.createColorTheme({ brand: '#93F' });
    expect(theme.brand).toBe('#9933ff');
    expect(theme.version).toBe(1);
    expect(JSON.parse(JSON.stringify(theme))).toEqual(theme);
    for (const mode of ['light', 'dark']) {
      expect(Object.keys(theme.palette[mode])).toHaveLength(17);
      expect(theme.variables[mode]['--semi-brand-5']).toMatch(/^\d+, \d+, \d+$/);
      expect(theme.variables[mode]['--semi-color-primary']).toBe('rgba(var(--semi-brand-5), 1)');
      expect(theme.variables[mode]['--semi-color-info']).toBe(baseline[mode]['--semi-color-info']);
      expect(theme.variables[mode]['--semi-color-success']).toBe(
        baseline[mode]['--semi-color-success'],
      );
      expect(theme.variables[mode]['--semi-color-link-hover']).toBe('rgba(var(--semi-brand-6), 1)');
      expect(theme.variables[mode]['--semi-color-focus-border']).toBe(
        'rgba(var(--semi-brand-5), 1)',
      );
      expect(theme.variables[mode]['--semi-color-ai-purple']).toBe(
        baseline[mode]['--semi-color-ai-purple'],
      );
      expect(theme.variables[mode]['--semi-color-data-0']).toBe(
        baseline[mode]['--semi-color-data-0'],
      );
      expect(theme.variables[mode]['--semi-shadow-elevated']).toBe(
        baseline[mode]['--semi-shadow-elevated'],
      );
      expect(
        Object.keys(theme.variables[mode]).some(
          /** 颜色主题不得重置排版或圆角。 */
          (name) => /font|line-height|border-radius/.test(name),
        ),
      ).toBe(false);
    }
    expect(theme.variables.light['--semi-color-primary-light-default']).toBe(
      'rgba(var(--semi-brand-0), 1)',
    );
    expect(theme.variables.dark['--semi-color-primary-light-default']).toBe(
      'rgba(var(--semi-brand-5), .2)',
    );
  });

  /** 返回对象彼此独立，不泄露共享可变默认表。 */
  it('业务修改结果不污染后续主题或固定默认颜色', () => {
    /** 默认 CSS 蓝色与算法蓝色不同，不能重生成默认基线。 */
    const theme = api.createColorTheme({ brand: '#0077fa' });
    expect(baseline.light['--semi-blue-5'].replaceAll(' ', '')).toBe('0,100,250');
    expect(theme.variables.light['--semi-brand-5']).toBe('0, 119, 250');
    theme.variables.light['--semi-color-text-0'] = 'red';
    expect(api.createColorTheme({ brand: '#0077fa' }).variables.light['--semi-color-text-0']).toBe(
      baseline.light['--semi-color-text-0'],
    );
  });

  /** 两套载体必须引用各自模式，避免在根节点提前消费错误色盘。 */
  it('输出稳定普通 CSS，嵌套强制模式使用最近主题的载体', () => {
    /** 两种选择器分别由应用自己的模式属性选择。 */
    const selectors = {
      light: '[data-semi-theme="a"][theme-mode="light"]',
      dark: '[data-semi-theme="a"][theme-mode="dark"]',
    };
    /** 无 DOM 的生成结果可直接写入 CSS 文件。 */
    const theme = api.createColorTheme({ brand: '#7c3aed' });
    /** 稳定序列化可直接作为缓存和发布内容。 */
    const css = api.colorThemeToCss(theme, { selectors });
    expect(css).toBe(api.colorThemeToCss(theme, { selectors }));
    expect(css).toContain(
      '--semi-theme-dark-color-primary: rgba(var(--semi-theme-dark-brand-5), 1);',
    );
    expect(css).toContain('--semi-color-primary: var(--semi-theme-dark-color-primary);');
    expect(css).toContain('.semi-always-light');
    expect(css).toContain('.semi-always-dark');
    expect(css).not.toMatch(/@import|scss|font-size|border-radius/);
    expect(() => api.colorThemeToCss(theme, { selectors: { light: '', dark: 'body' } })).toThrow(
      TypeError,
    );
    expect(() =>
      api.colorThemeToCss(theme, { selectors: { light: 'body{}', dark: 'body' } }),
    ).toThrow(TypeError);
  });

  /** 新入口不导入 CSS、Sass、Node 文件系统或 vendor，允许无 DOM 使用。 */
  it('发布入口只依赖包内 ESM 和静态基线', async () => {
    for (const file of ['index.mjs', 'theme.mjs', 'palette.mjs', 'baseline.mjs']) {
      /** 检查构建产物而非源码目录。 */
      const source = await readFile(path.join(root, file), 'utf8');
      expect(source).not.toMatch(/(?:from|import\()\s*['"](?:node:|sass|.*\.css|.*vendor)/);
    }
    expect(Object.keys(api).sort()).toEqual([
      'colorThemeToCss',
      'createColorTheme',
      'generateColorPalette',
      'generateColorScale',
    ]);
  });
});
