import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sass from 'sass';
import { isColorToken } from './colors/theme.mjs';

/** 固定 vendor 只在库构建时读取，不进入消费者的文件系统依赖。 */
const themeRoot = path.dirname(fileURLToPath(import.meta.url));
/** 构建导出的颜色工具源码；不复制维护上游算法。 */
const colorsRoot = path.join(themeRoot, 'colors');

/** 从固定 Semi 的真实编译 CSS 读取颜色默认值，避免手工维护第二份语义表。 */
export function readColorBaseline() {
  /** 原样编译固定全局主题，不经过排版适配，也不重生成任何颜色。 */
  const css = sass
    .renderSync({
      file: path.resolve(
        themeRoot,
        '../../vendor/semi-design/packages/semi-theme-default/scss/global.scss',
      ),
      outputStyle: 'expanded',
      sourceMap: false,
    })
    .css.toString();
  /** 每个模式合并色盘、语义及原有 AI/数据色；排版和布局不进入此数据。 */
  const baseline = { light: {}, dark: {} };
  for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    /** 只认固定上游的模式根选择器，不从 always 子树反推默认模式。 */
    const roots = selector.split(',').map(
      /** Sass 的换行和空白不属于选择器语义。 */
      (part) => part.trim(),
    );
    /** 固定上游根规则覆盖完整调色盘和全局语义。 */
    const mode = roots.includes('body')
      ? 'light'
      : roots.some(
            /** 允许 Sass 在属性值周围保留或省略引号。 */
            (root) => /^body\[theme-mode=(?:"dark"|'dark'|dark)\]$/.test(root),
          )
        ? 'dark'
        : null;
    if (!mode) continue;
    for (const [, name, value] of body.matchAll(/(--semi-[\w-]+)\s*:\s*([^;]+);/g)) {
      if (isColorToken(name)) {
        baseline[mode][name] = value.trim();
      }
    }
  }
  if (!baseline.light['--semi-color-primary'] || !baseline.dark['--semi-color-primary']) {
    throw new Error('固定 Semi 基线缺少深浅颜色语义');
  }
  return baseline;
}

/** 发布零依赖 ESM 与类型，生成的基线数据仅属于 dist，不在源码复制维护。 */
export async function buildColors(destination = path.join(themeRoot, 'dist/colors')) {
  await mkdir(destination, { recursive: true });
  for (const file of ['index.mjs', 'index.d.mts', 'palette.mjs', 'palette.d.mts', 'theme.mjs']) {
    await copyFile(path.join(colorsRoot, file), path.join(destination, file));
  }
  /** 基线数据是包内静态 ESM，不要求 JSON import attributes 或运行时 Sass。 */
  const baseline = readColorBaseline();
  await writeFile(
    path.join(destination, 'baseline.mjs'),
    `// 构建时从固定 Semi v2.102.0 读取；不由颜色生成器重建。\nexport default ${JSON.stringify(baseline, null, 2)};\n`,
  );
}
