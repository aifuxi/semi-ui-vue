import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = fileURLToPath(new URL('..', import.meta.url));
const cli = path.join(root, 'node_modules/@changesets/cli/bin.js');
const directories = ['theme-default', 'icons', 'icons-lab', 'illustrations', 'ui'];

test('真实 Changesets 从 alpha 进入 next、连续升版和退出，保持五包同版', async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), 'semi-changesets-'));
  const run = (...args) =>
    execFileSync(process.execPath, [cli, ...args], { cwd, encoding: 'utf8' });
  const json = async (file, value) =>
    writeFile(path.join(cwd, file), `${JSON.stringify(value, null, 2)}\n`);
  try {
    await mkdir(path.join(cwd, '.changeset'));
    const config = JSON.parse(await readFile(path.join(root, '.changeset/config.json'), 'utf8'));
    config.changelog[0] = path.join(
      root,
      'node_modules/@changesets/changelog-github/dist/index.mjs',
    );
    await json('.changeset/config.json', config);
    await json('package.json', {
      private: true,
      name: 'migration-probe',
      packageManager: 'pnpm@12.3.4',
    });
    await writeFile(path.join(cwd, 'pnpm-workspace.yaml'), 'packages:\n  - packages/*\n');
    for (const directory of [...directories, 'private']) {
      await mkdir(path.join(cwd, 'packages', directory), { recursive: true });
      const manifest =
        directory === 'private'
          ? { name: '@workspace/probe', version: '0.0.0', private: true }
          : JSON.parse(
              await readFile(path.join(root, 'packages', directory, 'package.json'), 'utf8'),
            );
      delete manifest.scripts;
      delete manifest.devDependencies;
      delete manifest.peerDependencies;
      manifest.dependencies = directory === 'ui' ? { '@aifuxi/semi-icons-vue': 'workspace:*' } : {};
      if (directory !== 'private') manifest.version = '0.1.0-alpha.8';
      await json(`packages/${directory}/package.json`, manifest);
    }
    execFileSync('git', ['init', '-b', 'master'], { cwd });
    execFileSync('git', ['add', '.'], { cwd });
    execFileSync(
      'git',
      [
        '-c',
        'user.name=Probe',
        '-c',
        'user.email=probe@example.invalid',
        'commit',
        '-m',
        'fixture',
      ],
      { cwd },
    );
    const versions = async () =>
      Promise.all(
        directories.map(
          async (dir) =>
            JSON.parse(await readFile(path.join(cwd, 'packages', dir, 'package.json'), 'utf8'))
              .version,
        ),
      );
    const change = async (id, level) =>
      writeFile(
        path.join(cwd, '.changeset', `${id}.md`),
        `---\n"@aifuxi/semi-ui-vue": ${level}\n---\n\nPublic behavior ${id}.\n`,
      );
    execFileSync('pnpm', ['install', '--lockfile-only', '--ignore-scripts'], {
      cwd,
      stdio: 'pipe',
    });
    // 官方算法沿用任意 prerelease 的数字计数；先用原生 patch 清除旧 alpha。
    // 此中间状态仅用于迁移，不是一次发布。
    await change('normalize-alpha', 'patch');
    run('version');
    assert.deepEqual(await versions(), Array(5).fill('0.1.0'));
    run('pre', 'enter', 'next');
    await change('first', 'major');
    run('version');
    assert.deepEqual(await versions(), Array(5).fill('1.0.0-next.0'));
    await change('second', 'patch');
    run('version');
    assert.deepEqual(await versions(), Array(5).fill('1.0.0-next.1'));
    run('pre', 'exit');
    run('version');
    assert.deepEqual(await versions(), Array(5).fill('1.0.0'));
    for (const [level, expected] of [
      ['patch', '1.0.1'],
      ['minor', '1.1.0'],
      ['major', '2.0.0'],
    ]) {
      await change(level, level);
      run('version');
      assert.deepEqual(await versions(), Array(5).fill(expected));
    }
    assert.equal(
      JSON.parse(await readFile(path.join(cwd, 'packages/private/package.json'), 'utf8')).version,
      '0.0.0',
    );
    const snapshot = async () =>
      Promise.all(
        ['pnpm-lock.yaml', ...directories.map((dir) => `packages/${dir}/CHANGELOG.md`)].map(
          (file) => readFile(path.join(cwd, file), 'utf8'),
        ),
      );
    const before = await snapshot();
    assert.throws(
      () => run('version'),
      (error) => error.status === 1 && error.stdout.includes('No unreleased changesets found'),
    );
    execFileSync('pnpm', ['install', '--lockfile-only', '--ignore-scripts'], {
      cwd,
      stdio: 'pipe',
    });
    assert.deepEqual(
      await snapshot(),
      before,
      'No pending intent must not drift changelogs or the lockfile',
    );
  } finally {
    await rm(cwd, { recursive: true, force: true });
  }
});
