import { execFileSync, spawnSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import semver from 'semver';
import { publicPackages } from './release-packages.mjs';

export const RELEASE_BUMP_USAGE = `用法：
  pnpm release:bump alpha
  pnpm release:bump <完整版本号>

示例：
  pnpm release:bump alpha
  pnpm release:bump 0.2.0-beta.0`;

const defaultWorkspaceRoot = process.cwd();

function runGit(workspaceRoot, args) {
  return execFileSync('git', args, {
    cwd: workspaceRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function tagExists(workspaceRoot, tagName) {
  const result = spawnSync('git', ['show-ref', '--verify', '--quiet', `refs/tags/${tagName}`], {
    cwd: workspaceRoot,
    encoding: 'utf8',
    stdio: 'ignore',
  });

  if (result.status === 0) return true;
  if (result.status === 1) return false;
  throw result.error ?? new Error(`无法检查 Git 标签 ${tagName}`);
}

function assertSamePaths(actualPaths, expectedPaths, message) {
  const actual = [...actualPaths].sort();
  const expected = [...expectedPaths].sort();

  if (
    actual.length !== expected.length ||
    actual.some((value, index) => value !== expected[index])
  ) {
    throw new Error(`${message}：${actual.join(', ') || '无'}`);
  }
}

export function resolveTargetVersion(currentVersion, input) {
  if (!input) throw new Error('缺少升版参数');
  if (semver.valid(currentVersion) !== currentVersion) {
    throw new Error(`当前版本不是严格 SemVer：${currentVersion}`);
  }

  let targetVersion;
  if (input === 'alpha') {
    const prerelease = semver.parse(currentVersion)?.prerelease ?? [];
    if (prerelease.length !== 2 || prerelease[0] !== 'alpha' || !Number.isInteger(prerelease[1])) {
      throw new Error(`alpha 只能递增形如 x.y.z-alpha.N 的当前版本：${currentVersion}`);
    }
    targetVersion = semver.inc(currentVersion, 'prerelease', 'alpha');
  } else {
    if (input.startsWith('v') || semver.valid(input) !== input) {
      throw new Error(`目标版本必须是无 v 前缀的严格 SemVer：${input}`);
    }
    targetVersion = input;
  }

  if (!targetVersion || !semver.gt(targetVersion, currentVersion)) {
    throw new Error(`目标版本必须高于当前版本 ${currentVersion}：${targetVersion ?? input}`);
  }

  return targetVersion;
}

export function releaseCommitMessage(version) {
  const prerelease = semver.parse(version)?.prerelease ?? [];
  const versionLabel = prerelease.length > 0 ? prerelease.join('.') : version;
  return `chore(release): 升级公开包版本至 ${versionLabel}`;
}

export async function runReleaseBump({
  input,
  workspaceRoot = defaultWorkspaceRoot,
  packageList = publicPackages,
  output = process.stdout,
} = {}) {
  const status = runGit(workspaceRoot, ['status', '--porcelain=v1', '--untracked-files=all']);
  if (status) throw new Error('工作区或暂存区不干净，请先提交或处理现有改动');

  try {
    runGit(workspaceRoot, ['var', 'GIT_AUTHOR_IDENT']);
    runGit(workspaceRoot, ['var', 'GIT_COMMITTER_IDENT']);
  } catch {
    throw new Error('Git 提交身份无效，请先配置 user.name 和 user.email');
  }

  const manifests = await Promise.all(
    packageList.map(async (packageInfo) => {
      const relativePath = path.posix.join('packages', packageInfo.directory, 'package.json');
      const absolutePath = path.join(workspaceRoot, relativePath);
      const source = await readFile(absolutePath, 'utf8');
      const manifest = JSON.parse(source);
      if (manifest.name !== packageInfo.name) {
        throw new Error(`${relativePath} 的公开包名不正确：${manifest.name}`);
      }
      return { absolutePath, manifest, relativePath, source };
    }),
  );

  const currentVersion = manifests[0]?.manifest.version;
  if (!currentVersion || manifests.some(({ manifest }) => manifest.version !== currentVersion)) {
    throw new Error('五个公开包的版本不一致');
  }

  const targetVersion = resolveTargetVersion(currentVersion, input);
  const tagName = `v${targetVersion}`;
  if (tagExists(workspaceRoot, tagName)) throw new Error(`Git 标签已存在：${tagName}`);
  runGit(workspaceRoot, ['check-ref-format', `refs/tags/${tagName}`]);

  const relativePaths = manifests.map(({ relativePath }) => relativePath);
  let commitCreated = false;

  try {
    for (const manifestInfo of manifests) {
      manifestInfo.manifest.version = targetVersion;
      await writeFile(
        manifestInfo.absolutePath,
        `${JSON.stringify(manifestInfo.manifest, null, 2)}\n`,
        'utf8',
      );
    }

    const changedPaths = runGit(workspaceRoot, ['diff', '--name-only']).split('\n').filter(Boolean);
    assertSamePaths(changedPaths, relativePaths, '升版产生了预期范围外的文件改动');

    runGit(workspaceRoot, ['add', '--', ...relativePaths]);
    const stagedPaths = runGit(workspaceRoot, ['diff', '--cached', '--name-only'])
      .split('\n')
      .filter(Boolean);
    assertSamePaths(stagedPaths, relativePaths, '暂存区包含预期范围外的文件');

    const commitMessage = releaseCommitMessage(targetVersion);
    runGit(workspaceRoot, ['commit', '-m', commitMessage, '--', ...relativePaths]);
    commitCreated = true;

    runGit(workspaceRoot, ['tag', '-a', tagName, '-m', `发布 ${tagName}`]);
    const commitHash = runGit(workspaceRoot, ['rev-parse', '--short', 'HEAD']);
    output.write(
      `公开包版本已从 ${currentVersion} 升级至 ${targetVersion}\n` +
        `提交：${commitHash} ${commitMessage}\n` +
        `标签：${tagName}（发布 ${tagName}）\n` +
        '未执行 push、release:check 或 npm publish\n',
    );

    return { commitHash, commitMessage, currentVersion, tagName, targetVersion };
  } catch (error) {
    if (!commitCreated) {
      for (const manifestInfo of manifests) {
        await writeFile(manifestInfo.absolutePath, manifestInfo.source, 'utf8');
      }
      runGit(workspaceRoot, ['add', '--', ...relativePaths]);
    }
    throw error;
  }
}

const isDirectExecution = process.argv[1] && path.basename(process.argv[1]) === 'release-bump.mjs';

if (isDirectExecution) {
  runReleaseBump({ input: process.argv[2] }).catch((error) => {
    process.stderr.write(`release:bump 失败：${error.message}\n\n${RELEASE_BUMP_USAGE}\n`);
    process.exitCode = 1;
  });
}
