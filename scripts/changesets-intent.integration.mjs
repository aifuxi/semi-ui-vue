import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { publicPackages } from './public-packages.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
test('PR 检查区分遗漏、空记录、手改版本与可信机器人版本 PR', async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), 'semi-intent-'));
  const git = (...args) =>
    execFileSync('git', args, { cwd, encoding: 'utf8', stdio: 'pipe' }).trim();
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
  try {
    await mkdir(path.join(cwd, '.changeset'));
    await writeFile(
      path.join(cwd, '.changeset/config.json'),
      await readFile(path.join(root, '.changeset/config.json')),
    );
    await writeFile(
      path.join(cwd, 'package.json'),
      JSON.stringify({ name: 'intent-probe', private: true }),
    );
    await writeFile(path.join(cwd, 'pnpm-workspace.yaml'), 'packages:\n  - packages/*\n');
    await writeFile(path.join(cwd, '.gitignore'), 'node_modules\n');
    await mkdir(path.join(cwd, 'node_modules/@changesets'), { recursive: true });
    await symlink(
      path.join(root, 'node_modules/@changesets/cli'),
      path.join(cwd, 'node_modules/@changesets/cli'),
    );
    for (const { name, directory } of publicPackages) {
      await mkdir(path.join(cwd, 'packages', directory), { recursive: true });
      await writeFile(
        path.join(cwd, 'packages', directory, 'package.json'),
        JSON.stringify({ name, version: '1.0.0' }),
      );
    }
    git('init', '-b', 'master');
    const base = commit();
    const verify = (extra = {}) =>
      execFileSync(process.execPath, [path.join(root, 'scripts/verify-changesets.mjs')], {
        cwd,
        encoding: 'utf8',
        stdio: 'pipe',
        env: {
          ...process.env,
          BASE_SHA: base,
          HEAD_SHA: git('rev-parse', 'HEAD'),
          GITHUB_REPOSITORY: 'aifuxi/semi-ui-vue',
          PR_HEAD_REPO: 'aifuxi/semi-ui-vue',
          PR_HEAD_REF: 'feature',
          PR_AUTHOR: 'developer',
          RELEASE_BOT_LOGIN: 'release[bot]',
          ...extra,
        },
      });
    assert.throws(
      () => verify(),
      (error) => error.stderr.includes('PR must add a changeset'),
    );
    await writeFile(path.join(cwd, '.changeset/empty.md'), '---\n---\n');
    commit();
    verify();
    const file = path.join(cwd, 'packages/ui/package.json');
    const manifest = JSON.parse(await readFile(file, 'utf8'));
    manifest.version = '1.0.1';
    await writeFile(file, JSON.stringify(manifest));
    commit();
    assert.throws(
      () => verify(),
      (error) => error.stderr.includes('Only the version PR'),
    );
    assert.throws(
      () => verify({ PR_HEAD_REF: 'changeset-release/master' }),
      (error) => error.stderr.includes('Only the version PR'),
    );
    verify({ PR_HEAD_REF: 'changeset-release/master', PR_AUTHOR: 'release[bot]' });
    assert.throws(
      () =>
        verify({
          PR_HEAD_REF: 'changeset-release/master',
          PR_AUTHOR: 'release[bot]',
          PR_HEAD_REPO: 'other/repository',
        }),
      (error) => error.stderr.includes('Only the version PR'),
    );
  } finally {
    await rm(cwd, { recursive: true, force: true });
  }
});
