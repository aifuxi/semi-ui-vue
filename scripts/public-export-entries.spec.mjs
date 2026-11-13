import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { expect, it } from 'vitest';
import { assertExportTargets, publicJavaScriptEntries } from './public-export-entries.mjs';

it('SSR 枚举覆盖新增通配入口，忽略类型和 CSS，并拒绝空匹配', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'public-exports-'));
  try {
    await mkdir(path.join(root, 'dist/icons'), { recursive: true });
    await writeFile(
      path.join(root, 'package.json'),
      JSON.stringify({
        exports: {
          '.': { types: './dist/index.d.ts', import: './dist/index.js' },
          './icons/*': { import: './dist/icons/*.js' },
          './style.css': './dist/index.css',
        },
      }),
    );
    await expect(publicJavaScriptEntries(root)).rejects.toThrow(/没有匹配产物/);
    await writeFile(path.join(root, 'dist/icons/New.js'), 'export default {}');
    await writeFile(path.join(root, 'dist/icons/New.d.ts'), 'export default {}');
    expect(await publicJavaScriptEntries(root)).toEqual(['./dist/icons/New.js', './dist/index.js']);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

// 防止父目录中的同后缀文件掩盖 shared 子目录的公开资产缺失。
it('通配导出只接受目标目录中的实际文件', async () => {
  /** fixture 与共享构建产物隔离，目录中的 index.css 是误导性候选。 */
  const root = await mkdtemp(path.join(tmpdir(), 'export-targets-'));
  try {
    await mkdir(path.join(root, 'dist/shared'), { recursive: true });
    await writeFile(path.join(root, 'dist/index.css'), 'body {}');
    await expect(assertExportTargets(root, './dist/shared/*.css')).rejects.toThrow(
      /通配导出没有匹配产物/,
    );
    await mkdir(path.join(root, 'dist/shared/directory.css'));
    await expect(assertExportTargets(root, './dist/shared/*.css')).rejects.toThrow(
      /通配导出没有匹配产物/,
    );
    await writeFile(path.join(root, 'dist/shared/icons.css'), '.semi-icon {}');
    await expect(assertExportTargets(root, './dist/shared/theme-*.css')).rejects.toThrow(
      /通配导出没有匹配产物/,
    );
    await writeFile(path.join(root, 'dist/shared/theme-dark.css'), 'body[theme-mode="dark"] {}');
    await expect(assertExportTargets(root, './dist/shared/theme-*.css')).resolves.toBeUndefined();
    await expect(
      assertExportTargets(root, {
        './index.css': './dist/index.css',
        './shared/*.css': { default: './dist/shared/*.css' },
      }),
    ).resolves.toBeUndefined();
    await expect(assertExportTargets(root, './dist/missing.js')).rejects.toThrow(/ENOENT/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
