import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { expect, it } from 'vitest';
import { generateUiBrowserEntries } from './generate-ui-browser-entries.mjs';

it('生成按组件加载主题且保留运行时导出的 browser 入口', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'semi-ui-browser-entries-'));
  const uiRoot = path.join(root, 'ui');
  const themeRoot = path.join(root, 'theme');
  try {
    await Promise.all([
      mkdir(path.join(uiRoot, 'src'), { recursive: true }),
      mkdir(path.join(uiRoot, 'dist/button'), { recursive: true }),
      mkdir(path.join(uiRoot, 'dist/_base'), { recursive: true }),
      mkdir(themeRoot, { recursive: true }),
    ]);
    await Promise.all([
      writeFile(
        path.join(uiRoot, 'package.json'),
        JSON.stringify({
          exports: {
            '.': { browser: './dist/_browser/index.js', import: './dist/index.js' },
            './_base': { import: './dist/_base/index.js' },
            './button': {
              browser: './dist/_browser/button.js',
              import: './dist/button/index.js',
            },
          },
        }),
      ),
      writeFile(
        path.join(themeRoot, 'package.json'),
        JSON.stringify({ exports: { './button.css': './dist/button.css' } }),
      ),
      writeFile(
        path.join(uiRoot, 'src/index.ts'),
        "export { Base } from './_base';\nexport * from './button';\nexport type { ButtonProps } from './button';\n",
      ),
      writeFile(
        path.join(uiRoot, 'dist/index.js'),
        "export { Button } from './button/index.js';\n",
      ),
      writeFile(path.join(uiRoot, 'dist/_base/index.js'), 'export const Base = {};\n'),
      writeFile(
        path.join(uiRoot, 'dist/button/index.js'),
        'const Button = {}; export { Button, Button as default };\n',
      ),
    ]);

    await generateUiBrowserEntries({ uiRoot, themeRoot });

    expect(await readFile(path.join(uiRoot, 'dist/_browser/button.js'), 'utf8')).toBe(
      "import '@aifuxi/semi-theme-default/button.css';\nimport * as componentModule from '../button/index.js';\nconst { Button } = componentModule;\nexport { Button };\nexport default componentModule.default;\n",
    );
    const rootEntry = await readFile(path.join(uiRoot, 'dist/_browser/index.js'), 'utf8');
    expect(rootEntry).toContain('export { Base } from "../_base/index.js";');
    expect(rootEntry).toContain('export * from "./button.js";');
    expect(rootEntry).not.toContain('ButtonProps');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
