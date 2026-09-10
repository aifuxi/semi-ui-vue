import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { expect, it } from '@rstest/core';
import { verifyThemeCss } from './theme-contracts.mjs';

it('主题与安装包共享检查拒绝缺失文件和缺失选择器', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'theme-contract-'));
  const contracts = JSON.parse(
    await readFile(path.join(import.meta.dirname, 'theme-contracts.json'), 'utf8'),
  );
  try {
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
