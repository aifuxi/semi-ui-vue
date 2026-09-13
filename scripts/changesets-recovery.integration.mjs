import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

const sha = 'a'.repeat(40);
const recoveryScript = new URL('./resolve-release-recovery.mjs', import.meta.url).href;

async function resolveRecovery(overrides = {}) {
  const directory = await mkdtemp(path.join(tmpdir(), 'semi-recovery-jobs-'));
  try {
    const output = path.join(directory, 'github-output');
    const fixture = {
      run: {
        head_sha: sha,
        head_branch: 'master',
        path: '.github/workflows/publish.yml',
      },
      jobs: [
        { name: 'Quality and package verification', conclusion: 'success' },
        { name: 'Pack and verify original tarballs', conclusion: 'success' },
      ],
      artifacts: [
        { id: 1, name: 'changeset-pack-original', expired: false },
        { id: 2, name: 'release-evidence', expired: false },
        { id: 3, name: 'changeset-publish-plan-original', expired: false },
      ],
      ...overrides,
    };
    const bootstrap = path.join(directory, 'bootstrap.mjs');
    await writeFile(
      bootstrap,
      `const fixture = ${JSON.stringify(fixture)};
globalThis.fetch = async (input) => {
  const url = new URL(input);
  if (url.origin !== 'https://api.github.com') throw new Error('Unexpected origin');
  const suffix = url.pathname.replace('/repos/local/fixture/', '');
  const data = suffix === 'actions/runs/123' ? fixture.run
    : suffix === 'actions/runs/123/jobs' ? { jobs: fixture.jobs }
    : suffix === 'actions/runs/123/artifacts' ? { artifacts: fixture.artifacts }
    : undefined;
  if (!data) throw new Error('Unexpected recovery lookup: ' + suffix);
  return new Response(JSON.stringify(data), { status: 200 });
};
await import(${JSON.stringify(recoveryScript)});
`,
    );
    const result = spawnSync(process.execPath, [bootstrap], {
      encoding: 'utf8',
      env: {
        ...process.env,
        RECOVERY_RUN_ID: '123',
        CANDIDATE_SHA: sha,
        GITHUB_REPOSITORY: 'local/fixture',
        GITHUB_OUTPUT: output,
        GH_TOKEN: 'local-test-only',
      },
    });
    assert.ifError(result.error);
    return {
      status: result.status,
      stderr: result.stderr,
      output: await readFile(output, 'utf8').catch(() => ''),
    };
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test('发布恢复接受静态与原始 tarball 验证，不依赖浏览器 CI 任务', async () => {
  const result = await resolveRecovery();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.output, 'pack=1\nevidence=2\nplan=3\n');
});

test('发布恢复仍拒绝失败或缺失的静态、tarball 验证', async () => {
  for (const jobs of [
    [
      { name: 'Quality and package verification', conclusion: 'failure' },
      { name: 'Pack and verify original tarballs', conclusion: 'success' },
    ],
    [{ name: 'Quality and package verification', conclusion: 'success' }],
  ]) {
    const result = await resolveRecovery({ jobs });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /has no successful evidence/);
    assert.equal(result.output, '');
  }
});

test('发布恢复仍拒绝候选 SHA 不符与多个可用原始 tarball', async () => {
  const wrongCandidate = await resolveRecovery({
    run: {
      head_sha: 'b'.repeat(40),
      head_branch: 'master',
      path: '.github/workflows/publish.yml',
    },
  });
  assert.notEqual(wrongCandidate.status, 0);
  assert.equal(wrongCandidate.output, '');
  const ambiguous = await resolveRecovery({
    artifacts: [
      { id: 1, name: 'changeset-pack-original', expired: false },
      { id: 4, name: 'changeset-pack-other', expired: false },
    ],
  });
  assert.notEqual(ambiguous.status, 0);
  assert.match(ambiguous.stderr, /Expected one unexpired pack artifact/);
  assert.equal(ambiguous.output, '');
});
