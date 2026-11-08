import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { findSourceEvidence, isTrustedVersionPr, isVersionOnlyDiff } from './ci-quality-plan.mjs';
import { publicPackages } from './public-packages.mjs';

// 串行使用临时 cwd，确保 Git 查询只针对当前测试创建的可丢弃仓库。
test('版本 PR 复用同时要求机器人身份、严格版本差异与匹配的成功检查证据', async () => {
  /** 只在临时目录写入版本、源码和依赖反例，不改真实工作区。 */
  const directory = await mkdtemp(path.join(tmpdir(), 'semi-quality-plan-'));
  /** 完成后恢复测试进程的原始目录。 */
  const originalDirectory = process.cwd();
  /** 以参数数组执行临时仓库 Git 命令。 */
  const git = (...args) =>
    execFileSync('git', args, { cwd: directory, encoding: 'utf8', stdio: 'pipe' }).trim();
  /** 每个反例都成为真实提交，保证差异校验覆盖 Git 的实际输出。 */
  const commit = () => {
    git('add', '.');
    git(
      '-c',
      'user.name=Probe',
      '-c',
      'user.email=probe@example.invalid',
      'commit',
      '--allow-empty',
      '-m',
      'fixture',
    );
    return git('rev-parse', 'HEAD');
  };
  /** 模拟真实仓库配置的同仓库版本机器人，单独变更字段验证身份边界。 */
  const env = {
    BASE_SHA: 'a'.repeat(40),
    RELEASE_BOT_LOGIN: 'release[bot]',
    PR_HEAD_REF: 'changeset-release/master',
    PR_HEAD_REPO: 'owner/repo',
    GITHUB_REPOSITORY: 'owner/repo',
    PR_AUTHOR: 'release[bot]',
  };
  assert.equal(isTrustedVersionPr(env), true);
  assert.equal(isTrustedVersionPr({ ...env, PR_AUTHOR: 'developer' }), false);
  assert.equal(isTrustedVersionPr({ ...env, PR_HEAD_REPO: 'fork/repo' }), false);
  try {
    await mkdir(path.join(directory, '.changeset'));
    await writeFile(path.join(directory, '.changeset/fix.md'), '---\nui: patch\n---\nfix\n');
    for (const { name, directory: folder } of publicPackages) {
      await mkdir(path.join(directory, 'packages', folder), { recursive: true });
      await writeFile(
        path.join(directory, 'packages', folder, 'package.json'),
        JSON.stringify({ name, version: '2.1.2', exports: './dist/index.js' }),
      );
      await writeFile(
        path.join(directory, 'packages', folder, 'CHANGELOG.md'),
        `# ${name}\n\n## 2.1.2\n\nprevious\n`,
      );
    }
    git('init', '-b', 'master');
    /** 已通过完整检查的 base 用于比较整个 Git tree。 */
    const base = commit();
    for (const { name, directory: folder } of publicPackages) {
      await writeFile(
        path.join(directory, 'packages', folder, 'package.json'),
        JSON.stringify({ name, version: '2.1.3', exports: './dist/index.js' }),
      );
      await writeFile(
        path.join(directory, 'packages', folder, 'CHANGELOG.md'),
        `# ${name}\n\n## 2.1.3\n\nfix\n\n## 2.1.2\n\nprevious\n`,
      );
    }
    await rm(path.join(directory, '.changeset/fix.md'));
    /** 纯六包升版与消费 changeset 是唯一应接受的正例。 */
    const versionHead = commit();
    process.chdir(directory);
    assert.equal(isVersionOnlyDiff(base, versionHead), true);
    await writeFile(path.join(directory, 'packages/ui/source.ts'), 'export const changed = true;');
    assert.equal(isVersionOnlyDiff(base, commit()), false);
    git('rm', 'packages/ui/source.ts');
    await writeFile(
      path.join(directory, 'packages/ui/package.json'),
      JSON.stringify({ name: '@aifuxi/semi-ui-vue', version: '2.1.3', exports: './other.js' }),
    );
    assert.equal(isVersionOnlyDiff(base, commit()), false);
    await writeFile(
      path.join(directory, 'packages/ui/package.json'),
      git('show', `${versionHead}:packages/ui/package.json`),
    );
    await writeFile(path.join(directory, 'pnpm-lock.yaml'), 'changed lockfile\n');
    assert.equal(isVersionOnlyDiff(base, commit()), false);
    git('rm', 'pnpm-lock.yaml');
    await writeFile(
      path.join(directory, 'packages/ui/CHANGELOG.md'),
      '# @aifuxi/semi-ui-vue\n\n## 2.1.3\n\n删除了历史\n',
    );
    assert.equal(isVersionOnlyDiff(base, commit()), false);
    /** 成功 run 的 receipt 必须匹配 base tree 和 GitHub 对受测提交的独立查询。 */
    const tree = git('rev-parse', `${base}^{tree}`);
    /** 使用不可变 SHA 与 run ID，避免“最近有成功 CI”就误判为当前源码已验证。 */
    const evidence = {
      schema: 1,
      repository: 'owner/repo',
      runId: 7,
      headSha: base,
      sha: base,
      tree,
      checks: 'source-and-artifacts',
    };
    /** 只模拟 GitHub 的传输，不替换被测身份、Git 差异或 tree 比较逻辑。 */
    const get = async (suffix) => {
      if (suffix.startsWith('actions/workflows'))
        return {
          workflow_runs: [
            {
              id: 7,
              path: '.github/workflows/ci.yml',
              event: 'pull_request',
              conclusion: 'success',
              head_sha: base,
              head_repository: { full_name: 'owner/repo' },
            },
          ],
        };
      if (suffix.includes('/artifacts'))
        return { artifacts: [{ id: 9, name: 'source-quality-evidence', expired: false }] };
      return { tree: { sha: tree } };
    };
    assert.equal(
      await findSourceEvidence(
        base,
        'owner/repo',
        get,
        // 正确 receipt 允许复用。
        async () => evidence,
      ),
      7,
    );
    assert.equal(
      await findSourceEvidence(
        base,
        'owner/repo',
        get,
        // 错误内容摘要不允许复用。
        async () => ({ ...evidence, tree: 'f'.repeat(40) }),
      ),
      undefined,
    );
    assert.equal(
      await findSourceEvidence(
        base,
        'owner/repo',
        get,
        // receipt 指向另一 PR head 时不能复用。
        async () => ({ ...evidence, headSha: 'e'.repeat(40) }),
      ),
      undefined,
    );
    assert.equal(
      await findSourceEvidence(
        base,
        'owner/repo',
        // artifact 已过期时，必须重新验证当前输入。
        async (suffix) =>
          suffix.includes('/artifacts')
            ? { artifacts: [{ id: 9, name: 'source-quality-evidence', expired: true }] }
            : get(suffix),
      ),
      undefined,
    );
    assert.equal(
      await findSourceEvidence(
        base,
        'owner/repo',
        // receipt 声称匹配但 GitHub 的受测提交 tree 不匹配时同样拒绝。
        async (suffix) =>
          suffix.startsWith('git/commits') ? { tree: { sha: 'e'.repeat(40) } } : get(suffix),
        // 仍使用该 run 的真实格式 receipt，让失败来自独立 tree 查询。
        async () => evidence,
      ),
      undefined,
    );
    assert.equal(
      await findSourceEvidence(
        base,
        'owner/repo',
        get,
        // 其他运行的 receipt 不能冒充本次成功检查。
        async () => ({ ...evidence, runId: 8 }),
      ),
      undefined,
    );
    assert.equal(
      await findSourceEvidence(
        base,
        'owner/repo',
        // 没有可核对的历史运行时必须回到完整检查。
        async () => ({ workflow_runs: [] }),
      ),
      undefined,
    );
  } finally {
    process.chdir(originalDirectory);
    await rm(directory, { recursive: true, force: true });
  }
});
