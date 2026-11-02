import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { expect, it } from 'vitest';
import { verifyThemeCss } from './theme-contracts.mjs';

it('主题与安装包共享检查拒绝缺失文件和缺失选择器', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'theme-contract-'));
  const contracts = JSON.parse(
    await readFile(path.join(import.meta.dirname, 'theme-contracts.json'), 'utf8'),
  );
  try {
    // 模拟模块化 CSS 产物，夹具也必须提供校验器读取的基础样式与依赖清单。
    await writeFile(path.join(root, 'base.css'), '');
    const components = Object.fromEntries(
      Object.keys(contracts)
        .filter((file) => file !== 'index.css')
        .map((file) => [
          file.slice(0, -'.css'.length),
          { main: null, modules: [], imports: ['base.css', `./${file}`] },
        ]),
    );
    await writeFile(
      path.join(root, 'style-dependencies.json'),
      JSON.stringify({ version: 1, base: 'base.css', shared: {}, components }),
    );
    for (const [file, selectors] of Object.entries(contracts)) {
      await writeFile(path.join(root, file), selectors.join('\n'));
    }
    await verifyThemeCss(root);
    await writeFile(path.join(root, 'switch.css'), '.semi-switch-checked {}');
    await expect(verifyThemeCss(root)).rejects.toThrow(/switch.css 缺少样式契约/);
    await rm(path.join(root, 'switch.css'));
    await expect(verifyThemeCss(root)).rejects.toThrow(/ENOENT/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
