import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { publicPackages } from './release-packages.mjs';
import { runReleaseBump } from './release-bump.mjs';

const temporaryRoots = [];
const silentOutput = { write() {} };

function git(workspaceRoot, args) {
  return execFileSync('git', args, {
    cwd: workspaceRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

async function createRepository(version = '0.1.0-alpha.4', overrides = {}) {
  const workspaceRoot = await mkdtemp(path.join(tmpdir(), 'semi-ui-vue-release-bump-'));
  temporaryRoots.push(workspaceRoot);

  for (const packageInfo of publicPackages) {
    const packageRoot = path.join(workspaceRoot, 'packages', packageInfo.directory);
    await mkdir(packageRoot, { recursive: true });
    await writeFile(
      path.join(packageRoot, 'package.json'),
      `${JSON.stringify(
        {
          name: packageInfo.name,
          version: overrides[packageInfo.name] ?? version,
        },
        null,
        2,
      )}\n`,
      'utf8',
    );
  }

  git(workspaceRoot, ['init', '--quiet']);
  git(workspaceRoot, ['config', 'user.name', 'Release Test']);
  git(workspaceRoot, ['config', 'user.email', 'release-test@example.com']);
  git(workspaceRoot, ['add', '.']);
  git(workspaceRoot, ['commit', '--quiet', '-m', 'test: 初始化发布仓库']);
  return workspaceRoot;
}

async function packageVersions(workspaceRoot) {
  return Promise.all(
    publicPackages.map(async ({ directory }) => {
      const manifest = JSON.parse(
        await readFile(path.join(workspaceRoot, 'packages', directory, 'package.json'), 'utf8'),
      );
      return manifest.version;
    }),
  );
}

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { force: true, recursive: true })),
  );
});

describe('release:bump', () => {
  it('同步递增 alpha 版本并创建约定的提交和 annotated tag', async () => {
    const workspaceRoot = await createRepository();

    const result = await runReleaseBump({ input: 'alpha', output: silentOutput, workspaceRoot });

    expect(result.targetVersion).toBe('0.1.0-alpha.5');
    expect(await packageVersions(workspaceRoot)).toEqual(publicPackages.map(() => '0.1.0-alpha.5'));
    expect(git(workspaceRoot, ['log', '-1', '--format=%s'])).toBe(
      'chore(release): 升级公开包版本至 alpha.5',
    );
    expect(git(workspaceRoot, ['cat-file', '-t', 'v0.1.0-alpha.5'])).toBe('tag');
    expect(
      git(workspaceRoot, [
        'for-each-ref',
        'refs/tags/v0.1.0-alpha.5',
        '--format=%(contents:subject)',
      ]),
    ).toBe('发布 v0.1.0-alpha.5');
    expect(git(workspaceRoot, ['status', '--porcelain'])).toBe('');

    const committedPaths = git(workspaceRoot, ['show', '--pretty=', '--name-only', 'HEAD'])
      .split('\n')
      .filter(Boolean)
      .sort();
    expect(committedPaths).toEqual(
      publicPackages.map(({ directory }) => `packages/${directory}/package.json`).sort(),
    );
  });

  it.each([
    ['0.2.0-beta.0', 'chore(release): 升级公开包版本至 beta.0'],
    ['0.2.0', 'chore(release): 升级公开包版本至 0.2.0'],
  ])('支持显式目标版本 %s', async (targetVersion, expectedMessage) => {
    const workspaceRoot = await createRepository();

    await runReleaseBump({ input: targetVersion, output: silentOutput, workspaceRoot });

    expect(await packageVersions(workspaceRoot)).toEqual(publicPackages.map(() => targetVersion));
    expect(git(workspaceRoot, ['log', '-1', '--format=%s'])).toBe(expectedMessage);
    expect(
      git(workspaceRoot, [
        'for-each-ref',
        `refs/tags/v${targetVersion}`,
        '--format=%(contents:subject)',
      ]),
    ).toBe(`发布 v${targetVersion}`);
  });

  it('工作区不干净时不创建提交或标签', async () => {
    const workspaceRoot = await createRepository();
    const initialHead = git(workspaceRoot, ['rev-parse', 'HEAD']);
    await writeFile(path.join(workspaceRoot, 'notes.txt'), 'unfinished\n', 'utf8');

    await expect(
      runReleaseBump({ input: 'alpha', output: silentOutput, workspaceRoot }),
    ).rejects.toThrow('工作区或暂存区不干净');

    expect(git(workspaceRoot, ['rev-parse', 'HEAD'])).toBe(initialHead);
    expect(git(workspaceRoot, ['tag', '--list'])).toBe('');
  });

  it('五个公开包版本不一致时不创建提交或标签', async () => {
    const workspaceRoot = await createRepository('0.1.0-alpha.4', {
      '@aifuxi/semi-ui-vue': '0.1.0-alpha.3',
    });
    const initialHead = git(workspaceRoot, ['rev-parse', 'HEAD']);

    await expect(
      runReleaseBump({ input: 'alpha', output: silentOutput, workspaceRoot }),
    ).rejects.toThrow('五个公开包的版本不一致');

    expect(git(workspaceRoot, ['rev-parse', 'HEAD'])).toBe(initialHead);
    expect(git(workspaceRoot, ['tag', '--list'])).toBe('');
  });

  it.each([
    ['', '缺少升版参数'],
    ['v0.2.0', '无 v 前缀'],
    ['not-a-version', '严格 SemVer'],
    ['0.1.0-alpha.4', '必须高于当前版本'],
    ['0.1.0-alpha.3', '必须高于当前版本'],
  ])('拒绝非法或未递增的输入 %s', async (input, expectedError) => {
    const workspaceRoot = await createRepository();
    const initialHead = git(workspaceRoot, ['rev-parse', 'HEAD']);

    await expect(runReleaseBump({ input, output: silentOutput, workspaceRoot })).rejects.toThrow(
      expectedError,
    );

    expect(git(workspaceRoot, ['rev-parse', 'HEAD'])).toBe(initialHead);
    expect(git(workspaceRoot, ['tag', '--list'])).toBe('');
    expect(await packageVersions(workspaceRoot)).toEqual(publicPackages.map(() => '0.1.0-alpha.4'));
  });

  it('非 alpha 当前版本不能使用 alpha 快捷输入', async () => {
    const workspaceRoot = await createRepository('0.1.0-beta.1');
    const initialHead = git(workspaceRoot, ['rev-parse', 'HEAD']);

    await expect(
      runReleaseBump({ input: 'alpha', output: silentOutput, workspaceRoot }),
    ).rejects.toThrow('alpha 只能递增');

    expect(git(workspaceRoot, ['rev-parse', 'HEAD'])).toBe(initialHead);
    expect(git(workspaceRoot, ['tag', '--list'])).toBe('');
  });

  it('目标标签已经存在时不创建提交', async () => {
    const workspaceRoot = await createRepository();
    const initialHead = git(workspaceRoot, ['rev-parse', 'HEAD']);
    git(workspaceRoot, ['tag', '-a', 'v0.1.0-alpha.5', '-m', 'existing']);

    await expect(
      runReleaseBump({ input: 'alpha', output: silentOutput, workspaceRoot }),
    ).rejects.toThrow('Git 标签已存在');

    expect(git(workspaceRoot, ['rev-parse', 'HEAD'])).toBe(initialHead);
    expect(await packageVersions(workspaceRoot)).toEqual(publicPackages.map(() => '0.1.0-alpha.4'));
  });
});
