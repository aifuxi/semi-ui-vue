import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  generateColorPalette,
  generateColorScale,
} from '../packages/theme-default/colors/palette.mjs';

/** 预期值由独立 DSM 发布脚本产生，测试不再请求网络或执行上游实现。 */
const reference = JSON.parse(
  readFileSync(new URL('./fixtures/semi-color-reference.json', import.meta.url), 'utf8'),
);
/** 字段顺序是公开命名色盘的稳定输出顺序，品牌色独立于蓝色。 */
const paletteNames = [
  'red',
  'pink',
  'purple',
  'violet',
  'indigo',
  'blue',
  'light-blue',
  'cyan',
  'teal',
  'green',
  'light-green',
  'lime',
  'yellow',
  'amber',
  'orange',
  'grey',
  'brand',
];

/** 验证算法输出精确一致与公开输入边界，避免只比较视觉近似。 */
describe('Semi 兼容颜色生成算法', () => {
  // 每组样本同时覆盖深浅模式，HEX 相等即三个 RGB 整数全部相等。
  it.each(reference.scales)(
    '单色阶 $color 与冻结参考的全部通道一致',
    /** 比较单色阶的全部公开位置。 */ ({ color, light, dark }) => {
      expect(generateColorScale(color)).toEqual(light);
      expect(generateColorScale(color, { mode: 'light' })).toEqual(light);
      expect(generateColorScale(color, { mode: 'dark' })).toEqual(dark);
    },
  );

  it.each(reference.palettes)(
    '整盘 $color 与冻结参考的全部通道一致',
    /** 比较色轮、灰阶和独立品牌色，而非只比较品牌中点。 */ ({ color, light, dark }) => {
      expect(generateColorPalette(color)).toEqual(light);
      expect(generateColorPalette(color, { mode: 'light' })).toEqual(light);
      expect(generateColorPalette(color, { mode: 'dark' })).toEqual(dark);
    },
  );

  it('输出十七组十级规范色阶，顺序稳定且调用之间不共享可变结果', /** 检查可序列化输出及多次调用隔离。 */ () => {
    /** 选用短 HEX 同时验证展开、大小写和默认模式。 */
    const palette = generateColorPalette('#63C');
    expect(Object.keys(palette)).toEqual(paletteNames);
    expect(palette).toEqual(generateColorPalette('#6633cc', { mode: 'light' }));
    // 每组与每级都是公开输出数据，逐项检查格式而非只抽查品牌色。
    for (const scale of Object.values(palette)) {
      expect(scale).toHaveLength(10);
      for (const color of scale) expect(color).toMatch(/^#[0-9a-f]{6}$/);
    }
    expect(palette.brand[5]).toBe('#6633cc');
    expect(palette.brand).not.toEqual(palette.blue);
    palette.brand[5] = '#000000';
    expect(generateColorPalette('#63C').brand[5]).toBe('#6633cc');
    expect(generateColorScale('#aBc')).toEqual(generateColorScale('#aabbcc'));
    expect(JSON.parse(JSON.stringify(palette))).toEqual(palette);
  });

  it.each(['#000', '#fff', '#777777'])(
    '无色相 %s 支持单色阶但不生成退化品牌色轮',
    /** 保留有意义的灰阶入口并拒绝上游整盘退化分支。 */ (color) => {
      expect(generateColorScale(color)).toHaveLength(10);
      expect(generateColorScale(color, { mode: 'dark' })).toHaveLength(10);
      expect(/** 执行无色相整盘调用并核对异常类型。 */ () => generateColorPalette(color)).toThrow(
        RangeError,
      );
      expect(
        /** 深色同样拒绝无色相整盘。 */ () => generateColorPalette(color, { mode: 'dark' }),
      ).toThrow(RangeError);
    },
  );

  it.each([
    'red',
    'rgb(1,2,3)',
    '#abcd',
    '#12345678',
    '#12',
    '#12345g',
    ' #123',
    '#123 ',
    '',
    null,
    0,
  ])(
    '拒绝不属于公开 HEX 格式的输入 %s',
    /** 不依赖浏览器解析颜色或静默使用默认品牌色。 */ (color) => {
      expect(/** 非法输入必须由单色阶公开边界拒绝。 */ () => generateColorScale(color)).toThrow(
        TypeError,
      );
      expect(/** 非法输入必须由整盘公开边界拒绝。 */ () => generateColorPalette(color)).toThrow(
        TypeError,
      );
    },
  );

  it.each(['auto', '', null, false])(
    '拒绝未声明的生成模式 %s',
    /** 深浅模式必须明确，不能随系统环境改变结果。 */ (mode) => {
      expect(/** 单色阶不接受未声明模式。 */ () => generateColorScale('#123456', { mode })).toThrow(
        TypeError,
      );
      expect(
        /** 整盘入口不接受未声明模式。 */ () => generateColorPalette('#123456', { mode }),
      ).toThrow(TypeError);
    },
  );
});
