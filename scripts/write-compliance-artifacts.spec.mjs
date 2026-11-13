import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, it } from 'vitest';

// 通过真实生成器写入临时包，验证通知版本与所附许可证来自同一份已安装依赖。
it('第三方通知使用许可证所属已安装版本，SBOM 保留声明范围', async () => {
  /** 生成器及许可证仍来自当前工作区，输出完全隔离到系统临时目录。 */
  const root = fileURLToPath(new URL('../', import.meta.url));
  /** 临时包只声明 markdown-it，避免构建 UI 或覆盖共享 dist。 */
  const packageRoot = await mkdtemp(path.join(tmpdir(), 'compliance-artifacts-'));
  /** 读取实际许可证所属版本，升级依赖后同一断言仍有效。 */
  const installed = JSON.parse(
    await readFile(path.join(root, 'packages/ui/node_modules/markdown-it/package.json'), 'utf8'),
  );
  /** 非精确依赖范围用于保证本次修复不改变 SBOM 的既有契约。 */
  const declaredVersion = `^${installed.version}`;
  try {
    await writeFile(
      path.join(packageRoot, 'package.json'),
      JSON.stringify({
        name: 'compliance-fixture',
        version: '0.0.0',
        dependencies: { 'markdown-it': declaredVersion },
      }),
    );
    execFileSync(
      process.execPath,
      [path.join(root, 'scripts/write-compliance-artifacts.mjs'), '.'],
      {
        cwd: packageRoot,
        stdio: 'pipe',
      },
    );
    /** 断言最终通知正文，而非仅检查中间依赖对象。 */
    const notices = await readFile(path.join(packageRoot, 'dist/THIRD_PARTY_NOTICES.md'), 'utf8');
    expect(notices).toContain(`markdown-it ${installed.version} under the MIT License`);
    /** 输出许可证必须逐字保留，版本说明取自同一安装位置。 */
    const license = await readFile(
      path.join(packageRoot, 'dist/THIRD_PARTY_LICENSES/markdown-it.txt'),
      'utf8',
    );
    expect(license).toBe(
      await readFile(path.join(root, 'packages/ui/node_modules/markdown-it/LICENSE'), 'utf8'),
    );
    /** SBOM 的 versionInfo 继续表达原始清单依赖范围。 */
    const sbom = JSON.parse(await readFile(path.join(packageRoot, 'dist/SBOM.spdx.json'), 'utf8'));
    expect(
      sbom.packages.find(
        /** 定位已声明的 Markdown 依赖条目。 */
        (entry) => entry.name === 'markdown-it',
      )?.versionInfo,
    ).toBe(declaredVersion);
  } finally {
    await rm(packageRoot, { recursive: true, force: true });
  }
});
