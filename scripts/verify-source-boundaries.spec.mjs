import { execFileSync } from 'node:child_process';
import { copyFile, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { expect, it } from '@rstest/core';

it('独立于文档站允许正常依赖升级，同时拒绝公开包私有依赖和源码 vendor 越界', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'source-boundaries-'));
  const packages = ['ui', 'theme-default', 'icons', 'icons-lab', 'illustrations'];
  const write = (file, value) => writeFile(path.join(root, file), JSON.stringify(value));
  const verify = () =>
    execFileSync(process.execPath, [path.join(root, 'scripts/verify-source-boundaries.mjs')], {
      encoding: 'utf8',
      stdio: 'pipe',
    });
  try {
    for (const directory of [
      'scripts',
      'apps/parity-vue/src',
      'packages/test-infra/src',
      ...packages.map((name) => `packages/${name}/src`),
    ]) {
      await mkdir(path.join(root, directory), { recursive: true });
    }
    await copyFile(
      path.join(import.meta.dirname, 'verify-source-boundaries.mjs'),
      path.join(root, 'scripts/verify-source-boundaries.mjs'),
    );
    for (const name of packages)
      await write(`packages/${name}/package.json`, {
        peerDependencies: name === 'theme-default' ? {} : { vue: '>=3.5.0' },
      });
    await write('packages/ui/tsconfig.json', {
      compilerOptions: {
        paths: {
          '@aifuxi/semi-icons-vue': ['packages/icons/src/index.ts'],
          '@aifuxi/semi-illustrations-vue': ['packages/illustrations/src/index.ts'],
        },
      },
    });
    await write('packages/ui/package.json', {
      peerDependencies: { vue: '>=3.5.0' },
      dependencies: { lodash: '^4.18.0' },
    });
    expect(verify()).toContain('源码边界通过');
    for (const dependency of [
      '@workspace/foundation-integration',
      'react',
      '@douyinfe/semi-ui',
      '@aifuxi/unknown',
    ]) {
      await write('packages/ui/package.json', {
        peerDependencies: { vue: '>=3.5.0' },
        dependencies: { [dependency]: '1.0.0' },
      });
      expect(verify).toThrow(/包含禁止依赖/);
    }
    await write('packages/ui/package.json', { peerDependencies: { vue: '>=3.5.0' } });
    await writeFile(
      path.join(root, 'packages/ui/src/leak.ts'),
      "import value from '../../../vendor/semi-design/value';",
    );
    expect(verify).toThrow(/绕过允许边界/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
