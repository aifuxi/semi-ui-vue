import assert from 'node:assert/strict';
import { lstat, mkdir, readFile, realpath, symlink } from 'node:fs/promises';
import path from 'node:path';

/** 将按统一 lockfile 安装的发布工具暴露在仓库根目录，供官方 Action 按 cwd 解析。 */
export async function setupReleaseTools(root = process.cwd()) {
  // macOS 的 /var 等路径可能是符号链接；先统一真实根目录，避免相对链接跨越两种路径表示。
  root = await realpath(root);
  /** 根清单仍是工具版本的权威入口，不允许轻量安装悄悄使用另一套版本。 */
  const manifest = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
  /** 私有工作区只声明发布脚本和官方 Changesets Action 所需的三个依赖。 */
  const tools = JSON.parse(await readFile(path.join(root, 'tools/release/package.json'), 'utf8'));
  for (const [name, version] of Object.entries(tools.dependencies)) {
    assert.equal(manifest.devDependencies[name], version, `${name}: 发布工具版本与根清单不一致`);
    /** pnpm 的真实路径保留其依赖图；这里只创建根解析入口，不复制或重装依赖。 */
    const target = await realpath(path.join(root, 'tools/release/node_modules', name));
    await link(path.join(root, 'node_modules', name), target);
  }
  // pnpm run release:version 继续使用原有 changeset 命令，官方 Action 的 cwd 不变。
  await link(
    path.join(root, 'node_modules/.bin/changeset'),
    path.join(root, 'node_modules/@changesets/cli/bin.js'),
  );
}

/** 只补充缺失入口；遇到不同目标时失败，不覆盖现有安装或用户文件。 */
async function link(destination, target) {
  await mkdir(path.dirname(destination), { recursive: true });
  try {
    await lstat(destination);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await symlink(path.relative(path.dirname(destination), target), destination);
    return;
  }
  assert.equal(
    await realpath(destination),
    await realpath(target),
    `${destination}: 已有入口指向另一套依赖`,
  );
}

if (process.argv[1] && path.basename(process.argv[1]) === 'setup-release-tools.mjs') {
  await setupReleaseTools();
}
