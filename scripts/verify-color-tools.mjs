import { execFileSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** 用真实安装包验证独立颜色入口，不借用源码别名、Sass 或浏览器全局。 */
export async function verifyColorTools(consumerRoot) {
  /** 临时消费者运行脚本；对 DOM 的任何读取都会失败。 */
  const runtime = `import assert from 'node:assert/strict';
// 纯函数入口在导入及调用阶段均不得读取 DOM。
for (const name of ['document', 'window']) {
  Object.defineProperty(globalThis, name, { /** 对任何 DOM 全局读取立即报错。 */ get() { throw new Error('颜色工具访问了 ' + name); } });
}
const { generateColorScale, generateColorPalette, createColorTheme, colorThemeToCss } = await import('@aifuxi/semi-theme-default/colors');
const theme = createColorTheme({ brand: '#7c3aed' });
assert.equal(generateColorScale('#0077fa')[5], '#0077fa');
assert.equal(Object.keys(generateColorPalette('#7c3aed')).length, 17);
assert.equal(theme.variables.light['--semi-color-primary'], 'rgba(var(--semi-brand-5), 1)');
assert.match(colorThemeToCss(theme, { selectors: { light: 'body', dark: 'body[theme-mode="dark"]' } }), /--semi-theme-dark-brand-5/);
`;
  await writeFile(path.join(consumerRoot, 'color-tools-smoke.mjs'), runtime);
  execFileSync(process.execPath, ['color-tools-smoke.mjs'], { cwd: consumerRoot, stdio: 'pipe' });
  /** 与真实包 exports 一起解析类型，验证 readonly 十级索引及模式约束。 */
  const types = `import { generateColorScale, generateColorPalette, createColorTheme, colorThemeToCss, type ColorScale, type ColorTheme } from '@aifuxi/semi-theme-default/colors';
// 公开类型使用真实消费者的 Bundler resolution，不引用项目内部声明。
const scale: ColorScale = generateColorScale('#123456', { mode: 'dark' });
const theme: ColorTheme = createColorTheme({ brand: '#7c3aed' });
const css: string = colorThemeToCss(theme, { selectors: { light: 'body', dark: 'body[theme-mode="dark"]' } });
const level: string = scale[9];
const brand: string = generateColorPalette('#7c3aed').brand[5];
void [css, level, brand];
// @ts-expect-error 模式只有 light 和 dark。
generateColorScale('#123456', { mode: 'auto' });
// @ts-expect-error 色阶在公开契约中不可修改。
scale[0] = '#ffffff';
`;
  await writeFile(path.join(consumerRoot, 'color-tools-smoke.mts'), types);
  /** 复用工作区 TypeScript，可执行文件不进入公开工具的依赖图。 */
  const tsc = fileURLToPath(new URL('../node_modules/typescript/lib/tsc.js', import.meta.url));
  // 工具类型不依赖 Node 类型包；消费者无需额外安装 @types/node。
  await writeFile(
    path.join(consumerRoot, 'color-tools-tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        noEmit: true,
        strict: true,
        skipLibCheck: false,
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'Bundler',
        types: [],
      },
      include: ['color-tools-smoke.mts'],
    }),
  );
  execFileSync(process.execPath, [tsc, '-p', 'color-tools-tsconfig.json'], {
    cwd: consumerRoot,
    stdio: 'pipe',
  });
}
