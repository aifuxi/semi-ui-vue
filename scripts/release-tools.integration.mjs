import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, realpath, rm, symlink, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { setupReleaseTools } from './setup-release-tools.mjs';

// 本测试只验证 bootstrap 与官方解析路径，干净安装的依赖数量由真实 runner 基准测量。
test('轻量发布工具从仓库根解析官方 CLI，并拒绝与根清单不一致的版本', async () => {
  /** 临时根目录同时覆盖 macOS 临时路径的符号链接规范化。 */
  const root = await mkdtemp(path.join(tmpdir(), 'semi-release-tools-'));
  /** 读取项目已锁定的依赖，不在测试里安装另一套工具版本。 */
  const workspace = fileURLToPath(new URL('..', import.meta.url));
  /** 子包的三个运行依赖必须与根 devDependencies 逐项一致。 */
  const tools = JSON.parse(
    await readFile(path.join(workspace, 'tools/release/package.json'), 'utf8'),
  );
  try {
    await mkdir(path.join(root, 'tools/release/node_modules/@changesets'), {
      recursive: true,
    });
    await writeFile(path.join(root, 'tools/release/package.json'), JSON.stringify(tools));
    await writeFile(
      path.join(root, 'package.json'),
      JSON.stringify({ devDependencies: tools.dependencies }),
    );
    for (const name of Object.keys(tools.dependencies)) {
      await symlink(
        await realpath(path.join(workspace, 'node_modules', name)),
        path.join(root, 'tools/release/node_modules', name),
      );
    }
    await setupReleaseTools(root);
    /** 与官方 changesets/action 的 resolveChangesetsCli 使用相同解析方式。 */
    const require = createRequire(path.join(root, 'package.json'));
    assert.match(
      execFileSync(process.execPath, [require.resolve('@changesets/cli/bin.js'), '--version'], {
        encoding: 'utf8',
      }),
      /3\.0\.2/,
    );
    assert.equal(require('semver').gt('2.1.3', '2.1.2'), true);
    await writeFile(path.join(root, 'package.json'), JSON.stringify({ devDependencies: {} }));
    await assert.rejects(
      // 锁定版本漂移时不能用旧缓存继续执行。
      () => setupReleaseTools(root),
      /版本与根清单不一致/,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
