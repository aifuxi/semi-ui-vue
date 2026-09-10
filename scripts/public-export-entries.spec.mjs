import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { expect, it } from '@rstest/core';
import { publicJavaScriptEntries } from './public-export-entries.mjs';

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
